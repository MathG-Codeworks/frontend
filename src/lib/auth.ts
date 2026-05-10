export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const FLASH_MESSAGE_KEY = 'auth_flash_message'

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
}

export function saveAuthTokens(tokens: AuthTokens) {
  if (!isBrowser()) {
    return
  }

  window.sessionStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  window.sessionStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
}

export function getAuthTokens(): AuthTokens | null {
  if (!isBrowser()) {
    return null
  }

  const accessToken = window.sessionStorage.getItem(ACCESS_TOKEN_KEY)
  const refreshToken = window.sessionStorage.getItem(REFRESH_TOKEN_KEY)

  if (!accessToken || !refreshToken) {
    return null
  }

  return { accessToken, refreshToken }
}

export function clearAuthTokens() {
  if (!isBrowser()) {
    return
  }

  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function isAuthenticated() {
  return getAuthTokens() !== null
}

export function setAuthFlashMessage(message: string) {
  if (!isBrowser()) {
    return
  }

  window.sessionStorage.setItem(FLASH_MESSAGE_KEY, message)
}

export function consumeAuthFlashMessage() {
  if (!isBrowser()) {
    return null
  }

  const message = window.sessionStorage.getItem(FLASH_MESSAGE_KEY)
  window.sessionStorage.removeItem(FLASH_MESSAGE_KEY)

  return message
}