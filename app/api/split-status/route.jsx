// Change the file extension from .jsx to .js since this is a server component

import { NextResponse } from "next/server"
import { BlobServiceClient } from "@azure/storage-blob"

// Azure Blob Storage connection string
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")

    if (!jobId) {
      return NextResponse.json({ error: "No job ID provided" }, { status: 400 })
    }

    // Create a blob client
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
    const containerClient = blobServiceClient.getContainerClient(containerName)

    // Get job info
    const jobInfoBlobName = `${jobId}/job-info.json`
    const jobInfoBlobClient = containerClient.getBlockBlobClient(jobInfoBlobName)

    try {
      const downloadResponse = await jobInfoBlobClient.download(0)
      const content = await streamToBuffer(downloadResponse.readableStreamBody)
      const jobInfo = JSON.parse(content.toString())

      return NextResponse.json({
        status: jobInfo.status,
        downloadUrl: jobInfo.downloadUrl,
        error: jobInfo.error,
      })
    } catch (error) {
      if (error.statusCode === 404) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 })
      }
      throw error
    }
  } catch (error) {
    console.error("Error checking job status:", error)
    return NextResponse.json({ error: "Failed to check job status" }, { status: 500 })
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
