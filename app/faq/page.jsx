export const metadata = {
  title: "FAQ — PDF Splitter",
  description: "Frequently asked questions about PDF Splitter — how it works, file limits, privacy, and more.",
  alternates: { canonical: "https://pdf-splitter.thefstack.com/faq" },
}

const faqs = [
  {
    q: "Is PDF Splitter free to use?",
    a: "Yes. PDF Splitter is completely free with no account required, no usage limits, and no hidden charges.",
  },
  {
    q: "Are my PDF files uploaded to a server?",
    a: "No. Your files never leave your device. All splitting is done entirely in your browser using JavaScript. Nothing is uploaded, transmitted, or stored anywhere.",
  },
  {
    q: "How do I split a PDF by file size?",
    a: "Upload your PDF, select 'Split by file size', enter the maximum size per part in MB, then click Split. The tool will divide your PDF and bundle the parts into a ZIP file for download.",
  },
  {
    q: "How do I split a PDF by page count?",
    a: "Upload your PDF, select 'Split by pages', enter how many pages each part should contain, then click Split. You'll receive a ZIP file containing all the smaller PDFs.",
  },
  {
    q: "Is there a file size limit?",
    a: "There is no limit imposed by us. However, very large files (500MB+) may be slow depending on your device's available memory and processing power, since everything runs locally on your machine.",
  },
  {
    q: "What browsers are supported?",
    a: "PDF Splitter works on all modern browsers — Chrome, Firefox, Edge, and Safari. We recommend using the latest version of your browser for the best performance.",
  },
  {
    q: "Can I use PDF Splitter on my phone?",
    a: "Yes, it works on mobile browsers. For large files, a desktop or laptop is recommended as it has more memory and processing power.",
  },
  {
    q: "Why is the output a ZIP file?",
    a: "When splitting a PDF into multiple parts, bundling them in a ZIP makes it easy to download all parts in one click instead of downloading each file separately.",
  },
  {
    q: "Will the quality of my PDF be affected?",
    a: "No. PDF Splitter only extracts pages from your PDF — it does not re-encode, compress, or alter the content in any way. The output files are identical in quality to the original.",
  },
  {
    q: "I found a bug. How do I report it?",
    a: "Please email us at thefstack@gmail.com. We appreciate all bug reports and feedback.",
  },
]

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">FAQ</h1>
        <p className="text-gray-500 text-center mb-12">
          Everything you need to know about PDF Splitter.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-2">{faq.q}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-12">
          Still have questions?{" "}
          <a href="mailto:thefstack@gmail.com" className="text-blue-600 hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </main>
  )
}
