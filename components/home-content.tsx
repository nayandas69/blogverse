"use client"

/**
 * Home Content Component (Client)
 * 
 * Client component that handles scroll reveal animations
 * for the homepage content.
 * 
 * @author nayandas69
 */

import Link from "next/link"
import { BlogCard } from "@/components/blog-card"
import { TagList } from "@/components/tag-list"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ArrowRight, Sparkles } from "lucide-react"

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

interface HomeContentProps {
    recentPosts: PostMeta[]
    tags: string[]
}

export function HomeContent({ recentPosts, tags }: HomeContentProps) {
    return (
        <div className="container mx-auto px-4 py-12 md:py-16">
            {/* Hero Section */}
            <ScrollReveal variant="up">
                <section className="mb-16">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-sm font-medium mb-6">
                            <Sparkles size={14} />
                            Welcome to my blog
                        </div>
                        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Hey, I{"'"}m{" "}
                            <span className="bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent">
                                Nayan Das
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                            Developer, creator, and tech enthusiast. I write about code, creativity, and everything in between.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-medium shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-0.5 transition-all"
                            >
                                Read the blog
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                href="/about"
                                className="inline-flex items-center px-6 py-3 border-2 border-pink-200 text-pink-600 rounded-xl font-medium hover:bg-pink-50 hover:border-pink-300 transition-all"
                            >
                                About me
                            </Link>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Tags Section */}
            {tags.length > 0 && (
                <ScrollReveal variant="up" delay={100}>
                    <section className="mb-12">
                        <h2 className="font-heading text-xl font-semibold text-gray-900 mb-4">
                            Browse by topic
                        </h2>
                        <TagList tags={tags} />
                    </section>
                </ScrollReveal>
            )}

            {/* Latest Posts Section - Only 3 posts */}
            <ScrollReveal variant="up" delay={200}>
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900">
                            Latest Posts
                        </h2>
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-pink-500 hover:text-pink-600 transition-colors group"
                        >
                            View all posts
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </div>

                    {recentPosts.length > 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {recentPosts.map((post, index) => (
                                <ScrollReveal key={post.slug} variant="up" delay={index * 100}>
                                    <BlogCard post={post} />
                                </ScrollReveal>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed border-pink-200 rounded-2xl bg-pink-50/30">
                            <Sparkles className="mx-auto h-10 w-10 text-pink-300 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No posts yet
                            </h3>
                            <p className="text-gray-500 mb-3 text-sm">
                                Blog posts will appear here once you add them.
                            </p>
                            <p className="text-xs text-gray-400">
                                Create your first post in{" "}
                                <code className="px-1.5 py-0.5 bg-pink-100 rounded text-pink-600 font-mono text-xs">
                                    content/blog/
                                </code>
                            </p>
                        </div>
                    )}
                </section>
            </ScrollReveal>
        </div>
    )
}
