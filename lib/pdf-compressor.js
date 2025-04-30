import { PDFDocument } from "pdf-lib"

/**
 * Compresses a PDF page to try to get it under the target size
 * @param {ArrayBuffer} pdfBuffer - The original PDF buffer
 * @param {number} pageIndex - The index of the page to compress
 * @param {number} targetSizeBytes - Target size in bytes
 * @param {Function} progressCallback - Callback for progress updates
 * @returns {Promise<ArrayBuffer>} - Compressed PDF buffer containing just the page
 */
export async function compressPdfPage(pdfBuffer, pageIndex, targetSizeBytes, progressCallback) {
  // Load the source PDF
  const srcPdfDoc = await PDFDocument.load(pdfBuffer)

  // Create a new document with just the target page
  const newPdfDoc = await PDFDocument.create()
  const [copiedPage] = await newPdfDoc.copyPages(srcPdfDoc, [pageIndex])
  newPdfDoc.addPage(copiedPage)

  // Try different compression levels until we get under the target size
  // or reach maximum compression
  let compressedPdf = await newPdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  })

  // If already under target size, return as is
  if (compressedPdf.length <= targetSizeBytes) {
    return compressedPdf
  }

  progressCallback(25)

  // Try with higher compression
  compressedPdf = await newPdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 50,
  })

  if (compressedPdf.length <= targetSizeBytes) {
    return compressedPdf
  }

  progressCallback(50)

  // Try with maximum compression settings
  compressedPdf = await newPdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 100,
    compress: true,
  })

  progressCallback(75)

  // If we still can't get under the target size, return the best we could do
  return compressedPdf
}

/**
 * Checks if a single PDF page exceeds the target size
 * @param {ArrayBuffer} pdfBuffer - The PDF buffer
 * @param {number} pageIndex - The index of the page to check
 * @param {number} targetSizeBytes - Target size in bytes
 * @returns {Promise<boolean>} - True if the page exceeds the target size
 */
export async function doesPageExceedSize(pdfBuffer, pageIndex, targetSizeBytes) {
  const srcPdfDoc = await PDFDocument.load(pdfBuffer)
  const newPdfDoc = await PDFDocument.create()
  const [copiedPage] = await newPdfDoc.copyPages(srcPdfDoc, [pageIndex])
  newPdfDoc.addPage(copiedPage)

  const pageBytes = await newPdfDoc.save()
  return pageBytes.length > targetSizeBytes
}
