'use client'

import Link from 'next/link'
import styled from 'styled-components'

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 50px 70px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
  width: 320px;
  text-align: center;
`

const Button = styled.button`
  width: 100%;
  padding: 14px 0;
  border-radius: 14px;
  background: #4a90e2;
  color: white;
  font-weight: 700;
  font-size: 18px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #357abd;
  }
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  width: 100%;
  height: 100%;
  line-height: inherit;
`

const Heading = styled.h1`
  color: white;
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 0;
`
import config from '@/payload.config'
export default function Home() {
  return (
    <StyledContainer>
      <GlassCard>
        <Button>
          <StyledLink href="/login">Login</StyledLink>
        </Button>
        <Button>
          <StyledLink href="/register">Register</StyledLink>
        </Button>
      </GlassCard>
    </StyledContainer>
  )
}
