import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest } from 'next/server'

export const GET = async (request: Request) => {
  const payload = await getPayload({
    config: configPromise,
  })

  return Response.json({
    message: 'This is an example of a custom route.',
  })
}

export const POST = async (request: NextRequest) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const formData = await request.formData()
    const file = formData.get('file') as File
    const alt = formData.get('alt') as string

    if (!file || !alt) {
      return Response.json({ error: 'File and alt text are required' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return Response.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create the media document using Payload's API
    const media = await payload.create({
      collection: 'media', // Make sure this matches your collection name
      data: {
        alt: alt,
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
    })

    return Response.json({
      success: true,
      data: media,
      message: 'Media uploaded successfully',
    })
  } catch (error) {
    console.error('Media upload error:', error)
    return Response.json(
      {
        error: 'Failed to upload media',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    )
  }
}
