'use client'

export const setCookie = (name: string, value: string, days = 7) => {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value};${expires};path=/`
}

export const getCookie = (name: string): string | null => {
  const cookieName = `${name}=`
  const cookies = document.cookie.split(';')
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim()
    if (cookie.startsWith(cookieName)) {
      return cookie.substring(cookieName.length, cookie.length)
    }
  }
  return null
}

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
