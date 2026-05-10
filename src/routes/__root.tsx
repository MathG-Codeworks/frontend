import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
})

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.24),transparent_28%),linear-gradient(135deg,#0b1021_0%,#1d1140_45%,#17051f_100%)] px-6 text-white">
      <div className="w-full max-w-xl rounded-3xl border border-white/15 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl md:p-10">
        <p className="mb-2 text-sm font-semibold tracking-[0.3em] text-fuchsia-200/80">ERROR 404</p>
        <h1 className="mb-3 text-4xl font-black md:text-5xl">Ruta no encontrada</h1>
        <p className="mb-8 text-fuchsia-100/80">
          El portal que intentas abrir no existe o se movio a otra zona de la arena.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-fuchsia-600 to-indigo-600 px-5 py-3 font-semibold text-white transition hover:from-fuchsia-700 hover:to-indigo-700"
          >
            Volver al inicio
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-fuchsia-100 transition hover:bg-white/10"
          >
            Ir a login
          </Link>
        </div>
      </div>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
