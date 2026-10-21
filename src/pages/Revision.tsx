import { useState } from 'react'
import { Bell, CalendarClock, Check, CheckCircle2, ChevronRight, Clock, Info, Lightbulb, Plus, X } from 'lucide-react'
import { PageHeader } from '../components/Layout'
import {
  Button, Callout, Card, Disclosure, LinkButton, Modal, Pill, ProgressBar, SectionHeading,
} from '../components/ui'
import { TOPICS, questionsForTopic } from '../data/curriculum'
import { REVISION_COPY } from '../data/seed'
import { t, tr } from '../lib/i18n'
import { useApp } from '../lib/store'
import type { Question, RevisionItem, TopicId } from '../lib/types'

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })

export default function Revision() {
  const { student, lang, completeRevision, addRevision } = useApp()
  const [active, setActive] = useState<RevisionItem | null>(null)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [scheduleTopic, setScheduleTopic] = useState<TopicId>('fractions')
  const [scheduleDays, setScheduleDays] = useState(3)

  const now = Date.now()
  const due = student.revision.filter((r) => !r.done && new Date(r.dueAt).getTime() <= now)
  const upcoming = student.revision
    .filter((r) => !r.done && new Date(r.dueAt).getTime() > now)
    .sort((a, b) => +new Date(a.dueAt) - +new Date(b.dueAt))
  const done = student.revision.filter((r) => r.done)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('nav.revision', lang)}
        title={t('revision.title', lang)}
        subtitle={t('revision.subtitle', lang)}
        actions={
          <Button variant="secondary" size="sm" onClick={() => setScheduleOpen(true)}>
            <Plus className="h-4 w-4" /> Schedule a review
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Due now', value: due.length, tone: 'amber' as const, icon: Bell },
          { label: 'Coming up', value: upcoming.length, tone: 'violet' as const, icon: CalendarClock },
          { label: 'Completed', value: done.length, tone: 'teal' as const, icon: CheckCircle2 },
        ].map((s) => (
          <Card key={s.label} className="flex items-center gap-3 p-4">
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${
              s.tone === 'amber' ? 'bg-brand-amberSoft text-[#8a5a10]' : s.tone === 'violet' ? 'bg-brand-violetSoft text-[#4b30c8]' : 'bg-brand-tealSoft text-brand-tealDeep'
            }`}>
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">{s.label}</p>
              <p className="text-xl font-bold text-navy-900">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <Card className="card-pad">
            <SectionHeading
              eyebrow="Due now"
              title={due.length ? 'Start with these' : 'Nothing overdue'}
              note={due.length ? 'Each review is three short questions from the topic.' : 'Take the diagnostic or a practice session and reviews will appear here.'}
            />
            <div className="mt-4 space-y-3">
              {due.length === 0 && (
                <div className="rounded-xl border border-dashed border-navy-200 p-6 text-center">
                  <CheckCircle2 className="mx-auto h-6 w-6 text-brand-teal" />
                  <p className="mt-2 text-[13px] font-medium text-navy-700">You are up to date</p>
                  <p className="mt-0.5 text-[12px] text-navy-500">
                    Weak topics get a review within the day; stronger topics get one after three days.
                  </p>
                </div>
              )}
              {due.map((item) => {
                const topic = TOPICS.find((tp) => tp.id === item.topicId)!
                return (
                  <div key={item.id} className="rounded-xl border border-amber-200/70 bg-brand-amberSoft/50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-[13.5px] font-semibold text-navy-900">{tr(topic.name, lang)}</p>
                        <p className="text-[11.5px] text-[#7a4f0d]">{REVISION_COPY[item.reason].title} · due {fmt(item.dueAt)}</p>
                      </div>
                      <Button size="sm" onClick={() => setActive(item)}>
                        Start review <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="mt-2 text-[12px] leading-relaxed text-navy-600">{REVISION_COPY[item.reason].note}</p>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card className="card-pad">
            <SectionHeading eyebrow="Coming up" title="Scheduled reviews" />
            <div className="mt-3 divide-y divide-navy-50">
              {upcoming.length === 0 && <p className="py-2 text-[12.5px] text-navy-500">Nothing scheduled yet.</p>}
              {upcoming.map((item) => {
                const topic = TOPICS.find((tp) => tp.id === item.topicId)!
                return (
                  <div key={item.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex items-start gap-2.5">
                      <CalendarClock className="mt-0.5 h-4 w-4 text-navy-400" />
                      <div>
                        <p className="text-[13px] font-semibold text-navy-800">{tr(topic.name, lang)}</p>
                        <p className="text-[11.5px] text-navy-500">{REVISION_COPY[item.reason].title}</p>
                      </div>
                    </div>
                    <Pill tone="neutral">{fmt(item.dueAt)}</Pill>
                  </div>
                )
              })}
            </div>
          </Card>

          {done.length > 0 && (
            <Card className="card-pad">
              <SectionHeading eyebrow="History" title="Completed reviews" />
              <div className="mt-3 space-y-2">
                {done.slice(0, 6).map((item) => {
                  const topic = TOPICS.find((tp) => tp.id === item.topicId)!
                  return (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-navy-50 px-3 py-2">
                      <span className="flex items-center gap-2 text-[12.5px] text-navy-600">
                        <Check className="h-3.5 w-3.5 text-brand-tealDeep" /> {tr(topic.name, lang)}
                      </span>
                      <span className="text-[11px] text-navy-400">{fmt(item.dueAt)}</span>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="card-pad">
            <SectionHeading eyebrow="How scheduling works" title="Not a notification service" />
            <div className="mt-3 space-y-2 text-[12.5px] leading-relaxed text-navy-600">
              <p>
                Reminders live in this browser. The prototype does <strong>not</strong> send push notifications or
                emails — there is no server or messaging provider connected.
              </p>
              <p>
                In production, the same rules would drive scheduled notifications through a school-approved channel.
              </p>
            </div>
            <div className="mt-3">
              <Disclosure title="The scheduling rule" tone="teal">
                <ul className="space-y-1.5">
                  <li>• A topic below 60% in a diagnostic gets a review the same day.</li>
                  <li>• The strongest topic in an assessment gets a spaced review after three days.</li>
                  <li>• Completing a review schedules the next one three days later.</li>
                </ul>
              </Disclosure>
            </div>
          </Card>

          <Callout tone="navy" icon={<Info className="h-4 w-4" />}>
            Revision answers count as real evidence: they update topic mastery just like practice does.
          </Callout>

          <Card className="card-pad">
            <SectionHeading eyebrow="Note" title="Why so short?" />
            <p className="mt-2 text-[12.5px] leading-relaxed text-navy-600">
              Three questions are enough to check whether an idea survived the week. Long revision sets get
              skipped — short ones get done.
            </p>
            <LinkButton to="/student/practice" variant="secondary" size="sm" className="mt-3">
              Go to practice instead
            </LinkButton>
          </Card>
        </div>
      </div>

      {active && (
        <ReviewQuiz
          item={active}
          onClose={() => setActive(null)}
          onComplete={() => {
            completeRevision(active.id)
            addRevision(active.topicId, 'spaced', 3)
            setActive(null)
          }}
        />
      )}

      <Modal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title="Schedule a revision"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setScheduleOpen(false)}>Cancel</Button>
            <Button
              size="sm"
              onClick={() => {
                addRevision(scheduleTopic, 'spaced', scheduleDays)
                setScheduleOpen(false)
              }}
            >
              Add reminder
            </Button>
          </>
        }
      >
        <p className="text-[13px] text-navy-600">Pick a topic and when you want to come back to it.</p>
        <div className="mt-4 space-y-4">
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">Topic</p>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((tp) => (
                <button
                  key={tp.id}
                  onClick={() => setScheduleTopic(tp.id)}
                  className={`rounded-lg border px-2.5 py-1.5 text-[12px] font-semibold ${
                    scheduleTopic === tp.id ? 'border-brand-teal bg-brand-tealSoft text-brand-tealDeep' : 'border-navy-200 text-navy-600'
                  }`}
                >
                  {tr(tp.name, lang)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">When</p>
            <div className="flex gap-2">
              {[1, 3, 7].map((d) => (
                <button
                  key={d}
                  onClick={() => setScheduleDays(d)}
                  className={`rounded-lg border px-3 py-1.5 text-[12px] font-semibold ${
                    scheduleDays === d ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-200 text-navy-600'
                  }`}
                >
                  In {d} day{d > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

/* ------------------------------------------------------------- review quiz */
function ReviewQuiz({
  item,
  onClose,
  onComplete,
}: {
  item: RevisionItem
  onClose: () => void
  onComplete: () => void
}) {
  const { lang, recordAnswer } = useApp()
  const questions = questionsForTopic(item.topicId).slice(0, 3)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState<boolean[]>([])
  const [hint, setHint] = useState(false)
  const topic = TOPICS.find((tp) => tp.id === item.topicId)!
  const question: Question | undefined = questions[index]
  const finished = index >= questions.length

  if (!question || finished) {
    const correct = results.filter(Boolean).length
    return (
      <Modal
        open
        onClose={onClose}
        title={`${tr(topic.name, lang)} — review complete`}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
            <Button size="sm" onClick={onComplete}>Save to my progress</Button>
          </>
        }
      >
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-tealSoft text-center">
            <span className="text-xl font-bold text-brand-tealDeep">{correct}/{questions.length}</span>
          </div>
          <p className="text-[13px] leading-relaxed text-navy-600">
            {correct === questions.length
              ? 'Every answer was right — this concept has held up. The next review is scheduled three days from now.'
              : 'A couple of gaps are still there. The app will keep this topic warm with shorter, more frequent reviews.'}
          </p>
        </div>
        <div className="mt-4 space-y-1.5">
          {questions.map((q, i) => (
            <div key={q.id} className="flex items-center gap-2 text-[12px]">
              {results[i] ? <CheckCircle2 className="h-3.5 w-3.5 text-brand-tealDeep" /> : <X className="h-3.5 w-3.5 text-brand-rose" />}
              <span className="text-navy-600">Q{i + 1}. {tr(q.prompt, lang)}</span>
            </div>
          ))}
        </div>
      </Modal>
    )
  }

  const check = () => {
    if (selected === null) return
    const isCorrect = selected === question.correct
    setChecked(true)
    setResults((r) => [...r, isCorrect])
    recordAnswer({ question, chosen: selected, usedHint: hint, ms: 0 }, 'revision')
  }

  return (
    <Modal open onClose={onClose} title={`${tr(topic.name, lang)} · review ${index + 1} of ${questions.length}`} wide>
      <ProgressBar value={(index / questions.length) * 100} className="mb-4" />
      <p className="text-[15px] font-semibold text-navy-900">{tr(question.prompt, lang)}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {question.options.map((o, i) => {
          const chosen = selected === i
          const right = checked && i === question.correct
          const wrong = checked && chosen && i !== question.correct
          return (
            <button
              key={o}
              disabled={checked}
              onClick={() => setSelected(i)}
              className={`rounded-xl border px-3 py-2.5 text-left text-[13.5px] font-medium ${
                right ? 'border-brand-teal bg-brand-tealSoft text-brand-tealDeep'
                  : wrong ? 'border-brand-rose bg-brand-roseSoft text-brand-rose'
                    : chosen ? 'border-navy-900 bg-navy-50 text-navy-900'
                      : 'border-navy-200 text-navy-700 hover:border-navy-300'
              }`}
            >
              {o}
            </button>
          )
        })}
      </div>

      {hint && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-brand-amberSoft px-3 py-2 text-[12px] text-[#7a4f0d]">
          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {tr(question.hint, lang)}
        </div>
      )}

      {checked && (
        <div className="mt-3 rounded-lg bg-navy-50 px-3 py-2 text-[12.5px] text-navy-600">
          {tr(question.explanation, lang)}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        {!checked ? (
          <>
            <button onClick={() => setHint(true)} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-navy-500 hover:text-navy-800">
              <Lightbulb className="h-3.5 w-3.5" /> Hint
            </button>
            <Button size="sm" onClick={check} disabled={selected === null}>Check answer</Button>
          </>
        ) : (
          <>
            <span className="inline-flex items-center gap-1.5 text-[12px] text-navy-400">
              <Clock className="h-3.5 w-3.5" /> {t('common.correct', lang)}: {question.options[question.correct]}
            </span>
            <Button
              size="sm"
              onClick={() => {
                setIndex((i) => i + 1)
                setSelected(null)
                setChecked(false)
                setHint(false)
              }}
            >
              {index + 1 === questions.length ? 'Finish review' : 'Next'} <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>
    </Modal>
  )
}
