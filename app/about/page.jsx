import { Scissors, ShieldCheck, Zap, Lock, Heart, Globe, FileOutput } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "About — PDF Splitter",
  description: "Learn why we built PDF Splitter — a free, private, browser-based tool to split PDF files without uploading them anywhere.",
  alternates: { canonical: "https://pdf-splitter.thefstack.com/about" },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-white border-b py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Scissors size={28} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About PDFSplitter</h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            A simple, free tool built because splitting a PDF shouldn&apos;t require uploading your files to a stranger&apos;s server.
          </p>
        </div>
      </section>

      {/* Why we built it */}
      <section className="max-w-3xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Why We Built This</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-5 text-gray-600 leading-relaxed">
          <p>
            Most PDF tools online ask you to upload your file to their server. You click &quot;Split PDF&quot;,
            your document travels across the internet to some server you know nothing about, gets processed,
            and then — hopefully — gets deleted. You just have to trust them.
          </p>
          <p>
            For most people, that&apos;s fine. But what if your PDF contains a bank statement, a legal
            agreement, a medical record, or a confidential business document? Uploading that to a
            third-party server is a real privacy risk — one that most people don&apos;t think about until
            it&apos;s too late.
          </p>
          <p>
            We built PDFSplitter because we wanted a tool that we could use ourselves without worrying.
            A tool that is <strong className="text-gray-800">genuinely private</strong> — not just
            claiming to be. The only way to guarantee that is to never receive your files in the first
            place.
          </p>
          <p>
            So that&apos;s exactly what we did. PDFSplitter runs entirely in your browser. Your PDF is
            opened and processed locally on your device using JavaScript. Nothing is uploaded. Nothing
            is transmitted. Nothing is stored. We literally cannot see your files.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="space-y-5 text-gray-600 leading-relaxed">
            <p>
              When you upload a PDF on PDFSplitter, the file is read by your browser&apos;s JavaScript engine —
              the same engine that powers every website you visit. We use{" "}
              <strong className="text-gray-800">pdf-lib</strong>, an open-source JavaScript library,
              to read and split your PDF pages locally.
            </p>
            <p>
              You can choose to split by <strong className="text-gray-800">file size</strong> — for
              example, break a 50MB PDF into parts no larger than 10MB each — or by{" "}
              <strong className="text-gray-800">page count</strong> — for example, 10 pages per part.
            </p>
            <p>
              The split parts are then bundled into a ZIP file using{" "}
              <strong className="text-gray-800">JSZip</strong>, another open-source library, and
              downloaded directly to your device. The entire process happens without a single byte of
              your PDF leaving your computer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            {[
              { icon: Lock, label: "Files never leave your device" },
              { icon: Zap, label: "Processed instantly in your browser" },
              { icon: FileOutput, label: "Downloaded as a ZIP file" },
            ].map((item) => (
              <div key={item.label} className="bg-blue-50 rounded-xl p-5 flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <item.icon size={20} className="text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our values */}
      <section className="max-w-3xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Stand For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            {
              icon: ShieldCheck,
              title: "Privacy by design",
              desc: "We don't collect your files, we don't store them, and we don't want them. Privacy isn't a feature — it's the foundation.",
            },
            {
              icon: Heart,
              title: "Free forever",
              desc: "PDFSplitter is free and will stay free. No sign-up, no subscription, no usage limits. We built this because it's useful, not to monetize you.",
            },
            {
              icon: Globe,
              title: "Open and honest",
              desc: "Everything we claim about privacy is verifiable. The processing happens in your browser — you can open DevTools and see that no network requests are made when splitting.",
            },
            {
              icon: Zap,
              title: "Simple and fast",
              desc: "We deliberately keep the tool simple. No accounts, no settings pages, no dashboards. Upload, split, download — done.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <item.icon size={20} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Built by */}
      <section className="bg-white border-t py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Built by theFstack</h2>
          <div className="text-gray-600 leading-relaxed space-y-4">
            <p>
              PDFSplitter is built and maintained by{" "}
              <a
                href="https://www.thefstack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                theFstack
              </a>
              , a full stack developer focused on building simple, useful tools for everyday problems.
            </p>
            <p>
              This is one of several tools we&apos;re building under the same philosophy: keep it free,
              keep it private, keep it simple. No venture capital, no data harvesting, no dark patterns.
              Just tools that do what they say.
            </p>
            <p>
              If you have feedback, found a bug, or just want to say hello — we&apos;d love to hear from you.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            <a
              href="mailto:thefstack@gmail.com"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
            >
              Contact Us
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 border border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
            >
              Try PDF Splitter
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
