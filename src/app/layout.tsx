import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-slate-950">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-blue-600 focus:text-white focus:text-sm focus:outline-none"
        >
          Skip to content
        </a>
        {children}
        <footer className="border-t border-slate-800/60 py-8 mt-auto">
          <div className="max-w-4xl mx-auto px-4 flex items-center justify-between text-xs text-slate-600">
            <span>Irfan Zulkifle · CC BY 4.0</span>
            <a
              href="https://github.com/irfanzulkifle/aws_restart_note"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-400 transition-colors"
            >
              GitHub
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
