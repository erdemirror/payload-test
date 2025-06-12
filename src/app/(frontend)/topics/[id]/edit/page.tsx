'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import LexicalEditor from '../../../components/LexicalEditor'
import Link from 'next/link'
import { useAuth } from '../../../../context/AuthContext'
import { useRouter, useParams } from 'next/navigation'

interface MediaItem {
  id: string
  url: string
  alt: string
  filename: string
}

export default function EditTopicPage() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: null, // Lexical JSON
    image: '',
  })
  const [images, setImages] = useState<MediaItem[] | null>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const { id } = useParams() // Get topic ID from route

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  // Fetch images for selection
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/my-route') // your images API
        const data = await res.json()
        setImages(data.data || [])
      } catch (err) {
        console.error('Failed to fetch images:', err)
        setImages([])
      }
    }

    fetchImages()
  }, [])

  // Fetch the topic data by ID and prefill the form
  useEffect(() => {
    if (!id) return

    const fetchTopic = async () => {
      try {
        const res = await fetch(`/api/topics/${id}`)
        if (!res.ok) throw new Error('Failed to fetch topic')

        const topic = await res.json()

        setFormData({
          title: topic.title || '',
          date: topic.date ? topic.date.split('T')[0] : '',
          description: topic.description || null,
          image: topic.image || '',
        })
      } catch (err) {
        console.error(err)
        alert('Failed to load topic data')
      }
    }

    fetchTopic()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageSelect = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      image: id,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.image || !formData.title || !formData.date || !formData.description) {
      alert('All fields are required including image and description.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/topics/${id}`, {
        method: 'PUT', // update method

        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      console.log(res)
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Update failed')
      }

      alert('Topic updated successfully!')
      router.push(`/topics/${id}`)
    } catch (err) {
      console.error(err)
      alert(`Update failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div>
      <center>
        <h1>Edit Topic</h1>
      </center>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            placeholder="e.g., A photo"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>

        <div>
          <label>Description</label>
          <LexicalEditor
            onChange={(json) => {
              setFormData((prev) => ({
                ...prev,
                description: json,
              }))
            }}
          />
        </div>

        <div>
          <label>Select an Image</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {images === null ? (
              <p>Loading images...</p>
            ) : images.length === 0 ? (
              <p>No images found.</p>
            ) : (
              images.map((media) => (
                <Image
                  key={media.id}
                  src={media.url}
                  alt={media.alt || 'Image'}
                  width={100}
                  height={100}
                  onClick={() => handleImageSelect(media.id)}
                  style={{
                    objectFit: 'cover',
                    border: formData.image === media.id ? '3px solid blue' : '1px solid gray',
                    cursor: 'pointer',
                  }}
                />
              ))
            )}
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Topic'}
        </button>
      </form>
    </div>
  )
}
