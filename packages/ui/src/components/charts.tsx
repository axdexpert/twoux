/**
 * TwoUX charts: own SVG, so marks and colours follow TwoUX's validated data-viz rules.
 * One frame for every chart (title, controls, legend, states, table view) and one cartesian engine
 * for line, area (stacked), bar (grouped or stacked) and mixed bar + line, plus sparkline and stat compare.
 * Donut, heatmap, funnel and scatter live in charts-more.tsx. One axis only; series colours in fixed order (c1…c8);
 * text never in a series colour; every value reachable by keyboard and in a table.
 */
import { AlertCircle, RotateCw, Table2 } from "lucide-react"
import { useWorkspace } from "../lib/workspace"
import * as React from "react"
import { RollingNumber } from "./motion"
import { cn } from "../lib/cn"
import { Button } from "./button"
import { Skeleton } from "./skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"

/* ---------------------------------------------------------------- shared */

const SERIES = ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"] as const
/** Colour for the nth series: fixed order, never cycled. A 9th series must fold into “Other”. */
export const seriesColor = (i: number) => `var(--color-${SERIES[Math.min(i, SERIES.length - 1)]})`
const fmtDefault = (n: number) => n.toLocaleString("en-GB")

export type ChartStatus = "ready" | "loading" | "empty" | "no-match" | "error"
export type ChartSeries = {
  id: string
  label: string
  /** One value per x category; null for a gap. */
  data: (number | null)[]
  /** Mixed charts only. */
  type?: "bar" | "line"
}

function useWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [w, setW] = React.useState(0)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)))
    ro.observe(el)
    setW(el.clientWidth)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

/** Round, readable ticks from zero. */
export function niceTicks(max: number, count = 4) {
  if (max <= 0) return [0, 1]
  const raw = max / count
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw
  const top = Math.ceil(max / step) * step
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => +(i * step).toFixed(10))
}

/* ---------------------------------------------------------------- frame */

export function ChartFrame({
  title,
  description,
  actions,
  status = "ready",
  onRetry,
  onClearFilter,
  emptyText = "No data for this period",
  legend,
  table,
  height = 220,
  level = 3,
  frame: frameProp,
  titleHidden = false,
  view,
  onViewChange,
  className,
  children,
}: {
  title: string
  /** "flush" drops the card's border, shadow and padding, for a chart that fills a region of a workspace.
   *  Defaults to "flush" inside AppShell frame="flush" and "card" everywhere else. */
  frame?: "card" | "flush"
  /** Keeps the title for screen readers only, when a pane header around the chart already shows it. */
  titleHidden?: boolean
  /** Controls chart or table from outside, such as a pane's menu. With titleHidden and no actions, the frame then draws no header at all. */
  view?: "chart" | "table"
  onViewChange?: (view: "chart" | "table") => void
  description?: string
  /** Heading level of the title. Use 2 when the chart sits straight under the page's h1, as on a dashboard. */
  level?: 2 | 3 | 4
  /** Period control and similar, top right. */
  actions?: React.ReactNode
  status?: ChartStatus
  onRetry?: () => void
  onClearFilter?: () => void
  emptyText?: string
  legend?: React.ReactNode
  /** The same data as a table; a toggle shows it in place of the chart. */
  table?: { columns: string[]; rows: (string | number)[][] }
  height?: number
  className?: string
  children: React.ReactNode
}) {
  const workspace = useWorkspace()
  const frame = frameProp ?? (workspace ? "flush" : "card")
  const [ownTable, setOwnTable] = React.useState(false)
  const controlled = view !== undefined
  const asTable = controlled ? view === "table" : ownTable
  const setAsTable = (next: boolean) => (controlled ? onViewChange?.(next ? "table" : "chart") : setOwnTable(next))
  const showHeader = !(titleHidden && controlled && !actions)
  const id = React.useId()
  return (
    <section aria-labelledby={`${id}-t`} data-slot="chart" className={cn("grid bg-surface", frame === "flush" ? "content-start gap-2 p-region" : "gap-3 rounded-sm border border-line p-region shadow-card", className)}>
      <header className={cn("flex flex-wrap items-start justify-between gap-2", titleHidden && "justify-end", !showHeader && "sr-only")}>
        <div className={cn("grid min-w-0 gap-0.5", titleHidden && "sr-only")}>
          {React.createElement(`h${level}`, { id: `${id}-t`, className: "text-md font-semibold text-ink" }, title)}
          {description && <p className="text-sm text-ink-2">{description}</p>}
        </div>
        <div className="flex items-center gap-control">
          {actions}
          {table && status === "ready" && !controlled && (
            <Button variant="ghost" size="icon-sm" aria-pressed={asTable} aria-label={asTable ? "Show chart" : "Show as table"} onClick={() => setAsTable(!asTable)}>
              <Table2 />
            </Button>
          )}
        </div>
      </header>
      {status === "loading" ? (
        <div className="grid content-end gap-2" style={{ "--h": `${height}px` } as React.CSSProperties} aria-busy="true" aria-label={`Loading ${title}`}>
          <div className="flex h-(--h) items-end gap-2">{[45, 70, 55, 85, 60, 75, 50, 90].map((h, i) => <Skeleton key={i} className="h-(--b) flex-1" style={{ "--b": `${h}%` } as React.CSSProperties} />)}</div>
        </div>
      ) : status !== "ready" ? (
        <div className="grid place-items-center gap-2 rounded-xs border border-dashed border-line-strong text-center h-(--h)" style={{ "--h": `${height}px` } as React.CSSProperties}>
          <div className="grid justify-items-center gap-2 px-4">
            {status === "error" && <AlertCircle className="size-4 text-bad" aria-hidden="true" />}
            <p className="text-base font-medium text-ink">{status === "error" ? `Couldn't load ${title.toLowerCase()}` : status === "no-match" ? "No data matches these filters" : emptyText}</p>
            {status === "error" && onRetry && <Button variant="outline" size="sm" onClick={onRetry}><RotateCw />Try again</Button>}
            {status === "no-match" && onClearFilter && <Button variant="outline" size="sm" onClick={onClearFilter}>Clear filters</Button>}
          </div>
        </div>
      ) : asTable && table ? (
        <div className="max-h-(--h) overflow-auto rounded-xs border border-line" style={{ "--h": `${height + 40}px` } as React.CSSProperties}>
          <Table aria-label={`${title}, as a table`}>
            <TableHeader><TableRow>{table.columns.map((c, i) => <TableHead key={c} className={i ? "text-right" : undefined}>{c}</TableHead>)}</TableRow></TableHeader>
            <TableBody>{table.rows.map((r, i) => <TableRow key={i}>{r.map((v, j) => <TableCell key={j} className={j ? "tabular text-right" : undefined}>{typeof v === "number" ? fmtDefault(v) : v}</TableCell>)}</TableRow>)}</TableBody>
          </Table>
        </div>
      ) : (
        <>
          {children}
          {legend}
        </>
      )}
    </section>
  )
}

/** Legend: always shown for two or more series. Clicking a key hides or shows that series. */
export function ChartLegend({ items, hidden = [], onToggle }: { items: { id: string; label: string; color: string; shape?: "line" | "box" }[]; hidden?: string[]; onToggle?: (id: string) => void }) {
  if (items.length < 2) return null
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Legend">
      {items.map((it) => {
        const off = hidden.includes(it.id)
        const key = (
          <>
            <span aria-hidden="true" className={cn("shrink-0 bg-(--c)", it.shape === "line" ? "h-0.5 w-3 rounded-full" : "size-2.5 rounded-xs")} style={{ "--c": it.color } as React.CSSProperties} />
            <span className={cn("text-sm", off ? "text-ink-3 line-through" : "text-ink-2")}>{it.label}</span>
          </>
        )
        return (
          <li key={it.id}>
            {onToggle ? (
              <button type="button" aria-pressed={!off} onClick={() => onToggle(it.id)} className="relative inline-flex items-center gap-control rounded-xs after:absolute after:-inset-1 hover:[&>span:last-child]:text-ink">{key}</button>
            ) : (
              <span className="inline-flex items-center gap-control">{key}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/* ---------------------------------------------------------------- cartesian engine */

type Kind = "line" | "area" | "bar" | "mixed"

export function CartesianChart({
  kind,
  x,
  series,
  stacked = false,
  height = 220,
  yLabel,
  format = fmtDefault,
  threshold,
  hidden = [],
  "aria-label": label,
}: {
  kind: Kind
  /** Category labels along the x axis, e.g. weeks. */
  x: string[]
  series: ChartSeries[]
  /** Area charts and bar charts can stack. */
  stacked?: boolean
  height?: number
  /** Unit of the y axis, shown in the summary and tooltip, e.g. “applications”. */
  yLabel?: string
  format?: (n: number) => string
  /** A reference line, such as a target. */
  threshold?: { value: number; label: string }
  /** Series ids hidden from the legend. Colours stay with their series. */
  hidden?: string[]
  "aria-label": string
}) {
  const [wrap, width] = useWidth<HTMLDivElement>()
  const [active, setActive] = React.useState<number | null>(null)
  const pad = { t: 8, r: 8, b: 22, l: 40 }
  const w = Math.max(0, width - pad.l - pad.r)
  const h = height - pad.t - pad.b
  const n = x.length
  const stackOn = stacked && (kind === "area" || kind === "bar")

  // Cumulative tops for stacking
  const on = (s: ChartSeries) => !hidden.includes(s.id)
  const stacks = series.map((_, si) => x.map((_, xi) => series.slice(0, si + 1).filter(on).reduce((a, s) => a + (s.data[xi] ?? 0), 0)))
  const prevStack = (si: number, xi: number) => series.slice(0, si).filter(on).reduce((a, s) => a + (s.data[xi] ?? 0), 0)
  const max = Math.max(threshold?.value ?? 0, ...(stackOn ? stacks[stacks.length - 1] ?? [0] : series.filter(on).flatMap((s) => s.data.map((v) => v ?? 0))))
  const ticks = niceTicks(max)
  const top = ticks[ticks.length - 1] || 1
  const y = (v: number) => pad.t + h - (v / top) * h
  const band = n ? w / n : 0
  const cx = (i: number) => pad.l + band * i + band / 2

  const barSeries = series.map((s, i) => ({ s, i })).filter(({ s }) => on(s) && (kind === "bar" || (kind === "mixed" && s.type !== "line")))
  const lineSeries = series.map((s, i) => ({ s, i })).filter(({ s }) => on(s) && (kind === "line" || kind === "area" || (kind === "mixed" && s.type === "line")))
  const groupW = Math.min(band * 0.7, 48)
  const barW = stackOn ? groupW : Math.max(2, (groupW - (barSeries.length - 1) * 2) / Math.max(1, barSeries.length))

  // Thin the x labels until they fit side by side (about 6.6px per character at 12px).
  const labelEvery = Math.max(n > 12 ? Math.ceil(n / 8) : 1, Math.ceil((Math.max(0, ...x.map((l) => l.length)) * 6.6 + 8) / (band || 1)))
  const path = (pts: [number, number][]) => pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`).join("")
  // Missing values break the line into runs: a gap, never a drop to zero.
  const gapPath = (pts: ([number, number] | null)[]) => {
    let d = "", pen = false
    for (const p of pts) {
      if (!p) { pen = false; continue }
      d += `${pen ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`
      pen = true
    }
    return d
  }
  const lastOf = (d: (number | null)[]) => { for (let k = d.length - 1; k >= 0; k--) if (d[k] !== null) return { v: d[k] as number, at: x[k] }; return null }
  const summary = `${label}. ${n} points from ${x[0]} to ${x[n - 1]}. ${series.filter(on).map((s) => { const l = lastOf(s.data); return `${s.label}: from ${s.data[0] === null ? "no data" : format(s.data[0] as number)} to ${l ? `${format(l.v)} at ${l.at}` : "no data"}` }).join("; ")}.`

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); setActive((a) => Math.min(n - 1, a === null ? 0 : a + 1)) }
    else if (e.key === "ArrowLeft") { e.preventDefault(); setActive((a) => Math.max(0, a === null ? n - 1 : a - 1)) }
    else if (e.key === "Home") { e.preventDefault(); setActive(0) }
    else if (e.key === "End") { e.preventDefault(); setActive(n - 1) }
    else if (e.key === "Escape") setActive(null)
  }

  return (
    <div ref={wrap} className="relative w-full" style={{ "--h": `${height}px` } as React.CSSProperties}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="group"
          tabIndex={0}
          aria-label={summary}
          aria-roledescription="chart"
          onKeyDown={onKey}
          onBlur={() => setActive(null)}
          onMouseLeave={() => setActive(null)}
          className="block overflow-visible rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {/* grid and y axis: recessive */}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={pad.l + w} y1={y(t)} y2={y(t)} className={t === 0 ? "stroke-line-strong" : "stroke-line"} strokeWidth={1} />
              <text x={pad.l - 6} y={y(t)} dy="0.32em" textAnchor="end" className="fill-ink-3 text-xs tabular">{format(t)}</text>
            </g>
          ))}
          {x.map((lbl, i) => i % labelEvery === 0 && (
            <text key={lbl + i} x={cx(i)} y={height - 6} textAnchor="middle" className="fill-ink-3 text-xs">{lbl}</text>
          ))}
          {threshold && (
            <g>
              <line x1={pad.l} x2={pad.l + w} y1={y(threshold.value)} y2={y(threshold.value)} className="stroke-ink-3" strokeWidth={1} strokeDasharray="4 3" />
              <text x={pad.l + w} y={y(threshold.value) - 4} textAnchor="end" className="fill-ink-2 text-xs">{threshold.label}</text>
            </g>
          )}
          {/* bars: 4px rounded data end, 2px gaps */}
          {barSeries.map(({ s, i }, bi) =>
            s.data.map((v, xi) => {
              if (v === null || v === 0) return null
              const base = stackOn ? prevStack(i, xi) : 0
              const yTop = y(base + v)
              const hgt = y(base) - yTop - (stackOn && base > 0 ? 2 : 0)
              const bx = stackOn ? cx(xi) - groupW / 2 : cx(xi) - groupW / 2 + bi * (barW + 2)
              const r = Math.min(4, barW / 2, Math.max(0, hgt))
              const d = `M${bx},${yTop + hgt}V${yTop + r}Q${bx},${yTop} ${bx + r},${yTop}H${bx + barW - r}Q${bx + barW},${yTop} ${bx + barW},${yTop + r}V${yTop + hgt}Z`
              return <path key={s.id + xi} d={d} fill={seriesColor(i)} opacity={active === null || active === xi ? 1 : 0.55} />
            }),
          )}
          {/* areas then lines: 2px, markers at the active point */}
          {kind === "area" && lineSeries.map(({ s, i }) => {
            // An unstacked area with gaps fills each run of values on its own.
            if (!stackOn && s.data.some((v) => v === null)) {
              const runs: number[][] = []
              s.data.forEach((v, xi) => { if (v === null) return; const last = runs[runs.length - 1]; if (last && last[last.length - 1] === xi - 1) last.push(xi); else runs.push([xi]) })
              return <g key={`a${s.id}`}>{runs.map((run) => <path key={run[0]} d={`${path(run.map((xi) => [cx(xi), y(s.data[xi] as number)]))}${path(run.map((xi) => [cx(xi), y(0)] as [number, number]).reverse()).replace("M", "L")}Z`} fill={seriesColor(i)} fillOpacity={0.18} />)}</g>
            }
            const topPts = x.map((_, xi) => [cx(xi), y(stackOn ? stacks[i][xi] : s.data[xi] ?? 0)] as [number, number])
            const basePts = x.map((_, xi) => [cx(xi), y(stackOn ? prevStack(i, xi) : 0)] as [number, number]).reverse()
            return <path key={`a${s.id}`} d={`${path(topPts)}${path(basePts).replace("M", "L")}Z`} fill={seriesColor(i)} fillOpacity={0.18} />
          })}
          {lineSeries.map(({ s, i }) => {
            const pts = x.map((_, xi) => (kind === "area" && stackOn ? [cx(xi), y(stacks[i][xi])] : s.data[xi] === null || s.data[xi] === undefined ? null : [cx(xi), y(s.data[xi] as number)]) as [number, number] | null)
            return <path key={`l${s.id}`} d={gapPath(pts)} fill="none" stroke={seriesColor(i)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          })}
          {/* crosshair + hit areas wider than the marks */}
          {active !== null && <line x1={cx(active)} x2={cx(active)} y1={pad.t} y2={pad.t + h} className="stroke-ink-3" strokeWidth={1} />}
          {active !== null && lineSeries.map(({ s, i }) => {
            const v = kind === "area" && stackOn ? stacks[i][active] : s.data[active]
            return v === null ? null : <circle key={`m${s.id}`} cx={cx(active)} cy={y(v)} r={4} fill={seriesColor(i)} className="stroke-surface" strokeWidth={2} />
          })}
          {x.map((_, xi) => (
            <rect key={`h${xi}`} x={pad.l + band * xi} y={pad.t} width={band} height={h} fill="transparent" onMouseEnter={() => setActive(xi)} />
          ))}
        </svg>
      )}
      {active !== null && width > 0 && (
        <div
          role="status"
          className="pointer-events-none absolute top-1 z-10 grid min-w-36 gap-1 rounded-md border border-line bg-surface px-2 py-2 text-sm shadow-pop left-(--x)"
          style={{ "--x": `${Math.min(Math.max(cx(active) + 12, 0), width - 160)}px` } as React.CSSProperties}
        >
          <span className="font-medium text-ink">{x[active]}</span>
          {series.map((s, i) => !on(s) ? null : (
            <span key={s.id} className="flex items-center gap-2">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-xs bg-(--c)" style={{ "--c": seriesColor(i) } as React.CSSProperties} />
              <span className="text-ink-2">{s.label}</span>
              <span className="tabular ml-auto pl-3 font-medium text-ink">{s.data[active] === null ? "No data" : format(s.data[active] as number)}{yLabel ? "" : ""}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/** Convenience: the table view for a cartesian chart. */
export const chartTable = (xLabel: string, x: string[], series: ChartSeries[]) => ({
  columns: [xLabel, ...series.map((s) => s.label)],
  rows: x.map((lbl, i) => [lbl, ...series.map((s) => s.data[i] ?? "")]),
})

/* ---------------------------------------------------------------- sparkline and stat */

export function Sparkline({ data, "aria-label": label, className }: { data: number[]; "aria-label": string; className?: string }) {
  // A sparkline shows shape, so it scales to its own low and high, not from zero.
  const max = Math.max(...data), min = Math.min(...data)
  const pts = data.map((v, i) => `${(i / Math.max(1, data.length - 1)) * 100},${28 - ((v - min) / (max - min || 1)) * 26}`).join(" ")
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" role="img" aria-label={label} className={cn("h-7 w-24", className)}>
      <polyline points={pts} fill="none" stroke="var(--color-c1)" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  )
}

export function StatCompare({ label, value, change, period, good, spark, className }: { label: string; value: string; change: string; period: string; good?: boolean; spark?: number[]; className?: string }) {
  const up = /^\+|↑/.test(change)
  return (
    <div data-slot="stat-compare" className={cn("grid gap-1", className)}>
      <span className="text-sm text-ink-2">{label}</span>
      <div className="flex items-end justify-between gap-3">
        <RollingNumber value={value} className="text-2xl font-semibold text-ink" />
        {spark && <Sparkline data={spark} aria-label={`${label} trend`} />}
      </div>
      <span className="text-sm text-ink-2">
        <span className={cn("font-medium", good === undefined ? "text-ink" : good ? "text-ok" : "text-bad")}>{up ? "↑" : "↓"} {change.replace(/^[+\-↑↓]\s?/, "")}</span> vs {period}
        {good !== undefined && <span className="sr-only">{good ? " (better)" : " (worse)"}</span>}
      </span>
    </div>
  )
}
