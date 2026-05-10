import { Outlet, createFileRoute, Link } from '@tanstack/react-router'
import {
  Activity,
  BarChart3,
  Download,
  FileDown,
  FileImage,
  LogOut,
  Rocket,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { buildApiUrl } from '#/lib/api'
import { clearAuthTokens, getAuthTokens, isAuthenticated } from '#/lib/auth'

type SessionData = {
  date: string
  count: number
}

type PlanetData = {
  id: string
  name: string
  profilesCount: number
}

const difficulties = [
  { id: '1', name: 'Facil', exercises: 42 },
  { id: '2', name: 'Medio', exercises: 35 },
  { id: '3', name: 'Dificil', exercises: 19 },
]

const sessionsLastMonth: SessionData[] = [
  { date: '01', count: 22 },
  { date: '05', count: 35 },
  { date: '10', count: 30 },
  { date: '15', count: 47 },
  { date: '20', count: 53 },
  { date: '25', count: 41 },
  { date: '30', count: 58 },
]

const profilesPerPlanet: PlanetData[] = [
  { id: 'p1', name: 'Nebula Prime', profilesCount: 220 },
  { id: 'p2', name: 'Orion Rift', profilesCount: 176 },
  { id: 'p3', name: 'Titan Core', profilesCount: 141 },
  { id: 'p4', name: 'Astra Vale', profilesCount: 90 },
]

const users = 10324
const sessions = 28764
const averageProgress = 78

export const Route = createFileRoute('/dashboard')({
  head: () => ({
    meta: [
      { title: 'Dashboard - MathG' },
      {
        name: 'description',
        content: 'Panel de control con metricas clave del juego 3D multijugador.',
      },
    ],
  }),
  component: Dashboard,
})

function downloadFile(content: string, fileName: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

function Dashboard() {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const [checkingSession, setCheckingSession] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const totalProfiles = profilesPerPlanet.reduce((sum, planet) => sum + planet.profilesCount, 0)

  useEffect(() => {
    if (!isAuthenticated()) {
      clearAuthTokens()
      navigate({ to: '/login', replace: true })
      return
    }

    setCheckingSession(false)
  }, [navigate])

  const maxSessionCount = Math.max(...sessionsLastMonth.map((entry) => entry.count), 1)
  const sessionPoints = sessionsLastMonth
    .map((entry, index) => {
      const x = (index / (sessionsLastMonth.length - 1)) * 100
      const y = 100 - (entry.count / maxSessionCount) * 100
      return `${x},${y}`
    })
    .join(' ')

  const exportDashboard = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      users,
      sessions,
      averageProgress,
      difficulties,
      sessionsLastMonth,
      profilesPerPlanet,
    }
    downloadFile(JSON.stringify(payload, null, 2), 'dashboard-completo.json', 'application/json')
  }

  const exportSessions = () => {
    const csv = ['date,count', ...sessionsLastMonth.map((entry) => `${entry.date},${entry.count}`)].join('\n')
    downloadFile(csv, 'sesiones-ultimos-30-dias.csv', 'text/csv;charset=utf-8;')
  }

  const exportPlanets = () => {
    const csv = ['planet,students,percentage', ...profilesPerPlanet.map((planet) => `${planet.name},${planet.profilesCount},${Math.round((planet.profilesCount / totalProfiles) * 100)}`)].join('\n')
    downloadFile(csv, 'distribucion-por-planeta.csv', 'text/csv;charset=utf-8;')
  }

  const logout = async () => {
    const tokens = getAuthTokens()
    if (!tokens) {
      clearAuthTokens()
      navigate({ to: '/login', replace: true })
      return
    }

    setIsLoggingOut(true)

    try {
      await fetch(buildApiUrl('auth/logout'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        body: JSON.stringify({
          refreshToken: tokens.refreshToken,
          accessToken: tokens.accessToken,
        }),
      })
    } finally {
      clearAuthTokens()
      navigate({ to: '/login', replace: true })
      setIsLoggingOut(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.28),transparent_28%),linear-gradient(135deg,#1e1b4b_0%,#4c1d95_46%,#0f172a_100%)] p-4 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold tracking-[0.22em] text-fuchsia-100/80 backdrop-blur-xl">
          Cargando dashboard...
        </div>
      </div>
    )
  }

  if (pathname !== '/dashboard') {
    return <Outlet />
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.28),transparent_28%),linear-gradient(135deg,#1e1b4b_0%,#4c1d95_46%,#0f172a_100%)] p-4 text-white md:p-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black md:text-4xl">Panel de Control</h1>
            <p className="text-sm text-fuchsia-100/75 md:text-base">
              Resumen operativo del juego 3D multijugador
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/users"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
            >
              <Users className="h-4 w-4" />
              Ver usuarios
            </Link>
            <button
              type="button"
              onClick={logout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-300/30 bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
            </button>
            <Link
              to="/"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
            >
              Volver al Inicio
            </Link>
            <button
              type="button"
              onClick={exportDashboard}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-fuchsia-600 to-indigo-600 px-4 py-2 text-sm font-semibold transition hover:from-fuchsia-700 hover:to-indigo-700"
            >
              <FileImage className="h-4 w-4" />
              Exportar Dashboard
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <article className="rounded-2xl border border-fuchsia-400/20 bg-white/5 p-5 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-fuchsia-100">Total Usuarios</h2>
              <Users className="h-5 w-5 text-fuchsia-300" />
            </div>
            <p className="text-3xl font-black text-fuchsia-200">{users.toLocaleString()}</p>
            <p className="mt-1 text-xs text-fuchsia-100/60">Usuarios registrados</p>
          </article>

          <article className="rounded-2xl border border-fuchsia-400/20 bg-white/5 p-5 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-fuchsia-100">Total Sesiones</h2>
              <Activity className="h-5 w-5 text-fuchsia-300" />
            </div>
            <p className="text-3xl font-black text-fuchsia-200">{sessions.toLocaleString()}</p>
            <p className="mt-1 text-xs text-fuchsia-100/60">Sesiones activas</p>
          </article>

          <article className="rounded-2xl border border-fuchsia-400/20 bg-white/5 p-5 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-fuchsia-100">Ejercicios por Dificultad</h2>
              <BarChart3 className="h-5 w-5 text-fuchsia-300" />
            </div>
            <div className="space-y-2">
              {difficulties.map((difficulty) => (
                <div key={difficulty.id} className="flex items-center justify-between text-sm">
                  <span className="text-fuchsia-100/70">{difficulty.name}</span>
                  <span className="font-bold text-fuchsia-200">{difficulty.exercises}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-fuchsia-400/20 bg-white/5 p-5 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-fuchsia-100">Progreso Promedio</h2>
              <TrendingUp className="h-5 w-5 text-fuchsia-300" />
            </div>
            <p className="text-3xl font-black text-fuchsia-200">{averageProgress}%</p>
            <p className="mt-1 text-xs text-fuchsia-100/60">De estudiantes</p>
          </article>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl border border-fuchsia-400/20 bg-white/5 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Sesiones de los Ultimos 30 Dias</h3>
                <p className="text-sm text-fuchsia-100/70">Actividad diaria de sesiones</p>
              </div>
              <button
                type="button"
                onClick={exportSessions}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 transition hover:bg-white/10"
                aria-label="Exportar sesiones"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>

            <div className="h-70 w-full rounded-xl border border-white/10 bg-black/20 p-3">
              <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none" role="img">
                <polyline
                  fill="none"
                  stroke="rgb(217,70,239)"
                  strokeWidth="2"
                  points={sessionPoints}
                />
              </svg>
            </div>
          </section>

          <section className="rounded-2xl border border-fuchsia-400/20 bg-white/5 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Distribucion por Planeta</h3>
                <p className="text-sm text-fuchsia-100/70">Estudiantes activos en cada nivel</p>
              </div>
              <div className="flex items-center gap-2">
                <Rocket className="h-6 w-6 text-fuchsia-300" />
                <button
                  type="button"
                  onClick={exportPlanets}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 transition hover:bg-white/10"
                  aria-label="Exportar planetas"
                >
                  <FileDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {profilesPerPlanet.map((planet) => {
                const percentage = totalProfiles > 0 ? Math.round((planet.profilesCount / totalProfiles) * 100) : 0
                return (
                  <article key={planet.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-semibold text-fuchsia-100">{planet.name}</span>
                      <span className="text-fuchsia-100/70">
                        {planet.profilesCount} estudiantes ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-fuchsia-500 to-indigo-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}