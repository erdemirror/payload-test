// app/api/logout/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' })
  // Clear cookie by setting it to empty and expired
  response.cookies.set('token', '', { maxAge: 0, path: '/' })
  return response
}
