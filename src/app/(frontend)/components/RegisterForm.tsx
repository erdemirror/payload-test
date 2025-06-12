'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'

const FormContainer = styled.form`
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
`

const Input = styled.input`
  padding: 12px 15px;
  border-radius: 10px;
  border: 1.5px solid #ddd;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a90e2;
    background-color: #f0f8ff;
  }
`

const Button = styled.button`
  padding: 12px 0;
  border-radius: 12px;
  background: #4a90e2;
  color: white;
  font-weight: 600;
  font-size: 18px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #357abd;
  }
`

const Message = styled.p`
  color: white;
  font-weight: 500;
  min-height: 24px;
  text-align: center;
`

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
    <FormContainer onSubmit={handleSubmit}>
      <Input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
        autoComplete="email"
      />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
        autoComplete="new-password"
      />
      <Button type="submit">Register</Button>
      <Message>{message}</Message>
    </FormContainer>
  )
}
