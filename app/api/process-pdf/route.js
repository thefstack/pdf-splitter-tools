import { NextResponse } from "next/server"
import { BlobServiceClient } from "@azure/storage-blob"

// Azure Blob Storage connection string
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")
    const blobName = searchParams.get("blobName")
    const fileName = searchParams.get("fileName")
    const splitSize = Number.parseInt(searchParams.get("splitSize")) || 10

    if (!jobId || !blobName || !fileName) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Create a blob client
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
    const containerClient = blobServiceClient.getContainerClient(containerName)

    // Update job info
    const jobInfoBlobName = `${jobId}/job-info.json`
    const jobInfoBlobClient = containerClient.getBlockBlobClient(jobInfoBlobName)

    try {
      const downloadResponse = await jobInfoBlobClient.download(0)
      const content = await streamToBuffer(downloadResponse.readableStreamBody)
      const jobInfo = JSON.parse(content.toString())

      // Update job status
      jobInfo.status = "processing"

      await jobInfoBlobClient.upload(JSON.stringify(jobInfo), JSON.stringify(jobInfo).length)

      // Start processing in the background
      processPdf(jobId, blobName, fileName, splitSize).catch(console.error)

      return NextResponse.json({ success: true, jobId })
    } catch (error) {
      console.error("Error updating job info:", error)
      return NextResponse.json({ error: "Failed to update job info" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error processing PDF:", error)
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 })
  }
}

// This function would typically be in a separate worker process
async function processPdf(jobId, blobName, fileName, splitSize) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
  const containerClient = blobServiceClient.getContainerClient(containerName)

  try {
    // Get job info
    const jobInfoBlobName = `${jobId}/job-info.json`
    const jobInfoBlobClient = containerClient.getBlockBlobClient(jobInfoBlobName)
    const jobInfoDownloadResponse = await jobInfoBlobClient.download(0)
    const jobInfoContent = await streamToBuffer(jobInfoDownloadResponse.readableStreamBody)
    const jobInfo = JSON.parse(jobInfoContent.toString())

    // Download the original PDF
    const originalBlobClient = containerClient.getBlockBlobClient(blobName)
    const downloadResponse = await originalBlobClient.download(0)
    const pdfBuffer = await streamToBuffer(downloadResponse.readableStreamBody)

    // In a real application, you would use a PDF library to split the PDF
    // For this example, we'll simulate splitting by creating multiple smaller files

    const splitSizeBytes = splitSize * 1024 * 1024 // Convert MB to bytes
    const totalSize = pdfBuffer.length
    const numParts = Math.ceil(totalSize / splitSizeBytes)

    // Create split files
    const splitFiles = []

    for (let i = 0; i < numParts; i++) {
      const start = i * splitSizeBytes
      const end = Math.min(start + splitSizeBytes, totalSize)
      const partBuffer = pdfBuffer.slice(start, end)

      const partFileName = `part_${i + 1}_${fileName}`
      const partBlobName = `${jobId}/parts/${partFileName}`
      const partBlobClient = containerClient.getBlockBlobClient(partBlobName)

      await partBlobClient.upload(partBuffer, partBuffer.length)

      splitFiles.push({
        name: partFileName,
        blobName: partBlobName,
      })
    }

    // Create a ZIP file containing all split PDFs
    // In a real application, you would use a library to create a ZIP file
    // For this example, we'll simulate it by creating a JSON file with links

    const zipInfo = {
      files: splitFiles,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    }

    const zipInfoBlobName = `${jobId}/zip-info.json`
    const zipInfoBlobClient = containerClient.getBlockBlobClient(zipInfoBlobName)
    await zipInfoBlobClient.upload(JSON.stringify(zipInfo), JSON.stringify(zipInfo).length)

    // Update job status
    jobInfo.status = "completed"
    jobInfo.splitFiles = splitFiles
    jobInfo.downloadUrl = `/api/download-zip?jobId=${jobId}`

    await jobInfoBlobClient.upload(JSON.stringify(jobInfo), JSON.stringify(jobInfo).length)
  } catch (error) {
    console.error("Error processing PDF:", error)

    // Update job status to failed
    const jobInfoBlobName = `${jobId}/job-info.json`
    const jobInfoBlobClient = containerClient.getBlockBlobClient(jobInfoBlobName)

    try {
      const jobInfoDownloadResponse = await jobInfoBlobClient.download(0)
      const jobInfoContent = await streamToBuffer(jobInfoDownloadResponse.readableStreamBody)
      const jobInfo = JSON.parse(jobInfoContent.toString())

      jobInfo.status = "failed"
      jobInfo.error = error.message

      await jobInfoBlobClient.upload(JSON.stringify(jobInfo), JSON.stringify(jobInfo).length)
    } catch (updateError) {
      console.error("Error updating job status:", updateError)
    }
  }
}

// Helper function to convert a readable stream to a buffer
async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data))
    })
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks))
    })
    readableStream.on("error", reject)
  })
}
