import { useMemo } from 'react'
import {
  BookOpen, CalendarCheck2, CheckCircle2, Clock3, HeartHandshake, Info, Lock, MessageCircle,
  ShieldCheck, TrendingUp,
} from 'lucide-react'
import { PageHeader } from '../components/Layout'
import {
  Callout, Card, Disclosure, Pill, ProgressBar, RingProgress, SectionHeading, Stat,
} from '../components/ui'
import { TrendArea } from '../components/Charts'
import { conceptLabel, UNLOCK_THRESHOLD } from '../lib/adapt'
import { TOPICS } from '../data/curriculum'
import { LESSON_LIBRARY } from '../data/seed'
import { tr } from '../lib/i18n'
import { useApp } from '../lib/store'

const SUPPORT: { title: string; detail: string }[] = [
  {
    title: 'Ten minutes on fractions, not an hour',
    detail: 'Ask Aarav to show you the pizza example and explain why 1/2 + 1/3 is 5/6. Explaining out loud is the strongest check.',
  },
  {
    title: 'Ask “how did you get that?”',
    detail: 'When an answer is wrong, ask for the step before it. The gap is almost always one step earlier, not at the answer.',
  },
  {
    title: 'Let him use the hint button',
    detail: 'Hints lower the points slightly, and that is fine. Using a hint is better than skipping a question.',
  },
  {
    title: 'Keep the streak small and real',
    detail: 'Two short sessions a week beats one long one. The app counts a day as active when real questions are answered.',
  },
]

export default function Parent() {
  const { student, lang } = useApp()

  const mastered = TOPICS.filter((t) => student.mastery[t.id].score >= 80 && student.mastery[t.id].answered > 0)
  const needsPractice = TOPICS.filter((t) => student.mastery[t.id].answered > 0 && student.mastery[t.id].score < UNLOCK_THRESHOLD)
  const untouched = TOPICS.filter((t) => student.mastery[t.id].answered === 0)
  const lastAssessment = student.assessments[student.assessments.length - 1]

  const improvement = useMemo(() => {
    if (!student.assessments.length) return []
    return student.assessments.map((a, i) => ({
      label: i === 0 ? 'Diagnostic 1' : `Diagnostic ${i + 1}`,
      classAvg: 0,
      aarav: Math.round((a.correct / a.total) * 100),
    }))
  }, [student.assessments])

  const hasImprovement = improvement.length >= 2
  const recent = student.history.slice(0, 6)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Parent summary"
        title="How Aarav is going"
        subtitle="A short, plain-language view of the work your child did in this app."
        actions={<Pill tone="teal" dot>{student.className} · {student.section} · Mathematics</Pill>}
      />

      <Callout tone="violet" icon={<ShieldCheck className="h-4 w-4" />}>
        This page is a sample for the Code Kernel ’26 prototype. Aarav and every record here are fictional demonstration
        data stored only in this browser. No real child’s information is used.
      </Callout>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="card-pad">
          <Stat label="Days active" value={student.streakDays} icon={<CalendarCheck2 className="h-4 w-4" />} tone="teal" hint={`Best run ${student.bestStreak} days`} />
        </Card>
        <Card className="card-pad">
          <Stat label="Questions answered" value={student.attempts.length} icon={<MessageCircle className="h-4 w-4" />} hint="Including practice and revision" />
        </Card>
        <Card className="card-pad">
          <Stat label="Lessons finished" value={student.lessonsCompleted.length} icon={<BookOpen className="h-4 w-4" />} tone="violet" hint={`of ${LESSON_LIBRARY.length} available`} />
        </Card>
        <Card className="card-pad">
          <Stat label="Last assessment" value={lastAssessment ? `${Math.round((lastAssessment.correct / lastAssessment.total) * 100)}%` : 'Not yet'} icon={<TrendingUp className="h-4 w-4" />} tone="amber" hint={lastAssessment ? new Date(lastAssessment.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Diagnostic not taken'} />
        </Card>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="card-pad">
          <SectionHeading
            eyebrow="Topics"
            title="What is secure and what needs work"
            note={`A topic is secure at ${80}% or above and needs practice below ${UNLOCK_THRESHOLD}%.`}
          />
          <div className="mt-4 space-y-3.5">
            {TOPICS.map((t) => {
              const m = student.mastery[t.id]
              const status = m.answered === 0 ? 'Not started' : m.score >= 80 ? 'Secure' : m.score >= UNLOCK_THRESHOLD ? 'Getting there' : 'Needs practice'
              const tone = m.answered === 0 ? 'neutral' : m.score >= 80 ? 'teal' : m.score >= UNLOCK_THRESHOLD ? 'violet' : 'amber'
              return (
                <div key={t.id}>
                  <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[12.5px] font-medium text-navy-800">{tr(t.name, lang)}</span>
                    <div className="flex items-center gap-2">
                      <Pill tone={tone as 'teal' | 'violet' | 'amber' | 'neutral'}>{status}</Pill>
                      <span className="text-[11px] tabular-nums text-navy-400">{m.answered ? `${m.score}%` : '—'}</span>
                    </div>
                  </div>
                  <ProgressBar value={m.score} tone={m.score >= 80 ? 'teal' : m.score >= UNLOCK_THRESHOLD ? 'violet' : 'amber'} />
                </div>
              )
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="card-pad">
            <SectionHeading eyebrow="Where to help" title="Three short suggestions" action={<Pill tone="violet">ideas</Pill>} />
            <ul className="mt-3 space-y-3">
              {SUPPORT.slice(0, 3).map((s) => (
                <li key={s.title} className="flex items-start gap-2.5">
                  <HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-brand-violet" />
                  <div>
                    <p className="text-[12.5px] font-semibold text-navy-900">{s.title}</p>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-navy-500">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="card-pad">
            <SectionHeading eyebrow="Fractions" title="The one gap to focus on" />
            <div className="mt-3 flex items-center gap-4">
              <RingProgress value={student.mastery.fractions.score} tone="#E0A64B" label="fractions" />
              <p className="text-[12px] leading-relaxed text-navy-600">
                {student.assessments[0]?.flagged.length
                  ? `The diagnostic showed difficulty with ${conceptLabel(student.assessments[0].flagged[0].conceptId, lang).toLowerCase()}. `
                  : 'The diagnostic has not been taken yet. '}
                {student.mastery.fractions.answered
                  ? `Aarav has answered ${student.mastery.fractions.answered} fraction questions and got ${student.mastery.fractions.correct} right.`
                  : 'Once he answers a few fraction questions, this will fill in.'}
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Card className="card-pad">
          <SectionHeading
            eyebrow="Over time"
            title="Assessment scores"
            note={hasImprovement ? 'Only real assessments are plotted — nothing is projected.' : 'One assessment so far. A second one will show a trend here.'}
          />
          {hasImprovement ? (
            <div className="mt-3">
              <TrendArea data={improvement} height={180} />
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-navy-200 p-6 text-center">
              <TrendingUp className="mx-auto h-6 w-6 text-navy-200" />
              <p className="mt-2 text-[12.5px] font-medium text-navy-600">
                {lastAssessment ? `First assessment: ${Math.round((lastAssessment.correct / lastAssessment.total) * 100)}%. This becomes a trend after the next one.` : 'No assessment yet.'}
              </p>
            </div>
          )}
        </Card>

        <Card className="card-pad">
          <SectionHeading eyebrow="Recent activity" title="What Aarav did" />
          <ul className="mt-3 space-y-2.5">
            {recent.map((h, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-navy-50">
                  {h.kind === 'lesson' ? <BookOpen className="h-3 w-3 text-navy-500" /> : h.kind === 'badge' ? <CheckCircle2 className="h-3 w-3 text-brand-teal" /> : <Clock3 className="h-3 w-3 text-navy-500" />}
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] leading-snug text-navy-700">{h.label}</p>
                  <p className="text-[10.5px] text-navy-400">{new Date(h.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
              </li>
            ))}
            {recent.length === 0 && <p className="text-[12.5px] text-navy-500">No activity saved yet.</p>}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-pad">
          <SectionHeading eyebrow="Secure" title={`${mastered.length} topic${mastered.length === 1 ? '' : 's'} at 80%+`} />
          <div className="mt-3 flex flex-wrap gap-2">
            {mastered.map((t) => <Pill key={t.id} tone="teal">{tr(t.name, lang)}</Pill>)}
            {mastered.length === 0 && <p className="text-[12.5px] text-navy-500">Nothing at 80% yet — that is normal early on.</p>}
          </div>
          <div className="mt-5">
            <SectionHeading eyebrow="Next" title={`${needsPractice.length} to practise · ${untouched.length} not started`} />
            <div className="mt-3 flex flex-wrap gap-2">
              {needsPractice.map((t) => <Pill key={t.id} tone="amber">{tr(t.name, lang)}</Pill>)}
              {untouched.map((t) => <Pill key={t.id} tone="neutral">{tr(t.name, lang)}</Pill>)}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="card-pad">
            <SectionHeading eyebrow="More ideas" title="For the weekend" />
            <ul className="mt-3 space-y-2.5">
              {SUPPORT.slice(3).map((s) => (
                <li key={s.title}>
                  <p className="text-[12.5px] font-semibold text-navy-900">{s.title}</p>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-navy-500">{s.detail}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Disclosure title="What you are and are not seeing">
            <ul className="space-y-1.5">
              <li>• Mastery is the share of correct answers, not a school grade.</li>
              <li>• Teacher suggestions are visible to teachers only; this page shows what the app recorded.</li>
              <li>• Nothing is uploaded — the whole record lives in this browser’s local storage.</li>
              <li>• There are no notifications or emails in this prototype.</li>
            </ul>
          </Disclosure>

          <Callout tone="navy" icon={<Lock className="h-4 w-4" />}>
            Curious what is stored? The privacy page lists every field and how to delete it.
          </Callout>
        </div>
      </div>

      <Callout tone="teal" icon={<Info className="h-4 w-4" />}>
        Teacher recommendations are suggestions only. Your child’s teacher decides what to use in class, and the app never
        changes a level or a mark without a person choosing to.
      </Callout>
    </div>
  )
}
