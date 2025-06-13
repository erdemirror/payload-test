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

// Cookie utility function
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
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
  const { id } = useParams()

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
        // Get token from cookies for the GET request too
        const token = getCookie('token')

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        }

        // Add authorization header if token exists
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }

        const res = await fetch(`/api/topics/${id}`, {
          headers,
        })

        if (!res.ok) {
          const errorData = await res.json()

          // Handle the specific error format
          let errorMessage = 'Failed to load topic'

          if (Array.isArray(errorData) && errorData.length > 0 && errorData[0].message) {
            errorMessage = errorData[0].message
          } else if (errorData.error) {
            errorMessage = errorData.error
          } else if (errorData.message) {
            errorMessage = errorData.message
          }

          throw new Error(errorMessage)
        }

        const topic = await res.json()

        setFormData({
          title: topic.title || '',
          date: topic.date ? topic.date.split('T')[0] : '',
          description: topic.description || null,
          image: topic.image || '',
        })
      } catch (err) {
        console.error('Failed to fetch topic:', err)
        alert(`Failed to load topic data: ${err instanceof Error ? err.message : 'Unknown error'}`)
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

    const token = getCookie('token')

    if (!token) {
      alert('You must be logged in to update')
      setLoading(false)
      return
    }

    try {
      const updateUrl = `/my-route?id=${id}`

      const res = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorData = await res.json()

        let errorMessage = 'Update failed'
        if (Array.isArray(errorData) && errorData[0]?.message) {
          errorMessage = errorData[0].message
        } else if (errorData.error) {
          errorMessage = errorData.error
        } else if (errorData.message) {
          errorMessage = errorData.message
        }

        throw new Error(errorMessage)
      }

      const responseData = await res.json()

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
