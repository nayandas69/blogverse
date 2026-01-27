/**
 * MDX Content Component
 * 
 * Renders MDX content using next-mdx-remote.
 * Applies custom components and styling.
 * 
 * @author nayandas69
 */

import { MDXRemote } from "next-mdx-remote/rsc"
import { mdxComponents } from "@/components/mdx-components"
import remarkGfm from "remark-gfm"

interface MDXContentProps {
  source: string
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          // Remark plugins for parsing
          remarkPlugins: [
            remarkGfm, // GitHub Flavored Markdown (tables, strikethrough, etc.)
          ],
        },
      }}
    />
  )
}
