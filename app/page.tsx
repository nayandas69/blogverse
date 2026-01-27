/**
 * Homepage (Server Component)
 * 
 * Landing page featuring:
 * - Animated intro about Nayan Das
 * - Latest 3 blog posts
 * - Tag cloud for navigation
 * 
 * Data is fetched server-side, then passed to client component for animations.
 * 
 * @author nayandas69
 */

import { Suspense } from "react"
import { getRecentPosts, getAllTags } from "@/lib/blog"
import { HomeContent } from "@/components/home-content"

function HomeLoading() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-pink-100 rounded mb-6" />
        <div className="h-16 w-96 bg-pink-100 rounded mb-4" />
        <div className="h-6 w-80 bg-pink-100 rounded" />
      </div>
    </div>
  )
}

export default function HomePage() {
  const recentPosts = getRecentPosts(3) // Only show 3 latest posts
  const tags = getAllTags()

  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent recentPosts={recentPosts} tags={tags} />
    </Suspense>
  )
}
