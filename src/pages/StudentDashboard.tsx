import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Award, BookOpen, CalendarClock, CheckCircle2, ChevronRight, CircleDot,
  ClipboardCheck, Flame, Info, ListChecks, Lock, PencilRuler, Route as RouteIcon, Sparkles, Star, Target,
  TrendingUp, Zap,
} from 'lucide-react'
import { PageHeader } from '../components/Layout'
import { DemoGuide } from '../components/DemoControls'
import {
  Button, Callout, Card, Disclosure, LinkButton, Pill, ProgressBar, RingProgress, SectionHeading, Stat, Tabs,
} from '../components/ui'
import { TOPICS } from '../data/curriculum'
import { LESSON_LIBRARY, REVISION_COPY } from '../data/seed'
import { badgeCatalog, levelLabel, pathStatus, recommend } from '../lib/adapt'
import { t, tr } from '../lib/i18n'
import { useApp } from '../lib/store'

const statusTone = {
  completed: 'teal',
  'in-progress': 'violet',
  'needs-practice': 'amber',
  available: 'navy',
  locked: 'neutral',
} as const

const statusLabelKey = {
  completed: 'common.mastered',
  'in-progress': 'common.inProgress',
  'needs-practice': 'common.needsPractice',
  available: 'common.available',
  locked: 'common.locked',
} as const

const SUBJECTS = [
  { id: 'maths', label: 'Mathematics', ready: true },
  { id: 'science', label: 'Science', ready: false },
  { id: 'english', label: 'English', ready: false },
]

export default function StudentDashboard() {
  const { student, lang, pushToast } = useApp()
  const [subject, setSubject] = useState('maths')
  const [tab, setTab] = useState<'overview' | 'activity'>('overview')
  const [guideOpen, setGuideOpen] = useState(false)

  const rec = recommend(student)
  const diagnosticDone = student.assessments.length > 0
  const latest = student.assessments[0]

  const activeTopics = TOPICS.filter((topic) => pathStatus(student, topic.id) !== 'locked')
  const overall = activeTopics.length
    ? Math.round(activeTopics.reduce((sum, topic) => sum + student.mastery[topic.id].score, 0) / activeTopics.length)
    : 0

  const needsPractice = TOPICS.filter((topic) => {
    const status = pathStatus(student, topic.id)
    return status === 'needs-practice'
  })
  const unlockedCount = TOPICS.filter((topic) => pathStatus(student, topic.id) !== 'locked').length
  const dueRevision = student.revision.filter((r) => !r.done)
  const earnedBadgeIds = new Set(student.badges.map((b) => b.id))

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${student.className}-${student.section} · ${student.subject}`}
        title={`${t('dash.hello', lang)}, ${student.name.split(' ')[0]}`}
        subtitle={t('dash.subtitle', lang)}
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => setGuideOpen(true)}>
              <ListChecks className="h-4 w-4" />
      {lang !== 'en' && (
        <Callout tone="navy" icon={<Info className="h-4 w-4" />}>
          {t('lang.partialNote', lang)}
        </Callout>
      )}
 Guided demo
            </Button>
            <LinkButton to={rec.href} size="sm">
              {tr(rec.cta, lang)} <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </>
        }
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-navy-400">Subject</span>
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                if (!s.ready) {
                  pushToast({
                    title: `${s.label} is not in this prototype`,
                    note: 'The demo covers Class 8 Mathematics only. Adding a subject is listed as a next step.',
                    kind: 'info',
                  })
                  return
                }
                setSubject(s.id)
              }}
              className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                subject === s.id
                  ? 'border-navy-900 bg-navy-900 text-white'
                  : s.ready
                    ? 'border-navy-200 bg-white text-navy-600 hover:border-navy-300'
                    : 'border-dashed border-navy-200 bg-white text-navy-400'
              }`}
            >
              {s.label}
              {!s.ready && <span className="ml-1.5 text-[10px] font-medium">later</span>}
            </button>
          ))}
        </div>
      </PageHeader>

      {/* ---------------------------------------------------------- hero card */}
      <Card className="overflow-hidden border-navy-900 bg-navy-900 text-white">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white/5 p-1.5 ring-1 ring-white/10">
              <div className="rounded-full bg-navy-900 p-1">
                <RingProgress value={overall} size={92} stroke={9} label={`${overall}%`} />
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-teal">{t('dash.overall', lang)}</p>
              <p className="mt-1 text-xl font-bold text-white">
                {overall}% across {activeTopics.length} open {activeTopics.length === 1 ? 'topic' : 'topics'}
              </p>
              <p className="mt-1 text-[12px] text-navy-300">
                {diagnosticDone ? 'Computed from every question you have answered.' : 'Take the diagnostic to start measuring this.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Zap, label: t('common.points', lang), value: student.points, hint: '+25 per session' },
              { icon: Flame, label: t('common.streak', lang), value: `${student.streakDays} days`, hint: `best ${student.bestStreak}` },
              { icon: Target, label: t('common.level', lang), value: tr(levelLabel(student.mastery.fractions.level), lang).split(' · ')[0], hint: tr(levelLabel(student.mastery.fractions.level), lang).split(' · ')[1] },
              { icon: BookOpen, label: t('dash.completed', lang), value: student.lessonsCompleted.length, hint: `${student.sessions.length} practice sessions` },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <s.icon className="h-4 w-4 text-brand-teal" />
                <p className="mt-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-navy-300">{s.label}</p>
                <p className="text-[15px] font-bold text-white">{s.value}</p>
                <p className="text-[10.5px] text-navy-400">{s.hint}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <LinkButton to={rec.href} className="!bg-brand-teal !text-white hover:!bg-brand-tealDeep">
              {tr(rec.cta, lang)} <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton to="/student/path" variant="secondary" className="!border-white/20 !bg-white/10 !text-white hover:!bg-white/15">
              <RouteIcon className="h-4 w-4" /> See the learning path
            </LinkButton>
          </div>
        </div>
      </Card>

      {/* ------------------------------------------------ recommendation + revision */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card className="card-pad">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-tealSoft text-brand-tealDeep">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="label">{t('common.recommended', lang)}</p>
                <h3 className="mt-1 text-[17px] font-semibold text-navy-900">{tr(rec.title, lang)}</h3>
              </div>
            </div>
            <Pill tone="teal" dot>{rec.kind}</Pill>
          </div>
          <p className="mt-3 text-[13.5px] leading-relaxed text-navy-600">{rec.reason}</p>

          <div className="mt-4">
            <Disclosure title={t('dash.why', lang)} tone="teal">
              <p className="mb-2">This is the exact rule the app used, in order:</p>
              <ol className="list-decimal space-y-1 pl-4">
                <li>Look for a topic with mastery below 60% that has real evidence behind it.</li>
                <li>If one exists, recommend practice at your current level for that topic.</li>
                <li>Otherwise check revision that is due, then the next unlocked topic on your path.</li>
              </ol>
              <p className="mt-2 text-[12.5px] text-navy-500">
                Nothing here is random, and no language model decides what you study next.
              </p>
            </Disclosure>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <LinkButton to={rec.href} size="sm">{tr(rec.cta, lang)} <ArrowRight className="h-3.5 w-3.5" /></LinkButton>
            <LinkButton to="/student/path" size="sm" variant="secondary">See the whole path</LinkButton>
          </div>
        </Card>

        <Card className="card-pad flex flex-col">
          <SectionHeading
            eyebrow={t('dash.revision', lang)}
            title={dueRevision.length ? `${dueRevision.length} review${dueRevision.length > 1 ? 's' : ''} due` : 'Nothing due today'}
            action={<Link to="/student/revision" className="text-[12.5px] font-semibold text-brand-tealDeep hover:underline">Open</Link>}
          />
          <div className="mt-4 space-y-2.5">
            {dueRevision.length === 0 && (
              <p className="rounded-xl bg-navy-50 p-3 text-[12.5px] leading-relaxed text-navy-500">
                {diagnosticDone
                  ? 'Your next spaced review appears here three days after practice.'
                  : 'Finish the diagnostic and a short review will be scheduled for the topic that needs it.'}
              </p>
            )}
            {dueRevision.slice(0, 3).map((item) => {
              const topic = TOPICS.find((tp) => tp.id === item.topicId)
              const due = new Date(item.dueAt)
              const overdue = due.getTime() <= Date.now()
              return (
                <div key={item.id} className="flex items-start gap-3 rounded-xl border border-navy-100 p-3">
                  <CalendarClock className={`mt-0.5 h-4 w-4 shrink-0 ${overdue ? 'text-brand-amber' : 'text-navy-400'}`} />
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-navy-800">{topic ? tr(topic.name, lang) : item.topicId}</p>
                    <p className="text-[11.5px] text-navy-500">{REVISION_COPY[item.reason].title} · {overdue ? 'due now' : `due ${due.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="mt-auto pt-3 text-[10.5px] leading-relaxed text-navy-400">
            Reminders are stored in this browser. No push notifications are sent in the prototype.
          </p>
        </Card>
      </div>

      {/* ------------------------------------------------------------ topics */}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card className="card-pad">
          <SectionHeading
            eyebrow={t('common.topic', lang)}
            title={t('dash.topicsToPractise', lang)}
            note="Mastery is the share of questions you have answered correctly — nothing else."
            action={<Tabs tabs={[{ id: 'overview', label: 'Topics' }, { id: 'activity', label: 'Recent activity' }]} value={tab} onChange={setTab} />}
          />

          {tab === 'overview' ? (
            <div className="mt-4 space-y-1">
              {TOPICS.map((topic) => {
                const status = pathStatus(student, topic.id)
                const mastery = student.mastery[topic.id]
                const locked = status === 'locked'
                return (
                  <div key={topic.id} className={`flex items-center gap-3 rounded-xl px-2 py-3 ${locked ? 'opacity-60' : ''}`}>
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                      status === 'completed' ? 'bg-brand-tealSoft text-brand-tealDeep'
                        : status === 'needs-practice' ? 'bg-brand-amberSoft text-[#8a5a10]'
                          : status === 'in-progress' ? 'bg-brand-violetSoft text-[#4b30c8]'
                            : 'bg-navy-100 text-navy-500'
                    }`}>
                      {locked ? <Lock className="h-3.5 w-3.5" /> : status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> : <CircleDot className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="truncate text-[13.5px] font-semibold text-navy-900">{tr(topic.name, lang)}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[11.5px] text-navy-400">{mastery.answered > 0 ? `${mastery.correct}/${mastery.answered} correct` : 'not attempted'}</span>
                          <Pill tone={statusTone[status]}>{t(statusLabelKey[status], lang)}</Pill>
                        </div>
                      </div>
                      <ProgressBar
                        value={mastery.score}
                        tone={status === 'completed' ? 'teal' : status === 'needs-practice' ? 'amber' : 'violet'}
                        className="mt-2"
                        label={`${tr(topic.name, lang)} mastery`}
                      />
                    </div>
                    {!locked && (
                      <Link
                        to={status === 'needs-practice' ? `/student/practice?topic=${topic.id}` : `/student/tutor?topic=${topic.id}`}
                        className="hidden shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-brand-tealDeep hover:bg-brand-tealSoft sm:inline-flex"
                      >
                        {status === 'needs-practice' ? 'Practise' : 'Learn'} <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {student.history.length === 0 && <p className="text-[13px] text-navy-500">No activity yet.</p>}
              {student.history.slice(0, 7).map((h, i) => (
                <li key={`${h.at}-${i}`} className="flex items-start gap-3 rounded-xl px-2 py-2">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-navy-100 text-navy-500">
                    {h.kind === 'badge' ? <Award className="h-3.5 w-3.5" /> : h.kind === 'points' ? <Zap className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] text-navy-700">{h.label}</p>
                    <p className="text-[11px] text-navy-400">{new Date(h.at).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="space-y-4">
          {/* recent assessment */}
          <Card className="card-pad">
            <SectionHeading
              eyebrow={t('dash.recent', lang)}
              title={latest ? `${latest.correct}/${latest.total} correct` : 'Not taken yet'}
              action={latest && <Link to="/student/results" className="text-[12.5px] font-semibold text-brand-tealDeep hover:underline">Details</Link>}
            />
            {latest ? (
              <>
                <p className="mt-1 text-[11.5px] text-navy-400">
                  {latest.title} · {new Date(latest.at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                </p>
                <div className="mt-3 space-y-2">
                  {latest.byTopic.map((row) => {
                    const topic = TOPICS.find((tp) => tp.id === row.topicId)!
                    return (
                      <div key={row.topicId}>
                        <div className="mb-1 flex items-center justify-between text-[11.5px]">
                          <span className="font-medium text-navy-700">{tr(topic.name, lang)}</span>
                          <span className="text-navy-400">{row.correct}/{row.total}</span>
                        </div>
                        <ProgressBar value={row.percent} tone={row.percent >= 80 ? 'teal' : row.percent >= 50 ? 'violet' : 'amber'} />
                      </div>
                    )
                  })}
                </div>
                <LinkButton to="/student/results" variant="secondary" size="sm" className="mt-4 w-full">
                  Open full results
                </LinkButton>
              </>
            ) : (
              <>
                <p className="mt-1 text-[13px] leading-relaxed text-navy-500">
                  Eight questions, about four minutes. It checks fractions, variables and equations so we know where to start.
                </p>
                <LinkButton to="/student/assessment" size="sm" className="mt-3 w-full">
                  <ClipboardCheck className="h-4 w-4" /> Take the diagnostic
                </LinkButton>
              </>
            )}
          </Card>

          {/* badges */}
          <Card className="card-pad">
            <SectionHeading
              eyebrow={t('dash.badges', lang)}
              title={`${student.badges.length} earned`}
              action={<Link to="/student/achievements" className="text-[12.5px] font-semibold text-brand-tealDeep hover:underline">All</Link>}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {student.badges.map((b) => (
                <span key={b.id} className="inline-flex items-center gap-1.5 rounded-full border border-teal-200/70 bg-brand-tealSoft px-2.5 py-1 text-[11.5px] font-semibold text-brand-tealDeep">
                  {b.icon === 'flame' ? <Flame className="h-3.5 w-3.5" /> : b.icon === 'star' ? <Star className="h-3.5 w-3.5" /> : <Award className="h-3.5 w-3.5" />}
                  {tr(b.name, lang)}
                </span>
              ))}
              {['first-steps', 'fraction-fixer', 'own-best', 'thinking-hard']
                .filter((id) => !earnedBadgeIds.has(id))
                .slice(0, 2)
                .map((id) => {
                  const badge = badgeCatalog().find((b) => b.id === id)
                  return (
                    <span key={id} className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-navy-200 px-2.5 py-1 text-[11.5px] font-medium text-navy-400">
                      <Lock className="h-3 w-3" /> {tr(badge?.name, lang)}
                    </span>
                  )
                })}
            </div>
            <div className="mt-3 rounded-xl bg-navy-50 p-3">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-400">
                <TrendingUp className="h-3.5 w-3.5" /> Personal best
              </p>
              <p className="mt-1 text-[13px] text-navy-700">
                {student.sessions.length > 0 ? (
                  <><span className="font-bold text-navy-900">{student.bestPracticeScore}</span> correct answers in a single practice session</>
                ) : (
                  'No practice session yet — finish one to set a record.'
                )}
              </p>
              <p className="mt-0.5 text-[11px] text-navy-400">Points are only awarded the first time you answer a question correctly.</p>
            </div>
          </Card>
        </div>
      </div>

      {/* ----------------------------------------------------------- offline */}
      <Card className="card-pad">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-100 text-navy-600">
              <PencilRuler className="h-5 w-5" />
            </span>
            <div>
              <p className="label">Saved on this device</p>
              <h3 className="mt-1 text-[15px] font-semibold text-navy-900">
                {student.lessonsCompleted.length} of {LESSON_LIBRARY.length} lessons completed · offline library ready
              </h3>
              <p className="mt-1 text-[12.5px] text-navy-500">
                Downloaded lessons and their questions stay readable without a connection. Live AI does not.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <LinkButton to="/student/lessons" size="sm" variant="secondary">Open lesson library</LinkButton>
            <LinkButton to="/student/path" size="sm">Go to path <ArrowRight className="h-3.5 w-3.5" /></LinkButton>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Unlocked topics" value={`${unlockedCount} of ${TOPICS.length}`} hint="Prerequisites gate the rest" icon={<Target className="h-4 w-4" />} tone="teal" />
        <Stat label="Topics needing practice" value={needsPractice.length} hint={needsPractice.length ? tr(needsPractice[0].name, lang) : 'None right now'} icon={<PencilRuler className="h-4 w-4" />} tone="amber" />
        <Stat label="Answers recorded" value={student.attempts.length} hint="Every mastery figure comes from these" icon={<ClipboardCheck className="h-4 w-4" />} tone="violet" />
      </div>

      <DemoGuide open={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  )
}
