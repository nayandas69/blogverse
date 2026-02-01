/**
 * Blogverse API v1 - Root Endpoint
 * 
 * GET /api/v1
 * Returns API documentation and available endpoints
 */

import { NextResponse } from 'next/server'
import { getCORSHeaders, getCacheHeaders, formatApiResponse } from '@/lib/api-utils'

export const dynamic = 'force-static'

export async function GET() {
    const apiDocs = formatApiResponse({
        version: '1.0.0',
        name: 'Blogverse API',
        description: 'Modern API for accessing blog posts from Nayan Das Blog',
        author: 'nayandas69',
        baseUrl: 'https://blogverse-five-omega.vercel.app/api/v1',
        endpoints: {
            posts: {
                getAllPosts: {
                    method: 'GET',
                    path: '/posts',
                    description: 'Get all blog posts with pagination',
                    query: {
                        page: 'Page number (default: 1)',
                        limit: 'Posts per page (default: 10, max: 100)',
                    },
                    example: '/posts?page=1&limit=10',
                },
                getRecentPosts: {
                    method: 'GET',
                    path: '/posts/recent',
                    description: 'Get most recent blog posts',
                    query: {
                        limit: 'Number of posts to return (default: 5, max: 50)',
                    },
                    example: '/posts/recent?limit=5',
                },
                getPostBySlug: {
                    method: 'GET',
                    path: '/posts/:slug',
                    description: 'Get a specific post by slug with full content',
                    example: '/posts/hello-world',
                },
                getPostsByTag: {
                    method: 'GET',
                    path: '/posts/tag/:tag',
                    description: 'Get posts filtered by a specific tag',
                    query: {
                        page: 'Page number (default: 1)',
                        limit: 'Posts per page (default: 10, max: 100)',
                    },
                    example: '/posts/tag/react?page=1&limit=10',
                },
            },
            tags: {
                getAllTags: {
                    method: 'GET',
                    path: '/tags',
                    description: 'Get all available tags',
                    example: '/tags',
                },
            },
            stats: {
                getStats: {
                    method: 'GET',
                    path: '/stats',
                    description: 'Get blog statistics',
                    example: '/stats',
                },
            },
        },
        responseFormat: {
            post: {
                slug: 'string - Post identifier',
                frontmatter: {
                    title: 'string - Post title',
                    date: 'string - Publication date (ISO 8601)',
                    description: 'string - Post description',
                    tags: 'string[] - Post tags',
                    cover: 'string (optional) - Cover image URL',
                },
                content: 'string - Raw MDX content',
                html: 'string - Rendered HTML (when requested)',
                excerpt: 'string - Short preview of content',
                readingTime: 'number - Estimated reading time in minutes',
            },
        },
        features: [
            'Full MDX content and rendered HTML',
            'Automatic reading time calculation',
            'Pagination support',
            'Tag-based filtering',
            'HTTP caching with stale-while-revalidate',
            'Public access (no authentication required)',
            'CORS enabled for cross-origin requests',
        ],
        usageExamples: {
            'Get all recent posts (for homepage)': 'GET /posts/recent?limit=5',
            'Get specific post for reading': 'GET /posts/hello-world',
            'Get posts by tag (for category page)': 'GET /posts/tag/react?limit=10',
            'List all available tags': 'GET /tags',
            'Blog statistics': 'GET /stats',
        },
    })

    return NextResponse.json(apiDocs, {
        headers: {
            ...getCORSHeaders(),
            ...getCacheHeaders(),
            'Content-Type': 'application/json',
        },
    })
}

export async function OPTIONS() {
    return NextResponse.json(null, {
        headers: getCORSHeaders(),
    })
}
