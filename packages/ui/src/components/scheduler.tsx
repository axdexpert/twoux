/**
 * TwoUX Scheduler: interviews, shifts and bookings on a day, week or month grid, adapted from MUI X Scheduler.
 * TwoUX changes to the reference:
 *  - Three views of the same data, switched with SegmentedControl; T, J/K and D/W/M follow Google Calendar's keys
 *  - The grid is one tab stop: arrows walk free times and events in time order, Enter opens an event or adds one at a free time
 *  - Every drag has a keyboard path (Space picks up, arrows move, Shift+arrows change length, Enter drops, Esc cancels)
 *    and a menu path (the event's ⋮: earlier, later, other day, longer, shorter, another resource), WCAG 2.5.7
 *  - Resource colour is a left edge stripe only (seriesColor); text stays ink and the resource is always named in words
 *  - Below 768px the grid becomes an agenda list grouped by day, so it reflows to 320px (WCAG 1.4.10)
 *  - 24-hour UK times, weeks start on Monday, and the time zone is written once in the toolbar
 *  - The app opens events in SidePanel, creates in a small dialog and confirms moves with an Undo toast
 *  - No recurrence editor: the app expands a series into events
 */
import { ChevronLeft, ChevronRight, MoreVertical, RotateCw, AlertCircle, PanelRightOpen, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ArrowDownToLine, ArrowUpToLine, UserRound } from "lucide-react"
import * as React from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "../lib/cn"
import { useShortcut } from "../lib/shortcuts"
import { useWidth } from "../lib/chart-kit"
import { Badge, type badgeVariants } from "./badge"
import { Button } from "./button"
import { seriesColor } from "./charts"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu"
import { Kbd } from "./kbd"
import { Popover, PopoverAnchor, PopoverContent } from "./popover"
import { Segment, SegmentedControl } from "./segmented-control"
import { Skeleton } from "./skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

/* ---------------------------------------------------------------- types */

export type SchedulerView = "day" | "week" | "month"
export type SchedulerEvent = {
  id: string
  title: string
  start: Date | string
  end: Date | string
  /** Person, room or team the event belongs to. Its colour is the stripe; its name is always written. */
  resourceId?: string
  allDay?: boolean
  /** A word, shown in a Badge: Confirmed, Tentative, Cancelled. */
  status?: string
  /** Second line, such as the candidate: “Priya Shah”. */
  detail?: string
}
export type SchedulerResource = { id: string; label: string }
export type SchedulerSlot = { start: Date; end: Date; resourceId?: string }
type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]

/* ---------------------------------------------------------------- dates */

const toDate = (v: Date | string) => (typeof v === "string" ? new Date(v) : v)
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, d.getHours(), d.getMinutes())
const addMin = (d: Date, n: number) => new Date(d.getTime() + n * 60000)
const startOfWeek = (d: Date) => { const s = startOfDay(d); return addDays(s, -((s.getDay() + 6) % 7)) }
const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
const minutesOf = (d: Date) => d.getHours() * 60 + d.getMinutes()
const atMinutes = (day: Date, m: number) => new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(m / 60), m % 60)
const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
const fromKey = (k: string) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d) }

const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", o)
const fTime = f({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
const fDay = f({ weekday: "long", day: "numeric", month: "long" })
const fDayYear = { format: (d: Date) => `${fDay.format(d)} ${d.getFullYear()}` }
const fWeekday = f({ weekday: "short" })
const fMonth = f({ month: "long", year: "numeric" })
const fDayMonth = f({ day: "numeric", month: "long" })

/** 24-hour UK time: “09:30”. */
export const formatTime = (d: Date) => fTime.format(d)
/** “09:30–10:15”, with an en dash. */
export const formatTimeRange = (s: Date, e: Date) => `${formatTime(s)}–${formatTime(e)}`
const timeZoneName = (d: Date) => f({ timeZoneName: "short" }).formatToParts(d).find((p) => p.type === "timeZoneName")?.value ?? ""

function periodLabel(view: SchedulerView, date: Date, days: number) {
  if (view === "day") return fDayYear.format(date)
  if (view === "month") return fMonth.format(date)
  const s = startOfWeek(date), e = addDays(s, days - 1)
  if (s.getMonth() === e.getMonth()) return `${s.getDate()}–${e.getDate()} ${fMonth.format(e)}`
  if (s.getFullYear() === e.getFullYear()) return `${fDayMonth.format(s)} – ${fDayMonth.format(e)} ${e.getFullYear()}`
  return `${fDayMonth.format(s)} ${s.getFullYear()} – ${fDayMonth.format(e)} ${e.getFullYear()}`
}

/** First day shown and the number of days, for a view. */
function rangeOf(view: SchedulerView, date: Date, workWeek: boolean) {
  if (view === "day") return { from: startOfDay(date), count: 1 }
  if (view === "week") return { from: startOfWeek(date), count: workWeek ? 5 : 7 }
  const first = new Date(date.getFullYear(), date.getMonth(), 1)
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const from = startOfWeek(first)
  const weeks = Math.round((startOfWeek(last).getTime() - from.getTime()) / (7 * 86400000)) + 1
  return { from, count: weeks * 7 }
}

function shiftPeriod(view: SchedulerView, date: Date, dir: 1 | -1) {
  if (view === "day") return addDays(date, dir)
  if (view === "week") return addDays(date, 7 * dir)
  return new Date(date.getFullYear(), date.getMonth() + dir, 1)
}

/* ---------------------------------------------------------------- table helper */

/** The same events as a table, for a Table view or an export: date, start, end, event, resource, status. */
export const schedulerTable = (events: SchedulerEvent[], resources: SchedulerResource[] = [], resourceTitle = "Resource") => ({
  columns: ["Date", "Start", "End", "Event", resourceTitle, "Status"],
  rows: [...events]
    .sort((a, b) => toDate(a.start).getTime() - toDate(b.start).getTime())
    .map((e) => {
      const s = toDate(e.start), en = toDate(e.end)
      return [
        fDayYear.format(s),
        e.allDay ? "All day" : formatTime(s),
        e.allDay ? "" : formatTime(en),
        e.detail ? `${e.title}, ${e.detail}` : e.title,
        resources.find((r) => r.id === e.resourceId)?.label ?? "",
        e.status ?? "",
      ]
    }),
})

/* ---------------------------------------------------------------- shared bits */

type Norm = { ev: SchedulerEvent; start: Date; end: Date; resourceId?: string; color: string; resource?: string }
type Move = { id: string; start: Date; end: Date; resourceId?: string }

const stripe = "absolute inset-y-0 left-0 w-1 bg-(--c)"
const evSurface = "rounded-xs border border-line bg-surface shadow-card hover:bg-hover"

function eventLabel(n: Norm) {
  const when = n.ev.allDay ? `${fDay.format(n.start)}, all day` : `${fDay.format(n.start)}, ${formatTimeRange(n.start, n.end)}`
  return [n.ev.title, n.ev.detail, when, n.resource, n.ev.status].filter(Boolean).join(", ")
}

function Stripe({ color }: { color: string }) {
  return <span aria-hidden="true" className={stripe} style={{ "--c": color } as React.CSSProperties} />
}

/** The menu path for every drag: the same moves as the pointer and the keyboard. */
function EventMenu({
  n, slotMinutes, resources, open, onOpenChange, onSelect, onMove, trigger,
}: {
  n: Norm
  slotMinutes: number
  resources: SchedulerResource[]
  open?: boolean
  onOpenChange?: (o: boolean) => void
  onSelect?: (e: SchedulerEvent) => void
  onMove?: (e: SchedulerEvent, to: SchedulerSlot) => void
  trigger: React.ReactNode
}) {
  const move = (dMin: number, dDays: number, dEnd = dMin, resourceId = n.resourceId) =>
    onMove?.(n.ev, { start: addDays(addMin(n.start, dMin), dDays), end: addDays(addMin(n.end, dEnd), dDays), resourceId })
  const dur = (n.end.getTime() - n.start.getTime()) / 60000
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange} modal={false}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {onSelect && <DropdownMenuItem onSelect={() => onSelect(n.ev)}><PanelRightOpen aria-hidden="true" />Open</DropdownMenuItem>}
        {onMove && (
          <>
            {onSelect && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="flex items-center justify-between">Change time <Kbd>Space</Kbd></DropdownMenuLabel>
            {!n.ev.allDay && <DropdownMenuItem onSelect={() => move(-slotMinutes, 0)}><ArrowUp aria-hidden="true" />{slotMinutes} min earlier</DropdownMenuItem>}
            {!n.ev.allDay && <DropdownMenuItem onSelect={() => move(slotMinutes, 0)}><ArrowDown aria-hidden="true" />{slotMinutes} min later</DropdownMenuItem>}
            <DropdownMenuItem onSelect={() => move(0, -1)}><ArrowLeft aria-hidden="true" />Previous day</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => move(0, 1)}><ArrowRight aria-hidden="true" />Next day</DropdownMenuItem>
            {!n.ev.allDay && <DropdownMenuItem onSelect={() => move(0, 0, slotMinutes)}><ArrowDownToLine aria-hidden="true" />{slotMinutes} min longer</DropdownMenuItem>}
            {!n.ev.allDay && dur > slotMinutes && <DropdownMenuItem onSelect={() => move(0, 0, -slotMinutes)}><ArrowUpToLine aria-hidden="true" />{slotMinutes} min shorter</DropdownMenuItem>}
            {resources.filter((r) => r.id !== n.resourceId).length > 0 && <DropdownMenuSeparator />}
            {resources.filter((r) => r.id !== n.resourceId).map((r) => (
              <DropdownMenuItem key={r.id} onSelect={() => move(0, 0, 0, r.id)}><UserRound aria-hidden="true" />Move to {r.label}</DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ---------------------------------------------------------------- layout */

type Placed = Norm & { top: number; height: number; lane: number; lanes: number; startSlot: number }

/** Side-by-side lanes for overlapping events, cluster by cluster. */
function place(list: Norm[], dayStartMin: number, dayEndMin: number, slotMinutes: number, slotPx: number): Placed[] {
  const sorted = [...list].sort((a, b) => a.start.getTime() - b.start.getTime() || b.end.getTime() - a.end.getTime())
  const out: Placed[] = []
  let cluster: Placed[] = [], laneEnds: number[] = [], clusterEnd = -Infinity
  const close = () => { cluster.forEach((p) => (p.lanes = laneEnds.length)); cluster = []; laneEnds = []; clusterEnd = -Infinity }
  for (const n of sorted) {
    const s = Math.max(dayStartMin, minutesOf(n.start)), e = Math.min(dayEndMin, Math.max(s + slotMinutes / 2, minutesOf(n.end) || 24 * 60))
    if (s >= dayEndMin || e <= dayStartMin) continue
    if (s >= clusterEnd && cluster.length) close()
    let lane = laneEnds.findIndex((le) => le <= s)
    if (lane < 0) { lane = laneEnds.length; laneEnds.push(e) } else laneEnds[lane] = e
    const p: Placed = { ...n, top: ((s - dayStartMin) / slotMinutes) * slotPx, height: Math.max(slotPx - 2, ((e - s) / slotMinutes) * slotPx - 2), lane, lanes: 1, startSlot: Math.min(Math.floor((s - dayStartMin) / slotMinutes), Math.round((dayEndMin - dayStartMin) / slotMinutes) - 1) }
    cluster.push(p); out.push(p); clusterEnd = Math.max(clusterEnd, e)
  }
  close()
  return out
}

const SLOT_PX = 24

/* ---------------------------------------------------------------- scheduler */

export function Scheduler({
  events,
  resources = [],
  view,
  onViewChange,
  date,
  onDateChange,
  onSelectEvent,
  onCreate,
  onMove,
  selectedId,
  status = "ready",
  onRetry,
  layout = "auto",
  dayStart = 8,
  dayEnd = 18,
  slotMinutes = 30,
  createMinutes = 60,
  workWeek = false,
  now: nowProp,
  height = 520,
  noun = "events",
  resourceTitle = "Resource",
  statusVariant,
  className,
  "aria-label": label,
}: {
  events: SchedulerEvent[]
  /** People, rooms or teams. Day view shows one column each; other views mark them with a stripe and their name. */
  resources?: SchedulerResource[]
  view: SchedulerView
  onViewChange: (v: SchedulerView) => void
  /** Any day inside the period shown. */
  date: Date
  onDateChange: (d: Date) => void
  /** Open the event, usually in SidePanel. */
  onSelectEvent?: (e: SchedulerEvent) => void
  /** A free time was clicked or chosen with Enter: open a small create dialog. Omit for a read-only schedule. */
  onCreate?: (slot: SchedulerSlot) => void
  /** Drag, keyboard or menu moved or resized an event. Apply it and confirm with an Undo toast. Omit to turn moving off. */
  onMove?: (e: SchedulerEvent, to: SchedulerSlot) => void
  selectedId?: string
  status?: "ready" | "loading" | "error"
  onRetry?: () => void
  /** auto: the grid from 768px, the agenda list below. */
  layout?: "auto" | "grid" | "agenda"
  /** Hours shown in day and week views, 24-hour. */
  dayStart?: number
  dayEnd?: number
  slotMinutes?: number
  /** Length of an event created from a free time. */
  createMinutes?: number
  /** Monday to Friday only. */
  workWeek?: boolean
  /** For tests and demos; defaults to the real time, updated each minute. */
  now?: Date
  height?: number
  /** Plural noun for the empty message: “interviews”. */
  noun?: string
  /** Column title for resources in the table helper and the agenda, such as “Interviewer”. */
  resourceTitle?: string
  statusVariant?: (status: string) => BadgeVariant
  className?: string
  "aria-label": string
}) {
  const [wrap, width] = useWidth<HTMLElement>()
  const [liveNow, setLiveNow] = React.useState(() => new Date())
  React.useEffect(() => {
    if (nowProp) return
    const t = setInterval(() => setLiveNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [nowProp])
  const now = nowProp ?? liveNow
  const agenda = layout === "agenda" || (layout === "auto" && width > 0 && width < 768)
  const days = workWeek ? 5 : 7
  const unit = view === "day" ? "day" : view === "week" ? "week" : "month"
  const [announce, setAnnounce] = React.useState("")

  const resIndex = (id?: string) => resources.findIndex((r) => r.id === id)
  const norm: Norm[] = React.useMemo(() => events.map((ev) => {
    const i = resIndex(ev.resourceId)
    return { ev, start: toDate(ev.start), end: toDate(ev.end), resourceId: ev.resourceId, color: seriesColor(Math.max(0, i)), resource: i >= 0 ? resources[i].label : undefined }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [events, resources])

  const { from, count } = rangeOf(view, date, workWeek)
  const rangeDays = Array.from({ length: count }, (_, i) => addDays(from, i)).filter((d) => !workWeek || (d.getDay() !== 0 && d.getDay() !== 6))
  const inRange = norm.filter((n) => rangeDays.some((d) => sameDay(d, n.start)) && (view !== "month" || n.start.getMonth() === date.getMonth()))
  const emptyText = `No ${noun} this ${unit}`

  const go = (d: Date) => onDateChange(d)
  const viewRefs = { day: React.useRef<HTMLButtonElement>(null), week: React.useRef<HTMLButtonElement>(null), month: React.useRef<HTMLButtonElement>(null) }
  useShortcut("D", viewRefs.day)
  useShortcut("W", viewRefs.week)
  useShortcut("M", viewRefs.month)

  const toolbar = (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-line px-3 py-2">
      <Button variant="outline" size="sm" shortcut="T" onClick={() => go(now)}>Today</Button>
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" shortcut="K" aria-label={`Previous ${unit}`} onClick={() => go(shiftPeriod(view, date, -1))}><ChevronLeft className="size-4" /></Button>
          </TooltipTrigger>
          <TooltipContent>Previous {unit} <Kbd>K</Kbd></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" shortcut="J" aria-label={`Next ${unit}`} onClick={() => go(shiftPeriod(view, date, 1))}><ChevronRight className="size-4" /></Button>
          </TooltipTrigger>
          <TooltipContent>Next {unit} <Kbd>J</Kbd></TooltipContent>
        </Tooltip>
      </div>
      <h2 aria-live="polite" className="min-w-0 text-md font-semibold text-ink">{periodLabel(view, date, days)}</h2>
      <span className="text-sm text-ink-3">Times in {timeZoneName(date)}</span>
      <SegmentedControl value={view} onValueChange={(v) => onViewChange(v as SchedulerView)} size="sm" aria-label="View" className="ml-auto">
        {/* Tooltip sits on the label, not the segment: a trigger would overwrite the segment's data-state */}
        {(["day", "week", "month"] as const).map((v) => (
          <Segment key={v} ref={viewRefs[v]} value={v} aria-keyshortcuts={v[0].toUpperCase()}>
            <Tooltip>
              <TooltipTrigger asChild><span>{v[0].toUpperCase() + v.slice(1)}</span></TooltipTrigger>
              <TooltipContent>{v[0].toUpperCase() + v.slice(1)} view <Kbd>{v[0].toUpperCase()}</Kbd></TooltipContent>
            </Tooltip>
          </Segment>
        ))}
      </SegmentedControl>
    </div>
  )

  const legend = resources.length > 1 && !(view === "day" && !agenda) && (
    <ul aria-label={`${resourceTitle}s`} className="flex flex-wrap gap-x-4 gap-y-1 border-b border-line px-3 py-2">
      {resources.map((r, i) => (
        <li key={r.id} className="relative inline-flex items-center pl-2 text-sm text-ink-2">
          <span aria-hidden="true" className="absolute inset-y-0.5 left-0 w-1 rounded-full bg-(--c)" style={{ "--c": seriesColor(i) } as React.CSSProperties} />
          {r.label}
        </li>
      ))}
    </ul>
  )

  const shared = { norm, inRange, resources, onSelectEvent, onCreate, onMove, selectedId, slotMinutes, statusVariant, setAnnounce }

  let body: React.ReactNode
  if (status === "loading") {
    body = (
      <div aria-busy="true" aria-label={`Loading ${label.toLowerCase()}`} className="grid gap-2 p-3">
        {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-10" />)}
      </div>
    )
  } else if (status === "error") {
    body = (
      <div className="grid place-items-center gap-2 px-4 py-12 text-center">
        <AlertCircle className="size-4 text-bad" aria-hidden="true" />
        <p className="text-base font-medium text-ink">Couldn't load {label.toLowerCase()}. Check your connection, then try again.</p>
        {onRetry && <Button variant="outline" size="sm" onClick={onRetry}><RotateCw />Try again</Button>}
      </div>
    )
  } else if (agenda) {
    body = <Agenda {...shared} days={rangeDays.filter((d) => view !== "month" || d.getMonth() === date.getMonth())} now={now} emptyText={emptyText} resourceTitle={resourceTitle} />
  } else if (view === "month") {
    body = <MonthGrid {...shared} date={date} from={from} count={count} workWeek={workWeek} now={now} createMinutes={createMinutes} dayStart={dayStart} onOpenDay={(d) => { onDateChange(d); onViewChange("day") }} label={label} />
  } else {
    const cols: Col[] = view === "day" && resources.length
      ? resources.map((r, i) => ({ key: r.id, day: startOfDay(date), resourceId: r.id, title: r.label, color: seriesColor(i) }))
      : rangeDays.map((d) => ({ key: dayKey(d), day: d, title: fWeekday.format(d), num: d.getDate() }))
    body = (
      <TimeGrid
        {...shared}
        cols={cols}
        byResource={view === "day" && resources.length > 0}
        dayStart={dayStart}
        dayEnd={dayEnd}
        createMinutes={createMinutes}
        now={now}
        height={height}
        label={`${label}, ${periodLabel(view, date, days)}`}
        onPeriod={(dir) => go(shiftPeriod(view, date, dir))}
      />
    )
  }

  return (
    <section ref={wrap} aria-label={label} data-slot="scheduler" className={cn("relative grid min-w-0 overflow-hidden rounded-sm border border-line bg-surface", className)}>
      {toolbar}
      {status === "ready" && legend}
      {status === "ready" && !agenda && inRange.length === 0 && <p role="status" className="border-b border-line px-3 py-2 text-sm text-ink-2">{emptyText}{onCreate ? ". Choose a free time to add one." : "."}</p>}
      {body}
      <div aria-live="polite" className="sr-only">{announce}</div>
    </section>
  )
}

type Shared = {
  norm: Norm[]
  inRange: Norm[]
  resources: SchedulerResource[]
  onSelectEvent?: (e: SchedulerEvent) => void
  onCreate?: (slot: SchedulerSlot) => void
  onMove?: (e: SchedulerEvent, to: SchedulerSlot) => void
  selectedId?: string
  slotMinutes: number
  statusVariant?: (s: string) => BadgeVariant
  setAnnounce: (s: string) => void
}

/* ---------------------------------------------------------------- time grid (day, week) */

type Col = { key: string; day: Date; resourceId?: string; title: string; num?: number; color?: string }
type Stop = { key: string; slot: number; evId?: string }

function TimeGrid({
  norm, resources, onSelectEvent, onCreate, onMove, selectedId, slotMinutes, statusVariant, setAnnounce,
  cols, byResource, dayStart, dayEnd, createMinutes, now, height, label, onPeriod,
}: Shared & { cols: Col[]; byResource: boolean; dayStart: number; dayEnd: number; createMinutes: number; now: Date; height: number; label: string; onPeriod: (dir: 1 | -1) => void }) {
  const d0 = dayStart * 60, d1 = dayEnd * 60
  const nSlots = Math.round((d1 - d0) / slotMinutes)
  const [moving, setMoving] = React.useState<(Move & { via: "key" | "pointer" }) | null>(null)
  const [menuFor, setMenuFor] = React.useState<string | null>(null)
  const gridRef = React.useRef<HTMLDivElement>(null)
  const focusNext = React.useRef(false)
  const drag = React.useRef<{ id: string; mode: "move" | "resize"; x: number; y: number; offset: number; started: boolean } | null>(null)

  const effective = (n: Norm): Norm => (moving && moving.id === n.ev.id ? { ...n, start: moving.start, end: moving.end, resourceId: moving.resourceId, color: byResource || !moving.resourceId ? n.color : seriesColor(Math.max(0, resources.findIndex((r) => r.id === moving.resourceId))), resource: resources.find((r) => r.id === moving.resourceId)?.label ?? n.resource } : n)
  const all = norm.map(effective)
  const inCol = (c: Col, n: Norm) => sameDay(n.start, c.day) && (!byResource || n.resourceId === c.resourceId)
  const placedBy = cols.map((c) => place(all.filter((n) => !n.ev.allDay && inCol(c, n)), d0, d1, slotMinutes, SLOT_PX))
  const allDayBy = cols.map((c) => all.filter((n) => n.ev.allDay && inCol(c, n)))
  const hasAllDay = allDayBy.some((l) => l.length)

  const stopsBy: Stop[][] = cols.map((_, ci) => {
    const s: Stop[] = allDayBy[ci].map((n) => ({ key: `e:${n.ev.id}`, slot: -1, evId: n.ev.id }))
    for (let i = 0; i < nSlots; i++) {
      s.push({ key: `s:${i}`, slot: i })
      placedBy[ci].filter((p) => p.startSlot === i).forEach((p) => s.push({ key: `e:${p.ev.id}`, slot: i, evId: p.ev.id }))
    }
    return s
  })

  const todayCol = cols.findIndex((c) => sameDay(c.day, now))
  const nowSlot = Math.max(0, Math.min(nSlots - 1, Math.floor((minutesOf(now) - d0) / slotMinutes)))
  const defaultCursor = { col: Math.max(0, todayCol), key: `s:${todayCol >= 0 ? nowSlot : Math.min(nSlots - 1, Math.max(0, Math.floor((9 * 60 - d0) / slotMinutes)))}` }
  const [cursorState, setCursor] = React.useState(defaultCursor)
  const cursor = cursorState.col < cols.length && stopsBy[cursorState.col]?.some((s) => s.key === cursorState.key) ? cursorState : defaultCursor

  React.useEffect(() => {
    if (!focusNext.current) return
    focusNext.current = false
    gridRef.current?.querySelector<HTMLElement>(`[data-stop="${cursor.col}|${cursor.key}"]`)?.focus()
  })

  const slotTime = (c: Col, i: number) => atMinutes(c.day, d0 + i * slotMinutes)
  const findN = (id: string) => norm.find((n) => n.ev.id === id)
  const describe = (m: Move) => {
    const res = resources.find((r) => r.id === m.resourceId)?.label
    return `${formatTimeRange(m.start, m.end)} ${fDay.format(m.start)}${res ? `, ${res}` : ""}`
  }
  const commit = (m: Move) => {
    const n = findN(m.id)
    setMoving(null)
    if (!n) return
    if (m.start.getTime() === n.start.getTime() && m.end.getTime() === n.end.getTime() && m.resourceId === n.resourceId) { setAnnounce(`${n.ev.title} not moved.`); return }
    setAnnounce(`${n.ev.title} moved to ${describe(m)}.`)
    onMove?.(n.ev, { start: m.start, end: m.end, resourceId: m.resourceId })
  }
  const create = (c: Col, i: number) => {
    const start = slotTime(c, i)
    onCreate?.({ start, end: addMin(start, createMinutes), resourceId: c.resourceId })
  }
  const colOf = (m: Move) => cols.findIndex((c) => sameDay(c.day, m.start) && (!byResource || c.resourceId === m.resourceId))

  const onKeyDown = (e: React.KeyboardEvent) => {
    const stops = stopsBy[cursor.col] ?? []
    const idx = stops.findIndex((s) => s.key === cursor.key)
    const cur = stops[idx]
    const to = (col: number, key: string) => { e.preventDefault(); focusNext.current = true; setCursor({ col, key }) }
    if (moving && moving.via === "key") {
      const n = findN(moving.id)
      if (!n) return
      const dur = moving.end.getTime() - moving.start.getTime()
      const clampMove = (m: Move): Move => {
        const sm = minutesOf(m.start), em = sm + (m.end.getTime() - m.start.getTime()) / 60000
        if (sm < d0) return { ...m, start: atMinutes(m.start, d0), end: addMin(atMinutes(m.start, d0), (em - sm)) }
        if (em > d1) return { ...m, start: addMin(atMinutes(m.start, d1), -(em - sm)), end: atMinutes(m.start, d1) }
        return m
      }
      let next: Move | null = null
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        const d = e.key === "ArrowUp" ? -slotMinutes : slotMinutes
        if (e.shiftKey) {
          const end = addMin(moving.end, d)
          if ((end.getTime() - moving.start.getTime()) / 60000 >= slotMinutes && minutesOf(end) <= d1 && minutesOf(end) > 0) next = { ...moving, end }
        } else next = clampMove({ ...moving, start: addMin(moving.start, d), end: addMin(moving.start, d + dur / 60000) })
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const dir = e.key === "ArrowLeft" ? -1 : 1
        if (byResource) {
          const ri = resources.findIndex((r) => r.id === moving.resourceId) + dir
          if (ri >= 0 && ri < resources.length) next = { ...moving, resourceId: resources[ri].id }
        } else {
          const ci = colOf(moving) + dir
          if (ci >= 0 && ci < cols.length) { const day = cols[ci].day; next = { ...moving, start: atMinutes(day, minutesOf(moving.start)), end: addMin(atMinutes(day, minutesOf(moving.start)), dur / 60000) } }
        }
      } else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); focusNext.current = true; commit(moving); return }
      else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); setMoving(null); focusNext.current = true; setAnnounce(`Move cancelled. ${n.ev.title} is back at ${describe({ id: n.ev.id, start: n.start, end: n.end, resourceId: n.resourceId })}.`); return }
      else if (e.key === "Tab") { setMoving(null); return }
      if (next) {
        e.preventDefault()
        setMoving({ ...next, via: "key" })
        const ci = colOf(next)
        if (ci >= 0) { focusNext.current = true; setCursor({ col: ci, key: `e:${moving.id}` }) }
        setAnnounce(describe(next))
      } else if (e.key.startsWith("Arrow")) e.preventDefault()
      return
    }
    if (!cur) return
    if (e.key === "ArrowDown" && idx < stops.length - 1) to(cursor.col, stops[idx + 1].key)
    else if (e.key === "ArrowUp" && idx > 0) to(cursor.col, stops[idx - 1].key)
    else if ((e.key === "ArrowLeft" && cursor.col > 0) || (e.key === "ArrowRight" && cursor.col < cols.length - 1)) {
      const col = cursor.col + (e.key === "ArrowLeft" ? -1 : 1)
      to(col, `s:${Math.max(0, cur.slot)}`)
    } else if (e.key === "Home") to(cursor.col, stops[0].key)
    else if (e.key === "End") to(cursor.col, stops[stops.length - 1].key)
    else if (e.key === "PageUp" || e.key === "PageDown") { e.preventDefault(); onPeriod(e.key === "PageUp" ? -1 : 1) }
    else if (e.key === "Enter") {
      e.preventDefault()
      if (cur.evId) { const n = findN(cur.evId); if (n) onSelectEvent?.(n.ev) } else create(cols[cursor.col], cur.slot)
    } else if (e.key === " ") {
      e.preventDefault()
      const n = cur.evId ? findN(cur.evId) : null
      if (n && onMove && !n.ev.allDay) {
        setMoving({ id: n.ev.id, start: n.start, end: n.end, resourceId: n.resourceId, via: "key" })
        setAnnounce(`Picked up ${n.ev.title}, ${describe({ id: n.ev.id, start: n.start, end: n.end, resourceId: n.resourceId })}. Arrow keys move it, Shift and up or down change its length, Enter drops it, Esc cancels.`)
      } else if (!cur.evId) create(cols[cursor.col], cur.slot)
    } else if ((e.key === "F10" && e.shiftKey) || e.key === "ContextMenu") {
      if (cur.evId) { e.preventDefault(); setMenuFor(cur.evId) }
    }
  }

  /* pointer: drag to move, bottom edge to resize; a press without movement is a click */
  const targetAt = (x: number, y: number) => {
    const el = document.elementsFromPoint(x, y).find((n) => (n as HTMLElement).dataset?.col !== undefined) as HTMLElement | undefined
    if (!el) return null
    const ci = Number(el.dataset.col), r = el.getBoundingClientRect()
    return { ci, min: d0 + Math.floor((y - r.top) / SLOT_PX) * slotMinutes }
  }
  const onPointerDown = (e: React.PointerEvent, n: Norm, mode: "move" | "resize") => {
    if (e.button !== 0 || !onMove) return
    e.stopPropagation()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    const t = targetAt(e.clientX, e.clientY)
    drag.current = { id: n.ev.id, mode, x: e.clientX, y: e.clientY, offset: t ? t.min - minutesOf(n.start) : 0, started: false }
  }
  const onPointerMove = (e: React.PointerEvent, n: Norm) => {
    const d = drag.current
    if (!d || d.id !== n.ev.id) return
    if (!d.started && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 4) return
    d.started = true
    const t = targetAt(e.clientX, e.clientY)
    if (!t) return
    const c = cols[t.ci]
    const dur = (n.end.getTime() - n.start.getTime()) / 60000
    if (d.mode === "resize") {
      const endMin = Math.min(d1, Math.max(minutesOf(n.start) + slotMinutes, t.min + slotMinutes))
      setMoving({ id: n.ev.id, start: n.start, end: atMinutes(n.start, endMin), resourceId: n.resourceId, via: "pointer" })
    } else {
      const sMin = Math.max(d0, Math.min(d1 - dur, Math.round((t.min - d.offset) / slotMinutes) * slotMinutes))
      const start = atMinutes(c.day, sMin)
      setMoving({ id: n.ev.id, start, end: addMin(start, dur), resourceId: byResource ? c.resourceId : n.resourceId, via: "pointer" })
    }
  }
  const onPointerUp = (n: Norm) => {
    const d = drag.current
    drag.current = null
    if (!d) return
    if (d.started && moving) commit(moving)
    else { setMoving(null); onSelectEvent?.(n.ev) }
  }

  const gridCols = `4rem repeat(${cols.length}, minmax(${byResource ? "8rem" : "6.5rem"}, 1fr))`
  const nowTop = ((minutesOf(now) - d0) / slotMinutes) * SLOT_PX
  const showNow = todayCol >= 0 && minutesOf(now) >= d0 && minutesOf(now) < d1
  const helpId = React.useId()

  const eventBlock = (p: Placed | Norm, ci: number, allDay = false) => {
    const pl = p as Placed
    const id = p.ev.id
    const isCur = cursor.col === ci && cursor.key === `e:${id}`
    const isMoving = moving?.id === id
    const h = allDay ? SLOT_PX : pl.height
    const pos = allDay ? undefined : ({ "--c": p.color, "--t": `${pl.top}px`, "--h": `${pl.height}px`, "--l": `${(pl.lane / pl.lanes) * 100}%`, "--w": `calc(${100 / pl.lanes}% - 4px)` } as React.CSSProperties)
    return (
      <div
        key={id}
        className={cn("group/ev", allDay ? "relative" : "absolute top-(--t) left-(--l) h-(--h) w-(--w)", isMoving && "z-20")}
        style={allDay ? ({ "--c": p.color } as React.CSSProperties) : pos}
      >
        <div
          role="button"
          tabIndex={isCur ? 0 : -1}
          data-stop={`${ci}|e:${id}`}
          aria-label={eventLabel(p)}
          aria-pressed={selectedId === id || undefined}
          aria-describedby={helpId}
          onFocus={() => setCursor({ col: ci, key: `e:${id}` })}
          onPointerDown={(e) => !allDay && onPointerDown(e, p, "move")}
          onPointerMove={(e) => onPointerMove(e, p)}
          onPointerUp={() => onPointerUp(p)}
          onPointerCancel={() => { drag.current = null; setMoving(null) }}
          onClick={() => { if (allDay || !onMove) onSelectEvent?.(p.ev) }}
          className={cn(
            "relative flex size-full min-w-0 touch-none flex-col overflow-hidden py-0.5 pr-6 pl-2 text-left text-sm outline-none select-none",
            evSurface,
            onMove && !allDay ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
            selectedId === id && "bg-selected hover:bg-selected",
            isMoving && "shadow-pop ring-2 ring-primary",
            "focus-visible:ring-2 focus-visible:ring-primary",
          )}
        >
          <Stripe color={p.color} />
          {h < 40 || allDay ? (
            <span className="truncate text-ink"><span className="tabular text-ink-2">{allDay ? "" : `${formatTime(p.start)} `}</span><span className="font-medium">{p.ev.title}</span>{p.ev.detail && <span className="text-ink-2">, {p.ev.detail}</span>}</span>
          ) : (
            <>
              <span className="truncate font-medium text-ink">{p.ev.title}</span>
              {p.ev.detail && h >= 56 && <span className="truncate text-ink">{p.ev.detail}</span>}
              <span className="tabular truncate text-ink-2">{formatTimeRange(p.start, p.end)}{!byResource && p.resource ? ` · ${p.resource}` : ""}</span>
              {p.ev.status && h >= 88 && <Badge variant={statusVariant?.(p.ev.status) ?? "secondary"} className="mt-0.5">{p.ev.status}</Badge>}
            </>
          )}
          {onMove && !allDay && (
            <span
              aria-hidden="true"
              onPointerDown={(e) => onPointerDown(e, p, "resize")}
              className="absolute inset-x-0 bottom-0 h-1.5 cursor-ns-resize"
            />
          )}
        </div>
        {(onMove || onSelectEvent) && (
          <EventMenu
            n={p}
            slotMinutes={slotMinutes}
            resources={resources}
            open={menuFor === id}
            onOpenChange={(o) => setMenuFor(o ? id : null)}
            onSelect={onSelectEvent}
            onMove={onMove}
            trigger={
              <Button
                variant="ghost"
                size="icon-xs"
                tabIndex={-1}
                aria-label={`Actions for ${p.ev.title}`}
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute top-0.5 right-0.5 opacity-0 group-hover/ev:opacity-100 group-focus-within/ev:opacity-100 pointer-coarse:opacity-100 data-[state=open]:opacity-100"
              >
                <MoreVertical className="size-3.5 text-ink-3" />
              </Button>
            }
          />
        )}
      </div>
    )
  }

  return (
    <div className="max-h-(--sh) overflow-auto" style={{ "--sh": `${height}px` } as React.CSSProperties}>
      <span id={helpId} className="sr-only">
        Arrow keys move between times and events. Enter opens an event{onCreate ? " or adds one at a free time" : ""}.{onMove ? " Space picks an event up to move it; Shift+F10 opens its menu." : ""} Page up and Page down change the period.
      </span>
      <div
        ref={gridRef}
        role="group"
        aria-roledescription="schedule"
        aria-label={label}
        onKeyDown={onKeyDown}
        onBlur={(e) => { if (moving?.via === "key" && !e.currentTarget.contains(e.relatedTarget as Node)) setMoving(null) }}
        className="grid min-w-fit grid-cols-(--cols)"
        style={{ "--cols": gridCols } as React.CSSProperties}
      >
        {/* header */}
        <div className="sticky top-0 z-30 col-span-full grid grid-cols-subgrid border-b border-line bg-surface">
          <div aria-hidden="true" />
          {cols.map((c) => {
            const today = !byResource && sameDay(c.day, now)
            return (
              <div key={c.key} className="relative flex min-w-0 items-center gap-control border-l border-line px-2 py-2 text-sm">
                {byResource ? (
                  <>
                    <span aria-hidden="true" className="h-3 w-1 shrink-0 rounded-full bg-(--c)" style={{ "--c": c.color } as React.CSSProperties} />
                    <span className="truncate font-medium text-ink">{c.title}</span>
                  </>
                ) : (
                  <>
                    <span className="text-ink-2">{c.title}</span>
                    <span className={cn("tabular grid h-5 min-w-5 place-items-center rounded-xs px-1 font-medium", today ? "bg-primary text-primary-foreground" : "text-ink")}>{c.num}</span>
                    {today && <span className="sr-only">, today</span>}
                  </>
                )}
              </div>
            )
          })}
          {hasAllDay && (
            <>
              <div className="border-t border-line px-1 py-1 text-right text-xs text-ink-3">All day</div>
              {cols.map((c, ci) => (
                <div key={c.key} className="grid min-w-0 content-start gap-0.5 border-t border-l border-line p-0.5">
                  {allDayBy[ci].map((n) => eventBlock(n, ci, true))}
                </div>
              ))}
            </>
          )}
        </div>

        {/* gutter */}
        <div aria-hidden="true" className="relative h-(--bh)" style={{ "--bh": `${nSlots * SLOT_PX}px` } as React.CSSProperties}>
          {Array.from({ length: nSlots }, (_, i) => i).filter((i) => (d0 + i * slotMinutes) % 60 === 0).map((i) => (
            <span key={i} className="tabular absolute right-2 top-(--y) text-xs text-ink-3" style={{ "--y": `${i * SLOT_PX + 2}px` } as React.CSSProperties}>{formatTime(atMinutes(new Date(2000, 0, 1), d0 + i * slotMinutes))}</span>
          ))}
          {showNow && (
            <span className="tabular absolute right-1 top-(--y) z-10 -translate-y-1/2 rounded-xs bg-surface px-0.5 text-xs font-medium whitespace-nowrap text-primary-ink" style={{ "--y": `${nowTop}px` } as React.CSSProperties}>
              Now {formatTime(now)}
            </span>
          )}
        </div>

        {/* columns */}
        {cols.map((c, ci) => (
          <div key={c.key} data-col={ci} className="relative border-l border-line">
            {Array.from({ length: nSlots }, (_, i) => {
              const key = `s:${i}`
              const st = slotTime(c, i)
              const busy = placedBy[ci].filter((p) => minutesOf(p.start) < d0 + (i + 1) * slotMinutes && minutesOf(p.end) > d0 + i * slotMinutes)
              const hour = (d0 + (i + 1) * slotMinutes) % 60 === 0
              return (
                <div
                  key={key}
                  role="button"
                  tabIndex={cursor.col === ci && cursor.key === key ? 0 : -1}
                  data-stop={`${ci}|${key}`}
                  aria-label={`${formatTime(st)}, ${fDay.format(st)}${byResource ? `, ${c.title}` : ""}, ${busy.length ? `during ${busy.map((b) => b.ev.title).join(" and ")}` : "free"}`}
                  aria-describedby={helpId}
                  onFocus={() => setCursor({ col: ci, key })}
                  onClick={() => { setCursor({ col: ci, key }); create(c, i) }}
                  className={cn(
                    "h-6 border-b outline-none focus-visible:relative focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
                    hour ? "border-line" : "border-line border-dashed",
                    onCreate ? "cursor-cell hover:bg-hover" : "cursor-default",
                  )}
                />
              )
            })}
            {sameDay(c.day, now) && showNow && (
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-(--y) z-10 h-0.5 bg-primary" style={{ "--y": `${nowTop - 1}px` } as React.CSSProperties}>
                <span className="absolute -top-1 -left-1 size-2.5 rounded-full bg-primary" />
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 right-1 left-0.5 *:pointer-events-auto">
              {placedBy[ci].map((p) => eventBlock(p, ci))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- month */

function MonthGrid({
  inRange, resources, onSelectEvent, onCreate, onMove, selectedId, slotMinutes, statusVariant, setAnnounce,
  date, from, count, workWeek, now, createMinutes, dayStart, onOpenDay, label,
}: Shared & { date: Date; from: Date; count: number; workWeek: boolean; now: Date; createMinutes: number; dayStart: number; onOpenDay: (d: Date) => void; label: string }) {
  const perRow = workWeek ? 5 : 7
  const allDays = Array.from({ length: count }, (_, i) => addDays(from, i)).filter((d) => !workWeek || (d.getDay() !== 0 && d.getDay() !== 6))
  const weeks = Array.from({ length: allDays.length / perRow }, (_, w) => allDays.slice(w * perRow, w * perRow + perRow))
  const byDay = (d: Date) => inRange.filter((n) => sameDay(n.start, d)).sort((a, b) => Number(!a.ev.allDay) - Number(!b.ev.allDay) || a.start.getTime() - b.start.getTime())
  const nowInMonth = now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear()
  const initial = allDays.findIndex((d) => sameDay(d, nowInMonth ? now : new Date(date.getFullYear(), date.getMonth(), 1)))
  const [cursorState, setCursor] = React.useState(Math.max(0, initial))
  const cursor = cursorState < allDays.length ? cursorState : Math.max(0, initial)
  const [openDay, setOpenDay] = React.useState<string | null>(null)
  const gridRef = React.useRef<HTMLDivElement>(null)
  const focusNext = React.useRef(false)
  const drag = React.useRef<{ id: string; x: number; y: number; started: boolean; over?: string } | null>(null)
  const [dropKey, setDropKey] = React.useState<string | null>(null)
  React.useEffect(() => {
    if (!focusNext.current) return
    focusNext.current = false
    gridRef.current?.querySelector<HTMLElement>(`[data-cell="${cursor}"]`)?.focus()
  })
  // keep the cursor inside the month shown
  React.useEffect(() => { setCursor(Math.max(0, initial)) }, [date.getMonth(), date.getFullYear()]) // eslint-disable-line react-hooks/exhaustive-deps

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (openDay) return
    const to = (i: number) => { e.preventDefault(); if (i >= 0 && i < allDays.length) { focusNext.current = true; setCursor(i) } }
    if (e.key === "ArrowRight") to(cursor + 1)
    else if (e.key === "ArrowLeft") to(cursor - 1)
    else if (e.key === "ArrowDown") to(cursor + perRow)
    else if (e.key === "ArrowUp") to(cursor - perRow)
    else if (e.key === "Home") to(cursor - (cursor % perRow))
    else if (e.key === "End") to(cursor - (cursor % perRow) + perRow - 1)
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpenDay(dayKey(allDays[cursor])) }
  }

  const findDrop = (x: number, y: number) => (document.elementsFromPoint(x, y).find((n) => (n as HTMLElement).dataset?.day) as HTMLElement | undefined)?.dataset.day
  const moveToDay = (n: Norm, key: string) => {
    const day = fromKey(key)
    if (sameDay(day, n.start)) return
    const start = atMinutes(day, minutesOf(n.start))
    const to = { start, end: addMin(start, (n.end.getTime() - n.start.getTime()) / 60000), resourceId: n.resourceId }
    setAnnounce(`${n.ev.title} moved to ${fDay.format(start)}.`)
    onMove?.(n.ev, to)
  }

  const list = (d: Date, items: Norm[]) => (
    <ul className="grid gap-0.5">
      {items.map((n) => (
        <li key={n.ev.id} className="group/ev relative flex items-center">
          <button
            type="button"
            onClick={() => { setOpenDay(null); onSelectEvent?.(n.ev) }}
            aria-label={eventLabel(n)}
            className={cn("relative flex min-w-0 flex-1 items-center gap-2 rounded-xs py-1 pr-7 pl-3 text-left text-sm outline-none hover:bg-hover focus-visible:ring-2 focus-visible:ring-primary", selectedId === n.ev.id && "bg-selected")}
          >
            <Stripe color={n.color} />
            <span className="tabular w-11 shrink-0 text-ink-2">{n.ev.allDay ? "All day" : formatTime(n.start)}</span>
            <span className="grid min-w-0">
              <span className="truncate font-medium text-ink">{n.ev.title}</span>
              <span className="truncate text-ink-2">{[n.ev.detail, n.resource].filter(Boolean).join(" · ")}</span>
            </span>
            {n.ev.status && <Badge variant={statusVariant?.(n.ev.status) ?? "secondary"} className="ml-auto">{n.ev.status}</Badge>}
          </button>
          {onMove && (
            <EventMenu n={n} slotMinutes={slotMinutes} resources={resources} onMove={(ev, to) => { setOpenDay(null); onMove(ev, to) }} trigger={
              <Button variant="ghost" size="icon-xs" aria-label={`Actions for ${n.ev.title}`} className="absolute right-0.5"><MoreVertical className="size-3.5 text-ink-3" /></Button>
            } />
          )}
        </li>
      ))}
      {items.length === 0 && <li className="px-1 py-1 text-sm text-ink-2">Nothing scheduled.</li>}
    </ul>
  )

  return (
    <div className="overflow-x-auto">
      <div ref={gridRef} role="grid" aria-label={`${label}, ${fMonth.format(date)}`} onKeyDown={onKeyDown} className="grid min-w-fit">
        <div role="row" className="grid grid-cols-(--cols) border-b border-line" style={{ "--cols": `repeat(${perRow}, minmax(6.5rem, 1fr))` } as React.CSSProperties}>
          {weeks[0]?.map((d) => <div key={d.getDay()} role="columnheader" className="px-2 py-2 text-sm text-ink-2">{fWeekday.format(d)}</div>)}
        </div>
        {weeks.map((w, wi) => (
          <div key={wi} role="row" className="grid grid-cols-(--cols) border-b border-line last:border-b-0" style={{ "--cols": `repeat(${perRow}, minmax(6.5rem, 1fr))` } as React.CSSProperties}>
            {w.map((d, di) => {
              const i = wi * perRow + di
              const key = dayKey(d)
              const items = byDay(d)
              const outside = d.getMonth() !== date.getMonth()
              const today = sameDay(d, now)
              const shown = items.length > 3 ? items.slice(0, 2) : items
              const more = items.length - shown.length
              return (
                <Popover key={key} open={openDay === key} onOpenChange={(o) => { setOpenDay(o ? key : null); if (!o) focusNext.current = true }}>
                  <PopoverAnchor asChild>
                    <div
                      role="gridcell"
                      tabIndex={cursor === i ? 0 : -1}
                      data-cell={i}
                      data-day={outside ? undefined : key}
                      aria-label={`${fDay.format(d)}${today ? ", today" : ""}, ${items.length ? `${items.length} ${items.length === 1 ? "event" : "events"}` : "nothing scheduled"}`}
                      aria-selected={cursor === i}
                      onFocus={() => setCursor(i)}
                      className={cn(
                        "grid min-h-24 min-w-0 content-start gap-0.5 border-l border-line p-1 outline-none first:border-l-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
                        outside && "bg-surface-2",
                        dropKey === key && "bg-selected",
                      )}
                    >
                      <span className="flex items-center justify-between">
                        <span
                          aria-hidden="true"
                          onClick={() => !outside && onOpenDay(d)}
                          className={cn("tabular grid h-5 min-w-5 cursor-pointer place-items-center rounded-xs px-1 text-sm font-medium hover:underline", today ? "bg-primary text-primary-foreground" : outside ? "text-ink-3" : "text-ink")}
                        >
                          {d.getDate()}
                        </span>
                      </span>
                      {!outside && shown.map((n) => (
                        <span
                          key={n.ev.id}
                          aria-hidden="true"
                          onPointerDown={(e) => { if (e.button !== 0 || !onMove || n.ev.allDay) return; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); drag.current = { id: n.ev.id, x: e.clientX, y: e.clientY, started: false } }}
                          onPointerMove={(e) => {
                            const dr = drag.current
                            if (!dr || dr.id !== n.ev.id) return
                            if (!dr.started && Math.hypot(e.clientX - dr.x, e.clientY - dr.y) < 4) return
                            dr.started = true
                            dr.over = findDrop(e.clientX, e.clientY)
                            setDropKey(dr.over ?? null)
                          }}
                          onPointerUp={() => {
                            const dr = drag.current
                            drag.current = null
                            setDropKey(null)
                            if (dr?.started) { if (dr.over) moveToDay(n, dr.over) } else onSelectEvent?.(n.ev)
                          }}
                          onPointerCancel={() => { drag.current = null; setDropKey(null) }}
                          onClick={() => { if (!onMove || n.ev.allDay) onSelectEvent?.(n.ev) }}
                          className={cn("relative flex min-w-0 touch-none items-center gap-1 py-px pr-1 pl-2 text-sm select-none", evSurface, onMove && !n.ev.allDay ? "cursor-grab" : "cursor-pointer", selectedId === n.ev.id && "bg-selected")}
                        >
                          <Stripe color={n.color} />
                          {!n.ev.allDay && <span className="tabular shrink-0 text-ink-2">{formatTime(n.start)}</span>}
                          <span className="truncate text-ink">{n.ev.title}</span>
                        </span>
                      ))}
                      {!outside && more > 0 && (
                        <Button variant="ghost" size="xs" tabIndex={-1} onClick={() => setOpenDay(key)} className="justify-self-start">+{more} more</Button>
                      )}
                    </div>
                  </PopoverAnchor>
                  <PopoverContent align="start" className="w-80" onOpenAutoFocus={(e) => { e.preventDefault(); (e.currentTarget as HTMLElement).querySelector<HTMLElement>("button")?.focus() }}>
                    <div className="grid gap-2">
                      <p className="text-base font-medium text-ink">{fDay.format(d)}</p>
                      {list(d, items)}
                      <div className="flex items-center gap-2 border-t border-line pt-2">
                        <Button variant="link" size="xs" onClick={() => { setOpenDay(null); onOpenDay(d) }}>Open day</Button>
                        {onCreate && (
                          <Button variant="outline" size="xs" className="ml-auto" onClick={() => { setOpenDay(null); const s = atMinutes(d, dayStart * 60 + 60); onCreate({ start: s, end: addMin(s, createMinutes) }) }}>Add at {formatTime(atMinutes(d, dayStart * 60 + 60))}</Button>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )
            })}
          </div>
        ))}
      </div>
      <p className="sr-only">Arrow keys move between days. Enter lists the day's events, with their menus to change the time.</p>
    </div>
  )
}

/* ---------------------------------------------------------------- agenda (narrow screens, and the list alternative) */

function Agenda({
  inRange, resources, onSelectEvent, onMove, selectedId, slotMinutes, statusVariant, days, now, emptyText, resourceTitle,
}: Shared & { days: Date[]; now: Date; emptyText: string; resourceTitle: string }) {
  const groups = days.map((d) => ({ d, items: inRange.filter((n) => sameDay(n.start, d)).sort((a, b) => Number(!a.ev.allDay) - Number(!b.ev.allDay) || a.start.getTime() - b.start.getTime()) })).filter((g) => g.items.length)
  if (!groups.length) return <p role="status" className="px-3 py-10 text-center text-base text-ink-2">{emptyText}.</p>
  return (
    <div className="grid">
      {groups.map(({ d, items }) => (
        <section key={dayKey(d)} aria-labelledby={`ag-${dayKey(d)}`} className="border-b border-line last:border-b-0">
          <h3 id={`ag-${dayKey(d)}`} className="flex items-center gap-2 bg-surface-2 px-3 py-2 text-sm font-medium text-ink">
            {fDay.format(d)}
            {sameDay(d, now) && <Badge variant="default">Today</Badge>}
          </h3>
          <ul className="grid">
            {items.map((n) => (
              <li key={n.ev.id} className="relative flex items-stretch border-t border-line first:border-t-0">
                <button
                  type="button"
                  onClick={() => onSelectEvent?.(n.ev)}
                  aria-label={eventLabel(n)}
                  className={cn("relative grid min-h-9 min-w-0 flex-1 grid-cols-(--ag) items-start gap-x-3 py-2 pr-9 pl-4 text-left text-base outline-none hover:bg-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset", selectedId === n.ev.id && "bg-selected hover:bg-selected")}
                  style={{ "--ag": "5.5rem minmax(0,1fr)" } as React.CSSProperties}
                >
                  <Stripe color={n.color} />
                  <span className="tabular text-sm text-ink-2">{n.ev.allDay ? "All day" : formatTimeRange(n.start, n.end)}</span>
                  <span className="grid min-w-0">
                    <span className="font-medium text-ink">{n.ev.title}{n.ev.detail && <span className="font-normal">, {n.ev.detail}</span>}</span>
                    <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-ink-2">
                      {n.resource && <span><span className="sr-only">{resourceTitle}: </span>{n.resource}</span>}
                      {n.ev.status && <Badge variant={statusVariant?.(n.ev.status) ?? "secondary"}>{n.ev.status}</Badge>}
                    </span>
                  </span>
                </button>
                {onMove && (
                  <EventMenu n={n} slotMinutes={slotMinutes} resources={resources} onSelect={onSelectEvent} onMove={onMove} trigger={
                    <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${n.ev.title}`} className="absolute top-1 right-1"><MoreVertical className="size-4 text-ink-3" /></Button>
                  } />
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
