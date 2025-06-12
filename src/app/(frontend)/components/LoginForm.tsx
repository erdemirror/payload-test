'use client'
import { cookies } from 'next/headers'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    const res = await fetch('/my-route/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (res.ok) {
      // ✅ Save token to localStorage
      localStorage.setItem('token', data.token)

      // Optional: Save user info too
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirect to your app's homepage or dashboard
      router.push('/topics')
    } else {
      alert(data.error || 'Login failed')
    }
  }

  return (
    <div>
      <h2>Login</h2>
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
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}
