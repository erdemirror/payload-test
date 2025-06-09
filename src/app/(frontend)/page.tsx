import { headers as getHeaders } from 'next/headers'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'
import { RichText } from '@payloadcms/richtext-lexical/react'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const topics = await payload.find({
    collection: 'topics',
    limit: 5,
    sort: '-date',
  })

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
          <a href="/">Home</a>
          <a href={payloadConfig.routes.admin} target="_blank" rel="noreferrer">
            Admin
          </a>
        </nav>
      </header>

      {/* main */}
      <main className="content">
        <h1>{user ? `${user.email} хам айн? Юу байна?` : 'Юу байна даа хамаа.'}</h1>

        <h2>Topics</h2>
        <div className="topics">
          {topics.docs.map((topic) => (
            <div key={topic.id} className="topic-card">
              {topic.image?.url && (
                <Image
                  src={topic.image.url}
                  alt={topic.title}
                  width={400}
                  height={250}
                  className="topic-image"
                />
              )}
              <h3>{topic.title}</h3>
              <p className="topic-date">{new Date(topic.date).toLocaleDateString()}</p>
              {topic.description && <RichText content={topic.description} />}
            </div>
          ))}
        </div>
      </main>

      {/* footer */}
      <footer className="footer">
        <p>Y’all wondering who made this?</p>
        <a className="codeLink" href="https://www.instagram.com/eye0fsk4d1">
          <code>Erdemirror</code>
        </a>
      </footer>
    </div>
  )
}
