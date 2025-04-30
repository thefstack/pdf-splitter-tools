import "./globals.css"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PDF Splitter",
  description: "Split PDF files into smaller chunks - processed in your browser",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white border-b py-4">
            <div className="max-w-5xl mx-auto px-4 md:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-blue-600"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <line x1="10" y1="9" x2="8" y2="9" />
                  </svg>
                  <span className="text-xl font-bold">PDF Splitter</span>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1">
            <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
          </main>
          <footer className="bg-white border-t py-4 mt-8">
            <div className="max-w-5xl mx-auto px-4 md:px-8 text-center text-sm text-gray-500">
              <div className="mb-2">
                PDF Splitter &copy; {new Date().getFullYear()} - All processing happens in your browser
              </div>
              <div>
                Created by{" "}
                <a
                  href="https://thefstack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  thefstack
                </a>
              </div>
            </div>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
