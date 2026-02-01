/**
 * GET /api/v1/posts/tag/[tag]
 * Get all posts filtered by a specific tag
 * 
 * Query parameters:
 * - page: Page number (default: 1)
 * - limit: Posts per page (default: 10, max: 100)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPostsByTag, getAllTags, getPostBySlug } from '@/lib/blog'
import {
    formatApiResponse,
    formatApiError,
    parsePagination,
    getCacheHeaders,
    getCORSHeaders,
    calculateReadingTime,
    getExcerpt,
} from '@/lib/api-utils'

export const dynamic = 'force-static'

// Generate static params for all tags
export async function generateStaticParams() {
    const tags = getAllTags()
    return tags.map((tag) => ({ tag: tag.toLowerCase().replace(/\s+/g, '-') }))
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ tag: string }> }
) {
    try {
        const { tag: tagParam } = await params

        // Decode and normalize tag
        const decodedTag = decodeURIComponent(tagParam)
        const allTags = getAllTags()

        // Find matching tag (case-insensitive)
        const matchedTag = allTags.find(
            (t) => t.toLowerCase().replace(/\s+/g, '-') === tagParam.toLowerCase()
        ) || decodedTag

        // Get posts by tag
        const tagPosts = getPostsByTag(matchedTag)

        if (tagPosts.length === 0) {
            // Check if tag exists at all
            const tagExists = allTags.some(
                (t) => t.toLowerCase() === matchedTag.toLowerCase()
            )

            return NextResponse.json(
                formatApiError(
                    404,
                    tagExists
                        ? `No posts found with tag "${matchedTag}"`
                        : `Tag "${matchedTag}" does not exist`
                ),
                {
                    status: 404,
                    headers: {
                        ...getCORSHeaders(),
                        'Content-Type': 'application/json',
                    },
                }
            )
        }

        // Parse pagination
        const { searchParams } = new URL(request.url)
        const { page, limit } = parsePagination(
            searchParams.get('page'),
            searchParams.get('limit')
        )

        // Calculate pagination
        const totalPosts = tagPosts.length
        const totalPages = Math.ceil(totalPosts / limit)
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit

        // Validate page number
        if (page > totalPages && totalPosts > 0) {
            return NextResponse.json(
                formatApiError(400, `Page ${page} does not exist for tag "${matchedTag}". Total pages: ${totalPages}`),
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
        const paginatedPosts = tagPosts.slice(startIndex, endIndex)

        // Enrich posts
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
                tag: matchedTag,
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
            `Retrieved ${enrichedPosts.length} posts with tag "${matchedTag}" from page ${page}`
        )

        return NextResponse.json(response, {
            headers: {
                ...getCORSHeaders(),
                ...getCacheHeaders(3600), // Cache for 1 hour
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        console.error('Error fetching posts by tag:', error)
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
