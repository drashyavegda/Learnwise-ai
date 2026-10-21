import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useEffect, useId, useState } from 'react'
import { ChevronDown, Info, X } from 'lucide-react'
import { tr } from '../lib/i18n'
import type { Lang, Localized } from '../lib/types'

export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')

/* ------------------------------------------------------------------ button */
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'violet' | 'subtle' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-teal text-white hover:bg-brand-tealDeep shadow-sm shadow-teal-900/10 disabled:bg-brand-teal/60',
  violet: 'bg-brand-violet text-white hover:bg-[#5a3be0] shadow-sm shadow-violet-900/10',
  secondary:
    'bg-white text-navy-800 border border-navy-200 hover:border-navy-300 hover:bg-navy-50',
  ghost: 'text-navy-600 hover:bg-navy-100 hover:text-navy-900',
  subtle: 'bg-navy-100 text-navy-800 hover:bg-navy-200',
  danger: 'bg-brand-rose text-white hover:bg-[#a1303f]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[13px] gap-1.5 rounded-lg',
  md: 'h-11 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-[15px] gap-2 rounded-xl',
}

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  ariaLabel?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  onClick,
  disabled,
  type = 'button',
  ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </button>
  )
}

export function LinkButton({
  to,
  variant = 'primary',
  size = 'md',
  className,
  children,
  onClick,
}: {
  to: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
  onClick?: () => void
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-colors duration-150',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </Link>
  )
}

/* -------------------------------------------------------------------- card */
export function Card({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'article'
}) {
  return <Tag className={cn('card', className)}>{children}</Tag>
}

export function SectionHeading({
  eyebrow,
  title,
  note,
  action,
  className,
}: {
  eyebrow?: string
  title: ReactNode
  note?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-3', className)}>
      <div className="min-w-0">
        {eyebrow && <p className="label mb-1.5">{eyebrow}</p>}
        <h2 className="text-lg font-semibold text-navy-900 sm:text-xl">{title}</h2>
        {note && <p className="mt-1 text-sm text-navy-500">{note}</p>}
      </div>
      {action}
    </div>
  )
}

/* --------------------------------------------------------------------- pill */
type Tone = 'teal' | 'violet' | 'amber' | 'rose' | 'navy' | 'neutral'

const tones: Record<Tone, string> = {
  teal: 'bg-brand-tealSoft text-brand-tealDeep border-teal-200/60',
  violet: 'bg-brand-violetSoft text-[#4b30c8] border-violet-200/60',
  amber: 'bg-brand-amberSoft text-[#8a5a10] border-amber-200/60',
  rose: 'bg-brand-roseSoft text-brand-rose border-rose-200/60',
  navy: 'bg-navy-100 text-navy-700 border-navy-200',
  neutral: 'bg-navy-50 text-navy-500 border-navy-100',
}

export function Pill({
  children,
  tone = 'neutral',
  className,
  dot,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
  dot?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-semibold',
        tones[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

/* ----------------------------------------------------------------- progress */
export function ProgressBar({
  value,
  tone = 'teal',
  className,
  label,
}: {
  value: number
  tone?: 'teal' | 'violet' | 'amber' | 'rose' | 'navy'
  className?: string
  label?: string
}) {
  const colors = {
    teal: 'bg-brand-teal',
    violet: 'bg-brand-violet',
    amber: 'bg-brand-amber',
    rose: 'bg-brand-rose',
    navy: 'bg-brand-indigo',
  }
  const pctValue = Math.max(0, Math.min(100, value))
  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-navy-100', className)}
      role="progressbar"
      aria-valuenow={pctValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-500 ease-out', colors[tone])}
        style={{ width: `${pctValue}%` }}
      />
    </div>
  )
}

export function RingProgress({
  value,
  size = 76,
  stroke = 8,
  tone = '#0FA98F',
  label,
}: {
  value: number
  size?: number
  stroke?: number
  tone?: string
  label?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pctValue = Math.max(0, Math.min(100, value))
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E6EAF4" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (pctValue / 100) * c}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="absolute text-sm font-bold text-navy-900">{label ?? `${pctValue}%`}</span>
    </div>
  )
}

/* -------------------------------------------------------------------- stat */
export function Stat({
  label,
  value,
  hint,
  icon,
  tone = 'navy',
}: {
  label: string
  value: ReactNode
  hint?: ReactNode
  icon?: ReactNode
  tone?: 'navy' | 'teal' | 'violet' | 'amber'
}) {
  const iconTone = {
    navy: 'bg-navy-100 text-navy-600',
    teal: 'bg-brand-tealSoft text-brand-tealDeep',
    violet: 'bg-brand-violetSoft text-[#4b30c8]',
    amber: 'bg-brand-amberSoft text-[#8a5a10]',
  }
  return (
    <div className="flex items-start gap-3">
      {icon && <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', iconTone[tone])}>{icon}</span>}
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">{label}</p>
        <p className="mt-0.5 truncate text-xl font-bold text-navy-900">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-navy-500">{hint}</p>}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------- tabs */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { id: T; label: ReactNode }[]
  value: T
  onChange: (v: T) => void
  className?: string
}) {
  return (
    <div className={cn('inline-flex flex-wrap gap-1 rounded-xl bg-navy-100 p-1', className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={value === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors',
            value === tab.id ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500 hover:text-navy-800',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

/* --------------------------------------------------------------- disclosure */
export function Disclosure({
  title,
  children,
  defaultOpen = false,
  tone = 'neutral',
}: {
  title: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  tone?: 'neutral' | 'teal' | 'violet'
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div
      className={cn(
        'rounded-xl border',
        tone === 'teal' && 'border-teal-200/70 bg-brand-tealSoft/50',
        tone === 'violet' && 'border-violet-200/70 bg-brand-violetSoft/50',
        tone === 'neutral' && 'border-navy-100 bg-navy-50/60',
      )}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="text-[13px] font-semibold text-navy-700">{title}</span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-navy-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="px-4 pb-4 text-[13.5px] leading-relaxed text-navy-600">{children}</div>}
    </div>
  )
}

/* ------------------------------------------------------------------- modal */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  wide,
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}) {
  const id = useId()
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/45 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby={id}>
      <div className={cn('max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-6 shadow-lift sm:rounded-2xl', wide ? 'sm:max-w-2xl' : 'sm:max-w-lg')}>
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 id={id} className="text-lg font-semibold text-navy-900">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-100 hover:text-navy-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="text-sm text-navy-600">{children}</div>
        {footer && <div className="mt-5 flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ toggle */
export function Toggle({
  checked,
  onChange,
  label,
  hint,
  id,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  hint?: string
  id?: string
}) {
  const generated = useId()
  const inputId = id ?? generated
  return (
    <label htmlFor={inputId} className="flex cursor-pointer items-start gap-3">
      <button
        id={inputId}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors',
          checked ? 'bg-brand-teal' : 'bg-navy-200',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all',
            checked ? 'left-[18px]' : 'left-0.5',
          )}
        />
      </button>
      <span className="text-[13px] leading-snug">
        <span className="font-semibold text-navy-800">{label}</span>
        {hint && <span className="block text-xs text-navy-500">{hint}</span>}
      </span>
    </label>
  )
}

/* --------------------------------------------------------------- local text */
export function L({ value, lang }: { value: Localized; lang: Lang }) {
  return <>{tr(value, lang)}</>
}

export function Callout({
  children,
  tone = 'navy',
  icon,
}: {
  children: ReactNode
  tone?: 'navy' | 'teal' | 'amber' | 'violet'
  icon?: ReactNode
}) {
  const styles = {
    navy: 'border-navy-100 bg-navy-50 text-navy-600',
    teal: 'border-teal-200/70 bg-brand-tealSoft text-[#0b5f57]',
    amber: 'border-amber-200/70 bg-brand-amberSoft text-[#7a4f0d]',
    violet: 'border-violet-200/70 bg-brand-violetSoft text-[#452c9e]',
  }
  return (
    <div className={cn('flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[13px] leading-relaxed', styles[tone])}>
      <span className="mt-0.5 shrink-0">{icon ?? <Info className="h-4 w-4" />}</span>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

export function DemoTag({ label = 'Demo mode' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/70 bg-brand-amberSoft px-2.5 py-1 text-[11px] font-semibold text-[#8a5a10]">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-amber" />
      {label}
    </span>
  )
}

export function EmptyState({
  title,
  note,
  action,
  icon,
}: {
  title: string
  note?: string
  action?: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-white/60 px-6 py-10 text-center">
      {icon && <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-navy-100 text-navy-500">{icon}</div>}
      <p className="font-semibold text-navy-800">{title}</p>
      {note && <p className="mt-1 max-w-sm text-sm text-navy-500">{note}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
