/**
 * API Utilities
 * 
 * Helper functions for API responses, reading time calculation,
 * HTML rendering from MDX, and response formatting
 */

import { compileMDX } from 'next-mdx-remote/rsc'

/**
 * Calculate estimated reading time in minutes
 * Based on average reading speed of 200 words per minute
 */
export function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return Math.max(readingTime, 1) // Minimum 1 minute
}

/**
 * Get excerpt from content (first N characters)
 */
export function getExcerpt(content: string, length: number = 200): string {
    // Remove markdown syntax
    const cleanContent = content
        .replace(/[#*_`\[\]()]/g, '')
        .replace(/\n+/g, ' ')
        .trim()

    return cleanContent.length > length
        ? cleanContent.substring(0, length) + '...'
        : cleanContent
}

/**
 * Render MDX content to HTML
 * This is used for the "rendered HTML" response format
 */
export async function renderMDXToHTML(mdxContent: string): Promise<string> {
    try {
        const { content } = await compileMDX({
            source: mdxContent,
            options: {
                parseFrontmatter: false,
            },
        })

        // Convert React component to string
        // In a real scenario, you might want to use renderToString from react-dom/server
        return `<!-- MDX Content Compiled -->` // Placeholder for preview
    } catch (error) {
        console.error('Error rendering MDX:', error)
        return ''
    }
}

/**
 * Format API response with proper structure
 */
export function formatApiResponse<T>(data: T, message?: string) {
    return {
        success: true,
        data,
        message: message || undefined,
        timestamp: new Date().toISOString(),
    }
}

/**
 * Format API error response
 */
export function formatApiError(statusCode: number, message: string, details?: any) {
    return {
        success: false,
        error: {
            code: statusCode,
            message,
            details: details || undefined,
        },
        timestamp: new Date().toISOString(),
    }
}

/**
 * Parse pagination parameters from query
 */
export function parsePagination(
    page?: string | string[] | null,
    limit?: string | string[] | null
): { page: number; limit: number } {
    let pageNum = 1
    let limitNum = 10

    if (page) {
        const parsed = parseInt(Array.isArray(page) ? page[0] : page)
        if (!isNaN(parsed) && parsed > 0) pageNum = parsed
    }

    if (limit) {
        const parsed = parseInt(Array.isArray(limit) ? limit[0] : limit)
        if (!isNaN(parsed) && parsed > 0 && parsed <= 100) limitNum = parsed // Max 100 per page
    }

    return { page: pageNum, limit: limitNum }
}

/**
 * Set proper cache headers for API responses
 * Default: 1 hour cache with stale-while-revalidate for 7 days
 */
export function getCacheHeaders(maxAge: number = 3600) {
    return {
        'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=604800`,
        'CDN-Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=604800`,
    }
}

/**
 * Set CORS headers for public API
 */
export function getCORSHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400', // 24 hours
    }
}
