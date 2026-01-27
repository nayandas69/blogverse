"use client"

/**
 * About Page
 * 
 * Personal introduction page for Nayan Das with:
 * - Bio and background
 * - Social links
 * - Contact information
 * - Scroll reveal animations
 * 
 * @author nayandas69
 */

import Link from "next/link"
import { Github, MessageCircle, Mail, Code2, Sparkles, ArrowRight } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20 md:py-24">
      <article className="max-w-2xl mx-auto">
        {/* Page Header */}
        <ScrollReveal variant="up">
          <header className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-sm font-medium mb-6">
              <Code2 size={14} />
              About me
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About Me
            </h1>
            <p className="text-lg text-gray-600">
              Developer, creator, and perpetual learner.
            </p>
          </header>
        </ScrollReveal>

        {/* Main Content */}
        <ScrollReveal variant="up" delay={100}>
          <div className="prose mb-12">
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              Hey there! I{"'"}m <strong className="text-gray-900">Nayan Das</strong>, a passionate developer who loves
              building things on the web. I enjoy exploring new technologies, writing clean code,
              and sharing what I learn along the way.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              This blog is my digital garden where I document my journey through code,
              share tutorials, and write about topics that interest me. Whether it{"'"}s web
              development, programming tips, or creative projects, you{"'"}ll find it all here.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="up" delay={200}>
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">
              What I Do
            </h2>

            <ul className="space-y-3">
              {[
                "Reading books and watching anime",
                "Open source and new technologies",
                "Build web applications and tools",
                "Write about development and tech",
                "Team leadership and collaboration",
                "Contribute to open source projects",
                "Learn and experiment with new technologies",
                "Backend development and game server architecture"
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-pink-50/50 border border-pink-100"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="up" delay={300}>
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">
              Connect With Me
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              I{"'"}d love to hear from you! Whether you have a question, want to collaborate,
              or just want to say hi, feel free to reach out.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="https://github.com/nayandas69"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-pink-100 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all group"
              >
                <Github size={20} className="text-gray-600 group-hover:text-pink-600" />
                <span className="font-medium text-gray-700 group-hover:text-pink-600">GitHub</span>
              </Link>

              <Link
                href="https://discord.gg/u9XfHZN8K9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-pink-100 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all group"
              >
                <MessageCircle size={20} className="text-gray-600 group-hover:text-pink-600" />
                <span className="font-medium text-gray-700 group-hover:text-pink-600">Discord</span>
              </Link>

              <Link
                href="mailto:nayanchandradas@hotmail.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-pink-100 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all group"
              >
                <Mail size={20} className="text-gray-600 group-hover:text-pink-600" />
                <span className="font-medium text-gray-700 group-hover:text-pink-600">Email</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* CTA Section */}
        <ScrollReveal variant="scale" delay={400}>
          <div className="p-8 bg-gradient-to-br from-pink-50 to-pink-100/50 border border-pink-200 rounded-2xl">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-pink-500 text-white flex items-center justify-center">
                <Sparkles size={24} />
              </span>
              <div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">
                  Want to read my posts?
                </h3>
                <p className="text-gray-600 mb-4">
                  Check out the blog for tutorials, thoughts, and more.
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-medium shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-0.5 transition-all"
                >
                  Browse the blog
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </article>
    </div>
  )
}
