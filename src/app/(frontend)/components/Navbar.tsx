'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="header">
      <div className="logo">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Google_Keep_2020_Logo.svg"
          alt="logo"
          width={50}
          height={50}
        />
        <span>Gogoogle Keep</span>
      </div>
      <nav className="nav">
        <Link href="/topics">Home</Link>

        {user && (
          <>
            <Link href="/topics/add">Add a Topic</Link>
            <Link href="/topics/addmedia">Add a Media</Link>
            <Link href="/admin" target="_blank" rel="noreferrer">
              Admin
            </Link>

            <button onClick={logout}>Logout</button>
          </>
        )}

        {!user && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}
