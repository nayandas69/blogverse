/**
 * GET /api/v1/posts/tag/[tag]
 * Get all posts filtered by a specific tag with pagination support
 * 
 * URL Parameters:
 * - tag: The tag name/filter (required, URL encoded)
 * 
 * Query parameters:
 * - page: Page number (default: 1)
 * - limit: Posts per page (default: 10, max: 100)
 * 
 * Response includes:
 * - Array of posts matching the specified tag
 * - Tag name and total post count for the tag
 * - Pagination metadata for navigation
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

/**
 * Generate static parameters for all tags to enable static generation
 * Converts tag names to URL-friendly format (lowercase with hyphens)
 */
export async function generateStaticParams() {
    const tags = getAllTags()
    return tags.map((tag) => ({ tag: tag.toLowerCase().replace(/\s+/g, '-') }))
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ tag: string }> }
) {
    try {
        // Extract and decode the tag parameter from URL
        const { tag: tagParam } = await params
        const decodedTag = decodeURIComponent(tagParam)
        const allTags = getAllTags()

        // Find matching tag with case-insensitive matching and URL-friendly format normalization
        const matchedTag = allTags.find(
            (t) => t.toLowerCase().replace(/\s+/g, '-') === tagParam.toLowerCase()
        ) || decodedTag

        // Retrieve all posts that have the specified tag
        const tagPosts = getPostsByTag(matchedTag)

        // Handle no results - distinguish between tag not existing vs. no posts for existing tag
        if (tagPosts.length === 0) {
            // Check if tag exists but just has no posts
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

        // Parse pagination parameters for splitting results into pages
        const { searchParams } = new URL(request.url)
        const { page, limit } = parsePagination(
            searchParams.get('page'),
            searchParams.get('limit')
        )

        // Calculate pagination boundaries for the tag's posts
        const totalPosts = tagPosts.length
        const totalPages = Math.ceil(totalPosts / limit)
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit

        // Validate requested page is within acceptable range
        if (page > totalPages) {
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

        // Extract the paginated slice of posts for this page
        const paginatedPosts = tagPosts.slice(startIndex, endIndex)

        // Enrich each post with reading time calculation and excerpt generation
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

        // Format comprehensive response with tag and pagination details
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
                ...getCacheHeaders(3600), // Cache for 1 hour - tags update when posts are added
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        // Log error with context for debugging
        console.error('[API Error] Error fetching posts by tag:', error)
        
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
