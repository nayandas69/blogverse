/**
 * GET /api/v1/stats
 * Get blog statistics and analytics
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, getAllTags, getPostBySlug } from '@/lib/blog'
import {
    formatApiResponse,
    getCacheHeaders,
    getCORSHeaders,
    calculateReadingTime,
} from '@/lib/api-utils'

export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
    try {
        const allPosts = getAllPosts()
        const allTags = getAllTags()

        // Calculate statistics
        let totalReadingTime = 0
        let avgReadingTime = 0
        const postsByYear: Record<string, number> = {}

        allPosts.forEach((post) => {
            const fullPost = getPostBySlug(post.slug)
            if (fullPost) {
                const readingTime = calculateReadingTime(fullPost.content)
                totalReadingTime += readingTime

                // Count by year
                const year = new Date(post.frontmatter.date).getFullYear()
                postsByYear[year] = (postsByYear[year] || 0) + 1
            }
        })

        if (allPosts.length > 0) {
            avgReadingTime = Math.round(totalReadingTime / allPosts.length)
        }

        // Get earliest and latest post dates
        let earliestDate = null
        let latestDate = null

        if (allPosts.length > 0) {
            latestDate = allPosts[0].frontmatter.date // Already sorted newest first
            earliestDate = allPosts[allPosts.length - 1].frontmatter.date
        }

        // Calculate tag statistics
        const topTags = allTags
            .map((tag) => ({
                name: tag,
                count: allPosts.filter((p) => p.frontmatter.tags?.includes(tag)).length,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)

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
                ...getCacheHeaders(7200), // Cache for 2 hours
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        console.error('Error fetching stats:', error)
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 500,
                    message: 'Internal server error',
                    details: error instanceof Error ? error.message : 'Unknown error',
                },
            },
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
