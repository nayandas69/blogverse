/**
 * GET /api/v1/posts/[slug]
 * Get a specific post by slug with full content
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

// Generate static params for all post slugs
export async function generateStaticParams() {
    const slugs = getAllPostSlugs()
    return slugs.map((slug) => ({ slug }))
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params
        const post = getPostBySlug(slug)

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

        // Calculate reading time
        const readingTime = calculateReadingTime(post.content)

        // Prepare response with all requested formats
        const response = formatApiResponse(
            {
                slug: post.slug,
                frontmatter: post.frontmatter,
                content: {
                    mdx: post.content, // Raw MDX for client-side rendering
                    readingTime,
                },
            },
            `Retrieved full post: ${post.frontmatter.title}`
        )

        return NextResponse.json(response, {
            headers: {
                ...getCORSHeaders(),
                ...getCacheHeaders(86400), // Cache for 24 hours (individual posts change rarely)
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        console.error('Error fetching post:', error)
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
