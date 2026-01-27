import React from "react"
/**
 * Root Layout - Nayan Das Blog
 * 
 * Main layout component that wraps all pages with:
 * - Custom fonts (Inter, Cal Sans, JetBrains Mono)
 * - Light pink theme (single theme, no dark mode)
 * - Global navigation and footer
 * 
 * @author nayandas69
 */

import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import './globals.css'

// Primary body font - Inter for clean readability
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Monospace font for code blocks
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

// Cal Sans for headings - loaded locally for better performance
const calSans = localFont({
  src: '../public/fonts/CalSans-SemiBold.woff2',
  variable: '--font-cal',
  display: 'swap',
})

// Site metadata for SEO
export const metadata: Metadata = {
  title: {
    default: 'Nayan Das - Blog',
    template: '%s | Nayan Das',
  },
  description: 'Personal blog of Nayan Das - Developer, creator, and tech enthusiast sharing thoughts on code, creativity, and everything in between.',
  keywords: ['blog', 'developer', 'tech', 'programming', 'Nayan Das'],
  authors: [{ name: 'Nayan Das', url: 'https://github.com/nayandas69' }],
  creator: 'Nayan Das',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Nayan Das Blog',
    title: 'Nayan Das - Blog',
    description: 'Personal blog of Nayan Das - Developer, creator, and tech enthusiast.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nayan Das - Blog',
    description: 'Personal blog of Nayan Das - Developer, creator, and tech enthusiast.',
  },
  alternates: {
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
    icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${calSans.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        {/* Site header with navigation */}
        <Header />

        {/* Main content area - pt-16 accounts for fixed header height */}
        <main className="flex-1 pt-16">
          {children}
        </main>

        {/* Site footer with socials and links */}
        <Footer />
      </body>
    </html>
  )
}
