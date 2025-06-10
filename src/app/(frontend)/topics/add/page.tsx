'use client'

import { useState } from 'react'
import '../../styles.css'

export default function MyForm() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log(formData)
  }

  return (
    <div>
      <center>
        <h1>Add a Topic</h1>
      </center>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="e.g., helo"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="e.g., helo"
            required
          />
        </div>

        {/* <div>
          <label htmlFor="image">Image</label>
          <input
            type="image"
            id="image"
            name="image"
            placeholder="e.g., helo"
            onChange={handleChange}
            required
          />
        </div> */}

        {/* --- NEW SECTION FOR IMAGE ALT TEXT --- */}

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
