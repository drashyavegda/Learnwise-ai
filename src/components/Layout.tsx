import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Award, BookOpenCheck, CalendarClock, ClipboardCheck, Download, GraduationCap, Home,
  LayoutDashboard, Menu, PencilRuler, RotateCcw, Route as RouteIcon, Sparkles, Users,
  WifiOff, X, ChevronDown, Gauge, MessageSquareQuote, NotebookPen,
} from 'lucide-react'
import { useApp } from '../lib/store'
import { LANG_LABELS, STRINGS, t } from '../lib/i18n'
import type { LangKey } from '../lib/i18n'
import type { Lang } from '../lib/types'
import { Button, cn, Toggle } from './ui'
import { ResetDemoDialog } from './DemoControls'

export function Logo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5" aria-label="LearnWise AI home">
      <span
        className={cn(
          'grid h-9 w-9 place-items-center rounded-xl',
          light ? 'bg-white/10 ring-1 ring-white/15' : 'bg-navy-900',
        )}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path d="M4 17.5V11a8 8 0 0 1 16 0v6.5" fill="none" stroke="#0FA98F" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="12" cy="11" r="2.6" fill="#6C4CF1" />
          <path d="M2 20.5h20" stroke={light ? '#C9D2E6' : '#0A1730'} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className={cn('block text-[15px] font-bold tracking-tight', light ? 'text-white' : 'text-navy-900')}>
            LearnWise <span className={light ? 'text-brand-teal' : 'text-brand-tealDeep'}>AI</span>
          </span>
          <span className={cn('block text-[10.5px] font-medium uppercase tracking-[0.16em]', light ? 'text-navy-300' : 'text-navy-400')}>
            Classes 6–10
          </span>
        </span>
      )}
    </Link>
  )
}

type Role = 'student' | 'teacher' | 'parent'

const navItems: Record<Role, { to: string; label: string; labelKey?: string; icon: typeof Home; end?: boolean }[]> = {
  student: [
    { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/student/assessment', label: 'Diagnostic', labelKey: 'nav.assessment', icon: ClipboardCheck },
    { to: '/student/tutor', label: 'AI tutor', labelKey: 'nav.tutor', icon: Sparkles },
    { to: '/student/practice', label: 'Practice', labelKey: 'nav.practice', icon: PencilRuler },
    { to: '/student/path', label: 'Learning path', labelKey: 'nav.path', icon: RouteIcon },
    { to: '/student/revision', label: 'Revision', labelKey: 'nav.revision', icon: CalendarClock },
    { to: '/student/lessons', label: 'Lessons & offline', icon: Download },
    { to: '/student/achievements', label: 'Achievements', labelKey: 'nav.achievements', icon: Award },
  ],
  teacher: [
    { to: '/teacher', label: 'Class overview', icon: Users, end: true },
    { to: '/teacher/planner', label: 'Lesson planner', icon: NotebookPen },
    { to: '/teacher/insights', label: 'Concept insights', icon: MessageSquareQuote },
  ],
  parent: [
    { to: '/parent', label: 'Progress summary', icon: Gauge, end: true },
    { to: '/parent/privacy', label: 'Privacy & access', icon: BookOpenCheck },
  ],
}

const roleMeta: Record<Role, { title: string; who: string }> = {
  student: { title: 'Student', who: 'Aarav Sharma · Class 8-B' },
  teacher: { title: 'Teacher', who: 'Ms. R. Iyer · Mathematics' },
  parent: { title: 'Parent', who: 'Guardian of Aarav Sharma' },
}

function roleFromPath(path: string): Role {
  if (path.startsWith('/teacher')) return 'teacher'
  if (path.startsWith('/parent')) return 'parent'
  return 'student'
}

export function AppShell() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [prefsOpen, setPrefsOpen] = useState(false)
  const role = roleFromPath(location.pathname)
  const { lang, setLang, lowData, setLowData, online, syncQueue, student } = useApp()

  useEffect(() => {
    setMenuOpen(false)
    setLangOpen(false)
    setPrefsOpen(false)
  }, [location.pathname])

  const nav = (
    <nav className="flex flex-col gap-0.5" aria-label="Main">
      {navItems[role].map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors',
              isActive
                ? 'bg-white/10 text-white ring-1 ring-white/10'
                : 'text-navy-300 hover:bg-white/[0.06] hover:text-white',
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-brand-teal' : 'text-navy-400 group-hover:text-navy-200')} />
              <span className="truncate">
                {item.labelKey && item.labelKey in STRINGS ? t(item.labelKey as LangKey, lang) : item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )

  const sidebarBody = (
    <div className="flex h-full flex-col gap-5 overflow-y-auto px-4 py-5 scrollbar-thin">
      <div className="flex items-center justify-between">
        <Logo light />
        <button className="rounded-lg p-1 text-navy-300 hover:bg-white/10 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>

      <RoleSwitch role={role} />

      <div className="rounded-xl bg-white/[0.05] p-3 ring-1 ring-white/10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-navy-400">Signed in as</p>
        <p className="mt-1 text-[13px] font-semibold text-white">{roleMeta[role].title}</p>
        <p className="text-[11.5px] text-navy-300">{role === 'student' ? `${student.name} · ${student.className}-${student.section}` : roleMeta[role].who}</p>
      </div>

      {nav}

      <div className="mt-auto space-y-3 pt-4">
        <Link to="/about" className="flex items-center gap-2 rounded-xl px-3 py-2 text-[12.5px] font-medium text-navy-300 hover:bg-white/[0.06] hover:text-white">
          <BookOpenCheck className="h-4 w-4 text-navy-400" />
          What is real vs. simulated
        </Link>
        <div className="rounded-xl bg-white/[0.05] p-3 ring-1 ring-white/10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">Demo controls</p>
          <p className="mt-1 text-[11.5px] leading-snug text-navy-300">
            Everything you do is stored in this browser only.
          </p>
          <Button variant="secondary" size="sm" className="mt-2.5 w-full !border-white/15 !bg-white/10 !text-white hover:!bg-white/15" onClick={() => setResetOpen(true)}>
            <RotateCcw className="h-3.5 w-3.5" /> Reset demo data
          </Button>
        </div>
        <p className="px-1 text-[10.5px] leading-relaxed text-navy-500">
          Prototype for Code Kernel ’26 · X-Kernel, GRIET × Canvas Classes
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-dvh bg-navy-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[268px] bg-navy-900 lg:block">{sidebarBody}</aside>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/50" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[86%] max-w-[320px] bg-navy-900 shadow-lift">{sidebarBody}</aside>
        </div>
      )}

      <div className="lg:pl-[268px]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-navy-100 bg-white/85 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              className="rounded-lg p-2 text-navy-600 hover:bg-navy-100 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="lg:hidden">
              <Logo compact />
            </div>

            <div className="hidden items-center gap-2 text-[13px] text-navy-500 lg:flex">
              <Link to="/" className="inline-flex items-center gap-1.5 hover:text-navy-800">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <span className="text-navy-300">/</span>
              <span className="font-semibold text-navy-800">{roleMeta[role].title} view</span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              {!online && (
                <span className="hidden items-center gap-1.5 rounded-full border border-amber-300/70 bg-brand-amberSoft px-2.5 py-1 text-[11px] font-semibold text-[#8a5a10] sm:inline-flex">
                  <WifiOff className="h-3.5 w-3.5" />
                  Offline{syncQueue.length > 0 ? ` · ${syncQueue.length} queued` : ''}
                </span>
              )}

              {/* language */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen((v) => !v)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-2.5 text-[12.5px] font-semibold text-navy-700 hover:border-navy-300"
                  aria-haspopup="listbox"
                  aria-expanded={langOpen}
                >
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-navy-100 text-[10px] font-bold uppercase text-navy-600">
                    {lang}
                  </span>
                  <span className="hidden sm:inline">{LANG_LABELS[lang].native}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-navy-400" />
                </button>
                {langOpen && (
                  <div className="absolute right-0 z-30 mt-2 w-52 rounded-xl border border-navy-100 bg-white p-1.5 shadow-lift" role="listbox">
                    {(Object.keys(LANG_LABELS) as Lang[]).map((code) => (
                      <button
                        key={code}
                        role="option"
                        aria-selected={lang === code}
                        onClick={() => {
                          setLang(code)
                          setLangOpen(false)
                        }}
                        className={cn(
                          'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px]',
                          lang === code ? 'bg-brand-tealSoft font-semibold text-brand-tealDeep' : 'text-navy-700 hover:bg-navy-50',
                        )}
                      >
                        <span>{LANG_LABELS[code].native}</span>
                        <span className="text-[11px] uppercase text-navy-400">{code}</span>
                      </button>
                    ))}
                    <p className="px-3 py-2 text-[10.5px] leading-snug text-navy-400">
                      Translations cover main screens and the fractions topic. See “How it works”.
                    </p>
                  </div>
                )}
              </div>

              {/* preferences */}
              <div className="relative">
                <button
                  onClick={() => setPrefsOpen((v) => !v)}
                  className={cn(
                    'inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-[12.5px] font-semibold',
                    lowData
                      ? 'border-teal-300 bg-brand-tealSoft text-brand-tealDeep'
                      : 'border-navy-200 bg-white text-navy-700 hover:border-navy-300',
                  )}
                  aria-label="Display and data preferences"
                  aria-expanded={prefsOpen}
                >
                  <Gauge className="h-4 w-4" />
                  <span className="hidden md:inline">{lowData ? 'Low-data on' : 'Low-data off'}</span>
                </button>
                {prefsOpen && (
                  <div className="absolute right-0 z-30 mt-2 w-72 rounded-xl border border-navy-100 bg-white p-4 shadow-lift">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">Preferences</p>
                    <Toggle
                      checked={lowData}
                      onChange={setLowData}
                      label="Low-data mode"
                      hint="Reduces animations and chart detail. Content stays the same."
                    />
                    <div className="mt-3 rounded-lg bg-navy-50 p-3 text-[11.5px] leading-relaxed text-navy-500">
                      Your progress is saved in this browser. Nothing is sent to a server in this prototype.
                    </div>
                  </div>
                )}
              </div>

              <RoleSwitch role={role} compact />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1180px] px-4 pb-16 pt-6 sm:px-6 lg:pt-8">
          <Outlet />
        </main>
      </div>

      <ResetDemoDialog open={resetOpen} onClose={() => setResetOpen(false)} />
    </div>
  )
}

function RoleSwitch({ role, compact = false }: { role: Role; compact?: boolean }) {
  const options: { id: Role; to: string; label: string; icon: typeof Home }[] = [
    { id: 'student', to: '/student', label: 'Student', icon: GraduationCap },
    { id: 'teacher', to: '/teacher', label: 'Teacher', icon: Users },
    { id: 'parent', to: '/parent', label: 'Parent', icon: Home },
  ]

  if (compact) {
    return (
      <div className="hidden items-center gap-1 rounded-lg bg-navy-100 p-1 sm:flex" role="tablist" aria-label="Switch view">
        {options.map((o) => (
          <Link
            key={o.id}
            to={o.to}
            role="tab"
            aria-selected={role === o.id}
            className={cn(
              'rounded-md px-2.5 py-1.5 text-[12px] font-semibold transition-colors',
              role === o.id ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500 hover:text-navy-800',
            )}
          >
            {o.label}
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div>
      <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-navy-500">Viewing as</p>
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-white/[0.06] p-1 ring-1 ring-white/10">
        {options.map((o) => (
          <Link
            key={o.id}
            to={o.to}
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10.5px] font-semibold transition-colors',
              role === o.id ? 'bg-white text-navy-900' : 'text-navy-300 hover:bg-white/10 hover:text-white',
            )}
          >
            <o.icon className="h-4 w-4" />
            {o.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

/* --------------------------------------------------- simple page container */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  children,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  actions?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="label mb-1.5">{eyebrow}</p>}
        <h1 className="text-[22px] font-bold leading-tight text-navy-900 sm:text-[26px]">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-navy-500">{subtitle}</p>}
        {children}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
