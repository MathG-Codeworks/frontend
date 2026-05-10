import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Mail, Shield, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { buildApiUrl } from '#/lib/api'
import { clearAuthTokens, getAuthTokens } from '#/lib/auth'

type RoleDto = {
  id: number
  name: string
}

type UserDto = {
  id: number
  username: string
  email: string
  createdAt: string
  updatedAt: string
  roleId: number
  role: RoleDto
}

export const Route = createFileRoute('/dashboard/users')({
  head: () => ({
    meta: [
      { title: 'Usuarios - Dashboard MathG' },
      {
        name: 'description',
        content: 'Listado de usuarios registrados en MathG.',
      },
    ],
  }),
  component: DashboardUsers,
})

function getErrorMessageFromResponse(responseBody: unknown) {
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

function formatDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Sin fecha'
  }

  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function getUserInitial(username: string) {
  return username.trim().charAt(0).toUpperCase() || 'U'
}

function getRoleBadgeClass(roleName?: string) {
  const normalizedRole = roleName?.toLowerCase() ?? ''

  if (normalizedRole.includes('admin')) {
    return 'border-amber-300/30 bg-amber-500/20 text-amber-100'
  }

  if (normalizedRole.includes('teacher') || normalizedRole.includes('prof')) {
    return 'border-cyan-300/30 bg-cyan-500/20 text-cyan-100'
  }

  return 'border-indigo-300/30 bg-indigo-500/20 text-indigo-100'
}

function DashboardUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<UserDto[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const tokens = getAuthTokens()

    if (!tokens) {
      clearAuthTokens()
      navigate({ to: '/login', replace: true })
      return
    }

    const loadUsers = async () => {
      try {
        const response = await fetch(buildApiUrl('user'), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        })

        const responseBody = await response.json().catch(() => null)

        if (!response.ok) {
          if (response.status === 401) {
            clearAuthTokens()
            navigate({ to: '/login', replace: true })
            return
          }

          const apiMessage = getErrorMessageFromResponse(responseBody)
          throw new Error(apiMessage ?? 'No se pudo cargar la lista de usuarios')
        }

        setUsers(Array.isArray(responseBody) ? responseBody : [])
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'No se pudo cargar la lista de usuarios')
      } finally {
        setLoading(false)
      }
    }

    void loadUsers()
  }, [navigate])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.28),transparent_28%),linear-gradient(135deg,#1e1b4b_0%,#4c1d95_46%,#0f172a_100%)] p-4 text-white md:p-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black md:text-4xl">Usuarios Registrados</h1>
            <p className="text-sm text-fuchsia-100/75 md:text-base">Listado de usuarios desde Prisma</p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Dashboard
          </Link>
        </div>

        <section className="rounded-2xl border border-fuchsia-400/20 bg-white/5 p-5 backdrop-blur-xl">
          {!loading && !errorMessage ? (
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-white/10 bg-black/15 px-4 py-2 text-sm text-fuchsia-100/90">
                <span className="mr-2 text-fuchsia-200/70">Registros:</span>
                <span className="font-bold text-fuchsia-100">{users.length}</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/15 px-4 py-2 text-sm text-fuchsia-100/90">
                <span className="mr-2 text-fuchsia-200/70">Última actualización:</span>
                <span className="font-bold text-fuchsia-100">
                  {users.length > 0 ? formatDateTime(users[0].updatedAt) : 'Sin datos'}
                </span>
              </div>
            </div>
          ) : null}

          {loading ? (
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-6 text-center text-fuchsia-100/80">
              Cargando usuarios...
            </div>
          ) : null}

          {!loading && errorMessage ? (
            <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100">
              {errorMessage}
            </div>
          ) : null}

          {!loading && !errorMessage ? (
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/10 shadow-[0_18px_48px_rgba(6,2,24,0.25)]">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/8">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-100/80">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-100/80">Usuario</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-100/80">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-100/80">Rol</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-100/80">Creado</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-100/80">Actualizado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-black/10">
                  {users.map((user) => (
                    <tr key={user.id} className="transition-colors hover:bg-white/6">
                      <td className="px-4 py-3 text-sm font-semibold text-fuchsia-100">{user.id}</td>
                      <td className="px-4 py-3 text-sm text-fuchsia-100/90">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-fuchsia-300/30 bg-fuchsia-500/20 text-xs font-bold text-fuchsia-100">
                            {getUserInitial(user.username)}
                          </span>
                          <div className="flex flex-col">
                            <span className="font-semibold text-fuchsia-100">{user.username}</span>
                            <span className="text-xs text-fuchsia-100/60">Usuario #{user.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-fuchsia-100/90">
                        <div className="inline-flex items-center gap-2 text-fuchsia-100/90">
                          <Mail className="h-3.5 w-3.5 text-fuchsia-200/80" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${getRoleBadgeClass(user.role?.name)}`}>
                          <Shield className="h-3 w-3" />
                          {user.role?.name ?? 'Sin rol'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-fuchsia-100/75">
                        {formatDateTime(user.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-sm text-fuchsia-100/75">
                        {formatDateTime(user.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {!loading && !errorMessage && users.length === 0 ? (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-6 text-center text-fuchsia-100/80">
              No hay usuarios para mostrar.
            </div>
          ) : null}
        </section>

        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-100/75">
          <Users className="h-4 w-4" />
          Total usuarios: {users.length}
        </div>
      </div>
    </div>
  )
}