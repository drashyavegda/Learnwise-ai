import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowRight, ListChecks, RotateCcw } from 'lucide-react'
import { useApp } from '../lib/store'
import { Button, Modal, Pill } from './ui'

export function ResetDemoDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { resetDemo } = useApp()
  const navigate = useNavigate()
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Reset the demo?"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              resetDemo()
              onClose()
              navigate('/student')
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset everything
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3 rounded-xl bg-brand-amberSoft p-3 text-[13px] text-[#7a4f0d]">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          This clears Aarav’s diagnostic results, practice attempts, points, badges and revision reminders from this
          browser, and restores the starting sample data. Use it to rehearse the demo from the beginning.
        </p>
      </div>
      <p className="mt-3 text-[13px] text-navy-500">
        Nothing outside this browser is affected — the prototype has no backend database.
      </p>
    </Modal>
  )
}

const STEPS = [
  { label: 'Open Aarav’s dashboard', detail: 'Points, streak, topic status and the recommended next activity.', to: '/student' },
  { label: 'Take the 8-question diagnostic', detail: 'Answer freely — the score is computed from your answers. To reproduce the guided story, get the fractions questions wrong on purpose.', to: '/student/assessment' },
  { label: 'Read the results', detail: 'Topic-level mastery, the flagged concept and the exact reason it was flagged.', to: '/student/results' },
  { label: 'Ask the tutor about fractions', detail: 'Pizza example, worked steps, and the demo-mode label. Switch to हिन्दी or ગુજરાતી.', to: '/student/tutor?topic=fractions' },
  { label: 'Practise with adaptive difficulty', detail: 'Answer two in a row correctly and the level rises. Two wrong and it steps back with a reason.', to: '/student/practice?topic=fractions' },
  { label: 'Check the learning path', detail: 'Fractions unlock variables, expressions, equations and word problems in order.', to: '/student/path' },
  { label: 'Switch to the teacher view', detail: 'Class mastery, students needing support, and a lesson plan the teacher can edit.', to: '/teacher' },
  { label: 'Switch to the parent view', detail: 'A plain-language summary with no rankings.', to: '/parent' },
]

export function DemoGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const [hover, setHover] = useState<number | null>(null)
  return (
    <Modal
      open={open}
      onClose={onClose}
      wide
      title="Guided demo — about 4 minutes"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onClose()
              navigate('/student/assessment')
            }}
          >
            <ListChecks className="h-4 w-4" /> Start at step 2
          </Button>
        </>
      }
    >
      <p className="mb-4 text-[13px] text-navy-500">
        Follow these eight steps in order. Every step is a real screen in the app — nothing here is a mock-up.
        The whole flow uses one fictional student, Aarav, in Class 8.
      </p>
      <ol className="space-y-1.5">
        {STEPS.map((step, i) => (
          <li key={step.label}>
            <button
              onClick={() => {
                onClose()
                navigate(step.to)
              }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="group flex w-full items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-colors hover:border-navy-100 hover:bg-navy-50"
            >
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-navy-900 text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-semibold text-navy-900">{step.label}</span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-navy-500">{step.detail}</span>
              </span>
              <ArrowRight className={`mt-1 h-4 w-4 shrink-0 text-navy-300 transition-transform ${hover === i ? 'translate-x-0.5 text-brand-teal' : ''}`} />
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Pill tone="amber">Demo mode — no live AI model is called</Pill>
        <Pill tone="teal">Reset any time from the sidebar</Pill>
      </div>
    </Modal>
  )
}
