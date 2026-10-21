export type Lang = 'en' | 'hi' | 'gu'

export type TopicId = 'fractions' | 'variables' | 'simplify' | 'equations' | 'word'

export type Level = 1 | 2 | 3

export type TopicStatus =
  | 'completed'
  | 'in-progress'
  | 'needs-practice'
  | 'available'
  | 'locked'

/** A string that may be translated. `en` is always present. */
export interface Localized {
  en: string
  hi?: string
  gu?: string
}

export interface Question {
  id: string
  topicId: TopicId
  level: Level
  concept: string
  prompt: Localized
  /** Options are mostly mathematical expressions, so many need no translation. */
  options: string[]
  correct: number
  hint: Localized
  explanation: Localized
}

export interface Topic {
  id: TopicId
  order: number
  name: Localized
  blurb: Localized
  prerequisite: TopicId | null
  concepts: string[]
}

export interface TutorBlock {
  /** Short, age-appropriate "in one line" explanation. */
  simple: Localized
  exampleTitle: Localized
  exampleSteps: Localized[]
  /** Extra teaching notes shown under "Why it works". */
  why?: Localized
  faq: { q: Localized; a: Localized }[]
  keywords: string[]
}

export interface TopicMastery {
  topicId: TopicId
  /** 0–100, computed from real answers only. */
  score: number
  answered: number
  correct: number
  /** Highest difficulty level reached in practice. */
  level: Level
  status: TopicStatus
  lastPractised: string | null
}

export interface Attempt {
  questionId: string
  topicId: TopicId
  concept: string
  chosen: number
  correct: boolean
  usedHint: boolean
  /** ms spent on the question */
  ms: number
  at: string
  source: 'diagnostic' | 'practice' | 'revision'
}

export interface AssessmentResult {
  id: string
  at: string
  title: string
  total: number
  correct: number
  byTopic: {
    topicId: TopicId
    correct: number
    total: number
    percent: number
    status: TopicStatus
  }[]
  /** Concepts the rules decided need work, with the evidence. */
  flagged: { topicId: TopicId; conceptId: string; reason: string; wrong: number; total: number }[]
}

export interface Badge {
  id: string
  name: Localized
  description: Localized
  icon: 'target' | 'flame' | 'star' | 'brain' | 'trophy' | 'sparkles'
  earnedAt?: string
}

export interface RevisionItem {
  id: string
  topicId: TopicId
  dueAt: string
  reason: 'low-mastery' | 'spaced' | 'teacher'
  done: boolean
}

export interface StudentState {
  id: string
  name: string
  className: string
  section: string
  subject: string
  language: Lang
  points: number
  streakDays: number
  bestStreak: number
  bestPracticeScore: number
  lessonsCompleted: string[]
  mastery: Record<TopicId, TopicMastery>
  attempts: Attempt[]
  assessments: AssessmentResult[]
  revision: RevisionItem[]
  badges: Badge[]
  lastActive: string
  /** Practice sessions, used for the "personal best" indicator. */
  sessions: { at: string; topicId: TopicId; correct: number; total: number; level: Level }[]
  /** A short, human-readable activity log for the dashboard. */
  history: { at: string; label: string; kind: 'lesson' | 'points' | 'badge' }[]
}

export interface Recommendation {
  kind: 'diagnostic' | 'tutor' | 'practice' | 'revision' | 'path'
  topicId: TopicId
  title: Localized
  reason: string
  href: string
  cta: Localized
}

export interface PeerStudent {
  id: string
  name: string
  roll: number
  mastery: Record<TopicId, number>
  points: number
  streakDays: number
  lastActiveDaysAgo: number
  flaggedConcepts: string[]
}
