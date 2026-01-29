"use client"

/**
 * Header Component - Premium Transparent Design
 * 
 * Features:
 * - Glassmorphism effect with blur
 * - Scroll-aware transparency
 * - GitHub star count from repo
 * - Active link indicators
 * 
 * @author nayandas69
 */

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
]

const GITHUB_REPO = "nayandas69/blogverse"

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [starCount, setStarCount] = useState<number | null>(null)

  // Track scroll position for transparency effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch GitHub star count
  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`)
        if (response.ok) {
          const data = await response.json()
          setStarCount(data.stargazers_count)
        }
      } catch (error) {
        console.error("Failed to fetch star count:", error)
      }
    }
    fetchStarCount()
  }, [])

  // Format star count (e.g., 1234 -> 1.2k)
  const formatStarCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-pink-100/50"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group"
          >
            <span className="font-heading text-xl font-bold bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent transition-opacity hover:opacity-80">
              Nayan Das
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  pathname === link.href
                    ? "text-pink-600 bg-pink-50"
                    : "text-gray-600 hover:text-pink-600 hover:bg-pink-50/50"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-pink-500" />
                )}
              </Link>
            ))}
          </nav>

          {/* GitHub Star Button */}
          <a
            href={`https://github.com/${GITHUB_REPO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-full text-sm font-medium text-white hover:from-gray-800 hover:to-gray-700 transition-all shadow-md hover:shadow-lg"
          >
            <svg
              viewBox="0 0 16 16"
              className="w-4 h-4 text-white"
              fill="currentColor"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            {starCount !== null && (
              <span className="flex items-center gap-1.5 text-white/90 border-l border-white/20 pl-2">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">{formatStarCount(starCount)}</span>
              </span>
            )}
          </a>
        </div>
      </div>
    </header>
  )
}
