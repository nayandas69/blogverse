"use client"

/**
 * Blog Content Component (Client)
 * 
 * Client component that handles scroll reveal animations
 * and client-side filtering for the blog listing page.
 * 
 * @author nayandas69
 */

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { BlogCard, BlogCardSkeleton } from "@/components/blog-card"
import { TagList } from "@/components/tag-list"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Sparkles, Filter, Search, X } from "lucide-react"

// Type definition (duplicated to avoid importing from blog.ts which uses fs)
interface PostFrontmatter {
    title: string
    date: string
    description: string
    tags: string[]
    cover?: string
}

interface PostMeta {
    slug: string
    frontmatter: PostFrontmatter
}

interface BlogContentProps {
    allPosts: PostMeta[]
    tags: string[]
}

export function BlogContent({ allPosts, tags }: BlogContentProps) {
    const searchParams = useSearchParams()
    const activeTag = searchParams.get("tag")
    const [searchQuery, setSearchQuery] = useState("")

    // Filter posts client-side based on tag and search query
    const posts = useMemo(() => {
        let filtered = allPosts

        // Filter by tag
        if (activeTag) {
            filtered = filtered.filter(post => post.frontmatter.tags?.includes(activeTag))
        }

        // Filter by search query (title, description, and tags)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim()
            filtered = filtered.filter(post => {
                const title = post.frontmatter.title.toLowerCase()
                const description = post.frontmatter.description.toLowerCase()
                const tags = post.frontmatter.tags?.join(" ").toLowerCase() || ""
                return title.includes(query) || description.includes(query) || tags.includes(query)
            })
        }

        return filtered
    }, [allPosts, activeTag, searchQuery])

    return (
        <div className="container mx-auto px-4 py-12 md:py-16">
            {/* Page Header */}
            <ScrollReveal variant="up">
                <header className="mb-10">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                        Blog
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl">
                        Thoughts, tutorials, and explorations in code and creativity.
                    </p>
                </header>
            </ScrollReveal>

            {/* Search Bar */}
            <ScrollReveal variant="up" delay={100}>
                <div className="mb-8">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search posts by title, description, or tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all shadow-sm"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </ScrollReveal>

            {/* Tag Filter */}
            {tags.length > 0 && (
                <ScrollReveal variant="up" delay={150}>
                    <section className="mb-8">
                        <TagList tags={tags} />
                    </section>
                </ScrollReveal>
            )}

            {/* Active Filters Indicator */}
            {(activeTag || searchQuery) && (
                <ScrollReveal variant="up" delay={200}>
                    <div className="mb-6 flex flex-wrap items-center gap-2">
                        <Filter size={16} className="text-pink-500" />
                        {activeTag && (
                            <span className="text-gray-600 text-sm">
                                Tag:{" "}
                                <span className="font-semibold text-pink-600">{activeTag}</span>
                            </span>
                        )}
                        {activeTag && searchQuery && (
                            <span className="text-gray-400">+</span>
                        )}
                        {searchQuery && (
                            <span className="text-gray-600 text-sm">
                                Search:{" "}
                                <span className="font-semibold text-pink-600">&quot;{searchQuery}&quot;</span>
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="ml-2 text-sm text-gray-400 hover:text-pink-500 transition-colors"
                        >
                            {activeTag ? (
                                <Link href="/blog">Clear all</Link>
                            ) : (
                                "Clear search"
                            )}
                        </button>
                    </div>
                </ScrollReveal>
            )}

            {/* Posts Grid - 3 columns */}
            {posts.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post, index) => (
                        <ScrollReveal key={post.slug} variant="up" delay={index * 75}>
                            <BlogCard post={post} />
                        </ScrollReveal>
                    ))}
                </div>
            ) : (
                /* Empty state */
                <ScrollReveal variant="scale">
                    <div className="text-center py-12 border-2 border-dashed border-pink-200 rounded-2xl bg-pink-50/30">
                        {searchQuery ? (
                            <>
                                <Search className="mx-auto h-10 w-10 text-pink-300 mb-3" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No results found
                                </h3>
                                <p className="text-gray-500 mb-4 text-sm">
                                    No posts matching &quot;{searchQuery}&quot;{activeTag && ` with tag "${activeTag}"`} were found.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="inline-flex items-center px-4 py-2 bg-pink-100 text-pink-600 rounded-lg font-medium text-sm hover:bg-pink-200 transition-colors"
                                >
                                    Clear search
                                </button>
                            </>
                        ) : activeTag ? (
                            <>
                                <Filter className="mx-auto h-10 w-10 text-pink-300 mb-3" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No posts found
                                </h3>
                                <p className="text-gray-500 mb-4 text-sm">
                                    No posts with the tag &quot;{activeTag}&quot; were found.
                                </p>
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center px-4 py-2 bg-pink-100 text-pink-600 rounded-lg font-medium text-sm hover:bg-pink-200 transition-colors"
                                >
                                    View all posts
                                </Link>
                            </>
                        ) : (
                            <>
                                <Sparkles className="mx-auto h-10 w-10 text-pink-300 mb-3" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No posts yet
                                </h3>
                                <p className="text-gray-500 mb-3 text-sm">
                                    Blog posts will appear here once you add them.
                                </p>
                                <p className="text-xs text-gray-400">
                                    Add MDX files to{" "}
                                    <code className="px-1.5 py-0.5 bg-pink-100 rounded text-pink-600 font-mono text-xs">
                                        content/blog/
                                    </code>{" "}
                                    to get started.
                                </p>
                            </>
                        )}
                    </div>
                </ScrollReveal>
            )}

            {/* Posts count */}
            {posts.length > 0 && (
                <ScrollReveal variant="up" delay={300}>
                    <p className="mt-8 text-sm text-gray-400 text-center">
                        Showing {posts.length} {posts.length === 1 ? "post" : "posts"}
                    </p>
                </ScrollReveal>
            )}
        </div>
    )
}

/**
 * Loading skeleton for blog page
 */
export function BlogContentSkeleton() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="mb-10">
                <div className="h-12 w-32 bg-pink-50 animate-pulse rounded-lg mb-3" />
                <div className="h-5 w-80 bg-pink-50 animate-pulse rounded-lg" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <BlogCardSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}
