'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      await axios.post('/register', formData)
      setMessage('Registered successfully! Redirecting to login...')
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <button type="submit">Register</button>
      <p>{message}</p>
    </form>
  )
}
