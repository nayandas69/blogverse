/**
 * API Test & Demo Page
 * 
 * Visit /api-test to test all Blogverse API v1 endpoints in real-time
 * This page provides an interactive console for testing and exploring all available API capabilities
 * Useful for debugging, development, and API documentation
 */

'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface ApiTestResult {
    endpoint: string
    status: 'loading' | 'success' | 'error'
    data?: any
    error?: string
    responseTime?: number
    statusCode?: number
}

export default function ApiTestPage() {
    const [results, setResults] = useState<Record<string, ApiTestResult>>({})
    const [testing, setTesting] = useState(false)
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
    const [expandedResponse, setExpandedResponse] = useState<string | null>(null)

    const endpoints = [
        {
            id: 'api-root',
            name: 'API Root Documentation',
            url: '/api/v1',
            description: 'Get API documentation and discover all available endpoints',
        },
        {
            id: 'recent-posts',
            name: 'Get Recent Posts',
            url: '/api/v1/posts/recent?limit=5',
            description: 'Fetch 5 most recent blog posts with preview excerpts',
        },
        {
            id: 'all-posts',
            name: 'Get All Posts (Paginated)',
            url: '/api/v1/posts?page=1&limit=10',
            description: 'Fetch all posts with pagination - modify page and limit parameters',
        },
        {
            id: 'all-tags',
            name: 'Get All Tags',
            url: '/api/v1/tags?count=true',
            description: 'Fetch all available tags with post count for each tag',
        },
        {
            id: 'blog-stats',
            name: 'Get Blog Statistics',
            url: '/api/v1/stats',
            description: 'Fetch comprehensive blog analytics and metrics',
        },
    ]

    /**
     * Test a single API endpoint and capture performance metrics
     * Returns comprehensive test result including status code and response time
     */
    async function testEndpoint(endpoint: {
        id: string
        name: string
        url: string
        description: string
    }) {
        const startTime = performance.now()

        try {
            // Fetch the endpoint with proper error handling for network issues
            const response = await fetch(endpoint.url)
            const data = await response.json()
            const responseTime = Math.round(performance.now() - startTime)

            return {
                endpoint: endpoint.name,
                status: 'success' as const,
                data,
                responseTime,
                statusCode: response.status,
            }
        } catch (error) {
            const responseTime = Math.round(performance.now() - startTime)
            return {
                endpoint: endpoint.name,
                status: 'error' as const,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                responseTime,
                statusCode: 0,
            }
        }
    }

    /**
     * Test a single endpoint and update results state
     * Allows users to test individual endpoints without testing all
     */
    async function testSingleEndpoint(endpoint: {
        id: string
        name: string
        url: string
        description: string
    }) {
        // Set loading state for this specific endpoint
        setResults((prev) => ({
            ...prev,
            [endpoint.id]: {
                endpoint: endpoint.name,
                status: 'loading',
            },
        }))

        const result = await testEndpoint(endpoint)
        setResults((prev) => ({
            ...prev,
            [endpoint.id]: result,
        }))
    }

    /**
     * Run tests for all endpoints in parallel
     * Updates UI with real-time loading states
     */
    async function runAllTests() {
        setTesting(true)
        
        // Initialize all endpoints with loading state
        const initialResults: Record<string, ApiTestResult> = {}
        endpoints.forEach((endpoint) => {
            initialResults[endpoint.id] = {
                endpoint: endpoint.name,
                status: 'loading',
            }
        })
        setResults(initialResults)

        // Test all endpoints in parallel for faster completion
        const testPromises = endpoints.map((endpoint) => testEndpoint(endpoint))
        const testResults = await Promise.all(testPromises)

        // Map results back to endpoint IDs for easy lookup
        const resultMap: Record<string, ApiTestResult> = {}
        testResults.forEach((result, index) => {
            resultMap[endpoints[index].id] = result
        })

        setResults(resultMap)
        setTesting(false)
    }

    /**
     * Copy text to clipboard with visual feedback
     * Temporarily shows "Copied" message then reverts
     */
    async function copyToClipboard(text: string, id: string) {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedUrl(id)
            setTimeout(() => setCopiedUrl(null), 2000)
        } catch (err) {
            console.error('Failed to copy to clipboard:', err)
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-pink-50 to-white py-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">API Test Console</h1>
                    <p className="text-gray-600">
                        Test all Blogverse API v1 endpoints in real-time and explore API capabilities
                    </p>
                </div>

                {/* Test Button Controls */}
                <div className="mb-8 flex gap-3">
                    <button
                        onClick={runAllTests}
                        disabled={testing}
                        className="px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 disabled:bg-gray-400 transition-colors"
                        title="Test all endpoints simultaneously"
                    >
                        {testing ? 'Testing All Endpoints...' : 'Run All Tests'}
                    </button>
                    <button
                        onClick={() => setResults({})}
                        disabled={testing}
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 disabled:bg-gray-100 transition-colors"
                        title="Clear all test results"
                    >
                        Clear Results
                    </button>
                </div>

                {/* Endpoints List */}
                <div className="space-y-4">
                    {endpoints.map((endpoint) => {
                        const result = results[endpoint.id]
                        const hasResult = result !== undefined

                        return (
                            <div
                                key={endpoint.id}
                                className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow"
                            >
                                {/* Endpoint Header Information */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">{endpoint.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{endpoint.description}</p>
                                        
                                        {/* Endpoint URL with Copy Button */}
                                        <div className="flex items-center gap-2 mt-3">
                                            <code className="flex-1 px-3 py-2 bg-gray-100 text-gray-800 rounded text-sm font-mono break-all">
                                                GET {endpoint.url}
                                            </code>
                                            <button
                                                onClick={() => copyToClipboard(endpoint.url, endpoint.id)}
                                                className="p-2 hover:bg-gray-200 rounded transition-colors"
                                                title="Copy endpoint URL to clipboard"
                                                aria-label="Copy URL"
                                            >
                                                {copiedUrl === endpoint.id ? (
                                                    <Check className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <Copy className="w-5 h-5 text-gray-600" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Test Button for Individual Endpoint */}
                                    <div className="ml-4 flex flex-col gap-2">
                                        <button
                                            onClick={() => testSingleEndpoint(endpoint)}
                                            disabled={testing}
                                            className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors whitespace-nowrap"
                                            title="Test this endpoint individually"
                                        >
                                            Test
                                        </button>

                                        {/* Status Badge */}
                                        {hasResult && (
                                            <div>
                                                {result.status === 'loading' && (
                                                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                                        Loading...
                                                    </span>
                                                )}
                                                {result.status === 'success' && (
                                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                        Success ({result.responseTime}ms)
                                                    </span>
                                                )}
                                                {result.status === 'error' && (
                                                    <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                                        Error ({result.responseTime}ms)
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Response Display */}
                                {hasResult && (
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-gray-700">
                                                {result.status === 'success' ? 'Response Data' : 'Error Details'}
                                            </h4>
                                            {result.status === 'success' && (
                                                <button
                                                    onClick={() =>
                                                        setExpandedResponse(
                                                            expandedResponse === endpoint.id ? null : endpoint.id
                                                        )
                                                    }
                                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    {expandedResponse === endpoint.id ? 'Collapse' : 'Expand'}
                                                </button>
                                            )}
                                        </div>

                                        {result.status === 'success' ? (
                                            <pre
                                                className={`bg-gray-900 text-green-400 p-4 rounded overflow-auto text-xs font-mono ${
                                                    expandedResponse === endpoint.id ? 'max-h-none' : 'max-h-64'
                                                } transition-all`}
                                            >
                                                {JSON.stringify(result.data, null, 2)}
                                            </pre>
                                        ) : (
                                            <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800">
                                                <p className="font-semibold mb-2">Error occurred:</p>
                                                <p className="text-sm">{result.error}</p>
                                                {result.statusCode !== undefined && result.statusCode > 0 && (
                                                    <p className="text-sm mt-2">Status Code: {result.statusCode}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* API Information Section */}
                <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-blue-900 mb-3">About Blogverse API v1</h2>
                    <ul className="text-blue-800 space-y-2">
                        <li>Full MDX content with client-side rendering support</li>
                        <li>Automatic reading time calculation for all posts</li>
                        <li>Smart HTTP caching with stale-while-revalidate strategy</li>
                        <li>CORS enabled for safe cross-origin requests</li>
                        <li>Public access with no authentication required</li>
                        <li>Pagination support for efficient data loading</li>
                    </ul>
                    <p className="mt-4 text-blue-800 text-sm">
                        View the{' '}
                        <code className="bg-blue-200 px-2 py-1 rounded">
                            /api/v1
                        </code>{' '}
                        endpoint above for complete API documentation
                    </p>
                </div>
            </div>
        </main>
    )
}
