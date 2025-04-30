import PdfSplitter from "@/components/pdf-splitter"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">PDF Splitter</h1>
        <p className="text-gray-600 text-center mb-8">Split large PDF files into smaller chunks</p>
        <PdfSplitter />
      </div>
    </main>
  )
}
