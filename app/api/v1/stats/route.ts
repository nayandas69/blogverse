/**
 * GET /api/v1/stats
 * Get blog statistics and analytics
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, getAllTags, getPostBySlug } from '@/lib/blog'
import {
    formatApiResponse,
    formatApiError,
    getCacheHeaders,
    getCORSHeaders,
    calculateReadingTime,
} from '@/lib/api-utils'

export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
    try {
        // Retrieve all posts and tags from the blog system
        const allPosts = getAllPosts()
        const allTags = getAllTags()

        // Initialize statistics tracking variables
        let totalReadingTime = 0
        let avgReadingTime = 0
        const postsByYear: Record<string, number> = {}

        // Iterate through all posts to calculate reading time and year distribution
        allPosts.forEach((post) => {
            const fullPost = getPostBySlug(post.slug)
            if (fullPost) {
                const readingTime = calculateReadingTime(fullPost.content)
                totalReadingTime += readingTime

                // Track post count by publication year for distribution analysis
                const year = new Date(post.frontmatter.date).getFullYear()
                postsByYear[year] = (postsByYear[year] || 0) + 1
            }
        })

        // Calculate average reading time only if there are posts
        if (allPosts.length > 0) {
            avgReadingTime = Math.round(totalReadingTime / allPosts.length)
        }

        // Extract earliest and latest post dates for blog timeline metrics
        let earliestDate = null
        let latestDate = null

        if (allPosts.length > 0) {
            latestDate = allPosts[0].frontmatter.date // Already sorted newest first
            earliestDate = allPosts[allPosts.length - 1].frontmatter.date
        }

        // Calculate tag statistics - count posts per tag and get top 10 most used tags
        const topTags = allTags
            .map((tag) => ({
                name: tag,
                count: allPosts.filter((p) => p.frontmatter.tags?.includes(tag)).length,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)

        // Format comprehensive statistics response
        const response = formatApiResponse({
            blog: {
                totalPosts: allPosts.length,
                totalTags: allTags.length,
                earliestPost: earliestDate,
                latestPost: latestDate,
            },
            reading: {
                totalReadingMinutes: totalReadingTime,
                averageReadingTime: avgReadingTime,
            },
            distribution: {
                postsByYear,
            },
            tags: {
                total: allTags.length,
                topTags,
            },
        })

        return NextResponse.json(response, {
            headers: {
                ...getCORSHeaders(),
                ...getCacheHeaders(7200), // Cache for 2 hours - stats don't change frequently
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        // Log error with context for debugging
        console.error('[API Error] Error fetching stats:', error)
        
        // Return consistent error response format using formatApiError helper
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
