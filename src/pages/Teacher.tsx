import { useMemo, useState } from 'react'
import {
  AlertTriangle, ArrowUpDown, BookOpenCheck, Check, CheckCircle2, ClipboardList, Copy, Info,
  Lightbulb, Search, Sparkles, Users, X,
} from 'lucide-react'
import { PageHeader } from '../components/Layout'
import {
  Button, Callout, Card, Disclosure, Pill, ProgressBar, SectionHeading, Stat, Tabs,
} from '../components/ui'
import { MasteryDonut, TopicBars } from '../components/Charts'
import { analyseClass, buildLessonPlan, conceptLabel, UNLOCK_THRESHOLD } from '../lib/adapt'
import { TOPICS } from '../data/curriculum'
import { useApp } from '../lib/store'
import type { TopicId } from '../lib/types'

type TabId = 'overview' | 'students' | 'concepts' | 'plan'

const ACTIVITIES: { title: string; detail: string; minutes: number }[] = [
  {
    title: 'Pizza-slice sort',
    detail: 'Give pairs paper circles cut into halves, thirds and sixths. Ask them to show why 1/2 + 1/3 needs sixths before they add.',
    minutes: 12,
  },
  {
    title: 'Predict the next step',
    detail: 'Solve one equation on the board but stop before each step and ask the class to vote on what comes next.',
    minutes: 10,
  },
  {
    title: 'Error hunt',
    detail: 'Show four solved problems, two of them wrong. Students find and fix the mistakes in pairs.',
    minutes: 15,
  },
  {
    title: 'Same answer, different route',
    detail: 'Two students solve one problem in different ways; the class compares which was shorter and why both work.',
    minutes: 10,
  },
]

export default function Teacher() {
  const { student, peers, lang, addRevision, pushToast } = useApp()
  const [tab, setTab] = useState<TabId>('overview')
  const [query, setQuery] = useState('')
  const [topicFilter, setTopicFilter] = useState<TopicId | 'all'>('all')
  const [sortByRisk, setSortByRisk] = useState(false)
  const [planConcept, setPlanConcept] = useState('add-subtract-fractions')
  const [planMinutes, setPlanMinutes] = useState(40)
  const [planOpen, setPlanOpen] = useState(true)
  const [assigned, setAssigned] = useState<string[]>([])

  const insight = useMemo(() => analyseClass(student, peers), [student, peers])
  const roster = useMemo(
    () => [
      ...peers.map((p) => ({
        id: p.id,
        name: p.name,
        roll: p.roll,
        mastery: p.mastery,
        points: p.points,
        streakDays: p.streakDays,
        lastActiveDaysAgo: p.lastActiveDaysAgo,
        isAarav: false,
        assessed: Object.fromEntries(TOPICS.map((t) => [t.id, true])) as Record<TopicId, boolean>,
      })),
      {
        id: student.id,
        name: student.name,
        roll: 14,
        mastery: Object.fromEntries(TOPICS.map((t) => [t.id, student.mastery[t.id].score])) as Record<TopicId, number>,
        points: student.points,
        streakDays: student.streakDays,
        lastActiveDaysAgo: 0,
        isAarav: true,
        assessed: Object.fromEntries(TOPICS.map((t) => [t.id, student.mastery[t.id].answered > 0])) as Record<TopicId, boolean>,
      },
    ],
    [peers, student],
  )

  const filtered = roster
    .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
    .filter((r) => (topicFilter === 'all' ? true : r.mastery[topicFilter] < UNLOCK_THRESHOLD))
    .sort((a, b) => (sortByRisk ? (a.mastery[topicFilter === 'all' ? 'fractions' : topicFilter] ?? 0) - (b.mastery[topicFilter === 'all' ? 'fractions' : topicFilter] ?? 0) : a.roll - b.roll))

  const belowThreshold = roster.filter((r) =>
    TOPICS.some((t) => r.assessed[t.id] && r.mastery[t.id] < UNLOCK_THRESHOLD),
  ).length
  const weakest = [...insight.topicAverages].sort((a, b) => a.average - b.average)[0]
  const activeThisWeek = roster.filter((r) => r.lastActiveDaysAgo <= 6).length
  const plan = buildLessonPlan(planConcept, planMinutes)

  const distribution = (() => {
    const buckets = [
      { name: 'Mastered (80+)', test: (v: number) => v >= 80, color: '#0FA98F' },
      { name: 'Getting there (60–79)', test: (v: number) => v >= 60 && v < 80, color: '#6C4CF1' },
      { name: 'Needs practice (<60)', test: (v: number) => v < 60, color: '#E0A64B' },
    ]
    return buckets.map((b) => ({
      name: b.name,
      color: b.color,
      value: roster.filter((r) => r.assessed.fractions && b.test(r.mastery.fractions)).length,
    }))
  })()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Teacher assistant"
        title="Class 8 B · Mathematics"
        subtitle="Every number below is computed from the class record. The students are fictional — this is a prototype, not a live class."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="navy" dot>24 students</Pill>
            <Pill tone="amber">Sample data</Pill>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="card-pad">
          <Stat label="Class average" value={`${insight.classAverage}%`} icon={<Users className="h-4 w-4" />} tone="violet" hint="Across five topics" />
        </Card>
        <Card className="card-pad">
          <Stat label="Below 60%" value={belowThreshold} icon={<AlertTriangle className="h-4 w-4" />} tone="amber" hint="At least one topic" />
        </Card>
        <Card className="card-pad">
          <Stat label="Active this week" value={activeThisWeek} icon={<CheckCircle2 className="h-4 w-4" />} tone="teal" hint={`${roster.length - activeThisWeek} not seen in 7 days`} />
        </Card>
        <Card className="card-pad">
          <Stat
            label={`${TOPICS.find((t) => t.id === weakest.topicId)?.name.en ?? 'Topic'} average`}
            value={`${weakest.average}%`}
            icon={<BookOpenCheck className="h-4 w-4" />}
            hint="Weakest topic in this class"
          />
        </Card>
      </div>

      <Tabs
        tabs={[
          { id: 'overview', label: 'Class overview' },
          { id: 'students', label: 'Students' },
          { id: 'concepts', label: 'Misconceptions' },
          { id: 'plan', label: 'Lesson plan' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'overview' && (
        <div className="grid items-start gap-4 xl:grid-cols-[1.4fr_1fr]">
          <Card className="card-pad">
            <SectionHeading
              eyebrow="Topic mastery"
              title="Where the class is strong and where it is not"
              note="Average mastery per topic, computed from each student's answers. Green ≥ 75%, violet ≥ 60%, amber below."
            />
            <div className="mt-3">
              <TopicBars data={insight.topicAverages.map((t) => ({ name: TOPICS.find((tp) => tp.id === t.topicId)!.name.en, value: t.average }))} height={228} />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {insight.topicAverages.map((t) => (
                <div key={t.topicId} className="rounded-lg border border-navy-100 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-400">{TOPICS.find((tp) => tp.id === t.topicId)?.name.en}</p>
                  <p className="mt-0.5 text-[13px] font-bold text-navy-900">{t.average}%</p>
                  <p className="text-[11px] text-navy-400">{t.flagged} of {t.assessed} below 60%</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="card-pad">
              <SectionHeading eyebrow="Fractions spread" title="How the class splits" />
              <div className="mt-2">
                <MasteryDonut segments={distribution} height={190} />
              </div>
              <div className="mt-1 space-y-1.5">
                {distribution.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-[12px] text-navy-600">
                    <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                    <span className="flex-1">{d.name}</span>
                    <span className="font-semibold text-navy-900">{d.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="card-pad">
              <SectionHeading eyebrow="Needs support" title="Top six by risk" action={<Pill tone="amber">suggestion</Pill>} />
              <ul className="mt-3 space-y-2.5">
                {insight.support.map((s) => (
                  <li key={s.id}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12.5px] font-medium text-navy-800">{s.name}</span>
                      <Pill tone={s.risk >= 60 ? 'rose' : 'amber'}>{s.risk}</Pill>
                    </div>
                    <p className="mt-0.5 text-[11px] leading-snug text-navy-400">
                      {!s.evidence && <span className="mr-1 rounded bg-navy-100 px-1 py-0.5 text-[10px] font-semibold text-navy-500">no evidence yet</span>}
                      {s.reason}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-3 rounded-lg bg-navy-50 p-2.5 text-[11px] leading-relaxed text-navy-500">
                Risk is a sorting aid, not a decision. It blends the weakest topic score, the class average and days since
                last activity. Use it to choose who to talk to first.
              </p>
            </Card>
          </div>
        </div>
      )}

      {tab === 'students' && (
        <Card className="card-pad overflow-hidden">
          <SectionHeading
            eyebrow="Every student"
            title={`${roster.length} records`}
            note="Aarav’s scores come from the answers saved in this browser. The other 23 rows are fixed sample data."
          />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-navy-300" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a name"
                className="h-9 w-52 rounded-lg border border-navy-200 pl-8 pr-3 text-[12.5px] text-navy-800 outline-none placeholder:text-navy-300 focus:border-brand-teal"
              />
            </div>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value as TopicId | 'all')}
              className="h-9 rounded-lg border border-navy-200 px-2.5 text-[12.5px] text-navy-700 outline-none focus:border-brand-teal"
            >
              <option value="all">All topics</option>
              {TOPICS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name.en} below 60%
                </option>
              ))}
            </select>
            <Button size="sm" variant={sortByRisk ? 'primary' : 'secondary'} onClick={() => setSortByRisk((v) => !v)}>
              <ArrowUpDown className="h-3.5 w-3.5" /> {sortByRisk ? 'Sorted by score' : 'Sort by score'}
            </Button>
            <span className="text-[11.5px] text-navy-400">{filtered.length} shown</span>
          </div>

          <div className="mt-4 -mx-2 overflow-x-auto px-2">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-navy-100">
                  <th className="py-2 pr-3 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-navy-400">Student</th>
                  {TOPICS.map((t) => (
                    <th key={t.id} className="px-2 py-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-navy-400">{t.name.en}</th>
                  ))}
                  <th className="px-2 py-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-navy-400">Points</th>
                  <th className="px-2 py-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-navy-400">Last seen</th>
                  <th className="px-2 py-2" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className={`border-b border-navy-50 ${r.isAarav ? 'bg-brand-tealSoft/40' : ''}`}>
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-navy-100 text-[11px] font-bold text-navy-600">
                          {r.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </span>
                        <div>
                          <p className="text-[12.5px] font-semibold text-navy-900">{r.name}</p>
                          <p className="text-[10.5px] text-navy-400">Roll {r.roll}{r.isAarav ? ' · live data' : ''}</p>
                        </div>
                      </div>
                    </td>
                    {TOPICS.map((t) => {
                      const v = r.mastery[t.id] ?? 0
                      const seen = r.assessed[t.id]
                      return (
                        <td key={t.id} className="px-2 py-2.5">
                          <div className="w-16">
                            <p className={`text-[11.5px] font-semibold tabular-nums ${!seen ? 'text-navy-300' : v < UNLOCK_THRESHOLD ? 'text-[#8a5a10]' : 'text-navy-700'}`}>
                              {seen ? `${v}%` : '—'}
                            </p>
                            <ProgressBar value={seen ? v : 0} tone={v >= 80 ? 'teal' : v >= 60 ? 'violet' : 'amber'} className="mt-1 h-1" />
                          </div>
                        </td>
                      )
                    })}
                    <td className="px-2 py-2.5 text-[12px] tabular-nums text-navy-600">{r.points}</td>
                    <td className="px-2 py-2.5 text-[11.5px] text-navy-500">
                      {r.lastActiveDaysAgo === 0 ? 'Today' : `${r.lastActiveDaysAgo}d ago`}
                    </td>
                    <td className="px-2 py-2.5 text-right">
                      {r.isAarav && (
                        <Button
                          size="sm"
                          variant={assigned.includes('fractions') ? 'secondary' : 'subtle'}
                          onClick={() => {
                            if (assigned.includes('fractions')) return
                            addRevision('fractions', 'teacher', 1)
                            setAssigned((a) => [...a, 'fractions'])
                            pushToast({ title: 'Revision suggested to Aarav', note: 'He sees it on his revision page. You can add or remove it anytime.', kind: 'success' })
                          }}
                        >
                          {assigned.includes('fractions') ? <><Check className="h-3.5 w-3.5" /> Suggested</> : 'Suggest fractions revision'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Callout tone="navy" icon={<Info className="h-4 w-4" />}>
            Sending a revision suggestion adds one item to that student’s revision list. It does not change their level or
            their marks — those stay with the student and the teacher.
          </Callout>
        </Card>
      )}

      {tab === 'concepts' && (
        <div className="grid items-start gap-4 xl:grid-cols-[1.3fr_1fr]">
          <Card className="card-pad">
            <SectionHeading
              eyebrow="Commonly misunderstood"
              title="Concepts the class keeps missing"
              note="Counted from flagged concepts in each student's diagnostic and practice answers."
            />
            <ul className="mt-4 space-y-2.5">
              {insight.misconceptions.slice(0, 7).map((m, i) => (
                <li key={m.conceptId} className="flex items-start gap-3 rounded-xl border border-navy-100 p-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-amberSoft text-[11.5px] font-bold text-[#8a5a10]">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-navy-900">{conceptLabel(m.conceptId, lang)}</p>
                    <p className="text-[11.5px] text-navy-400">
                      {TOPICS.find((t) => t.id === m.topicId)?.name.en} · {m.count} of {roster.length} students
                    </p>
                    <ProgressBar value={(m.count / roster.length) * 100} tone="amber" className="mt-1.5 h-1.5" />
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setPlanConcept(m.conceptId)
                      setPlanOpen(true)
                      setTab('plan')
                    }}
                  >
                    Plan
                  </Button>
                </li>
              ))}
              {insight.misconceptions.length === 0 && (
                <p className="text-[12.5px] text-navy-500">No flagged concepts yet. Run a diagnostic as Aarav to populate this list.</p>
              )}
            </ul>
          </Card>

          <div className="space-y-4">
            <Card className="card-pad">
              <SectionHeading eyebrow="Fractions example" title="Why 1/2 + 1/3 goes wrong" />
              <p className="mt-2 text-[12.5px] leading-relaxed text-navy-600">
                The most common error in this class is adding numerators and denominators straight across, giving 2/5.
                Students who make it are usually treating fractions as two separate whole numbers rather than parts of one
                whole. A four-step response works better than re-explaining the rule:
              </p>
              <ol className="mt-3 space-y-2">
                {[
                  'Show the two pizzas side by side so the sizes are visibly different.',
                  'Ask them to cover 1/2 and 1/3 with matching slices — they will ask for smaller slices themselves.',
                  'Only then name the common denominator.',
                  'Exit ticket: two additions with unlike denominators, marked the same day.',
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy-900 text-[10.5px] font-bold text-white">{i + 1}</span>
                    <span className="text-[12.5px] leading-relaxed text-navy-700">{s}</span>
                  </li>
                ))}
              </ol>
            </Card>

            <Card className="card-pad">
              <SectionHeading eyebrow="Suggested activities" title="Ready to run" action={<Pill tone="violet">suggestion</Pill>} />
              <ul className="mt-3 space-y-2.5">
                {ACTIVITIES.map((a) => (
                  <li key={a.title} className="rounded-lg border border-navy-100 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[12.5px] font-semibold text-navy-900">{a.title}</p>
                      <span className="text-[10.5px] text-navy-400">{a.minutes} min</span>
                    </div>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-navy-500">{a.detail}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}

      {tab === 'plan' && (
        <div className="grid items-start gap-4 xl:grid-cols-[1fr_1.15fr]">
          <Card className="card-pad">
            <SectionHeading
              eyebrow="Lesson-plan generator"
              title="Build a plan from a gap"
              note="A template filled in by rules — you choose the topic and the length."
            />
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="label">Concept to address</span>
                <select
                  value={planConcept}
                  onChange={(e) => setPlanConcept(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-navy-200 px-3 text-[13px] text-navy-800 outline-none focus:border-brand-teal"
                >
                  {insight.misconceptions.map((m) => (
                    <option key={m.conceptId} value={m.conceptId}>
                      {conceptLabel(m.conceptId, 'en')} · {m.count} students
                    </option>
                  ))}
                  <option value="add-subtract-fractions">Adding and subtracting fractions (fractions)</option>
                  <option value="equivalent-fractions">Equivalent fractions (fractions)</option>
                  <option value="one-step-equations">One-step equations (equations)</option>
                  <option value="like-terms">Collecting like terms (simplifying)</option>
                </select>
              </label>
              <div>
                <span className="label">Lesson length</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {[30, 40, 50].map((m) => (
                    <Button key={m} size="sm" variant={planMinutes === m ? 'primary' : 'secondary'} onClick={() => setPlanMinutes(m)}>
                      {m} min
                    </Button>
                  ))}
                </div>
              </div>
              <Button size="sm" onClick={() => setPlanOpen(true)} disabled={planOpen}>
                <Sparkles className="h-3.5 w-3.5" /> {planOpen ? 'Plan generated' : 'Generate plan'}
              </Button>
              <p className="text-[11px] leading-relaxed text-navy-400">
                No model is called for this. The four blocks are proportional to the time you pick, which keeps the output
                predictable and reviewable.
              </p>
            </div>
          </Card>

          <Card className="card-pad">
            {planOpen ? (
              <>
                <SectionHeading
                  eyebrow="Draft plan"
                  title={`${plan.label} · ${plan.minutes} minutes`}
                  action={<Pill tone="amber">draft, not assigned</Pill>}
                />
                <ol className="mt-4 space-y-2.5">
                  {plan.blocks.map((b, i) => (
                    <li key={b.title} className="rounded-xl border border-navy-100 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-semibold text-navy-900">
                          <span className="mr-1.5 text-navy-300">{i + 1}.</span>
                          {b.title}
                        </p>
                        <Pill tone="navy">{b.minutes} min</Pill>
                      </div>
                      <p className="mt-1 text-[12px] leading-relaxed text-navy-500">{b.detail}</p>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      const text = `${plan.label} · ${plan.minutes} min\n` + plan.blocks.map((b, i) => `${i + 1}. ${b.title} (${b.minutes} min) — ${b.detail}`).join('\n')
                      navigator.clipboard?.writeText(text)
                      pushToast({ title: 'Plan copied', note: 'Paste it into your own notes. Nothing was sent anywhere.', kind: 'info' })
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy plan
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setPlanOpen(false)}>
                    <X className="h-3.5 w-3.5" /> Dismiss draft
                  </Button>
                </div>
                <Callout tone="violet" icon={<Lightbulb className="h-4 w-4" />}>
                  This is a suggestion. Edit the blocks, drop one, or ignore it — the class record is not changed by a plan.
                </Callout>
              </>
            ) : (
              <div className="grid place-items-center py-14 text-center">
                <ClipboardList className="h-8 w-8 text-navy-200" />
                <p className="mt-2 text-[13px] font-semibold text-navy-700">No draft open</p>
                <p className="mt-1 max-w-xs text-[12px] text-navy-500">Choose a concept and a length, then generate a plan.</p>
              </div>
            )}
          </Card>
        </div>
      )}

      <Disclosure title="What this dashboard does and does not know">
        <ul className="space-y-1.5">
          <li>• Aarav’s row updates with his real answers from this browser. The other 23 students are fixed sample records.</li>
          <li>• Topic mastery is the share of correct answers; it is not a grade and is never shown to parents as one.</li>
          <li>• Risk scores, activities and lesson plans are labelled suggestions. The teacher decides what to use.</li>
          <li>• Nothing is sent to a server, and there is no student account system in this prototype.</li>
        </ul>
      </Disclosure>
    </div>
  )
}
