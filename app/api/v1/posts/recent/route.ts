/**
 * GET /api/v1/posts/recent
 * Get the most recent blog posts
 * 
 * Query parameters:
 * - limit: Number of recent posts to return (default: 5, max: 50)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getRecentPosts, getPostBySlug } from '@/lib/blog'
import {
    formatApiResponse,
    formatApiError,
    getCacheHeaders,
    getCORSHeaders,
    calculateReadingTime,
    getExcerpt,
} from '@/lib/api-utils'

export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        let limit = 5

        if (searchParams.has('limit')) {
            const parsed = parseInt(searchParams.get('limit') || '5')
            if (!isNaN(parsed) && parsed > 0 && parsed <= 50) {
                limit = parsed
            }
        }

        // Get recent posts
        const recentPosts = getRecentPosts(limit)

        // Enrich with reading time and excerpt
        const enrichedPosts = recentPosts.map((post) => {
            const fullPost = getPostBySlug(post.slug)
            const readingTime = fullPost ? calculateReadingTime(fullPost.content) : 0
            const excerpt = fullPost ? getExcerpt(fullPost.content) : post.frontmatter.description

            return {
                slug: post.slug,
                frontmatter: post.frontmatter,
                excerpt,
                readingTime,
            }
        })

        const response = formatApiResponse(
            enrichedPosts,
            `Retrieved ${enrichedPosts.length} recent posts`
        )

        return NextResponse.json(response, {
            headers: {
                ...getCORSHeaders(),
                ...getCacheHeaders(1800), // Cache for 30 minutes (more frequent updates)
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        console.error('Error fetching recent posts:', error)
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
