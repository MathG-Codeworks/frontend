export function getApiBaseUrl() {
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

  if (!apiBaseUrl) {
    throw new Error('No se definio API_URL en el entorno del frontend')
  }

  return apiBaseUrl.endsWith('/') ? apiBaseUrl : `${apiBaseUrl}/`
}

export function buildApiUrl(path: string) {
  return new URL(path, getApiBaseUrl()).toString()
}