/**
 * GET /api/v1/tags
 * Get all available tags across all blog posts
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAllTags, getPostsByTag } from '@/lib/blog'
import {
    formatApiResponse,
    formatApiError,
    getCacheHeaders,
    getCORSHeaders,
} from '@/lib/api-utils'

export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
    try {
        // Retrieve all available tags from the blog system
        const tags = getAllTags()

        // Parse optional query parameter to include post counts for each tag
        const { searchParams } = new URL(request.url)
        const includeCount = searchParams.get('count') === 'true'

        // Build tag data with optional post counts
        let tagsData: any[] = tags

        if (includeCount) {
            // When count=true is passed, return each tag with its associated post count
            tagsData = tags.map((tag) => ({
                name: tag,
                count: getPostsByTag(tag).length,
            }))
        }

        // Format and return successful response with consistent structure
        const response = formatApiResponse(
            {
                tags: tagsData,
                total: tags.length,
            },
            `Retrieved ${tags.length} tags`
        )

        return NextResponse.json(response, {
            headers: {
                ...getCORSHeaders(),
                ...getCacheHeaders(7200), // Cache for 2 hours - tags rarely change
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        // Log error for debugging purposes
        console.error('[API Error] Error fetching tags:', error)
        
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
