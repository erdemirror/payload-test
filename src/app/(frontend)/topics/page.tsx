import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'

import config from '@/payload.config'
import Navbar from '../components/Navbar'
import { useAuth } from '../../context/AuthContext'
import '../styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  let user = null

  try {
    const authResult = await payload.auth({ headers })
    user = authResult?.user || null
  } catch (error) {
    // Not logged in or invalid token
    user = null
  }

  const topics = await payload.find({
    collection: 'topics',
    limit: 5,
    sort: '-date',
  })

  return (
    <div className="container">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="content">
        <h1>{'Бузартайгаа ч хутгалдаж байна даа.'}</h1>

        <h2>Topics</h2>

        <div className="topics">
          {topics.docs.map((topic) => (
            <Link key={topic.id} href={`/topics/${topic.id}`} className="topic-card-link">
              <div className="topic-card">
                {topic.image && typeof topic.image === 'object' && topic.image.url && (
                  <Image
                    src={topic.image.url}
                    alt={topic.title}
                    width={400}
                    height={400}
                    className="topic-image"
                  />
                )}
                <h3>{topic.title}</h3>
              </div>
            </Link>
          ))}
        </div>

        {topics.docs.length === 0 && (
          <div className="empty-state">
            <p>No topics available.</p>
            {user && (
              <p>
                <Link href="/topics/add">Create your first topic!</Link>
              </p>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Y&apos;all wondering who made this?</p>
        <Link className="codeLink" href="https://www.instagram.com/eye0fsk4d1">
          <code>Erdemirror</code>
        </Link>
      </footer>
    </div>
  )
}
