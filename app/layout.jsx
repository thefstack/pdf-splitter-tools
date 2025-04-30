import "./globals.css"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PDF Splitter",
  description: "Split PDF files into smaller chunks - processed in your browser",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white border-b py-4">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/logo.svg" alt="theFstack Logo" className="h-8 w-auto" />
                  <span className="text-xl font-bold">PDF Splitter</span>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1">
            <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
          </main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  )
}
