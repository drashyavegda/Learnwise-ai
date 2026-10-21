/**
 * LearnWise AI — optional server-side AI endpoint.
 *
 * Why this file exists: the browser must never hold an API key. The Vite dev
 * server proxies /api/* here, so one origin serves the app and the endpoint.
 *
 * Run:  npm run server      (listens on 127.0.0.1:8787)
 * Env:  LEARNWISE_AI_KEY   server-only key (never exposed to the client)
 *       LEARNWISE_AI_MODEL  default gpt-4o-mini-compatible chat model
 *       LEARNWISE_AI_URL    default OpenAI-compatible chat completions URL
 *       PORT                default 8787
 *
 * With no key the endpoints answer 503 { error: 'ai-not-configured' }. The app
 * treats that as "stay in demo mode" and never retries in a loop.
 */

import { createServer } from 'node:http'
import { validateQuestion } from './lib/questionValidator.mjs'

const PORT = Number(process.env.PORT ?? 8787)
const KEY = process.env.LEARNWISE_AI_KEY ?? ''
const MODEL = process.env.LEARNWISE_AI_MODEL ?? 'gpt-4o-mini'
const ENDPOINT = process.env.LEARNWISE_AI_URL ?? 'https://api.openai.com/v1/chat/completions'
const MAX_BODY = 8 * 1024

/* ------------------------------------------------------- very simple limits */
const buckets = new Map()
function allow(ip, limit = 20, windowMs = 60_000) {
  const now = Date.now()
  const entry = buckets.get(ip) ?? { count: 0, reset: now + windowMs }
  if (now > entry.reset) {
    entry.count = 0
    entry.reset = now + windowMs
  }
  entry.count += 1
  buckets.set(ip, entry)
  return entry.count <= limit
}

/* -------------------------------------------------------------------- utils */
function send(res, status, payload) {
  const body = JSON.stringify(payload)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
  })
  res.end(body)
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > MAX_BODY) {
        reject(new Error('body-too-large'))
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'))
      } catch {
        reject(new Error('invalid-json'))
      }
    })
    req.on('error', reject)
  })
}

async function callModel(messages, { temperature = 0.3, maxTokens = 500 } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 20_000)
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
      }),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      // Keys and upstream bodies are logged server-side only, and truncated.
      console.error('[learnwise] upstream error', res.status, text.slice(0, 200))
      throw new Error(`upstream-${res.status}`)
    }
    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content
    if (typeof content !== 'string') throw new Error('empty-completion')
    return JSON.parse(content)
  } finally {
    clearTimeout(timer)
  }
}

/* ------------------------------------------------------------------ prompts */
const TUTOR_SYSTEM = `You are a patient maths tutor for Indian students in Classes 6-10.
Rules:
- Explain in the requested language only (en, hi or gu). Use simple words for a 13-year-old.
- At most 110 words. Use short lines. No markdown headings, no emoji, no code fences.
- Stay on the given Class 8 topic: fractions, variables, simplifying expressions, simple equations or word problems.
- Never invent facts about the student, their school or their marks.
- If the question is off-topic, say briefly that you can only help with this topic.
Reply as JSON: {"answer": "<text>"}`

const QUESTION_SYSTEM = `You write single multiple-choice maths questions for Indian Class 8 students.
Reply as JSON with exactly these keys:
{"prompt": string, "options": [four unique short strings], "correct": 0-3, "hint": string,
 "explanation": string, "concept": string, "level": 1-3}
Rules:
- One unambiguous correct answer; the other three must be plausible but clearly wrong.
- No fractions written with LaTeX. Use plain text such as 3/4.
- Explanation must state the method, not just the answer.
- The concept must be one of the allowed list you are given.
- Difficulty must match the requested level.`

function topicBrief(topicId) {
  const map = {
    fractions: 'Fractions: equivalent fractions, adding and subtracting with unlike denominators, fraction of a quantity.',
    variables: 'Variables and expressions: what a letter means, substitution, writing expressions from words.',
    simplify: 'Simplifying expressions: collecting like terms, expanding and removing brackets.',
    equations: 'Simple equations: the balance method, one-step and two-step equations.',
    word: 'Word problems: turning a short story into an equation and solving it.',
  }
  return map[topicId] ?? map.fractions
}

/* ------------------------------------------------------------------- routes */
const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)
  const ip = req.socket.remoteAddress ?? 'unknown'

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'access-control-allow-origin': 'http://localhost:5173',
      'access-control-allow-methods': 'POST, GET, OPTIONS',
      'access-control-allow-headers': 'content-type',
    })
    return res.end()
  }

  if (url.pathname === '/api/health') {
    return send(res, 200, {
      ok: true,
      ai: KEY ? 'configured' : 'not-configured',
      model: KEY ? MODEL : null,
      note: KEY
        ? 'Live endpoint ready. Responses are validated before display.'
        : 'No key set — the app stays in demo mode with predefined responses.',
    })
  }

  if (!allow(ip)) return send(res, 429, { error: 'rate-limited', note: 'Try again in a minute.' })

  if (req.method === 'POST' && url.pathname === '/api/tutor') {
    if (!KEY) {
      return send(res, 503, {
        error: 'ai-not-configured',
        note: 'Demo mode: the answer came from the predefined knowledge base.',
      })
    }
    try {
      const body = await readJson(req)
      const question = String(body.question ?? '').slice(0, 400).trim()
      const topicId = String(body.topicId ?? 'fractions')
      const lang = ['en', 'hi', 'gu'].includes(body.lang) ? body.lang : 'en'
      if (!question) return send(res, 400, { error: 'question-required' })

      const data = await callModel([
        { role: 'system', content: TUTOR_SYSTEM },
        {
          role: 'system',
          content: `Topic in focus: ${topicBrief(topicId)}\nReply in language code: ${lang}`,
        },
        { role: 'user', content: question },
      ])

      const answer = typeof data.answer === 'string' ? data.answer.trim().slice(0, 1200) : ''
      if (!answer) return send(res, 502, { error: 'empty-answer' })
      return send(res, 200, { answer, source: 'live-model', model: MODEL, lang })
    } catch (err) {
      return send(res, 502, { error: 'upstream-failed', note: String(err.message ?? err) })
    }
  }

  if (req.method === 'POST' && url.pathname === '/api/generate-question') {
    if (!KEY) {
      return send(res, 503, {
        error: 'ai-not-configured',
        note: 'Demo mode: use the verified questions in the local bank.',
      })
    }
    try {
      const body = await readJson(req)
      const topicId = String(body.topicId ?? 'fractions')
      const level = Number(body.level ?? 1)
      const concept = String(body.concept ?? 'add-subtract-fractions')

      const data = await callModel(
        [
          { role: 'system', content: QUESTION_SYSTEM },
          {
            role: 'system',
            content: `Topic: ${topicBrief(topicId)}\nAllowed concept: ${concept}\nRequested level: ${level}`,
          },
          { role: 'user', content: 'Write one question as JSON.' },
        ],
        { temperature: 0.6, maxTokens: 600 },
      )

      const checked = validateQuestion({ ...data, topicId, level, concept }, { topicId, level })
      if (!checked.ok) {
        // Never show an invalid question. The client falls back to the verified bank.
        return send(res, 422, { error: 'invalid-question', errors: checked.errors })
      }
      return send(res, 200, { question: checked.value, source: 'live-model' })
    } catch (err) {
      return send(res, 502, { error: 'upstream-failed', note: String(err.message ?? err) })
    }
  }

  return send(res, 404, { error: 'not-found' })
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[learnwise] API on http://127.0.0.1:${PORT}`)
  console.log(`[learnwise] AI: ${KEY ? `live (${MODEL})` : 'not configured — demo mode'}`)
  console.log('[learnwise] The API key is read from LEARNWISE_AI_KEY and never sent to the browser.')
})
