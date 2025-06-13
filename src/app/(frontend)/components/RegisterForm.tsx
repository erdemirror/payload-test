'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterForm() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/my-route/register', formData)
      setMessage('Registered successfully! Redirecting to login...')

      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
        autoComplete="email"
        className="form-input"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
        autoComplete="new-password"
        className="form-input"
      />
      <button type="submit" className="submit-button">
        Register
      </button>
      <p className="form-message">{message}</p>
      <div className="register-link">
        Already have an account? <Link href="/login">Login</Link>
      </div>
      <center>
        {' '}
        <div className="Home-link">
          <Link href="/topics">Topics</Link>
        </div>
      </center>

      <style jsx>{`
        .form-container {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px 50px;
          max-width: 400px;
          margin: 60px auto;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          gap: 25px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .form-input {
          padding: 12px 15px;
          border-radius: 10px;
          border: 1.5px solid #ddd;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #4a90e2;
          background-color: #f0f8ff;
        }

        .submit-button {
          padding: 12px 0;
          border-radius: 12px;
          background: #4a90e2;
          color: white;
          font-weight: 600;
          font-size: 18px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-button:hover {
          background: #357abd;
        }

        .form-message {
          color: white;
          font-weight: 500;
          min-height: 24px;
          text-align: center;
        }
        .register-link {
          text-align: center;
          color: white;
          font-size: 14px;
        }
      `}</style>
    </form>
  )
}
