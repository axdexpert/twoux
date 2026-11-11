/**
 * TwoUX compositions for small labels on records.
 * Tag: a category people chose (quieter than a status badge; 4px corners, because pills mean filters).
 * PersonAvatar + AvatarStack: initials on a fixed per-person colour that passes 4.5:1, +N with names.
 * Timestamp: <time> with ISO datetime, relative or absolute, the full date with zone in a tooltip; date-only values (2026-12-07) show as a calendar date with no time or zone.
 * FeatureLabel: the New or Beta label. Plain text in navigation; after a page title it opens a popover on request.
 */
import { X } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/cn"
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "./avatar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

/* ---------------------------------------------------------------- feature label */

/**
 * New or Beta, as words in the accent ink, never a colour, toast or banner. Without children it is plain text
 * (use it inside nav items, which are already buttons). With children it is a button that opens a popover:
 * what changed, for New; that results may change and how to send feedback, for Beta. Remove New after 30 days.
 */
export function FeatureLabel({ kind, children, className }: { kind: "New" | "Beta"; children?: React.ReactNode; className?: string }) {
  const cls = "inline-flex items-center text-xs font-medium text-primary-ink underline decoration-dotted decoration-primary-ink/60 underline-offset-3"
  if (!children) return <span data-slot="feature-label" className={cn(cls, "no-underline", className)}>{kind}</span>
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" data-slot="feature-label" className={cn(cls, "h-6 rounded-xs px-1 hover:bg-primary-soft", className)}>
          {kind}<span className="sr-only">: what this means</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="grid w-72 gap-2 text-base text-ink-2">{children}</PopoverContent>
    </Popover>
  )
}

/* ---------------------------------------------------------------- tag */

export function Tag({ children, color, onRemove, className }: { children: string; color?: string; onRemove?: () => void; className?: string }) {
  return (
    <span data-slot="tag" className={cn("inline-flex h-5.5 max-w-48 items-center gap-control rounded-xs border border-line-strong bg-surface px-control text-sm text-ink", className)}>
      {color && <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-(--tag)" style={{ "--tag": color } as React.CSSProperties} />}
      <span className="truncate" title={children}>{children}</span>
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={`Remove ${children}`} className="relative -mr-0.5 grid size-3.5 shrink-0 place-items-center rounded-xs text-ink-3 after:absolute after:-inset-1 hover:bg-hover hover:text-ink">
          <X className="size-3" aria-hidden="true" />
        </button>
      )}
    </span>
  )
}

/** Up to three tags, then +N with the rest in a tooltip, so table rows stay scannable. */
export function TagList({ tags, max = 3 }: { tags: string[]; max?: number }) {
  const shown = tags.slice(0, max), rest = tags.slice(max)
  return (
    <span className="inline-flex items-center gap-1">
      {shown.map((t) => <Tag key={t}>{t}</Tag>)}
      {rest.length > 0 && (
        <Tooltip>
          <TooltipTrigger asChild><button type="button" className="tabular rounded-xs px-0.5 text-sm text-ink-3 hover:text-ink">+{rest.length}</button></TooltipTrigger>
          <TooltipContent>{rest.join(", ")}</TooltipContent>
        </Tooltip>
      )}
    </span>
  )
}

/* ---------------------------------------------------------------- people */

// 700 steps, each 5.8:1 or more with white initials. Green and red are left out: they mean status.
const PEOPLE = ["indigo", "teal", "magenta", "blue", "orange", "amber"]
/** The same person always gets the same colour. */
export const personColor = (name: string) => `var(--color-${PEOPLE[[...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % PEOPLE.length]}-700)`
export const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("")

export function PersonAvatar({ name, src, size = "default", className }: { name: string; src?: string; size?: "sm" | "default" | "lg"; className?: string }) {
  return (
    <Avatar size={size} className={className} style={{ "--avatar": personColor(name) } as React.CSSProperties}>
      {src && <AvatarImage src={src} alt="" />}
      <AvatarFallback aria-hidden="true">{initials(name)}</AvatarFallback>
      <span className="sr-only">{name}</span>
    </Avatar>
  )
}

export function AvatarStack({ people, max = 3, label = "People" }: { people: { name: string; src?: string }[]; max?: number; label?: string }) {
  const shown = people.slice(0, max), rest = people.slice(max)
  return (
    <AvatarGroup className="*:data-[slot=avatar]:transition-[margin] *:data-[slot=avatar]:duration-(--duration-base) *:data-[slot=avatar]:ease-(--ease-standard) hover:-space-x-0.5" aria-label={`${label}: ${people.map((p) => p.name).join(", ")}`} role="group">
      {shown.map((p) => <PersonAvatar key={p.name} name={p.name} src={p.src} />)}
      {rest.length > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="rounded-full"><AvatarGroupCount className="tabular">+{rest.length}</AvatarGroupCount></button>
          </TooltipTrigger>
          <TooltipContent>{rest.map((p) => p.name).join(", ")}</TooltipContent>
        </Tooltip>
      )}
    </AvatarGroup>
  )
}

/* ---------------------------------------------------------------- time */

const absolute = (d: Date) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" }).format(d)
/** A calendar date with no time or zone: 7 December 2026, or 7 Dec 2026 when short. */
const calendarDate = (d: Date, short: boolean) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: short ? "short" : "long", year: "numeric" }).format(d)
/** Today, tomorrow, in 3 days, 2 days ago, counted in calendar days; past a week, the date. */
function relativeDay(d: Date, now: Date, short: boolean) {
  const days = Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000)
  if (days === 0) return "today"
  if (days === 1) return "tomorrow"
  if (days === -1) return "yesterday"
  const n = Math.abs(days)
  if (n < 7) return days > 0 ? `in ${n}${short ? "d" : " days"}` : `${n}${short ? "d" : " days"} ago`
  return calendarDate(d, true)
}
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/
function relative(d: Date, now: Date, short: boolean) {
  const s = Math.round((now.getTime() - d.getTime()) / 1000)
  const future = s < 0, a = Math.abs(s)
  const unit = (n: number, long: string, abbr: string) => (short ? `${n}${abbr}` : `${n} ${long}${n === 1 ? "" : "s"}`)
  if (a < 60) return future ? "in under a minute" : "just now"
  const v = a < 3600 ? unit(Math.floor(a / 60), "minute", "m") : a < 86400 ? unit(Math.floor(a / 3600), "hour", "h") : a < 86400 * 7 ? unit(Math.floor(a / 86400), "day", "d") : null
  if (!v) return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", ...(d.getFullYear() !== now.getFullYear() && { year: "numeric" }) }).format(d)
  return future ? `in ${v}` : `${v} ago`
}

export function Timestamp({ value, format = "relative", short = false, by, className }: { value: Date | string; format?: "relative" | "absolute" | "date" | "time"; short?: boolean; by?: React.ReactNode; className?: string }) {
  // "time" is the time of day to the second (15:52:56), for live feeds such as trades, where every row is from today.
  // A date with no time (2026-12-07: a deadline, a start date) is a calendar day in local time. new Date() would read it
  // as midnight UTC, show a time and zone that mean nothing, and land on the day before west of London.
  const day = typeof value === "string" ? value.match(DATE_ONLY) : null
  const d = day ? new Date(+day[1], +day[2] - 1, +day[3]) : typeof value === "string" ? new Date(value) : value
  const dateOnly = !!day || format === "date"
  const [now, setNow] = React.useState(() => new Date())
  React.useEffect(() => {
    if (format !== "relative") return
    const t = setInterval(() => setNow(new Date()), 60000) // ticks over once a minute, never announced
    return () => clearInterval(t)
  }, [format])
  const full = dateOnly ? calendarDate(d, false) : absolute(d)
  const text = format === "time" ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : format === "relative" ? (dateOnly ? relativeDay(d, now, short) : relative(d, now, short)) : dateOnly ? calendarDate(d, short) : full
  // The full date shows on hover or keyboard focus only. Focus moved by code (a popover or dialog opening, focus
  // returning after a click) is not :focus-visible, so it never opens the tooltip unasked.
  const timeRef = React.useRef<HTMLTimeElement>(null)
  const hovered = React.useRef(false)
  const [open, setOpen] = React.useState(false)
  const onOpenChange = (o: boolean) => {
    const el = timeRef.current
    if (o && el && document.activeElement === el && !hovered.current && !el.matches(":focus-visible")) return
    setOpen(o)
  }
  return (
    <span className={cn("text-ink-2", className)}>
      <Tooltip open={open} onOpenChange={onOpenChange}>
        <TooltipTrigger asChild>
          <time
            ref={timeRef}
            dateTime={day ? (value as string) : dateOnly ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` : d.toISOString()}
            tabIndex={format === "relative" ? 0 : undefined}
            aria-label={format === "relative" ? `${text}, ${full}` : undefined}
            onPointerEnter={() => { hovered.current = true }}
            onPointerLeave={() => { hovered.current = false }}
            className="tabular rounded-xs"
          >
            {text}
          </time>
        </TooltipTrigger>
        {(format === "relative" || format === "time") && <TooltipContent>{full}</TooltipContent>}
      </Tooltip>
      {by && <span> by {by}</span>}
    </span>
  )
}
