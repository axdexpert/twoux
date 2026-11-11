/**
 * TwoUX composition: small motion helpers for changes shadcn doesn't animate. Overlays, menus, sheets and toasts keep
 * shadcn's own motion; these cover what happens inside a screen: an icon or label that changes state, a count that moves,
 * a figure that updates, AI text that streams, a card that changes height.
 * Timings use the motion tokens in twoux.css: entrances ease with --ease-entrance, exits are shorter and use
 * --ease-exit, and only Count overshoots (--ease-pop). Theme tempo scales them all. All of it stops under
 * prefers-reduced-motion (twoux.css sets every duration to 0), and nothing animates on first render.
 */
import * as React from "react"
import { cn } from "../lib/cn"

const useChanged = <T,>(value: T) => {
  const first = React.useRef(true)
  const prev = React.useRef(value)
  const changed = !first.current && !Object.is(prev.current, value)
  React.useEffect(() => { first.current = false; prev.current = value }, [value])
  return changed
}

/**
 * Swap: crossfades between states of one control, such as Copy → Copied or Save → Saving… → Saved.
 * Change `swapKey` when the content changes. The old content leaves while the new one arrives in the same spot,
 * so the width never jumps. kind="icon" scales and unblurs; kind="text" rises 4px.
 */
export function Swap({ swapKey, kind = "text", children, className }: { swapKey: React.Key; kind?: "icon" | "text"; children: React.ReactNode; className?: string }) {
  const [items, setItems] = React.useState([{ key: swapKey, node: children, leaving: false }])
  const mounted = React.useRef(false)
  React.useEffect(() => {
    if (!mounted.current) { mounted.current = true; return }
    setItems((cur) => {
      if (cur[cur.length - 1].key === swapKey) return cur.map((i) => (i.key === swapKey ? { ...i, node: children } : i))
      return [...cur.filter((i) => i.key !== swapKey).map((i) => ({ ...i, leaving: true })), { key: swapKey, node: children, leaving: false }]
    })
    // Leaving content is removed when its exit animation ends (so theme tempo applies); this is only a safety net.
    const t = window.setTimeout(() => setItems((cur) => cur.filter((i) => !i.leaving)), 1000)
    return () => window.clearTimeout(t)
  }, [swapKey, children])
  const drop = (key: React.Key) => setItems((cur) => cur.filter((i) => !(i.leaving && i.key === key)))
  const enter = kind === "icon" ? "animate-swap-in-icon" : "animate-swap-in-text"
  const leave = kind === "icon" ? "animate-swap-out-icon" : "animate-swap-out-text"
  return (
    <span data-slot="swap" className={cn("inline-grid [&>*]:col-start-1 [&>*]:row-start-1", kind === "icon" && "place-items-center", className)}>
      {items.map((i, n) => (
        <span
          key={i.key}
          aria-hidden={i.leaving || undefined}
          onAnimationEnd={i.leaving ? (e) => { if (e.target === e.currentTarget) drop(i.key) } : undefined}
          className={cn("inline-flex items-center gap-control", n > 0 || items.length > 1 ? (i.leaving ? leave : enter) : "")}
        >
          {i.node}
        </span>
      ))}
    </span>
  )
}

/** Count: a small number (tab, sidebar, inbox) that pops when it changes, so a new item is noticed without a toast. */
export function Count({ value, className }: { value: number; className?: string }) {
  const changed = useChanged(value)
  return (
    <span key={changed ? value : "static"} data-slot="count" className={cn("tabular inline-block", changed && "animate-count-pop", className)}>
      {value}
    </span>
  )
}

/**
 * RollingNumber: digits roll to their new value (figures on stat cards when a filter changes).
 * Takes the formatted string, so units and separators stay as written ("1,204", "23 days", "£4.2k").
 * Screen readers get the final value only.
 */
export function RollingNumber({ value, className }: { value: string; className?: string }) {
  return (
    <span data-slot="rolling-number" className={cn("tabular inline-flex", className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="inline-flex">
        {[...value].map((ch, i) =>
          /\d/.test(ch) ? (
            <span key={`${value.length}-${i}`} className="inline-block h-lh overflow-hidden">
              <span className="flex translate-y-(--y) flex-col transition-transform duration-(--duration-long) ease-(--ease-standard)" style={{ "--y": `calc(${ch} * -1lh)` } as React.CSSProperties}>
                {"0123456789".split("").map((d) => <span key={d} className="h-lh">{d}</span>)}
              </span>
            </span>
          ) : (
            <span key={`${value.length}-${i}`} className="whitespace-pre">{ch}</span>
          ),
        )}
      </span>
    </span>
  )
}

/** ShimmerText: a light sweep across a status line while work is in progress ("Thinking", "Working…"). Text only, never a block. */
export function ShimmerText({ children, active = true, className }: { children: React.ReactNode; active?: boolean; className?: string }) {
  return (
    <span data-slot="shimmer-text" className={cn(active && "animate-text-shimmer bg-linear-to-r from-ink-3 via-ink to-ink-3 bg-size-[200%_100%] bg-clip-text text-transparent", className)}>
      {children}
    </span>
  )
}

/**
 * StreamingText: AI text that arrives in chunks. Each new word fades in, so the eye follows the edge of the answer
 * instead of the whole block reflowing. Pass the full text so far; finished words never animate again.
 */
export function StreamingText({ text, className }: { text: string; className?: string }) {
  const words = text.split(/(\s+)/)
  const seen = React.useRef(0)
  const from = seen.current
  React.useEffect(() => { seen.current = words.length })
  return (
    <span data-slot="streaming-text" className={className}>
      {words.map((w, i) => (
        <span key={i} className={cn(i >= from && from > 0 && "animate-word-in")}>{w}</span>
      ))}
    </span>
  )
}

/** AnimateHeight: a container that eases to its content's new height (a board item resized, a card that expands). */
export function AnimateHeight({ children, className }: { children: React.ReactNode; className?: string }) {
  const inner = React.useRef<HTMLDivElement>(null)
  const [h, setH] = React.useState<number | undefined>(undefined)
  React.useLayoutEffect(() => {
    const el = inner.current
    if (!el) return
    const ro = new ResizeObserver(() => setH(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div data-slot="animate-height" className={cn("overflow-hidden transition-[height] duration-(--duration-slow) ease-(--ease-standard)", h !== undefined && "h-(--h)", className)} style={h === undefined ? undefined : ({ "--h": `${h}px` } as React.CSSProperties)}>
      <div ref={inner}>{children}</div>
    </div>
  )
}
