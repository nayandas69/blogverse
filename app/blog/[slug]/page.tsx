/**
 * Individual Blog Post Page
 * 
 * Dynamic route that renders a single MDX blog post.
 * Uses generateStaticParams for static generation.
 * 
 * Features:
 * - MDX content rendering
 * - Post metadata (title, date, tags)
 * - Cover image support
 * - Related posts suggestion
 * 
 * @author nayandas69
 */

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllPostSlugs, getPostBySlug, formatDate, getRecentPosts } from "@/lib/blog"
import { MDXContent } from "@/components/mdx-content"
import { BlogCard } from "@/components/blog-card"

// Props type for dynamic route
interface PostPageProps {
  params: Promise<{ slug: string }>
}

/**
 * Generate static params for all blog posts
 * Enables static generation at build time
 */
export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      images: post.frontmatter.cover ? [post.frontmatter.cover] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: post.frontmatter.cover ? [post.frontmatter.cover] : [],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  // Return 404 if post not found
  if (!post) {
    notFound()
  }

  const { frontmatter, content } = post
  const { title, date, description, tags, cover } = frontmatter

  // Get related posts (excluding current post)
  const recentPosts = getRecentPosts(4).filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <article className="container mx-auto px-4 py-12 md:py-16">
      {/* Post Header */}
      <header className="max-w-3xl mx-auto mb-10">
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
          {title}
        </h1>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-muted-foreground">
          <time dateTime={date}>{formatDate(date)}</time>
          <span className="text-border">|</span>
          <span>Nayan Das</span>
        </div>

        {/* Description */}
        {description && (
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </header>

      {/* Cover Image */}
      {cover && (
        <div className="max-w-4xl mx-auto mb-10">
          <Image
            src={cover || "/placeholder.svg"}
            alt={title}
            width={1200}
            height={630}
            className="w-full h-auto rounded-lg"
            priority
          />
        </div>
      )}

      {/* MDX Content */}
      <div className="max-w-3xl mx-auto prose">
        <MDXContent source={content} />
      </div>

      {/* Post Footer */}
      <footer className="max-w-3xl mx-auto mt-16 pt-8 border-t border-border">
        {/* Back to blog link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-primary hover:text-accent transition-colors"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to all posts
        </Link>
      </footer>

      {/* Related Posts */}
      {recentPosts.length > 0 && (
        <section className="mt-16">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-8 text-center">
            More Posts
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {recentPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
