import PdfSplitter from "@/components/pdf-splitter"

export const metadata = {
  title: "PDF Splitter — Split PDF Files Free Online",
  description:
    "Split large PDF files into smaller chunks by file size or page count. Free, instant, and 100% private — all processing happens in your browser.",
  alternates: { canonical: "https://pdf-splitter.thefstack.com" },
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            PDF Splitter
          </h1>
          <p className="text-gray-500">
            Split large PDF files into smaller chunks by file size or page count.
          </p>
          <span className="inline-block text-xs text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mt-3">
            100% private — your files never leave your browser
          </span>
        </div>
        <PdfSplitter />
      </div>
    </main>
  )
}
