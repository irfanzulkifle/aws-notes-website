# ☁️ AWS re/Start Notes

[![AWS re/Start](https://img.shields.io/badge/AWS-re%2FStart-orange)](https://github.com/irfanzulkifle/aws_restart_note)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey)](https://creativecommons.org/licenses/by/4.0/)
[![Live](https://img.shields.io/badge/Live-aws--notes--website.vercel.app-000?logo=vercel)](https://aws-notes-website.vercel.app)

A beautifully styled static website publishing my **AWS re/Start lecture notes** — a structured learning journal covering cloud computing fundamentals, Linux administration, Python programming, SQL databases, and networking.

**Live site → [aws-notes-website.vercel.app](https://aws-notes-website.vercel.app)**

---

## 📋 Content

- **30 lecture notes** across 8 weeks of the AWS re/Start program
- **Cohort 3: Project CloudIgnite**
- Topics: Linux · Bash · Python · SQL · Networking · AWS Cloud · Security · Databases
- Each note tagged with **AWS CLF-C02 exam relevance** flags
- Last updated: 2026-06-03

> 📓 Source notes at [irfanzulkifle/aws_restart_note](https://github.com/irfanzulkifle/aws_restart_note)

### Week Breakdown

| Week | Topics | Notes |
|------|--------|-------|
| Week 3 | Linux & Shell | 1 |
| Week 4 | Bash, Networking & VPC | 5 |
| Week 5 | Networking & Security | 4 |
| Week 6 | Security & IAM | 3 |
| Week 7 | Python Fundamentals | 5 |
| Week 8 | Python & DevOps | 6 |
| Week 9 | Databases & SQL | 5 |
| Week 10 | SQL Advanced & Amazon RDS | 1 |

---

## ✨ Features

### Reading Experience
- **Minimal dark theme** — clean, modern aesthetic optimized for reading technical content
- **Unified typography** — Geist Sans for body text, Geist Mono for code blocks
- **Syntax highlighting** — SQL, Python, Bash code blocks with Material-inspired theme
- **Copy code button** — one-click copy for all code blocks
- **Reading time estimate** — shown on each note card and page
- **Related notes** — automatically surfaced notes with shared topics

### Navigation & Discovery
- **Search & filter** — real-time search across all notes by title, topic, or week
- **Topic pills** — clickable topic filters on homepage and note pages
- **Mobile TOC** — bottom-sheet table of contents drawer on mobile devices
- **Desktop TOC** — sticky sidebar with scroll spy highlighting active section
- **Week navigation** — previous/next navigation within and across weeks
- **Expand/collapse all** — toggle all week cards at once

### Technical
- **Static generation** — 37 pages pre-rendered at build time for lightning-fast performance
- **SEO optimized** — JSON-LD structured data, OpenGraph tags, auto-generated sitemap
- **Security headers** — CSP, X-Frame-Options, HSTS, and more via Vercel config
- **Fully responsive** — mobile-first design with touch-friendly interactions
- **Accessibility** — skip-to-content link, ARIA labels, focus rings, WCAG AA contrast

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Markdown | react-markdown + remark-gfm |
| Syntax | rehype-highlight |
| Slug generation | github-slugger |
| Frontmatter | gray-matter |
| Fonts | Geist Sans + Geist Mono (Google Fonts) |
| Deployment | [Vercel](https://vercel.com) |
| Node.js | 22 (via .nvmrc) |

---

## 🚀 Local Development

### Prerequisites

- Node.js 22+ (see `.nvmrc`)
- npm 10+

### Setup

```bash
git clone https://github.com/irfanzulkifle/aws-notes-website.git
cd aws-notes-website
npm install
```

### Commands

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Adding New Notes

1. Create a new markdown file in `content/notes/week_XX/YYYY-MM-DD.md`
2. Follow the existing format:
   ```markdown
   # Lecture Notes — Month Day, Year
   **Cohort 3 | Project CloudIgnite**
   **Topics:** Topic 1, Topic 2
   
   ## Key Takeaways
   - Bullet point 1
   - Bullet point 2
   
   ## Table of Contents
   1. [Section 1](#1-section-1)
   2. [Section 2](#2-section-2)
   
   ## 1. Section 1
   Content here...
   ```
3. The site will automatically pick up the new note on next build

---

## 📂 Project Structure

```
aws-notes-website/
├── content/
│   └── notes/                  # All 30 markdown notes
│       ├── week_03/
│       ├── week_04/
│       ├── ...
│       └── week_10/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (dark theme, metadata, footer)
│   │   ├── page.tsx            # Homepage (hero + search + week cards)
│   │   ├── globals.css         # Tailwind + prose + syntax styles
│   │   ├── sitemap.ts          # Auto-generated sitemap
│   │   ├── robots.ts           # robots.txt generator
│   │   ├── opengraph-image.tsx # Dynamic OG image generator
│   │   ├── not-found.tsx       # Custom 404 page
│   │   ├── error.tsx           # Error boundary
│   │   ├── loading.tsx         # Loading state
│   │   └── notes/[week]/[slug]/
│   │       └── page.tsx        # Individual note page (SSG)
│   ├── components/
│   │   ├── SearchableNotes.tsx # Search/filter client component
│   │   ├── TableOfContents.tsx # Desktop + mobile TOC with scroll spy
│   │   └── CopyCodeButton.tsx  # Code block copy button
│   └── lib/
│       ├── utils.ts            # File scanning + metadata parsing
│       └── constants.ts        # Week labels and other constants
├── public/                     # Static assets
├── vercel.json                 # Security headers config
├── next.config.ts              # Next.js config
├── postcss.config.mjs          # PostCSS config (Tailwind)
└── tsconfig.json               # TypeScript config
```

---

## 🔒 Security

The site implements security headers via `vercel.json`:

- **X-Frame-Options**: SAMEORIGIN
- **X-Content-Type-Options**: nosniff
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: Restricts camera, microphone, geolocation
- **Content-Security-Policy**: Restricts resource loading to same origin
- **HSTS**: HTTP Strict Transport Security (2 years)

---

## 🤝 Contributing

This is a personal learning journal, but if you notice any errors or have suggestions:

1. Open an issue describing the problem
2. Fork the repo and create a branch
3. Make your changes
4. Submit a pull request

Please ensure:
- Code follows existing style (run `npm run lint`)
- Build passes (`npm run build`)
- Markdown follows the existing format

---

## 📄 License

This project is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — you may share and adapt with attribution.

Content © 2026 Irfan Zulkifle.

---

## 🔗 Links

- **Live Site**: [aws-notes-website.vercel.app](https://aws-notes-website.vercel.app)
- **Source Notes**: [aws_restart_note](https://github.com/irfanzulkifle/aws_restart_note)
- **AWS re/Start Program**: [AWS re/Start](https://aws.amazon.com/training/restart/)
- **CLF-C02 Exam Guide**: [AWS Certified Cloud Practitioner](https://aws.amazon.com/certification/certified-cloud-practitioner/)
