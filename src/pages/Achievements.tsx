import {
  Award, Brain, Flame, Lock, Sparkles, Star, Target, Trophy,
} from 'lucide-react'
import { PageHeader } from '../components/Layout'
import {
  Callout, Card, Pill, ProgressBar, RingProgress, SectionHeading, Stat,
} from '../components/ui'
import { TrendArea } from '../components/Charts'
import { badgeCatalog, POINTS } from '../lib/adapt'
import { TOPICS } from '../data/curriculum'
import { t, tr } from '../lib/i18n'
import { useApp } from '../lib/store'
import type { Badge } from '../lib/types'

const ICONS = {
  target: Target,
  flame: Flame,
  star: Star,
  brain: Brain,
  trophy: Trophy,
  sparkles: Sparkles,
} as const

/** How each badge is earned — shown as text so nothing is a mystery. */
const CRITERIA: Record<string, string> = {
  'first-steps': 'Finish the 8-question diagnostic',
  'fraction-fixer': 'Reach 60% mastery in fractions',
  'steady-streak': 'Practise on three days running',
  'own-best': 'Beat your highest practice session',
  'thinking-hard': 'Answer a Level 3 question correctly',
}

export default function Achievements() {
  const { student, lang } = useApp()
  const catalog = badgeCatalog()
  const owned = new Map(student.badges.map((b) => [b.id, b]))

  const totalCorrect = student.attempts.filter((a) => a.correct).length
  const totalAnswered = student.attempts.length
  const accuracy = totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0

  // Four-week practice trend from real sessions — no invented history.
  const trend = (() => {
    const weeks: { label: string; classAvg: number; aarav?: number }[] = []
    const now = Date.now()
    for (let w = 3; w >= 0; w--) {
      const start = now - (w + 1) * 7 * 864e5
      const end = now - w * 7 * 864e5
      const sessions = student.sessions.filter((s) => {
        const t = new Date(s.at).getTime()
        return t >= start && t < end
      })
      const answered = sessions.reduce((n, s) => n + s.total, 0)
      const right = sessions.reduce((n, s) => n + s.correct, 0)
      weeks.push({
        label: w === 0 ? 'This week' : `${w}w ago`,
        classAvg: 0,
        aarav: answered ? Math.round((right / answered) * 100) : 0,
      })
    }
    return weeks
  })()
  const hasTrend = trend.some((t) => (t.aarav ?? 0) > 0)

  const pointsRows = [
    { label: 'Correct answer', value: `+${POINTS.correct}`, note: 'Once per question, never for repeats' },
    { label: 'Correct with a hint', value: `+${POINTS.correctWithHint}`, note: 'Hints are allowed — they just earn less' },
    { label: 'First diagnostic', value: `+${POINTS.diagnostic}`, note: 'Paid once, on completion' },
    { label: 'Practice session finished', value: `+${POINTS.sessionComplete}`, note: 'Only if all six questions were answered' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('achievements.eyebrow', lang)}
        title={t('achievements.title', lang)}
        subtitle={t('achievements.subtitle', lang)}
        actions={<Pill tone="amber" dot>{student.points} points</Pill>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Points" value={student.points} icon={<Star className="h-4 w-4" />} hint="Earned from completed work" />
        <Stat label="Day streak" value={student.streakDays} icon={<Flame className="h-4 w-4" />} hint={`Personal best ${student.bestStreak} days`} />
        <Stat label="Accuracy" value={`${accuracy}%`} icon={<Target className="h-4 w-4" />} hint={`${totalCorrect} of ${totalAnswered} answers`} />
        <Stat label="Badges" value={`${owned.size}/${catalog.length}`} icon={<Award className="h-4 w-4" />} hint="Each has a visible rule" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card className="card-pad">
          <SectionHeading
            eyebrow="Badge shelf"
            title="Earned and still locked"
            note="Locked badges show exactly what would unlock them."
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {catalog.map((b) => {
              const earned = owned.get(b.id) as Badge | undefined
              const Icon = ICONS[b.icon] ?? Trophy
              return (
                <div
                  key={b.id}
                  className={`relative rounded-xl border p-4 ${
                    earned ? 'border-teal-200/70 bg-brand-tealSoft/40' : 'border-dashed border-navy-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                        earned ? 'bg-brand-teal text-white' : 'bg-navy-100 text-navy-300'
                      }`}
                    >
                      {earned ? <Icon className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-[13.5px] font-semibold ${earned ? 'text-navy-900' : 'text-navy-500'}`}>
                        {tr(b.name, lang)}
                      </p>
                      <p className="mt-0.5 text-[12px] leading-snug text-navy-500">{tr(b.description, lang)}</p>
                    </div>
                  </div>
                  <p className="mt-3 border-t border-navy-100 pt-2 text-[11px] font-medium text-navy-400">
                    {earned ? (
                      <>Earned {new Date(earned.earnedAt ?? '').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</>
                    ) : (
                      <>How to unlock: {CRITERIA[b.id] ?? 'Keep practising'}</>
                    )}
                  </p>
                </div>
              )
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="card-pad">
            <SectionHeading eyebrow="Personal best" title="Best practice session" />
            <div className="mt-3 flex items-center gap-4">
              <RingProgress value={student.bestPracticeScore} label="best" />
              <div>
                <p className="text-[13px] font-semibold text-navy-900">
                  {student.bestPracticeScore > 0 ? `${student.bestPracticeScore}% correct` : 'No session yet'}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-navy-500">
                  {student.sessions.length > 0
                    ? `Across ${student.sessions.length} practice ${student.sessions.length === 1 ? 'session' : 'sessions'}. The record only moves when you beat it.`
                    : 'Finish a six-question practice session to set your first record.'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="card-pad">
            <SectionHeading eyebrow="How points work" title="The rules, in full" />
            <ul className="mt-3 space-y-2.5">
              {pointsRows.map((r) => (
                <li key={r.label} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[12.5px] font-medium text-navy-800">{r.label}</p>
                    <p className="text-[11px] text-navy-400">{r.note}</p>
                  </div>
                  <span className="shrink-0 rounded-md bg-navy-100 px-2 py-0.5 text-[11.5px] font-bold text-navy-700">{r.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 rounded-lg bg-navy-50 p-2.5 text-[11px] leading-relaxed text-navy-500">
              Answering the same question again does not add points. Points, badges and streaks are stored in this
              browser’s local storage and reset with the demo data.
            </p>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="card-pad">
          <SectionHeading
            eyebrow="Last four weeks"
            title="Practice accuracy"
            note="Built from your saved sessions only."
          />
          {hasTrend ? (
            <div className="mt-3">
              <TrendArea data={trend} height={190} />
              <p className="mt-2 text-[11px] text-navy-400">Weeks with no session show as 0% — they are real gaps, not missing data.</p>
            </div>
          ) : (
            <p className="mt-6 text-[12.5px] text-navy-500">No sessions recorded yet. This chart fills in as you practise.</p>
          )}
        </Card>

        <Card className="card-pad">
          <SectionHeading eyebrow="Mastery" title="Where the points came from" />
          <div className="mt-4 space-y-3.5">
            {TOPICS.map((t) => {
              const m = student.mastery[t.id]
              return (
                <div key={t.id}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-[12.5px] font-medium text-navy-700">{tr(t.name, lang)}</span>
                    <span className="text-[11px] tabular-nums text-navy-400">
                      {m.answered ? `${m.score}% · ${m.correct}/${m.answered}` : 'no answers'}
                    </span>
                  </div>
                  <ProgressBar value={m.score} tone={m.score >= 80 ? 'teal' : m.score >= 50 ? 'violet' : 'amber'} />
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <Callout tone="violet" icon={<Sparkles className="h-4 w-4" />}>
        Streaks are counted in calendar days from the last activity stored in this browser. There are no notifications —
        the reminder page lists what is due instead.
      </Callout>
    </div>
  )
}
