'use client'

import { useState } from 'react'

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
