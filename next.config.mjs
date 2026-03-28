/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['onnxruntime-node', 'pdf-parse', 'pdfjs-dist', 'pdf2json'],
}

export default nextConfig
