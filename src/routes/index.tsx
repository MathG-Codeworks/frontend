import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  Calculator,
  ChevronDown,
  ChevronUp,
  Crown,
  Gamepad2,
  LogIn,
  Menu,
  Medal,
  ShieldPlus,
  Shield,
  Sparkles,
  Star,
  Swords,
  Sword,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

const features = [
  {
    icon: Gamepad2,
    title: 'Arenas 3D',
    description: 'Entra en escenarios 3D diseñados para partidas rápidas, intensas y visuales.',
  },
  {
    icon: Users,
    title: 'Multijugador en Vivo',
    description: 'Reta a tus amigos en tiempo real y compite por la victoria.',
  },
  {
    icon: Sword,
    title: 'Duelo Estratégico',
    description: 'Domina mecánicas de combate y supera a tus rivales con habilidad.',
  },
  {
    icon: Trophy,
    title: 'Ranking de Amigos',
    description: 'Sube posiciones, presume tus victorias y demuestra quién manda.',
  },
] as const

const stats = [
  { icon: Users, label: 'Jugadores Activos', value: '10,000+' },
  { icon: Swords, label: 'Duelo en Tiempo Real', value: '24/7' },
  { icon: Trophy, label: 'Victorias Registradas', value: '50,000+' },
  { icon: Star, label: 'Valoración de la Arena', value: '4.9/5' },
] as const

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'MathG - Juego 3D Multijugador',
      },
      {
        name: 'description',
        content:
          'Un juego 3D multijugador para desafiar y ganarle a tus amigos en la arena.',
      },
    ],
  }),
  component: Welcome,
})

function Welcome() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const sparkles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        id: index,
        top: 16 + index * 6,
        left: 6 + index * 7,
        delay: index * 0.35,
      })),
    [],
  )

  useEffect(() => {
    setIsVisible(true)

    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }

    checkTouchDevice()

    const handleMouseMove = (event: MouseEvent) => {
      if (!isTouchDevice) {
        setMousePosition({ x: event.clientX, y: event.clientY })
      }
    }

    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > window.innerHeight * 0.5)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isTouchDevice])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToNextSection = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.28),transparent_28%),linear-gradient(135deg,#17051f_0%,#1d1140_45%,#0b1021_100%)] text-white">
      {!isTouchDevice ? (
        <div
          className="pointer-events-none fixed z-50 h-4 w-4 rounded-full bg-fuchsia-300 mix-blend-difference transition-transform duration-100"
          style={{ left: mousePosition.x - 8, top: mousePosition.y - 8 }}
        />
      ) : null}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-2xl" />

        <div className="absolute top-24 left-[8%] text-fuchsia-300/20">
          <Zap className="h-32 w-32 animate-pulse" />
        </div>
        <div className="absolute top-36 right-[10%] text-indigo-300/20">
          <Sword className="h-28 w-28 rotate-45 animate-bounce" />
        </div>
        <div className="absolute bottom-24 left-[6%] text-fuchsia-300/20">
          <Shield className="h-32 w-32 animate-pulse" />
        </div>
        <div className="absolute right-[8%] bottom-16 text-indigo-300/20">
          <Calculator className="h-24 w-24 animate-spin" />
        </div>

        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute animate-pulse"
            style={{ top: `${sparkle.top}%`, left: `${sparkle.left}%`, animationDelay: `${sparkle.delay}s` }}
          >
            <Sparkles className="h-4 w-4 text-fuchsia-200/70" />
          </div>
        ))}
      </div>

      <header className="relative z-20 p-6">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <div className={`transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="flex items-center gap-3">
              <img 
                src="https://res.cloudinary.com/dvibz13t8/image/upload/v1762189987/logo_MathG_x5vo20.png" 
                alt="MathG App" 
                className='w-auto h-6 md:h-20'
              />
            </div>
          </div>

          <div className={`hidden items-center gap-4 md:flex transition-all delay-200 duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 font-medium text-fuchsia-100 transition hover:bg-white/10 hover:text-white"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-fuchsia-600 to-indigo-600 px-5 py-2 font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-105 hover:from-fuchsia-700 hover:to-indigo-700"
            >
              <Crown className="h-4 w-4" />
              Jugar Ahora
            </Link>
          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-fuchsia-100 backdrop-blur transition hover:bg-white/10"
              aria-label="Abrir menú"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>

        {isMenuOpen ? (
          <div className="mx-auto mt-4 max-w-7xl md:hidden">
            <div className="rounded-3xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl">
              <div className="flex flex-col gap-3">
                <Link to="/login" className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-fuchsia-100">
                  <LogIn className="h-4 w-4" />
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-fuchsia-600 to-indigo-600 px-4 py-3 text-white">
                  <Crown className="h-4 w-4" />
                  Jugar Ahora
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <main className="relative z-10">
        <section className="relative flex min-h-screen items-center justify-center px-6">
          <div className="mx-auto max-w-6xl text-center">
            <div className={`mb-8 transition-all delay-300 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="mb-4 flex items-center justify-center gap-4">
                <Swords className="h-14 w-14 animate-pulse text-fuchsia-200" />
                <h1 className="text-6xl font-black tracking-tight md:text-8xl lg:text-[9rem]">
                  <span className="bg-linear-to-r from-fuchsia-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent">
                    MathG
                  </span>
                </h1>
                <ShieldPlus className="h-14 w-14 animate-pulse text-indigo-200" />
              </div>

              <h2 className="mb-5 text-3xl font-semibold text-white md:text-7xl">
                Arena{' '}
                <span className="bg-linear-to-r from-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                  3D Multijugador
                </span>{' '}
                para retar a tus amigos
              </h2>

              <p className="mx-auto mb-10 max-w-3xl text-lg leading-8 text-fuchsia-100/85 md:text-2xl">
                Sumérgete en combates 3D en tiempo real, crea partidas con tus amigos y gana con reflejos, estrategia y dominio de la arena.
              </p>
            </div>

            <div className={`mb-16 flex flex-col items-center justify-center gap-4 transition-all delay-500 duration-1000 sm:flex-row ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-fuchsia-600 via-pink-600 to-indigo-600 px-6 py-4 text-lg font-semibold text-white shadow-2xl shadow-fuchsia-500/30 transition hover:scale-105 hover:from-fuchsia-700 hover:via-pink-700 hover:to-indigo-700"
              >
                Entrar a la Arena
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <button
              type="button"
              onClick={scrollToNextSection}
              className={`animate-bounce transition-all delay-700 duration-1000 hover:scale-110 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              <ChevronDown className="mx-auto h-8 w-8 text-fuchsia-200" />
              <span className="mt-2 block text-sm font-medium uppercase tracking-[0.25em] text-fuchsia-200/80">
                Mira cómo se juega
              </span>
            </button>
          </div>
        </section>

        <section id="features-section" className="border-y border-white/10 bg-black/20 px-6 py-20 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h3 className="mb-5 text-4xl font-black md:text-6xl">
                ¿Por qué elegir{' '}
                <span className="bg-linear-to-r from-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                  MathG
                </span>
                ?
              </h3>
              <p className="mx-auto max-w-3xl text-lg text-fuchsia-100/80 md:text-xl">
                Una experiencia pensada para competir, cooperar y dominar una arena 3D con estilo propio.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature, index) => (
                <article
                  key={feature.title}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10 backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:bg-white/10"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-fuchsia-500 to-indigo-600 shadow-lg shadow-fuchsia-500/20 transition group-hover:scale-105">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h4 className="mb-3 text-xl font-semibold text-white">{feature.title}</h4>
                  <p className="leading-7 text-fuchsia-100/80">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h3 className="mb-6 text-4xl font-black md:text-6xl">
                Números que{' '}
                <span className="bg-linear-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                  impresionan
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {stats.map((stat) => (
                <article key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-fuchsia-600 to-indigo-600 shadow-lg shadow-fuchsia-500/20">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="mb-1 text-3xl font-black text-white md:text-4xl">{stat.value}</div>
                  <div className="text-sm font-medium text-fuchsia-100/80 md:text-base">{stat.label}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-linear-to-r from-fuchsia-900/40 to-indigo-900/40 px-6 py-20 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl text-center">
            <Medal className="mx-auto mb-6 h-20 w-20 animate-pulse text-fuchsia-200" />
            <h3 className="mb-6 text-4xl font-black md:text-6xl">
              ¿Listo para la{' '}
              <span className="bg-linear-to-r from-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                batalla
              </span>
              ?
            </h3>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-fuchsia-100/85 md:text-xl">
              Crea salas privadas, invita a tus amigos y compite por el primer puesto en partidas 3D llenas de acción.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-fuchsia-600 via-pink-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-fuchsia-500/30 transition hover:scale-105"
              >
                <Crown className="h-5 w-5" />
                Crear partida
                <Sparkles className="h-5 w-5" />
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-lg font-semibold text-fuchsia-100 backdrop-blur transition hover:bg-white/10 hover:text-white"
              >
                <Shield className="h-5 w-5" />
                Quiero retar amigos
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 bg-black/35 px-6 py-12 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <Crown className="h-7 w-7 animate-pulse text-fuchsia-200" />
            <h4 className="text-2xl font-black md:text-4xl">MathG</h4>
            <Crown className="h-7 w-7 animate-pulse text-fuchsia-200" />
          </div>
          <p className="mb-4 text-fuchsia-100/75">Un juego 3D multijugador hecho para desafiar y ganarle a tus amigos.</p>
          <div className="flex items-center justify-center gap-3 text-fuchsia-200/70">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="text-sm">Hecho para rivales, escuadrones y campeones de la arena</span>
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
        </div>
      </footer>

      <div className="fixed right-6 bottom-6 z-50">
        <button
          type="button"
          onClick={scrollToTop}
          className={`relative overflow-hidden rounded-full border border-fuchsia-300/50 bg-linear-to-r from-fuchsia-600 to-indigo-600 text-white shadow-lg shadow-fuchsia-500/20 transition duration-300 hover:scale-110 ${showScrollToTop ? 'size-14' : 'size-0 border-0 p-0'}`}
          aria-label="Subir hacia arriba"
        >
          <ChevronUp className="absolute top-1/2 left-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2" />
        </button>
      </div>
    </div>
  )
}
