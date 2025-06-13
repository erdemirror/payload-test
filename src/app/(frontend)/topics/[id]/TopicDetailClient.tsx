'use client'
import { useAuth } from '../../../context/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { getCookie } from '@/lib/cookies'

export default function TopicDetailClient({ topic }: { topic: any }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this topic?')) return

    setDeleting(true)

    // Get token from cookies
    const token = getCookie('token')
    if (!token) {
      alert('You must be logged in to delete')
      setDeleting(false)
      return
    }

    try {
      const res = await fetch(`/api/topics/${topic.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        alert('Topic deleted successfully')
        router.push('/topics')
      } else {
        const data = await res.json()
        alert('Failed to delete: ' + (data.error || 'Unknown error'))
        setDeleting(false)
      }
    } catch (error) {
      alert('Error deleting topic')
      setDeleting(false)
    }
  }

  return (
    <div className="container">
      <h1>{topic.title}</h1>
      <p>{new Date(topic.date).toLocaleDateString()}</p>

      {topic.image && typeof topic.image === 'object' && topic.image.url && (
        <div
          className="image-container"
          style={{ position: 'relative', width: '100%', height: '300px' }}
        >
          <Image src={topic.image.url} alt={topic.title} fill style={{ objectFit: 'contain' }} />
        </div>
      )}

      <div>
        <h2>Description</h2>
        {topic.description && <RichText data={topic.description} />}
      </div>

      {user ? (
        <>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{ backgroundColor: 'red', color: 'white', marginTop: 20, marginRight: 10 }}
          >
            {deleting ? 'Deleting...' : 'Delete Topic'}
          </button>

          <button
            onClick={() => router.push(`/topics/${topic.id}/edit`)}
            style={{ backgroundColor: 'blue', color: 'white', marginTop: 20 }}
          >
            Edit Topic
          </button>
        </>
      ) : (
        <p>Please log in to delete or edit this topic.</p>
      )}

      <button onClick={() => router.back()} style={{ marginTop: 10 }}>
        ← Back to topics
      </button>
    </div>
  )
}
