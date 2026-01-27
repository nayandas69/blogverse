/**
 * RSS Feed Route Handler
 * 
 * Generates an RSS 2.0 feed at /rss.xml
 * Includes all blog posts with their metadata.
 * 
 * @author nayandas69
 */

import { getAllPosts } from "@/lib/blog"

// Site configuration for RSS feed
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blogverse-five-omega.vercel.app"
const SITE_NAME = "Nayan Das Blog"
const SITE_DESCRIPTION = "Personal blog of Nayan Das - Developer, creator, and tech enthusiast."

/**
 * Generate RSS XML for all blog posts
 */
function generateRss(posts: ReturnType<typeof getAllPosts>): string {
  // Build RSS items from posts
  const itemsXml = posts
    .map((post) => {
      const { slug, frontmatter } = post
      const { title, date, description, tags } = frontmatter

      // Format date for RSS (RFC 822)
      const pubDate = new Date(date).toUTCString()

      // Generate categories from tags
      const categoriesXml = tags
        ?.map((tag: string) => `      <category>${escapeXml(tag)}</category>`)
        .join("\n") || ""

      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${SITE_URL}/blog/${slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
${categoriesXml}
    </item>`
    })
    .join("\n")

  // Return complete RSS XML
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-US</language>
    <managingEditor>nayanchandradas@hotmail.com (Nayan Das)</managingEditor>
    <webMaster>nayanchandradas@hotmail.com (Nayan Das)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`
}

/**
 * Escape special XML characters
 * Returns empty string if text is undefined/null
 */
function escapeXml(text: string | undefined | null): string {
  if (!text) return ''
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

/**
 * GET handler for /rss.xml
 */
export async function GET() {
  const posts = getAllPosts()
  const rss = generateRss(posts)

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
