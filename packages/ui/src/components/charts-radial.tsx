/**
 * TwoUX radial charts: two narrow uses of polar coordinates, adapted from MUI X radial bars and radial lines.
 *
 * RadialBars: one to four concentric rings, each the share of a fixed limit (seats, storage, credits, an SLA budget).
 * Small, with value and limit always written as text; the ring only repeats them. Never actual against target
 * (that is BulletChart), never categories compared around a circle (that is a bar chart), never a dial with a needle.
 *
 * RadialLines: a line chart in polar coordinates for cyclical periods only (hour of day, day of week, month),
 * where the last period meets the first. One to three series, value axis from zero, missing data as a gap.
 *
 * Same rules as charts.tsx: own SVG, series colours in fixed order (c1…c8), text never in a series colour,
 * one tab stop per chart with arrow keys between marks, Esc clears, a Tip on hover and focus, and a table helper.
 */
import * as React from "react"
import { cn } from "../lib/cn"
import { Badge } from "./badge"
import { ChartLegend, niceTicks, seriesColor } from "./charts"
import { fmt, pct, svgCls, halo, useWidth, useActive, Tip, type TipRow } from "../lib/chart-kit"

/* ---------------------------------------------------------------- shared */

const TAU = Math.PI * 2
/** Angle for a share of a full turn, starting at 12 o'clock and running clockwise. */
const turn = (share: number) => -Math.PI / 2 + share * TAU
const polar = (cx: number, cy: number, r: number, a: number): [number, number] => [cx + r * Math.cos(a), cy + r * Math.sin(a)]

/* ---------------------------------------------------------------- radial bars */

export type RadialBarItem = {
  id: string
  /** What is measured, e.g. "Seats". */
  label: string
  value: number
  /** The fixed limit the value is a share of: capacity, quota or budget. */
  limit: number
  /** Unit written after the numbers, e.g. "seats", "GB". */
  unit?: string
}

const MAX_RINGS = 4

const ringShare = (it: RadialBarItem) => (it.limit > 0 ? it.value / it.limit : 0)
const ringText = (it: RadialBarItem, format: (n: number) => string) => `${format(it.value)} of ${format(it.limit)}${it.unit ? ` ${it.unit}` : ""}`
const ringStatus = (it: RadialBarItem) => (it.value > it.limit ? "Over limit" : it.value === it.limit && it.limit > 0 ? "At limit" : null)

export const radialBarsTable = (items: RadialBarItem[], format: (n: number) => string = fmt) => ({
  columns: ["Measure", "Used", "Limit", "Share of limit"],
  rows: items.slice(0, MAX_RINGS).map((it) => [it.label, `${format(it.value)}${it.unit ? ` ${it.unit}` : ""}`, `${format(it.limit)}${it.unit ? ` ${it.unit}` : ""}`, pct(it.value, it.limit, 0)]),
})

/**
 * Concentric rings, outermost first, each the share of its own limit from 12 o'clock clockwise.
 * The list beside the rings carries every value in words; a ring at or over its limit adds a status badge.
 */
export function RadialBars({
  items,
  format = fmt,
  size = 128,
  "aria-label": label,
  className,
}: {
  /** One to four measures; extra items are not drawn. */
  items: RadialBarItem[]
  format?: (n: number) => string
  /** Diameter of the rings in px (96 to 160). */
  size?: number
  "aria-label": string
  className?: string
}) {
  const rings = items.slice(0, MAX_RINGS)
  const { active, setActive, onKey } = useActive(rings.length)
  const S = Math.min(160, Math.max(96, size))
  const c = S / 2
  const n = rings.length
  const gap = 3
  const stroke = Math.max(6, Math.min(12, (c - 18 - gap * (n - 1)) / Math.max(n, 2)))
  const radius = (i: number) => c - stroke / 2 - i * (stroke + gap)
  const geo = rings.map((it, i) => {
    const share = ringShare(it), shown = Math.min(1, Math.max(0, share)), r = radius(i)
    const [x0, y0] = polar(c, c, r, turn(0)), [x1, y1] = polar(c, c, r, turn(shown))
    const d = shown <= 0 || shown >= 1 ? null : `M${x0},${y0}A${r},${r} 0 ${shown > 0.5 ? 1 : 0} 1 ${x1},${y1}`
    return { it, i, r, share, shown, d, end: [x1, y1] as [number, number] }
  })
  const summary = `${label}. ${rings.map((it) => `${it.label}: ${ringText(it, format)}, ${pct(it.value, it.limit, 0)} of the limit${ringStatus(it) ? `, ${ringStatus(it)!.toLowerCase()}` : ""}`).join("; ")}.`
  const cur = active === null ? null : geo[active]
  return (
    <div data-slot="radial-bars" className={cn("flex flex-wrap items-center gap-x-4 gap-y-3", className)}>
      <div className="relative shrink-0">
        <svg
          width={S}
          height={S}
          viewBox={`0 0 ${S} ${S}`}
          role="img"
          tabIndex={0}
          aria-label={summary}
          onKeyDown={onKey}
          onBlur={() => setActive(null)}
          onMouseLeave={() => setActive(null)}
          className={svgCls}
        >
          {geo.map((g) => (
            <g key={g.it.id} onMouseEnter={() => setActive(g.i)} className={cn("transition-opacity duration-(--duration-fast)", active !== null && active !== g.i && "opacity-40")}>
              <circle cx={c} cy={c} r={g.r} fill="none" stroke="var(--color-hover)" strokeWidth={stroke} />
              {g.shown >= 1 ? (
                <circle cx={c} cy={c} r={g.r} fill="none" stroke={seriesColor(g.i)} strokeWidth={stroke} />
              ) : g.d ? (
                <path d={g.d} fill="none" stroke={seriesColor(g.i)} strokeWidth={stroke} />
              ) : null}
              {/* zero mark at 12 o'clock so an empty ring still shows where it starts */}
              <line x1={c} x2={c} y1={c - g.r - stroke / 2} y2={c - g.r + stroke / 2} stroke="var(--color-line-strong)" strokeWidth={1} />
            </g>
          ))}
          {n === 1 && (
            <text x={c} y={c} dy="0.35em" textAnchor="middle" className="fill-ink text-lg font-semibold tabular">{pct(rings[0].value, rings[0].limit, 0)}</text>
          )}
        </svg>
        {cur && (
          <Tip x={-12} y={S + 6} width={S} title={cur.it.label} rows={[
            { label: "Used", value: ringText(cur.it, format), color: seriesColor(cur.i) },
            { label: "Of limit", value: pct(cur.it.value, cur.it.limit, 0) },
            ...(ringStatus(cur.it) ? [{ label: "Status", value: ringStatus(cur.it)! }] : []),
          ]} />
        )}
      </div>
      <ul className="grid min-w-0 flex-1 basis-32 gap-2" aria-label="Values">
        {rings.map((it, i) => {
          const status = ringStatus(it)
          return (
            <li key={it.id} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} className={cn("grid grid-cols-[auto_1fr] items-center gap-x-2 text-sm transition-opacity duration-(--duration-fast)", active !== null && active !== i && "opacity-60")}>
              <span aria-hidden="true" className="size-2.5 rounded-xs bg-(--c)" style={{ "--c": seriesColor(i) } as React.CSSProperties} />
              <span className="flex min-w-0 items-center gap-2">
                <span className="truncate text-ink-2">{it.label}</span>
                {status && <Badge variant={status === "Over limit" ? "destructive" : "warning"}>{status}</Badge>}
              </span>
              <span className="tabular col-start-2 text-ink"><span className="font-medium">{ringText(it, format)}</span><span className="text-ink-3"> · {pct(it.value, it.limit, 0)}</span></span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ---------------------------------------------------------------- radial lines */

export type RadialLineSeries = {
  id: string
  label: string
  /** One value per period, in period order; null for a gap (never zero). */
  data: (number | null)[]
}

export const radialLinesTable = (periods: string[], series: RadialLineSeries[], format: (n: number) => string = fmt, periodLabel = "Period") => ({
  columns: [periodLabel, ...series.slice(0, 3).map((s) => s.label)],
  rows: periods.map((p, i) => [p, ...series.slice(0, 3).map((s) => (s.data[i] == null ? "No data" : format(s.data[i] as number)))]),
})

/** Rings at round values from zero: three or four labelled rings. */
function ringTicks(max: number) {
  let t = niceTicks(max, 4)
  if (t.length - 1 > 4) t = niceTicks(max, 3)
  return t
}

/**
 * A line chart wrapped round a circle, for cyclical periods only. The first period sits at 12 o'clock and
 * periods run clockwise, so the last one meets the first. Distance from the centre is the value, from zero.
 */
export function RadialLines({
  periods,
  series,
  format = fmt,
  periodLabel = "Period",
  maxSize = 320,
  "aria-label": label,
  className,
}: {
  /** Labels for each period of the cycle, e.g. "00:00"…"23:00" or "Mon"…"Sun". */
  periods: string[]
  /** One to three series; extra series are not drawn. */
  series: RadialLineSeries[]
  format?: (n: number) => string
  /** Name of a period, for the tooltip and table, e.g. "Hour". */
  periodLabel?: string
  /** Largest diameter in px; the chart shrinks to its container. */
  maxSize?: number
  "aria-label": string
  className?: string
}) {
  const [wrap, width] = useWidth<HTMLDivElement>()
  const all = series.slice(0, 3)
  const [hidden, setHidden] = React.useState<string[]>([])
  const shown = all.map((s, i) => ({ s, i })).filter(({ s }) => !hidden.includes(s.id))
  const n = periods.length
  const { active, setActive } = useActive(n)
  const S = Math.max(160, Math.min(maxSize, width))
  const c = S / 2
  const labelPad = 22
  const R = c - labelPad
  const max = Math.max(0, ...all.flatMap((s) => s.data.filter((v): v is number => v != null)))
  const ticks = ringTicks(max)
  const top = ticks[ticks.length - 1] || 1
  const ang = (i: number) => turn(i / Math.max(1, n))
  const pt = (i: number, v: number) => polar(c, c, (v / top) * R, ang(i))
  // label every period when there is room, otherwise every 2nd, 3rd or 6th
  const every = [1, 2, 3, 4, 6].find((k) => (TAU * (R + 12)) / (n / k) >= 34) ?? Math.ceil(n / 8)

  const paths = (data: (number | null)[]) => {
    // runs of consecutive values; the run that ends at the last period joins the one starting at the first
    const segs: string[] = []
    const dots: [number, number][] = []
    let run: number[] = []
    const flush = () => {
      if (run.length === 1) dots.push(pt(run[0], data[run[0]] as number))
      else if (run.length > 1) segs.push(run.map((j, k) => `${k ? "L" : "M"}${pt(j, data[j] as number).join(",")}`).join(""))
      run = []
    }
    for (let j = 0; j < n; j++) { if (data[j] == null) flush(); else run.push(j) }
    flush()
    if (n > 2 && data[n - 1] != null && data[0] != null) segs.push(`M${pt(n - 1, data[n - 1] as number).join(",")}L${pt(0, data[0] as number).join(",")}`)
    return { d: segs.join(""), dots }
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (!n) return
    const step = (d: number) => { e.preventDefault(); setActive((a) => (a === null ? (d > 0 ? 0 : n - 1) : (a + d + n) % n)) }
    if (e.key === "ArrowRight" || e.key === "ArrowDown") step(1)
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") step(-1)
    else if (e.key === "Home") { e.preventDefault(); setActive(0) }
    else if (e.key === "End") { e.preventDefault(); setActive(n - 1) }
    else if (e.key === "Escape") setActive(null)
  }
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect()
    const dx = e.clientX - box.left - c, dy = e.clientY - box.top - c
    if (Math.hypot(dx, dy) > R + 16) { setActive(null); return }
    const a = (Math.atan2(dy, dx) + Math.PI / 2 + TAU) % TAU
    setActive(Math.round((a / TAU) * n) % n)
  }

  const describe = (s: RadialLineSeries) => {
    const vals = s.data.map((v, i) => ({ v, i })).filter((x): x is { v: number; i: number } => x.v != null)
    if (!vals.length) return `${s.label}: no data`
    const hi = vals.reduce((a, b) => (b.v > a.v ? b : a)), lo = vals.reduce((a, b) => (b.v < a.v ? b : a))
    const gaps = n - vals.length
    return `${s.label}: highest at ${periods[hi.i]} with ${format(hi.v)}, lowest at ${periods[lo.i]} with ${format(lo.v)}${gaps ? `, ${gaps} ${gaps === 1 ? "period" : "periods"} without data` : ""}`
  }
  const summary = `${label}. Radial line chart over ${n} ${periodLabel.toLowerCase()}s, starting at ${periods[0]} at the top and running clockwise. ${all.map(describe).join("; ")}.`

  const tipRows: TipRow[] = active === null ? [] : shown.map(({ s, i }) => ({ label: s.label, value: s.data[active] == null ? "No data" : format(s.data[active] as number), color: seriesColor(i) }))
  const tipAt = active === null ? null : polar(c, c, R * 0.6, ang(active))

  return (
    <div data-slot="radial-lines" className={cn("grid gap-3", className)}>
      <div ref={wrap} className="w-full">
        {width > 0 && (
          <div className="relative mx-auto w-fit">
            <svg
              width={S}
              height={S}
              viewBox={`0 0 ${S} ${S}`}
              role="img"
              tabIndex={0}
              aria-label={summary}
              onKeyDown={onKey}
              onBlur={() => setActive(null)}
              onMouseMove={onMove}
              onMouseLeave={() => setActive(null)}
              className={svgCls}
            >
              {/* value rings from zero */}
              {ticks.slice(1).map((t, k) => (
                <circle key={t} cx={c} cy={c} r={(t / top) * R} fill="none" className={k === ticks.length - 2 ? "stroke-line-strong" : "stroke-line"} strokeWidth={1} />
              ))}
              {/* one spoke per period */}
              {periods.map((p, i) => {
                const [x, y] = polar(c, c, R, ang(i))
                return <line key={p + i} x1={c} y1={c} x2={x} y2={y} className={active === i ? "stroke-ink-3" : "stroke-line"} strokeWidth={1} />
              })}
              {/* period labels round the outside */}
              {periods.map((p, i) => {
                if (i % every !== 0 && active !== i) return null
                const a = ang(i), cos = Math.cos(a), sin = Math.sin(a)
                const [x, y] = polar(c, c, R + 8, a)
                return (
                  <text key={`l${p}${i}`} x={x} y={y} dy={sin < -0.3 ? "-0.1em" : sin > 0.3 ? "0.8em" : "0.32em"} textAnchor={cos > 0.3 ? "start" : cos < -0.3 ? "end" : "middle"} className={cn("text-xs tabular", active === i ? "fill-ink font-medium" : "fill-ink-3")}>
                    {p}
                  </text>
                )
              })}
              {/* lines */}
              {shown.map(({ s, i }) => {
                const { d, dots } = paths(s.data)
                return (
                  <g key={s.id}>
                    {d && <path d={d} fill="none" stroke={seriesColor(i)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />}
                    {dots.map(([x, y]) => <circle key={`${x},${y}`} cx={x} cy={y} r={2.5} fill={seriesColor(i)} />)}
                  </g>
                )
              })}
              {/* ring values, along the 12 o'clock spoke */}
              {ticks.slice(1).map((t) => (
                <text key={`v${t}`} x={c + 4} y={c - (t / top) * R} dy="0.9em" strokeWidth={3} className={cn("fill-ink-3 text-xs tabular", halo)}>{format(t)}</text>
              ))}
              {/* active period: a dot per series */}
              {active !== null && shown.map(({ s, i }) => {
                const v = s.data[active]
                if (v == null) return null
                const [x, y] = pt(active, v)
                return <circle key={`a${s.id}`} cx={x} cy={y} r={4} fill={seriesColor(i)} className="stroke-surface" strokeWidth={2} />
              })}
            </svg>
            {active !== null && tipAt && (
              <Tip x={tipAt[0]} y={Math.min(tipAt[1], S - 40 - 24 * tipRows.length)} width={S} title={`${periodLabel} ${periods[active]}`} rows={tipRows} />
            )}
          </div>
        )}
      </div>
      {all.length >= 2 && (
        <ChartLegend
          items={all.map((s, i) => ({ id: s.id, label: s.label, color: seriesColor(i), shape: "line" as const }))}
          hidden={hidden}
          onToggle={(id) => setHidden((h) => (h.includes(id) ? h.filter((x) => x !== id) : h.length + 1 >= all.length ? h : [...h, id]))}
        />
      )}
    </div>
  )
}
