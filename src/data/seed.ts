import { TOPICS } from './curriculum'
import type { PeerStudent, StudentState, TopicId, TopicMastery } from '../lib/types'

export const LESSON_LIBRARY: { id: string; title: string; topicId: TopicId; minutes: number; summary: string }[] = [
  {
    id: 'integers-basics',
    title: 'Integers and the number line',
    topicId: 'fractions',
    minutes: 6,
    summary: 'Where negative numbers sit, and how to add and subtract them on a number line.',
  },
  {
    id: 'fractions-visual',
    title: 'Seeing fractions as pictures',
    topicId: 'fractions',
    minutes: 7,
    summary: 'Pizza and roti models for halves, thirds and quarters, and why the pieces must match.',
  },
  {
    id: 'equivalent-fractions',
    title: 'Equivalent fractions',
    topicId: 'fractions',
    minutes: 6,
    summary: 'Multiply or divide the top and bottom by the same number — the value stays the same.',
  },
  {
    id: 'variables-intro',
    title: 'Letters that stand for numbers',
    topicId: 'variables',
    minutes: 5,
    summary: 'What x means, how 3x is written, and the difference between an expression and an equation.',
  },
  {
    id: 'balance-method',
    title: 'The balance method',
    topicId: 'equations',
    minutes: 8,
    summary: 'Solving equations by doing the same thing to both sides, like a see-saw.',
  },
  {
    id: 'word-to-equation',
    title: 'From words to equations',
    topicId: 'word',
    minutes: 6,
    summary: 'Turning a one-line story into an equation you can solve.',
  },
]

const blankMastery = (): Record<TopicId, TopicMastery> =>
  Object.fromEntries(
    TOPICS.map((t) => [
      t.id,
      {
        topicId: t.id,
        score: 0,
        answered: 0,
        correct: 0,
        level: 1,
        status: 'available',
        lastPractised: null,
      } satisfies TopicMastery,
    ]),
  ) as Record<TopicId, TopicMastery>

const daysAgo = (days: number, hour = 17) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hour, 30, 0, 0)
  return d.toISOString()
}

/** Sample student: fictional demo data for Aarav, Class 8. */
export function makeStudent(): StudentState {
  return {
    id: 'stu-aarav',
    name: 'Aarav Sharma',
    className: 'Class 8',
    section: 'B',
    subject: 'Mathematics',
    language: 'en',
    // A fresh demo: 15 points from the one lesson genuinely completed below.
    points: 15,
    streakDays: 3,
    bestStreak: 3,
    bestPracticeScore: 0,
    lessonsCompleted: ['integers-basics'],
    mastery: blankMastery(),
    attempts: [],
    assessments: [],
    revision: [],
    badges: [
      {
        id: 'steady-streak',
        name: { en: 'Steady learner', hi: 'नियमित सीखने वाला', gu: 'નિયમિત શીખનાર' },
        description: { en: 'Three-day learning streak', hi: 'तीन दिन लगातार पढ़ाई', gu: 'ત્રણ દિવસ સતત અભ્યાસ' },
        icon: 'flame',
        earnedAt: daysAgo(2),
      },
    ],
    sessions: [],
    lastActive: daysAgo(1, 19),
    history: [
      { at: daysAgo(1, 19), label: 'Completed lesson: Integers and the number line', kind: 'lesson' },
      { at: daysAgo(2, 18), label: 'Earned the “Steady learner” badge', kind: 'badge' },
    ],
  }
}

const NAMES = [
  'Aditya Verma', 'Ananya Rao', 'Bhavya Shah', 'Chirag Patel', 'Diya Nair', 'Farhan Khan',
  'Gayatri Iyer', 'Harish Kumar', 'Isha Menon', 'Jai Deshmukh', 'Kavya Reddy', 'Lakshmi Prasad',
  'Manav Joshi', 'Nandini Gupta', 'Omkar Patil', 'Priya Singh', 'Rohan Das', 'Sneha Kulkarni',
  'Tarun Bhat', 'Uma Shankar', 'Varun Mehta', 'Zara Sheikh', 'Yash Chauhan',
]

const CONCEPT_POOL: Record<TopicId, string[]> = {
  fractions: ['add-subtract-fractions', 'equivalent-fractions', 'fraction-reasoning'],
  variables: ['variable-meaning', 'substitution', 'expressions'],
  simplify: ['like-terms', 'brackets'],
  equations: ['one-step-equations', 'two-step-equations'],
  word: ['modelling', 'two-step-equations'],
}

/**
 * 23 fictional classmates with deterministic sample data (no randomness at runtime).
 * Fractions are modelled as the class's weakest topic on purpose, so the teacher
 * dashboard has a realistic pattern to discuss.
 */
export function makePeers(): PeerStudent[] {
  return NAMES.map((name, idx) => {
    const i = idx + 1
    const mastery = Object.fromEntries(
      TOPICS.map((t, tIdx) => {
        const base = 52 + ((i * 17 + tIdx * 13) % 44)
        // Fractions are deliberately the class's weakest topic, but a few students are fine at it.
        const adjusted = t.id === 'fractions' ? base + (i % 3 === 0 ? 5 : -12 - (i % 3) * 4) : base
        return [t.id, Math.max(22, Math.min(96, Math.round(adjusted / 5) * 5))]
      }),
    ) as Record<TopicId, number>

    const weakest = TOPICS.reduce((acc, t) => (mastery[t.id] < mastery[acc.id] ? t : acc))
    const pool = CONCEPT_POOL[weakest.id]
    const flagged =
      mastery[weakest.id] < 70 ? [pool[i % pool.length]] : []

    return {
      id: `peer-${i}`,
      name,
      roll: i + 1,
      mastery,
      points: 180 + ((i * 37) % 380),
      streakDays: (i * 5) % 9,
      lastActiveDaysAgo: (i * 5) % 11,
      flaggedConcepts: flagged,
    }
  })
}

export const REVISION_COPY: Record<string, { title: string; note: string }> = {
  'low-mastery': {
    title: 'Short review recommended',
    note: 'Scheduled because this topic was below 60% in your latest evidence.',
  },
  spaced: {
    title: 'Spaced review',
    note: 'Scheduled three days after you last practised, to help it stick.',
  },
  teacher: {
    title: 'Teacher suggested',
    note: 'Your teacher added this review to the class plan.',
  },
}
