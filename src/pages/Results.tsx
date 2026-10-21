import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, CheckCircle2, ClipboardCheck, Info, Lightbulb, RotateCcw, Sparkles, Target, XCircle,
} from 'lucide-react'
import { PageHeader } from '../components/Layout'
import { Button, Callout, Card, Disclosure, LinkButton, Pill, ProgressBar, RingProgress, SectionHeading } from '../components/ui'
import { DIAGNOSTIC_QUESTIONS, TOPICS } from '../data/curriculum'
import { conceptLabel, recommend } from '../lib/adapt'
import { t, tr } from '../lib/i18n'
import { useApp } from '../lib/store'

const statusCopy = {
  completed: { label: 'Secure', tone: 'teal' as const, note: 'This foundation looks solid — keep it warm with revision.' },
  'in-progress': { label: 'Developing', tone: 'violet' as const, note: 'Mostly there, with one or two shaky steps worth practising.' },
  'needs-practice': { label: 'Needs practice', tone: 'amber' as const, note: 'This is the gap to close first. It is a prerequisite for what follows.' },
  available: { label: 'Not attempted', tone: 'neutral' as const, note: 'No evidence yet.' },
  locked: { label: 'Locked', tone: 'neutral' as const, note: '' },
}

export default function Results() {
  const { student, lang } = useApp()
  const navigate = useNavigate()
  const result = student.assessments[0]
  const rec = recommend(student)

  if (!result) {
    return (
      <div className="mx-auto max-w-xl">
        <Card className="card-pad text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-brand-tealSoft text-brand-tealDeep">
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-navy-900">No diagnostic yet</h1>
          <p className="mt-2 text-[13.5px] text-navy-500">
            Take the eight-question diagnostic to see topic-level results computed from your own answers.
          </p>
          <LinkButton to="/student/assessment" className="mt-4">
            Start diagnostic <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </Card>
      </div>
    )
  }

  const percent = Math.round((result.correct / result.total) * 100)
  const attempts = student.attempts.filter((a) => a.at === result.at)
  const wrong = attempts.filter((a) => !a.correct)
  const flaggedTopic = result.flagged[0]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${result.title} · ${new Date(result.at).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}`}
        title={t('quiz.results', lang)}
        subtitle={t('results.subtitle', lang)}
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => navigate('/student/assessment')}>
              <RotateCcw className="h-4 w-4" /> Retake
            </Button>
            <LinkButton to={rec.href} size="sm">
              {tr(rec.cta, lang)} <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.55fr]">
        {/* score */}
        <Card className="card-pad flex flex-col items-center justify-center text-center">
          <RingProgress value={percent} size={132} stroke={12} label={`${result.correct}/${result.total}`} />
          <p className="mt-3 text-[15px] font-semibold text-navy-900">
            {result.correct} of {result.total} correct · {percent}%
          </p>
          <p className="mt-1 max-w-xs text-[12.5px] leading-relaxed text-navy-500">
            {percent >= 80
              ? 'A strong start. The recommendation below moves you forward rather than back.'
              : percent >= 50
                ? 'A reasonable base with clear gaps. The next step targets the weakest topic first.'
                : 'Several gaps surfaced — which is exactly what a diagnostic is for. Nothing here is permanent.'}
          </p>
          {flaggedTopic && (
            <div className="mt-4 w-full rounded-xl border border-amber-200/70 bg-brand-amberSoft p-3 text-left">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#8a5a10]">Main gap identified</p>
              <p className="mt-1 text-[13px] font-semibold text-navy-900">
                {conceptLabel(flaggedTopic.conceptId, lang)}
              </p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-[#7a4f0d]">{flaggedTopic.reason}</p>
            </div>
          )}
        </Card>

        {/* by topic */}
        <Card className="card-pad">
          <SectionHeading eyebrow={t('quiz.byTopic', lang)} title="Where you stand, topic by topic" />
          <div className="mt-4 space-y-4">
            {result.byTopic.map((row) => {
              const topic = TOPICS.find((tp) => tp.id === row.topicId)!
              const copy = statusCopy[row.status as keyof typeof statusCopy] ?? statusCopy.available
              return (
                <div key={row.topicId} className="rounded-xl border border-navy-100 p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className="text-[13.5px] font-semibold text-navy-900">{tr(topic.name, lang)}</p>
                      <Pill tone={copy.tone}>{copy.label}</Pill>
                    </div>
                    <span className="text-[12px] font-semibold text-navy-500">
                      {row.correct}/{row.total} · {row.percent}%
                    </span>
                  </div>
                  <ProgressBar
                    value={row.percent}
                    tone={row.status === 'completed' ? 'teal' : row.status === 'in-progress' ? 'violet' : 'amber'}
                    className="mt-2.5"
                    label={`${topic.name.en} score`}
                  />
                  <p className="mt-2 text-[12px] text-navy-500">{copy.note}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-navy-50 p-3">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-navy-400">Questions answered</p>
              <p className="mt-1 text-[15px] font-bold text-navy-900">{result.total}</p>
            </div>
            <div className="rounded-xl bg-navy-50 p-3">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-navy-400">Used a hint</p>
              <p className="mt-1 text-[15px] font-bold text-navy-900">{attempts.filter((a) => a.usedHint).length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* evidence + next step */}
      <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <Card className="card-pad">
          <SectionHeading
            eyebrow="Evidence"
            title="Concepts behind the wrong answers"
            note="These are the specific ideas the rules flagged, with the count that triggered it."
          />
          <div className="mt-4 space-y-2.5">
            {result.flagged.length === 0 && (
              <div className="flex items-start gap-2.5 rounded-xl border border-teal-200/70 bg-brand-tealSoft p-3 text-[13px] text-[#0b5f57]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <p>No concept was flagged this time. Your next step moves you forward on the path.</p>
              </div>
            )}
            {result.flagged.map((f) => (
              <div key={f.conceptId} className="flex items-start gap-3 rounded-xl border border-navy-100 p-3.5">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-amberSoft text-[#8a5a10]">
                  <Target className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold text-navy-900">{conceptLabel(f.conceptId, lang)}</p>
                    <Pill tone="amber">{f.wrong} of {f.total} wrong</Pill>
                  </div>
                  <p className="mt-1 text-[12px] text-navy-500">
                    In {TOPICS.find((tp) => tp.id === f.topicId)!.name.en.toLowerCase()}.{' '}
                    <Link to={`/student/tutor?topic=${f.topicId}`} className="font-semibold text-brand-tealDeep hover:underline">
                      Ask the tutor about this
                    </Link>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Disclosure title="Show every question, your answer and the explanation">
              <div className="mt-2 space-y-4">
                {DIAGNOSTIC_QUESTIONS.map((q, i) => {
                  const attempt = attempts.find((a) => a.questionId === q.id)
                  if (!attempt) return null
                  const correct = attempt.correct
                  return (
                    <div key={q.id} className="rounded-xl border border-navy-100 p-3.5">
                      <div className="flex items-start gap-2">
                        <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${correct ? 'bg-brand-tealSoft text-brand-tealDeep' : 'bg-brand-roseSoft text-brand-rose'}`}>
                          {correct ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-navy-900">Q{i + 1}. {tr(q.prompt, lang)}</p>
                          <div className="mt-2 grid gap-1 text-[12.5px] sm:grid-cols-2">
                            <p className={correct ? 'text-brand-tealDeep' : 'text-brand-rose'}>
                              Your answer: <span className="font-semibold">{q.options[attempt.chosen]}</span>
                            </p>
                            {!correct && (
                              <p className="text-brand-tealDeep">
                                Correct: <span className="font-semibold">{q.options[q.correct]}</span>
                              </p>
                            )}
                          </div>
                          <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-navy-50 p-2.5">
                            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-400" />
                            <p className="text-[12px] leading-relaxed text-navy-600">{tr(q.explanation, lang)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Disclosure>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="card-pad">
            <SectionHeading eyebrow={t('common.recommended', lang)} title={tr(rec.title, lang)} />
            <p className="mt-2 text-[13px] leading-relaxed text-navy-600">{rec.reason}</p>
            <div className="mt-4 flex flex-col gap-2">
              <LinkButton to={rec.href}>{tr(rec.cta, lang)} <ArrowRight className="h-4 w-4" /></LinkButton>
              <LinkButton to="/student/path" variant="secondary">Open learning path</LinkButton>
            </div>
          </Card>

          <Card className="card-pad">
            <SectionHeading eyebrow="Saved automatically" title="What this changed" />
            <ul className="mt-3 space-y-2 text-[12.5px] text-navy-600">
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-teal" /> Topic mastery updated from these answers</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-teal" /> A revision reminder scheduled for the weakest topic</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-teal" /> Learning points added for new correct answers</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-teal" /> Your teacher view now shows this evidence</li>
            </ul>
            <Callout tone="navy" icon={<Info className="h-4 w-4" />}>
              Progress is stored in this browser only. Refreshing the page keeps it; resetting the demo clears it.
            </Callout>
          </Card>

          {wrong.length > 0 && (
            <Card className="card-pad">
              <SectionHeading eyebrow="Fastest route" title="Fix the first gap" />
              <div className="mt-2 flex items-start gap-2 text-[12.5px] text-navy-600">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-violet" />
                <p>
                  {conceptLabel(result.flagged[0]?.conceptId ?? 'add-subtract-fractions', lang)} is blocking the next
                  topic. A five-minute tutor session plus one practice set usually clears it.
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <LinkButton to={`/student/tutor?topic=${flaggedTopic?.topicId ?? 'fractions'}`} size="sm" variant="violet">
                  Open tutor
                </LinkButton>
                <LinkButton to={`/student/practice?topic=${flaggedTopic?.topicId ?? 'fractions'}`} size="sm" variant="secondary">
                  Practise now
                </LinkButton>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
