/**
 * GET /api/v1/tags
 * Get all available tags across all blog posts
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAllTags, getPostsByTag } from '@/lib/blog'
import {
    formatApiResponse,
    getCacheHeaders,
    getCORSHeaders,
} from '@/lib/api-utils'

export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
    try {
        const tags = getAllTags()

        // Optionally include post count for each tag
        const { searchParams } = new URL(request.url)
        const includeCount = searchParams.get('count') === 'true'

        let tagsData: any[] = tags

        if (includeCount) {
            tagsData = tags.map((tag) => ({
                name: tag,
                count: getPostsByTag(tag).length,
            }))
        }

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
                ...getCacheHeaders(7200), // Cache for 2 hours
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        console.error('Error fetching tags:', error)
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
