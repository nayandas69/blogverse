/**
 * Tag List Component
 * 
 * Displays a list of tags for filtering blog posts.
 * 
 * @author nayandas69
 */

"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

interface TagListProps {
  tags: string[]
  className?: string
}

export function TagList({ tags, className }: TagListProps) {
  const searchParams = useSearchParams()
  const activeTag = searchParams.get("tag")

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Link
        href="/blog"
        className={cn(
          "px-3 py-1.5 text-sm font-medium rounded-full border transition-colors",
          !activeTag
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-transparent text-muted-foreground border-border hover:border-primary hover:text-primary"
        )}
      >
        All
      </Link>

      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blog?tag=${encodeURIComponent(tag)}`}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-full border transition-colors",
            activeTag === tag
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-transparent text-muted-foreground border-border hover:border-primary hover:text-primary"
          )}
        >
          {tag}
        </Link>
      ))}
    </div>
  )
}
