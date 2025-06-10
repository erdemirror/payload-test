import { getPayload } from 'payload'
import { headers } from 'next/headers'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

import config from '@/payload.config'
import '../../styles.css'
import payloadConfig from '@/payload.config'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function TopicDetail({ params }: PageProps) {
  const { id } = await params
  const payloadConfig = await config
  const payloadConfigResolved = await config
  const payload = await getPayload({ config: payloadConfigResolved })
  const headerMap = await headers()

  try {
    const topic = await payload.findByID({
      collection: 'topics',
      id: id,
    })

    if (!topic) return notFound()

    return (
      <div className="container">
        {/* navbar */}
        <header className="header">
          <div className="logo">
            <Image
              src={'https://upload.wikimedia.org/wikipedia/commons/c/cb/Google_Keep_2020_Logo.svg'}
              alt={'logo'}
              width={50}
              height={50}
            />
            <span>Gogoogle Keep</span>
          </div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href={payloadConfig.routes.admin} target="_blank" rel="noreferrer">
              Admin
            </Link>
          </nav>
        </header>

        <main className="content">
          <h1>{topic.title}</h1>
          <p className="topic-date">🗓 {new Date(topic.date).toLocaleDateString()}</p>

          {topic.image && typeof topic.image === 'object' && topic.image.url && (
            <Image
              src={topic.image.url}
              alt={topic.title}
              width={600}
              height={600}
              className="topic-image"
            />
          )}

          <div className="topic-description">
            <h2>Description</h2>
            {topic.description && <RichText data={topic.description} />}
          </div>
        </main>

        <footer className="footer">
          <Link href="/" className="codeLink">
            ← Back to topics
          </Link>
        </footer>
      </div>
    )
  } catch (error) {
    console.error(error)
    return notFound()
  }
}
