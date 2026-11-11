/**
 * Shared chart internals for TwoUX's own-SVG charts (charts-more, charts-radial, chart-map, timeline).
 * Not exported from the package index: components use these, apps never do.
 */
import * as React from "react"

export const fmt = (n: number) => n.toLocaleString("en-GB")
export const MINUS = "−"
export const pct = (part: number, whole: number, digits = 1) => `${whole ? ((part / whole) * 100).toFixed(digits) : "0"}%`
/** Neutral mark for totals and Other: never a series or status colour. */
export const NEUTRAL = "var(--color-ink-3)"
/** Rough width of 12px text, to decide whether a label fits before drawing it. */
export const textW = (s: string) => s.length * 6.6
export const svgCls = "block overflow-visible rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
export const halo = "stroke-surface [paint-order:stroke]"

export function useWidth<T extends HTMLElement>() {
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

/** One active mark, moved with the arrow keys, Home and End; Esc clears. */
export function useActive(n: number) {
  const [active, setActive] = React.useState<number | null>(null)
  const onKey = (e: React.KeyboardEvent) => {
    if (!n) return
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a === null ? 0 : Math.min(n - 1, a + 1))) }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a === null ? n - 1 : Math.max(0, a - 1))) }
    else if (e.key === "Home") { e.preventDefault(); setActive(0) }
    else if (e.key === "End") { e.preventDefault(); setActive(n - 1) }
    else if (e.key === "Escape") setActive(null)
  }
  return { active, setActive, onKey }
}

export function niceStep(raw: number) {
  if (raw <= 0) return 1
  const mag = 10 ** Math.floor(Math.log10(raw))
  return [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw
}

export type TipRow = { label: string; value: string; color?: string }
/** Tooltip: value strong, label secondary, a line key for the series. Never the only way to a value. */
export function Tip({ x, y, width, title, rows }: { x: number; y: number; width: number; title: string; rows: TipRow[] }) {
  const left = x + 12 + 184 > width ? Math.max(0, x - 12 - 184) : x + 12
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 grid min-w-44 gap-1 rounded-md border border-line bg-surface px-2.5 py-2 text-sm shadow-pop left-(--x) top-(--y)"
      style={{ "--x": `${left}px`, "--y": `${Math.max(0, y)}px` } as React.CSSProperties}
    >
      <span className="font-medium text-ink">{title}</span>
      {rows.map((r) => (
        <span key={r.label} className="flex items-center gap-2">
          {r.color && <span aria-hidden="true" className="h-0.5 w-3 shrink-0 rounded-full bg-(--c)" style={{ "--c": r.color } as React.CSSProperties} />}
          <span className="text-ink-2">{r.label}</span>
          <span className="tabular ml-auto pl-3 font-medium text-ink">{r.value}</span>
        </span>
      ))}
    </div>
  )
}

