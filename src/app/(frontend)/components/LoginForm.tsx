'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setCookie } from '@/lib/cookies'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/my-route/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setCookie('token', data.token)
        setCookie('user', JSON.stringify(data.user))
        router.push('/topics')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="error-message">{error}</p>}

      <div className="register-link">
        Don&apos;t have an account? <Link href="/register">Register</Link>
      </div>

      <style jsx>{`
        .login-container {
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

        h2 {
          color: white;
          text-align: center;
          margin: 0 0 10px 0;
          font-size: 24px;
        }

        input {
          padding: 12px 15px;
          border-radius: 10px;
          border: 1.5px solid #ddd;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        input:focus {
          outline: none;
          border-color: #4a90e2;
          background-color: #f0f8ff;
        }

        button {
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

        button:hover:not(:disabled) {
          background: #357abd;
        }

        button:disabled {
          background: #a0c4f7;
          cursor: not-allowed;
        }

        .error-message {
          color: #ff6b6b;
          font-weight: 500;
          min-height: 24px;
          text-align: center;
          margin: 0;
        }

        .register-link {
          text-align: center;
          color: white;
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}
