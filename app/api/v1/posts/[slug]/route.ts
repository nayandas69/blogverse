/**
 * GET /api/v1/posts/[slug]
 * Get a specific post by slug with full content, metadata, and reading time
 * 
 * URL Parameters:
 * - slug: The post identifier/slug (required)
 * 
 * Response includes:
 * - Full frontmatter (title, date, description, tags, cover image, etc.)
 * - Raw MDX content for client-side rendering
 * - Calculated reading time estimate
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug, getAllPostSlugs } from '@/lib/blog'
import {
    formatApiResponse,
    formatApiError,
    getCacheHeaders,
    getCORSHeaders,
    calculateReadingTime,
} from '@/lib/api-utils'

export const dynamic = 'force-static'

/**
 * Generate static parameters for all post slugs to enable static generation
 * This runs at build time to create routes for all existing posts
 */
export async function generateStaticParams() {
    const slugs = getAllPostSlugs()
    return slugs.map((slug) => ({ slug }))
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        // Extract the post slug from URL parameters
        const { slug } = await params
        
        // Attempt to retrieve the post using the provided slug
        const post = getPostBySlug(slug)

        // Return 404 error if post doesn't exist
        if (!post) {
            return NextResponse.json(
                formatApiError(404, `Post with slug "${slug}" not found`),
                {
                    status: 404,
                    headers: {
                        ...getCORSHeaders(),
                        'Content-Type': 'application/json',
                    },
                }
            )
        }

        // Calculate estimated reading time based on word count
        const readingTime = calculateReadingTime(post.content)

        // Prepare comprehensive response with full post data
        const response = formatApiResponse(
            {
                slug: post.slug,
                frontmatter: post.frontmatter,
                content: {
                    mdx: post.content, // Raw MDX content for client-side rendering
                    readingTime, // Estimated reading time in minutes
                },
            },
            `Retrieved full post: ${post.frontmatter.title}`
        )

        return NextResponse.json(response, {
            headers: {
                ...getCORSHeaders(),
                ...getCacheHeaders(86400), // Cache for 24 hours - individual posts rarely change
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        // Log error with context for debugging
        console.error('[API Error] Error fetching post:', error)
        
        // Return consistent error response format
        return NextResponse.json(
            formatApiError(500, 'Internal server error', error instanceof Error ? error.message : 'Unknown error'),
            {
                status: 500,
                headers: {
                    ...getCORSHeaders(),
                    'Content-Type': 'application/json',
                },
            }
        )
    }
}

export async function OPTIONS() {
    return NextResponse.json(null, {
        headers: getCORSHeaders(),
    })
}
