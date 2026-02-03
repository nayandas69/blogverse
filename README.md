<div align="center">

![BlogVerse - Modern MDX Blogging Platform](https://blogverse-five-omega.vercel.app/images/blogverse.png)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![MDX](https://img.shields.io/badge/MDX-2.0-blue?style=flat-square&logo=markdown)](https://mdxjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://blogverse-five-omega.vercel.app)
[![Next.js CI](https://github.com/nayandas69/blogverse/actions/workflows/ci.yml/badge.svg)](https://github.com/nayandas69/blogverse/actions/workflows/ci.yml)

[Live Demo](https://blogverse-five-omega.vercel.app) | [API Documentation](https://github.com/nayandas69/blogverse/blob/main/app/api/v1/README.md) | [API Test](https://blogverse-five-omega.vercel.app/api-test) | [Complete Guide](https://blogverse-five-omega.vercel.app/blog/blogverse-complete-guide)

</div>

# Nayan Das Blog

Personal blog and portfolio by [nayandas69](https://github.com/nayandas69)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the blog.

## Writing Posts

Create `.mdx` files in `content/blog/` with frontmatter:

```mdx
---
title: "Post Title"
date: "2026-01-01"
description: "Brief description"
tags: ["tag1", "tag2"]
cover: "/images/cover.jpg"
---

Your content here.
```

## Project Structure

```
├── app/              # Next.js pages and routes
├── components/       # React components
├── content/blog/     # MDX blog posts
├── lib/              # Utilities and blog functions
└── public/           # Static assets
```

## Author

**Nayan Das** - [GitHub](https://github.com/nayandas69)

## License

- Source code is licensed under the MIT License.
- Blog content (MDX files under `content/blog/`) is licensed under CC BY-NC 4.0 unless stated otherwise.