"use client"

/**
 * Blog Content Component (Client)
 * 
 * Client component that handles scroll reveal animations
 * and client-side filtering for the blog listing page.
 * 
 * @author nayandas69
 */

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { BlogCard, BlogCardSkeleton } from "@/components/blog-card"
import { TagList } from "@/components/tag-list"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Sparkles, Filter } from "lucide-react"

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

    // Filter posts client-side based on tag
    const posts = activeTag
        ? allPosts.filter(post => post.frontmatter.tags?.includes(activeTag))
        : allPosts

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

            {/* Tag Filter */}
            {tags.length > 0 && (
                <ScrollReveal variant="up" delay={100}>
                    <section className="mb-8">
                        <TagList tags={tags} />
                    </section>
                </ScrollReveal>
            )}

            {/* Active Tag Indicator */}
            {activeTag && (
                <ScrollReveal variant="up" delay={150}>
                    <div className="mb-6 flex items-center gap-2">
                        <Filter size={16} className="text-pink-500" />
                        <p className="text-gray-600 text-sm">
                            Showing posts tagged with{" "}
                            <span className="font-semibold text-pink-600">{activeTag}</span>
                        </p>
                        <Link
                            href="/blog"
                            className="ml-2 text-sm text-gray-400 hover:text-pink-500 transition-colors"
                        >
                            Clear filter
                        </Link>
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
                        <Sparkles className="mx-auto h-10 w-10 text-pink-300 mb-3" />
                        {activeTag ? (
                            <>
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
