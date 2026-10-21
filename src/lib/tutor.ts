import { TUTOR } from '../data/tutor'
import { tr } from './i18n'
import type { Lang, TopicId } from './types'

export interface TutorAnswer {
  text: string
  /** 'demo' = predefined content, 'live' = a real model answered via the backend. */
  mode: 'demo' | 'live'
  intent: 'explanation' | 'example' | 'why' | 'faq' | 'fallback'
  faqQuestion?: string
  source: string
}

const INTENTS: { intent: TutorAnswer['intent']; words: string[] }[] = [
  { intent: 'example', words: ['example', 'pizza', 'roti', 'show me', 'step', 'उदाहरण', 'पिज़्ज़ा', 'ઉદાહરણ', 'પિઝા', 'steps'] },
  { intent: 'why', words: ['why', 'because', 'reason', 'क्यों', 'क्यो', 'કેમ', 'કેમ કે'] },
  { intent: 'explanation', words: ['what is', 'explain', 'meaning', 'how do', 'kya', 'क्या', 'समझाओ', 'શું', 'સમજાવો'] },
]

function score(text: string, words: string[]) {
  const lower = text.toLowerCase()
  return words.reduce((acc, w) => (lower.includes(w.toLowerCase()) ? acc + 1 : acc), 0)
}

/**
 * Demo-mode tutor: deterministic, hand-written content only.
 * There is no language model behind this path, and the UI says so.
 */
export function demoAnswer(question: string, topicId: TopicId, lang: Lang): TutorAnswer {
  const block = TUTOR[topicId]
  const q = question.trim()

  // 1. FAQ match (strongest signal)
  let bestFaq: { score: number; index: number } = { score: 0, index: -1 }
  block.faq.forEach((faq, index) => {
    const s = score(q, faq.q[lang]?.split(' ').filter((w) => w.length > 4) ?? faq.q.en.split(' ').filter((w) => w.length > 4))
    if (s > bestFaq.score) bestFaq = { score: s, index }
  })
  if (bestFaq.index >= 0 && bestFaq.score >= 2) {
    const faq = block.faq[bestFaq.index]
    return {
      text: tr(faq.a, lang),
      mode: 'demo',
      intent: 'faq',
      faqQuestion: tr(faq.q, lang),
      source: 'Predefined answer · tutor content pack',
    }
  }

  // 2. Intent match
  let intent: TutorAnswer['intent'] = 'fallback'
  let best = 0
  for (const entry of INTENTS) {
    const s = score(q, entry.words)
    if (s > best) {
      best = s
      intent = entry.intent
    }
  }

  if (intent === 'example') {
    const steps = block.exampleSteps.map((s, i) => `${i + 1}. ${tr(s, lang)}`).join('\n')
    return {
      text: `${tr(block.exampleTitle, lang)}\n\n${steps}`,
      mode: 'demo',
      intent: 'example',
      source: 'Predefined worked example',
    }
  }

  if (intent === 'why' && block.why) {
    return {
      text: tr(block.why, lang),
      mode: 'demo',
      intent: 'why',
      source: 'Predefined explanation',
    }
  }

  if (intent === 'explanation') {
    return {
      text: `${tr(block.simple, lang)}\n\n${tr(block.exampleTitle, lang)}\n${block.exampleSteps
        .slice(0, 2)
        .map((s, i) => `${i + 1}. ${tr(s, lang)}`)
        .join('\n')}`,
      mode: 'demo',
      intent: 'explanation',
      source: 'Predefined explanation',
    }
  }

  const fallback: Record<Lang, string> = {
    en: `I can explain ${topicId} in small steps. In this demo I answer from a short, hand-written set of explanations — not a live model. Try asking “Explain this simply”, “Show me an example”, or “Why does it work?”`,
    hi: `मैं ${topicId} को छोटे-छोटे कदमों में समझा सकता हूँ। इस डेमो में मैं हाथ से लिखी गई सीमित समझाइशों से उत्तर देता हूँ — कोई लाइव मॉडल नहीं है। पूछकर देखो: “आसान भाषा में समझाओ”, “उदाहरण दिखाओ”, या “यह कैसे काम करता है?”`,
    gu: `હું ${topicId} ને નાના પગલાંમાં સમજાવી શકું છું. આ ડેમોમાં હું હાથે લખેલી મર્યાદિત સમજૂતીઓમાંથી જવાબ આપું છું — કોઈ લાઇવ મોડેલ નથી. પૂછીને જુઓ: “સરળ ભાષામાં સમજાવો”, “ઉદાહરણ બતાવો”, અથવા “આ કેમ કામ કરે છે?”`,
  }

  return {
    text: fallback[lang],
    mode: 'demo',
    intent: 'fallback',
    source: 'Demo fallback message',
  }
}

/**
 * Ask the tutor. If a server-side endpoint is configured (VITE_ENABLE_AI=true and
 * /api/tutor is running with a key), the answer comes from a real model; otherwise
 * everything is local and clearly labelled as demo content.
 */
export async function askTutor(params: {
  question: string
  topicId: TopicId
  lang: Lang
  context?: string
}): Promise<TutorAnswer> {
  const live = import.meta.env.VITE_ENABLE_AI === 'true'
  if (!live) return demoAnswer(params.question, params.topicId, params.lang)

  try {
    const res = await fetch('/api/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: params.question,
        topic: params.topicId,
        language: params.lang,
        classLevel: 8,
        context: params.context,
      }),
    })
    if (!res.ok) throw new Error(`Tutor endpoint returned ${res.status}`)
    const data = (await res.json()) as { answer?: string }
    if (!data.answer) throw new Error('Empty answer')
    return { text: data.answer, mode: 'live', intent: 'explanation', source: 'Live model via /api/tutor' }
  } catch {
    const fallback = demoAnswer(params.question, params.topicId, params.lang)
    return {
      ...fallback,
      source: 'Live model unavailable — showing predefined content instead',
    }
  }
}

export const SUGGESTED_QUESTIONS: Record<Lang, string[]> = {
  en: ['Explain this simply', 'Show me an example', 'Why does it work?'],
  hi: ['आसान भाषा में समझाओ', 'उदाहरण दिखाओ', 'यह कैसे काम करता है?'],
  gu: ['સરળ ભાષામાં સમજાવો', 'ઉદાહરણ બતાવો', 'આ કેમ કામ કરે છે?'],
}
