'use client'

import Link from 'next/link'
import styled from 'styled-components'

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #lightblue;
`

const StyledButton = styled.button`
  background-color: lightblue;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  transition: background-color 0.3s ease;
  &:hover {
    background-color: #5dade2;
  }
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
  font-weight: 600;
  font-size: 16px;
`

export default function Home() {
  return (
    <StyledContainer>
      <StyledButton>
        <StyledLink href="/topics">Lets dive in </StyledLink>
      </StyledButton>
    </StyledContainer>
  )
}
