/**
 * GET /api/v1/posts/recent
 * Get the most recent blog posts sorted by publication date (newest first)
 * 
 * Query parameters:
 * - limit: Number of recent posts to return (default: 5, max: 50)
 * 
 * Response includes:
 * - Array of recent posts with metadata
 * - Post title, date, description, tags
 * - Preview excerpt and reading time for each post
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
        // Parse limit parameter with validation - ensure it's within acceptable bounds
        const { searchParams } = new URL(request.url)
        let limit = 5

        if (searchParams.has('limit')) {
            const parsed = parseInt(searchParams.get('limit') || '5')
            // Validate: must be a number, greater than 0, and not exceed max of 50
            if (!isNaN(parsed) && parsed > 0 && parsed <= 50) {
                limit = parsed
            }
        }

        // Retrieve the specified number of most recent posts from the blog system
        const recentPosts = getRecentPosts(limit)

        // Enrich each post with calculated reading time and generated excerpt for preview
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

        // Format response with successful data
        const response = formatApiResponse(
            enrichedPosts,
            `Retrieved ${enrichedPosts.length} recent posts`
        )

        return NextResponse.json(response, {
            headers: {
                ...getCORSHeaders(),
                ...getCacheHeaders(1800), // Cache for 30 minutes - more frequent updates than posts listing
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        // Log error with context for debugging
        console.error('[API Error] Error fetching recent posts:', error)
        
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
