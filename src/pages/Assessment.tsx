import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, Clock, Info, Lightbulb, ListChecks,
  ShieldCheck, Sparkles,
} from 'lucide-react'
import { PageHeader } from '../components/Layout'
import { Button, Callout, Card, Disclosure, Pill, ProgressBar } from '../components/ui'
import { DIAGNOSTIC_QUESTIONS, TOPICS } from '../data/curriculum'
import { scoreAssessment } from '../lib/adapt'
import type { AnsweredItem } from '../lib/adapt'
import { t, tr } from '../lib/i18n'
import { useApp } from '../lib/store'

const LETTERS = ['A', 'B', 'C', 'D']

export default function Assessment() {
  const { lang, commitAssessment, aiMode } = useApp()
  const navigate = useNavigate()
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [hinted, setHinted] = useState<Record<string, boolean>>({})
  const [showHint, setShowHint] = useState(false)
  const startedAt = useRef<number>(Date.now())
  const questionStart = useRef<number>(Date.now())
  const spent = useRef<Record<string, number>>({})

  const question = DIAGNOSTIC_QUESTIONS[index]
  const total = DIAGNOSTIC_QUESTIONS.length
  const answeredCount = Object.keys(answers).length
  const isLast = index === total - 1
  const selected = answers[question?.id]

  const coveredTopics = useMemo(
    () => [...new Set(DIAGNOSTIC_QUESTIONS.map((q) => q.topicId))].map((id) => TOPICS.find((tp) => tp.id === id)!),
    [],
  )

  const commitTime = () => {
    if (!question) return
    spent.current[question.id] = (spent.current[question.id] ?? 0) + (Date.now() - questionStart.current)
    questionStart.current = Date.now()
  }

  const goTo = (next: number) => {
    commitTime()
    setIndex(next)
    setShowHint(Boolean(hinted[DIAGNOSTIC_QUESTIONS[next].id]))
  }

  const choose = (optionIndex: number) => {
    setAnswers((a) => ({ ...a, [question.id]: optionIndex }))
  }

  const submit = () => {
    commitTime()
    const items: AnsweredItem[] = DIAGNOSTIC_QUESTIONS.filter((q) => answers[q.id] !== undefined).map((q) => ({
      question: q,
      chosen: answers[q.id],
      usedHint: Boolean(hinted[q.id]),
      ms: spent.current[q.id] ?? 0,
    }))
    const result = scoreAssessment(items, 'Algebra & fractions diagnostic')
    commitAssessment(result, items)
    navigate('/student/results')
  }

  /* ------------------------------------------------------------- intro */
  if (!started) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader
          eyebrow={t('assessment.eyebrowFull', lang)}
          title={t('assessment.title', lang)}
          subtitle={t('assessment.subtitle', lang)}
        />

        <Card className="card-pad">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="teal" dot>8 questions</Pill>
            <Pill tone="neutral"><Clock className="mr-1 h-3 w-3" /> about 4 minutes</Pill>
            <Pill tone="violet"><ListChecks className="mr-1 h-3 w-3" /> 3 topics</Pill>
            {aiMode === 'demo' && <Pill tone="amber">Demo mode</Pill>}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {coveredTopics.map((topic) => (
              <div key={topic.id} className="rounded-xl border border-navy-100 bg-navy-50/60 p-3">
                <p className="text-[12.5px] font-semibold text-navy-900">{tr(topic.name, lang)}</p>
                <p className="mt-1 text-[11.5px] leading-snug text-navy-500">{tr(topic.blurb, lang)}</p>
                <p className="mt-2 text-[10.5px] font-semibold uppercase tracking-wide text-navy-400">
                  {DIAGNOSTIC_QUESTIONS.filter((q) => q.topicId === topic.id).length} questions
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            <Callout tone="teal" icon={<ShieldCheck className="h-4 w-4" />}>
              <strong>Your answers decide the results.</strong> There is no simulated or random score. Every mastery
              figure you see afterwards is computed from this attempt, and the app shows the working.
            </Callout>
            <Callout tone="navy" icon={<Info className="h-4 w-4" />}>
              You can move back and forth before submitting. Nothing is timed or locked.
            </Callout>
          </div>

          <div className="mt-5 rounded-xl border border-teal-200/60 bg-brand-tealSoft/40 p-3 text-[12.5px] leading-relaxed text-[#0b5f57]">
            <strong>Recording a demo?</strong> Answer the two fraction questions (“1/2 + 1/3” and “simplify 6/9”)
            incorrectly on purpose. The app will then flag fractions as the gap — exactly the scenario the
            demonstration needs, computed honestly from your choices.
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              size="lg"
              onClick={() => {
                setStarted(true)
                startedAt.current = Date.now()
                questionStart.current = Date.now()
              }}
            >
              <ClipboardCheck className="h-4 w-4" /> Begin diagnostic
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/student')}>
              Back to dashboard
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  /* ---------------------------------------------------------- question */
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[12.5px] text-navy-500">
          <ClipboardCheck className="h-4 w-4 text-brand-tealDeep" />
          <span className="font-semibold text-navy-800">Diagnostic</span>
          <span className="text-navy-300">·</span>
          <span>{answeredCount} of {total} answered</span>
        </div>
        <Pill tone="teal">{t('quiz.question', lang)} {index + 1} {t('quiz.of', lang)} {total}</Pill>
      </div>

      <ProgressBar value={((index + 1) / total) * 100} tone="teal" className="mb-6 h-2.5" label="Diagnostic progress" />

      <Card className="overflow-hidden">
        <div className="border-b border-navy-100 bg-navy-50/60 px-5 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="violet">{tr(TOPICS.find((tp) => tp.id === question.topicId)!.name, lang)}</Pill>
            <span className="text-[11.5px] font-medium text-navy-400">
              Level {question.level} · {question.concept.replace(/-/g, ' ')}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <h2 className="text-[19px] font-semibold leading-snug text-navy-900 sm:text-[21px]">
            {tr(question.prompt, lang)}
          </h2>

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label={tr(question.prompt, lang)}>
            {question.options.map((option, i) => {
              const active = selected === i
              return (
                <button
                  key={option}
                  role="radio"
                  aria-checked={active}
                  onClick={() => choose(i)}
                  className={`group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${
                    active
                      ? 'border-brand-teal bg-brand-tealSoft ring-2 ring-brand-teal/25'
                      : 'border-navy-200 bg-white hover:border-navy-300 hover:bg-navy-50'
                  }`}
                >
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[12px] font-bold ${
                      active ? 'bg-brand-teal text-white' : 'bg-navy-100 text-navy-500 group-hover:bg-navy-200'
                    }`}
                  >
                    {active ? <CheckCircle2 className="h-4 w-4" /> : LETTERS[i]}
                  </span>
                  <span className="text-[15px] font-medium text-navy-900">{option}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-4">
            {showHint ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-200/70 bg-brand-amberSoft px-4 py-3 text-[13px] text-[#7a4f0d]">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-semibold">Hint</p>
                  <p className="mt-0.5">{tr(question.hint, lang)}</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowHint(true)
                  setHinted((h) => ({ ...h, [question.id]: true }))
                }}
                className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-navy-500 hover:text-navy-800"
              >
                <Lightbulb className="h-4 w-4" /> {t('common.hint', lang)}
                <span className="font-normal text-navy-400">(using a hint is recorded)</span>
              </button>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-navy-100 pt-4">
            <Button variant="secondary" size="sm" onClick={() => goTo(Math.max(0, index - 1))} disabled={index === 0}>
              <ArrowLeft className="h-4 w-4" /> {t('common.back', lang)}
            </Button>

            <div className="flex items-center gap-2">
              {!isLast ? (
                <Button
                  size="md"
                  onClick={() => goTo(Math.min(total - 1, index + 1))}
                  disabled={selected === undefined}
                >
                  {t('common.next', lang)} <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  size="md"
                  onClick={submit}
                  disabled={answeredCount < total}
                  ariaLabel="Submit diagnostic"
                >
                  <Sparkles className="h-4 w-4" /> {t('common.submit', lang)} · {answeredCount}/{total}
                </Button>
              )}
            </div>
          </div>

          {answeredCount < total && isLast && (
            <p className="mt-3 text-right text-[11.5px] text-navy-400">
              Answer all {total} questions to submit. {total - answeredCount} remaining.
            </p>
          )}
        </div>
      </Card>

      <div className="mt-4 grid gap-2 sm:grid-cols-8">
        {DIAGNOSTIC_QUESTIONS.map((q, i) => (
          <button
            key={q.id}
            onClick={() => goTo(i)}
            aria-label={`Go to question ${i + 1}`}
            className={`h-9 rounded-lg text-[12px] font-semibold transition-colors ${
              i === index
                ? 'bg-navy-900 text-white'
                : answers[q.id] !== undefined
                  ? 'bg-brand-tealSoft text-brand-tealDeep ring-1 ring-teal-200'
                  : 'bg-white text-navy-400 ring-1 ring-navy-200 hover:bg-navy-50'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <Disclosure title="How the scoring works" tone="neutral">
          <p>
            Each question is worth one mark. A topic’s score is the percentage of its questions you answered
            correctly: 80% or more counts as mastered, 50–79% as in progress, below 50% as needing practice.
            The concepts behind your wrong answers are listed on the results screen with the count.
          </p>
        </Disclosure>
      </div>
    </div>
  )
}
