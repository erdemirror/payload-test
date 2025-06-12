import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const payload = await getPayload({ config: configPromise })

    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return Response.json({ error: 'Invalid content type' }, { status: 400 })
    }

    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    return Response.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: result.user.id,
          email: result.user.email,
        },
        token: result.token,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Login error:', error)
    return Response.json(
      {
        error: 'Login failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 401 },
    )
  }
}
