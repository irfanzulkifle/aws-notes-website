import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ThemeToggle from "@/components/ThemeToggle";
import GlobalSearch from "@/components/GlobalSearch";
import SearchTrigger from "@/components/SearchTrigger";
import ScrollToHash from "@/components/ScrollToHash";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aws-notes-website.vercel.app"),
  title: "AWS re/Start Notes — Irfan Zulkifle",
  description:
    "Comprehensive AWS re/Start learning journal by Irfan Zulkifle. 30 lectures covering Linux, Python, SQL, Networking, AWS Cloud, and more — with CLF-C02 exam relevance flags.",
  openGraph: {
    title: "AWS re/Start Notes — Irfan Zulkifle",
    description:
      "Comprehensive AWS re/Start learning journal covering Linux, Python, SQL, Networking, AWS Cloud, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem("theme");const d=t?t==="dark":matchMedia("(prefers-color-scheme:dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-200`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-3 focus:py-1.5 focus:rounded-md focus:bg-blue-600 focus:text-white focus:text-xs focus:outline-none"
        >
          Skip to content
        </a>
        <Analytics />
        <SpeedInsights />

        <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-13 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                aws-notes
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <SearchTrigger />
              <a
                href="https://github.com/irfanzulkifle/aws-notes-website"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <ThemeToggle />
            </div>
          </div>
        </nav>

        <main className="flex-1">{children}</main>
        <Suspense fallback={null}>
          <ScrollToHash />
        </Suspense>
        <GlobalSearch />

        <footer className="border-t border-zinc-100 dark:border-zinc-800 py-6">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
                aws-notes
              </span>
              <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
                <span>Irfan Zulkifle</span>
                <span className="text-zinc-300 dark:text-zinc-700">/</span>
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  CC BY 4.0
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
