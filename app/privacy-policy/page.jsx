export const metadata = {
  title: "Privacy Policy — PDF Splitter",
  description: "Privacy policy for PDF Splitter. Your files are never uploaded or stored.",
  alternates: { canonical: "https://pdf-splitter.thefstack.com/privacy-policy" },
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: March 2025</p>

        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-8 text-gray-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Overview</h2>
            <p>
              PDF Splitter is operated by theFstack. This Privacy Policy explains what information we collect
              when you use our service and how we use it. By using PDF Splitter, you agree to this policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Your Files Are Never Uploaded</h2>
            <p>
              PDF Splitter processes all files <strong>entirely within your browser</strong> using JavaScript.
              Your PDF files are never uploaded to our servers, never transmitted over the internet,
              and never stored anywhere outside of your own device. We have zero access to your files or their contents.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Information We Collect</h2>
            <p className="mb-3">We collect minimal anonymous data to operate and improve the service:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Anonymous analytics:</strong> We use Vercel Analytics to collect aggregate,
                non-identifiable usage data such as page views, country, and browser type.
                This data cannot be used to identify you personally.
              </li>
              <li>
                <strong>No cookies:</strong> We do not use tracking cookies or advertising cookies.
              </li>
              <li>
                <strong>No accounts:</strong> We do not collect names, email addresses, or any personal information.
                No registration is required.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Third-Party Services</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Vercel</strong> — Hosts this website and provides anonymous analytics.
                Vercel may log standard server request data (IP address, browser, timestamp).
                See{" "}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Vercel&apos;s Privacy Policy
                </a>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Children&apos;s Privacy</h2>
            <p>
              PDF Splitter is not directed at children under 13. We do not knowingly collect any information
              from children. If you believe a child has submitted personal information, contact us and we will
              promptly delete it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy occasionally. Changes will be posted on this page with a
              revised date. Continued use of the service after changes are posted constitutes your acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Contact</h2>
            <p>
              Questions about this policy? Contact us at{" "}
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
