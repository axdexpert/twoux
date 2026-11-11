/**
 * DatePicker, DateRangePicker and DateFilterPill: TwoUX compositions on the generated shadcn Calendar (react-day-picker), Popover and InputGroup.
 * Typing is the main path; the calendar is the second. Values are ISO calendar dates ("2026-03-12"), never a Date at
 * midnight UTC, so they match Timestamp, which reads that form as a local day. Errors sit under the field.
 * Proposal: proposals/date-picker.md.
 */
"use client"

import { AlertCircle, CalendarDays, Plus, X } from "lucide-react"
import * as React from "react"
import type { DateRange as DayRange, Matcher } from "react-day-picker"
import { cn } from "../lib/cn"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Field, FieldDescription, FieldLabel } from "./field"
import { Input } from "./input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "./input-group"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "./popover"

/* ---------------------------------------------------------------- dates as ISO strings */

const pad = (n: number) => String(n).padStart(2, "0")
/** A local Date as an ISO calendar date: 2026-03-12. */
const isoOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
/** An ISO calendar date as a local Date at midnight (not UTC, which lands on the day before west of London). */
export const fromIsoDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}
const valid = (y: number, m: number, d: number) => {
  const t = new Date(y, m - 1, d)
  return t.getFullYear() === y && t.getMonth() === m - 1 && t.getDate() === d ? isoOf(t) : null
}
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
const year = (y: string) => (y.length === 2 ? 2000 + Number(y) : Number(y))

/**
 * Reads a typed date the way people in the UK write it: 12/03/2026, 12/3/26, 12-03-2026, 12.03.2026, 12 Mar 2026,
 * 12 March 2026 and ISO 2026-03-12. Returns the ISO date, or null when it isn't a real date.
 */
export function parseDate(text: string): string | null {
  const s = text.trim().toLowerCase().replace(/,/g, " ").replace(/\s+/g, " ")
  if (!s) return null
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s)
  if (m) return valid(+m[1], +m[2], +m[3])
  m = /^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{2}|\d{4})$/.exec(s)
  if (m) return valid(year(m[3]), +m[2], +m[1])
  m = /^(\d{1,2})(?:st|nd|rd|th)? ([a-z]+)\.? (\d{2}|\d{4})$/.exec(s)
  if (m) {
    const month = MONTHS.indexOf(m[2].slice(0, 3))
    return month < 0 || (m[2].length > 3 && !["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"][month].startsWith(m[2])) ? null : valid(year(m[3]), month + 1, +m[1])
  }
  return null
}
/** The ISO date as it appears in the field: 12/03/2026. */
export const formatDateInput = (iso: string | null | undefined) => (iso ? iso.split("-").reverse().join("/") : "")
/** The ISO date in words, for messages: 7 December 2026. */
export const formatDateLong = (iso: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(fromIsoDate(iso))

/* ---------------------------------------------------------------- presets */

export type DatePreset = {
  id: string
  label: string
  /** The range on a given day. Stored by id in filters, so a saved view still means "last 30 days" next month. */
  range: (today: Date) => { from: string; to: string }
}
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const quarterStart = (d: Date) => new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1)
/** Last 7 days, last 30 days, this month, last month, this quarter and last quarter, each ending today or at the period's end. */
export const DATE_PRESETS: DatePreset[] = [
  { id: "last-7-days", label: "Last 7 days", range: (t) => ({ from: isoOf(addDays(t, -6)), to: isoOf(t) }) },
  { id: "last-30-days", label: "Last 30 days", range: (t) => ({ from: isoOf(addDays(t, -29)), to: isoOf(t) }) },
  { id: "this-month", label: "This month", range: (t) => ({ from: isoOf(new Date(t.getFullYear(), t.getMonth(), 1)), to: isoOf(t) }) },
  { id: "last-month", label: "Last month", range: (t) => ({ from: isoOf(new Date(t.getFullYear(), t.getMonth() - 1, 1)), to: isoOf(new Date(t.getFullYear(), t.getMonth(), 0)) }) },
  { id: "this-quarter", label: "This quarter", range: (t) => ({ from: isoOf(quarterStart(t)), to: isoOf(t) }) },
  {
    id: "last-quarter",
    label: "Last quarter",
    range: (t) => {
      const start = quarterStart(t)
      return { from: isoOf(new Date(start.getFullYear(), start.getMonth() - 3, 1)), to: isoOf(addDays(start, -1)) }
    },
  },
]
/** The dates a range value stands for today: a preset is worked out afresh, fixed dates are returned as they are. */
export function resolveDateRange(value: DateRangeValue, presets: DatePreset[] = DATE_PRESETS, today = new Date()): { from: string | null; to: string | null } {
  const p = value.preset ? presets.find((x) => x.id === value.preset) : undefined
  return p ? p.range(today) : { from: value.from ?? null, to: value.to ?? null }
}

/* ---------------------------------------------------------------- shared parts */

type Unavailable = {
  /** Earliest date people can choose, as an ISO date. */
  min?: string
  /** Latest date people can choose, as an ISO date. */
  max?: string
  /** Other dates people can't choose, such as weekends: true means unavailable. */
  isDateUnavailable?: (iso: string) => boolean
  /** One sentence under the calendar, and the error when such a date is typed: "Closing dates must be on a weekday." */
  unavailableReason?: string
}
function checkDate(iso: string, { min, max, isDateUnavailable, unavailableReason }: Unavailable): string | undefined {
  if (min && iso < min) return `Choose a date on or after ${formatDateLong(min)}.`
  if (max && iso > max) return `Choose a date on or before ${formatDateLong(max)}.`
  if (isDateUnavailable?.(iso)) return unavailableReason ?? "That date isn't available. Choose another."
}
function matchers({ min, max, isDateUnavailable }: Unavailable): Matcher[] {
  const m: Matcher[] = []
  if (min) m.push({ before: fromIsoDate(min) })
  if (max) m.push({ after: fromIsoDate(max) })
  if (isDateUnavailable) m.push((d: Date) => isDateUnavailable(isoOf(d)))
  return m
}
const formatHelp = (what: string) => `Enter the ${what.charAt(0).toLowerCase() + what.slice(1)} as dd/mm/yyyy, such as 12/03/2026.`

function Message({ id, error, hint }: { id: string; error?: string; hint?: React.ReactNode }) {
  if (error)
    return (
      <p id={id} className="flex items-start gap-control text-sm text-bad">
        <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        {error}
      </p>
    )
  return hint ? <FieldDescription id={id}>{hint}</FieldDescription> : null
}
function Label({ htmlFor, id, label, required, optional }: { htmlFor?: string; id: string; label: string; required?: boolean; optional?: boolean }) {
  return (
    <FieldLabel htmlFor={htmlFor} id={id}>
      {label}
      {required && <span aria-hidden="true" className="text-bad">*</span>}
      {optional && <span className="font-normal text-ink-3">(optional)</span>}
    </FieldLabel>
  )
}
function useWide() {
  const [wide, setWide] = React.useState(false)
  React.useEffect(() => {
    const q = window.matchMedia("(min-width: 768px)")
    const on = () => setWide(q.matches)
    on()
    q.addEventListener("change", on)
    return () => q.removeEventListener("change", on)
  }, [])
  return wide
}

/* ---------------------------------------------------------------- DatePicker */

type DatePickerProps = Unavailable & {
  label: string
  /** ISO date, or null when empty. */
  value: string | null
  onValueChange: (value: string | null) => void
  /** Shown under the field. Defaults to the format, "dd/mm/yyyy". */
  hint?: string
  /** An error from the form's own checks, such as "Enter a closing date." Typing errors are shown without it. */
  error?: string
  required?: boolean
  optional?: boolean
  disabled?: boolean
  /** Shows the value as text that can be selected and copied, without the calendar button. */
  readOnly?: boolean
  id?: string
  /** Submitted with the form as the ISO date. */
  name?: string
  className?: string
}

/** One calendar date: type it as dd/mm/yyyy or choose it on the calendar (Alt+↓). */
export function DatePicker({ label, value, onValueChange, hint = "dd/mm/yyyy", error, required, optional, disabled, readOnly, id, name, className, ...rules }: DatePickerProps) {
  const auto = React.useId()
  const fid = id ?? auto
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [text, setText] = React.useState(formatDateInput(value))
  const [typingError, setTypingError] = React.useState<string>()
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => setText(formatDateInput(value)), [value])

  const commit = () => {
    if (!text.trim()) {
      setTypingError(undefined)
      if (value !== null) onValueChange(null)
      return
    }
    const iso = parseDate(text)
    if (!iso) {
      setTypingError(formatHelp(label))
      if (value !== null) onValueChange(null)
      return
    }
    setTypingError(checkDate(iso, rules))
    setText(formatDateInput(iso))
    if (iso !== value) onValueChange(iso)
  }
  const shown = typingError ?? error
  const msgId = `${fid}-msg`

  if (readOnly)
    return (
      <Field className={cn("gap-2", className)}>
        <Label id={`${fid}-label`} htmlFor={fid} label={label} />
        <InputGroup>
          <InputGroupInput id={fid} readOnly value={formatDateInput(value)} name={name} />
        </InputGroup>
      </Field>
    )

  return (
    <Field data-invalid={!!shown || undefined} className={cn("gap-2", className)}>
      <Label id={`${fid}-label`} htmlFor={fid} label={label} required={required} optional={optional} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <InputGroup data-disabled={disabled || undefined}>
            <InputGroupInput
              ref={inputRef}
              id={fid}
              inputMode="numeric"
              autoComplete="off"
              placeholder="dd/mm/yyyy"
              value={text}
              disabled={disabled}
              required={required}
              aria-invalid={shown ? true : undefined}
              aria-describedby={msgId}
              onChange={(e) => setText(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit()
                if (e.key === "ArrowDown" && e.altKey) {
                  e.preventDefault()
                  commit()
                  setOpen(true)
                }
              }}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label="Choose date" aria-haspopup="dialog" aria-expanded={open} disabled={disabled} onClick={() => setOpen((o) => !o)}>
                <CalendarDays />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </PopoverAnchor>
        <PopoverContent
          align="end"
          className="w-auto p-0"
          role="dialog"
          aria-label="Choose date"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => {
            e.preventDefault()
            inputRef.current?.focus()
          }}
        >
          <Calendar
            mode="single"
            autoFocus
            selected={value ? fromIsoDate(value) : undefined}
            defaultMonth={value ? fromIsoDate(value) : rules.min && new Date() < fromIsoDate(rules.min) ? fromIsoDate(rules.min) : undefined}
            disabled={matchers(rules)}
            footer={rules.unavailableReason ? <p className="max-w-60 pt-2 text-sm text-ink-2">{rules.unavailableReason}</p> : undefined}
            onSelect={(d) => {
              if (!d) return
              const iso = isoOf(d)
              setTypingError(undefined)
              setText(formatDateInput(iso))
              onValueChange(iso)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
      {name && <input type="hidden" name={name} value={value ?? ""} />}
      <Message id={msgId} error={shown} hint={hint} />
    </Field>
  )
}

/* ---------------------------------------------------------------- ranges: shared value, checks and calendar body */

export type DateRangeValue = {
  from?: string | null
  to?: string | null
  /** A preset id ("last-30-days"): the range is worked out from today each time it is read. */
  preset?: string
}

const dayCount = (from: string, to: string) => Math.round((fromIsoDate(to).getTime() - fromIsoDate(from).getTime()) / 86400000) + 1
function checkRange(from: string | null | undefined, to: string | null | undefined, rules: Unavailable, maxDays?: number) {
  for (const d of [from, to]) if (d) { const e = checkDate(d, rules); if (e) return e }
  if (from && to && to < from) return "The end date is before the start date. Change one of them."
  if (from && to && maxDays && dayCount(from, to) > maxDays) return `Choose a range of up to ${maxDays} days.`
}
/** Reads typed From and To text: the ISO dates, or which end isn't a date. */
function readTyped(fromText: string, toText: string): { from: string | null; to: string | null } | { bad: "start" | "end" } {
  const from = fromText.trim() ? parseDate(fromText) : null
  const to = toText.trim() ? parseDate(toText) : null
  if (fromText.trim() && !from) return { bad: "start" }
  if (toText.trim() && !to) return { bad: "end" }
  return { from, to }
}

/** Presets beside a range calendar. The first day picked starts the range, the second ends it; days between fill as people point or move. */
function RangeBody({ value, presets, maxDays, months = 2, rules, onStart, onRange, onPreset }: {
  value: DateRangeValue
  months?: 1 | 2
  presets: DatePreset[]
  maxDays?: number
  rules: Unavailable
  onStart?: (iso: string) => void
  onRange: (from: string, to: string) => void
  onPreset: (p: DatePreset) => void
}) {
  const resolved = resolveDateRange(value, presets.length ? presets : DATE_PRESETS)
  const [picking, setPicking] = React.useState<string | null>(null)
  const [hover, setHover] = React.useState<string | null>(null)
  const wide = useWide() && months === 2
  const choose = (d: Date) => {
    const iso = isoOf(d)
    if (!picking) {
      setPicking(iso)
      onStart?.(iso)
      return
    }
    const [from, to] = iso < picking ? [iso, picking] : [picking, iso]
    setPicking(null)
    setHover(null)
    onRange(from, to)
  }
  const lo = picking && hover ? (hover < picking ? hover : picking) : null
  const hi = picking && hover ? (hover < picking ? picking : hover) : null
  const selected: DayRange | undefined = picking
    ? { from: fromIsoDate(picking), to: undefined }
    : resolved.from
      ? { from: fromIsoDate(resolved.from), to: resolved.to ? fromIsoDate(resolved.to) : undefined }
      : undefined
  return (
    <div className="flex flex-col md:flex-row">
      {presets.length > 0 && (
        <ul aria-label="Preset periods" className="flex flex-wrap gap-1 border-b border-line p-2 md:w-36 md:flex-col md:flex-nowrap md:border-r md:border-b-0">
          {presets.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                aria-pressed={value.preset === p.id}
                onClick={() => onPreset(p)}
                className="w-full rounded-xs px-2 py-1 text-left text-base text-ink-2 transition-colors duration-(--duration-fast) hover:bg-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-ring aria-pressed:bg-selected aria-pressed:text-ink"
              >
                {p.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      <Calendar
        mode="range"
        autoFocus
        numberOfMonths={wide ? 2 : 1}
        showOutsideDays={!wide}
        selected={selected}
        // A no-op onSelect makes the calendar show this component's range; without it react-day-picker keeps its own.
        onSelect={() => {}}
        defaultMonth={resolved.from ? fromIsoDate(resolved.from) : undefined}
        disabled={matchers(rules)}
        modifiers={{ preview: lo && hi ? { from: fromIsoDate(lo), to: fromIsoDate(hi) } : [] }}
        modifiersClassNames={{ preview: "bg-selected" }}
        onDayMouseEnter={(d) => picking && setHover(isoOf(d))}
        onDayFocus={(d) => picking && setHover(isoOf(d))}
        onDayClick={(d, m) => !m.disabled && choose(d)}
        footer={
          <p className="max-w-72 pt-2 text-sm text-ink-2">
            {picking ? "Choose the end date." : rules.unavailableReason ?? (maxDays ? `Up to ${maxDays} days.` : "Choose the start date.")}
          </p>
        }
      />
    </div>
  )
}

/* ---------------------------------------------------------------- DateRangePicker */

type DateRangePickerProps = Unavailable & {
  label: string
  value: DateRangeValue
  onValueChange: (value: DateRangeValue) => void
  /** Preset periods beside the calendar. true uses DATE_PRESETS. */
  presets?: DatePreset[] | boolean
  /** Longest range people can choose, in days, counting both ends. */
  maxDays?: number
  hint?: string
  error?: string
  required?: boolean
  optional?: boolean
  disabled?: boolean
  id?: string
  className?: string
}

/** A from–to range of dates: type both ends, choose them on the calendar, or pick a preset such as Last 30 days. */
export function DateRangePicker({ label, value, onValueChange, presets, maxDays, hint, error, required, optional, disabled, id, className, ...rules }: DateRangePickerProps) {
  const auto = React.useId()
  const fid = id ?? auto
  const list = presets === true ? DATE_PRESETS : presets || []
  const resolved = resolveDateRange(value, list.length ? list : DATE_PRESETS)
  const preset = value.preset ? list.find((p) => p.id === value.preset) : undefined
  const fromRef = React.useRef<HTMLInputElement>(null)
  const [fromText, setFromText] = React.useState(formatDateInput(resolved.from))
  const [toText, setToText] = React.useState(formatDateInput(resolved.to))
  const [typingError, setTypingError] = React.useState<string>()
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
    setFromText(formatDateInput(resolved.from))
    setToText(formatDateInput(resolved.to))
  }, [resolved.from, resolved.to])

  const commit = () => {
    const r = readTyped(fromText, toText)
    if ("bad" in r) return setTypingError(formatHelp(`${r.bad} date`))
    setTypingError(checkRange(r.from, r.to, rules, maxDays))
    setFromText(formatDateInput(r.from))
    setToText(formatDateInput(r.to))
    if (r.from !== (resolved.from ?? null) || r.to !== (resolved.to ?? null) || value.preset) onValueChange({ from: r.from, to: r.to })
  }
  const shown = typingError ?? error
  const msgId = `${fid}-msg`
  const labelId = `${fid}-label`
  const keys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commit()
    if (e.key === "ArrowDown" && e.altKey) {
      e.preventDefault()
      commit()
      setOpen(true)
    }
  }
  const inputClass = "min-w-0 flex-1 tabular"

  return (
    <Field data-invalid={!!shown || undefined} className={cn("gap-2", className)}>
      <Label id={labelId} htmlFor={`${fid}-from`} label={label} required={required} optional={optional} />
      <Popover
        open={open}
        onOpenChange={(o) => {
          setOpen(o)
          if (!o) {
            setFromText(formatDateInput(resolved.from))
            setToText(formatDateInput(resolved.to))
          }
        }}
      >
        <PopoverAnchor asChild>
          <InputGroup data-disabled={disabled || undefined} aria-labelledby={labelId}>
            <InputGroupInput ref={fromRef} id={`${fid}-from`} aria-label={`${label}, from`} inputMode="numeric" autoComplete="off" placeholder="dd/mm/yyyy" value={fromText} disabled={disabled} required={required} aria-invalid={shown ? true : undefined} aria-describedby={msgId} onChange={(e) => setFromText(e.target.value)} onBlur={commit} onKeyDown={keys} className={inputClass} />
            <InputGroupText aria-hidden="true" className="px-1 text-ink-3">to</InputGroupText>
            <InputGroupInput id={`${fid}-to`} aria-label={`${label}, to`} inputMode="numeric" autoComplete="off" placeholder="dd/mm/yyyy" value={toText} disabled={disabled} required={required} aria-invalid={shown ? true : undefined} aria-describedby={msgId} onChange={(e) => setToText(e.target.value)} onBlur={commit} onKeyDown={keys} className={inputClass} />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" aria-label="Choose dates" aria-haspopup="dialog" aria-expanded={open} disabled={disabled} onClick={() => setOpen((o) => !o)}>
                <CalendarDays />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </PopoverAnchor>
        <PopoverContent
          align="end"
          className="w-auto max-w-(--radix-popover-content-available-width) p-0"
          role="dialog"
          aria-label="Choose dates"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => {
            e.preventDefault()
            fromRef.current?.focus()
          }}
        >
          <RangeBody
            value={value}
            presets={list}
            maxDays={maxDays}
            rules={rules}
            onStart={(iso) => {
              setFromText(formatDateInput(iso))
              setToText("")
            }}
            onRange={(from, to) => {
              setTypingError(checkRange(from, to, rules, maxDays))
              onValueChange({ from, to })
              setOpen(false)
            }}
            onPreset={(p) => {
              const r = p.range(new Date())
              setTypingError(checkRange(r.from, r.to, rules, maxDays))
              onValueChange({ ...r, preset: p.id })
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
      <Message id={msgId} error={shown} hint={preset ? `${preset.label}, worked out from today each time.` : hint} />
    </Field>
  )
}

/* ---------------------------------------------------------------- DateFilterPill */

const shortDate = (iso: string, withYear: boolean) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", ...(withYear && { year: "numeric" }) }).format(fromIsoDate(iso))
/** The operator and value a date filter reads as: "is in" "Last 30 days", "is between" "3 Oct – 12 Oct 2026", "is on or after" "3 Oct 2026". */
export function describeDateFilter(value: DateRangeValue, presets: DatePreset[] = DATE_PRESETS): { operator: string; text: string; spoken: string } | null {
  const p = value.preset ? presets.find((x) => x.id === value.preset) : undefined
  if (p) return { operator: "is in", text: p.label, spoken: p.label }
  const { from, to } = value
  if (from && to) {
    const sameYear = from.slice(0, 4) === to.slice(0, 4)
    return { operator: "is between", text: `${shortDate(from, !sameYear)} – ${shortDate(to, true)}`, spoken: `${formatDateLong(from)} and ${formatDateLong(to)}` }
  }
  if (from) return { operator: "is on or after", text: shortDate(from, true), spoken: formatDateLong(from) }
  if (to) return { operator: "is on or before", text: shortDate(to, true), spoken: formatDateLong(to) }
  return null
}
/**
 * A date filter as URL-safe strings, for FilterValue records and the address bar: ["last-30-days"] for a preset,
 * ["2026-10-01", "2026-10-31"] for dates, with "" for an open end.
 */
export const dateFilterToValues = (value: DateRangeValue): string[] =>
  value.preset ? [value.preset] : value.from || value.to ? [value.from ?? "", value.to ?? ""] : []
/** Reads dateFilterToValues back. Anything that isn't a known preset or an ISO date is dropped, so a hand-edited URL can't break the page. */
export function dateFilterFromValues(values: string[] | undefined, presets: DatePreset[] = DATE_PRESETS): DateRangeValue {
  if (!values?.length) return {}
  if (values.length === 1 && presets.some((p) => p.id === values[0])) return { preset: values[0] }
  const ok = (s?: string) => (s && /^\d{4}-\d{2}-\d{2}$/.test(s) && parseDate(s) ? s : null)
  return { from: ok(values[0]), to: ok(values[1]) }
}

type DateFilterPillProps = Unavailable & {
  /** The field filtered, as on the chip: Applied, Closing date. */
  field: string
  value: DateRangeValue
  /** Called when a preset or a range is chosen, or typed dates are applied with Enter. */
  onChange: (value: DateRangeValue) => void
  /** Removes the pill. Without it, a set pill clears its dates instead. */
  onRemove?: () => void
  /** Preset periods. Defaults to DATE_PRESETS; [] shows the calendar only. */
  presets?: DatePreset[]
  maxDays?: number
  defaultOpen?: boolean
}

/**
 * A filter pill for a date field, in a FilterBar beside FilterPill. Reads as a sentence, "Applied is in Last 30 days";
 * dashed while empty. Presets and calendar ranges apply at once; typed dates apply on Enter.
 */
export function DateFilterPill({ field, value, onChange, onRemove, presets = DATE_PRESETS, maxDays, defaultOpen = false, ...rules }: DateFilterPillProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  const d = describeDateFilter(value, presets)
  const remove = onRemove ?? (() => onChange({}))
  const segment = "flex items-center px-2 whitespace-nowrap"
  const focus = "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* The same segmented chip as FilterPill: field | operator | value | remove. */}
      <div
        data-slot="filter-pill"
        data-state={d ? "set" : "empty"}
        className={cn(
          "inline-flex h-7 items-stretch overflow-hidden rounded-sm border text-base transition-colors duration-(--duration-fast) ease-(--ease-out)",
          d ? "divide-x divide-line border-line-strong bg-surface text-ink shadow-xs" : "border-dashed border-line-strong text-ink-2 hover:border-input-hover hover:text-ink"
        )}
      >
        {d ? (
          <>
            <span className={cn(segment, "text-ink-2")}>{field}</span>
            <span className={cn(segment, "text-ink-3")}>{d.operator}</span>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label={`${field} ${d.operator} ${d.spoken}. Change dates`}
                onKeyDown={(e) => { if (e.key === "Backspace" || e.key === "Delete") { e.preventDefault(); remove() } }}
                className={cn(segment, "tabular max-w-56 font-medium transition-colors hover:bg-hover", focus)}
              >
                <span className="truncate">{d.text}</span>
              </button>
            </PopoverTrigger>
            <button type="button" onClick={remove} aria-label={`Remove ${field} filter`} className={cn("grid w-7 place-items-center text-ink-3 transition-colors hover:bg-hover hover:text-ink", focus)}>
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </>
        ) : (
          <PopoverTrigger asChild>
            <button type="button" className={cn("inline-flex items-center gap-1 px-2 whitespace-nowrap", focus)}>
              <Plus className="size-3.5 text-ink-3" aria-hidden="true" />
              {field}
            </button>
          </PopoverTrigger>
        )}
      </div>
      <PopoverContent align="start" role="dialog" aria-label={`${field} dates`} className="w-auto max-w-(--radix-popover-content-available-width) p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DateRangeChooser
          value={value}
          presets={presets}
          maxDays={maxDays}
          {...rules}
          onApply={(next) => {
            onChange(next)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

type DateRangeChooserProps = Unavailable & {
  value: DateRangeValue
  /** Called with a preset, a calendar range or typed dates, once they pass the checks. */
  onApply: (value: DateRangeValue) => void
  presets?: DatePreset[]
  maxDays?: number
  /** Months shown side by side from 768px. One beside a menu; two in a pill. */
  months?: 1 | 2
}

/**
 * The body of a date filter: From and To (applied on Enter or Apply), preset periods and a range calendar.
 * Used inside DateFilterPill and beside FilterButton's field list; put it in a popover, never on the page.
 */
export function DateRangeChooser({ value, onApply, presets = DATE_PRESETS, maxDays, months = 2, ...rules }: DateRangeChooserProps) {
  const auto = React.useId()
  const resolved = resolveDateRange(value, presets.length ? presets : DATE_PRESETS)
  const [fromText, setFromText] = React.useState(formatDateInput(resolved.from))
  const [toText, setToText] = React.useState(formatDateInput(resolved.to))
  const [error, setError] = React.useState<string>()
  const apply = (next: DateRangeValue) => {
    const e = checkRange(next.from, next.to, rules, maxDays)
    if (e) return setError(e)
    onApply(next)
  }
  const applyTyped = () => {
    const r = readTyped(fromText, toText)
    if ("bad" in r) return setError(formatHelp(`${r.bad} date`))
    if (!r.from && !r.to) return setError("Enter a start date, an end date or both.")
    apply({ from: r.from, to: r.to })
  }
  const errId = `${auto}-err`
  return (
    <div data-slot="date-range-chooser">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          applyTyped()
        }}
        className="grid gap-2 border-b border-line p-2"
      >
        <div className="flex items-end gap-2">
          <label className="grid min-w-0 flex-1 gap-1 text-sm text-ink-2">
            From
            <Input value={fromText} onChange={(e) => setFromText(e.target.value)} placeholder="dd/mm/yyyy" inputMode="numeric" autoComplete="off" aria-invalid={error ? true : undefined} aria-describedby={error ? errId : undefined} className="tabular" />
          </label>
          <label className="grid min-w-0 flex-1 gap-1 text-sm text-ink-2">
            To
            <Input value={toText} onChange={(e) => setToText(e.target.value)} placeholder="dd/mm/yyyy" inputMode="numeric" autoComplete="off" aria-invalid={error ? true : undefined} aria-describedby={error ? errId : undefined} className="tabular" />
          </label>
          <Button type="submit" variant="outline">Apply</Button>
        </div>
        {error && (
          <p id={errId} className="flex items-start gap-control text-sm text-bad">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </form>
      <RangeBody
        value={value}
        presets={presets}
        maxDays={maxDays}
        months={months}
        rules={rules}
        onStart={(iso) => {
          setFromText(formatDateInput(iso))
          setToText("")
        }}
        onRange={(from, to) => apply({ from, to })}
        onPreset={(p) => apply({ preset: p.id })}
      />
    </div>
  )
}
