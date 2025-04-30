// Change the file extension from .jsx to .js since this is a server component
// and update the imports to ensure they're properly used

import { NextResponse } from "next/server"
import { BlobServiceClient } from "@azure/storage-blob"
import { v4 as uuidv4 } from "uuid"

// Azure Blob Storage connection string
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")
    const splitSize = Number.parseInt(formData.get("splitSize")) || 10 // Default to 10MB if not specified

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Generate a unique job ID
    const jobId = uuidv4()

    // Create a blob client
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
    const containerClient = blobServiceClient.getContainerClient(containerName)

    // Upload the original file to Azure Blob Storage
    const originalBlobName = `${jobId}/original/${file.name}`
    const blockBlobClient = containerClient.getBlockBlobClient(originalBlobName)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await blockBlobClient.upload(buffer, buffer.length)

    // Set expiration time to 1 hour from now
    const expiryTime = new Date()
    expiryTime.setHours(expiryTime.getHours() + 1)

    // Set metadata to track expiration
    await blockBlobClient.setMetadata({
      expiryTime: expiryTime.toISOString(),
    })

    // Store job information
    const jobInfo = {
      jobId,
      originalBlobName,
      splitSize,
      fileName: file.name,
      status: "processing",
    }

    // In a real application, you would store this in a database
    // For this example, we'll store it in blob storage as well
    const jobInfoBlobName = `${jobId}/job-info.json`
    const jobInfoBlobClient = containerClient.getBlockBlobClient(jobInfoBlobName)
    await jobInfoBlobClient.upload(JSON.stringify(jobInfo), JSON.stringify(jobInfo).length)

    // Trigger the background processing
    // In a real application, this would be done by a queue or worker
    // For this example, we'll do it asynchronously
    processPdf(jobId).catch(console.error)

    return NextResponse.json({ jobId })
  } catch (error) {
    console.error("Error processing upload:", error)
    return NextResponse.json({ error: "Failed to process upload" }, { status: 500 })
  }
}

// This function would typically be in a separate worker process
async function processPdf(jobId) {
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
    const originalBlobClient = containerClient.getBlockBlobClient(jobInfo.originalBlobName)
    const downloadResponse = await originalBlobClient.download(0)
    const pdfBuffer = await streamToBuffer(downloadResponse.readableStreamBody)

    // In a real application, you would use a PDF library to split the PDF
    // For this example, we'll simulate splitting by creating multiple smaller files

    const splitSizeBytes = jobInfo.splitSize * 1024 * 1024 // Convert MB to bytes
    const totalSize = pdfBuffer.length
    const numParts = Math.ceil(totalSize / splitSizeBytes)

    // Create split files
    const splitFiles = []

    for (let i = 0; i < numParts; i++) {
      const start = i * splitSizeBytes
      const end = Math.min(start + splitSizeBytes, totalSize)
      const partBuffer = pdfBuffer.slice(start, end)

      const partFileName = `part_${i + 1}_${jobInfo.fileName}`
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
