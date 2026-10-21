import { CONCEPT_LABELS, TOPICS, questionsByLevel } from '../data/curriculum'
import type {
  AssessmentResult,
  Lang,
  Level,
  Localized,
  PeerStudent,
  Question,
  Recommendation,
  StudentState,
  TopicId,
  TopicMastery,
  TopicStatus,
} from './types'

/* ------------------------------------------------------------------ helpers */
export const pct = (correct: number, total: number) => (total === 0 ? 0 : Math.round((correct / total) * 100))

export function statusFromScore(score: number, answered: number): TopicStatus {
  if (answered === 0) return 'available'
  if (score >= 80) return 'completed'
  if (score >= 50) return 'in-progress'
  return 'needs-practice'
}

export function levelLabel(level: Level): Localized {
  if (level === 1) return { en: 'Level 1 · Easy', hi: 'स्तर 1 · आसान', gu: 'સ્તર 1 · સરળ' }
  if (level === 2) return { en: 'Level 2 · Medium', hi: 'स्तर 2 · मध्यम', gu: 'સ્તર 2 · મધ્યમ' }
  return { en: 'Level 3 · Challenging', hi: 'स्तर 3 · कठिन', gu: 'સ્તર 3 · કઠિન' }
}

/** Path gating: a topic opens when its prerequisite is at least 60% secure. */
export const UNLOCK_THRESHOLD = 60

export function isUnlocked(mastery: Record<TopicId, TopicMastery>, topicId: TopicId): boolean {
  const topic = TOPICS.find((t) => t.id === topicId)
  if (!topic) return false
  if (!topic.prerequisite) return true
  return mastery[topic.prerequisite].score >= UNLOCK_THRESHOLD
}

export function pathStatus(student: StudentState, topicId: TopicId): TopicStatus {
  const m = student.mastery[topicId]
  if (!isUnlocked(student.mastery, topicId)) return 'locked'
  if (m.answered === 0) return 'available'
  return statusFromScore(m.score, m.answered)
}

/* -------------------------------------------------------------- assessment */
export interface AnsweredItem {
  question: Question
  chosen: number
  usedHint: boolean
  ms: number
}

export function scoreAssessment(items: AnsweredItem[], title: string, now = new Date()): AssessmentResult {
  const totals = new Map<TopicId, { correct: number; total: number }>()
  for (const item of items) {
    const t = item.question.topicId
    const entry = totals.get(t) ?? { correct: 0, total: 0 }
    entry.total += 1
    if (item.chosen === item.question.correct) entry.correct += 1
    totals.set(t, entry)
  }

  const byTopic = [...totals.entries()].map(([topicId, v]) => {
    const percent = pct(v.correct, v.total)
    return { topicId, correct: v.correct, total: v.total, percent, status: statusFromScore(percent, v.total) }
  })

  // Concept-level evidence: which concepts were answered wrongly, and how often.
  const conceptMap = new Map<string, { wrong: number; total: number; topicId: TopicId }>()
  for (const item of items) {
    const c = item.question.concept
    const entry = conceptMap.get(c) ?? { wrong: 0, total: 0, topicId: item.question.topicId }
    entry.total += 1
    if (item.chosen !== item.question.correct) entry.wrong += 1
    conceptMap.set(c, entry)
  }
  const flagged = [...conceptMap.entries()]
    .filter(([, v]) => v.wrong > 0)
    .sort((a, b) => b[1].wrong - a[1].wrong || a[1].total - b[1].total)
    .map(([conceptId, v]) => ({
      topicId: v.topicId,
      conceptId,
      wrong: v.wrong,
      total: v.total,
      reason: `${v.wrong} of ${v.total} questions on “${CONCEPT_LABELS[conceptId]?.en ?? conceptId}” were incorrect.`,
    }))

  return {
    id: `as-${now.getTime()}`,
    at: now.toISOString(),
    title,
    total: items.length,
    correct: items.filter((i) => i.chosen === i.question.correct).length,
    byTopic,
    flagged,
  }
}

/** Merge an assessment into per-topic mastery using real answer counts. */
export function applyAssessment(
  mastery: Record<TopicId, TopicMastery>,
  result: AssessmentResult,
): Record<TopicId, TopicMastery> {
  const next = { ...mastery }
  for (const row of result.byTopic) {
    const prev = next[row.topicId]
    const answered = prev.answered + row.total
    const correct = prev.correct + row.correct
    const score = pct(correct, answered)
    next[row.topicId] = {
      ...prev,
      answered,
      correct,
      score,
      status: statusFromScore(score, answered),
      lastPractised: result.at,
      // The diagnostic places a student at the level matching their evidence.
      level: row.percent >= 80 ? 2 : 1,
    }
  }
  return next
}

/* -------------------------------------------------------------- adaptation */
export type AdaptKind = 'advance' | 'hold' | 'hold-wrong' | 'hold-correct' | 'step-back' | 'prerequisite' | 'mastered'

export interface AdaptDecision {
  kind: AdaptKind
  level: Level
  reason: Localized
  nextQuestionId?: string
}

const REASONS: Record<AdaptKind, Localized> = {
  advance: {
    en: 'Two correct answers in a row without hints, so the next question is one level harder.',
    hi: 'बिना संकेत के लगातार दो सही उत्तर, इसलिए अगला प्रश्न एक स्तर कठिन है।',
    gu: 'સંકેત વગર સતત બે સાચા જવાબ, તેથી આગળનો પ્રશ્ન એક સ્તર કઠિન છે.',
  },
  hold: {
    en: 'You got it right with a hint, so we will stay at this level for one more question.',
    hi: 'संकेत के साथ सही हुआ, इसलिए एक और प्रश्न इसी स्तर पर करेंगे।',
    gu: 'સંકેત સાથે સાચું થયું, તેથી એક વધુ પ્રશ્ન આ જ સ્તર પર કરીશું.',
  },
  'hold-wrong': {
    en: 'Not correct yet. One more question at this level — two wrong answers in a row will step the difficulty down.',
    hi: 'अभी सही नहीं हुआ। इसी स्तर पर एक और प्रश्न — लगातार दो गलत हुए तो कठिनाई घट जाएगी।',
    gu: 'હજી સાચું નથી. આ જ સ્તર પર એક વધુ પ્રશ્ન — સતત બે ખોટા થશે તો કઠિનાઈ ઘટશે.',
  },
  'hold-correct': {
    en: 'First correct answer at this level. One more correct answer without a hint will move you up.',
    hi: 'इस स्तर पर पहला सही उत्तर। बिना संकेत एक और सही उत्तर स्तर बढ़ा देगा।',
    gu: 'આ સ્તર પર પહેલો સાચો જવાબ. સંકેત વગર એક વધુ સાચો જવાબ સ્તર વધારશે.',
  },
  'step-back': {
    en: 'Two wrong answers in a row — we are stepping back a level and re-explaining the idea before asking again.',
    hi: 'लगातार दो गलत उत्तर — हम एक स्तर पीछे जाकर पहले समझाएँगे, फिर पूछेंगे।',
    gu: 'સતત બે ખોટા જવાબ — આપણે એક સ્તર પાછળ જઈને પહેલાં સમજાવીશું, પછી પૂછીશું.',
  },
  prerequisite: {
    en: 'This topic needs fractions first. The tutor will revisit the prerequisite before returning here.',
    hi: 'इस विषय के लिए पहले भिन्न चाहिए। शिक्षक पहले वह पूर्वज्ञान दोहराएगा, फिर यहाँ लौटेंगे।',
    gu: 'આ વિષય માટે પહેલાં અપૂર્ણાંક જરૂરી છે. શિક્ષક પહેલાં તે પૂર્વજ્ઞાન ફરી શીખવશે, પછી અહીં પાછા આવીશું.',
  },
  mastered: {
    en: 'You have answered this level consistently well, so the topic is now marked as mastered.',
    hi: 'तुमने इस स्तर पर लगातार अच्छा किया है, इसलिए यह विषय अब पक्का माना गया है।',
    gu: 'તમે આ સ્તર પર સતત સારું કર્યું છે, તેથી આ વિષય હવે પક્કો ગણાય છે.',
  },
}

/**
 * The adaptive rule. Deterministic, inspectable, and never random.
 * Inputs: the answer just given, the current level, and the running streaks.
 */
export function adapt(params: {
  correct: boolean
  usedHint: boolean
  level: Level
  correctStreak: number
  wrongStreak: number
}): AdaptDecision {
  const { correct, usedHint, level, correctStreak, wrongStreak } = params

  if (!correct) {
    const nextWrong = wrongStreak + 1
    if (nextWrong >= 2 && level > 1) {
      return { kind: 'step-back', level: (level - 1) as Level, reason: REASONS['step-back'] }
    }
    if (nextWrong >= 2 && level === 1) {
      return { kind: 'step-back', level: 1, reason: REASONS['step-back'] }
    }
    return { kind: 'hold-wrong', level, reason: REASONS['hold-wrong'] }
  }

  if (usedHint) {
    return { kind: 'hold', level, reason: REASONS.hold }
  }

  const nextStreak = correctStreak + 1
  if (nextStreak >= 2 && level < 3) {
    return { kind: 'advance', level: (level + 1) as Level, reason: REASONS.advance }
  }
  if (nextStreak >= 2 && level === 3) {
    return { kind: 'mastered', level: 3, reason: REASONS.mastered }
  }
  return { kind: 'hold-correct', level, reason: REASONS['hold-correct'] }
}

/** Pick the next question: same topic, current level, preferring unseen items. */
export function nextQuestion(topicId: TopicId, level: Level, seen: string[]): Question | undefined {
  const preferred = questionsByLevel(topicId, level).filter((q) => !seen.includes(q.id))
  if (preferred.length) return preferred[0]
  const fallback = questionsByLevel(topicId, level)
  if (fallback.length) return fallback[0]
  // nothing at this level: allow a neighbouring level
  const neighbours = [...questionsByLevel(topicId, level === 3 ? 2 : level + 1)]
  return neighbours[0]
}

/* --------------------------------------------------------- recommendation */
export function recommend(student: StudentState): Recommendation {
  const lastAssessment = student.assessments[0]

  if (!lastAssessment) {
    return {
      kind: 'diagnostic',
      topicId: 'fractions',
      title: { en: 'Start your diagnostic', hi: 'अपनी जाँच शुरू करो', gu: 'તમારી નિદાન કસોટી શરૂ કરો' },
      reason:
        'Eight short questions across fractions, variables and equations. It takes about four minutes and tells us where to begin.',
      href: '/student/assessment',
      cta: { en: 'Start diagnostic', hi: 'जाँच शुरू करो', gu: 'કસોટી શરૂ કરો' },
    }
  }

  const weak = (Object.values(student.mastery) as TopicMastery[])
    .filter((m) => m.answered > 0 && m.score < 60)
    .sort((a, b) => a.score - b.score)

  if (weak.length) {
    const m = weak[0]
    const topic = TOPICS.find((t) => t.id === m.topicId)!
    const topicFlag = lastAssessment.flagged.find((f) => f.topicId === m.topicId)
    const detail = topicFlag
      ? `In your last diagnostic, ${topicFlag.wrong} of ${topicFlag.total} questions on “${CONCEPT_LABELS[topicFlag.conceptId]?.en ?? topicFlag.conceptId}” were incorrect.`
      : `Your mastery on this topic is ${m.score}%, below the 60% we look for before moving on.`
    return {
      kind: 'practice',
      topicId: m.topicId,
      title: {
        en: `Practise ${topic.name.en}`,
        hi: `${topic.name.hi} का अभ्यास करो`,
        gu: `${topic.name.gu} નો અભ્યાસ કરો`,
      },
      reason: `${detail} Practising at Level ${m.level} is the shortest route to unlocking what comes next.`,
      href: `/student/practice?topic=${m.topicId}`,
      cta: { en: 'Start practice', hi: 'अभ्यास शुरू करो', gu: 'અભ્યાસ શરૂ કરો' },
    }
  }

  const dueRevision = student.revision.find((r) => !r.done && new Date(r.dueAt) <= new Date())
  if (dueRevision) {
    const topic = TOPICS.find((t) => t.id === dueRevision.topicId)!
    return {
      kind: 'revision',
      topicId: dueRevision.topicId,
      title: {
        en: `Revise ${topic.name.en}`,
        hi: `${topic.name.hi} दोहराओ`,
        gu: `${topic.name.gu} ફરી જુઓ`,
      },
      reason: 'This topic is due for a short review. Five minutes now keeps it from fading.',
      href: '/student/revision',
      cta: { en: 'Open revision', hi: 'दोहराई खोलो', gu: 'પુનરાવર્તન ખોલો' },
    }
  }

  const nextTopic = TOPICS.find((t) => isUnlocked(student.mastery, t.id) && student.mastery[t.id].score < 80)
  if (nextTopic) {
    return {
      kind: 'path',
      topicId: nextTopic.id,
      title: {
        en: `Continue to ${nextTopic.name.en}`,
        hi: `${nextTopic.name.hi} की ओर बढ़ो`,
        gu: `${nextTopic.name.gu} તરફ આગળ વધો`,
      },
      reason: 'Your prerequisite is secure, so the next topic in your path is ready.',
      href: `/student/path`,
      cta: { en: 'Open path', hi: 'रास्ता खोलो', gu: 'માર્ગ ખોલો' },
    }
  }

  return {
    kind: 'tutor',
    topicId: 'equations',
    title: { en: 'Keep your streak going', hi: 'अपनी लय बनाए रखो', gu: 'તમારી શ્રેણી ચાલુ રાખો' },
    reason: 'Everything on your path is mastered. A revision quiz keeps it fresh.',
    href: '/student/revision',
    cta: { en: 'Revise', hi: 'दोहराओ', gu: 'પુનરાવર્તન' },
  }
}

/* ------------------------------------------------------------- gamification */
export const POINTS = {
  diagnostic: 40,
  correct: 10,
  correctWithHint: 5,
  sessionComplete: 25,
} as const

export function badgeCatalog() {
  return [
    {
      id: 'first-steps',
      name: { en: 'First steps', hi: 'पहला कदम', gu: 'પહેલું પગલું' },
      description: { en: 'Completed your first diagnostic', hi: 'पहली जाँच पूरी की', gu: 'પહેલી કસોટી પૂરી કરી' },
      icon: 'target' as const,
    },
    {
      id: 'fraction-fixer',
      name: { en: 'Fraction fixer', hi: 'भिन्न सुधारक', gu: 'અપૂર્ણાંક સુધારક' },
      description: {
        en: 'Reached 60% mastery in fractions',
        hi: 'भिन्न में 60% पकड़ बनाई',
        gu: 'અપૂર્ણાંકમાં 60% પકડ મેળવી',
      },
      icon: 'sparkles' as const,
    },
    {
      id: 'steady-streak',
      name: { en: 'Steady learner', hi: 'नियमित सीखने वाला', gu: 'નિયમિત શીખનાર' },
      description: { en: 'Three-day learning streak', hi: 'तीन दिन लगातार पढ़ाई', gu: 'ત્રણ દિવસ સતત અભ્યાસ' },
      icon: 'flame' as const,
    },
    {
      id: 'own-best',
      name: { en: 'New personal best', hi: 'अपना नया सर्वश्रेष्ठ', gu: 'તમારો નવો શ્રેષ્ઠ' },
      description: { en: 'Beat your highest practice score', hi: 'अपना सबसे अच्छा अभ्यास स्कोर सुधारा', gu: 'તમારો શ્રેષ્ઠ અભ્યાસ સ્કોર સુધાર્યો' },
      icon: 'star' as const,
    },
    {
      id: 'thinking-hard',
      name: { en: 'Thinking it through', hi: 'सोच-समझकर', gu: 'વિચારીને' },
      description: { en: 'Cleared a Level 3 question', hi: 'स्तर 3 का प्रश्न हल किया', gu: 'સ્તર 3 નો પ્રશ્ન ઉકેલ્યો' },
      icon: 'brain' as const,
    },
  ]
}

/* -------------------------------------------------------- teacher analytics */
export function conceptLabel(conceptId: string, lang: Lang = 'en'): string {
  const c = CONCEPT_LABELS[conceptId]
  if (!c) return conceptId
  return (c as Record<string, string>)[lang] ?? c.en
}

export interface ClassInsight {
  topicAverages: { topicId: TopicId; average: number; flagged: number; assessed: number }[]
  misconceptions: { conceptId: string; count: number; topicId: TopicId }[]
  support: { id: string; name: string; risk: number; weakest: TopicId; score: number; reason: string; evidence: boolean }[]
  classAverage: number
}

/**
 * Class analytics are computed from the fictional roster plus the live student.
 * `peers` values are sample data; Aarav's row uses his real answers, and a topic
 * he has not answered yet is excluded rather than counted as a zero.
 */
export function analyseClass(student: StudentState, peers: PeerStudent[]): ClassInsight {
  const allAssessed = () => Object.fromEntries(TOPICS.map((t) => [t.id, true])) as Record<TopicId, boolean>

  const roster = [
    ...peers.map((p) => ({
      id: p.id,
      name: p.name,
      mastery: p.mastery,
      assessed: allAssessed(),
      flaggedConcepts: p.flaggedConcepts,
      lastActiveDaysAgo: p.lastActiveDaysAgo,
    })),
    {
      id: student.id,
      name: student.name,
      mastery: Object.fromEntries(TOPICS.map((t) => [t.id, student.mastery[t.id].score])) as Record<TopicId, number>,
      assessed: Object.fromEntries(TOPICS.map((t) => [t.id, student.mastery[t.id].answered > 0])) as Record<TopicId, boolean>,
      flaggedConcepts: student.assessments[0]?.flagged.map((f) => f.conceptId) ?? [],
      lastActiveDaysAgo: 0,
    },
  ]

  const topicAverages = TOPICS.map((topic) => {
    const scores = roster.filter((r) => r.assessed[topic.id]).map((r) => r.mastery[topic.id] ?? 0)
    const average = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    return { topicId: topic.id, average, flagged: scores.filter((s) => s < 60).length, assessed: scores.length }
  })

  const conceptCount = new Map<string, { count: number; topicId: TopicId }>()
  for (const r of roster) {
    for (const c of r.flaggedConcepts) {
      const topicId = TOPICS.find((t) => t.concepts.includes(c))?.id ?? 'fractions'
      const entry = conceptCount.get(c) ?? { count: 0, topicId }
      entry.count += 1
      conceptCount.set(c, entry)
    }
  }
  const misconceptions = [...conceptCount.entries()]
    .map(([conceptId, v]) => ({ conceptId, count: v.count, topicId: v.topicId }))
    .sort((a, b) => b.count - a.count)

  const support = roster
    .map((r) => {
      const assessedTopics = TOPICS.filter((t) => r.assessed[t.id])
      if (!assessedTopics.length) {
        return {
          id: r.id,
          name: r.name,
          risk: 45,
          weakest: TOPICS[0].id,
          score: 0,
          evidence: false,
          reason: 'No questions answered yet — ask them to start the diagnostic before drawing conclusions',
        }
      }
      const weakestTopic = assessedTopics.reduce((acc, t) =>
        (r.mastery[t.id] ?? 0) < (r.mastery[acc.id] ?? 0) ? t : acc,
      )
      const weakestScore = r.mastery[weakestTopic.id] ?? 0
      const average = assessedTopics.reduce((s, t) => s + (r.mastery[t.id] ?? 0), 0) / assessedTopics.length
      const risk = Math.round(
        Math.min(100, (100 - weakestScore) * 0.6 + (100 - average) * 0.3 + Math.min(20, r.lastActiveDaysAgo * 5)),
      )
      return {
        id: r.id,
        name: r.name,
        risk,
        weakest: weakestTopic.id,
        score: weakestScore,
        evidence: true,
        reason:
          r.lastActiveDaysAgo >= 5
            ? `Inactive for ${r.lastActiveDaysAgo} days and ${weakestScore}% on ${weakestTopic.name.en.toLowerCase()}`
            : `${weakestScore}% on ${weakestTopic.name.en.toLowerCase()} — below the 60% threshold`,
      }
    })
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 6)

  const scored = topicAverages.filter((t) => t.assessed > 0)
  const classAverage = scored.length
    ? Math.round(scored.reduce((a, b) => a + b.average, 0) / scored.length)
    : 0
  return { topicAverages, misconceptions, support, classAverage }
}

/** Rule-based lesson plan generator (teacher can edit or dismiss it). */
export function buildLessonPlan(conceptId: string, minutes: number) {
  const label = CONCEPT_LABELS[conceptId]?.en ?? conceptId
  const blocks = [
    { minutes: Math.max(4, Math.round(minutes * 0.2)), title: 'Revisit the idea', detail: `Ten-minute board recap of ${label.toLowerCase()} with one visual model.` },
    { minutes: Math.max(5, Math.round(minutes * 0.3)), title: 'Worked example', detail: 'Solve one example slowly, asking the class to predict each next step.' },
    { minutes: Math.max(6, Math.round(minutes * 0.35)), title: 'Guided practice', detail: 'Pairs solve two items; circulate and note the errors you see.' },
    { minutes: Math.max(3, Math.round(minutes * 0.15)), title: 'Quick check', detail: 'Three-question exit ticket to confirm the gap has closed.' },
  ]
  return { conceptId, label, minutes, blocks }
}
