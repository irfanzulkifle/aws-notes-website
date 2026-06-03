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
  title: "AWS re/Start Notes — Irfan Zulkifle",
  description:
    "Comprehensive AWS re/Start learning journal by Irfan Zulkifle. 29 lectures covering Linux, Python, SQL, Networking, AWS Cloud, and more — with CLF-C02 exam relevance flags.",
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
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
        {children}
        <footer className="border-t border-slate-800 py-6 mt-auto">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              CC BY 4.0
            </a>
            {" · "}
            <a
              href="https://github.com/irfanzulkifle/aws_restart_note"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
