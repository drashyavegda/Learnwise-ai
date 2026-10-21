import { useState } from 'react'
import {
  BookOpen, CheckCircle2, CloudOff, Download, HardDrive, Info, Lightbulb, Trash2, WifiOff,
} from 'lucide-react'
import { PageHeader } from '../components/Layout'
import {
  Button, Callout, Card, Disclosure, Modal, Pill, ProgressBar, SectionHeading,
} from '../components/ui'
import { TOPICS, questionsForTopic } from '../data/curriculum'
import { LESSON_LIBRARY } from '../data/seed'
import { TUTOR } from '../data/tutor'
import { t, tr } from '../lib/i18n'
import { useApp } from '../lib/store'
import type { Question } from '../lib/types'

export default function Lessons() {
  const { student, lang, downloaded, toggleDownload, completeLesson, online, syncQueue } = useApp()
  const [reading, setReading] = useState<string | null>(null)

  const lesson = LESSON_LIBRARY.find((l) => l.id === reading)
  const completed = new Set(student.lessonsCompleted)
  const downloadedMinutes = LESSON_LIBRARY.filter((l) => downloaded.includes(l.id)).reduce((s, l) => s + l.minutes, 0)

  const checkQuestion: Question | undefined = lesson ? questionsForTopic(lesson.topicId)[0] : undefined
  const [reveal, setReveal] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('lessons.eyebrow', lang)}
        title={t('lessons.title', lang)}
        subtitle={t('lessons.subtitle', lang)}
        actions={
          <Pill tone={online ? 'teal' : 'amber'} dot>
            {online ? 'Online' : `Offline${syncQueue.length ? ` · ${syncQueue.length} queued` : ''}`}
          </Pill>
        }
      />

      {!online && (
        <Callout tone="amber" icon={<CloudOff className="h-4 w-4" />}>
          You are offline. Saved lessons and their questions still open. Anything you complete is queued locally and
          marked as synced when the connection returns (simulated — there is no server).
        </Callout>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <Card className="card-pad">
          <SectionHeading
            eyebrow="Library"
            title={`${LESSON_LIBRARY.length} short lessons · ${completed.size} completed`}
            note="Each lesson is a six-to-eight minute read with one worked example."
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {LESSON_LIBRARY.map((l) => {
              const isDone = completed.has(l.id)
              const isSaved = downloaded.includes(l.id)
              const topic = TOPICS.find((tp) => tp.id === l.topicId)!
              return (
                <div key={l.id} className={`flex flex-col rounded-xl border p-4 ${isDone ? 'border-teal-200/70 bg-brand-tealSoft/40' : 'border-navy-100 bg-white'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <Pill tone="violet">{tr(topic.name, lang)}</Pill>
                    {isDone ? (
                      <Pill tone="teal"><CheckCircle2 className="mr-1 h-3 w-3" /> done</Pill>
                    ) : (
                      <span className="text-[11px] text-navy-400">{l.minutes} min</span>
                    )}
                  </div>
                  <h3 className="mt-2 text-[14px] font-semibold leading-snug text-navy-900">{l.title}</h3>
                  <p className="mt-1 flex-1 text-[12px] leading-relaxed text-navy-500">{l.summary}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant={isDone ? 'secondary' : 'primary'}
                      onClick={() => {
                        setReveal(false)
                        setReading(l.id)
                      }}
                    >
                      <BookOpen className="h-3.5 w-3.5" /> {isDone ? 'Read again' : 'Read lesson'}
                    </Button>
                    <button
                      onClick={() => toggleDownload(l.id)}
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11.5px] font-semibold ${
                        isSaved ? 'bg-navy-100 text-navy-700' : 'text-navy-500 hover:bg-navy-50'
                      }`}
                    >
                      {isSaved ? <><Trash2 className="h-3.5 w-3.5" /> Saved</> : <><Download className="h-3.5 w-3.5" /> Save</>}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="card-pad">
            <SectionHeading eyebrow="On this device" title={`${downloaded.length} of ${LESSON_LIBRARY.length} saved`} />
            <ProgressBar value={(downloaded.length / LESSON_LIBRARY.length) * 100} className="mt-3" label="Saved lessons" />
            <div className="mt-4 space-y-2">
              {downloaded.length === 0 && <p className="text-[12.5px] text-navy-500">Nothing saved yet. Use “Save” on a lesson.</p>}
              {LESSON_LIBRARY.filter((l) => downloaded.includes(l.id)).map((l) => (
                <div key={l.id} className="flex items-center justify-between gap-2 rounded-lg bg-navy-50 px-3 py-2">
                  <span className="truncate text-[12px] font-medium text-navy-700">{l.title}</span>
                  <span className="shrink-0 text-[10.5px] text-navy-400">{l.minutes} min</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-navy-50 p-3">
              <HardDrive className="h-4 w-4 shrink-0 text-navy-400" />
              <p className="text-[11.5px] leading-snug text-navy-500">
                About {downloadedMinutes} minutes of reading stored locally. Saved content holds no personal data.
              </p>
            </div>
          </Card>

          <Card className="card-pad">
            <SectionHeading eyebrow="Honest limits" title="What offline really means here" />
            <div className="mt-3 space-y-2">
              <Disclosure title="What works without a connection" defaultOpen tone="teal">
                <ul className="space-y-1.5">
                  <li>• Saved lessons and their questions, read from this browser’s storage.</li>
                  <li>• Your progress is written locally after every answer.</li>
                  <li>• In a production build the app shell is cached by a service worker, so the interface loads offline.</li>
                </ul>
              </Disclosure>
              <Disclosure title="What does not work offline">
                <ul className="space-y-1.5">
                  <li>• Live AI tutoring, which needs a server connection.</li>
                  <li>• New questions generated by a model.</li>
                  <li>• Any sync with a teacher account — there is no backend in this prototype.</li>
                </ul>
              </Disclosure>
              <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-navy-400">
                <Info className="mt-0.5 h-3 w-3 shrink-0" />
                Turn on airplane mode and reopen a saved lesson to see this for yourself.
              </p>
            </div>
          </Card>

          <Callout tone="navy" icon={<WifiOff className="h-4 w-4" />}>
            Low-data mode trims animation and chart detail. Switch it on from the top bar to see the difference.
          </Callout>
        </div>
      </div>

      {/* -------------------------------------------------------- lesson modal */}
      <Modal
        open={Boolean(lesson)}
        onClose={() => setReading(null)}
        wide
        title={lesson?.title ?? ''}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setReading(null)}>Close</Button>
            {lesson && !completed.has(lesson.id) && (
              <Button
                size="sm"
                onClick={() => {
                  completeLesson(lesson.id)
                  setReading(null)
                }}
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Mark as complete (+15)
              </Button>
            )}
          </>
        }
      >
        {lesson && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="violet">{TOPICS.find((tp) => tp.id === lesson.topicId)?.name.en}</Pill>
              <Pill tone="neutral">{lesson.minutes} min read</Pill>
              {downloaded.includes(lesson.id) && <Pill tone="teal">Saved offline</Pill>}
            </div>
            <p className="text-[13.5px] leading-relaxed text-navy-700">{lesson.summary}</p>

            <div className="rounded-xl border border-navy-100 bg-navy-50/70 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">The idea in one paragraph</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-navy-700">{tr(TUTOR[lesson.topicId].simple, lang)}</p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">Worked steps</p>
              <ol className="mt-2 space-y-2">
                {TUTOR[lesson.topicId].exampleSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy-900 text-[10.5px] font-bold text-white">{i + 1}</span>
                    <span className="text-[13px] leading-relaxed text-navy-700">{tr(step, lang)}</span>
                  </li>
                ))}
              </ol>
            </div>

            {checkQuestion && (
              <div className="rounded-xl border border-teal-200/70 bg-brand-tealSoft/40 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-tealDeep">Check yourself</p>
                <p className="mt-1 text-[13.5px] font-medium text-navy-900">{tr(checkQuestion.prompt, lang)}</p>
                {reveal ? (
                  <p className="mt-2 flex items-start gap-1.5 text-[12.5px] text-navy-700">
                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-tealDeep" />
                    {checkQuestion.options[checkQuestion.correct]} — {tr(checkQuestion.explanation, lang)}
                  </p>
                ) : (
                  <Button size="sm" variant="secondary" className="mt-2" onClick={() => setReveal(true)}>
                    Reveal answer
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
