"use client"

import { useState } from "react"
import { Upload, FileText, Scissors, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import JSZip from "jszip"
import { PDFDocument } from "pdf-lib"
// Add the import for the PDF compressor at the top of the file
import { compressPdfPage } from "@/lib/pdf-compressor"

export default function PdfSplitter() {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [fileSize, setFileSize] = useState(0)
  const [splitSize, setSplitSize] = useState(10)
  const [splitByPages, setSplitByPages] = useState(false)
  const [pagesPerSplit, setPagesPerSplit] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [splitResults, setSplitResults] = useState(null)

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please select a PDF file")
        return
      }

      setFile(selectedFile)
      setFileName(selectedFile.name)
      setFileSize(selectedFile.size)
      setError("")
      setSuccess(false)
      setSplitResults(null)

      try {
        // Load the PDF to get page count
        const arrayBuffer = await selectedFile.arrayBuffer()
        const pdfDoc = await PDFDocument.load(arrayBuffer)
        const pageCount = pdfDoc.getPageCount()
        setTotalPages(pageCount)
      } catch (err) {
        console.error("Error loading PDF:", err)
        setError("Error loading PDF. The file may be corrupted.")
      }
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a file")
      return
    }

    if (splitByPages) {
      if (pagesPerSplit <= 0) {
        setError("Pages per split must be greater than 0")
        return
      }
    } else {
      if (splitSize <= 0) {
        setError("Split size must be greater than 0")
        return
      }
    }

    setError("")
    setIsProcessing(true)
    setProgress(0)
    setSplitResults(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      let splitPdfs = []
      let splitInfo = []

      if (splitByPages) {
        // Split by page count
        const result = await splitPdfByPages(arrayBuffer, pagesPerSplit, setProgress)
        splitPdfs = result.pdfs
        splitInfo = result.info
      } else {
        // Split by file size - more accurate method
        const splitSizeBytes = splitSize * 1024 * 1024 // Convert MB to bytes
        const result = await splitPdfBySize(arrayBuffer, splitSizeBytes, setProgress)
        splitPdfs = result.pdfs
        splitInfo = result.info
      }

      // Create a ZIP file with all the split PDFs
      const zip = new JSZip()

      splitPdfs.forEach((pdf, index) => {
        const partFileName = `part_${index + 1}_${fileName}`
        zip.file(partFileName, pdf)
      })

      // Generate the ZIP file
      const zipBlob = await zip.generateAsync(
        {
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: { level: 6 },
        },
        (metadata) => {
          setProgress(metadata.percent)
        },
      )

      // Create a download link
      const downloadUrl = URL.createObjectURL(zipBlob)

      // Trigger download
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `split_${fileName}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setSuccess(true)
      setIsProcessing(false)
      setSplitResults({
        totalParts: splitPdfs.length,
        details: splitInfo,
      })

      // Clean up the URL object
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 100)
    } catch (err) {
      console.error("Error processing PDF:", err)
      setError(err.message || "An error occurred while processing the PDF")
      setIsProcessing(false)
    }
  }

  // Function to split PDF by pages
  const splitPdfByPages = async (pdfBuffer, pagesPerSplit, progressCallback) => {
    const srcPdfDoc = await PDFDocument.load(pdfBuffer)
    const totalPages = srcPdfDoc.getPageCount()
    const splitPdfs = []
    const splitInfo = []

    // Calculate how many PDFs we'll create
    const numPdfs = Math.ceil(totalPages / pagesPerSplit)

    for (let i = 0; i < numPdfs; i++) {
      // Create a new PDF document
      const newPdfDoc = await PDFDocument.create()

      // Calculate page range for this split
      const startPage = i * pagesPerSplit
      const endPage = Math.min(startPage + pagesPerSplit, totalPages)

      // Copy pages from source PDF to new PDF
      const pagesToCopy = []
      for (let j = startPage; j < endPage; j++) {
        pagesToCopy.push(j)
      }

      const copiedPages = await newPdfDoc.copyPages(srcPdfDoc, pagesToCopy)

      // Add copied pages to new document
      copiedPages.forEach((page) => {
        newPdfDoc.addPage(page)
      })

      // Save the new PDF as bytes
      const pdfBytes = await newPdfDoc.save()

      // Add to our array of split PDFs
      splitPdfs.push(pdfBytes)

      // Add info about this split
      splitInfo.push({
        partNumber: i + 1,
        pageRange: `${startPage + 1}-${endPage}`,
        size: formatFileSize(pdfBytes.length),
      })

      // Update progress
      progressCallback(((i + 1) / numPdfs) * 100)
    }

    return { pdfs: splitPdfs, info: splitInfo }
  }

  // Update the splitPdfBySize function to include compression for oversized pages
  // Replace the existing splitPdfBySize function with this updated version:

  // Completely revised function to split PDF by size with compression for oversized pages
  const splitPdfBySize = async (pdfBuffer, maxSizeBytes, progressCallback) => {
    const srcPdfDoc = await PDFDocument.load(pdfBuffer)
    const totalPages = srcPdfDoc.getPageCount()
    const splitPdfs = []
    const splitInfo = []

    // Apply a safety margin to account for overhead (95% of the requested size)
    const safeMaxSize = maxSizeBytes * 0.95

    let currentPart = 1
    let currentPageStart = 0
    let overallProgress = 0

    // Process pages
    while (currentPageStart < totalPages) {
      let currentPageEnd = currentPageStart
      let currentSize = 0
      let foundValidSplit = false
      const compressedPages = {}

      // Create a new document for testing
      const testDoc = await PDFDocument.create()

      // Try adding pages one by one until we exceed the size limit
      while (currentPageEnd < totalPages) {
        // Copy the current page to test document
        const [copiedPage] = await testDoc.copyPages(srcPdfDoc, [currentPageEnd])
        testDoc.addPage(copiedPage)

        // Check the size
        const testBytes = await testDoc.save()
        currentSize = testBytes.length

        // If we've exceeded the safe size limit, stop adding pages
        // But make sure we include at least one page
        if (currentSize > safeMaxSize && currentPageEnd > currentPageStart) {
          foundValidSplit = true
          break
        }

        // Move to the next page
        currentPageEnd++
      }

      // If we didn't find a valid split point but processed some pages,
      // it means we reached the end of the document
      if (!foundValidSplit && currentPageEnd > currentPageStart) {
        currentPageEnd = totalPages
      }

      // Special case: If we only have one page and it exceeds the size limit,
      // try to compress it
      if (currentPageEnd - currentPageStart === 1 && currentSize > safeMaxSize) {
        const pageIndex = currentPageStart

        // Update progress to show we're compressing
        progressCallback(overallProgress + ((pageIndex - currentPageStart) / totalPages) * 100)

        try {
          // Try to compress the page
          const compressedPageBuffer = await compressPdfPage(
            pdfBuffer,
            pageIndex,
            safeMaxSize,
            (compressionProgress) => {
              // Update overall progress based on compression progress
              progressCallback(overallProgress + (compressionProgress / 100) * (100 / totalPages))
            },
          )

          // Store the compressed page
          compressedPages[pageIndex] = compressedPageBuffer
        } catch (err) {
          console.error(`Error compressing page ${pageIndex + 1}:`, err)
          // Continue with the uncompressed page
        }
      }

      // Now create the actual document with the determined page range
      const finalDoc = await PDFDocument.create()

      // Add pages to the final document
      for (let i = currentPageStart; i < currentPageEnd; i++) {
        if (compressedPages[i]) {
          // If we have a compressed version of this page, use it
          const compressedDoc = await PDFDocument.load(compressedPages[i])
          const [compressedPage] = await finalDoc.copyPages(compressedDoc, [0])
          finalDoc.addPage(compressedPage)
        } else {
          // Otherwise use the original page
          const [originalPage] = await finalDoc.copyPages(srcPdfDoc, [i])
          finalDoc.addPage(originalPage)
        }
      }

      // Save the document
      const pdfBytes = await finalDoc.save()
      splitPdfs.push(pdfBytes)

      // Add info about this split
      const wasCompressed = Object.keys(compressedPages).length > 0
      splitInfo.push({
        partNumber: currentPart,
        pageRange: `${currentPageStart + 1}-${currentPageEnd}`,
        size: formatFileSize(pdfBytes.length),
        sizeBytes: pdfBytes.length,
        sizeLimit: formatFileSize(maxSizeBytes),
        compressed: wasCompressed,
      })

      // Move to the next part
      currentPart++
      currentPageStart = currentPageEnd

      // Update overall progress
      overallProgress = (currentPageStart / totalPages) * 100
      progressCallback(overallProgress)
    }

    return { pdfs: splitPdfs, info: splitInfo }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pdf-file">Upload PDF</Label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => document.getElementById("pdf-file").click()}
              >
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Drag and drop your PDF here or click to browse</p>
                <p className="text-xs text-gray-500 mt-1">Files are processed in your browser - nothing is uploaded</p>
                <input id="pdf-file" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
              </div>
            </div>

            {file && (
              <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(fileSize)} • {totalPages} pages
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="split-by-size"
                  checked={!splitByPages}
                  onChange={() => setSplitByPages(false)}
                  className="h-4 w-4 text-blue-600"
                />
                <Label htmlFor="split-by-size">Split by file size</Label>
              </div>

              {!splitByPages && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="split-size">Maximum Size per Split (MB)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="split-size"
                      type="number"
                      min="1"
                      value={splitSize}
                      onChange={(e) => setSplitSize(Number.parseInt(e.target.value) || 0)}
                      className="w-32"
                    />
                    <div className="flex-1 flex items-center gap-2">
                      <Scissors className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Each part will be under {splitSize}MB. Large pages will be compressed automatically.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="split-by-pages"
                  checked={splitByPages}
                  onChange={() => setSplitByPages(true)}
                  className="h-4 w-4 text-blue-600"
                />
                <Label htmlFor="split-by-pages">Split by page count</Label>
              </div>

              {splitByPages && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="pages-per-split">Pages per split</Label>
                  <div className="flex gap-2">
                    <Input
                      id="pages-per-split"
                      type="number"
                      min="1"
                      value={pagesPerSplit}
                      onChange={(e) => setPagesPerSplit(Number.parseInt(e.target.value) || 0)}
                      className="w-32"
                    />
                    <div className="flex-1 flex items-center gap-2">
                      <Scissors className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {file && totalPages
                          ? `Will create approximately ${Math.ceil(totalPages / pagesPerSplit)} files`
                          : "Enter pages per split"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isProcessing || !file}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Scissors className="mr-2 h-4 w-4" />
                  Split PDF
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isProcessing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Processing...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your PDF has been split successfully and downloaded as a ZIP file.
          </AlertDescription>
        </Alert>
      )}

      {splitResults && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Split Results</h3>
            <p className="text-sm text-gray-600 mb-4">Your PDF was split into {splitResults.totalParts} parts:</p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Part
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Pages
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Size
                    </th>
                    {!splitByPages && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Limit
                      </th>
                    )}
                  </tr>
                </thead>
                {/* Update the table in the render function to show compression status
                Find the table body section and replace it with: */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {splitResults.details.map((part) => (
                    <tr key={part.partNumber}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Part {part.partNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{part.pageRange}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {part.size}
                        {part.compressed && (
                          <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Compressed
                          </span>
                        )}
                      </td>
                      {!splitByPages && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{part.sizeLimit}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
