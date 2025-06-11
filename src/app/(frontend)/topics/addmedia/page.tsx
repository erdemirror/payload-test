'use client'

import config from '@/payload.config'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import LexicalEditor from '../../components/LexicalEditor' // ✅ correct path
import Link from 'next/link'

export default function AddMediaPage() {
  const [formData, setFormData] = useState({
    image: null as File | null,
    alt: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files![0],
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.image || !formData.alt) {
      alert('Both image and alt text are required.')
      return
    }

    const payloadFormData = new FormData()
    payloadFormData.append('file', formData.image)
    payloadFormData.append('alt', formData.alt)

    try {
      const res = await fetch('/my-route', {
        method: 'POST',
        body: payloadFormData,
      })

      if (!res.ok) {
        const error = await res.text()
        throw new Error(error)
      }

      const data = await res.json()
      alert('Upload successful!')

      // Reset form after successful upload
      setFormData({
        image: null,
        alt: '',
      })
    } catch (err) {
      alert('Upload failed. See console for details.')
    }
  }

  return (
    <div>
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
          <Link href="/topics/add">Add a Topic</Link>
          <Link href="/topics/addmedia">Add a Media</Link>
          <Link href="/topics">Home</Link>
        </nav>
      </header>
      <center>
        <h1>Add a Media</h1>
      </center>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div>
          <label htmlFor="alt">Image Alt Text</label>
          <input
            type="text"
            id="alt"
            name="alt"
            value={formData.alt}
            onChange={handleChange}
            placeholder="e.g., A photo"
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
