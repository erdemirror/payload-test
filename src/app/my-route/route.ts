// app/my-route/route.ts
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'
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
        return Response.json([{ message: 'All fields are required' }], { status: 400 })
      }

      // Create topic in your topics collection
      const topic = await payload.create({
        collection: 'topics',
        data: {
          title,
          date,
          description,
          image,
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

    // Return error in the format you specified
    if (error instanceof Error && error.message.includes('not allowed')) {
      return Response.json([{ message: 'You are not allowed to perform this action.' }], {
        status: 403,
      })
    }

    return Response.json([{ message: 'Failed to process request' }], { status: 500 })
  }
}

export const PUT = async (request: NextRequest) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    // Get the topic ID from query parameters
    const url = new URL(request.url)
    const topicId = url.searchParams.get('id')

    if (!topicId) {
      return Response.json([{ message: 'Topic ID is required' }], { status: 400 })
    }

    // Parse the request body
    const body = await request.json()
    const { title, date, description, image } = body

    // Validate required fields
    if (!title || !date || !description || !image) {
      return Response.json([{ message: 'All fields are required' }], { status: 400 })
    }

    // Update the topic
    const updatedTopic = await payload.update({
      collection: 'topics',
      id: topicId,
      data: {
        title,
        date,
        description,
        image,
      },
    })

    return Response.json({
      success: true,
      data: updatedTopic,
      message: 'Topic updated successfully',
    })
  } catch (error) {
    console.error('Error updating topic:', error)

    // Return error in the format you specified
    if (error instanceof Error && error.message.includes('not allowed')) {
      return Response.json([{ message: 'You are not allowed to perform this action.' }], {
        status: 403,
      })
    }

    return Response.json([{ message: 'Failed to update topic' }], { status: 500 })
  }
}
