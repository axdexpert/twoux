/**
 * TwoUX charts, part two: the forms data-heavy B2B and finance screens need beyond charts.tsx.
 * Donut, heatmap, funnel, scatter, share bar, ranked list, change list, price chart, waterfall, bullet chart, treemap, sankey,
 * histogram, box plot and candlestick. Same rules as charts.tsx: own SVG, one axis, series colours
 * in fixed order (c1…c8), status colours only for good and bad, text never in a series colour,
 * one tab stop per chart with arrow keys between marks, and a table helper for every chart.
 */
import * as React from "react"
import { cn } from "../lib/cn"
import { niceTicks, seriesColor, Sparkline } from "./charts"
import { fmt, MINUS, pct, NEUTRAL, textW, svgCls, halo, useWidth, useActive, niceStep, Tip, type TipRow } from "../lib/chart-kit"

/* ---------------------------------------------------------------- shared */

/** "+£1,200" / "−£800": a real minus sign, never a hyphen. */
export const signed = (n: number, f: (n: number) => string = fmt) => `${n > 0 ? "+" : n < 0 ? MINUS : ""}${f(Math.abs(n))}`

/** Ticks for a range that need not start at zero. */
export function rangeTicks(min: number, max: number, count = 4) {
  if (max <= min) max = min + 1
  const step = niceStep((max - min) / count)
  const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step
  return Array.from({ length: Math.round((hi - lo) / step) + 1 }, (_, i) => +(lo + i * step).toFixed(10))
}

/** A legend whose keys mirror the marks: filled box, hollow box or line. */
export function KeyLegend({ items }: { items: { label: string; color: string; shape?: "box" | "hollow" | "line" }[] }) {
  if (items.length < 2) return null
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Legend">
      {items.map((it) => (
        <li key={it.label} className="inline-flex items-center gap-control text-sm text-ink-2">
          <span
            aria-hidden="true"
            className={cn("shrink-0", it.shape === "line" ? "h-3 w-0.5 rounded-full bg-(--c)" : it.shape === "hollow" ? "size-2.5 rounded-xs border-2 border-(--c)" : "size-2.5 rounded-xs bg-(--c)")}
            style={{ "--c": it.color } as React.CSSProperties}
          />
          {it.label}
        </li>
      ))}
    </ul>
  )
}

/** Rounded at the data end, square where the bar starts. */
function barPath(x: number, yTop: number, yBot: number, w: number, end: "top" | "bottom") {
  const h = Math.max(1, yBot - yTop)
  yBot = yTop + h
  const r = Math.min(4, w / 2, h)
  return end === "top"
    ? `M${x},${yBot}V${yTop + r}Q${x},${yTop} ${x + r},${yTop}H${x + w - r}Q${x + w},${yTop} ${x + w},${yTop + r}V${yBot}Z`
    : `M${x},${yTop}V${yBot - r}Q${x},${yBot} ${x + r},${yBot}H${x + w - r}Q${x + w},${yBot} ${x + w},${yBot - r}V${yTop}Z`
}

/* ---------------------------------------------------------------- change value */

/** A change shown with arrow and sign, coloured by whether the direction is good; the word is read out. */
export function ChangeValue({ value, format = (n) => `${n.toFixed(2)}%`, upIs = "good", className }: { value: number; format?: (n: number) => string; upIs?: "good" | "bad" | "neutral"; className?: string }) {
  const dir = value > 0 ? "up" : value < 0 ? "down" : "flat"
  const tone = upIs === "neutral" || dir === "flat" ? "text-ink-2" : (dir === "up") === (upIs === "good") ? "text-ok" : "text-bad"
  return (
    <span className={cn("tabular whitespace-nowrap", tone, className)}>
      <span aria-hidden="true">{dir === "up" ? "↑" : dir === "down" ? "↓" : "→"} {signed(value, format)}</span>
      <span className="sr-only">{dir === "flat" ? "unchanged" : `${dir} ${format(Math.abs(value))}`}</span>
    </span>
  )
}

/* ---------------------------------------------------------------- share bar */

export type SharePart = { id: string; label: string; value: number }
type FoldedPart = SharePart & { other?: number }

/** Keep the largest parts, fold the rest into “Other” so a bar never has more than `max` parts. */
export function foldParts<T extends SharePart>(parts: T[], max = 6, otherLabel = "Other"): (T | FoldedPart)[] {
  if (parts.length <= max) return parts
  const keep = new Set([...parts].sort((a, b) => b.value - a.value).slice(0, max - 1).map((p) => p.id))
  const rest = parts.filter((p) => !keep.has(p.id))
  return [...parts.filter((p) => keep.has(p.id)), { id: "__other", label: otherLabel, value: rest.reduce((a, p) => a + p.value, 0), other: rest.length }]
}

/** Table view for a share bar or treemap. */
export const shareTable = (parts: SharePart[], format: (n: number) => string = fmt, first = "Part") => {
  const sum = parts.reduce((a, p) => a + p.value, 0)
  return { columns: [first, "Value", "Share"], rows: parts.map((p) => [p.label, format(p.value), pct(p.value, sum)]) }
}

/**
 * One whole split into up to six parts, read at a glance. Thin (8px, figures in the legend above)
 * or tall (28px, share printed in each block where it fits, names in the legend).
 */
export function ShareBar({
  parts,
  max = 6,
  variant = "thin",
  format = fmt,
  showValue = false,
  "aria-label": label,
  className,
}: {
  parts: SharePart[]
  /** Parts past this fold into “Other”. */
  max?: number
  variant?: "thin" | "tall"
  format?: (n: number) => string
  /** Also print each part's amount in the legend (thin only). */
  showValue?: boolean
  "aria-label": string
  className?: string
}) {
  const [wrap, width] = useWidth<HTMLDivElement>()
  const items = foldParts(parts, max).filter((p) => p.value > 0)
  const sum = items.reduce((a, p) => a + p.value, 0) || 1
  const { active, setActive, onKey } = useActive(items.length)
  const color = (p: FoldedPart, i: number) => (p.other ? NEUTRAL : seriesColor(i))
  const tall = variant === "tall"
  let acc = 0
  const segs = items.map((p, i) => {
    const start = acc / sum
    acc += p.value
    return { p, i, start, share: p.value / sum }
  })
  const cur = active === null ? null : segs[active]
  const summary = `${label}. ${items.map((p) => `${p.label} ${pct(p.value, sum)} (${format(p.value)})`).join(", ")}.`
  return (
    <div className={cn("grid gap-2", className)}>
      <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-hidden="true">
        {segs.map(({ p, i }) => (
          <li key={p.id} className={cn("inline-flex items-center gap-control text-sm transition-opacity duration-(--duration-fast)", active !== null && active !== i && "opacity-60")} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}>
            <span className="size-2.5 shrink-0 rounded-xs bg-(--c)" style={{ "--c": color(p, i) } as React.CSSProperties} />
            <span className="text-ink-2">{p.label}</span>
            {!tall && <span className="tabular font-medium text-ink">{pct(p.value, sum)}</span>}
            {!tall && showValue && <span className="tabular text-ink-3">{format(p.value)}</span>}
          </li>
        ))}
      </ul>
      <div ref={wrap} className="relative">
        <div
          role="group"
          tabIndex={0}
          aria-roledescription="chart"
          aria-label={summary}
          onKeyDown={onKey}
          onBlur={() => setActive(null)}
          onMouseLeave={() => setActive(null)}
          className={cn("flex gap-0.5 rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", tall ? "h-7" : "h-2")}
        >
          {segs.map(({ p, i, share }) => {
            const w = share * width
            const lbl = pct(p.value, sum, 0)
            const fits = tall && w >= textW(lbl) + 12
            return (
              <span
                key={p.id}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "flex min-w-0.5 basis-0 grow-(--g) items-center bg-(--c) transition-opacity duration-(--duration-fast)",
                  tall ? "rounded-xs px-2" : "first:rounded-l-full last:rounded-r-full",
                  active !== null && active !== i && "opacity-55",
                )}
                style={{ "--g": p.value, "--c": color(p, i) } as React.CSSProperties}
              >
                {fits && <span aria-hidden="true" className={cn("tabular text-xs font-medium", "other" in p && p.other ? "text-surface" : i === 3 ? "text-neutral-950" : "text-white")}>{lbl}</span>}
              </span>
            )
          })}
        </div>
        {cur && width > 0 && (
          <Tip
            x={(cur.start + cur.share / 2) * width}
            y={tall ? 34 : 14}
            width={width}
            title={cur.p.label}
            rows={[
              { label: "Share", value: pct(cur.p.value, sum), color: color(cur.p, cur.i) },
              { label: "Value", value: format(cur.p.value) },
              ...((cur.p as FoldedPart).other ? [{ label: "Parts folded in", value: String((cur.p as FoldedPart).other) }] : []),
            ]}
          />
        )}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- ranked list */

export type RankedItem = {
  id: string
  label: string
  value: number
  /** Change since the comparison period, in the unit formatChange expects (percent by default). */
  change?: number
  spark?: number[]
  href?: string
  /** An icon in place of the colour dot. */
  icon?: React.ReactNode
  /** Series slot when the list is the legend of a chart; defaults to the row's position. */
  colorIndex?: number
}

/** Ranked rows with value and change. Beside a stacked chart it is the chart's legend, so dots follow the series colours. */
export function RankedList({
  items,
  format = fmt,
  formatChange = (n) => `${n.toFixed(1)}%`,
  upIs = "good",
  dots = true,
  onSelect,
  activeId,
  onActiveChange,
  "aria-label": label,
  className,
}: {
  items: RankedItem[]
  format?: (n: number) => string
  formatChange?: (n: number) => string
  upIs?: "good" | "bad" | "neutral"
  /** Show a series dot on each row (when the list is a chart legend). */
  dots?: boolean
  onSelect?: (item: RankedItem) => void
  /** Highlight a row, such as the series under the chart's crosshair. */
  activeId?: string | null
  onActiveChange?: (id: string | null) => void
  "aria-label": string
  className?: string
}) {
  return (
    <ol aria-label={label} className={cn("grid gap-px", className)}>
      {items.map((it, i) => {
        const body = (
          <>
            <span className="tabular w-4 shrink-0 text-right text-xs text-ink-3">{i + 1}</span>
            {it.icon ? <span aria-hidden="true" className="grid size-4 shrink-0 place-items-center text-ink-2 [&_svg]:size-4">{it.icon}</span>
              : dots ? <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-(--c)" style={{ "--c": seriesColor(it.colorIndex ?? i) } as React.CSSProperties} /> : null}
            <span className="min-w-0 flex-1 truncate text-ink">{it.label}</span>
            {it.spark && <Sparkline data={it.spark} aria-label={`${it.label} trend`} className="h-5 w-14 shrink-0 max-sm:hidden" />}
            <span className="tabular shrink-0 font-medium text-ink">{format(it.value)}</span>
            {it.change !== undefined && <ChangeValue value={it.change} format={formatChange} upIs={upIs} className="w-16 shrink-0 text-right text-xs" />}
          </>
        )
        const cls = cn(
          "flex h-8 w-full items-center gap-2 rounded-xs px-2 text-left text-sm transition-colors duration-(--duration-fast) hover:bg-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary",
          activeId === it.id && "bg-hover",
        )
        const hover = { onMouseEnter: () => onActiveChange?.(it.id), onMouseLeave: () => onActiveChange?.(null), onFocus: () => onActiveChange?.(it.id), onBlur: () => onActiveChange?.(null) }
        return (
          <li key={it.id}>
            {it.href ? <a href={it.href} className={cls} {...hover}>{body}</a>
              : onSelect ? <button type="button" className={cls} onClick={() => onSelect(it)} {...hover}>{body}</button>
              : <div className={cls} {...hover}>{body}</div>}
          </li>
        )
      })}
    </ol>
  )
}

/* ---------------------------------------------------------------- change list */

export type ChangeItem = { id: string; name: string; symbol?: string; value: number; unit?: string; change: number; spark?: number[]; href?: string }

/** Ticker rows: name and code, value with unit, change by arrow, sign and colour, optional sparkline. */
export function ChangeList({
  title,
  description,
  items,
  format = (n) => n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  formatChange = (n) => `${n.toFixed(2)}%`,
  upIs = "good",
  seeAll,
  level = 3,
  className,
}: {
  title: string
  description?: string
  /** Heading level of the title. Use 2 when the list sits straight under the page's h1, as on a dashboard. */
  level?: 2 | 3 | 4
  items: ChangeItem[]
  format?: (n: number) => string
  formatChange?: (n: number) => string
  upIs?: "good" | "bad" | "neutral"
  seeAll?: { href: string; label?: string }
  className?: string
}) {
  const id = React.useId()
  return (
    <section aria-labelledby={`${id}-t`} data-slot="change-list" className={cn("grid gap-2 rounded-sm border border-line bg-surface p-4 shadow-card", className)}>
      <header className="grid gap-0.5">
        {React.createElement(`h${level}`, { id: `${id}-t`, className: "text-md font-semibold text-ink" }, title)}
        {description && <p className="text-sm text-ink-2">{description}</p>}
      </header>
      <ul className="-mx-2 grid divide-y divide-line">
        {items.map((it) => {
          const body = (
            <>
              <span className="grid min-w-0 flex-1">
                <span className="truncate text-sm font-medium text-ink">{it.name}</span>
                {it.symbol && <span className="truncate text-xs text-ink-3">{it.symbol}</span>}
              </span>
              {it.spark && <Sparkline data={it.spark} aria-label={`${it.name} today`} className="h-6 w-16 shrink-0 max-sm:hidden" />}
              <span className="grid shrink-0 justify-items-end">
                <span className="tabular text-sm font-medium text-ink">{format(it.value)}{it.unit && <span className="font-normal text-ink-3">{it.unit.startsWith("%") ? "" : " "}{it.unit}</span>}</span>
                <ChangeValue value={it.change} format={formatChange} upIs={upIs} className="text-xs" />
              </span>
            </>
          )
          const cls = "flex min-h-11 items-center gap-3 rounded-xs px-2 py-2"
          return (
            <li key={it.id}>
              {it.href ? <a href={it.href} className={cn(cls, "transition-colors duration-(--duration-fast) hover:bg-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary")}>{body}</a> : <div className={cls}>{body}</div>}
            </li>
          )
        })}
      </ul>
      {seeAll && <a href={seeAll.href} className="justify-self-start text-sm font-medium text-primary-ink hover:underline">{seeAll.label ?? "See all"}</a>}
    </section>
  )
}

/* ---------------------------------------------------------------- price chart */

/**
 * One price over a day: line with a wash to the axis floor, last value tagged on the right axis,
 * an optional dashed reference (previous close) and a live dot. When the range is narrow the axis
 * does not start at zero, and the chart says so under the axis.
 */
export function PriceChart({
  x,
  data,
  height = 240,
  format = fmt,
  reference,
  live = false,
  baseline = "auto",
  valueLabel = "Price",
  "aria-label": label,
}: {
  /** Time labels for the whole session, e.g. 08:00 to 16:30. Later slots can be null in data. */
  x: string[]
  data: (number | null)[]
  height?: number
  format?: (n: number) => string
  reference?: { value: number; label: string }
  /** Pulse the last point while the market is open. Still under reduced motion. */
  live?: boolean
  /** auto: start at zero unless the range is narrow; zero: always; range: never. */
  baseline?: "auto" | "zero" | "range"
  valueLabel?: string
  "aria-label": string
}) {
  const [wrap, width] = useWidth<HTMLDivElement>()
  const n = x.length
  const vals = data.filter((v): v is number => v !== null)
  const last = data.reduce<number>((a, v, i) => (v === null ? a : i), -1)
  const { active, setActive, onKey } = useActive(last + 1)
  const firstV = vals[0] ?? 0, lastV = last >= 0 ? (data[last] as number) : 0
  const lo0 = Math.min(...vals, reference?.value ?? Infinity), hi0 = Math.max(...vals, reference?.value ?? -Infinity)
  const fromRange = baseline === "range" || (baseline === "auto" && lo0 > 0 && (hi0 - lo0) / hi0 < 0.5)
  const ticks = fromRange ? rangeTicks(lo0, hi0) : niceTicks(hi0)
  const lo = ticks[0], hi = ticks[ticks.length - 1]
  const tagW = Math.max(...ticks.map((t) => textW(format(t))), textW(format(lastV))) + 12
  const pad = { t: 10, r: tagW + 6, b: 22, l: 2 }
  const w = Math.max(0, width - pad.l - pad.r), h = height - pad.t - pad.b
  const sx = (i: number) => pad.l + (n <= 1 ? w / 2 : (i / (n - 1)) * w)
  const sy = (v: number) => pad.t + h - ((v - lo) / (hi - lo || 1)) * h
  // contiguous runs, so missing data stays a gap
  const runs: [number, number][][] = []
  data.forEach((v, i) => {
    if (v === null) return
    if (i === 0 || data[i - 1] === null) runs.push([])
    runs[runs.length - 1].push([sx(i), sy(v)])
  })
  const line = (pts: [number, number][]) => pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`).join("")
  const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(w / 64))))
  const tagY = sy(lastV)
  const cur = active !== null && data[active] !== null ? (data[active] as number) : null
  const base = reference?.value ?? firstV
  const summary = `${label}. ${x[0]} to ${x[Math.max(0, last)]}. Opened at ${format(firstV)}, last ${format(lastV)}, high ${format(Math.max(...vals))}, low ${format(Math.min(...vals))}.${fromRange ? ` The axis starts at ${format(lo)}, not zero.` : ""}`
  const onMove = (e: React.MouseEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const i = Math.round(((e.clientX - r.left) / (r.width || 1)) * (n - 1))
    setActive(Math.max(0, Math.min(last, i)))
  }
  return (
    <div className="grid gap-1">
      <div ref={wrap} className="relative w-full">
        {width > 0 && (
          <svg width={width} height={height} role="group" tabIndex={0} aria-roledescription="chart" aria-label={summary}
            onKeyDown={onKey}
            onBlur={() => setActive(null)} onMouseLeave={() => setActive(null)} className={svgCls}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={pad.l} x2={pad.l + w} y1={sy(t)} y2={sy(t)} className={t === lo ? "stroke-line-strong" : "stroke-line"} />
                {Math.abs(sy(t) - tagY) > 12 && <text x={pad.l + w + 8} y={sy(t)} dy="0.32em" className="fill-ink-3 text-xs tabular">{format(t)}</text>}
              </g>
            ))}
            {x.map((lbl, i) => i % every === 0 && (
              <text key={lbl + i} x={sx(i)} y={height - 6} textAnchor={i === 0 ? "start" : "middle"} className="fill-ink-3 text-xs tabular">{lbl}</text>
            ))}
            {reference && (
              <g>
                <line x1={pad.l} x2={pad.l + w} y1={sy(reference.value)} y2={sy(reference.value)} className="stroke-ink-3" strokeDasharray="4 3" />
                <text x={pad.l + 4} y={sy(reference.value) - 5} strokeWidth={3} className={cn("fill-ink-2 text-xs", halo)}>{reference.label} {format(reference.value)}</text>
              </g>
            )}
            {runs.map((pts, k) => (
              <path key={`a${k}`} d={`${line(pts)}L${pts[pts.length - 1][0]},${pad.t + h}L${pts[0][0]},${pad.t + h}Z`} fill="var(--color-c1)" fillOpacity={0.1} />
            ))}
            {runs.map((pts, k) => <path key={`l${k}`} d={line(pts)} fill="none" stroke="var(--color-c1)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />)}
            {last >= 0 && (
              <g>
                {live && <circle cx={sx(last)} cy={tagY} r={4} fill="var(--color-c1)" className="origin-center opacity-40 [transform-box:fill-box] motion-safe:animate-ping" />}
                <circle cx={sx(last)} cy={tagY} r={4} fill="var(--color-c1)" className="stroke-surface" strokeWidth={2} />
                <rect x={pad.l + w + 2} y={tagY - 9} width={tagW} height={18} rx={3} fill="var(--color-c1)" />
                <text x={pad.l + w + 8} y={tagY} dy="0.32em" className="fill-white text-xs font-medium tabular">{format(lastV)}</text>
              </g>
            )}
            {cur !== null && active !== null && (
              <g>
                <line x1={sx(active)} x2={sx(active)} y1={pad.t} y2={pad.t + h} className="stroke-ink-3" />
                <circle cx={sx(active)} cy={sy(cur)} r={4} fill="var(--color-c1)" className="stroke-surface" strokeWidth={2} />
              </g>
            )}
            <rect x={pad.l} y={pad.t} width={w} height={h} fill="transparent" onMouseMove={onMove} />
          </svg>
        )}
        {cur !== null && active !== null && width > 0 && (
          <Tip x={sx(active)} y={4} width={width} title={x[active]} rows={[
            { label: valueLabel, value: format(cur), color: "var(--color-c1)" },
            { label: `vs ${reference ? reference.label.toLowerCase() : "open"}`, value: `${signed(cur - base, format)} (${signed(((cur - base) / (base || 1)) * 100, (v) => `${v.toFixed(2)}%`)})` },
          ]} />
        )}
      </div>
      {fromRange && <p className="text-right text-xs text-ink-3">Axis starts at {format(lo)}, not zero</p>}
    </div>
  )
}

/* ---------------------------------------------------------------- waterfall */

export type WaterfallStep = { id: string; label: string; /** Change, or for a total its level (omit to use the running total). */ value?: number; total?: boolean }

function waterfallBars(steps: WaterfallStep[]) {
  let run = 0
  return steps.map((s) => {
    if (s.total) { const lvl = s.value ?? run; run = lvl; return { s, from: 0, to: lvl, delta: lvl, kind: "total" as const } }
    const v = s.value ?? 0, from = run
    run += v
    return { s, from, to: run, delta: v, kind: v >= 0 ? ("increase" as const) : ("decrease" as const) }
  })
}

export const waterfallTable = (steps: WaterfallStep[], format: (n: number) => string = fmt) => ({
  columns: ["Step", "Change", "Running total"],
  rows: waterfallBars(steps).map((b) => [b.s.label, b.kind === "total" ? "Total" : signed(b.delta, format), format(b.to)]),
})

/** Opening, increases, decreases, closing on one axis. Increases and decreases in two categorical colours with +/− labels; totals neutral. */
export function Waterfall({
  steps,
  height = 240,
  format = fmt,
  labels = { increase: "Increase", decrease: "Decrease", total: "Total" },
  "aria-label": label,
}: {
  steps: WaterfallStep[]
  height?: number
  format?: (n: number) => string
  labels?: { increase: string; decrease: string; total: string }
  "aria-label": string
}) {
  const [wrap, width] = useWidth<HTMLDivElement>()
  const bars = waterfallBars(steps)
  const n = bars.length
  const { active, setActive, onKey } = useActive(n)
  const lo0 = Math.min(0, ...bars.map((b) => Math.min(b.from, b.to))), hi0 = Math.max(...bars.map((b) => Math.max(b.from, b.to)))
  const ticks = lo0 < 0 ? rangeTicks(lo0, hi0) : niceTicks(hi0)
  const lo = ticks[0], hi = ticks[ticks.length - 1]
  const padL = Math.max(...ticks.map((t) => textW(format(t)))) + 10
  const band = n ? Math.max(0, width - padL - 4) / n : 0
  const pad = { t: 18, r: 4, b: band > 0 && band < 64 && Math.max(...bars.map((b) => b.s.label.length)) * 6.4 + 4 > band ? 36 : 22, l: padL }
  const w = Math.max(0, width - pad.l - pad.r), h = height - pad.t - pad.b
  const bw = Math.min(band * 0.6, 36)
  const sy = (v: number) => pad.t + h - ((v - lo) / (hi - lo || 1)) * h
  const bx = (i: number) => pad.l + band * i + (band - bw) / 2
  const colour = { increase: "var(--color-c1)", decrease: "var(--color-c2)", total: NEUTRAL }
  const stagger = band > 0 && Math.max(...bars.map((b) => b.s.label.length)) * 6.4 + 4 > band && band < 64
  const maxChars = Math.max(2, Math.floor(((stagger ? band * 2 : band) - 6) / 6.4))
  const short = (s: string) => (s.length > maxChars ? `${s.slice(0, maxChars - 1)}…` : s)
  const summary = `${label}. ${bars.map((b) => `${b.s.label} ${b.kind === "total" ? format(b.to) : signed(b.delta, format)}`).join(", ")}.`
  const cur = active === null ? null : bars[active]
  return (
    <div className="grid gap-3">
      <div ref={wrap} className="relative w-full">
        {width > 0 && (
          <svg width={width} height={height} role="group" tabIndex={0} aria-roledescription="chart" aria-label={summary} onKeyDown={onKey} onBlur={() => setActive(null)} onMouseLeave={() => setActive(null)} className={svgCls}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={pad.l} x2={pad.l + w} y1={sy(t)} y2={sy(t)} className={t === 0 ? "stroke-line-strong" : "stroke-line"} />
                <text x={pad.l - 6} y={sy(t)} dy="0.32em" textAnchor="end" className="fill-ink-3 text-xs tabular">{format(t)}</text>
              </g>
            ))}
            {bars.map((b, i) => i < n - 1 && (
              <line key={`c${i}`} x1={bx(i) + bw} x2={bx(i + 1)} y1={sy(b.to)} y2={sy(b.to)} className="stroke-ink-3" strokeOpacity={0.6} />
            ))}
            {bars.map((b, i) => {
              const top = sy(Math.max(b.from, b.to)), bot = sy(Math.min(b.from, b.to))
              const txt = b.kind === "total" ? format(b.to) : signed(b.delta, format)
              const fits = textW(txt) <= band - 2
              const below = b.kind === "decrease" && bot + 14 < pad.t + h
              return (
                <g key={b.s.id} onMouseEnter={() => setActive(i)} className={cn("transition-opacity duration-(--duration-fast)", active !== null && active !== i && "opacity-55")}>
                  <rect x={pad.l + band * i} y={pad.t} width={band} height={h} fill="transparent" />
                  <path d={barPath(bx(i), top, bot, bw, b.kind === "decrease" ? "bottom" : "top")} fill={colour[b.kind]} />
                  {fits && <text x={bx(i) + bw / 2} y={below ? bot + 12 : top - 5} textAnchor="middle" className="fill-ink-2 text-xs font-medium tabular">{txt}</text>}
                  <text x={pad.l + band * i + band / 2} y={height - 6 - (stagger && i % 2 === 0 ? 14 : 0)} textAnchor="middle" className="fill-ink-3 text-xs">{short(b.s.label)}</text>
                </g>
              )
            })}
          </svg>
        )}
        {cur && active !== null && width > 0 && (
          <Tip x={bx(active) + bw} y={Math.max(0, sy(Math.max(cur.from, cur.to)) - 20)} width={width} title={cur.s.label} rows={
            cur.kind === "total"
              ? [{ label: labels.total, value: format(cur.to), color: NEUTRAL }]
              : [{ label: labels[cur.kind], value: signed(cur.delta, format), color: colour[cur.kind] }, { label: "Running total", value: format(cur.to) }]
          } />
        )}
      </div>
      <KeyLegend items={[{ label: labels.increase, color: colour.increase }, { label: labels.decrease, color: colour.decrease }, { label: labels.total, color: NEUTRAL }]} />
    </div>
  )
}

/* ---------------------------------------------------------------- bullet chart */

export type BulletRow = {
  id: string
  label: string
  value: number
  target: number
  /** Upper edges of the qualitative bands, ascending, e.g. [300000, 400000, 500000]. */
  bands: number[]
}
const BAND_FILL = ["bg-input", "bg-line-strong", "bg-hover", "bg-surface-2"]

function BulletRowView({ r, bandLabels, format }: { r: BulletRow; bandLabels: string[]; format: (n: number) => string }) {
  const [wrap, width] = useWidth<HTMLDivElement>()
  const [on, setOn] = React.useState(false)
  const domain = Math.max(r.value, r.target, ...r.bands)
  const ticks = niceTicks(domain, Math.max(2, Math.min(5, Math.floor(width / 72)))).filter((t) => t <= domain)
  const top = domain || 1
  const p = (v: number) => `${Math.min(100, Math.max(0, (v / top) * 100))}%`
  const band = Math.max(0, r.bands.findIndex((b) => r.value <= b))
  const bandName = bandLabels[band] ?? bandLabels[bandLabels.length - 1]
  const of = pct(r.value, r.target, 0)
  const desc = `${r.label}: ${format(r.value)} against a target of ${format(r.target)}, ${of} of target, in the ${bandName.toLowerCase()} band.`
  return (
    <li tabIndex={0} aria-label={desc} onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)} onFocus={() => setOn(true)} onBlur={() => setOn(false)}
      className="relative grid gap-1 rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
      <div className="flex items-baseline justify-between gap-3 text-sm" aria-hidden="true">
        <span className="min-w-0 truncate text-ink-2">{r.label}</span>
        <span className="tabular shrink-0"><span className="font-medium text-ink">{format(r.value)}</span><span className="text-ink-3"> of {format(r.target)}</span></span>
      </div>
      <div ref={wrap} className="relative h-6" aria-hidden="true">
        {r.bands.map((b, i) => {
          const prev = i ? r.bands[i - 1] : 0
          return <span key={i} className={cn("absolute inset-y-0 left-(--l) w-(--w) first:rounded-l-xs", BAND_FILL[i], i === r.bands.length - 1 && "rounded-r-xs")} style={{ "--l": p(prev), "--w": `calc(${p(b)} - ${p(prev)})` } as React.CSSProperties} />
        })}
        <span className="absolute top-2 left-0 h-2 w-(--w) rounded-r-xs bg-c1" style={{ "--w": p(r.value) } as React.CSSProperties} />
        <span className="absolute inset-y-0.5 left-(--l) w-0.5 -translate-x-1/2 rounded-full bg-ink" style={{ "--l": p(r.target) } as React.CSSProperties} />
      </div>
      <div className="relative h-4 text-xs text-ink-3" aria-hidden="true">
        {ticks.map((t, i) => (
          <span key={t} className={cn("tabular absolute top-0 left-(--l) whitespace-nowrap", i === 0 ? "" : t / top > 0.9 ? "-translate-x-full" : "-translate-x-1/2")} style={{ "--l": p(t) } as React.CSSProperties}>{format(t)}</span>
        ))}
      </div>
      {on && width > 0 && (
        <Tip x={(Math.min(r.target, top) / top) * width} y={52} width={width} title={r.label} rows={[
          { label: "Actual", value: format(r.value), color: "var(--color-c1)" },
          { label: "Target", value: format(r.target), color: "var(--color-ink)" },
          { label: "Of target", value: of },
          { label: "Band", value: bandName },
        ]} />
      )}
    </li>
  )
}

/** Actual against target over qualitative bands in neutral steps. The alternative to a gauge. */
export function BulletChart({ rows, bandLabels = ["Poor", "Satisfactory", "Good"], format = fmt, "aria-label": label }: { rows: BulletRow[]; bandLabels?: string[]; format?: (n: number) => string; "aria-label": string }) {
  return (
    <div className="grid gap-4">
      <ul aria-label={label} className="grid gap-4">
        {rows.map((r) => <BulletRowView key={r.id} r={r} bandLabels={bandLabels} format={format} />)}
      </ul>
      <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Legend">
        <li className="inline-flex items-center gap-control text-sm text-ink-2"><span aria-hidden="true" className="h-2 w-3 rounded-xs bg-c1" />Actual</li>
        <li className="inline-flex items-center gap-control text-sm text-ink-2"><span aria-hidden="true" className="h-3 w-0.5 rounded-full bg-ink" />Target</li>
        {bandLabels.slice(0, Math.max(...rows.map((r) => r.bands.length))).map((b, i) => (
          <li key={b} className="inline-flex items-center gap-control text-sm text-ink-2"><span aria-hidden="true" className={cn("size-2.5 rounded-xs", BAND_FILL[i])} />{b}</li>
        ))}
      </ul>
    </div>
  )
}

/* ---------------------------------------------------------------- treemap */

export type TreemapItem = SharePart & { /** Up to eight parent groups, each its own colour with a legend. */ group?: string }
type Rect = { x: number; y: number; w: number; h: number }

function squarify(areas: { i: number; a: number }[], r: Rect) {
  const out: (Rect & { i: number })[] = []
  let rect = { ...r }
  let row: { i: number; a: number }[] = []
  const worst = (rw: { a: number }[], len: number) => {
    const s = rw.reduce((x, it) => x + it.a, 0)
    const mx = Math.max(...rw.map((it) => it.a)), mn = Math.min(...rw.map((it) => it.a))
    return Math.max((len * len * mx) / (s * s), (s * s) / (len * len * mn))
  }
  const place = () => {
    const s = row.reduce((x, it) => x + it.a, 0)
    if (rect.w >= rect.h) {
      const cw = s / rect.h
      let yy = rect.y
      for (const it of row) { const hh = it.a / cw; out.push({ i: it.i, x: rect.x, y: yy, w: cw, h: hh }); yy += hh }
      rect = { x: rect.x + cw, y: rect.y, w: rect.w - cw, h: rect.h }
    } else {
      const rh = s / rect.w
      let xx = rect.x
      for (const it of row) { const ww = it.a / rh; out.push({ i: it.i, x: xx, y: rect.y, w: ww, h: rh }); xx += ww }
      rect = { x: rect.x, y: rect.y + rh, w: rect.w, h: rect.h - rh }
    }
    row = []
  }
  const rest = [...areas]
  while (rest.length) {
    const len = Math.min(rect.w, rect.h)
    if (!row.length || worst([...row, rest[0]], len) <= worst(row, len)) row.push(rest.shift()!)
    else place()
  }
  if (row.length) place()
  return out
}

/** Break a label into lines that fit; an empty result means a single word does not fit. */
function wrapLabel(label: string, width: number) {
  const out: string[] = []
  for (const word of label.split(" ")) {
    if (textW(word) > width) return []
    const last = out[out.length - 1]
    if (last !== undefined && textW(`${last} ${word}`) <= width) out[out.length - 1] = `${last} ${word}`
    else out.push(word)
  }
  return out
}

/** Squarified treemap: area by value, labels only where they fit, value in the tooltip, at most `max` tiles then Other. */
export function Treemap({ items, max = 12, height = 260, format = fmt, "aria-label": label }: { items: TreemapItem[]; max?: number; height?: number; format?: (n: number) => string; "aria-label": string }) {
  const [wrap, width] = useWidth<HTMLDivElement>()
  const folded = foldParts(items, max).filter((p) => p.value > 0) as (TreemapItem & { other?: number })[]
  const tiles = [...folded].sort((a, b) => (a.other ? 1 : b.other ? -1 : b.value - a.value))
  const groups = [...new Set(items.map((it) => it.group).filter((g): g is string => !!g))].slice(0, 8)
  const sum = tiles.reduce((a, t) => a + t.value, 0) || 1
  const { active, setActive, onKey } = useActive(tiles.length)
  const rects = width > 0 ? squarify(tiles.map((t, i) => ({ i, a: (t.value / sum) * width * height })), { x: 0, y: 0, w: width, h: height }) : []
  const slot = (t: (typeof tiles)[number]) => (t.other ? -1 : t.group ? groups.indexOf(t.group) : 0)
  const fill = (s: number) => (s < 0 ? NEUTRAL : seriesColor(s))
  const ink = (s: number) => (s < 0 ? "fill-surface" : s === 3 ? "fill-neutral-950" : "fill-white")
  const curR = active === null ? null : rects.find((r) => r.i === active)
  const cur = active === null ? null : tiles[active]
  const summary = `${label}. ${tiles.map((t) => `${t.label} ${format(t.value)} (${pct(t.value, sum)})`).join(", ")}.`
  return (
    <div className="grid gap-3">
      <div ref={wrap} className="relative w-full">
        {width > 0 && (
          <svg width={width} height={height} role="group" tabIndex={0} aria-roledescription="chart" aria-label={summary} onKeyDown={onKey} onBlur={() => setActive(null)} onMouseLeave={() => setActive(null)} className={svgCls}>
            {rects.map((r) => {
              const t = tiles[r.i], s = slot(t)
              const x = r.x + 1, y = r.y + 1, w = Math.max(0, r.w - 2), h = Math.max(0, r.h - 2)
              const share = pct(t.value, sum)
              const lines = wrapLabel(t.label, w - 12)
              const nameFits = lines.length > 0 && lines.length <= 2 && h >= 8 + lines.length * 14
              const shareFits = nameFits && h >= 24 + lines.length * 14 && w >= textW(share) + 12
              return (
                <g key={t.id} onMouseEnter={() => setActive(r.i)} className={cn("transition-opacity duration-(--duration-fast)", active !== null && active !== r.i && "opacity-60")}>
                  <rect x={x} y={y} width={w} height={h} rx={3} fill={fill(s)} />
                  {nameFits && <text x={x + 6} y={y + 16} className={cn("text-xs font-medium", ink(s))}>{lines.map((ln, k) => <tspan key={k} x={x + 6} dy={k ? 14 : 0}>{ln}</tspan>)}</text>}
                  {shareFits && <text x={x + 6} y={y + 17 + lines.length * 14} className={cn("text-xs tabular opacity-90", ink(s))}>{share}</text>}
                </g>
              )
            })}
          </svg>
        )}
        {cur && curR && (
          <Tip x={curR.x + curR.w / 2} y={Math.min(curR.y + 8, height - 90)} width={width} title={cur.label} rows={[
            { label: "Value", value: format(cur.value), color: fill(slot(cur)) },
            { label: "Share", value: pct(cur.value, sum) },
            ...(cur.group ? [{ label: "Group", value: cur.group }] : []),
            ...(cur.other ? [{ label: "Items folded in", value: String(cur.other) }] : []),
          ]} />
        )}
      </div>
      <KeyLegend items={groups.map((g, i) => ({ label: g, color: seriesColor(i) }))} />
    </div>
  )
}

/* ---------------------------------------------------------------- sankey */

export type SankeyNode = { id: string; label: string }
export type SankeyLink = { source: string; target: string; value: number }

export const sankeyTable = (nodes: SankeyNode[], links: SankeyLink[], format: (n: number) => string = fmt) => {
  const name = (id: string) => nodes.find((n) => n.id === id)?.label ?? id
  return { columns: ["From", "To", "Value"], rows: links.map((l) => [name(l.source), name(l.target), format(l.value)]) }
}

/** Left-to-right flows in two or three columns. Link width by value; hover or arrow keys highlight a path. */
export function SankeyChart({ nodes, links, height = 280, format = fmt, "aria-label": label }: { nodes: SankeyNode[]; links: SankeyLink[]; height?: number; format?: (n: number) => string; "aria-label": string }) {
  const [wrap, width] = useWidth<HTMLDivElement>()
  const [hoverNode, setHoverNode] = React.useState<string | null>(null)
  // columns: longest path from a source
  const col: Record<string, number> = {}
  nodes.forEach((n) => (col[n.id] = 0))
  for (let k = 0; k < nodes.length; k++) for (const l of links) col[l.target] = Math.max(col[l.target], col[l.source] + 1)
  const C = Math.max(...Object.values(col)) + 1
  const inSum = (id: string) => links.filter((l) => l.target === id).reduce((a, l) => a + l.value, 0)
  const outSum = (id: string) => links.filter((l) => l.source === id).reduce((a, l) => a + l.value, 0)
  const val = (id: string) => Math.max(inSum(id), outSum(id))
  const cols = Array.from({ length: C }, (_, c) => nodes.filter((n) => col[n.id] === c))
  const gap = 16, nodeW = 8, pad = { t: 4, b: 4 }
  const H = height - pad.t - pad.b
  const k = Math.min(...cols.map((cn_) => (H - gap * (cn_.length - 1)) / (cn_.reduce((a, n) => a + val(n.id), 0) || 1)))
  const colX = (c: number) => (C <= 1 ? 0 : (c / (C - 1)) * (width - nodeW))
  const pos: Record<string, { x: number; y: number; h: number }> = {}
  cols.forEach((cn_, c) => {
    const used = cn_.reduce((a, n) => a + val(n.id) * k, 0) + gap * (cn_.length - 1)
    let y = pad.t + (H - used) / 2
    cn_.forEach((n) => { const h = Math.max(2, val(n.id) * k); pos[n.id] = { x: colX(c), y, h }; y += h + gap })
  })
  const colTotal = (c: number) => cols[c].reduce((a, n) => a + val(n.id), 0)
  // link offsets
  const order = links.map((l, i) => ({ l, i })).sort((a, b) => col[a.l.source] - col[b.l.source] || pos[a.l.source].y - pos[b.l.source].y || pos[a.l.target].y - pos[b.l.target].y)
  const outOff: Record<string, number> = {}, inOff: Record<string, number> = {}
  const geo: { i: number; d: string; mid: [number, number] }[] = []
  if (width > 0) {
    const bySrc = [...order].sort((a, b) => pos[a.l.target].y - pos[b.l.target].y)
    const sy0: Record<number, number> = {}, ty0: Record<number, number> = {}
    for (const { l, i } of bySrc) { sy0[i] = pos[l.source].y + (outOff[l.source] ?? 0); outOff[l.source] = (outOff[l.source] ?? 0) + l.value * k }
    const byTgt = [...order].sort((a, b) => pos[a.l.source].y - pos[b.l.source].y)
    for (const { l, i } of byTgt) { ty0[i] = pos[l.target].y + (inOff[l.target] ?? 0); inOff[l.target] = (inOff[l.target] ?? 0) + l.value * k }
    for (const { l, i } of order) {
      const t = l.value * k, x0 = pos[l.source].x + nodeW, x1 = pos[l.target].x, xm = (x0 + x1) / 2
      const a = sy0[i], b = ty0[i]
      geo.push({ i, d: `M${x0},${a}C${xm},${a} ${xm},${b} ${x1},${b}L${x1},${b + t}C${xm},${b + t} ${xm},${a + t} ${x0},${a + t}Z`, mid: [xm, (a + b) / 2 + t / 2] })
    }
  }
  const { active, setActive, onKey } = useActive(geo.length)
  const activeLink = active === null ? null : geo[active]?.i ?? null
  // highlighted path: a link, or every link through a node (upstream and downstream)
  const lit = new Set<number>()
  if (activeLink !== null) lit.add(activeLink)
  if (hoverNode) {
    const walk = (id: string, dir: "up" | "down") => links.forEach((l, i) => {
      if (dir === "down" && l.source === id && !lit.has(i)) { lit.add(i); walk(l.target, "down") }
      if (dir === "up" && l.target === id && !lit.has(i)) { lit.add(i); walk(l.source, "up") }
    })
    walk(hoverNode, "down"); walk(hoverNode, "up")
  }
  const any = lit.size > 0
  const litNodes = new Set([...lit].flatMap((i) => [links[i].source, links[i].target]))
  const name = (id: string) => nodes.find((n) => n.id === id)?.label ?? id
  const roomy = C <= 1 || (width - nodeW) / (C - 1) >= 230
  const cur = activeLink === null ? null : links[activeLink]
  const curGeo = active === null ? null : geo[active]
  const summary = `${label}. ${links.map((l) => `${name(l.source)} to ${name(l.target)}: ${format(l.value)}`).join("; ")}.`
  return (
    <div ref={wrap} className="relative w-full">
      {width > 0 && (
        <svg width={width} height={height} role="group" tabIndex={0} aria-roledescription="chart" aria-label={summary} onKeyDown={onKey} onBlur={() => setActive(null)} onMouseLeave={() => { setActive(null); setHoverNode(null) }} className={svgCls}>
          {geo.map((g, gi) => (
            <path key={g.i} d={g.d} fill="var(--color-c1)" fillOpacity={!any ? 0.2 : lit.has(g.i) ? 0.45 : 0.06} onMouseEnter={() => { setHoverNode(null); setActive(gi) }} className="transition-[fill-opacity] duration-(--duration-fast)" />
          ))}
          {nodes.map((n) => {
            const p = pos[n.id], c = col[n.id], lastCol = c === C - 1 && C > 1
            const share = pct(val(n.id), colTotal(c), 0)
            return (
              <g key={n.id} onMouseEnter={() => { setActive(null); setHoverNode(n.id) }} className={cn("transition-opacity duration-(--duration-fast)", any && !litNodes.has(n.id) && "opacity-50")}>
                <rect x={p.x} y={p.y} width={nodeW} height={p.h} rx={2} fill="var(--color-c1)" />
                <rect x={p.x - 4} y={p.y - 4} width={nodeW + 8} height={p.h + 8} fill="transparent" />
                <text x={lastCol ? p.x - 6 : p.x + nodeW + 6} y={p.y + p.h / 2} dy="0.32em" textAnchor={lastCol ? "end" : "start"} strokeWidth={3} className={cn("text-xs", halo)}>
                  <tspan className="fill-ink font-medium">{n.label}</tspan>
                  {roomy && <tspan className="fill-ink-2 tabular"> {format(val(n.id))} · {share}</tspan>}
                </text>
              </g>
            )
          })}
        </svg>
      )}
      {cur && curGeo && (
        <Tip x={curGeo.mid[0]} y={Math.min(curGeo.mid[1], height - 80)} width={width} title={`${name(cur.source)} → ${name(cur.target)}`} rows={[
          { label: "Value", value: format(cur.value), color: "var(--color-c1)" },
          { label: `Of ${name(cur.source)}`, value: pct(cur.value, outSum(cur.source) || 1) },
        ]} />
      )}
      {hoverNode && !cur && pos[hoverNode] && (
        <Tip x={pos[hoverNode].x + nodeW} y={Math.min(pos[hoverNode].y, height - 80)} width={width} title={name(hoverNode)} rows={[
          { label: "Total", value: format(val(hoverNode)), color: "var(--color-c1)" },
          { label: "Of column", value: pct(val(hoverNode), colTotal(col[hoverNode])) },
        ]} />
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- histogram */

export type Bin = { from: number; to: number; count: number }

/** Count values into equal, round-edged bins. */
export function binValues(values: number[], { bins = 10, binWidth, start }: { bins?: number; binWidth?: number; start?: number } = {}): Bin[] {
  if (!values.length) return []
  const lo = Math.min(...values), hi = Math.max(...values)
  const step = binWidth ?? niceStep((hi - lo) / bins || 1)
  const s0 = start ?? Math.floor(lo / step) * step
  const n = Math.max(1, Math.floor((hi - s0) / step) + 1)
  const out = Array.from({ length: n }, (_, i) => ({ from: +(s0 + i * step).toFixed(10), to: +(s0 + (i + 1) * step).toFixed(10), count: 0 }))
  for (const v of values) out[Math.min(n - 1, Math.max(0, Math.floor((v - s0) / step)))].count++
  return out
}

export const histogramTable = (bins: Bin[], format: (n: number) => string = fmt, first = "Range") => ({
  columns: [first, "Count"],
  rows: bins.map((b) => [`${format(b.from)} to ${format(b.to)}`, b.count]),
})

/** How values spread: touching columns, one per bin, counted on one axis. */
export function Histogram({
  bins,
  height = 220,
  format = fmt,
  xTitle,
  countLabel = "records",
  marker,
  "aria-label": label,
}: {
  bins: Bin[]
  height?: number
  /** Formats bin edges. */
  format?: (n: number) => string
  xTitle: string
  /** Plural noun for what is counted, e.g. “roles”. */
  countLabel?: string
  /** A dashed reference such as the median. */
  marker?: { value: number; label: string }
  "aria-label": string
}) {
  const [wrap, width] = useWidth<HTMLDivElement>()
  const n = bins.length
  const { active, setActive, onKey } = useActive(n)
  const ticks = niceTicks(Math.max(...bins.map((b) => b.count), 1))
  const top = ticks[ticks.length - 1] || 1
  const lo = bins[0]?.from ?? 0, hi = bins[n - 1]?.to ?? 1
  const pad = { t: 16, r: textW(format(hi)) / 2 + 2, b: 38, l: Math.max(...ticks.map((t) => textW(fmt(t)))) + 10 }
  const w = Math.max(0, width - pad.l - pad.r), h = height - pad.t - pad.b
  const band = n ? w / n : 0
  const sx = (v: number) => pad.l + ((v - lo) / (hi - lo || 1)) * w
  const sy = (v: number) => pad.t + h - (v / top) * h
  const edges = [...bins.map((b) => b.from), hi]
  const labelEvery = Math.max(1, Math.ceil((Math.max(...edges.map((e) => textW(format(e)))) + 12) / (band || 1)))
  const cur = active === null ? null : bins[active]
  const total = bins.reduce((a, b) => a + b.count, 0)
  const peak = bins.reduce((a, b) => (b.count > a.count ? b : a), bins[0] ?? { from: 0, to: 0, count: 0 })
  const summary = `${label}. ${total} ${countLabel} in ${n} bins from ${format(lo)} to ${format(hi)}. Most common: ${format(peak.from)} to ${format(peak.to)} with ${peak.count}.`
  return (
    <div ref={wrap} className="relative w-full">
      {width > 0 && (
        <svg width={width} height={height} role="group" tabIndex={0} aria-roledescription="chart" aria-label={summary} onKeyDown={onKey} onBlur={() => setActive(null)} onMouseLeave={() => setActive(null)} className={svgCls}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={pad.l + w} y1={sy(t)} y2={sy(t)} className={t === 0 ? "stroke-line-strong" : "stroke-line"} />
              <text x={pad.l - 6} y={sy(t)} dy="0.32em" textAnchor="end" className="fill-ink-3 text-xs tabular">{fmt(t)}</text>
            </g>
          ))}
          {edges.map((e, i) => i % labelEvery === 0 && (
            <text key={e} x={sx(e)} y={pad.t + h + 14} textAnchor={i === 0 ? "start" : "middle"} className="fill-ink-3 text-xs tabular">{format(e)}</text>
          ))}
          <text x={pad.l + w / 2} y={height - 4} textAnchor="middle" className="fill-ink-2 text-xs">{xTitle}</text>
          {bins.map((b, i) => (
            <g key={i} onMouseEnter={() => setActive(i)} className={cn("transition-opacity duration-(--duration-fast)", active !== null && active !== i && "opacity-55")}>
              <rect x={pad.l + band * i} y={pad.t} width={band} height={h} fill="transparent" />
              {b.count > 0 && <path d={barPath(pad.l + band * i + 1, sy(b.count), sy(0), Math.max(1, band - 2), "top")} fill="var(--color-c1)" />}
            </g>
          ))}
          {marker && (
            <g>
              <line x1={sx(marker.value)} x2={sx(marker.value)} y1={pad.t - 4} y2={pad.t + h} className="stroke-ink" strokeDasharray="4 3" />
              <text x={sx(marker.value) + 4} y={pad.t - 6} strokeWidth={3} className={cn("fill-ink-2 text-xs", halo)}>{marker.label}</text>
            </g>
          )}
        </svg>
      )}
      {cur && active !== null && (
        <Tip x={pad.l + band * (active + 1)} y={Math.max(0, sy(cur.count) - 30)} width={width} title={`${format(cur.from)} to ${format(cur.to)}`} rows={[
          { label: countLabel[0].toUpperCase() + countLabel.slice(1), value: fmt(cur.count), color: "var(--color-c1)" },
          { label: "Of all", value: pct(cur.count, total || 1) },
        ]} />
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- box plot */

export type BoxStats = { min: number; q1: number; median: number; q3: number; max: number; outliers: number[] }
const quantile = (s: number[], q: number) => {
  const p = (s.length - 1) * q, b = Math.floor(p)
  return s[b + 1] !== undefined ? s[b] + (p - b) * (s[b + 1] - s[b]) : s[b]
}
/** Median, quartiles, whiskers at 1.5 × IQR and the points beyond them. */
export function boxStats(values: number[]): BoxStats {
  const s = [...values].sort((a, b) => a - b)
  const q1 = quantile(s, 0.25), q3 = quantile(s, 0.75), iqr = q3 - q1
  const inside = s.filter((v) => v >= q1 - 1.5 * iqr && v <= q3 + 1.5 * iqr)
  return { min: inside[0] ?? q1, q1, median: quantile(s, 0.5), q3, max: inside[inside.length - 1] ?? q3, outliers: s.filter((v) => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr) }
}
export type BoxGroup = { id: string; label: string; values?: number[]; stats?: BoxStats }

export const boxTable = (groups: BoxGroup[], format: (n: number) => string = fmt, first = "Group") => ({
  columns: [first, "Lower whisker", "Q1", "Median", "Q3", "Upper whisker", "Outliers"],
  rows: groups.map((g) => { const s = g.stats ?? boxStats(g.values ?? []); return [g.label, format(s.min), format(s.q1), format(s.median), format(s.q3), format(s.max), s.outliers.length ? s.outliers.map(format).join(", ") : "None"] }),
})

/** Distributions side by side on one axis: box from Q1 to Q3, median line, whiskers, outlier dots. */
export function BoxPlot({ groups, format = fmt, xTitle, "aria-label": label }: { groups: BoxGroup[]; format?: (n: number) => string; xTitle: string; "aria-label": string }) {
  const [wrap, width] = useWidth<HTMLDivElement>()
  const stats = groups.map((g) => g.stats ?? boxStats(g.values ?? []))
  const n = groups.length
  const { active, setActive, onKey } = useActive(n)
  const all = stats.flatMap((s) => [s.min, s.max, ...s.outliers])
  const ticks = rangeTicks(Math.min(...all), Math.max(...all), Math.max(2, Math.min(6, Math.floor(width / 90))))
  const lo = ticks[0], hi = ticks[ticks.length - 1]
  const rowH = 36
  const pad = { t: 4, r: 12, b: 38, l: Math.min(140, Math.max(...groups.map((g) => textW(g.label))) + 12) }
  const height = pad.t + n * rowH + pad.b
  const w = Math.max(0, width - pad.l - pad.r)
  const sx = (v: number) => pad.l + ((v - lo) / (hi - lo || 1)) * w
  const cy = (i: number) => pad.t + rowH * i + rowH / 2
  const cur = active === null ? null : stats[active]
  const summary = `${label}. ${groups.map((g, i) => `${g.label}: median ${format(stats[i].median)}, middle half ${format(stats[i].q1)} to ${format(stats[i].q3)}${stats[i].outliers.length ? `, ${stats[i].outliers.length} outliers` : ""}`).join("; ")}.`
  return (
    <div className="grid gap-3">
      <div ref={wrap} className="relative w-full">
        {width > 0 && (
          <svg width={width} height={height} role="group" tabIndex={0} aria-roledescription="chart" aria-label={summary} onKeyDown={onKey} onBlur={() => setActive(null)} onMouseLeave={() => setActive(null)} className={svgCls}>
            {ticks.map((t, i) => (
              <g key={t}>
                <line x1={sx(t)} x2={sx(t)} y1={pad.t} y2={pad.t + n * rowH} className="stroke-line" />
                <text x={sx(t)} y={pad.t + n * rowH + 14} textAnchor={i === 0 ? "start" : i === ticks.length - 1 ? "end" : "middle"} className="fill-ink-3 text-xs tabular">{format(t)}</text>
              </g>
            ))}
            <text x={pad.l + w / 2} y={height - 4} textAnchor="middle" className="fill-ink-2 text-xs">{xTitle}</text>
            {groups.map((g, i) => {
              const s = stats[i], y = cy(i)
              return (
                <g key={g.id} onMouseEnter={() => setActive(i)} className={cn("transition-opacity duration-(--duration-fast)", active !== null && active !== i && "opacity-55")}>
                  <rect x={0} y={y - rowH / 2} width={width} height={rowH} fill="transparent" />
                  <text x={pad.l - 10} y={y} dy="0.32em" textAnchor="end" className="fill-ink-2 text-xs">{g.label}</text>
                  <line x1={sx(s.min)} x2={sx(s.q1)} y1={y} y2={y} className="stroke-ink-3" />
                  <line x1={sx(s.q3)} x2={sx(s.max)} y1={y} y2={y} className="stroke-ink-3" />
                  <line x1={sx(s.min)} x2={sx(s.min)} y1={y - 5} y2={y + 5} className="stroke-ink-3" />
                  <line x1={sx(s.max)} x2={sx(s.max)} y1={y - 5} y2={y + 5} className="stroke-ink-3" />
                  <rect x={sx(s.q1)} y={y - 9} width={Math.max(1, sx(s.q3) - sx(s.q1))} height={18} rx={3} fill="var(--color-c1)" fillOpacity={0.22} stroke="var(--color-c1)" strokeWidth={1.5} />
                  <line x1={sx(s.median)} x2={sx(s.median)} y1={y - 9} y2={y + 9} className="stroke-ink" strokeWidth={2} />
                  {s.outliers.map((o, k) => <circle key={k} cx={sx(o)} cy={y} r={3.5} fill="var(--color-c1)" className="stroke-surface" strokeWidth={1.5} />)}
                </g>
              )
            })}
          </svg>
        )}
        {cur && active !== null && (
          <Tip x={sx(cur.q3)} y={Math.max(0, cy(active) - 20)} width={width} title={groups[active].label} rows={[
            { label: "Median", value: format(cur.median), color: "var(--color-ink)" },
            { label: "Middle half", value: `${format(cur.q1)} to ${format(cur.q3)}`, color: "var(--color-c1)" },
            { label: "Whiskers", value: `${format(cur.min)} to ${format(cur.max)}` },
            { label: "Outliers", value: cur.outliers.length ? String(cur.outliers.length) : "None" },
          ]} />
        )}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-2" aria-label="Legend">
        <li className="inline-flex items-center gap-control"><span aria-hidden="true" className="h-2.5 w-4 rounded-xs border-2 border-c1 bg-c1/20" />Middle half (Q1 to Q3)</li>
        <li className="inline-flex items-center gap-control"><span aria-hidden="true" className="h-3 w-0.5 rounded-full bg-ink" />Median</li>
        <li className="inline-flex items-center gap-control"><span aria-hidden="true" className="h-px w-4 bg-ink-3" />Whiskers, 1.5 × IQR</li>
        <li className="inline-flex items-center gap-control"><span aria-hidden="true" className="size-2 rounded-full bg-c1" />Outlier</li>
      </ul>
    </div>
  )
}

/* ---------------------------------------------------------------- candlestick */

export type Candle = { t: string; o: number; h: number; l: number; c: number; v?: number }

export const candleTable = (candles: Candle[], format: (n: number) => string = fmt, formatVolume: (n: number) => string = fmt) => ({
  columns: ["Date", "Open", "High", "Low", "Close", "Change", ...(candles.some((k) => k.v !== undefined) ? ["Volume"] : [])],
  rows: candles.map((k) => [k.t, format(k.o), format(k.h), format(k.l), format(k.c), signed(k.c - k.o, format), ...(k.v !== undefined ? [formatVolume(k.v)] : [])]),
})

/**
 * Open, high, low, close per period. Up and down are two categorical colours and differ in fill too:
 * up hollow, down filled, so direction never rests on colour. Volume is a second chart below, never a second axis.
 */
export function CandlestickChart({
  candles,
  height = 240,
  volumeHeight = 64,
  format = fmt,
  formatVolume = (n) => n.toLocaleString("en-GB", { notation: "compact", maximumFractionDigits: 1 }),
  colors = "categorical",
  showLast = false,
  lastNote,
  live = false,
  volumeLabel = "Volume",
  "aria-label": label,
}: {
  candles: Candle[]
  height?: number
  /** "market" draws up in green and down in red, for trading screens where people expect it; up stays hollow and down filled either way. */
  colors?: "categorical" | "market"
  /** Tags the last close on the price axis, in the colour of the last candle. */
  showLast?: boolean
  /** A second line under the last-price tag, such as the time until the open candle closes ("12:41"). */
  lastNote?: string
  /** The last candle and the price tag ease to each new value, for a feed that updates every second. Off under reduced motion. */
  live?: boolean
  /** Names the volume chart with its unit, such as "Volume (BTC)". */
  volumeLabel?: string
  /** 0 hides the volume chart. */
  volumeHeight?: number
  format?: (n: number) => string
  formatVolume?: (n: number) => string
  "aria-label": string
}) {
  const [wrap, width] = useWidth<HTMLDivElement>()
  const n = candles.length
  const { active, setActive, onKey } = useActive(n)
  const ticks = rangeTicks(Math.min(...candles.map((k) => k.l)), Math.max(...candles.map((k) => k.h)))
  const lo = ticks[0], hi = ticks[ticks.length - 1]
  const showVol = volumeHeight > 0 && candles.some((k) => k.v !== undefined)
  const vTicks = niceTicks(Math.max(...candles.map((k) => k.v ?? 0), 1), 2)
  const vTop = vTicks[vTicks.length - 1] || 1
  const lastC = candles[n - 1]?.c ?? 0
  const axisW = Math.max(...ticks.map((t) => textW(format(t))), ...vTicks.map((t) => textW(formatVolume(t))), showLast ? textW(format(lastC)) + 6 : 0, lastNote ? textW(lastNote) + 6 : 0) + 10
  const ease = live ? "motion-safe:transition-all motion-safe:duration-(--duration-base) motion-safe:ease-(--ease-standard)" : undefined
  const pad = { t: 8, r: axisW, b: 22, l: 2 }
  const w = Math.max(0, width - pad.l - pad.r), h = height - pad.t - pad.b
  const band = n ? w / n : 0
  const bw = Math.max(3, Math.min(band * 0.6, 12))
  const cx = (i: number) => pad.l + band * i + band / 2
  const sy = (v: number) => pad.t + h - ((v - lo) / (hi - lo || 1)) * h
  const vh = volumeHeight - 8
  const vy = (v: number) => 4 + vh - (v / vTop) * vh
  const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(w / 64))))
  const [up, down] = colors === "market" ? ["var(--color-ok)", "var(--color-bad)"] : ["var(--color-c1)", "var(--color-c2)"]
  const cur = active === null ? null : candles[active]
  const first = candles[0], lastK = candles[n - 1]
  const summary = `${label}. ${n} periods from ${first?.t} to ${lastK?.t}. Opened at ${format(first?.o ?? 0)}, closed at ${format(lastK?.c ?? 0)}. High ${format(Math.max(...candles.map((k) => k.h)))}, low ${format(Math.min(...candles.map((k) => k.l)))}. The price axis starts at ${format(lo)}, not zero.`
  const hits = (hgt: number, y0: number) => candles.map((_, i) => <rect key={`h${i}`} x={pad.l + band * i} y={y0} width={band} height={hgt} fill="transparent" onMouseEnter={() => setActive(i)} />)
  return (
    <div className="grid gap-3">
      <div ref={wrap} className="relative grid w-full gap-1" onMouseLeave={() => setActive(null)}>
        {width > 0 && (
          <svg width={width} height={height} role="group" tabIndex={0} aria-roledescription="chart" aria-label={summary} onKeyDown={onKey} onBlur={() => setActive(null)} className={svgCls}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={pad.l} x2={pad.l + w} y1={sy(t)} y2={sy(t)} className="stroke-line" />
                {!(showLast && sy(t) - sy(lastC) > -12 && sy(t) - sy(lastC) < (lastNote ? 28 : 12)) && <text x={pad.l + w + 6} y={sy(t)} dy="0.32em" className="fill-ink-3 text-xs tabular">{format(t)}</text>}
              </g>
            ))}
            {showLast && lastK && (
              // Drawn at 0 and moved with a transform, so it can glide to each new price.
              <g className={ease} style={{ transform: `translateY(${sy(lastC)}px)` }}>
                <line x1={pad.l} x2={pad.l + w} y1={0} y2={0} stroke={lastK.c >= lastK.o ? up : down} strokeDasharray="2 3" />
                <rect x={pad.l + w + 2} y={-9} width={axisW - 4} height={lastNote ? 32 : 18} rx={3} fill={lastK.c >= lastK.o ? up : down} />
                <text x={pad.l + w + 6} y={0} dy="0.32em" className="fill-bg text-xs font-medium tabular">{format(lastC)}</text>
                {lastNote && <text x={pad.l + w + 6} y={14} dy="0.32em" className="fill-bg text-xs tabular opacity-85">{lastNote}</text>}
              </g>
            )}
            {candles.map((k, i) => i % every === 0 && <text key={`x${i}`} x={cx(i)} y={height - 6} textAnchor={i === 0 ? "start" : "middle"} className="fill-ink-3 text-xs">{k.t}</text>)}
            {active !== null && <line x1={cx(active)} x2={cx(active)} y1={pad.t} y2={pad.t + h} className="stroke-line-strong" />}
            {candles.map((k, i) => {
              const isUp = k.c >= k.o, col = isUp ? up : down
              const yT = sy(Math.max(k.o, k.c)), yB = sy(Math.min(k.o, k.c))
              // The open candle eases to each new price when live; closed candles never move.
              const e = i === n - 1 ? ease : undefined
              return (
                <g key={k.t + i} className={cn("transition-opacity duration-(--duration-fast)", active !== null && active !== i && "opacity-55")}>
                  <rect x={cx(i) - 0.5} y={sy(k.h)} width={1} height={Math.max(1, sy(k.l) - sy(k.h))} fill={col} className={e} />
                  {isUp
                    ? <rect x={cx(i) - bw / 2 + 0.75} y={yT + 0.75} width={bw - 1.5} height={Math.max(1, yB - yT - 1.5)} rx={1} className={cn("fill-surface", e)} stroke={col} strokeWidth={1.5} />
                    : <rect x={cx(i) - bw / 2} y={yT} width={bw} height={Math.max(1, yB - yT)} rx={1} fill={col} className={e} />}
                </g>
              )
            })}
            {hits(h, pad.t)}
          </svg>
        )}
        {width > 0 && showVol && (
          <svg width={width} height={volumeHeight} role="img" aria-label={`Volume per period, ${formatVolume(Math.min(...candles.map((k) => k.v ?? 0)))} to ${formatVolume(Math.max(...candles.map((k) => k.v ?? 0)))}. Values are in the table view.`} className="block overflow-visible">
            {vTicks.map((t) => (
              <g key={t}>
                <line x1={pad.l} x2={pad.l + w} y1={vy(t)} y2={vy(t)} className={t === 0 ? "stroke-line-strong" : "stroke-line"} />
                <text x={pad.l + w + 6} y={vy(t)} dy="0.32em" className="fill-ink-3 text-xs tabular">{formatVolume(t)}</text>
              </g>
            ))}
            <text x={pad.l + 2} y={12} strokeWidth={3} className={cn("fill-ink-3 text-xs", halo)}>{volumeLabel}</text>
            {candles.map((k, i) => k.v ? (i === n - 1 && live
              ? <rect key={k.t + i} x={cx(i) - bw / 2} y={vy(k.v)} width={bw} height={Math.max(0, vy(0) - vy(k.v))} fill={NEUTRAL} fillOpacity={active === i ? 0.9 : 0.45} className={ease} />
              : <path key={k.t + i} d={barPath(cx(i) - bw / 2, vy(k.v), vy(0), bw, "top")} fill={NEUTRAL} fillOpacity={active === i ? 0.9 : 0.45} />) : null)}
            {hits(vh, 4)}
          </svg>
        )}
        {cur && active !== null && (
          <Tip x={cx(active)} y={4} width={width} title={cur.t} rows={[
            { label: cur.c >= cur.o ? "Up" : "Down", value: `${signed(cur.c - cur.o, format)} (${signed(((cur.c - cur.o) / (cur.o || 1)) * 100, (v) => `${v.toFixed(2)}%`)})`, color: cur.c >= cur.o ? up : down },
            { label: "Open", value: format(cur.o) },
            { label: "High", value: format(cur.h) },
            { label: "Low", value: format(cur.l) },
            { label: "Close", value: format(cur.c) },
            ...(cur.v !== undefined ? [{ label: "Volume", value: formatVolume(cur.v) }] : []),
          ]} />
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <KeyLegend items={[{ label: "Up (close above open)", color: up, shape: "hollow" }, { label: "Down (close below open)", color: down, shape: "box" }]} />
        <p className="text-xs text-ink-3">Price axis starts at {format(lo)}, not zero</p>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- donut */

export function DonutChart({ segments, total, totalLabel = "Total", format = fmt, "aria-label": label }: { segments: { id: string; label: string; value: number }[]; total?: number; totalLabel?: string; format?: (n: number) => string; "aria-label": string }) {
  const sum = segments.reduce((a, s) => a + s.value, 0) || 1
  const [active, setActive] = React.useState<number | null>(null)
  const R = 64, r = 44, C = 80
  let a0 = -Math.PI / 2
  const gap = 2 / R // 2px gap at the outer edge
  const arcs = segments.map((s, i) => {
    const a1 = a0 + (s.value / sum) * Math.PI * 2
    const [s0, s1] = [a0 + gap / 2, Math.max(a0 + gap / 2, a1 - gap / 2)]
    a0 = a1
    const p = (rad: number, ang: number) => `${C + rad * Math.cos(ang)},${C + rad * Math.sin(ang)}`
    const large = s1 - s0 > Math.PI ? 1 : 0
    return { s, i, d: `M${p(R, s0)}A${R},${R} 0 ${large} 1 ${p(R, s1)}L${p(r, s1)}A${r},${r} 0 ${large} 0 ${p(r, s0)}Z` }
  })
  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 160 160" className="size-40 shrink-0" role="img" aria-label={`${label}. ${segments.map((s) => `${s.label} ${format(s.value)} (${Math.round((s.value / sum) * 100)}%)`).join(", ")}.`}>
        {arcs.map(({ s, i, d }) => <path key={s.id} d={d} fill={seriesColor(i)} opacity={active === null || active === i ? 1 : 0.45} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} />)}
        <text x={C} y={C - 4} textAnchor="middle" className="fill-ink text-lg font-semibold tabular">{format(total ?? sum)}</text>
        <text x={C} y={C + 14} textAnchor="middle" className="fill-ink-3 text-xs">{totalLabel}</text>
      </svg>
      <ul className="grid min-w-44 gap-2" aria-label="Legend">
        {segments.map((s, i) => (
          <li key={s.id} className={cn("flex items-center gap-2 text-sm", active !== null && active !== i && "opacity-60")} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}>
            <span aria-hidden="true" className="size-2.5 shrink-0 rounded-xs bg-(--c)" style={{ "--c": seriesColor(i) } as React.CSSProperties} />
            <span className="text-ink-2">{s.label}</span>
            <span className="tabular ml-auto pl-4 font-medium text-ink">{format(s.value)}</span>
            <span className="tabular w-10 text-right text-ink-3">{Math.round((s.value / sum) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------------------------------------------------------------- heatmap, funnel and scatter */

export function Heatmap({ rows, columns, values, format = fmt, "aria-label": label }: { rows: string[]; columns: string[]; values: number[][]; format?: (n: number) => string; "aria-label": string }) {
  const max = Math.max(...values.flat(), 1)
  const step = (v: number) => (v <= 0 ? 0 : Math.min(5, Math.ceil((v / max) * 5)))
  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-0.5 text-sm" aria-label={label}>
        <thead><tr><td />{columns.map((c) => <th key={c} scope="col" className="px-1 pb-1 text-xs font-medium text-ink-3">{c}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={r}>
              <th scope="row" className="pr-2 text-left text-xs font-medium whitespace-nowrap text-ink-2">{r}</th>
              {columns.map((c, ci) => {
                const v = values[ri][ci], s = step(v)
                return (
                  <td key={c} title={`${r}, ${c}: ${format(v)}`} className={cn("h-7 w-9 rounded-xs text-center text-xs tabular", s === 0 ? "bg-hover text-ink-3" : ["", "bg-q1 text-white", "bg-q2 text-white", "bg-q3 text-white", "bg-q4 text-white", "bg-q5 text-white"][s])}>
                    <span className="sr-only">{format(v)}</span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 flex items-center gap-1 text-xs text-ink-3" aria-hidden="true">
        Fewer {["bg-hover", "bg-q1", "bg-q2", "bg-q3", "bg-q4", "bg-q5"].map((c) => <span key={c} className={cn("size-3 rounded-xs", c)} />)} More
      </div>
    </div>
  )
}

export function Funnel({ stages, format = fmt, "aria-label": label }: { stages: { label: string; value: number }[]; format?: (n: number) => string; "aria-label": string }) {
  const first = stages[0]?.value || 1
  return (
    <ol className="grid gap-2" aria-label={label}>
      {stages.map((s, i) => {
        const prev = i ? stages[i - 1].value : null
        return (
          <li key={s.label} className="grid grid-cols-[96px_1fr_96px] items-center gap-3 text-sm">
            <span className="text-ink-2">{s.label}</span>
            <span className="h-6 overflow-hidden rounded-xs bg-hover"><span className="block h-full w-(--w) rounded-xs bg-c1" style={{ "--w": `${(s.value / first) * 100}%` } as React.CSSProperties} /></span>
            <span className="tabular text-right"><span className="font-medium text-ink">{format(s.value)}</span>{prev !== null && <span className="text-ink-3"> · {Math.round((s.value / prev) * 100)}%</span>}</span>
          </li>
        )
      })}
    </ol>
  )
}

/* ---------------------------------------------------------------- scatter */

export type ScatterPoint = { id: string; label: string; x: number; y: number; group: string; href?: string }

const SHAPES = ["circle", "square", "triangle"] as const
function Mark({ shape, x, y, color, active }: { shape: (typeof SHAPES)[number]; x: number; y: number; color: string; active: boolean }) {
  const r = active ? 5 : 3.5
  const common = { fill: color, className: "stroke-surface", strokeWidth: 1 }
  if (shape === "square") return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} rx={1} {...common} />
  if (shape === "triangle") return <path d={`M${x},${y - r * 1.2}L${x + r * 1.1},${y + r * 0.8}L${x - r * 1.1},${y + r * 0.8}Z`} {...common} />
  return <circle cx={x} cy={y} r={r} {...common} />
}

/** Two measures per record. Up to three groups, each with its own colour (c1–c3) and marker shape. */
export function ScatterChart({
  points,
  xTitle,
  yTitle,
  height = 260,
  formatX = fmt,
  formatY = fmt,
  "aria-label": label,
}: {
  points: ScatterPoint[]
  xTitle: string
  yTitle: string
  height?: number
  formatX?: (n: number) => string
  formatY?: (n: number) => string
  "aria-label": string
}) {
  const [wrap, width] = useWidth<HTMLDivElement>()
  const [active, setActive] = React.useState<number | null>(null)
  const [pinned, setPinned] = React.useState(false)
  const groups = [...new Set(points.map((p) => p.group))].slice(0, 3)
  const sorted = [...points].filter((p) => groups.includes(p.group)).sort((a, b) => a.x - b.x)
  const pad = { t: 10, r: 12, b: 40, l: 52 }
  const w = Math.max(0, width - pad.l - pad.r), h = height - pad.t - pad.b
  const xt = niceTicks(Math.max(...sorted.map((p) => p.x), 1)), yt = niceTicks(Math.max(...sorted.map((p) => p.y), 1))
  const sx = (v: number) => pad.l + (v / xt[xt.length - 1]) * w
  const sy = (v: number) => pad.t + h - (v / yt[yt.length - 1]) * h
  const cur = active === null ? null : sorted[active]
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); setPinned(false); setActive((a) => Math.min(sorted.length - 1, a === null ? 0 : a + 1)) }
    else if (e.key === "ArrowLeft") { e.preventDefault(); setPinned(false); setActive((a) => Math.max(0, a === null ? 0 : a - 1)) }
    else if (e.key === "Enter" && active !== null) { e.preventDefault(); setPinned(true) }
    else if (e.key === "Escape") { setPinned(false); setActive(null) }
  }
  return (
    <div className="grid gap-3">
      <div ref={wrap} className="relative w-full">
        {width > 0 && (
          <svg width={width} height={height} role="group" tabIndex={0} aria-roledescription="chart" aria-label={`${label}. ${sorted.length} records. ${xTitle} against ${yTitle}.`} onKeyDown={onKey} onMouseLeave={() => !pinned && setActive(null)} className="block overflow-visible rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            {yt.map((t) => (
              <g key={`y${t}`}>
                <line x1={pad.l} x2={pad.l + w} y1={sy(t)} y2={sy(t)} className={t === 0 ? "stroke-line-strong" : "stroke-line"} />
                <text x={pad.l - 6} y={sy(t)} dy="0.32em" textAnchor="end" className="fill-ink-3 text-xs tabular">{formatY(t)}</text>
              </g>
            ))}
            {xt.map((t) => <text key={`x${t}`} x={sx(t)} y={pad.t + h + 14} textAnchor="middle" className="fill-ink-3 text-xs tabular">{formatX(t)}</text>)}
            <text x={pad.l + w / 2} y={height - 4} textAnchor="middle" className="fill-ink-2 text-xs">{xTitle}</text>
            <text transform={`translate(12 ${pad.t + h / 2}) rotate(-90)`} textAnchor="middle" className="fill-ink-2 text-xs">{yTitle}</text>
            {sorted.map((p, i) => {
              const g = groups.indexOf(p.group)
              return (
                <g key={p.id} onMouseEnter={() => !pinned && setActive(i)} onClick={() => { setActive(i); setPinned(true) }} className="cursor-pointer">
                  <circle cx={sx(p.x)} cy={sy(p.y)} r={10} fill="transparent" />
                  <Mark shape={SHAPES[g]} x={sx(p.x)} y={sy(p.y)} color={seriesColor(g)} active={active === i} />
                </g>
              )
            })}
          </svg>
        )}
        {cur && width > 0 && (
          <div
            role={pinned ? "dialog" : "status"}
            aria-label={pinned ? cur.label : undefined}
            className={cn("absolute z-10 grid min-w-44 gap-1 rounded-md border border-line bg-surface px-2 py-2 text-sm shadow-pop left-(--x) top-(--y)", !pinned && "pointer-events-none")}
            style={{ "--x": `${Math.min(sx(cur.x) + 10, width - 190)}px`, "--y": `${Math.max(0, sy(cur.y) - 70)}px` } as React.CSSProperties}
          >
            <span className="font-medium text-ink">{cur.label}</span>
            <span className="flex justify-between gap-3 text-ink-2">{xTitle}<span className="tabular font-medium text-ink">{formatX(cur.x)}</span></span>
            <span className="flex justify-between gap-3 text-ink-2">{yTitle}<span className="tabular font-medium text-ink">{formatY(cur.y)}</span></span>
            {pinned && cur.href && <a href={cur.href} className="font-medium text-primary-ink hover:underline" autoFocus>Open {cur.label}</a>}
          </div>
        )}
      </div>
      {groups.length > 1 && (
        <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Legend">
          {groups.map((g, i) => (
            <li key={g} className="inline-flex items-center gap-control text-sm text-ink-2">
              <svg width="10" height="10" aria-hidden="true"><Mark shape={SHAPES[i]} x={5} y={5} color={seriesColor(i)} active={false} /></svg>
              {g}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
