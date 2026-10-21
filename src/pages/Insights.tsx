import { useMemo, useState } from 'react'
import {
  BrainCircuit, CheckCircle2, Copy, Eye, EyeOff, Lightbulb, Sparkles, Target, TriangleAlert,
} from 'lucide-react'
import { PageHeader } from '../components/Layout'
import {
  Button, Callout, Card, Disclosure, Pill, ProgressBar, SectionHeading, Stat, Tabs,
} from '../components/ui'
import { analyseClass, conceptLabel, UNLOCK_THRESHOLD } from '../lib/adapt'
import { ALL_QUESTIONS, TOPICS } from '../data/curriculum'
import { tr } from '../lib/i18n'
import { useApp } from '../lib/store'

type TabId = 'map' | 'drills' | 'compare'

export default function Insights() {
  const { student, peers, lang, pushToast } = useApp()
  const insight = useMemo(() => analyseClass(student, peers), [student, peers])
  const [tab, setTab] = useState<TabId>('map')
  const [openConcept, setOpenConcept] = useState<string | null>(null)
  const [showAnswers, setShowAnswers] = useState(false)

  const selected = openConcept ?? insight.misconceptions[0]?.conceptId ?? 'add-subtract-fractions'
  const drills = ALL_QUESTIONS.filter((q) => q.concept === selected).slice(0, 3)
  const selectedTopic = TOPICS.find((t) => t.concepts.includes(selected))
  const flaggedCount = insight.misconceptions.find((m) => m.conceptId === selected)?.count ?? 0

  const aaravFlags = student.assessments[0]?.flagged ?? []
  const peerFlagTotal = peers.reduce((n, p) => n + p.flaggedConcepts.length, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Teacher assistant"
        title="Concept insights"
        subtitle="Which ideas are breaking down, who it affects, and what you could put in front of the class next."
        actions={<Pill tone="amber">suggestions, not instructions</Pill>}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="card-pad">
          <Stat label="Flagged concepts" value={insight.misconceptions.length} icon={<TriangleAlert className="h-4 w-4" />} tone="amber" hint="Concepts at least one student missed" />
        </Card>
        <Card className="card-pad">
          <Stat label="Aarav’s flags" value={aaravFlags.length} icon={<Target className="h-4 w-4" />} hint="From his real diagnostic" />
        </Card>
        <Card className="card-pad">
          <Stat label="Class flags" value={peerFlagTotal} icon={<BrainCircuit className="h-4 w-4" />} tone="violet" hint="Sample peers only" />
        </Card>
        <Card className="card-pad">
          <Stat label="Open threshold" value={`${UNLOCK_THRESHOLD}%`} icon={<CheckCircle2 className="h-4 w-4" />} tone="teal" hint="Below this a topic stays locked" />
        </Card>
      </div>

      <Tabs
        tabs={[
          { id: 'map', label: 'Concept map' },
          { id: 'drills', label: 'Drill builder' },
          { id: 'compare', label: 'Topic detail' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'map' && (
        <div className="grid items-start gap-4 xl:grid-cols-[1.35fr_1fr]">
          <Card className="card-pad">
            <SectionHeading
              eyebrow="Every concept"
              title="Mastery by idea, not by chapter"
              note="Each row counts verified questions in the bank and how many students currently miss that idea."
            />
            <div className="mt-4 space-y-3">
              {TOPICS.map((topic) => (
                <div key={topic.id}>
                  <div className="mb-1.5 flex items-center gap-2">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-navy-400">{tr(topic.name, lang)}</p>
                    <span className="h-px flex-1 bg-navy-100" />
                  </div>
                  <div className="space-y-1.5">
                    {topic.concepts.map((c) => {
                      const found = insight.misconceptions.find((m) => m.conceptId === c)
                      const count = found?.count ?? 0
                      const share = Math.round((count / (peers.length + 1)) * 100)
                      return (
                        <button
                          key={c}
                          onClick={() => {
                            setOpenConcept(c)
                            setTab('drills')
                          }}
                          className="flex w-full items-center gap-3 rounded-lg border border-transparent px-2 py-2 text-left hover:border-navy-100 hover:bg-navy-50"
                        >
                          <span className="min-w-0 flex-1 truncate text-[12.5px] text-navy-700">{conceptLabel(c, lang)}</span>
                          <div className="hidden w-28 sm:block">
                            <ProgressBar value={share} tone={share >= 30 ? 'rose' : share >= 15 ? 'amber' : 'teal'} className="h-1.5" />
                          </div>
                          <span className={`w-12 shrink-0 text-right text-[11px] font-semibold tabular-nums ${count > 0 ? 'text-navy-700' : 'text-navy-300'}`}>
                            {count} student{count === 1 ? '' : 's'}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="card-pad">
              <SectionHeading eyebrow="Most shared gap" title={conceptLabel(insight.misconceptions[0]?.conceptId ?? selected, lang)} />
              <p className="mt-2 text-[12.5px] leading-relaxed text-navy-600">
                {flaggedCount} of {peers.length + 1} students show this gap in their answers. It is the single best place to
                spend ten minutes of class time this week.
              </p>
              <div className="mt-3 rounded-xl bg-navy-50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-400">Why it happens</p>
                <p className="mt-1 text-[12px] leading-relaxed text-navy-600">
                  Students often treat the two numbers in a fraction as separate wholes. The fix is visual before it is
                  symbolic: make the pieces the same size first, then name what they did.
                </p>
              </div>
              <Button size="sm" variant="secondary" className="mt-3" onClick={() => { setTab('drills'); setShowAnswers(false) }}>
                <Sparkles className="h-3.5 w-3.5" /> Open three drills
              </Button>
            </Card>

            <Callout tone="teal" icon={<Lightbulb className="h-4 w-4" />}>
              A concept is only marked as a class gap when at least one real flag exists in the record. Nothing is inferred
              from a single quiz score alone.
            </Callout>
          </div>
        </div>
      )}

      {tab === 'drills' && (
        <div className="grid items-start gap-4 xl:grid-cols-[1fr_1.5fr]">
          <Card className="card-pad">
            <SectionHeading eyebrow="Drill builder" title="Choose a concept" />
            <div className="mt-3 space-y-1.5">
              {insight.misconceptions.slice(0, 8).map((m) => (
                <button
                  key={m.conceptId}
                  onClick={() => { setOpenConcept(m.conceptId); setShowAnswers(false) }}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[12.5px] ${
                    selected === m.conceptId ? 'bg-navy-900 text-white' : 'text-navy-700 hover:bg-navy-50'
                  }`}
                >
                  <span className="truncate">{conceptLabel(m.conceptId, lang)}</span>
                  <span className={`shrink-0 text-[11px] ${selected === m.conceptId ? 'text-navy-300' : 'text-navy-400'}`}>{m.count}</span>
                </button>
              ))}
              {insight.misconceptions.length === 0 && <p className="text-[12.5px] text-navy-500">No flags recorded yet.</p>}
            </div>
            <div className="mt-4 rounded-lg bg-navy-50 p-3 text-[11.5px] leading-relaxed text-navy-500">
              Drills come from the same verified question bank students see. Every answer is checked, so you can print them
              with confidence.
            </div>
          </Card>

          <Card className="card-pad">
            <SectionHeading
              eyebrow={`${selectedTopic?.name.en ?? 'Topic'} · ${flaggedCount} flagged`}
              title={conceptLabel(selected, lang)}
              action={
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setShowAnswers((v) => !v)}>
                    {showAnswers ? <><EyeOff className="h-3.5 w-3.5" /> Hide answers</> : <><Eye className="h-3.5 w-3.5" /> Show answers</>}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const text = drills.map((q, i) => `${i + 1}. ${q.prompt.en}\n   ${q.options.map((o, oi) => `${String.fromCharCode(65 + oi)}) ${o}`).join('   ')}\n   Answer: ${String.fromCharCode(65 + q.correct)}`).join('\n\n')
                      navigator.clipboard?.writeText(text)
                      pushToast({ title: 'Drill copied', note: 'Three questions, ready to paste into a worksheet.', kind: 'info' })
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </Button>
                </div>
              }
            />
            <div className="mt-4 space-y-3">
              {drills.map((q, i) => (
                <div key={q.id} className="rounded-xl border border-navy-100 p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-navy-900 text-[10.5px] font-bold text-white">{i + 1}</span>
                    <Pill tone="navy">Level {q.level}</Pill>
                    <Pill tone="neutral">{q.topicId}</Pill>
                  </div>
                  <p className="mt-2 text-[13px] font-medium leading-snug text-navy-900">{tr(q.prompt, lang)}</p>
                  <div className="mt-2 grid gap-1 sm:grid-cols-2">
                    {q.options.map((o, oi) => (
                      <span
                        key={oi}
                        className={`rounded-md border px-2 py-1 text-[12px] ${
                          showAnswers && oi === q.correct
                            ? 'border-teal-300 bg-brand-tealSoft font-semibold text-brand-tealDeep'
                            : 'border-navy-100 text-navy-600'
                        }`}
                      >
                        {String.fromCharCode(65 + oi)}. {o}
                      </span>
                    ))}
                  </div>
                  {showAnswers && (
                    <p className="mt-2 text-[11.5px] leading-relaxed text-navy-500">
                      <span className="font-semibold text-navy-700">Why:</span> {tr(q.explanation, lang)}
                    </p>
                  )}
                </div>
              ))}
              {drills.length === 0 && (
                <p className="rounded-lg bg-navy-50 p-3 text-[12px] text-navy-500">
                  The bank has no extra questions for this concept yet. Use the lesson planner instead.
                </p>
              )}
            </div>
          </Card>
        </div>
      )}

      {tab === 'compare' && (
        <div className="grid items-start gap-4 xl:grid-cols-[1.4fr_1fr]">
          <Card className="card-pad">
            <SectionHeading
              eyebrow="Topic detail"
              title="Class average next to Aarav"
              note="Aarav’s numbers are live from this browser; the class line is the fictional roster."
            />
            <div className="mt-4 space-y-4">
              {TOPICS.map((t) => {
                const classAvg = insight.topicAverages.find((x) => x.topicId === t.id)?.average ?? 0
                const aarav = student.mastery[t.id].score
                return (
                  <div key={t.id}>
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-[12.5px] font-medium text-navy-800">{tr(t.name, lang)}</span>
                      <span className="text-[11px] text-navy-400">
                        class {classAvg}% · Aarav {student.mastery[t.id].answered ? `${aarav}%` : '—'}
                      </span>
                    </div>
                    <div className="relative">
                      <ProgressBar value={classAvg} tone="violet" className="h-2.5" />
                      <span className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded bg-brand-teal" style={{ left: `calc(${Math.max(0, Math.min(100, aarav))}% - 1px)` }} />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex items-center gap-4 text-[11px] text-navy-500">
              <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded bg-brand-violet" /> class average</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-0.5 rounded bg-brand-teal" /> Aarav</span>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="card-pad">
              <SectionHeading eyebrow="Discussion prompts" title="Three questions for the class" />
              <ol className="mt-3 space-y-2 text-[12.5px] leading-relaxed text-navy-700">
                <li>1. Why does 1/2 + 1/3 give a bigger answer than 1/2 but 1/2 + 1/3 written wrongly gives 2/5?</li>
                <li>2. What has to be true before two fractions can be added?</li>
                <li>3. Where else in the chapter do we use the same idea of matching pieces?</li>
              </ol>
            </Card>

            <Disclosure title="How these numbers are produced">
              <ul className="space-y-1.5">
                <li>• Mastery is correct answers ÷ answers given, per topic.</li>
                <li>• Concepts are flagged only when a student misses a question tagged with that concept.</li>
                <li>• The class average includes 23 fixed sample students plus Aarav’s live scores.</li>
                <li>• No model generates these figures. Nothing is estimated.</li>
              </ul>
            </Disclosure>
          </div>
        </div>
      )}
    </div>
  )
}
