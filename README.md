# AWS re/Start Notes

[![AWS re/Start](https://img.shields.io/badge/AWS-re%2FStart-orange)](https://github.com/irfanzulkifle/aws_restart_note)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey)](https://creativecommons.org/licenses/by/4.0/)
[![Live](https://img.shields.io/badge/Live-aws--notes--website.vercel.app-000?logo=vercel)](https://aws-notes-website.vercel.app)

A polished notes website publishing my **AWS re/Start lecture notes** - a structured learning journal covering cloud computing fundamentals, Linux administration, Python programming, SQL databases, networking, security, and AWS services.

**Live site → [aws-notes-website.vercel.app](https://aws-notes-website.vercel.app)**

---

## Content

- **33 lecture notes** across 8 weeks of the AWS re/Start program
- **8 weekly summaries** plus a weekly summary index
- **Cohort 3: Project CloudIgnite**
- Topics: Linux · Bash · Python · SQL · Networking · AWS Cloud · Security · Databases · RDS · DynamoDB · Cloud Architecture
- Each note tagged with **AWS CLF-C02 exam relevance** flags
- Last updated: 2026-06-06

> Source notes at [irfanzulkifle/aws_restart_note](https://github.com/irfanzulkifle/aws_restart_note)

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
| Week 10 | SQL, RDS, DynamoDB, CAF & Well-Architected Framework | 4 |

---

## Features

### Reading Experience
- **Light/dark theme** - clean technical reading interface with persisted theme preference
- **Unified typography** - Inter for body text, Geist Mono for code blocks
- **Syntax highlighting** - SQL, Python, Bash, and other code blocks via `rehype-highlight`
- **Copy code button** - one-click copy for code blocks
- **Reading time estimate** - shown on each note card and page
- **Weekly summaries** - dedicated summary pages for each week and a learning-journey index

### Navigation & Discovery
- **Homepage filter** - real-time filtering across titles, topics, week labels, and note bodies
- **Global fuzzy search** - modal search powered by Fuse.js with keyboard shortcuts and result snippets
- **Search index API** - generated from note metadata, headings, sections, topics, and body text
- **Document sidebar** - persistent desktop navigation and mobile slide-out navigation
- **Desktop TOC** - sticky table of contents with scroll spy highlighting active section
- **Week navigation** - previous/next navigation within and across weeks
- **Recently viewed notes** - quick access to recent reading history
- **Expand/collapse all** - toggle all week cards at once

### Technical
- **Static generation** - note pages and weekly summary pages are generated from Markdown content
- **SEO optimized** - metadata, OpenGraph image generation, sitemap, and robots.txt
- **Security headers** - CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy, and more via Vercel config
- **Vercel analytics** - includes Vercel Analytics and Speed Insights
- **Fully responsive** - mobile-first design with touch-friendly interactions
- **Accessibility** - skip-to-content link, ARIA labels, focus rings, and high-contrast theme support

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Runtime UI | React 19 |
| Language | TypeScript |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Markdown | react-markdown + remark-gfm |
| Syntax | rehype-highlight + rehype-slug |
| Search | Fuse.js |
| Slug generation | github-slugger |
| Frontmatter | gray-matter |
| Fonts | Inter + Geist Mono (Google Fonts) |
| Deployment | [Vercel](https://vercel.com) |
| Node.js | 22 (via .nvmrc) |

---

## Local Development

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

### Adding Weekly Summaries

1. Create or update `content/notes/week_XX/weekly_summary.md`
2. Add the week to `content/notes/weekly_summary_index.md`
3. The summary will be linked from the homepage week card, sidebar, and `/notes/weekly-summary`

---

## Project Structure

```
aws-notes-website/
├── content/
│   └── notes/                  # Daily notes, weekly summaries, and summary index
│       ├── weekly_summary_index.md
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
│   │   ├── api/search-index/   # Generated JSON search index
│   │   ├── notes/weekly-summary/
│   │   │   └── page.tsx        # Weekly summary index page
│   │   └── notes/[week]/[slug]/
│   │       └── page.tsx        # Individual note and weekly summary pages
│   ├── components/
│   │   ├── DocLayout.tsx       # Note page shell with sidebars
│   │   ├── DocSidebar.tsx      # Week and note navigation
│   │   ├── GlobalSearch.tsx    # Fuzzy search modal
│   │   ├── SearchableNotes.tsx # Search/filter client component
│   │   ├── TableOfContents.tsx # Desktop + mobile TOC with scroll spy
│   │   ├── ThemeToggle.tsx     # Light/dark theme switcher
│   │   ├── RecentlyViewed.tsx  # Local recent-note history
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

## Security

The site implements security headers via `vercel.json`:

- **X-Frame-Options**: SAMEORIGIN
- **X-Content-Type-Options**: nosniff
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: Restricts camera, microphone, geolocation
- **Content-Security-Policy**: Restricts resource loading to same origin

---

## Contributing

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

## License

This project is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — you may share and adapt with attribution.

Content © 2026 Irfan Zulkifle.

---

## Links

- **Live Site**: [aws-notes-website.vercel.app](https://aws-notes-website.vercel.app)
- **Source Notes**: [aws_restart_note](https://github.com/irfanzulkifle/aws_restart_note)
- **AWS re/Start Program**: [AWS re/Start](https://aws.amazon.com/training/restart/)
- **CLF-C02 Exam Guide**: [AWS Certified Cloud Practitioner](https://aws.amazon.com/certification/certified-cloud-practitioner/)
