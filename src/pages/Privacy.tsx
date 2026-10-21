import { useState } from 'react'
import {
  Database, Download, Eye, FileJson, KeyRound, Lock, Server, ShieldCheck, Trash2, WifiOff,
} from 'lucide-react'
import { PageHeader } from '../components/Layout'
import {
  Button, Callout, Card, Disclosure, Modal, Pill, SectionHeading,
} from '../components/ui'
import { useApp } from '../lib/store'

const FIELDS: { name: string; why: string }[] = [
  { name: 'name, class, section', why: 'So the dashboard and reports can say whose data it is. Fiction in this demo.' },
  { name: 'points, streak, badges', why: 'Rewards for completed work.' },
  { name: 'answers and scores', why: 'Every answer is stored so mastery and the learning path can be recalculated.' },
  { name: 'practice sessions and assessments', why: 'Used for trends and for the “personal best” indicator.' },
  { name: 'revision list', why: 'What is due and when, so reminders can be shown in the app.' },
  { name: 'language and display preferences', why: 'Remembers English / Hindi / Gujarati and low-data mode between visits.' },
  { name: 'saved lessons and sync queue', why: 'Which lessons were saved offline, and any progress waiting to sync.' },
]

export default function Privacy() {
  const { resetDemo, pushToast, student } = useApp()
  const [raw, setRaw] = useState(false)
  const [wipe, setWipe] = useState(false)

  const exportJson = () => {
    const data = localStorage.getItem('learnwise.demo.v1') ?? '{}'
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'learnwise-demo-data.json'
    a.click()
    URL.revokeObjectURL(url)
    pushToast({ title: 'Copy downloaded', note: 'A JSON file of everything stored in this browser.', kind: 'success' })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Privacy & access"
        title="What the app knows, and who can see it"
        subtitle="Written for a parent or a teacher, not for a lawyer. Everything here applies to this prototype."
        actions={<Pill tone="teal" dot>No account, no upload</Pill>}
      />

      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Card className="card-pad">
          <SectionHeading
            eyebrow="Storage"
            title="All data stays in this browser"
            note="LearnWise AI has no database and no student accounts in this build."
          />
          <div className="mt-4 space-y-2.5">
            {FIELDS.map((f) => (
              <div key={f.name} className="rounded-lg border border-navy-100 px-3 py-2">
                <p className="text-[12.5px] font-semibold text-navy-800">{f.name}</p>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-navy-500">{f.why}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-navy-50 p-3 text-[11.5px] leading-relaxed text-navy-500">
            <Database className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Stored under one browser key: <code className="mx-1 rounded bg-white px-1 py-0.5 font-mono text-[10.5px] text-navy-700">learnwise.demo.v1</code>
            Clearing site data for this address deletes it permanently. There is no server copy.
          </p>
        </Card>

        <div className="space-y-4">
          <Card className="card-pad">
            <SectionHeading eyebrow="Who sees what" title="Three views, one record" />
            <ul className="mt-3 space-y-3">
              <li className="flex items-start gap-2.5">
                <Eye className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                <p className="text-[12px] leading-relaxed text-navy-600"><span className="font-semibold text-navy-900">Student:</span> own answers, hints used, level, path and badges.</p>
              </li>
              <li className="flex items-start gap-2.5">
                <Eye className="mt-0.5 h-4 w-4 shrink-0 text-brand-violet" />
                <p className="text-[12px] leading-relaxed text-navy-600"><span className="font-semibold text-navy-900">Teacher:</span> class-level mastery, flagged concepts and suggestions. Can add a revision item; cannot change a student’s marks.</p>
              </li>
              <li className="flex items-start gap-2.5">
                <Eye className="mt-0.5 h-4 w-4 shrink-0 text-brand-amber" />
                <p className="text-[12px] leading-relaxed text-navy-600"><span className="font-semibold text-navy-900">Parent:</span> summary of activity and mastery, plus home-support ideas. No other child’s data is ever shown.</p>
              </li>
            </ul>
          </Card>

          <Card className="card-pad">
            <SectionHeading eyebrow="Your controls" title="Take a copy or delete it" />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={exportJson}>
                <Download className="h-3.5 w-3.5" /> Export JSON
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setRaw(true)}>
                <FileJson className="h-3.5 w-3.5" /> Inspect raw
              </Button>
              <Button size="sm" variant="danger" onClick={() => setWipe(true)}>
                <Trash2 className="h-3.5 w-3.5" /> Delete everything
              </Button>
            </div>
            <p className="mt-2.5 text-[11px] leading-relaxed text-navy-400">
              Export downloads the exact JSON this browser holds. Deletion resets the demo to its starting state.
            </p>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="card-pad">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-tealSoft text-brand-tealDeep"><Server className="h-4 w-4" /></span>
          <h3 className="mt-2.5 text-[13.5px] font-semibold text-navy-900">AI calls, when configured</h3>
          <p className="mt-1 text-[12px] leading-relaxed text-navy-500">
            A live deployment would route tutor questions to a server endpoint that holds the API key. The key is never in
            the browser and never in this repository. In demo mode no request leaves the device at all.
          </p>
        </Card>
        <Card className="card-pad">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-violetSoft text-brand-violet"><KeyRound className="h-4 w-4" /></span>
          <h3 className="mt-2.5 text-[13.5px] font-semibold text-navy-900">No secrets in the client</h3>
          <p className="mt-1 text-[12px] leading-relaxed text-navy-500">
            The only environment variable the browser can see is a flag that turns the live endpoint on or off. Model keys
            sit on the server side.
          </p>
        </Card>
        <Card className="card-pad">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-amberSoft text-[#8a5a10]"><WifiOff className="h-4 w-4" /></span>
          <h3 className="mt-2.5 text-[13.5px] font-semibold text-navy-900">Offline means local only</h3>
          <p className="mt-1 text-[12px] leading-relaxed text-navy-500">
            Saved lessons and progress work without a connection. Cloud tutoring does not, and the app says so on the
            lessons page rather than failing silently.
          </p>
        </Card>
      </div>

      <Disclosure title="Rules this prototype deliberately follows" defaultOpen>
        <ul className="space-y-1.5">
          <li>• No real child’s data is included. Aarav and the 23 classmates are invented.</li>
          <li>• No advertising, tracking pixels or third-party analytics.</li>
          <li>• No decision about a student is made by a model: levels, path and flags come from rules over real answers.</li>
          <li>• Teachers keep control; generated plans and activities are drafts a person can ignore.</li>
          <li>• Nothing claims to send notifications, emails or messages. Scheduling is simulated in the app only.</li>
        </ul>
      </Disclosure>

      <Callout tone="navy" icon={<ShieldCheck className="h-4 w-4" />}>
        A production version would need a real account system, parental consent and secure storage. Those are out of scope
        here and are not pretended to exist.
      </Callout>

      <Modal open={raw} onClose={() => setRaw(false)} wide title="Raw record in this browser">
        <pre className="max-h-[55vh] overflow-auto rounded-lg bg-navy-950 p-3 text-[10.5px] leading-relaxed text-navy-200">
          {localStorage.getItem('learnwise.demo.v1') ?? '{}'}
        </pre>
        <p className="mt-2 text-[11px] text-navy-400">This is exactly what the app reads on load. Nothing is hidden from you.</p>
      </Modal>

      <Modal
        open={wipe}
        onClose={() => setWipe(false)}
        title="Delete all demo data?"
        footer={
          <>
            <Button size="sm" variant="secondary" onClick={() => setWipe(false)}>Keep it</Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                resetDemo()
                setWipe(false)
              }}
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete and reset
            </Button>
          </>
        }
      >
        <p className="text-[13px] leading-relaxed text-navy-600">
          This removes every answer, badge, session and saved lesson for {student.name} from this browser and restores the
          starting demo state. It cannot be undone.
        </p>
        <p className="mt-2 flex items-start gap-1.5 text-[11.5px] text-navy-400">
          <Lock className="mt-0.5 h-3 w-3 shrink-0" /> Export a copy first if you want to keep the record.
        </p>
      </Modal>
    </div>
  )
}
