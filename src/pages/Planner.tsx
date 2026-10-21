import { useMemo, useState } from 'react'
import {
  CalendarDays, Check, ClipboardList, Copy, Lightbulb, Plus, RefreshCw, Sparkles, Trash2,
} from 'lucide-react'
import { PageHeader } from '../components/Layout'
import { Button, Callout, Card, Pill, ProgressBar, SectionHeading, Stat } from '../components/ui'
import { analyseClass, buildLessonPlan, conceptLabel, UNLOCK_THRESHOLD } from '../lib/adapt'
import { ALL_QUESTIONS, TOPICS } from '../data/curriculum'
import { tr } from '../lib/i18n'
import { useApp } from '../lib/store'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const

interface Slot {
  conceptId: string
  minutes: number
}

export default function Planner() {
  const { student, peers, pushToast } = useApp()
  const insight = useMemo(() => analyseClass(student, peers), [student, peers])
  const weakestTopics = [...insight.topicAverages].sort((a, b) => a.average - b.average).slice(0, 3)

  /** A week starts empty; the teacher brings suggestions in one at a time. */
  const [week, setWeek] = useState<Record<string, Slot[]>>({})
  const [concept, setConcept] = useState(insight.misconceptions[0]?.conceptId ?? 'add-subtract-fractions')
  const [minutes, setMinutes] = useState(40)

  const plan = buildLessonPlan(concept, minutes)
  const totalMinutes = DAYS.reduce((sum, d) => sum + (week[d] ?? []).reduce((s, it) => s + it.minutes, 0), 0)
  const coveredConcepts = new Set(DAYS.flatMap((d) => (week[d] ?? []).map((s) => s.conceptId)))

  const add = (day: string) => {
    setWeek((w) => ({ ...w, [day]: [...(w[day] ?? []), { conceptId: concept, minutes }] }))
    pushToast({ title: `Added to ${day}`, note: 'Your plan stays in this browser. It is not assigned to students automatically.', kind: 'success' })
  }

  const remove = (day: string, index: number) => {
    setWeek((w) => ({ ...w, [day]: (w[day] ?? []).filter((_, i) => i !== index) }))
  }

  const copyWeek = () => {
    const text = DAYS.map((d) => {
      const items = week[d] ?? []
      if (!items.length) return `${d}: —`
      return `${d}:\n` + items.map((s) => `  · ${conceptLabel(s.conceptId, 'en')} (${s.minutes} min)`).join('\n')
    }).join('\n')
    navigator.clipboard?.writeText(`Class 8 B Mathematics — week plan\n\n${text}`)
    pushToast({ title: 'Week copied', note: 'Paste it into your planner. Nothing left this browser.', kind: 'info' })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Teacher assistant"
        title="Lesson planner"
        subtitle="Start from the gaps the class actually has, then place short, specific blocks into your week."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="amber">Sample class</Pill>
            <Button size="sm" variant="secondary" onClick={copyWeek}>
              <Copy className="h-3.5 w-3.5" /> Copy week
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="card-pad">
          <Stat label="Blocks planned" value={DAYS.reduce((n, d) => n + (week[d] ?? []).length, 0)} icon={<CalendarDays className="h-4 w-4" />} hint="Across this week" />
        </Card>
        <Card className="card-pad">
          <Stat label="Minutes planned" value={totalMinutes} icon={<ClipboardList className="h-4 w-4" />} tone="violet" hint="40-minute periods assumed" />
        </Card>
        <Card className="card-pad">
          <Stat label="Gaps addressed" value={`${coveredConcepts.size}/${insight.misconceptions.length || 1}`} icon={<Check className="h-4 w-4" />} tone="teal" hint="Flagged concepts covered" />
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.6fr]">
        <div className="space-y-4">
          <Card className="card-pad">
            <SectionHeading eyebrow="Build a block" title="Pick a gap, pick a length" />
            <div className="mt-3 space-y-3">
              <label className="block">
                <span className="label">Concept</span>
                <select
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-navy-200 px-3 text-[13px] text-navy-800 outline-none focus:border-brand-teal"
                >
                  {insight.misconceptions.map((m) => (
                    <option key={m.conceptId} value={m.conceptId}>
                      {conceptLabel(m.conceptId, 'en')} · {m.count} students
                    </option>
                  ))}
                  <option value="add-subtract-fractions">Adding and subtracting fractions</option>
                  <option value="equivalent-fractions">Equivalent fractions</option>
                  <option value="variable-meaning">What a variable means</option>
                  <option value="one-step-equations">One-step equations</option>
                </select>
              </label>
              <div>
                <span className="label">Length</span>
                <div className="mt-1 flex gap-2">
                  {[20, 30, 40].map((m) => (
                    <Button key={m} size="sm" variant={minutes === m ? 'primary' : 'secondary'} onClick={() => setMinutes(m)}>
                      {m} min
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="card-pad">
            <SectionHeading
              eyebrow="Where to start"
              title="Weakest topics"
              note="Ordered by class average. Every one is below the 60% open threshold."
            />
            <div className="mt-3 space-y-3">
              {weakestTopics.map((t) => {
                const topic = TOPICS.find((tp) => tp.id === t.topicId)!
                return (
                  <div key={t.topicId}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12.5px] font-medium text-navy-800">{tr(topic.name, 'en')}</span>
                      <span className={`text-[11.5px] font-semibold tabular-nums ${t.average < UNLOCK_THRESHOLD ? 'text-[#8a5a10]' : 'text-navy-500'}`}>{t.average}%</span>
                    </div>
                    <ProgressBar value={t.average} tone={t.average >= 60 ? 'violet' : 'amber'} className="mt-1" />
                    <button
                      onClick={() => setConcept(topic.concepts[0])}
                      className="mt-1.5 text-[11px] font-semibold text-brand-tealDeep hover:underline"
                    >
                      Plan for {topic.concepts[0].replace(/-/g, ' ')}
                    </button>
                  </div>
                )
              })}
            </div>
          </Card>

          <Callout tone="violet" icon={<Lightbulb className="h-4 w-4" />}>
            Suggestions only. Nothing here is assigned automatically, and no student sees this page.
          </Callout>
        </div>

        <Card className="card-pad">
          <SectionHeading
            eyebrow="This week"
            title="Monday to Friday"
            note="Add the suggested block to any day, or start from a blank day."
            action={<Pill tone="navy">{DAYS.reduce((n, d) => n + (week[d] ?? []).length, 0)} blocks</Pill>}
          />
          <div className="mt-4 space-y-2.5">
            {DAYS.map((day) => {
              const items = week[day] ?? []
              return (
                <div key={day} className="rounded-xl border border-navy-100">
                  <div className="flex items-center justify-between gap-2 border-b border-navy-50 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-navy-300" />
                      <p className="text-[12.5px] font-semibold text-navy-900">{day}</p>
                      {items.length === 0 && <span className="text-[11px] text-navy-300">free</span>}
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => add(day)} ariaLabel={`Add block to ${day}`}>
                      <Plus className="h-3.5 w-3.5" /> Add
                    </Button>
                  </div>
                  {items.length > 0 && (
                    <ul className="space-y-1.5 px-3 py-2">
                      {items.map((s, i) => (
                        <li key={`${s.conceptId}-${i}`} className="flex items-center gap-2 rounded-lg bg-navy-50 px-2.5 py-1.5">
                          <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-navy-700">{conceptLabel(s.conceptId, 'en')}</span>
                          <span className="shrink-0 text-[10.5px] text-navy-400">{s.minutes} min</span>
                          <button
                            onClick={() => remove(day, i)}
                            className="shrink-0 rounded p-1 text-navy-300 hover:bg-white hover:text-brand-rose"
                            aria-label={`Remove ${conceptLabel(s.conceptId, 'en')} from ${day}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <Card className="card-pad">
        <SectionHeading
          eyebrow="Draft for the selected concept"
          title={`${plan.label} · ${plan.minutes} minutes`}
          action={
            <Button size="sm" variant="secondary" onClick={() => pushToast({ title: 'Plan regenerated', note: 'Same rules, same output — the template is deterministic.', kind: 'info' })}>
              <RefreshCw className="h-3.5 w-3.5" /> Regenerate
            </Button>
          }
        />
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          {plan.blocks.map((b, i) => (
            <div key={b.title} className="rounded-xl border border-navy-100 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-navy-900 text-[10.5px] font-bold text-white">{i + 1}</span>
                <span className="text-[10.5px] font-semibold text-navy-400">{b.minutes} min</span>
              </div>
              <p className="mt-2 text-[12.5px] font-semibold text-navy-900">{b.title}</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-navy-500">{b.detail}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-navy-400">
          <Sparkles className="mt-0.5 h-3 w-3 shrink-0" />
          Built from a fixed four-part template: {ALL_QUESTIONS.length} verified questions in the bank are what students would practise afterwards.
        </p>
      </Card>
    </div>
  )
}
