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

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const pageCount = pdfDoc.getPageCount()

      let splitPdfs = []

      if (splitByPages) {
        // Split by page count
        splitPdfs = await splitPdfByPages(arrayBuffer, pagesPerSplit, setProgress)
      } else {
        // Split by file size (approximate)
        const pagesPerChunk = Math.max(1, Math.ceil((pageCount * (splitSize * 1024 * 1024)) / fileSize))
        splitPdfs = await splitPdfByPages(arrayBuffer, pagesPerChunk, setProgress)
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

      // Update progress
      progressCallback(((i + 1) / numPdfs) * 100)
    }

    return splitPdfs
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
                <Label htmlFor="split-by-size">Split by approximate file size</Label>
              </div>

              {!splitByPages && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="split-size">Split Size (MB)</Label>
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
                        {file
                          ? `Will create approximately ${Math.ceil(fileSize / (splitSize * 1024 * 1024))} files`
                          : "Enter split size in MB"}
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
    </div>
  )
}
