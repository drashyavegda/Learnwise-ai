import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { questionById, TOPICS } from '../data/curriculum'
import { LESSON_LIBRARY, makePeers, makeStudent } from '../data/seed'
import { badgeCatalog, POINTS, pct, statusFromScore } from './adapt'
import type { AnsweredItem } from './adapt'
import type {
  AssessmentResult,
  Attempt,
  Badge,
  Lang,
  Level,
  RevisionItem,
  StudentState,
  TopicId,
  TopicMastery,
} from './types'

const KEY = 'learnwise.demo.v1'

interface Persisted {
  version: number
  student: StudentState
  peers: ReturnType<typeof makePeers>
  lang: Lang
  lowData: boolean
  downloaded: string[]
  syncQueue: { id: string; at: string; label: string }[]
  firstDiagnosticDone: boolean
}

const freshState = (): Persisted => ({
  version: 1,
  student: makeStudent(),
  peers: makePeers(),
  lang: 'en',
  lowData: false,
  downloaded: ['fractions-visual'],
  syncQueue: [],
  firstDiagnosticDone: false,
})

export interface Toast {
  id: string
  title: string
  note?: string
  kind: 'success' | 'info' | 'warn'
}

interface Ctx {
  student: StudentState
  peers: Persisted['peers']
  lang: Lang
  lowData: boolean
  downloaded: string[]
  syncQueue: Persisted['syncQueue']
  online: boolean
  aiMode: 'demo' | 'live'
  toasts: Toast[]
  setLang: (l: Lang) => void
  setLowData: (v: boolean) => void
  pushToast: (t: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
  commitAssessment: (result: AssessmentResult, items: AnsweredItem[]) => void
  recordAnswer: (item: AnsweredItem, source: Attempt['source'], nextLevel?: Level) => void
  commitSession: (topicId: TopicId, correct: number, total: number, level: Level) => void
  setTopicLevel: (topicId: TopicId, level: Level) => void
  completeLesson: (lessonId: string) => void
  toggleDownload: (lessonId: string) => void
  completeRevision: (id: string) => void
  addRevision: (topicId: TopicId, reason: RevisionItem['reason'], daysFromNow: number) => void
  resetDemo: () => void
  ownerBadges: () => Badge[]
}

const AppCtx = createContext<Ctx | null>(null)

const uid = () => Math.random().toString(36).slice(2, 10)
const todayKey = (d = new Date()) => d.toISOString().slice(0, 10)

function loadState(): Persisted {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return freshState()
    const parsed = JSON.parse(raw) as Persisted
    if (parsed.version !== 1) return freshState()
    // Repair shape if a demo was saved by an older build.
    parsed.student.history ??= []
    parsed.student.sessions ??= []
    return parsed
  } catch {
    return freshState()
  }
}

/** Mastery is always derived from real attempts — never invented. */
function deriveMastery(prev: Record<TopicId, TopicMastery>, attempts: Attempt[]): Record<TopicId, TopicMastery> {
  const next = { ...prev }
  for (const topic of TOPICS) {
    const own = attempts.filter((a) => a.topicId === topic.id)
    const correct = own.filter((a) => a.correct).length
    const answered = own.length
    const score = pct(correct, answered)
    next[topic.id] = {
      ...prev[topic.id],
      answered,
      correct,
      score,
      status: statusFromScore(score, answered),
      lastPractised: own.length ? own[own.length - 1].at : prev[topic.id].lastPractised,
    }
  }
  return next
}

function touchDay(student: StudentState): StudentState {
  if (todayKey(new Date(student.lastActive)) === todayKey()) return student
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const continued = todayKey(new Date(student.lastActive)) === todayKey(yesterday)
  const streakDays = continued ? student.streakDays + 1 : 1
  return {
    ...student,
    streakDays,
    bestStreak: Math.max(student.bestStreak, streakDays),
    lastActive: new Date().toISOString(),
  }
}

function evaluateBadges(student: StudentState): { student: StudentState; added: Badge[] } {
  const owned = new Set(student.badges.map((b) => b.id))
  const added: Badge[] = []
  const push = (id: string) => {
    if (owned.has(id)) return
    const found = badgeCatalog().find((b) => b.id === id)
    if (!found) return
    added.push({ ...found, earnedAt: new Date().toISOString() })
  }

  if (student.assessments.length > 0) push('first-steps')
  if (student.mastery.fractions.score >= 60) push('fraction-fixer')
  if (student.streakDays >= 3) push('steady-streak')
  if (student.sessions.length >= 2) {
    const sorted = [...student.sessions].sort((a, b) => b.correct - a.correct)
    if (student.sessions[student.sessions.length - 1].correct >= sorted[1].correct && sorted[1].correct > 0) {
      push('own-best')
    }
  }
  if (student.attempts.some((a) => a.correct && isLevel3(a.questionId))) push('thinking-hard')

  if (!added.length) return { student, added }
  return {
    student: {
      ...student,
      badges: [...student.badges, ...added],
      history: [
        ...added.map((b) => ({ at: new Date().toISOString(), label: `Earned the “${b.name.en}” badge`, kind: 'badge' as const })),
        ...student.history,
      ].slice(0, 12),
    },
    added,
  }
}

// Level comes from the question bank itself, not from a hand-maintained list.
function isLevel3(questionId: string) {
  return questionById(questionId)?.level === 3
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(() => loadState())
  const [toasts, setToasts] = useState<Toast[]>([])
  const [online, setOnline] = useState<boolean>(typeof navigator === 'undefined' ? true : navigator.onLine)
  const aiMode: 'demo' | 'live' = import.meta.env.VITE_ENABLE_AI === 'true' ? 'live' : 'demo'
  const timers = useRef<Record<string, number>>({})

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage full or blocked — the demo still works in memory */
    }
  }, [state])

  useEffect(() => {
    const up = () => setOnline(true)
    const down = () => setOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
    }
  }, [])

  // When the browser comes back online, flush the locally queued progress.
  useEffect(() => {
    if (online && state.syncQueue.length > 0) {
      const count = state.syncQueue.length
      setState((p) => ({ ...p, syncQueue: [] }))
      pushToast({
        title: 'Progress synced',
        note: `${count} offline ${count === 1 ? 'update' : 'updates'} saved to your profile (simulated).`,
        kind: 'success',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online])

  const pushToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = uid()
    setToasts((t) => [...t.slice(-2), { ...toast, id }])
    timers.current[id] = window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
      delete timers.current[id]
    }, 4200)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const queueIfOffline = (label: string) => {
    if (online) return
    setState((p) => ({
      ...p,
      syncQueue: [...p.syncQueue, { id: uid(), at: new Date().toISOString(), label }],
    }))
  }

  /* ------------------------------------------------------------- actions */
  const commitAssessment = useCallback(
    (result: AssessmentResult, items: AnsweredItem[]) => {
      setState((prev) => {
        let student = prev.student
        const alreadyCorrect = new Set(student.attempts.filter((a) => a.correct).map((a) => a.questionId))
        const attempts: Attempt[] = items.map((i) => ({
          questionId: i.question.id,
          topicId: i.question.topicId,
          concept: i.question.concept,
          chosen: i.chosen,
          correct: i.chosen === i.question.correct,
          usedHint: i.usedHint,
          ms: i.ms,
          at: result.at,
          source: 'diagnostic',
        }))

        const firstTime = student.assessments.length === 0
        const earnedFromQuestions = attempts.filter((a) => a.correct && !alreadyCorrect.has(a.questionId))
        const gained =
          (firstTime ? POINTS.diagnostic : 0) + earnedFromQuestions.length * POINTS.correct

        student = touchDay({ ...student, attempts: [...student.attempts, ...attempts] })
        student = { ...student, mastery: deriveMastery(student.mastery, student.attempts) }

        // Diagnostic sets a starting level per topic from the evidence.
        for (const row of result.byTopic) {
          student = {
            ...student,
            mastery: {
              ...student.mastery,
              [row.topicId]: {
                ...student.mastery[row.topicId],
                level: (row.percent >= 80 ? 2 : 1) as Level,
              },
            },
          }
        }

        // Revision: low topics get a quick review today, everything gets a spaced one.
        const revision: RevisionItem[] = [...student.revision]
        for (const row of result.byTopic) {
          if (row.percent < 60 && !revision.some((r) => r.topicId === row.topicId && !r.done)) {
            const due = new Date()
            due.setMinutes(due.getMinutes() + 1)
            revision.push({
              id: uid(),
              topicId: row.topicId,
              dueAt: due.toISOString(),
              reason: 'low-mastery',
              done: false,
            })
          }
        }
        const spaced = new Date()
        spaced.setDate(spaced.getDate() + 3)
        const strongest = [...result.byTopic].sort((a, b) => b.percent - a.percent)[0]
        if (strongest && !revision.some((r) => r.topicId === strongest.topicId && r.reason === 'spaced')) {
          revision.push({
            id: uid(),
            topicId: strongest.topicId,
            dueAt: spaced.toISOString(),
            reason: 'spaced',
            done: false,
          })
        }

        student = {
          ...student,
          points: student.points + gained,
          assessments: [result, ...student.assessments].slice(0, 8),
          revision,
          history: [
            {
              at: result.at,
              label: `Completed ${result.title} — ${result.correct}/${result.total} correct`,
              kind: 'lesson' as const,
            },
            ...(gained > 0 ? [{ at: result.at, label: `${gained} learning points earned`, kind: 'points' as const }] : []),
            ...student.history,
          ].slice(0, 12),
        }

        const evaluated = evaluateBadges(student)
        student = evaluated.student
        return { ...prev, student, firstDiagnosticDone: true }
      })

      queueIfOffline(`Diagnostic result · ${result.correct}/${result.total}`)
      pushToast({
        title: 'Diagnostic submitted',
        note: `${result.correct} of ${result.total} correct — results are based on your answers.`,
        kind: 'success',
      })
    },
    [online, pushToast],
  )

  const recordAnswer = useCallback(
    (item: AnsweredItem, source: Attempt['source'], nextLevel?: Level) => {
      setState((prev) => {
        let student = touchDay(prev.student)
        const alreadyCorrect = student.attempts.some(
          (a) => a.questionId === item.question.id && a.correct,
        )
        const isCorrect = item.chosen === item.question.correct
        const attempt: Attempt = {
          questionId: item.question.id,
          topicId: item.question.topicId,
          concept: item.question.concept,
          chosen: item.chosen,
          correct: isCorrect,
          usedHint: item.usedHint,
          ms: item.ms,
          at: new Date().toISOString(),
          source,
        }
        const gained =
          isCorrect && !alreadyCorrect
            ? item.usedHint
              ? POINTS.correctWithHint
              : POINTS.correct
            : 0

        student = {
          ...student,
          attempts: [...student.attempts, attempt],
          points: student.points + gained,
          history:
            gained > 0
              ? [{ at: attempt.at, label: `+${gained} points · ${item.question.concept}`, kind: 'points' as const }, ...student.history].slice(0, 12)
              : student.history,
        }
        student = { ...student, mastery: deriveMastery(student.mastery, student.attempts) }
        if (nextLevel) {
          student = {
            ...student,
            mastery: {
              ...student.mastery,
              [item.question.topicId]: { ...student.mastery[item.question.topicId], level: nextLevel },
            },
          }
        }
        const evaluated = evaluateBadges(student)
        student = evaluated.student
        if (evaluated.added.length) {
          pushToast({
            title: 'Badge unlocked',
            note: evaluated.added.map((b) => b.name.en).join(', '),
            kind: 'success',
          })
        }
        return { ...prev, student }
      })
    },
    [pushToast],
  )

  const commitSession = useCallback(
    (topicId: TopicId, correct: number, total: number, level: Level) => {
      setState((prev) => {
        let student = prev.student
        if (total === 0) return prev
        const best = Math.max(student.bestPracticeScore, correct)
        student = {
          ...student,
          bestPracticeScore: best,
          points: student.points + POINTS.sessionComplete,
          sessions: [
            ...student.sessions,
            { at: new Date().toISOString(), topicId, correct, total, level },
          ].slice(-20),
          history: [
            {
              at: new Date().toISOString(),
              label: `Practice session: ${correct}/${total} correct at Level ${level}`,
              kind: 'lesson' as const,
            },
            ...student.history,
          ].slice(0, 12),
        }
        const evaluated = evaluateBadges(student)
        student = evaluated.student
        return { ...prev, student }
      })
      queueIfOffline(`Practice session · ${correct}/${total}`)
    },
    [online],
  )

  const setTopicLevel = useCallback((topicId: TopicId, level: Level) => {
    setState((p) => ({
      ...p,
      student: {
        ...p.student,
        mastery: { ...p.student.mastery, [topicId]: { ...p.student.mastery[topicId], level } },
      },
    }))
  }, [])

  const completeLesson = useCallback(
    (lessonId: string) => {
      setState((prev) => {
        if (prev.student.lessonsCompleted.includes(lessonId)) return prev
        const lesson = LESSON_LIBRARY.find((l) => l.id === lessonId)
        let student = touchDay({
          ...prev.student,
          lessonsCompleted: [...prev.student.lessonsCompleted, lessonId],
          points: prev.student.points + 15,
          history: [
            { at: new Date().toISOString(), label: `Completed lesson: ${lesson?.title ?? lessonId}`, kind: 'lesson' as const },
            ...prev.student.history,
          ].slice(0, 12),
        })
        const evaluated = evaluateBadges(student)
        student = evaluated.student
        return { ...prev, student }
      })
      pushToast({ title: 'Lesson added to your progress', note: '15 learning points', kind: 'success' })
    },
    [pushToast],
  )

  const toggleDownload = useCallback(
    (lessonId: string) => {
      setState((prev) => {
        const has = prev.downloaded.includes(lessonId)
        const lesson = LESSON_LIBRARY.find((l) => l.id === lessonId)
        pushToast({
          title: has ? 'Removed from this device' : 'Saved for offline use',
          note: has ? undefined : `${lesson?.title ?? 'Lesson'} · stored in this browser`,
          kind: has ? 'info' : 'success',
        })
        return {
          ...prev,
          downloaded: has ? prev.downloaded.filter((d) => d !== lessonId) : [...prev.downloaded, lessonId],
        }
      })
    },
    [pushToast],
  )

  const completeRevision = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        student: {
          ...prev.student,
          points: prev.student.points + 10,
          revision: prev.student.revision.map((r) => (r.id === id ? { ...r, done: true } : r)),
          history: [
            { at: new Date().toISOString(), label: 'Completed a revision activity', kind: 'lesson' as const },
            ...prev.student.history,
          ].slice(0, 12),
        },
      }))
      pushToast({ title: 'Revision done', note: '10 learning points', kind: 'success' })
    },
    [pushToast],
  )

  const addRevision = useCallback((topicId: TopicId, reason: RevisionItem['reason'], daysFromNow: number) => {
    setState((prev) => {
      const due = new Date()
      due.setDate(due.getDate() + daysFromNow)
      return {
        ...prev,
        student: {
          ...prev.student,
          revision: [
            ...prev.student.revision,
            { id: uid(), topicId, dueAt: due.toISOString(), reason, done: false },
          ],
        },
      }
    })
  }, [])

  const setLang = useCallback((lang: Lang) => {
    setState((p) => ({ ...p, lang, student: { ...p.student, language: lang } }))
  }, [])

  const setLowData = useCallback((v: boolean) => {
    setState((p) => ({ ...p, lowData: v }))
    document.documentElement.classList.toggle('low-data', v)
  }, [])

  const resetDemo = useCallback(() => {
    setState(freshState())
    pushToast({ title: 'Demo data reset', note: 'Aarav is back to his starting state.', kind: 'info' })
  }, [pushToast])

  const value = useMemo<Ctx>(
    () => ({
      student: state.student,
      peers: state.peers,
      lang: state.lang,
      lowData: state.lowData,
      downloaded: state.downloaded,
      syncQueue: state.syncQueue,
      online,
      aiMode,
      toasts,
      setLang,
      setLowData,
      pushToast,
      dismissToast,
      commitAssessment,
      recordAnswer,
      commitSession,
      setTopicLevel,
      completeLesson,
      toggleDownload,
      completeRevision,
      addRevision,
      resetDemo,
      ownerBadges: () => state.student.badges,
    }),
    [
      state, online, aiMode, toasts, setLang, setLowData, pushToast, dismissToast,
      commitAssessment, recordAnswer, commitSession, setTopicLevel, completeLesson,
      toggleDownload, completeRevision, addRevision, resetDemo,
    ],
  )

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export function useApp() {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
