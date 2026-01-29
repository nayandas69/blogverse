import React from "react"
/**
 * MDX Components
 * 
 * Custom React components for rendering MDX content.
 * Includes styled versions of standard HTML elements plus
 * custom components for embeds, code blocks, and media.
 * 
 * Features syntax highlighting for code blocks.
 * 
 * @author nayandas69
 */

import Image from "next/image"
import Link from "next/link"
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { CodeBlock } from "./code-block"

/**
 * YouTube Embed Component
 */
export function YouTube({ id }: { id: string }) {
  return (
    <div className="relative my-6 aspect-video w-full overflow-hidden rounded-xl shadow-lg">
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  )
}

/**
 * Video Embed Component
 */
export function Video({
  src,
  poster,
  caption
}: {
  src: string
  poster?: string
  caption?: string
}) {
  return (
    <figure className="my-6">
      <video
        src={src}
        poster={poster}
        controls
        className="w-full rounded-xl shadow-lg"
      >
        Your browser does not support the video tag.
      </video>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * Callout/Alert Component
 */
export function Callout({
  children,
  type = "info"
}: {
  children: React.ReactNode
  type?: "info" | "warning" | "error" | "success"
}) {
  const styles = {
    info: "bg-pink-50 border-pink-500 text-pink-900",
    warning: "bg-yellow-50 border-yellow-500 text-yellow-900",
    error: "bg-red-50 border-red-500 text-red-900",
    success: "bg-green-50 border-green-500 text-green-900",
  }

  return (
    <div className={cn("my-6 rounded-xl border-l-4 p-4", styles[type])}>
      {children}
    </div>
  )
}

/**
 * Image with Caption Component
 */
export function ImageWithCaption({
  src,
  alt,
  caption,
  width = 800,
  height = 450,
}: {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}) {
  return (
    <figure className="my-6">
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className="rounded-xl w-full h-auto shadow-lg"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * Custom Link Component
 */
function CustomLink({ href, children, ...props }: ComponentProps<"a">) {
  const isExternal = href?.startsWith("http")

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-pink-500 underline underline-offset-4 hover:text-pink-600 transition-colors"
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <Link
      href={href || "#"}
      className="text-pink-500 underline underline-offset-4 hover:text-pink-600 transition-colors"
      {...props}
    >
      {children}
    </Link>
  )
}

/**
 * MDX Components Map
 */
export const mdxComponents = {
  YouTube,
  Video,
  Callout,
  ImageWithCaption,

  a: CustomLink,

  h1: ({ children, ...props }: ComponentProps<"h1">) => (
    <h1 className="font-heading text-3xl font-bold mt-8 mb-4 text-gray-900" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: ComponentProps<"h2">) => (
    <h2 className="font-heading text-2xl font-bold mt-8 mb-3 text-gray-900" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentProps<"h3">) => (
    <h3 className="font-heading text-xl font-semibold mt-6 mb-2 text-gray-900" {...props}>
      {children}
    </h3>
  ),

  p: ({ children, ...props }: ComponentProps<"p">) => (
    <p className="mb-4 leading-relaxed text-gray-700" {...props}>
      {children}
    </p>
  ),

  ul: ({ children, ...props }: ComponentProps<"ul">) => (
    <ul className="my-4 ml-6 list-disc text-gray-700" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentProps<"ol">) => (
    <ol className="my-4 ml-6 list-decimal text-gray-700" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ComponentProps<"li">) => (
    <li className="mb-2" {...props}>
      {children}
    </li>
  ),

  blockquote: ({ children, ...props }: ComponentProps<"blockquote">) => (
    <blockquote
      className="border-l-4 border-pink-500 pl-4 italic my-4 text-gray-600 bg-pink-50/50 py-2 rounded-r-lg"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Code block with syntax highlighting
  pre: CodeBlock,

  // Inline code
  code: ({ children, ...props }: ComponentProps<"code">) => (
    <code className="bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
      {children}
    </code>
  ),

  hr: (props: ComponentProps<"hr">) => (
    <hr className="my-8 border-pink-200" {...props} />
  ),

  img: ({ src, alt }: ComponentProps<"img">) => (
    <Image
      src={typeof src === 'string' ? src : "/placeholder.svg?height=450&width=800"}
      alt={alt || "Blog image"}
      width={800}
      height={450}
      className="rounded-xl my-6 w-full h-auto shadow-lg"
    />
  ),

  table: ({ children, ...props }: ComponentProps<"table">) => (
    <div className="my-6 w-full overflow-x-auto rounded-xl border border-pink-200">
      <table className="w-full border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: ComponentProps<"th">) => (
    <th className="bg-pink-50 text-left p-3 font-semibold border-b border-pink-200 text-gray-900" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: ComponentProps<"td">) => (
    <td className="p-3 border-b border-pink-100 text-gray-700" {...props}>
      {children}
    </td>
  ),
}
