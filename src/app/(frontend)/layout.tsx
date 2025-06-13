import React from 'react'
import './styles.css'
import { AuthProvider } from '../context/AuthContext'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'BUY BKB',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
