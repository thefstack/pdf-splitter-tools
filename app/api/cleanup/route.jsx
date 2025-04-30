import { NextResponse } from "next/server"
import { BlobServiceClient } from "@azure/storage-blob"

// Azure Blob Storage connection string
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME

export async function GET(request) {
  try {
    // Check for authorization (in a real app, you would use a more secure method)
    const { searchParams } = new URL(request.url)
    const authKey = searchParams.get("authKey")

    if (authKey !== process.env.CLEANUP_AUTH_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create a blob client
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
    const containerClient = blobServiceClient.getContainerClient(containerName)

    // List all blobs
    const deletedCount = await cleanupExpiredFiles(containerClient)

    return NextResponse.json({ message: `Deleted ${deletedCount} expired files` })
  } catch (error) {
    console.error("Error during cleanup:", error)
    return NextResponse.json({ error: "Failed to clean up expired files" }, { status: 500 })
  }
}

async function cleanupExpiredFiles(containerClient) {
  let deletedCount = 0
  const now = new Date()

  // List all job info files
  for await (const blob of containerClient.listBlobsFlat({ prefix: "" })) {
    if (blob.name.endsWith("/job-info.json")) {
      try {
        const blobClient = containerClient.getBlobClient(blob.name)
        const properties = await blobClient.getProperties()

        // Check if the blob has expiry metadata
        if (properties.metadata && properties.metadata.expiryTime) {
          const expiryTime = new Date(properties.metadata.expiryTime)

          if (now > expiryTime) {
            // Get the job ID from the blob name
            const jobId = blob.name.split("/")[0]

            // Delete all blobs with this job ID prefix
            for await (const jobBlob of containerClient.listBlobsFlat({ prefix: `${jobId}/` })) {
              await containerClient.deleteBlob(jobBlob.name)
              deletedCount++
            }
          }
        }
      } catch (error) {
        console.error(`Error processing blob ${blob.name}:`, error)
      }
    }
  }

  return deletedCount
}
