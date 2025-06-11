'use client'
import { useState } from 'react'
import axios from 'axios'

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const res = await axios.post('/login', formData, {
        withCredentials: true,
      })
      setMessage('Logged in successfully')
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <button type="submit">Login</button>
      <p>{message}</p>
    </form>
  )
}
