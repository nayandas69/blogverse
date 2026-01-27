/**
 * Blog Utilities
 * 
 * Core functions for reading and parsing MDX blog posts from the filesystem.
 * Handles frontmatter extraction, sorting, and filtering.
 * 
 * Blog posts are stored in /content/blog/ directory as .mdx files
 * 
 * Frontmatter format:
 * ---
 * title: "Post Title"
 * date: "2***-**-**"
 * description: "Short description"
 * tags: ["tag1", "tag2"]
 * cover: "/images/cover.jpg" (optional)
 * ---
 * 
 * @author nayandas69
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Type definition for blog post frontmatter
export interface PostFrontmatter {
  title: string
  date: string
  description: string
  tags: string[]
  cover?: string
}

// Type definition for a complete blog post
export interface Post {
  slug: string
  frontmatter: PostFrontmatter
  content: string
}

// Type definition for post metadata (without content)
export interface PostMeta {
  slug: string
  frontmatter: PostFrontmatter
}

// Directory where blog posts are stored
const POSTS_DIRECTORY = path.join(process.cwd(), 'content/blog')

/**
 * Get all blog post slugs for static generation
 * Used by generateStaticParams in blog post pages
 */
export function getAllPostSlugs(): string[] {
  // Check if directory exists, return empty if not
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    return []
  }

  const files = fs.readdirSync(POSTS_DIRECTORY)

  // Filter for .mdx files and extract slugs
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

/**
 * Get a single post by its slug
 * Returns full post data including content
 */
export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIRECTORY, `${slug}.mdx`)

  // Return null if file doesn't exist
  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')

  // Parse frontmatter and content using gray-matter
  const { data, content } = matter(fileContents)

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content,
  }
}

/**
 * Get all posts with metadata (for listing pages)
 * Sorted by date in descending order (newest first)
 */
export function getAllPosts(): PostMeta[] {
  const slugs = getAllPostSlugs()

  const posts = slugs
    .map((slug) => {
      const post = getPostBySlug(slug)
      if (!post) return null

      return {
        slug: post.slug,
        frontmatter: post.frontmatter,
      }
    })
    .filter((post): post is PostMeta => post !== null)
    // Sort by date descending
    .sort((a, b) => {
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    })

  return posts
}

/**
 * Get all unique tags from all posts
 * Useful for tag filtering and navigation
 */
export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tagsSet = new Set<string>()

  posts.forEach((post) => {
    post.frontmatter.tags?.forEach((tag: string) => {
      tagsSet.add(tag)
    })
  })

  return Array.from(tagsSet).sort()
}

/**
 * Get posts filtered by a specific tag
 */
export function getPostsByTag(tag: string): PostMeta[] {
  const posts = getAllPosts()

  return posts.filter((post) =>
    post.frontmatter.tags?.includes(tag)
  )
}

/**
 * Get recent posts (for homepage)
 * @param count - Number of posts to return (default: 5)
 */
export function getRecentPosts(count: number = 5): PostMeta[] {
  const posts = getAllPosts()
  return posts.slice(0, count)
}

/**
 * Format date for display
 * Converts ISO date string to readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
