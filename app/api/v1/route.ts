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
    // Prepare comprehensive API documentation that serves as both documentation and OpenAPI-like spec
    const apiDocs = formatApiResponse({
        version: '1.0.0',
        name: 'Blogverse API',
        description: 'Modern RESTful API for accessing blog posts from Nayan Das Blog with comprehensive metadata and filtering',
        author: 'nayandas69',
        baseUrl: 'https://blogverse-five-omega.vercel.app/api/v1',
        endpoints: {
            posts: {
                getAllPosts: {
                    method: 'GET',
                    path: '/posts',
                    description: 'Retrieve all blog posts with pagination support - useful for building post listings and archives',
                    query: {
                        page: 'Page number for pagination (default: 1)',
                        limit: 'Number of posts per page (default: 10, max: 100)',
                    },
                    example: '/posts?page=1&limit=10',
                },
                getRecentPosts: {
                    method: 'GET',
                    path: '/posts/recent',
                    description: 'Fetch the most recent blog posts - optimized for homepage and trending sections',
                    query: {
                        limit: 'Number of recent posts to return (default: 5, max: 50)',
                    },
                    example: '/posts/recent?limit=5',
                },
                getPostBySlug: {
                    method: 'GET',
                    path: '/posts/:slug',
                    description: 'Retrieve a specific post with full content, metadata, and reading time estimate',
                    example: '/posts/hello-world',
                },
                getPostsByTag: {
                    method: 'GET',
                    path: '/posts/tag/:tag',
                    description: 'Get all posts associated with a specific tag with pagination - enables category-based browsing',
                    query: {
                        page: 'Page number for pagination (default: 1)',
                        limit: 'Number of posts per page (default: 10, max: 100)',
                    },
                    example: '/posts/tag/react?page=1&limit=10',
                },
            },
            tags: {
                getAllTags: {
                    method: 'GET',
                    path: '/tags',
                    description: 'Retrieve all available tags with optional post count - useful for building tag clouds and navigation',
                    query: {
                        count: 'Include post count for each tag (optional: "true")',
                    },
                    example: '/tags?count=true',
                },
            },
            stats: {
                getStats: {
                    method: 'GET',
                    path: '/stats',
                    description: 'Get comprehensive blog statistics including total posts, reading metrics, distribution by year, and top tags',
                    example: '/stats',
                },
            },
        },
        responseFormat: {
            post: {
                slug: 'string - Post identifier/URL slug',
                frontmatter: {
                    title: 'string - Post title',
                    date: 'string - Publication date (ISO 8601 format)',
                    description: 'string - Short post description for previews',
                    tags: 'string[] - Array of tags associated with the post',
                    cover: 'string (optional) - Cover image URL',
                },
                content: 'object - Contains MDX content and metadata',
                excerpt: 'string - Auto-generated preview text (200 characters)',
                readingTime: 'number - Estimated reading time in minutes',
            },
        },
        features: [
            'Full MDX content with client-side rendering support',
            'Automatic reading time calculation based on word count',
            'Robust pagination with metadata and navigation hints',
            'Tag-based filtering and discovery',
            'Optimized HTTP caching with stale-while-revalidate strategy',
            'Public access (no authentication required)',
            'CORS enabled for safe cross-origin requests',
            'Comprehensive error handling and status codes',
        ],
        usageExamples: {
            'Get 5 most recent posts for homepage': 'GET /posts/recent?limit=5',
            'Read a full blog post by slug': 'GET /posts/hello-world',
            'Browse posts by category/tag': 'GET /posts/tag/react?page=1&limit=10',
            'List all available blog tags': 'GET /tags?count=true',
            'Get blog analytics and metrics': 'GET /stats',
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
