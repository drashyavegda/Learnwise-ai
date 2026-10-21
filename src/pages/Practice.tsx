import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronRight, Lightbulb, Lock, RotateCcw,
  Sparkles, TrendingUp, Trophy, X,
} from 'lucide-react'
import { PageHeader } from '../components/Layout'
import {
  Button, Callout, Card, Disclosure, LinkButton, Pill, ProgressBar, SectionHeading,
} from '../components/ui'
import { PRACTICE_QUESTIONS, TOPICS, questionsForTopic } from '../data/curriculum'
import { adapt, isUnlocked, levelLabel, nextQuestion, recommend } from '../lib/adapt'
import type { AdaptDecision, AnsweredItem } from '../lib/adapt'
import { hasTranslation, t, tr } from '../lib/i18n'
import { useApp } from '../lib/store'
import type { Level, Question, TopicId } from '../lib/types'

const SESSION_LENGTH = 6

export default function Practice() {
  const [params, setParams] = useSearchParams()
  const { student, lang, recordAnswer, commitSession, pushToast } = useApp()

  const initialTopic = (params.get('topic') as TopicId | null) ?? 'fractions'
  const [topicId, setTopicId] = useState<TopicId>(
    TOPICS.some((tp) => tp.id === initialTopic) ? initialTopic : 'fractions',
  )

  const startingLevel = student.mastery[topicId].level
  const [level, setLevel] = useState<Level>(startingLevel)
  const [seen, setSeen] = useState<string[]>([])
  const [question, setQuestion] = useState<Question>(
    () => nextQuestion(topicId, startingLevel, []) as Question,
  )

  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [correctStreak, setCorrectStreak] = useState(0)
  const [wrongStreak, setWrongStreak] = useState(0)
  const [decision, setDecision] = useState<AdaptDecision | null>(null)
  const [answers, setAnswers] = useState<AnsweredItem[]>([])
  const [finished, setFinished] = useState(false)
  const startedAt = useRef<number>(Date.now())

  const topic = TOPICS.find((tp) => tp.id === topicId)!
  const unlocked = isUnlocked(student.mastery, topicId)
  const pool = useMemo(() => questionsForTopic(topicId), [topicId])
  const sessionCorrect = answers.filter((a) => a.chosen === a.question.correct).length
  const rec = recommend(student)

  const resetSession = (nextTopic: TopicId = topicId, nextLevel?: Level) => {
    const lvl = nextLevel ?? student.mastery[nextTopic].level
    setTopicId(nextTopic)
    setParams({ topic: nextTopic }, { replace: true })
    setLevel(lvl)
    setSeen([])
    setAnswers([])
    setFinished(false)
    setSelected(null)
    setChecked(false)
    setShowHint(false)
    setCorrectStreak(0)
    setWrongStreak(0)
    setDecision(null)
    const q = nextQuestion(nextTopic, lvl, []) as Question
    setQuestion(q)
    startedAt.current = Date.now()
  }

  const check = () => {
    if (selected === null || checked) return
    const isCorrect = selected === question.correct
    const item: AnsweredItem = {
      question,
      chosen: selected,
      usedHint: showHint,
      ms: Date.now() - startedAt.current,
    }
    const d = adapt({
      correct: isCorrect,
      usedHint: showHint,
      level,
      correctStreak,
      wrongStreak,
    })

    setChecked(true)
    setDecision(d)
    setLevel(d.level)

    const nextCorrect = isCorrect ? correctStreak + 1 : 0
    const nextWrong = isCorrect ? 0 : wrongStreak + 1
    setCorrectStreak(nextCorrect)
    setWrongStreak(nextWrong)

    const updated = [...answers, item]
    setAnswers(updated)
    recordAnswer(item, 'practice', d.level)

    if (updated.length >= SESSION_LENGTH) {
      const correct = updated.filter((a) => a.chosen === a.question.correct).length
      commitSession(topicId, correct, updated.length, d.level)
      pushToast({
        title: 'Practice session recorded',
        note: `${correct} of ${updated.length} correct — +25 points`,
        kind: 'success',
      })
    }
  }

  const next = () => {
    if (answers.length >= SESSION_LENGTH) {
      setFinished(true)
      return
    }
    const q = nextQuestion(topicId, level, seen)
    if (!q) {
      setFinished(true)
      return
    }
    setSeen((s) => [...s, question.id])
    setQuestion(q)
    setSelected(null)
    setChecked(false)
    setShowHint(false)
    setDecision(null)
    startedAt.current = Date.now()
  }

  /* ------------------------------------------------------------- locked */
  if (!unlocked) {
    const prerequisite = TOPICS.find((tp) => tp.id === topic!.prerequisite)
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader eyebrow="Practice" title={`${tr(topic.name, lang)} is locked`} />
        <Card className="card-pad text-center">
          <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-navy-100 text-navy-500">
            <Lock className="h-6 w-6" />
          </span>
          <h2 className="text-lg font-semibold text-navy-900">Clear the prerequisite first</h2>
          <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-relaxed text-navy-500">
            {prerequisite ? `“${prerequisite.name.en}” needs to reach ${60}% before this topic opens.` : 'This topic is not available yet.'}{' '}
            Your current score there is {student.mastery[prerequisite?.id ?? 'fractions'].score}%.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button onClick={() => resetSession(prerequisite?.id ?? 'fractions')}>Practise {prerequisite?.name.en}</Button>
            <LinkButton to="/student/path" variant="secondary">See the path</LinkButton>
          </div>
        </Card>
      </div>
    )
  }

  /* ------------------------------------------------------------ summary */
  if (finished) {
    const correct = answers.filter((a) => a.chosen === a.question.correct).length
    const percent = Math.round((correct / answers.length) * 100)
    const startLevel = answers[0]?.question.level ?? level
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <PageHeader eyebrow="Practice session complete" title="Here is what the answers show" />
        <Card className="card-pad">
          <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="flex items-center gap-4">
              <div className="grid h-20 w-20 place-items-center rounded-2xl bg-brand-tealSoft">
                <div className="text-center">
                  <p className="text-2xl font-bold text-brand-tealDeep">{correct}</p>
                  <p className="text-[10.5px] font-semibold uppercase tracking-wide text-brand-tealDeep">of {answers.length}</p>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">Accuracy</p>
                <p className="text-2xl font-bold text-navy-900">{percent}%</p>
                <p className="text-[12px] text-navy-500">{tr(topic.name, lang)} · session of {answers.length}</p>
              </div>
            </div>

            <div className="rounded-xl border border-navy-100 bg-navy-50/70 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">Adaptive movement</p>
              <div className="mt-2 flex items-center gap-2 text-[13.5px] font-semibold text-navy-900">
                <span>{tr(levelLabel(startLevel), lang)}</span>
                <ArrowRight className="h-4 w-4 text-navy-400" />
                <span className={level > startLevel ? 'text-brand-tealDeep' : level < startLevel ? 'text-brand-amber' : ''}>
                  {tr(levelLabel(level), lang)}
                </span>
              </div>
              <p className="mt-1 text-[12px] leading-snug text-navy-500">
                {level > startLevel
                  ? 'Two correct answers in a row without hints moved you up a level.'
                  : level < startLevel
                    ? 'Repeated mistakes stepped the difficulty back so the idea can settle.'
                    : 'You stayed at this level — one more clean run will move you up.'}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {answers.map((a, i) => {
              const ok = a.chosen === a.question.correct
              return (
                <div key={a.question.id} className="flex items-start gap-2.5 rounded-xl border border-navy-100 px-3 py-2.5">
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${ok ? 'bg-brand-tealSoft text-brand-tealDeep' : 'bg-brand-roseSoft text-brand-rose'}`}>
                    {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-medium text-navy-800">Q{i + 1}. {tr(a.question.prompt, lang)}</p>
                    <p className="text-[11.5px] text-navy-500">
                      You chose <span className="font-semibold">{a.question.options[a.chosen]}</span>
                      {!ok && <> · correct answer <span className="font-semibold text-brand-tealDeep">{a.question.options[a.question.correct]}</span></>}
                      {' '}· Level {a.question.level}{a.usedHint ? ' · used a hint' : ''}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => resetSession(topicId, level)}>
              <RotateCcw className="h-4 w-4" /> Practise again at {tr(levelLabel(level), lang).split(' · ')[0]}
            </Button>
            <LinkButton to="/student/path" variant="secondary">Open learning path</LinkButton>
            <LinkButton to={`/student/tutor?topic=${topicId}`} variant="ghost">
              Ask the tutor <ChevronRight className="h-3.5 w-3.5" />
            </LinkButton>
          </div>
        </Card>

        <Card className="card-pad">
          <SectionHeading eyebrow={t('common.recommended', lang)} title={tr(rec.title, lang)} note={rec.reason} />
          <div className="mt-3">
            <LinkButton to={rec.href} size="sm">{tr(rec.cta, lang)} <ArrowRight className="h-3.5 w-3.5" /></LinkButton>
          </div>
        </Card>
      </div>
    )
  }

  /* ---------------------------------------------------------- practice UI */
  const questionTranslated = hasTranslation(question.prompt, lang)

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Adaptive practice"
        title={`${tr(topic.name, lang)} · ${tr(levelLabel(level), lang)}`}
        subtitle="The next question is chosen by rules over your last answers — not at random."
        actions={
          <>
            <Pill tone="teal">Session {Math.min(answers.length + 1, SESSION_LENGTH)} of {SESSION_LENGTH}</Pill>
            <Button variant="secondary" size="sm" onClick={() => resetSession(topicId)}>
              <RotateCcw className="h-3.5 w-3.5" /> Restart
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        {TOPICS.map((tp) => {
          const locked = !isUnlocked(student.mastery, tp.id)
          return (
            <button
              key={tp.id}
              onClick={() => resetSession(tp.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                tp.id === topicId
                  ? 'border-navy-900 bg-navy-900 text-white'
                  : locked
                    ? 'border-dashed border-navy-200 bg-white text-navy-400'
                    : 'border-navy-200 bg-white text-navy-600 hover:border-navy-300'
              }`}
            >
              {locked && <Lock className="h-3 w-3" />}
              {tr(tp.name, lang)}
            </button>
          )
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-100 bg-navy-50/60 px-5 py-3">
              <div className="flex items-center gap-2">
                <Pill tone="violet">Level {level}</Pill>
                <span className="text-[11.5px] text-navy-400">{question.concept.replace(/-/g, ' ')}</span>
                {!questionTranslated && lang !== 'en' && (
                  <Pill tone="amber">this question is English-only</Pill>
                )}
              </div>
              <span className="text-[11.5px] font-medium text-navy-500">
                {answers.length}/{SESSION_LENGTH} answered · {sessionCorrect} correct
              </span>
            </div>

            <div className="p-5 sm:p-6">
              <h2 className="text-[19px] font-semibold leading-snug text-navy-900 sm:text-[21px]">
                {tr(question.prompt, lang)}
              </h2>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label={tr(question.prompt, lang)}>
                {question.options.map((option, i) => {
                  const isChosen = selected === i
                  const isRight = checked && i === question.correct
                  const isWrong = checked && isChosen && i !== question.correct
                  return (
                    <button
                      key={option}
                      role="radio"
                      aria-checked={isChosen}
                      aria-label={`${String.fromCharCode(65 + i)}. ${option}`}
                      onClick={() => !checked && setSelected(i)}
                      disabled={checked}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${
                        isRight
                          ? 'border-brand-teal bg-brand-tealSoft'
                          : isWrong
                            ? 'border-brand-rose bg-brand-roseSoft'
                            : isChosen
                              ? 'border-navy-900 bg-navy-50'
                              : 'border-navy-200 bg-white hover:border-navy-300 hover:bg-navy-50'
                      } ${checked ? 'cursor-default' : ''}`}
                    >
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[12px] font-bold ${
                        isRight ? 'bg-brand-teal text-white' : isWrong ? 'bg-brand-rose text-white' : isChosen ? 'bg-navy-900 text-white' : 'bg-navy-100 text-navy-500'
                      }`}>
                        {isRight ? <Check className="h-4 w-4" /> : isWrong ? <X className="h-4 w-4" /> : ['A', 'B', 'C', 'D'][i]}
                      </span>
                      <span className="text-[15px] font-medium text-navy-900">{option}</span>
                    </button>
                  )
                })}
              </div>

              {showHint && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200/70 bg-brand-amberSoft px-4 py-3 text-[13px] text-[#7a4f0d]">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="font-semibold">{t('common.hint', lang)}</p>
                    <p className="mt-0.5">{tr(question.hint, lang)}</p>
                  </div>
                </div>
              )}

              {checked && decision && (
                <div
                  className={`mt-4 rounded-xl border px-4 py-3 ${
                    selected === question.correct
                      ? 'border-teal-200 bg-brand-tealSoft/70'
                      : 'border-rose-200 bg-brand-roseSoft/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {selected === question.correct ? (
                      <CheckCircle2 className="h-4 w-4 text-brand-tealDeep" />
                    ) : (
                      <X className="h-4 w-4 text-brand-rose" />
                    )}
                    <p className="text-[13.5px] font-semibold text-navy-900">
                      {selected === question.correct ? t('common.correct', lang) : `${t('common.incorrect', lang)} — the answer is ${question.options[question.correct]}`}
                    </p>
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-navy-700">{tr(question.explanation, lang)}</p>
                  <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-white/70 px-3 py-2">
                    <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-violet" />
                    <p className="text-[12px] leading-snug text-navy-600">
                      <span className="font-semibold text-navy-900">Adaptation: </span>
                      {tr(decision.reason, lang)}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-navy-100 pt-4">
                <div className="flex items-center gap-3">
                  {!showHint && !checked && (
                    <button
                      onClick={() => setShowHint(true)}
                      className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-navy-500 hover:text-navy-800"
                    >
                      <Lightbulb className="h-4 w-4" /> {t('common.hint', lang)}
                    </button>
                  )}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((l) => (
                      <span
                        key={l}
                        className={`h-1.5 w-8 rounded-full ${l < level ? 'bg-brand-teal/40' : l === level ? 'bg-brand-teal' : 'bg-navy-100'}`}
                      />
                    ))}
                  </div>
                </div>

                {!checked ? (
                  <Button onClick={check} disabled={selected === null}>
                    {t('common.checkAnswer', lang)}
                  </Button>
                ) : (
                  <Button onClick={next}>
                    {answers.length >= SESSION_LENGTH ? 'See summary' : `Next question (Level ${decision?.level ?? level})`}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Disclosure title="How this adapts (the exact rules)" tone="teal">
            <ul className="space-y-1.5">
              <li>• Two correct answers in a row <strong>without hints</strong> → the next question moves up one level.</li>
              <li>• A correct answer that used a hint → stay at the same level for one more question.</li>
              <li>• Two wrong answers in a row → step back a level and re-explain before asking again.</li>
              <li>• Level 3 twice in a row correctly → the topic is marked secure.</li>
              <li>• Nothing is random and no language model decides difficulty.</li>
            </ul>
          </Disclosure>
        </div>

        {/* --------------------------------------------------------- side rail */}
        <div className="space-y-4">
          <Card className="card-pad">
            <SectionHeading
              eyebrow={t('practice.session', lang)}
              title={`${answers.length} of ${SESSION_LENGTH} answered · ${sessionCorrect} correct`}
            />
            <ProgressBar value={(answers.length / SESSION_LENGTH) * 100} className="mt-3" label="Session progress" />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-navy-50 p-3">
                <p className="text-[10.5px] font-semibold uppercase tracking-wide text-navy-400">Correct streak</p>
                <p className="mt-1 flex items-center gap-1.5 text-[15px] font-bold text-navy-900">
                  <TrendingUp className="h-4 w-4 text-brand-tealDeep" /> {correctStreak}
                </p>
              </div>
              <div className="rounded-xl bg-navy-50 p-3">
                <p className="text-[10.5px] font-semibold uppercase tracking-wide text-navy-400">Wrong in a row</p>
                <p className="mt-1 text-[15px] font-bold text-navy-900">{wrongStreak}</p>
              </div>
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-navy-500">
              Hints lower the points for that question (5 instead of 10) and keep you at the same level.
            </p>
          </Card>

          <Card className="card-pad">
            <SectionHeading eyebrow={t('practice.ladder', lang)} title={t('practice.where', lang)} />
            <div className="mt-3 space-y-2">
              {[1, 2, 3].map((l) => {
                const active = l === level
                return (
                  <div
                    key={l}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2.5 ${
                      active ? 'border-brand-teal bg-brand-tealSoft' : 'border-navy-100'
                    }`}
                  >
                    <span className={`text-[12.5px] font-semibold ${active ? 'text-brand-tealDeep' : 'text-navy-500'}`}>
                      {tr(levelLabel(l as Level), lang)}
                    </span>
                    <span className="text-[11px] text-navy-400">
                      {(() => {
                        const n = PRACTICE_QUESTIONS.filter((q) => q.topicId === topicId && q.level === l).length
                        return `${n} ${n === 1 ? 'question' : 'questions'}`
                      })()}
                    </span>
                  </div>
                )
              })}
            </div>
            <p className="mt-3 text-[11px] text-navy-400">
              Stored level for this topic: <span className="font-semibold text-navy-600">{student.mastery[topicId].level}</span>
            </p>
          </Card>

          <Card className="card-pad">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">
              <Trophy className="h-3.5 w-3.5" /> {t('practice.best', lang)}
            </p>
            <p className="mt-1 text-[13.5px] text-navy-700">
              {student.sessions.length > 0 ? (
                <><span className="text-lg font-bold text-navy-900">{student.bestPracticeScore}</span> correct in one session</>
              ) : (
                'Not set yet — finish this session to record one.'
              )}
            </p>
            <p className="mt-1 text-[11.5px] text-navy-400">Points are awarded once per new correct answer.</p>
            <button
              onClick={() => resetSession(topicId)}
              className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-tealDeep hover:underline"
            >
              <Sparkles className="h-3.5 w-3.5" /> New session on {pool.length} questions
            </button>
          </Card>

          <Callout tone="navy">
            Mastery for this topic is <strong>{student.mastery[topicId].score}%</strong> from{' '}
            {student.mastery[topicId].answered} answered questions. It updates after every answer.
          </Callout>
        </div>
      </div>
    </div>
  )
}
