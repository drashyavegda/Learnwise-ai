import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BadgeCheck, BookOpenCheck, CalendarClock, Check, ChevronRight, CircleSlash2,
  ClipboardCheck, Download, Globe2, GraduationCap, Layers, LineChart, ListChecks, PencilRuler,
  Route as RouteIcon, ShieldCheck, Sparkles, Users, WifiOff, X,
} from 'lucide-react'
import { DemoGuide } from '../components/DemoControls'
import { Card, LinkButton, Pill } from '../components/ui'
import { Logo } from '../components/Layout'
import { ThemeCycle } from '../components/ThemeCycle'

const FEATURES = [
  { icon: ClipboardCheck, title: 'Smart diagnostic', body: 'Eight questions map what a student actually knows, topic by topic — with the evidence shown.', tone: 'teal' },
  { icon: Sparkles, title: 'Personal tutor', body: 'Plain-language explanations and worked examples, in English, Hindi or Gujarati.', tone: 'violet' },
  { icon: PencilRuler, title: 'Adaptive practice', body: 'Difficulty moves after every answer, using rules anyone can inspect. Never random.', tone: 'teal' },
  { icon: RouteIcon, title: 'Prerequisite path', body: 'Fractions before equations. Topics unlock only when the groundwork is secure.', tone: 'violet' },
  { icon: Users, title: 'Teacher insight', body: 'Who needs what this week, which concept the class missed, and a lesson plan to act on.', tone: 'teal' },
  { icon: CalendarClock, title: 'Revision that sticks', body: 'Short reviews scheduled from real performance, plus a saved-for-offline library.', tone: 'violet' },
]

const COMPARE = [
  ['Everyone gets the same worksheet', 'Practice responds to the last answer'],
  ['Difficulty changes at the next test', 'Difficulty changes after two answers'],
  ['Gaps show up in the exam', 'The diagnostic surfaces the prerequisite'],
  ['Marks are the only signal', 'Concept-level evidence for the teacher'],
  ['One language, one explanation', 'English, Hindi and Gujarati for fractions'],
]

export default function Landing() {
  const [guideOpen, setGuideOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-white">
      {/* ------------------------------------------------------------ header */}
      <header className="sticky top-0 z-30 border-b border-navy-100/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Logo />
          <nav className="ml-6 hidden items-center gap-5 text-[13px] font-medium text-navy-500 md:flex">
            <a href="#features" className="hover:text-navy-900">Features</a>
            <a href="#cycle" className="hover:text-navy-900">How it works</a>
            <a href="#teachers" className="hover:text-navy-900">For teachers</a>
            <Link to="/parent" className="hover:text-navy-900">For parents</Link>
            <Link to="/about" className="hover:text-navy-900">Transparency</Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <LinkButton to="/teacher" variant="secondary" size="sm" className="hidden sm:inline-flex">
              Explore teacher dashboard
            </LinkButton>
            <LinkButton to="/student" size="sm">
              Start learning <ArrowRight className="h-3.5 w-3.5" />
            </LinkButton>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------- hero */}
      <section className="relative overflow-hidden border-b border-navy-100">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-70 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(108,76,241,0.14), transparent 65%)' }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-32 top-40 h-[380px] w-[380px] rounded-full opacity-70 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(15,169,143,0.16), transparent 65%)' }}
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Pill tone="teal" dot>Code Kernel ’26 · Decode Round</Pill>
              <Pill tone="neutral">Classes 6–10 · Mathematics</Pill>
            </div>
            <h1 className="text-[34px] font-bold leading-[1.08] tracking-tight text-navy-900 sm:text-[46px] lg:text-[52px]">
              Learning that adapts
              <br />
              to <span className="relative whitespace-nowrap text-brand-tealDeep">every student
                <svg className="absolute -bottom-1.5 left-0 h-2.5 w-full" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 7c40-5 90-6 196-2" stroke="#0FA98F" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55" />
                </svg>
              </span>.
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-navy-600 sm:text-base">
              LearnWise AI finds out what a Class 6–10 student truly understands, teaches to that level,
              and tells their teacher where help is needed — in English, Hindi or Gujarati.
            </p>
            <p className="mt-2 text-[13.5px] font-medium text-navy-400">
              Every student learns differently. Now, learning does too.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <LinkButton to="/student" size="lg">
                <GraduationCap className="h-4 w-4" /> Start learning
              </LinkButton>
              <LinkButton to="/teacher" size="lg" variant="secondary">
                <Users className="h-4 w-4" /> Explore teacher dashboard
              </LinkButton>
              <button
                onClick={() => setGuideOpen(true)}
                className="inline-flex h-12 items-center gap-1.5 rounded-xl px-3 text-[13.5px] font-semibold text-navy-500 hover:bg-navy-50 hover:text-navy-800"
              >
                <ListChecks className="h-4 w-4" /> Guided demo
              </button>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-navy-400">
              <span className="inline-flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-brand-tealDeep" /> No sign-up needed</span>
              <span className="inline-flex items-center gap-1.5"><WifiOff className="h-4 w-4 text-brand-tealDeep" /> Low-bandwidth design</span>
              <span className="inline-flex items-center gap-1.5"><Globe2 className="h-4 w-4 text-brand-tealDeep" /> 3 languages</span>
            </div>
          </div>

          {/* product preview */}
          <div className="relative animate-fade-up">
            <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-brand-teal/10 via-transparent to-brand-violet/10 blur-xl" aria-hidden="true" />
            <Card className="relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-navy-100 bg-navy-50/60 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy-900 text-[11px] font-bold text-white">A</span>
                  <div>
                    <p className="text-[12.5px] font-semibold leading-tight text-navy-900">Aarav Sharma</p>
                    <p className="text-[10.5px] text-navy-500">Class 8-B · Mathematics</p>
                  </div>
                </div>
                <Pill tone="teal" dot>Diagnostic done</Pill>
              </div>

              <div className="space-y-3 p-4">
                <div className="rounded-xl border border-navy-100 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">Fractions</p>
                    <span className="text-[11px] font-semibold text-brand-amber">needs practice</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-navy-100">
                    <div className="h-full w-[33%] rounded-full bg-brand-amber" />
                  </div>
                  <p className="mt-2 text-[11.5px] leading-snug text-navy-500">
                    Repeated errors adding fractions with different denominators.
                  </p>
                </div>

                <div className="rounded-xl border border-navy-100 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">Variables</p>
                    <span className="text-[11px] font-semibold text-brand-tealDeep">mastered</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-navy-100">
                    <div className="h-full w-[100%] rounded-full bg-brand-teal" />
                  </div>
                </div>

                <div className="rounded-xl border border-teal-200/70 bg-brand-tealSoft/60 p-3">
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-tealDeep">Recommended next</p>
                  <p className="mt-1 text-[12.5px] font-semibold text-navy-900">Revisit equivalent fractions with a pizza model</p>
                  <p className="mt-1 text-[11px] leading-snug text-navy-500">
                    Because 2 of 3 fraction questions were answered incorrectly.
                  </p>
                </div>
              </div>
            </Card>

            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-navy-100 bg-white px-3.5 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-navy-400">Adaptive level</p>
              <p className="text-[12.5px] font-bold text-navy-900">
                Level 2 · Medium <span className="text-[11px] font-medium text-brand-tealDeep">↑ from 1</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- trust strip */}
      <section className="border-b border-navy-100 bg-navy-50/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-navy-400">Built for Indian classrooms</p>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="neutral">Classes 6–10</Pill>
            <Pill tone="neutral">CBSE-style Maths</Pill>
            <Pill tone="neutral">English · हिन्दी · ગુજરાતી</Pill>
            <Pill tone="neutral">Shared-device friendly</Pill>
            <Pill tone="neutral">Works offline for saved lessons</Pill>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <p className="label mb-2">What it does</p>
          <h2 className="text-[26px] font-bold tracking-tight text-navy-900 sm:text-[32px]">
            Six connected parts, one learning loop
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-navy-600">
            Not another chatbot with a syllabus attached. Each part feeds the next: the diagnostic sets the
            starting point, the tutor explains, practice measures, and the path updates.
          </p>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="group p-5 transition-shadow hover:shadow-lift">
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl ${
                  f.tone === 'teal' ? 'bg-brand-tealSoft text-brand-tealDeep' : 'bg-brand-violetSoft text-[#4b30c8]'
                }`}
              >
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-[15px] font-semibold text-navy-900">{f.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-navy-500">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- cycle */}
      <section id="cycle" className="border-y border-navy-100 bg-navy-900 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-teal">The adaptive cycle</p>
              <h2 className="text-[26px] font-bold tracking-tight text-white sm:text-[32px]">
                Assess → understand → personalise → practise → evaluate → adapt
              </h2>
              <p className="mt-4 text-[14.5px] leading-relaxed text-navy-200">
                The same loop runs across the three stages of the challenge — Learn, Solve and Test. Evidence
                from one step decides what happens in the next, so nothing is a one-off answer.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white ring-1 ring-white/15">Learn</span>
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white ring-1 ring-white/15">Solve</span>
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white ring-1 ring-white/15">Test</span>
              </div>
              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-[12.5px] leading-relaxed text-navy-200">
                  <span className="font-semibold text-white">Rule-based, not model-based.</span> Difficulty, mastery
                  and prerequisites are decided by transparent rules over your answers. The language model only
                  helps write explanations — never the decision.
                </p>
              </div>
            </div>
            <ThemeCycle />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- comparison */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="label mb-2">The difference</p>
            <h2 className="text-[26px] font-bold tracking-tight text-navy-900 sm:text-[32px]">
              One pace for everyone, or a pace for each student
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-navy-600">
              A fixed-pace lesson is efficient to plan and unfair to live through. LearnWise AI keeps the
              syllabus the same and changes the route.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <LinkButton to="/student/assessment" size="sm" variant="secondary">
                <ClipboardCheck className="h-4 w-4" /> Try the diagnostic
              </LinkButton>
              <LinkButton to="/about" size="sm" variant="ghost">
                What is real vs. simulated <ChevronRight className="h-4 w-4" />
              </LinkButton>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-navy-100">
            <div className="grid grid-cols-2 bg-navy-50">
              <div className="flex items-center gap-2 border-r border-navy-100 px-4 py-3">
                <CircleSlash2 className="h-4 w-4 text-navy-400" />
                <p className="text-[11.5px] font-bold uppercase tracking-[0.1em] text-navy-500">Fixed pace</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-3">
                <Sparkles className="h-4 w-4 text-brand-tealDeep" />
                <p className="text-[11.5px] font-bold uppercase tracking-[0.1em] text-brand-tealDeep">LearnWise AI</p>
              </div>
            </div>
            {COMPARE.map(([left, right], i) => (
              <div key={left} className={`grid grid-cols-2 text-[13px] ${i % 2 ? 'bg-white' : 'bg-white'}`}>
                <div className="flex items-start gap-2 border-r border-t border-navy-100 px-4 py-3 text-navy-500">
                  <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-300" />
                  <span>{left}</span>
                </div>
                <div className="flex items-start gap-2 border-t border-navy-100 px-4 py-3 font-medium text-navy-800">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-teal" />
                  <span>{right}</span>
                </div>
              </div>
            ))}
            <p className="border-t border-navy-100 bg-navy-50/60 px-4 py-2.5 text-[11px] text-navy-400">
              A conceptual comparison of approaches — not an evaluation of any specific product.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- teachers */}
      <section id="teachers" className="border-y border-navy-100 bg-navy-50/70 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <Card className="order-2 overflow-hidden lg:order-1">
              <div className="flex items-center justify-between border-b border-navy-100 px-4 py-3">
                <div>
                  <p className="text-[12.5px] font-semibold text-navy-900">Class 8-B · Mathematics</p>
                  <p className="text-[10.5px] text-navy-500">Week 6 · 24 students</p>
                </div>
                <Pill tone="violet">Teacher view</Pill>
              </div>
              <div className="space-y-2.5 p-4">
                {[
                  { name: 'Fractions', value: 52, tone: 'amber' },
                  { name: 'Variables', value: 68, tone: 'violet' },
                  { name: 'Equations', value: 61, tone: 'violet' },
                ].map((row) => (
                  <div key={row.name}>
                    <div className="mb-1 flex items-center justify-between text-[11.5px]">
                      <span className="font-medium text-navy-700">{row.name}</span>
                      <span className="text-navy-400">{row.value}% class average</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-navy-100">
                      <div
                        className={`h-full rounded-full ${row.tone === 'amber' ? 'bg-brand-amber' : 'bg-brand-violet'}`}
                        style={{ width: `${row.value}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="mt-3 rounded-xl border border-navy-100 bg-navy-50 p-3">
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-navy-400">Suggested classroom activity</p>
                  <p className="mt-1 text-[12.5px] leading-snug text-navy-700">
                    Revisit equivalent fractions with a visual model, then a 10-minute guided practice.
                  </p>
                  <p className="mt-1.5 text-[10.5px] italic text-navy-400">Suggestion only — the teacher decides.</p>
                </div>
              </div>
            </Card>

            <div className="order-1 lg:order-2">
              <p className="label mb-2">Teacher-centred</p>
              <h2 className="text-[26px] font-bold tracking-tight text-navy-900 sm:text-[32px]">
                Insight, not replacement
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-navy-600">
                The dashboard answers the question a teacher actually has on Monday morning: who needs what,
                and what should I do about it?
              </p>
              <ul className="mt-5 space-y-3">
                {[
                  { icon: LineChart, text: 'Topic mastery for the whole class, computed from real answers.' },
                  { icon: Users, text: 'A support list ranked by evidence — never a public ranking of children.' },
                  { icon: BookOpenCheck, text: 'A lesson-plan draft you can edit, shorten or discard in seconds.' },
                  { icon: ShieldCheck, text: 'Every recommendation can be overridden. The teacher stays in control.' },
                ].map((li) => (
                  <li key={li.text} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white text-brand-tealDeep ring-1 ring-navy-100">
                      <li.icon className="h-4 w-4" />
                    </span>
                    <span className="text-[13.5px] leading-relaxed text-navy-600">{li.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                <LinkButton to="/teacher" size="md">
                  Open teacher dashboard <ArrowRight className="h-4 w-4" />
                </LinkButton>
                <LinkButton to="/teacher/planner" size="md" variant="secondary">
                  See the lesson planner
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- accessibility band */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Globe2, title: 'Three languages, honestly scoped', body: 'Interface and the fractions topic are translated into Hindi and Gujarati. The app tells you which parts are English-only.', to: '/student/tutor?topic=fractions' },
            { icon: Download, title: 'Lessons that work without signal', body: 'Save lessons to this browser and they stay available offline. Live AI needs a connection — we do not pretend otherwise.', to: '/student/lessons' },
            { icon: Layers, title: 'Designed for a shared phone', body: 'Light pages, big tap targets and a low-data mode that trims animation and chart detail.', to: '/about' },
          ].map((item) => (
            <Card key={item.title} className="p-5">
              <item.icon className="h-5 w-5 text-brand-tealDeep" />
              <h3 className="mt-3 text-[14.5px] font-semibold text-navy-900">{item.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-navy-500">{item.body}</p>
              <Link to={item.to} className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-tealDeep hover:underline">
                See it in the prototype <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          ))}
        </div>

        <Card className="mt-8 overflow-hidden border-navy-900 bg-navy-900">
          <div className="grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="teal">Honest by default</Pill>
                <Pill tone="neutral">Prototype, not a product launch</Pill>
              </div>
              <h2 className="mt-3 text-[22px] font-bold tracking-tight text-white sm:text-[26px]">
                Explore a working prototype — sample data, no live AI
              </h2>
              <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-navy-300">
                Aarav is a fictional Class 8 student. Every score, mastery bar and recommendation in this demo is
                computed from the answers you give in this browser. There is no cloud account, no real student
                data, and no hidden model — the tutor runs on a hand-written content pack.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <LinkButton to="/student" size="lg" className="!bg-white !text-navy-900 hover:!bg-navy-100">
                Enter as Aarav <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton to="/about" size="lg" variant="secondary" className="!border-white/20 !bg-white/10 !text-white hover:!bg-white/15">
                <BookOpenCheck className="h-4 w-4" /> Reality check
              </LinkButton>
            </div>
          </div>
        </Card>
      </section>

      {/* ------------------------------------------------------------ footer */}
      <footer className="border-t border-navy-100 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-[12.5px] leading-relaxed text-navy-500">
              An adaptive learning prototype for Classes 6–10, built for the Code Kernel ’26 Decode Round.
            </p>
            <p className="mt-3 text-[11.5px] text-navy-400">
              X-Kernel, GRIET Hyderabad × Canvas Classes
            </p>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">Product</p>
            <ul className="space-y-1.5 text-[12.5px] text-navy-500">
              <li><Link to="/student" className="hover:text-navy-900">Student dashboard</Link></li>
              <li><Link to="/student/assessment" className="hover:text-navy-900">Diagnostic</Link></li>
              <li><Link to="/student/tutor" className="hover:text-navy-900">AI tutor</Link></li>
              <li><Link to="/student/path" className="hover:text-navy-900">Learning path</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">For adults</p>
            <ul className="space-y-1.5 text-[12.5px] text-navy-500">
              <li><Link to="/teacher" className="hover:text-navy-900">Teacher dashboard</Link></li>
              <li><Link to="/teacher/planner" className="hover:text-navy-900">Lesson planner</Link></li>
              <li><Link to="/parent" className="hover:text-navy-900">Parent summary</Link></li>
              <li><Link to="/parent/privacy" className="hover:text-navy-900">Privacy & access</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">Open</p>
            <ul className="space-y-1.5 text-[12.5px] text-navy-500">
              <li><Link to="/about" className="hover:text-navy-900">How it works</Link></li>
              <li><Link to="/about#limitations" className="hover:text-navy-900">Limitations</Link></li>
              <li><Link to="/student/lessons" className="hover:text-navy-900">Offline lessons</Link></li>
              <li><button onClick={() => setGuideOpen(true)} className="hover:text-navy-900">Guided demo</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-navy-100">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-[11.5px] text-navy-400 sm:px-6">
            <p>Code Kernel ’26 · Decode Round · Challenge: Adaptive Learning for Classes 6–10</p>
            <p>Prototype. Fictional student data. No live AI configured by default.</p>
          </div>
        </div>
      </footer>

      <DemoGuide open={guideOpen} onClose={() => setGuideOpen(false)} />

    </div>
  )
}
