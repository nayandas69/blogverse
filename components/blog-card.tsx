/**
 * Blog Card Component - Compact Version
 * 
 * Displays a single blog post preview with:
 * - Small cover image (optional)
 * - Title
 * - Date
 * - Description (truncated)
 * - Tags
 * 
 * Designed for 3 cards per row layout
 * 
 * @author nayandas69
 */

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ArrowRight, Calendar } from "lucide-react"

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

// Client-safe date formatter
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

interface BlogCardProps {
  post: PostMeta
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const { slug, frontmatter } = post
  const { title, date, description, tags, cover } = frontmatter

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-pink-100 bg-white",
        "transition-all duration-300 hover:border-pink-200 hover:shadow-lg hover:shadow-pink-100/50",
        "hover:-translate-y-1"
      )}
    >
      {/* Cover Image - Smaller aspect ratio */}
      {cover && (
        <Link
          href={`/blog/${slug}`}
          className="relative overflow-hidden aspect-[16/9]"
        >
          <Image
            src={cover || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.slice(0, 2).map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-2 py-0.5 text-xs font-medium bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition-colors"
              >
                {tag}
              </Link>
            ))}
            {tags.length > 2 && (
              <span className="px-2 py-0.5 text-xs text-gray-400">
                +{tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h2 className="font-heading font-bold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2 text-base leading-snug">
          <Link href={`/blog/${slug}`}>
            {title}
          </Link>
        </h2>

        {/* Date */}
        <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
          <Calendar size={12} />
          <time dateTime={date}>
            {formatDate(date)}
          </time>
        </div>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Read more link */}
        <div className="mt-auto pt-3">
          <Link
            href={`/blog/${slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-pink-500 hover:text-pink-600 transition-colors group/link"
          >
            Read article
            <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export function BlogCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-pink-100 bg-white animate-pulse">
      <div className="aspect-[16/9] bg-pink-50" />
      <div className="flex flex-col p-4">
        <div className="flex gap-1.5 mb-2">
          <div className="h-5 w-12 rounded-full bg-pink-50" />
          <div className="h-5 w-10 rounded-full bg-pink-50" />
        </div>
        <div className="h-5 w-3/4 rounded bg-pink-50" />
        <div className="mt-2 h-3 w-20 rounded bg-pink-50" />
        <div className="mt-2 space-y-1.5">
          <div className="h-3 w-full rounded bg-pink-50" />
          <div className="h-3 w-2/3 rounded bg-pink-50" />
        </div>
      </div>
    </div>
  )
}
