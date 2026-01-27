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

import { getRecentPosts, getAllTags } from "@/lib/blog"
import { HomeContent } from "@/components/home-content"

export default function HomePage() {
  const recentPosts = getRecentPosts(3) // Only show 3 latest posts
  const tags = getAllTags()

  return <HomeContent recentPosts={recentPosts} tags={tags} />
}
