/**
 * Blog Listing Page (Server Component)
 * 
 * Displays all blog posts with:
 * - Tag filtering via query params
 * - 3-column grid layout for post cards
 * - Scroll reveal animations
 * 
 * Data is fetched server-side, then passed to client component for animations.
 * 
 * @author nayandas69
 */

import { Suspense } from "react"
import { getAllPosts, getTopTags } from "@/lib/blog"
import { BlogContent, BlogContentSkeleton } from "@/components/blog-content"

export const metadata = {
  title: "Blog",
  description: "Read my latest thoughts, tutorials, and explorations in code and creativity.",
}

export default function BlogPage() {
  const allPosts = getAllPosts()
  const tags = getTopTags(5)

  return (
    <Suspense fallback={<BlogContentSkeleton />}>
      <BlogContent allPosts={allPosts} tags={tags} />
    </Suspense>
  )
}
