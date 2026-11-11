/**
 * TwoUX Timeline: scheduled work across a few tracks on one time ruler, such as releases and maintenance per service
 * or hiring campaign phases per team. Adapted from Astro UXDS's timeline (ruler, tracks, spans and instants, a
 * current-time line, zoom), rebuilt for dense B2B screens:
 * - Status is a word (tooltip, accessible name, table view) as well as a tint, never colour alone.
 * - The track label column is sticky; only the time area scrolls, inside its own box (reflows to 320px).
 * - One tab stop (role="grid"): ← → move in time within a track, ↑ ↓ move to the nearest event on the next track,
 *   Home End to the first or last in the track, Enter or Space selects, + and − zoom, Esc clears.
 *   + and − only work while the timeline has focus (WCAG 2.1.4's "active only on focus" exception).
 * - Selecting an event calls onSelect: the app opens the record in its SidePanel. The timeline never edits by drag.
 * - "Now" is a labelled line with the time as text, not a coloured playhead.
 * - Dates are UK format; the tooltip gives the full date and zone as Timestamp does.
 * - Overlapping events in one track stack in lanes instead of covering each other.
 * Wrap it in ChartFrame for title, the loading, error and no-match states, and the table view (timelineTable).
 */
import * as React from "react"
import { cn } from "../lib/cn"
import { textW, useWidth, Tip } from "../lib/chart-kit"
import { useShortcutsEnabled } from "../lib/shortcuts"
import { Button } from "./button"
import { SegmentedControl, Segment } from "./segmented-control"

/* ---------------------------------------------------------------- types */

export type TimelineStatus = "ok" | "warn" | "bad" | "neutral"
export type TimelineZoom = "hour" | "day" | "week" | "month"
export type TimelineEvent = {
  id: string
  label: string
  start: Date | string
  /** Leave out for an instant (a deadline, a deploy, an interview). */
  end?: Date | string
  status?: TimelineStatus
  /** The word for the status, such as "At risk". Defaults: On track, At risk, Blocked, Planned. */
  statusLabel?: string
}
export type TimelineTrack = { id: string; label: string; events: TimelineEvent[] }

const STATUS_WORD: Record<TimelineStatus, string> = { ok: "On track", warn: "At risk", bad: "Blocked", neutral: "Planned" }
const BAR: Record<TimelineStatus, string> = {
  ok: "bg-ok-bg border-ok-line",
  warn: "bg-warn-bg border-warn-line",
  bad: "bg-bad-bg border-bad-line",
  neutral: "bg-neutral-bg border-neutral-line",
}
const MARK: Record<TimelineStatus, string> = { ok: "bg-ok", warn: "bg-warn", bad: "bg-bad", neutral: "bg-ink-3" }
const ZOOM_LABEL: Record<TimelineZoom, string> = { hour: "Hour", day: "Day", week: "Week", month: "Month" }
const ZOOMS: TimelineZoom[] = ["hour", "day", "week", "month"]

const H = 3_600_000, D = 24 * H
/** Pixels per millisecond at each zoom: 64px an hour, 120px a day, 168px a week, about 124px a month. */
const SCALE: Record<TimelineZoom, number> = { hour: 64 / H, day: 120 / D, week: 24 / D, month: 4 / D }

const toDate = (v: Date | string) => (typeof v === "string" ? new Date(v) : v)
const word = (e: TimelineEvent) => e.statusLabel ?? STATUS_WORD[e.status ?? "neutral"]

/* ---------------------------------------------------------------- dates (UK, as Timestamp) */

const dtf = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", o)
const fDay = dtf({ weekday: "short", day: "numeric", month: "short" })
const fDate = dtf({ day: "numeric", month: "short", year: "numeric" })
const fTime = dtf({ hour: "2-digit", minute: "2-digit" })
const fFull = dtf({ weekday: "short", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" })
const fMonth = dtf({ month: "short", year: "numeric" })
const fDayMonth = dtf({ day: "numeric", month: "short" })
const midnight = (d: Date) => d.getHours() === 0 && d.getMinutes() === 0
/** "Wed 12 Nov, 09:00", or "Wed 12 Nov" at midnight. */
export const timelineDate = (d: Date) => (midnight(d) ? fDay.format(d) : `${fDay.format(d)}, ${fTime.format(d)}`)
function duration(ms: number) {
  const days = Math.floor(ms / D), hours = Math.round((ms % D) / H)
  if (days >= 14) return `${Math.round(ms / (7 * D))} weeks`
  const p = (n: number, u: string) => `${n} ${u}${n === 1 ? "" : "s"}`
  return [days && p(days, "day"), hours && p(hours, "hour")].filter(Boolean).join(" ") || "Under an hour"
}

/** Table view for ChartFrame: track, event, starts, ends, status. */
export const timelineTable = (tracks: TimelineTrack[]) => ({
  columns: ["Track", "Event", "Starts", "Ends", "Status"],
  rows: tracks.flatMap((t) =>
    [...t.events].sort((a, b) => +toDate(a.start) - +toDate(b.start)).map((e) => [t.label, e.label, fFull.format(toDate(e.start)), e.end ? fFull.format(toDate(e.end)) : "Same time", word(e)]),
  ),
})

/* ---------------------------------------------------------------- ticks */

function ticks(from: Date, to: Date, zoom: TimelineZoom) {
  const out: { t: number; label: string; major: boolean }[] = []
  const d = new Date(from)
  if (zoom === "hour") d.setMinutes(0, 0, 0)
  else d.setHours(0, 0, 0, 0)
  if (zoom === "week") while (d.getDay() !== 1) d.setDate(d.getDate() - 1)
  if (zoom === "month") d.setDate(1)
  for (let i = 0; d <= to && i < 2000; i++) {
    const t = d.getTime()
    if (t >= from.getTime()) {
      if (zoom === "hour") out.push({ t, label: d.getHours() === 0 ? fDay.format(d) : fTime.format(d), major: d.getHours() === 0 })
      else if (zoom === "day") out.push({ t, label: fDay.format(d), major: d.getDay() === 1 })
      else if (zoom === "week") out.push({ t, label: `${fDayMonth.format(d)}`, major: d.getDate() <= 7 })
      else out.push({ t, label: fMonth.format(d), major: d.getMonth() === 0 })
    }
    if (zoom === "hour") d.setHours(d.getHours() + 1)
    else if (zoom === "day") d.setDate(d.getDate() + 1)
    else if (zoom === "week") d.setDate(d.getDate() + 7)
    else d.setMonth(d.getMonth() + 1)
  }
  return out
}

/* ---------------------------------------------------------------- component */

type Placed = { e: TimelineEvent; track: TimelineTrack; ti: number; s: number; en: number | null; x: number; w: number; lane: number; inside: boolean }

const RULER = 32, LANE = 28, PAD = 4

export function Timeline({
  tracks,
  start,
  end,
  now,
  zoom: zoomProp,
  defaultZoom = "day",
  onZoomChange,
  zooms = ZOOMS,
  selectedId,
  onSelect,
  emptyText,
  "aria-label": label,
  className,
}: {
  tracks: TimelineTrack[]
  /** The visible period. Events outside it are left out; events crossing an edge are cut at the edge. */
  start: Date | string
  end: Date | string
  /** Draws a labelled Now line when it falls inside the period. */
  now?: Date | string
  zoom?: TimelineZoom
  defaultZoom?: TimelineZoom
  onZoomChange?: (z: TimelineZoom) => void
  /** The zoom levels offered, two to four. */
  zooms?: TimelineZoom[]
  /** The event whose record is open in the side panel. */
  selectedId?: string | null
  /** Click, Enter or Space on an event. Open the record in a SidePanel. */
  onSelect?: (event: TimelineEvent, track: TimelineTrack) => void
  emptyText?: string
  "aria-label": string
  className?: string
}) {
  const from = toDate(start), to = toDate(end)
  const nowD = now ? toDate(now) : null
  const nowIn = !!nowD && nowD >= from && nowD <= to
  const shortcutsOn = useShortcutsEnabled()
  const [zInner, setZInner] = React.useState<TimelineZoom>(zoomProp ?? defaultZoom)
  const wanted = zoomProp ?? zInner
  const zoom = zooms.includes(wanted) ? wanted : zooms[0] ?? "day"
  const [wrap, width] = useWidth<HTMLDivElement>()
  const scroller = React.useRef<HTMLDivElement>(null)
  const grid = React.useRef<HTMLDivElement>(null)
  const id = React.useId()
  const [active, setActive] = React.useState<string | null>(null)
  const [hover, setHover] = React.useState<string | null>(null)
  const [focused, setFocused] = React.useState(false)
  const [scrollX, setScrollX] = React.useState(0)
  const [selInner, setSelInner] = React.useState<string | null>(null)
  const selected = selectedId !== undefined ? selectedId : selInner

  const labelW = width && width < 480 ? 112 : 176
  const viewW = Math.max(0, width - labelW)
  const span = Math.max(1, to.getTime() - from.getTime())
  const k = Math.max(SCALE[zoom], viewW / span)
  const timeW = Math.round(span * k)
  const X = (t: number) => (t - from.getTime()) * k

  // Place events: clip to the period, then stack overlaps in lanes.
  const rows = tracks.map((track, ti) => {
    const placed: Placed[] = []
    const laneEnd: number[] = []
    const evs = track.events
      .map((e) => ({ e, s: toDate(e.start).getTime(), en: e.end ? toDate(e.end).getTime() : null }))
      .filter(({ s, en }) => (en ?? s) >= from.getTime() && s <= to.getTime())
      .sort((a, b) => a.s - b.s)
    for (const { e, s, en } of evs) {
      const x = Math.max(0, X(s))
      const w = en === null ? 0 : Math.max(6, X(Math.min(en, to.getTime())) - x)
      const inside = en !== null && w >= textW(e.label) + 16
      const occ = en === null ? x + 14 + textW(e.label) + 8 : inside ? x + w + 4 : x + w + textW(e.label) + 12
      let lane = laneEnd.findIndex((r) => r <= x)
      if (lane < 0) { lane = laneEnd.length; laneEnd.push(0) }
      laneEnd[lane] = occ
      placed.push({ e, track, ti, s, en, x, w, lane, inside })
    }
    return { track, placed, lanes: Math.max(1, laneEnd.length) }
  })
  const tops: number[] = []
  rows.reduce((y, r) => { tops.push(y); return y + r.lanes * LANE + PAD * 2 }, RULER)
  const all = rows.flatMap((r) => r.placed)
  const find = (eid: string | null) => all.find((p) => p.e.id === eid) ?? null
  const cur = find(active ?? hover)
  const cellId = (eid: string) => `${id}-e-${eid}`

  // Keep the time at the centre of the view when zooming; start with Now (or the first event) in view.
  const centre = React.useRef<number | null>(null)
  const setZoom = (z: TimelineZoom) => {
    const el = scroller.current
    if (el) centre.current = from.getTime() + (el.scrollLeft + viewW / 2) / k
    if (zoomProp === undefined) setZInner(z)
    onZoomChange?.(z)
  }
  const started = React.useRef(false)
  React.useLayoutEffect(() => {
    const el = scroller.current
    if (!el || !viewW) return
    if (centre.current !== null) { el.scrollLeft = X(centre.current) - viewW / 2; centre.current = null }
    else if (!started.current) {
      const t = nowIn ? nowD!.getTime() : all[0]?.s
      if (t !== undefined) el.scrollLeft = X(t) - viewW / 4
    }
    started.current = true
    setScrollX(el.scrollLeft)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k, viewW])

  const reveal = (p: Placed) => {
    const el = scroller.current
    if (!el) return
    const a = p.x, b = p.x + Math.max(p.w, 14)
    if (a < el.scrollLeft + 8) el.scrollLeft = a - 24
    else if (b > el.scrollLeft + viewW - 8) el.scrollLeft = Math.min(a - 24, b - viewW + 24)
  }
  const move = (p: Placed | null | undefined) => { if (p) { setActive(p.e.id); setHover(null); reveal(p) } }
  const select = (p: Placed) => {
    if (selectedId === undefined) setSelInner(p.e.id)
    onSelect?.(p.e, p.track)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.altKey || e.metaKey) return
    const a = find(active)
    const inTrack = a ? rows[a.ti].placed : []
    const i = a ? inTrack.indexOf(a) : -1
    const nearest = (dir: 1 | -1) => {
      for (let t = (a?.ti ?? -1) + dir; t >= 0 && t < rows.length; t += dir) {
        const list = rows[t].placed
        if (list.length) return list.reduce((best, p) => (Math.abs(p.s - (a?.s ?? 0)) < Math.abs(best.s - (a?.s ?? 0)) ? p : best))
      }
      return null
    }
    const k_ = e.key
    if (k_ === "+" || k_ === "=" || k_ === "-" || k_ === "−") {
      if (e.ctrlKey || !shortcutsOn) return
      e.preventDefault()
      const zi = zooms.indexOf(zoom)
      const next = zooms[Math.min(zooms.length - 1, Math.max(0, zi + (k_ === "+" || k_ === "=" ? -1 : 1)))]
      if (next && next !== zoom) setZoom(next)
      return
    }
    if (!all.length) return
    if (!a && ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"].includes(k_)) {
      e.preventDefault()
      const visible = all.find((p) => p.x >= (scroller.current?.scrollLeft ?? 0)) ?? all[0]
      move(e.ctrlKey && k_ === "End" ? all[all.length - 1] : visible)
      return
    }
    if (k_ === "ArrowRight") { e.preventDefault(); move(inTrack[i + 1]) }
    else if (k_ === "ArrowLeft") { e.preventDefault(); move(inTrack[i - 1]) }
    else if (k_ === "ArrowDown") { e.preventDefault(); move(nearest(1)) }
    else if (k_ === "ArrowUp") { e.preventDefault(); move(nearest(-1)) }
    else if (k_ === "Home") { e.preventDefault(); move(e.ctrlKey ? all[0] : inTrack[0]) }
    else if (k_ === "End") { e.preventDefault(); move(e.ctrlKey ? rows.flatMap((r) => r.placed).at(-1) : inTrack[inTrack.length - 1]) }
    else if ((k_ === "Enter" || k_ === " ") && a) { e.preventDefault(); select(a) }
    else if (k_ === "Escape" && (active || hover)) { e.stopPropagation(); setActive(null); setHover(null) }
  }

  const goNow = () => {
    const el = scroller.current
    if (el && nowD) el.scrollTo({ left: X(nowD.getTime()) - viewW / 2, behavior: "smooth" })
  }

  const tk = ticks(from, to, zoom)
  const range = `${fDate.format(from)} to ${fDate.format(to)}`
  const nowText = nowD ? `Now ${zoom === "month" || zoom === "week" ? fDayMonth.format(nowD) : fTime.format(nowD)}` : ""
  const describe = (p: Placed) =>
    `${p.e.label}, ${p.track.label}, ${p.en === null ? timelineDate(new Date(p.s)) : `${timelineDate(new Date(p.s))} to ${timelineDate(new Date(p.en))}`}, ${word(p.e)}`
  const vars = (o: Record<string, string | number>) => Object.fromEntries(Object.entries(o).map(([key, v]) => [key, typeof v === "number" ? `${v}px` : v])) as React.CSSProperties

  return (
    <div ref={wrap} className={cn("relative grid w-full gap-2", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-ink-2">{range}</p>
        <div className="flex flex-wrap items-center gap-control">
          {nowIn && <Button variant="ghost" size="sm" onClick={goNow}>Go to now</Button>}
          {zooms.length > 1 && (
            <SegmentedControl size="sm" value={zoom} onValueChange={(v) => setZoom(v as TimelineZoom)} aria-label="Zoom">
              {zooms.map((z) => <Segment key={z} value={z}>{ZOOM_LABEL[z]}</Segment>)}
            </SegmentedControl>
          )}
        </div>
      </div>

      <div ref={scroller} onScroll={(e) => setScrollX(e.currentTarget.scrollLeft)} className="overflow-x-auto overscroll-x-contain rounded-xs border border-line">
        <div
          ref={grid}
          role="grid"
          tabIndex={0}
          aria-label={label}
          aria-describedby={`${id}-d`}
          aria-activedescendant={active ? cellId(active) : undefined}
          onKeyDown={onKey}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setActive(null) }}
          onMouseLeave={() => setHover(null)}
          className="relative w-(--tw) min-w-full outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
          style={vars({ "--tw": labelW + timeW, "--lw": labelW, "--sl": labelW + 8 })}
        >
          <span id={`${id}-d`} className="sr-only">
            {`${tracks.length} tracks, ${all.length} events, ${range}.${nowIn ? ` Now is ${timelineDate(nowD!)}.` : ""} Arrow keys move between events, Enter opens one, plus and minus zoom.`}
          </span>

          {/* Grid lines and the Now line sit under the events. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-(--lw) right-0">
            {tk.map((t) => (
              <span key={t.t} className={cn("absolute inset-y-0 left-(--x) w-px", t.major ? "bg-line-strong" : "bg-line")} style={vars({ "--x": Math.round(X(t.t)) })} />
            ))}
            {nowIn && <span className="absolute inset-y-0 left-(--x) w-0.5 -translate-x-1/2 bg-ink" style={vars({ "--x": X(nowD!.getTime()) })} />}
          </div>

          {/* Ruler */}
          <div aria-hidden="true" className="relative flex h-8 border-b border-line">
            <div className="sticky left-0 z-20 flex w-(--lw) shrink-0 items-center border-r border-line bg-surface-2 px-2 text-sm font-medium text-ink-2">Track</div>
            <div className="relative flex-1 bg-surface-2">
              {tk.map((t) => (
                <span key={t.t} className={cn("tabular absolute top-0 left-(--x) flex h-8 items-center whitespace-nowrap pl-2 text-xs", t.major ? "font-medium text-ink-2" : "text-ink-3")} style={vars({ "--x": Math.round(X(t.t)) })}>{t.label}</span>
              ))}
              {nowIn && (
                <span className="tabular absolute top-1.5 left-(--x) z-10 -translate-x-1/2 whitespace-nowrap rounded-xs bg-ink px-1 text-xs font-medium text-surface" style={vars({ "--x": X(nowD!.getTime()) })}>{nowText}</span>
              )}
            </div>
          </div>

          {rows.map(({ track, placed, lanes }) => (
            <div key={track.id} role="row" className="relative flex border-b border-line last:border-b-0 h-(--rh)" style={vars({ "--rh": lanes * LANE + PAD * 2 })}>
              <div role="rowheader" className="sticky left-0 z-20 flex w-(--lw) shrink-0 items-start border-r border-line bg-surface px-2 pt-2 text-sm font-medium text-ink">
                <span className="truncate">{track.label}</span>
              </div>
              <div className="relative flex-1">
                {placed.map((p) => {
                  const isActive = active === p.e.id, isSel = selected === p.e.id, st = p.e.status ?? "neutral"
                  return (
                    <div
                      key={p.e.id}
                      id={cellId(p.e.id)}
                      role="gridcell"
                      aria-label={describe(p)}
                      aria-selected={isSel}
                      onMouseEnter={() => setHover(p.e.id)}
                      onClick={() => { grid.current?.focus({ preventScroll: true }); setActive(p.e.id); select(p) }}
                      className={cn(
                        "absolute top-(--y) left-(--x) z-10 flex h-6 cursor-pointer items-center gap-control text-sm text-ink",
                        isActive && focused && "rounded-xs outline-2 outline-offset-1 outline-primary",
                      )}
                      style={vars({ "--x": p.x, "--y": PAD + p.lane * LANE + 2 })}
                    >
                      {p.en === null ? (
                        <>
                          <span aria-hidden="true" className={cn("ml-0 size-2.5 shrink-0 -translate-x-1/2 rotate-45", MARK[st], isSel && "ring-2 ring-primary ring-offset-1 ring-offset-surface")} />
                          <span className={cn("-ml-1 whitespace-nowrap", isSel && "font-semibold")}>{p.e.label}</span>
                        </>
                      ) : (
                        <>
                          <span className={cn("flex h-6 w-(--w) shrink-0 items-center overflow-clip rounded-xs border px-2", BAR[st], isSel && "border-primary ring-1 ring-primary")} style={vars({ "--w": p.w })}>
                            {/* The label stays in view while the start of a long span is scrolled under the track column. */}
                            {p.inside && <span className={cn("sticky left-(--sl) truncate", isSel && "font-semibold")}>{p.e.label}</span>}
                          </span>
                          {!p.inside && <span className={cn("whitespace-nowrap", isSel && "font-semibold")}>{p.e.label}</span>}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {!all.length && (
            <div className="sticky left-0 flex h-20 w-(--vw) items-center justify-center px-4 text-center text-sm text-ink-2" style={vars({ "--vw": width || 320 })}>
              {emptyText ?? `Nothing scheduled between ${fDate.format(from)} and ${fDate.format(to)}`}
            </div>
          )}
        </div>
      </div>

      {cur && (
        <Tip
          x={Math.min(width - 8, Math.max(labelW, labelW + cur.x - scrollX + Math.min(cur.w, 40)))}
          y={tops[cur.ti] + PAD + (cur.lane + 1) * LANE + 34}
          width={width}
          title={cur.e.label}
          rows={[
            { label: "Track", value: cur.track.label },
            { label: "Status", value: word(cur.e) },
            { label: cur.en === null ? "At" : "Starts", value: timelineDate(new Date(cur.s)) },
            ...(cur.en !== null ? [{ label: "Ends", value: timelineDate(new Date(cur.en)) }, { label: "Length", value: duration(cur.en - cur.s) }] : []),
          ]}
        />
      )}
    </div>
  )
}
