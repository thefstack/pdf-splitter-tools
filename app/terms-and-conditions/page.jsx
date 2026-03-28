export const metadata = {
  title: "Terms and Conditions — PDF Splitter",
  description: "Terms and conditions for using PDF Splitter.",
  alternates: { canonical: "https://pdf-splitter.thefstack.com/terms-and-conditions" },
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: March 2025</p>

        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-8 text-gray-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By using PDF Splitter (&quot;the Service&quot;), you agree to these Terms and Conditions.
              If you do not agree, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Description of Service</h2>
            <p>
              PDF Splitter is a free, browser-based tool that allows you to split PDF files into smaller
              parts by file size or page count. All processing occurs locally in your browser. No files are
              uploaded to any server. We reserve the right to modify or discontinue the Service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Acceptable Use</h2>
            <p className="mb-2">You agree to use the Service only for lawful purposes. You must not:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use the Service to split or distribute files containing illegal content</li>
              <li>Attempt to reverse-engineer, exploit, or disrupt the Service</li>
              <li>Use automated tools to abuse the Service in a manner that impacts other users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Your Content</h2>
            <p>
              Since all processing happens entirely in your browser, your PDF files are never received
              by us. You retain full ownership of your files. We have no access to, and take no
              responsibility for, the content of files you process using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. No Warranties</h2>
            <p>
              The Service is provided &quot;as is&quot; without any warranties of any kind, express or implied.
              We do not guarantee that the Service will be uninterrupted, error-free, or produce
              results that meet your specific requirements. You use the Service at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, theFstack shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your use of or inability to
              use the Service, including any loss of data or files.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Intellectual Property</h2>
            <p>
              All content, design, and code of PDF Splitter is the property of theFstack unless
              otherwise stated. You may not copy or redistribute any part of the Service without
              explicit written permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Changes to Terms</h2>
            <p>
              We reserve the right to update these Terms at any time. Updated terms will be posted
              on this page with a revised date. Continued use of the Service after changes are posted
              constitutes your acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Governing Law</h2>
            <p>
              These Terms are governed by the laws of India. Any disputes shall be subject to the
              exclusive jurisdiction of the courts in India.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Contact</h2>
            <p>
              For questions about these Terms, contact us at{" "}
              <a href="mailto:thefstack@gmail.com" className="text-blue-600 hover:underline">
                thefstack@gmail.com
              </a>.
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}
