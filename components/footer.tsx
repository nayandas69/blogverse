/**
 * Footer Component
 * 
 * Site footer with:
 * - Social links (GitHub, Discord)
 * - RSS feed link
 * - Copyright information
 * 
 * @author nayandas69
 */

import Link from "next/link"
import { Github, Rss, MessageCircle } from "lucide-react"

const socialLinks = [
  {
    href: "https://github.com/nayandas69",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://discord.gg/u9XfHZN8K9",
    label: "Discord",
    icon: MessageCircle,
  },
  {
    href: "/rss.xml",
    label: "RSS Feed",
    icon: Rss,
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Nayan Das. Blog content licensed under{" "}
            <a
              href="https://creativecommons.org/licenses/by-nc/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              CC BY-NC 4.0
            </a>.
          </p>


          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={link.label}
              >
                <link.icon size={20} />
              </Link>
            ))}
          </div>
        </div>


      </div>
    </footer>
  )
}
