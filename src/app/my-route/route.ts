// app/my-route/route.ts
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest } from 'next/server'
import { put } from '@vercel/blob'

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
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return Response.json({ error: 'Vercel Blob token is not configured' }, { status: 500 })
    }

    const payload = await getPayload({
      config: configPromise,
    })

    const formData = await request.formData()
    const file = formData.get('file') as File
    const alt = formData.get('alt') as string

    if (!file || !alt) {
      return Response.json({ error: 'File and alt text are required' }, { status: 400 })
    }

    // validate
    if (!file.type.startsWith('image/')) {
      return Response.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // vercel blob
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
