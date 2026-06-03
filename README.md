# ☁️ AWS re/Start Notes

[![AWS re/Start](https://img.shields.io/badge/AWS-re%2FStart-orange)](https://github.com/irfanzulkifle/aws_restart_note)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey)](https://creativecommons.org/licenses/by/4.0/)
[![Live](https://img.shields.io/badge/Live-aws--notes--website.vercel.app-000?logo=vercel)](https://aws-notes-website.vercel.app)

A beautifully styled static website publishing my **AWS re/Start lecture notes** — a structured learning journal covering cloud computing fundamentals, Linux administration, Python programming, SQL databases, and networking.

**Live site → [aws-notes-website.vercel.app](https://aws-notes-website.vercel.app)**

<img src="https://github.com/user-attachments/assets/placeholder" width="800" />

---

## 📋 Content

- **29 lecture notes** across 7 weeks of the AWS re/Start program
- **Cohort 3: Project CloudIgnite**
- Topics: Linux · Bash · Python · SQL · Networking · AWS Cloud
- Each note tagged with **AWS CLF-C02 exam relevance** flags

> 📓 Source notes at [irfanzulkifle/aws_restart_note](https://github.com/irfanzulkifle/aws_restart_note)

---

## ✨ Features

- **Static generation** — 34 pages pre-rendered at build time, lightning fast
- **Dark theme** — easy on the eyes, designed for reading technical content
- **Syntax highlighting** — SQL, Python, Bash code blocks with Material-inspired theme
- **Table of contents** — sticky sidebar TOC on every note page
- **Week navigation** — previous/next navigation within and across weeks
- **Fully responsive** — mobile-friendly with collapsible navigation
- **SEO optimized** — per-page metadata, OpenGraph tags, auto-generated sitemap

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Language | TypeScript |
| Markdown | react-markdown + remark-gfm |
| Syntax | rehype-highlight |
| Deployment | [Vercel](https://vercel.com) |

---

## 🚀 Local Development

```bash
git clone https://github.com/irfanzulkifle/aws-notes-website.git
cd aws-notes-website
npm install
npm run dev        # http://localhost:3000
npm run build      # Production build
```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (dark theme, metadata)
│   ├── page.tsx            # Homepage (hero + week cards)
│   ├── globals.css         # Tailwind + prose + syntax styles
│   ├── sitemap.ts          # Auto-generated sitemap
│   └── notes/[week]/[slug]/
│       └── page.tsx        # Individual note page (SSG)
├── lib/
│   └── utils.ts            # File scanning + metadata parsing
content/
└── notes/                  # All 29 markdown notes
    ├── week_03/
    ├── week_04/
    ├── ...
    └── week_09/
```

---

## 📄 License

This project is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — you may share and adapt with attribution.

Content © 2026 Irfan Zulkifle.
