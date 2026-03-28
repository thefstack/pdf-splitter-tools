import "./globals.css"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import Link from "next/link"
import { Scissors } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

const SITE_URL = "https://pdf-splitter.thefstack.com"
const SITE_NAME = "PDF Splitter"
const SITE_DESCRIPTION =
  "Split large PDF files into smaller chunks by file size or page count. 100% free, instant, and private — all processing happens in your browser."

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PDF Splitter — Split PDF Files Free Online",
    template: "%s — PDF Splitter",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "pdf splitter", "split pdf", "split pdf online", "pdf cutter",
    "pdf splitter free", "split pdf by size", "split pdf by pages",
    "pdf tool", "pdf split online free",
  ],
  authors: [{ name: "theFstack", url: "https://www.thefstack.com" }],
  creator: "theFstack",
  publisher: "theFstack",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "PDF Splitter — Split PDF Files Free Online",
    description: SITE_DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF Splitter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Splitter — Split PDF Files Free Online",
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
    creator: "@thefstack",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF Splitter",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Person",
    name: "theFstack",
    url: "https://www.thefstack.com",
  },
  featureList: [
    "Split PDF by file size",
    "Split PDF by page count",
    "No file upload — 100% browser-based",
    "Download as ZIP",
    "Free and unlimited",
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white border-b py-4 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Scissors size={18} className="text-white" />
                </div>
                <span className="font-bold text-gray-900 text-lg">PDFSplitter</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
                <Link href="/faq" className="hover:text-blue-600 transition-colors">FAQ</Link>
                <Link href="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy</Link>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="bg-gray-900 text-gray-400 py-10 mt-auto">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
              <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
                      <Scissors size={14} className="text-white" />
                    </div>
                    <span className="text-white font-semibold">PDFSplitter</span>
                  </div>
                  <p className="text-sm max-w-xs leading-relaxed">
                    Split any PDF file instantly. All processing happens in your browser — your files never leave your device.
                  </p>
                  <p className="text-xs mt-4">© 2025 PDFSplitter. All rights reserved.</p>
                </div>

                <div className="flex gap-16">
                  <div>
                    <p className="text-white text-sm font-semibold mb-3">Product</p>
                    <ul className="space-y-2 text-sm">
                      <li><Link href="/" className="hover:text-white transition-colors">PDF Splitter</Link></li>
                      <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                      <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold mb-3">Legal</p>
                    <ul className="space-y-2 text-sm">
                      <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                      <li><Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-6 text-xs text-center">
                All PDF processing runs locally in your browser. No files are uploaded or stored.
              </div>
            </div>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
