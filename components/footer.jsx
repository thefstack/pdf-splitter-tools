import Image from "next/image"
import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white border-t py-8 mt-8">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1">
            <div className="mb-4">
              <Image src="/logo.svg" alt="theFstack Logo" width={150} height={50} className="h-auto" />
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Full Stack Developer specializing in Next.js, React, and Node.js applications. Building modern web
              experiences with cutting-edge technologies.
            </p>
            <p className="text-gray-500 text-sm">© 2025 theFstack. All rights reserved.</p>
          </div>

          {/* Navigation */}
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4 uppercase text-sm tracking-wider">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://www.thefstack.com/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.thefstack.com/about"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.thefstack.com/contact"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Projects */}
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4 uppercase text-sm tracking-wider">Projects</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://prepai.ivyproschool.com/"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  PrepAI
                </Link>
              </li>
              <li>
                <Link
                  href="https://pdf-splitter.thefstack.com/"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  PDF Splitter
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4 uppercase text-sm tracking-wider">Connect</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://github.com/thefstack"
                  className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={16} />
                  <span>GitHub</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://linkedin.com/in/thefstack"
                  className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin size={16} />
                  <span>LinkedIn</span>
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:thefstack@gmail.com"
                  className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"
                >
                  <Mail size={16} />
                  <span>Mail</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm mb-1">PDF Splitter © 2025 - All processing happens in your browser</p>
          <p className="text-gray-500 text-sm">
            Created by{" "}
            <Link
              href="https://www.thefstack.com"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              theFstack
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
