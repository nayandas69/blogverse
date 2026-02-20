/**
 * 404 Not Found Page
 *
 * Custom not found page that matches the blog's pink theme.
 * Shown when a user navigates to a page/blog that doesn't exist.
 *
 * @author nayandas69
 */

import Link from "next/link"
import { ArrowRight, Home, BookOpen, SearchX } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 md:py-32">
      <div className="max-w-xl mx-auto text-center">
        {/* Large 404 display */}
        <div className="relative mb-8">
          <span className="text-[10rem] md:text-[14rem] font-heading font-bold leading-none bg-gradient-to-b from-pink-200 to-pink-100/30 bg-clip-text text-transparent select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/25">
              <SearchX className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">
          Page not found
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-md mx-auto">
          {
            "The page you're looking for doesn't exist or may have been moved. Let's get you back on track."
          }
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-medium shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-0.5 transition-all"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-pink-200 text-pink-600 rounded-xl font-medium hover:bg-pink-50 hover:border-pink-300 transition-all"
          >
            <BookOpen size={18} />
            Browse Blog
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Decorative divider */}
        <div className="mt-16 pt-8 border-t border-pink-100">
          <p className="text-sm text-gray-400">
            {"If you think this is a mistake, feel free to "}
            <a
              href="https://github.com/nayandas69/blogverse/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 underline underline-offset-4 hover:text-pink-600 transition-colors"
            >
              open an issue
            </a>
            {" on GitHub."}
          </p>
        </div>
      </div>
    </div>
  )
}
