import {
  AlertTriangle, ArrowRight, BookOpen, CheckCircle2, Cpu, Database, Languages, Layers,
  ServerOff, ShieldCheck, Sparkles, WifiOff,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/Layout'
import { Callout, Card, Disclosure, Pill, SectionHeading } from '../components/ui'
import { useApp } from '../lib/store'

const BUILT = [
  'Working diagnostic quiz with real scoring, per-question explanations and topic-level summaries.',
  'Rule-based adaptive practice: two correct answers move a level up, two wrong move it down, hints hold the level.',
  'A learning path whose locks open from evidence, with the prerequisite score shown on every locked topic.',
  'A tutor with topic explanations, worked examples, an SVG pizza model and a chat surface that answers from a fixed knowledge base.',
  'Multilingual interface and explanations in English, Hindi and Gujarati, with coverage shown honestly.',
  'Teacher dashboard with class mastery, students needing support, concept insights, drill builder and a lesson-plan template.',
  'Parent summary with mastery, progress history and home-support ideas.',
  'Points, badges, streaks and a personal best, all stored locally and never awarded for repeat clicks.',
  'Revision scheduling with short quizzes, plus lessons that can be saved for offline reading.',
]

const SIMULATED = [
  { title: 'AI tutor answers', detail: 'In demo mode the tutor replies from a predefined knowledge base with a visible “demo mode” label. It is not a language model.' },
  { title: 'Class records', detail: 'Aarav and 23 classmates are fictional. Only Aarav’s answers are live, and only in this browser.' },
  { title: 'Notifications', detail: 'Revision reminders are scheduled inside the app. No email, SMS or push notification is sent.' },
  { title: 'Offline sync', detail: 'Queued progress is flushed to local state when the connection returns. There is no server to sync with.' },
  { title: 'Lesson plans', detail: 'Generated from a fixed four-part template scaled to the time you choose, not by a model.' },
]

export default function About() {
  const { aiMode, lang } = useApp()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="About this prototype"
        title="LearnWise AI"
        subtitle="Every Student Learns Differently. Now, Learning Does Too."
        actions={<Pill tone="amber" dot>Code Kernel ’26</Pill>}
      />

      <Callout tone="violet" icon={<ShieldCheck className="h-4 w-4" />}>
        Built for a hackathon, and honest about it. This page lists what genuinely works and what is a labelled stand-in, so
        nothing on the previous pages can be mistaken for production software.
      </Callout>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-pad">
          <SectionHeading eyebrow="Genuinely implemented" title="What works right now" />
          <ul className="mt-3 space-y-2">
            {BUILT.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-teal" />
                <span className="text-[12.5px] leading-relaxed text-navy-600">{b}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="card-pad">
          <SectionHeading eyebrow="Labelled stand-ins" title="What is simulated" />
          <ul className="mt-3 space-y-2.5">
            {SIMULATED.map((s) => (
              <li key={s.title} className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-amber" />
                <div>
                  <p className="text-[12.5px] font-semibold text-navy-800">{s.title}</p>
                  <p className="text-[11.5px] leading-relaxed text-navy-500">{s.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="card-pad">
          <Cpu className="h-4 w-4 text-brand-violet" />
          <p className="mt-2 text-[12.5px] font-semibold text-navy-900">Adaptivity</p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-navy-500">Deterministic rules over real answers. A model never decides a level.</p>
        </Card>
        <Card className="card-pad">
          <Languages className="h-4 w-4 text-brand-teal" />
          <p className="mt-2 text-[12.5px] font-semibold text-navy-900">Languages</p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-navy-500">Interface strings in three languages; explanation coverage shown per topic. Active: {lang.toUpperCase()}.</p>
        </Card>
        <Card className="card-pad">
          <Database className="h-4 w-4 text-brand-amber" />
          <p className="mt-2 text-[12.5px] font-semibold text-navy-900">Storage</p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-navy-500">One localStorage key, versioned, resettable. No accounts, no backend database.</p>
        </Card>
        <Card className="card-pad">
          <ServerOff className="h-4 w-4 text-navy-500" />
          <p className="mt-2 text-[12.5px] font-semibold text-navy-900">AI mode</p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-navy-500">
            {aiMode === 'live' ? 'Live endpoint flag is on; responses still come with a source label.' : 'Demo mode: predefined responses, no network call.'}
          </p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Card className="card-pad">
          <SectionHeading eyebrow="How adaptivity is decided" title="Rules you can read" />
          <div className="mt-3 space-y-2">
            <Disclosure title="Level up" defaultOpen tone="teal">
              Two correct answers in a row without a hint raise the level, up to Level 3. Reaching Level 3 accuracy marks the
              topic as mastered and unlocks the next node on the path.
            </Disclosure>
            <Disclosure title="Hold" tone="violet">
              A correct answer with a hint keeps the level where it is — the student got there, but not yet unaided.
            </Disclosure>
            <Disclosure title="Step back">
              Two wrong answers in a row lower the level by one (never below Level 1) and switch the next explanation to a
              simpler version, with a prerequisite question first.
            </Disclosure>
            <Disclosure title="Where the evidence comes from">
              The diagnostic result and every practice answer recorded in this browser. The same rules run on the same data,
              so the same answers always produce the same recommendation.
            </Disclosure>
          </div>
        </Card>

        <Card className="card-pad">
          <SectionHeading eyebrow="Principles" title="What we refused to fake" />
          <ul className="mt-3 space-y-2 text-[12.5px] leading-relaxed text-navy-600">
            <li>• No invented students, statistics or schools presented as real.</li>
            <li>• No claim that a model is running when it is not.</li>
            <li>• No reward for clicking the same answer twice.</li>
            <li>• No score that was not computed from answers actually given.</li>
            <li>• No claim that cloud tutoring works offline.</li>
            <li>• No teacher decision taken automatically.</li>
          </ul>
          <Callout tone="navy" icon={<Layers className="h-4 w-4" />}>
            The central message: LearnWise AI helps every student learn at their own pace while giving teachers better
            insight into how to support them.
          </Callout>
        </Card>
      </div>

      <Card className="card-pad">
        <SectionHeading eyebrow="Try it" title="A five-minute route through the demo" note="Same order as the demo script." />
        <ol className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { label: 'Student dashboard', to: '/student' },
            { label: 'Take the diagnostic', to: '/student/assessment' },
            { label: 'See the results', to: '/student/results' },
            { label: 'Pizza tutor example', to: '/student/tutor?topic=fractions' },
            { label: 'Adaptive practice', to: '/student/practice?topic=fractions' },
            { label: 'Learning path', to: '/student/path' },
            { label: 'Teacher dashboard', to: '/teacher' },
            { label: 'Parent summary', to: '/parent' },
            { label: 'Privacy controls', to: '/parent/privacy' },
          ].map((s, i) => (
            <li key={s.to}>
              <Link
                to={s.to}
                className="flex items-center gap-2 rounded-xl border border-navy-100 px-3 py-2.5 text-[12.5px] font-medium text-navy-700 transition-colors hover:border-brand-teal hover:bg-brand-tealSoft/40"
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy-900 text-[10px] font-bold text-white">{i + 1}</span>
                <span className="flex-1">{s.label}</span>
                <ArrowRight className="h-3.5 w-3.5 text-navy-300" />
              </Link>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="card-pad">
          <BookOpen className="h-4 w-4 text-brand-teal" />
          <p className="mt-2 text-[12.5px] font-semibold text-navy-900">Built with</p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-navy-500">
            React, Vite, TypeScript, Tailwind CSS, lucide-react and Recharts. Client-side persistence via localStorage.
            Optional server endpoint for a live model, with the key kept server-side.
          </p>
        </Card>
        <Card className="card-pad">
          <WifiOff className="h-4 w-4 text-brand-violet" />
          <p className="mt-2 text-[12.5px] font-semibold text-navy-900">Known limitations</p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-navy-500">
            One class and one subject only; no accounts; no real sync; tutor language coverage is partial and stated; the
            service worker caches the app shell but live AI still needs a connection.
          </p>
        </Card>
      </div>

      <p className="flex items-center justify-center gap-1.5 pb-2 text-[11px] text-navy-400">
        <Sparkles className="h-3 w-3" /> Prototype for Code Kernel ’26 · sample data only
      </p>
    </div>
  )
}
