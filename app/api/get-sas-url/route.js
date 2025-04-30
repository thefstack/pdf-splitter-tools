import { NextResponse } from "next/server"
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob"
import { v4 as uuidv4 } from "uuid"

// Azure Blob Storage connection string
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME

// Parse connection string to get account name and key
function parseConnectionString(connectionString) {
  const parts = connectionString.split(";")
  let accountName = ""
  let accountKey = ""

  for (const part of parts) {
    if (part.startsWith("AccountName=")) {
      accountName = part.split("=")[1]
    } else if (part.startsWith("AccountKey=")) {
      accountKey = part.split("=")[1]
    }
  }

  return { accountName, accountKey }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get("fileName")
    const splitSize = searchParams.get("splitSize")

    if (!fileName) {
      return NextResponse.json({ error: "No file name provided" }, { status: 400 })
    }

    // Generate a unique job ID
    const jobId = uuidv4()

    // Create a blob name
    const blobName = `${jobId}/original/${fileName}`

    // Parse connection string
    const { accountName, accountKey } = parseConnectionString(connectionString)

    if (!accountName || !accountKey) {
      return NextResponse.json({ error: "Invalid storage credentials" }, { status: 500 })
    }

    // Create a SAS token with write permission
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey)

    // Set expiration time to 1 hour from now
    const expiryTime = new Date()
    expiryTime.setHours(expiryTime.getHours() + 1)

    const sasOptions = {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("w"), // Write permission
      startsOn: new Date(),
      expiresOn: expiryTime,
    }

    const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString()

    // Create the full SAS URL
    const sasUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`

    // Create job info
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
    const containerClient = blobServiceClient.getContainerClient(containerName)

    // Store initial job information
    const jobInfo = {
      jobId,
      originalBlobName: blobName,
      splitSize: Number.parseInt(splitSize) || 10,
      fileName,
      status: "uploading",
      createdAt: new Date().toISOString(),
      expiryTime: expiryTime.toISOString(),
    }

    // Store job info in blob storage
    const jobInfoBlobName = `${jobId}/job-info.json`
    const jobInfoBlobClient = containerClient.getBlockBlobClient(jobInfoBlobName)
    await jobInfoBlobClient.upload(JSON.stringify(jobInfo), JSON.stringify(jobInfo).length)

    return NextResponse.json({
      sasUrl,
      blobName,
      jobId,
    })
  } catch (error) {
    console.error("Error generating SAS URL:", error)
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 })
  }
}
