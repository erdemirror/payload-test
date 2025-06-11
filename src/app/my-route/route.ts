// app/my-route/route.ts
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest } from 'next/server'
import { put } from '@vercel/blob'

export const GET = async (request: Request) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    // Get all media documents from the media collectionn
    const media = await payload.find({
      collection: 'media',
      limit: 20,
      sort: '-createdAt',
      where: {
        mimeType: {
          like: 'image/%',
        },
      },
    })

    return Response.json({
      success: true,
      data: media.docs,
      totalDocs: media.totalDocs,
    })
  } catch (error) {
    console.error('Error fetching media:', error)
    return Response.json(
      {
        error: 'Failed to fetch media',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    )
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    // Check if this is a file upload (FormData) or topic creation (JSON)
    const contentType = request.headers.get('content-type')

    if (contentType?.includes('multipart/form-data')) {
      // Handle file upload
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return Response.json({ error: 'Vercel Blob token is not configured' }, { status: 500 })
      }

      const formData = await request.formData()
      const file = formData.get('file') as File
      const alt = formData.get('alt') as string

      if (!file || !alt) {
        return Response.json({ error: 'File and alt text are required' }, { status: 400 })
      }

      if (!file.type.startsWith('image/')) {
        return Response.json({ error: 'Only image files are allowed' }, { status: 400 })
      }

      const blob = await put(file.name, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })

      const media = await payload.create({
        collection: 'media',
        data: {
          alt: alt,
          filename: file.name,
          mimeType: file.type,
          filesize: file.size,
          url: blob.url,
        },
      })

      return Response.json({
        success: true,
        data: {
          ...media,
          blobUrl: blob.url,
          downloadUrl: blob.downloadUrl,
        },
        message: 'Media uploaded successfully to Vercel Blob',
      })
    } else {
      // Handle topic creation (JSON)
      const body = await request.json()
      const { title, date, description, image } = body

      if (!title || !date || !description || !image) {
        return Response.json({ error: 'All fields are required' }, { status: 400 })
      }

      // Create topic in your topics collection (adjust collection name as needed)
      const topic = await payload.create({
        collection: 'topics', // Adjust this to your actual collection name
        data: {
          title,
          date,
          description,
          image, // This should be the URL of the selected image
        },
      })

      return Response.json({
        success: true,
        data: topic,
        message: 'Topic created successfully',
      })
    }
  } catch (error) {
    console.error('API error:', error)
    return Response.json(
      {
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    )
  }
}
