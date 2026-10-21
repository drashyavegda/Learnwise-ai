import { Link } from 'react-router-dom'
import {
  ArrowRight, CheckCircle2, CircleDot, Lock, PlayCircle, Route as RouteIcon, Unlock,
} from 'lucide-react'
import { PageHeader } from '../components/Layout'
import { Button, Callout, Card, LinkButton, Pill, ProgressBar, SectionHeading } from '../components/ui'
import { TOPICS } from '../data/curriculum'
import { UNLOCK_THRESHOLD, isUnlocked, pathStatus } from '../lib/adapt'
import { t, tr } from '../lib/i18n'
import { useApp } from '../lib/store'

const tone = {
  completed: 'teal',
  'in-progress': 'violet',
  'needs-practice': 'amber',
  available: 'navy',
  locked: 'neutral',
} as const

export default function LearningPath() {
  const { student, lang } = useApp()
  const unlocked = TOPICS.filter((tp) => isUnlocked(student.mastery, tp.id)).length

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${t('nav.path', lang)} · ${student.className}`}
        title={t('path.title', lang)}
        subtitle={t('path.subtitle', lang)}
        actions={<Pill tone="teal">{unlocked} of {TOPICS.length} unlocked</Pill>}
      />

      <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        <Card className="card-pad">
          <SectionHeading eyebrow="Roadmap" title="Fractions → variables → expressions → equations → problems" />
          <div className="relative mt-5">
            <div className="absolute bottom-6 left-[19px] top-4 w-0.5 bg-navy-100" aria-hidden="true" />
            <ol className="space-y-3">
              {TOPICS.map((topic, i) => {
                const status = pathStatus(student, topic.id)
                const mastery = student.mastery[topic.id]
                const locked = status === 'locked'
                const prerequisite = TOPICS.find((tp) => tp.id === topic.prerequisite)
                const prereqScore = prerequisite ? student.mastery[prerequisite.id].score : 100

                return (
                  <li key={topic.id} className="relative flex gap-4">
                    <span
                      className={`relative z-10 mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 bg-white text-[12px] font-bold ${
                        status === 'completed'
                          ? 'border-brand-teal text-brand-tealDeep'
                          : status === 'needs-practice'
                            ? 'border-brand-amber text-[#8a5a10]'
                            : status === 'in-progress'
                              ? 'border-brand-violet text-[#4b30c8]'
                              : locked
                                ? 'border-navy-200 text-navy-300'
                                : 'border-navy-300 text-navy-600'
                      }`}
                    >
                      {locked ? <Lock className="h-4 w-4" /> : status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                    </span>

                    <div className={`min-w-0 flex-1 rounded-xl border p-4 ${locked ? 'border-navy-100 bg-navy-50/50' : 'border-navy-100 bg-white'}`}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className={`text-[10.5px] font-semibold uppercase tracking-[0.12em] ${locked ? 'text-navy-400' : 'text-navy-400'}`}>
                            Step {i + 1}
                          </p>
                          <h3 className={`mt-0.5 text-[15px] font-semibold ${locked ? 'text-navy-400' : 'text-navy-900'}`}>
                            {tr(topic.name, lang)}
                          </h3>
                          <p className="mt-0.5 text-[12.5px] leading-snug text-navy-500">{tr(topic.blurb, lang)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {mastery.answered > 0 && (
                            <span className="text-[12px] font-semibold text-navy-500">{mastery.score}%</span>
                          )}
                          <Pill tone={tone[status]}>{t(`common.${status === 'completed' ? 'mastered' : status === 'needs-practice' ? 'needsPractice' : status === 'in-progress' ? 'inProgress' : status === 'locked' ? 'locked' : 'available'}` as never, lang)}</Pill>
                        </div>
                      </div>

                      {!locked && (
                        <ProgressBar
                          value={mastery.score}
                          tone={status === 'completed' ? 'teal' : status === 'needs-practice' ? 'amber' : 'violet'}
                          className="mt-3"
                          label={`${topic.name.en} mastery`}
                        />
                      )}

                      {locked && prerequisite && (
                        <div className="mt-3 flex items-start gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-navy-100">
                          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-400" />
                          <p className="text-[11.5px] leading-snug text-navy-500">
                            Unlocks when <span className="font-semibold text-navy-700">{tr(prerequisite.name, lang)}</span> reaches {UNLOCK_THRESHOLD}%.
                            It is at {prereqScore}% now.
                          </p>
                        </div>
                      )}

                      {!locked && prerequisite && (
                        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-navy-400">
                          <Unlock className="h-3 w-3" /> Prerequisite secure: {tr(prerequisite.name, lang)} at {prereqScore}%
                        </p>
                      )}

                      {!locked && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Link
                            to={`/student/tutor?topic=${topic.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-navy-50 px-2.5 py-1.5 text-[12px] font-semibold text-navy-700 hover:bg-navy-100"
                          >
                            <PlayCircle className="h-3.5 w-3.5" /> Learn
                          </Link>
                          <Link
                            to={`/student/practice?topic=${topic.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-tealSoft px-2.5 py-1.5 text-[12px] font-semibold text-brand-tealDeep hover:bg-teal-100"
                          >
                            <CircleDot className="h-3.5 w-3.5" /> Practise
                          </Link>
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="card-pad">
            <SectionHeading eyebrow="How this is decided" title="The unlock rule" />
            <div className="mt-3 space-y-2 text-[12.5px] leading-relaxed text-navy-600">
              <p>
                A topic with no prerequisite (fractions) is always open. Every later topic requires the one before it
                to reach <strong>{UNLOCK_THRESHOLD}% mastery</strong>, measured across every question you have answered.
              </p>
              <p>
                If the prerequisite drops — for example after a difficult practice session — later topics lock again
                rather than letting a gap travel forward.
              </p>
            </div>
            <div className="mt-4 rounded-xl border border-navy-100 bg-navy-50 p-3">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-navy-400">Current blocker</p>
              <p className="mt-1 text-[13px] font-semibold text-navy-900">
                {TOPICS.filter((tp) => pathStatus(student, tp.id) === 'needs-practice').map((tp) => tp.name.en).join(', ') || 'Nothing — the path is clear'}
              </p>
              <p className="mt-0.5 text-[11.5px] text-navy-500">Clear this and the next topic opens automatically.</p>
            </div>
          </Card>

          <Card className="card-pad">
            <SectionHeading eyebrow="Legend" title="What the labels mean" />
            <ul className="mt-3 space-y-2 text-[12.5px]">
              {[
                ['teal', 'Mastered — 80% or more, secure enough to build on'],
                ['violet', 'In progress — 50–79%, one or two shaky steps'],
                ['amber', 'Needs practice — below 50%, close this first'],
                ['navy', 'Ready — not attempted yet'],
                ['neutral', 'Locked — waiting on the prerequisite'],
              ].map(([toneName, label]) => (
                <li key={label} className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      toneName === 'teal' ? 'bg-brand-teal' : toneName === 'violet' ? 'bg-brand-violet' : toneName === 'amber' ? 'bg-brand-amber' : toneName === 'navy' ? 'bg-brand-indigo' : 'bg-navy-200'
                    }`}
                  />
                  <span className="text-navy-600">{label}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Callout tone="teal" icon={<RouteIcon className="h-4 w-4" />}>
            The path is a proposal, not a verdict. A teacher can change the order, assign a different topic, or tell
            the app a prerequisite is already secure.
          </Callout>

          <Card className="card-pad">
            <SectionHeading eyebrow="Next" title="Keep the loop moving" />
            <div className="mt-3 flex flex-col gap-2">
              <LinkButton to="/student/practice" size="sm">Continue practice <ArrowRight className="h-3.5 w-3.5" /></LinkButton>
              <Button variant="secondary" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Back to the top of the path
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
