'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

interface MediaItem {
  id: string
  url: string
  alt: string
  filename: string
}

export default function AddTopicPage() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    image: '', // stores selected image URL
  })

  const [images, setImages] = useState<MediaItem[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/my-route')
        const data = await res.json()
        setImages(data.data || [])
      } catch (err) {
        console.error('Failed to fetch images:', err)
        setImages([])
      }
    }

    fetchImages()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageSelect = (id: string) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        image: id,
      }
      console.log('Selected image ID:', updated.image) // ✅ Logs the image ID
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.image || !formData.title || !formData.date || !formData.description) {
      alert('All fields are required including image.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/my-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await res.json()
      alert('Topic created successfully!')
      setFormData({
        title: '',
        date: '',
        description: '',
        image: '',
      })
    } catch (err) {
      console.error(err)
      alert(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <center>
        <h1>Add a Topic</h1>
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
          <textarea
            name="description"
            value={formData.description}
            placeholder="e.g., Description..."
            onChange={handleChange}
            required
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
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
