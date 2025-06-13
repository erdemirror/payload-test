'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import styled from 'styled-components'

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;

  span {
    font-size: 1.5rem;
    font-weight: 600;
    color: #5f6368;
  }
`

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`

const NavLink = styled(Link)`
  color: #5f6368;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.2s ease;

  &:hover {
    color: #1a73e8;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #1a73e8;
    transition: width 0.2s ease;
  }

  &:hover::after {
    width: 100%;
  }
`

const UserEmail = styled.span`
  font-size: 0.9rem;
  color: #5f6368;
  margin: 0 0.5rem;
  padding: 0.5rem;
  background-color: #f1f3f4;
  border-radius: 4px;
`

const LogoutButton = styled.button`
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1765cc;
  }
`

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <Header>
      <LogoContainer>
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Google_Keep_2020_Logo.svg"
          alt="logo"
          width={50}
          height={50}
        />
        <span>Gogoogle Keep</span>
      </LogoContainer>

      <Nav>
        <NavLink href="/topics">Home</NavLink>

        {user ? (
          <>
            <NavLink href="/topics/add">Add a Topic</NavLink>
            <NavLink href="/topics/addmedia">Add a Media</NavLink>
            <NavLink href="/admin" target="_blank" rel="noreferrer">
              Admin
            </NavLink>
            <UserEmail>User: {user.email}</UserEmail>
            <LogoutButton onClick={logout}>Logout</LogoutButton>
          </>
        ) : (
          <>
            <NavLink href="/login">Login</NavLink>
            <NavLink href="/register">Register</NavLink>
          </>
        )}
      </Nav>
    </Header>
  )
}
