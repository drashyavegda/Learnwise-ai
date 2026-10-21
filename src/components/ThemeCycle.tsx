const STEPS = [
  { label: 'Assess', note: 'short diagnostic' },
  { label: 'Understand', note: 'topic-level gaps' },
  { label: 'Personalise', note: 'language & level' },
  { label: 'Practise', note: 'right difficulty' },
  { label: 'Evaluate', note: 'evidence' },
  { label: 'Adapt', note: 'next activity' },
]

/** The six-stage learning loop, drawn with plain SVG + absolutely placed nodes. */
export function ThemeCycle({ compact = false }: { compact?: boolean }) {
  const radius = 41
  return (
    <div className="relative mx-auto w-full max-w-[430px]" style={{ height: compact ? 330 : 400 }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.5" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(15,169,143,0.35)" strokeWidth="0.5" strokeDasharray="1.4 3.2" />
        {STEPS.map((_, i) => {
          const a = ((-90 + i * 60) * Math.PI) / 180
          const x = 50 + radius * Math.cos(a)
          const y = 50 + radius * Math.sin(a)
          return <circle key={i} cx={x} cy={y} r="1.1" fill="#0FA98F" />
        })}
      </svg>

      <div className="absolute left-1/2 top-1/2 flex h-[38%] w-[52%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/15 bg-navy-800 text-center shadow-lift">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-teal">Learning loop</p>
        <p className="mt-1 px-3 text-[12px] font-semibold leading-snug text-white">
          Learn · Solve · Test
        </p>
        <p className="mt-1 px-4 text-[10.5px] leading-snug text-navy-300">one connected cycle</p>
      </div>

      {STEPS.map((step, i) => {
        const a = ((-90 + i * 60) * Math.PI) / 180
        const x = 50 + radius * Math.cos(a)
        const y = 50 + radius * Math.sin(a)
        return (
          <div
            key={step.label}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-white/15 bg-navy-800/95 px-2.5 py-1.5 shadow-lift"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-teal text-[10px] font-bold text-navy-900">
              {i + 1}
            </span>
            <span className="whitespace-nowrap text-[10.5px] font-semibold text-white">{step.label}</span>
            {!compact && <span className="hidden whitespace-nowrap text-[9.5px] text-navy-300 xl:inline">· {step.note}</span>}
          </div>
        )
      })}
    </div>
  )
}
