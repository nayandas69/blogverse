/**
 * GET /api/v1/posts
 * Get all blog posts with pagination support
 * 
 * Query parameters:
 * - page: Page number (default: 1)
 * - limit: Posts per page (default: 10, max: 100)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/blog'
import {
    formatApiResponse,
    formatApiError,
    parsePagination,
    getCacheHeaders,
    getCORSHeaders,
    calculateReadingTime,
    getExcerpt,
} from '@/lib/api-utils'
import { getPostBySlug } from '@/lib/blog'

export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
    try {
        // Parse pagination params
        const { searchParams } = new URL(request.url)
        const { page, limit } = parsePagination(
            searchParams.get('page'),
            searchParams.get('limit')
        )

        // Get all posts
        const allPosts = getAllPosts()
        const totalPosts = allPosts.length

        // Calculate pagination
        const totalPages = Math.ceil(totalPosts / limit)
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit

        // Validate page number
        if (page > totalPages && totalPosts > 0) {
            return NextResponse.json(
                formatApiError(400, `Page ${page} does not exist. Total pages: ${totalPages}`),
                {
                    status: 400,
                    headers: {
                        ...getCORSHeaders(),
                        'Content-Type': 'application/json',
                    },
                }
            )
        }

        // Get paginated posts
        const paginatedPosts = allPosts.slice(startIndex, endIndex)

        // Enrich posts with reading time and excerpt
        const enrichedPosts = paginatedPosts.map((post) => {
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
            {
                posts: enrichedPosts,
                pagination: {
                    currentPage: page,
                    pageSize: limit,
                    totalPages,
                    totalPosts,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1,
                },
            },
            `Retrieved ${enrichedPosts.length} posts from page ${page}`
        )

        return NextResponse.json(response, {
            headers: {
                ...getCORSHeaders(),
                ...getCacheHeaders(3600), // Cache for 1 hour
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        console.error('Error fetching posts:', error)
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
