import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowUp, Bot, ChevronRight, Globe2, Info, Lightbulb, MessageSquareQuote, Sparkles, User,
} from 'lucide-react'
import { PageHeader } from '../components/Layout'
import { Button, Callout, Card, DemoTag, Disclosure, Pill, SectionHeading } from '../components/ui'
import { TOPICS } from '../data/curriculum'
import { TUTOR, tutorLanguages } from '../data/tutor'
import { LANG_LABELS, t, tr } from '../lib/i18n'
import { useApp } from '../lib/store'
import { SUGGESTED_QUESTIONS, askTutor } from '../lib/tutor'
import type { Lang, TopicId } from '../lib/types'

interface Message {
  id: string
  role: 'student' | 'tutor'
  text: string
  meta?: string
}

const uid = () => Math.random().toString(36).slice(2, 9)

/** Simple, honest visual for the fractions worked example. */
function FractionPizza() {
  const sectors = (n: number, shaded: number, color: string, label: string) => {
    const r = 34
    const cx = 44
    const cy = 44
    const paths = Array.from({ length: n }).map((_, i) => {
      const a0 = (i / n) * 2 * Math.PI - Math.PI / 2
      const a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2
      const x0 = cx + r * Math.cos(a0)
      const y0 = cy + r * Math.sin(a0)
      const x1 = cx + r * Math.cos(a1)
      const y1 = cy + r * Math.sin(a1)
      return (
        <path
          key={i}
          d={`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z`}
          fill={i < shaded ? color : '#FFFFFF'}
          stroke="#C9D2E6"
          strokeWidth="1"
        />
      )
    })
    return (
      <div className="flex flex-col items-center gap-1">
        <svg viewBox="0 0 88 88" className="h-20 w-20" role="img" aria-label={label}>
          <circle cx={cx} cy={cy} r={r} fill="#FFFFFF" stroke="#C9D2E6" strokeWidth="1" />
          {paths}
        </svg>
        <span className="text-[10.5px] font-semibold text-navy-500">{label}</span>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-navy-100 bg-white p-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">
        Pizza model — the pieces must be the same size
      </p>
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {sectors(2, 1, '#0FA98F', '1/2')}
        <span className="pb-5 text-lg font-bold text-navy-300">+</span>
        {sectors(3, 1, '#6C4CF1', '1/3')}
        <span className="pb-5 text-lg font-bold text-navy-300">=</span>
        {sectors(6, 5, '#0A7C71', '5/6')}
      </div>
      <p className="mt-1 text-center text-[11px] text-navy-500">
        Cut both pizzas into sixths: 3/6 + 2/6 = 5/6
      </p>
    </div>
  )
}

export default function Tutor() {
  const [params, setParams] = useSearchParams()
  const { lang, setLang, aiMode, student } = useApp()
  const initialTopic = (params.get('topic') as TopicId | null) ?? 'fractions'
  const [topicId, setTopicId] = useState<TopicId>(
    TOPICS.some((tp) => tp.id === initialTopic) ? initialTopic : 'fractions',
  )
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  const block = TUTOR[topicId]
  const available = tutorLanguages(topicId)
  const topic = TOPICS.find((tp) => tp.id === topicId)!
  const languageSupported = available.includes(lang)

  useEffect(() => {
    setMessages([
      {
        id: uid(),
        role: 'tutor',
        text: tr(block.simple, lang),
        meta: aiMode === 'demo' ? 'Predefined content · demo mode' : 'Live model via /api/tutor',
      },
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId, lang, aiMode])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, thinking])

  const selectTopic = (id: TopicId) => {
    setTopicId(id)
    setParams({ topic: id }, { replace: true })
  }

  const send = async (raw?: string) => {
    const question = (raw ?? input).trim()
    if (!question || thinking) return
    setInput('')
    setMessages((m) => [...m, { id: uid(), role: 'student', text: question }])
    setThinking(true)
    const answer = await askTutor({
      question,
      topicId,
      lang,
      context: `Class 8 student${student.assessments[0] ? `, recent diagnostic ${student.assessments[0].correct}/${student.assessments[0].total}` : ''}`,
    })
    // small, honest pause so the exchange is readable on screen
    await new Promise((r) => setTimeout(r, 420))
    setThinking(false)
    setMessages((m) => [
      ...m,
      { id: uid(), role: 'tutor', text: answer.text, meta: `${answer.source} · ${answer.intent}` },
    ])
  }

  const suggestions = [
    ...SUGGESTED_QUESTIONS[lang],
    ...(block.faq[0] ? [tr(block.faq[0].q, lang)] : []),
  ].slice(0, 4)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('tutor.eyebrow', lang)}
        title={`${t('tutor.askAbout', lang)} ${tr(topic.name, lang)}`}
        subtitle={t('tutor.subtitle', lang)}
        actions={
          <>
            {aiMode === 'demo' ? <DemoTag label="Demo mode · predefined answers" /> : <Pill tone="teal">Live model enabled</Pill>}
            <div className="flex items-center gap-1 rounded-lg border border-navy-200 bg-white p-1">
              {(['en', 'hi', 'gu'] as Lang[]).map((code) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={`rounded-md px-2 py-1 text-[12px] font-semibold ${
                    lang === code ? 'bg-navy-900 text-white' : 'text-navy-500 hover:text-navy-800'
                  }`}
                >
                  {LANG_LABELS[code].native}
                </button>
              ))}
            </div>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        {/* ------------------------------------------------------- learning side */}
        <div className="space-y-4">
          <Card className="card-pad">
            <SectionHeading eyebrow="Topic" title={t('tutor.choose', lang)} />
            <div className="mt-3 flex flex-wrap gap-2">
              {TOPICS.map((tp) => {
                const langs = tutorLanguages(tp.id)
                const active = tp.id === topicId
                return (
                  <button
                    key={tp.id}
                    onClick={() => selectTopic(tp.id)}
                    className={`group rounded-xl border px-3 py-2 text-left transition-colors ${
                      active ? 'border-brand-teal bg-brand-tealSoft' : 'border-navy-200 bg-white hover:border-navy-300'
                    }`}
                  >
                    <span className={`block text-[13px] font-semibold ${active ? 'text-brand-tealDeep' : 'text-navy-800'}`}>
                      {tr(tp.name, lang)}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 text-[10.5px] text-navy-400">
                      <Globe2 className="h-3 w-3" />
                      {langs.length === 3 ? 'EN · हिन्दी · ગુજરાતી' : langs.length === 2 ? 'EN · हिन्दी' : 'English only'}
                    </span>
                  </button>
                )
              })}
            </div>
          </Card>

          <Card className="card-pad">
            <div className="flex items-start justify-between gap-3">
              <SectionHeading eyebrow={t('tutor.inOneIdea', lang)} title={tr(topic.name, lang)} note={tr(topic.blurb, lang)} />
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-violetSoft text-[#4b30c8]">
                <Lightbulb className="h-[18px] w-[18px]" />
              </span>
            </div>

            <p className="mt-4 text-[14.5px] leading-relaxed text-navy-700">{tr(block.simple, lang)}</p>

            {topicId === 'fractions' && (
              <div className="mt-4">
                <FractionPizza />
              </div>
            )}

            <div className="mt-4 rounded-xl border border-navy-100 bg-navy-50/70 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">{t('tutor.worked', lang)}</p>
              <p className="mt-1 text-[14px] font-semibold text-navy-900">{tr(block.exampleTitle, lang)}</p>
              <ol className="mt-3 space-y-2">
                {block.exampleSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy-900 text-[10.5px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-[13px] leading-relaxed text-navy-700">{tr(step, lang)}</span>
                  </li>
                ))}
              </ol>
            </div>

            {block.why && (
              <div className="mt-3">
                <Disclosure title="Why this works" tone="violet">
                  {tr(block.why, lang)}
                </Disclosure>
              </div>
            )}

            {!languageSupported && (
              <div className="mt-3">
                <Callout tone="amber" icon={<Info className="h-4 w-4" />}>
                  This topic’s explanation is English-only in the prototype. Fractions, variables and equations are
                  fully translated; the rest are honest gaps rather than machine output.
                </Callout>
              </div>
            )}
          </Card>

          <Card className="card-pad">
            <SectionHeading eyebrow="Questions students ask" title={t('tutor.doubts', lang)} />
            <div className="mt-3 space-y-2">
              {block.faq.map((faq, i) => (
                <Disclosure key={i} title={tr(faq.q, lang)}>
                  {tr(faq.a, lang)}
                </Disclosure>
              ))}
            </div>
          </Card>
        </div>

        {/* --------------------------------------------------------------- chat */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card className="flex h-[620px] flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-2 border-b border-navy-100 bg-navy-900 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10">
                  <Bot className="h-[18px] w-[18px] text-brand-teal" />
                </span>
                <div>
                  <p className="text-[12.5px] font-semibold leading-tight">LearnWise tutor</p>
                  <p className="text-[10.5px] text-navy-300">
                    {aiMode === 'demo' ? 'Demo mode · no model connected' : 'Live model · via secure backend'}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold text-navy-200 ring-1 ring-white/10">
                {LANG_LABELS[lang].native}
              </span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 scrollbar-thin">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-2 ${m.role === 'student' ? 'justify-end' : ''}`}>
                  {m.role === 'tutor' && (
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-violetSoft text-[#4b30c8]">
                      <Bot className="h-3.5 w-3.5" />
                    </span>
                  )}
                  <div className={`max-w-[85%] ${m.role === 'student' ? 'order-first' : ''}`}>
                    <div
                      className={`whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                        m.role === 'student'
                          ? 'rounded-br-md bg-brand-tealSoft text-[#0b5f57]'
                          : 'rounded-bl-md bg-navy-50 text-navy-700 ring-1 ring-navy-100'
                      }`}
                    >
                      {m.text}
                    </div>
                    {m.meta && <p className="mt-1 text-[10px] text-navy-400">{m.meta}</p>}
                  </div>
                  {m.role === 'student' && (
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-navy-100 text-navy-600">
                      <User className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              ))}
              {thinking && (
                <div className="flex items-center gap-2 text-[12px] text-navy-400">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-violetSoft text-[#4b30c8]">
                    <Bot className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-300 [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-300 [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-300" />
                  </span>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="border-t border-navy-100 px-3 py-2.5">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="inline-flex items-center gap-1 rounded-full border border-navy-200 px-2.5 py-1 text-[11px] font-medium text-navy-500 hover:border-navy-300 hover:text-navy-800"
                  >
                    <MessageSquareQuote className="h-3 w-3" /> {s}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  void send()
                }}
                className="flex items-end gap-2"
              >
                <label className="sr-only" htmlFor="tutor-input">Ask a question</label>
                <textarea
                  id="tutor-input"
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      void send()
                    }
                  }}
                  placeholder={tr({ en: 'Ask a question about this topic…', hi: 'इस विषय पर कुछ पूछो…', gu: 'આ વિષય વિશે કંઈ પૂછો…' }, lang)}
                  className="max-h-24 min-h-[42px] flex-1 resize-none rounded-xl border border-navy-200 px-3 py-2.5 text-[13px] text-navy-800 placeholder:text-navy-400 focus:border-brand-teal focus:outline-none"
                />
                <Button type="submit" size="sm" className="h-[42px] w-[42px] !px-0" ariaLabel="Send question" disabled={!input.trim() || thinking}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </form>
              <p className="mt-1.5 text-[10px] leading-snug text-navy-400">
                {aiMode === 'demo'
                  ? 'Answers come from a fixed content pack, not a live AI model. The app can be wrong or incomplete — always check with your teacher.'
                  : 'Answers come from a language model through the server. It can make mistakes — check with your teacher.'}
              </p>
            </div>
          </Card>
        </div>
      </div>

      <Card className="card-pad">
        <SectionHeading
          eyebrow={t('tutor.coverage', lang)}
          title={t('tutor.coverageTitle', lang)}
          note={t('tutor.coverageNote', lang)}
        />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-navy-100 text-[10.5px] uppercase tracking-[0.1em] text-navy-400">
                <th className="pb-2 font-semibold">Topic</th>
                <th className="pb-2 text-center font-semibold">English</th>
                <th className="pb-2 text-center font-semibold">हिन्दी</th>
                <th className="pb-2 text-center font-semibold">ગુજરાતી</th>
              </tr>
            </thead>
            <tbody>
              {TOPICS.map((tp) => {
                const langs = tutorLanguages(tp.id)
                return (
                  <tr key={tp.id} className="border-b border-navy-50 last:border-0">
                    <td className="py-2 font-medium text-navy-800">{tp.name.en}</td>
                    {(['en', 'hi', 'gu'] as Lang[]).map((code) => (
                      <td key={code} className="py-2 text-center">
                        {langs.includes(code) ? (
                          <span className="text-brand-tealDeep">✓</span>
                        ) : (
                          <span className="text-navy-300">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11.5px] text-navy-500">
          <Sparkles className="h-3.5 w-3.5 text-brand-violet" />
          Interface labels are translated across the main student screens. Question text mirrors the topic coverage
          above.
          <button onClick={() => selectTopic('fractions')} className="inline-flex items-center gap-0.5 font-semibold text-brand-tealDeep hover:underline">
            Jump to fractions <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </Card>
    </div>
  )
}
