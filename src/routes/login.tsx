import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Crown,
  Eye,
  EyeOff,
  LoaderCircle,
  LogIn,
  Shield,
  ShieldPlus,
  Sparkles,
  Sword,
  Swords,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { type FormEventHandler, useEffect, useState } from 'react'
import { buildApiUrl } from '#/lib/api'
import { consumeAuthFlashMessage, isAuthenticated, saveAuthTokens } from '#/lib/auth'

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      {
        title: 'Iniciar Sesión - MathG',
      },
      {
        name: 'description',
        content: 'Inicia sesión y continúa tu aventura épica en MathG.',
      },
    ],
  }),
  component: Login,
})

function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
    remember: false,
  })

  useEffect(() => {
    if (isAuthenticated()) {
      navigate({ to: '/dashboard', replace: true })
      return
    }

    const flashMessage = consumeAuthFlashMessage()
    if (flashMessage) {
      setSuccessMessage(flashMessage)
    }

    setCheckingSession(false)

    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }

    checkTouchDevice()

    const handleMouseMove = (event: MouseEvent) => {
      if (!isTouchDevice) {
        setMousePosition({ x: event.clientX, y: event.clientY })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isTouchDevice, navigate])

  const getErrorMessageFromResponse = (responseBody: unknown) => {
    if (!responseBody || typeof responseBody !== 'object') {
      return null
    }

    const message = (responseBody as { message?: unknown }).message

    if (typeof message === 'string') {
      return message
    }

    if (Array.isArray(message) && typeof message[0] === 'string') {
      return message[0]
    }

    return null
  }

  const submit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setProcessing(true)
    setErrorMessage('')

    try {
      const response = await fetch(buildApiUrl('auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail: formData.usernameOrEmail,
          password: formData.password,
        }),
      })

      const responseBody = await response.json().catch(() => null)

      if (!response.ok) {
        const apiMessage = getErrorMessageFromResponse(responseBody)

        throw new Error(apiMessage ?? 'No se pudo iniciar sesión')
      }

      saveAuthTokens({
        accessToken: responseBody.accessToken,
        refreshToken: responseBody.refreshToken,
      })

      navigate({ to: '/dashboard', replace: true })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo iniciar sesión')
    } finally {
      setProcessing(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.24),transparent_28%),linear-gradient(135deg,#1e1b4b_0%,#4c1d95_46%,#0f172a_100%)] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/10 px-6 py-4 text-sm font-semibold tracking-[0.22em] text-fuchsia-100/80 backdrop-blur-xl">
          Verificando sesión...
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.24),transparent_28%),linear-gradient(135deg,#1e1b4b_0%,#4c1d95_46%,#0f172a_100%)] text-white">
      {!isTouchDevice ? (
        <div
          className="pointer-events-none fixed z-50 h-4 w-4 rounded-full bg-fuchsia-300 mix-blend-difference transition-transform duration-100"
          style={{ left: mousePosition.x - 8, top: mousePosition.y - 8 }}
        />
      ) : null}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-fuchsia-300/20">
          <Crown className="h-32 w-32 animate-pulse" />
        </div>
        <div className="absolute top-20 right-20 text-indigo-300/20">
          <Sword className="h-24 w-24 rotate-45 animate-bounce" />
        </div>
        <div className="absolute bottom-20 left-20 text-fuchsia-300/20">
          <Shield className="h-28 w-28 animate-pulse" />
        </div>
        <div className="absolute bottom-10 right-10 text-indigo-300/20">
          <Sparkles className="h-20 w-20 animate-spin" />
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-3 md:p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="flex items-center justify-center">
              <Swords className="mr-3 h-12 w-12 animate-pulse text-fuchsia-300" />
              <h1 className="text-5xl font-black tracking-tight md:text-7xl">MathG</h1>
              <ShieldPlus className="ml-3 h-12 w-12 animate-pulse text-indigo-300" />
            </Link>
            <h2 className="mt-3 text-lg font-semibold tracking-[0.28em] text-fuchsia-100 md:text-2xl">
              Bienvenido, Héroe
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 px-4 py-8 shadow-2xl backdrop-blur-xl md:p-8">
            <form className="space-y-5" onSubmit={submit}>
              {successMessage ? (
                <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-100">
                  {successMessage}
                </p>
              ) : null}

              <label className="block space-y-2">
                <span className="text-lg font-semibold text-fuchsia-100">Usuario o correo electrónico</span>
                <input
                  type="text"
                  required
                  autoFocus
                  value={formData.usernameOrEmail}
                  onChange={(event) => setFormData((current) => ({ ...current, usernameOrEmail: event.target.value }))}
                  placeholder="usuario o correo@ejemplo.com"
                  className="h-12 w-full rounded-xl border border-fuchsia-300/40 bg-white/20 px-4 text-lg text-white placeholder:text-fuchsia-200/70 outline-none transition focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-400/40"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-lg font-semibold text-fuchsia-100">Contraseña</span>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                    placeholder="Contraseña"
                    className="h-12 w-full rounded-xl border border-fuchsia-300/40 bg-white/20 px-4 pr-12 text-lg text-white placeholder:text-fuchsia-200/70 outline-none transition focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-400/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-fuchsia-200 transition hover:text-white"
                    aria-label="Mostrar contraseña"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </label>

              <label className="flex items-center gap-3 text-fuchsia-100">
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(event) => setFormData((current) => ({ ...current, remember: event.target.checked }))}
                  className="h-4 w-4 rounded border-fuchsia-300/50 bg-white/20 text-fuchsia-600 focus:ring-fuchsia-400"
                />
                <span className="text-sm font-medium tracking-[0.18em]">Recuérdame</span>
              </label>

              <button
                type="submit"
                disabled={processing}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-fuchsia-600 to-indigo-600 px-6 text-lg font-semibold text-white transition hover:scale-[1.02] hover:from-fuchsia-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {processing ? (
                  <>
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                    Accediendo...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    Iniciar Aventura
                  </>
                )}
              </button>

                {errorMessage ? (
                  <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100">
                    {errorMessage}
                  </p>
                ) : null}

              <div className="text-center">
                <p className="mb-2 text-sm uppercase tracking-[0.28em] text-fuchsia-100/70">
                  ¿No tienes una cuenta?
                </p>
                <Link to="/register" className="text-lg font-semibold text-white transition hover:text-fuchsia-200">
                  Únete a la aventura aquí
                </Link>
              </div>
            </form>
          </div>

          <p className="mt-8 text-center text-sm tracking-widest text-fuchsia-200/70 md:text-base">
            Prepárate para una experiencia épica
          </p>
        </div>
      </div>
    </div>
  )
}