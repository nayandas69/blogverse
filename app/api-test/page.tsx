/**
 * API Test & Demo Page
 * 
 * Visit /api-test to test all API endpoints in real-time
 * This page demonstrates all API capabilities
 */

'use client'

import { useEffect, useState } from 'react'

interface ApiTestResult {
    endpoint: string
    status: 'loading' | 'success' | 'error'
    data?: any
    error?: string
    responseTime?: number
}

export default function ApiTestPage() {
    const [results, setResults] = useState<ApiTestResult[]>([])
    const [testing, setTesting] = useState(false)

    const endpoints = [
        {
            name: 'API Root Documentation',
            url: '/api/v1',
            description: 'Get API documentation and available endpoints',
        },
        {
            name: 'Get Recent Posts',
            url: '/api/v1/posts/recent?limit=5',
            description: 'Fetch 5 most recent blog posts',
        },
        {
            name: 'Get All Posts',
            url: '/api/v1/posts?page=1&limit=10',
            description: 'Fetch all posts with pagination',
        },
        {
            name: 'Get All Tags',
            url: '/api/v1/tags?count=true',
            description: 'Fetch all available tags with post counts',
        },
        {
            name: 'Get Blog Statistics',
            url: '/api/v1/stats',
            description: 'Fetch blog statistics and analytics',
        },
    ]

    async function testEndpoint(endpoint: {
        name: string
        url: string
        description: string
    }) {
        const startTime = performance.now()

        try {
            const response = await fetch(endpoint.url)
            const data = await response.json()
            const responseTime = Math.round(performance.now() - startTime)

            return {
                endpoint: endpoint.name,
                status: 'success' as const,
                data,
                responseTime,
            }
        } catch (error) {
            const responseTime = Math.round(performance.now() - startTime)
            return {
                endpoint: endpoint.name,
                status: 'error' as const,
                error: error instanceof Error ? error.message : 'Unknown error',
                responseTime,
            }
        }
    }

    async function runAllTests() {
        setTesting(true)
        setResults(
            endpoints.map((endpoint) => ({
                endpoint: endpoint.name,
                status: 'loading' as const,
            }))
        )

        const testResults = await Promise.all(endpoints.map((endpoint) => testEndpoint(endpoint)))
        setResults(testResults)
        setTesting(false)
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-pink-50 to-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">API Test Console</h1>
                    <p className="text-gray-600">
                        Test all Blogverse API v1 endpoints in real-time
                    </p>
                </div>

                {/* Test Button */}
                <div className="mb-8">
                    <button
                        onClick={runAllTests}
                        disabled={testing}
                        className="px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 disabled:bg-gray-400 transition-colors"
                    >
                        {testing ? 'Testing...' : 'Run All Tests'}
                    </button>
                </div>

                {/* Endpoints */}
                <div className="space-y-4">
                    {endpoints.map((endpoint, index) => {
                        const result = results[index]

                        return (
                            <div
                                key={endpoint.url}
                                className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-lg transition-shadow"
                            >
                                {/* Endpoint Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{endpoint.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{endpoint.description}</p>
                                        <code className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">
                                            GET {endpoint.url}
                                        </code>
                                    </div>

                                    {/* Status Badge */}
                                    {result && (
                                        <div>
                                            {result.status === 'loading' && (
                                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                                    Loading...
                                                </span>
                                            )}
                                            {result.status === 'success' && (
                                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                    ✓ Success ({result.responseTime}ms)
                                                </span>
                                            )}
                                            {result.status === 'error' && (
                                                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                                    ✗ Error
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Response */}
                                {result && (
                                    <div className="mt-6">
                                        <h4 className="font-semibold text-gray-700 mb-3">Response:</h4>

                                        {result.status === 'success' ? (
                                            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto text-xs font-mono max-h-64">
                                                {JSON.stringify(result.data, null, 2)}
                                            </pre>
                                        ) : (
                                            <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800">
                                                <p className="font-semibold">Error:</p>
                                                <p>{result.error}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Info Section */}
                <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-blue-900 mb-3">About Blogverse API v1</h2>
                    <ul className="text-blue-800 space-y-2">
                        <li>✓ Full MDX content and automatic HTML rendering</li>
                        <li>✓ Automatic reading time calculation</li>
                        <li>✓ Smart HTTP caching with stale-while-revalidate</li>
                        <li>✓ CORS enabled for cross-origin requests</li>
                        <li>✓ Public access - no authentication required</li>
                        <li>✓ Pagination support for efficient data loading</li>
                    </ul>
                    <p className="mt-4 text-blue-800">
                        📚 See{' '}
                        <code className="bg-blue-200 px-2 py-1 rounded">api/README.md</code> for full
                        documentation
                    </p>
                </div>
            </div>
        </main>
    )
}
