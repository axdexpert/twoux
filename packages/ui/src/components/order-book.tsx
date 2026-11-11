"use client"

import * as React from "react"
import { ArrowDown, ArrowUp, Minus, Plus } from "lucide-react"
import { cn } from "../lib/cn"
import { fmt } from "../lib/chart-kit"
import { Button } from "./button"
import { Skeleton } from "./skeleton"

/** One resting price level: the price and how much is offered or wanted at it. */
export type OrderLevel = { price: number; amount: number }

type Row = OrderLevel & { side: "sell" | "buy"; total: number }

/** Groups levels into steps: sell prices round up, buy prices round down, so a group never claims a better price than its orders. */
export function groupLevels(levels: OrderLevel[], step: number, side: "sell" | "buy"): OrderLevel[] {
  if (!step) return levels
  const map = new Map<number, number>()
  for (const l of levels) {
    const k = Number(((side === "sell" ? Math.ceil(l.price / step - 1e-9) : Math.floor(l.price / step + 1e-9)) * step).toFixed(10))
    map.set(k, (map.get(k) ?? 0) + l.amount)
  }
  return [...map].map(([price, amount]) => ({ price, amount }))
}

/** Table view for ChartFrame: side, price, amount and running total, best prices first. */
export const orderBookTable = (asks: OrderLevel[], bids: OrderLevel[], format: (n: number) => string = fmt, formatAmount: (n: number) => string = fmt) => {
  const run = (ls: OrderLevel[], side: string) => {
    let t = 0
    return ls.map((l) => [side, format(l.price), formatAmount(l.amount), formatAmount((t += l.amount))])
  }
  return {
    columns: ["Side", "Price", "Amount", "Total"],
    rows: [...run([...asks].sort((a, b) => a.price - b.price), "Sell"), ...run([...bids].sort((a, b) => b.price - a.price), "Buy")],
  }
}

/**
 * Resting sell and buy orders either side of the spread. Sells sit above, best (lowest) next to the spread;
 * buys sit below, best (highest) next to the spread. Each row's bar shows the running total against the deepest side,
 * so walls stand out. Side is carried by position, the row's name and colour together, never colour alone.
 * Choosing a row hands its price to the order form; rows keep their place as prices update, with no flashing.
 */
export function OrderBook({
  asks,
  bids,
  rows = 10,
  format = fmt,
  formatAmount = fmt,
  priceLabel = "Price",
  amountLabel = "Amount",
  totalLabel = "Total",
  step,
  steps,
  onStepChange,
  formatStep = (n) => String(n),
  last,
  loading = false,
  onSelectPrice,
  className,
  "aria-label": label,
}: {
  asks: OrderLevel[]
  bids: OrderLevel[]
  /** Levels shown on each side. */
  rows?: number
  format?: (n: number) => string
  formatAmount?: (n: number) => string
  /** Column headings, with units: "Price (USD)", "Amount (BTC)". */
  priceLabel?: string
  amountLabel?: string
  /** Running total heading, with its unit: "Total (BTC)". */
  totalLabel?: string
  /** Price grouping. Pass steps and onStepChange to show the − and + control. */
  step?: number
  steps?: number[]
  onStepChange?: (step: number) => void
  formatStep?: (n: number) => string
  /** Last traded price, shown between the sides with its direction. */
  last?: { price: number; direction: "up" | "down" }
  loading?: boolean
  /** Called with the chosen row's price and side, to fill the order form. */
  onSelectPrice?: (price: number, side: "sell" | "buy") => void
  className?: string
  "aria-label": string
}) {
  const sells = React.useMemo(() => {
    const g = groupLevels(asks, step ?? 0, "sell").sort((a, b) => a.price - b.price).slice(0, rows)
    let t = 0
    return g.map((l) => ({ ...l, side: "sell" as const, total: (t += l.amount) })).reverse()
  }, [asks, step, rows])
  const buys = React.useMemo(() => {
    const g = groupLevels(bids, step ?? 0, "buy").sort((a, b) => b.price - a.price).slice(0, rows)
    let t = 0
    return g.map((l) => ({ ...l, side: "buy" as const, total: (t += l.amount) }))
  }, [bids, step, rows])
  const deepest = Math.max(sells[0]?.total ?? 0, buys[buys.length - 1]?.total ?? 0, 1e-12)
  const bestAsk = sells[sells.length - 1]?.price
  const bestBid = buys[0]?.price
  const spread = bestAsk !== undefined && bestBid !== undefined ? bestAsk - bestBid : null

  // One tab stop; arrow keys move between rows, Enter or Space uses the price.
  const all: Row[] = [...sells, ...buys]
  const [focus, setFocus] = React.useState(0)
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])
  const move = (i: number) => {
    const n = Math.max(0, Math.min(all.length - 1, i))
    setFocus(n)
    refs.current[n]?.focus()
  }
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const to = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: all.length - 1, PageDown: i + 5, PageUp: i - 5 }[e.key]
    if (to === undefined) return
    e.preventDefault()
    move(to)
  }
  const stepIdx = steps && step !== undefined ? steps.indexOf(step) : -1

  const row = (r: Row, i: number) => (
    <li key={`${r.side}-${r.price}`} className="relative">
      <span aria-hidden="true" className={cn("absolute inset-y-px right-0 w-(--w) rounded-l-xs motion-safe:transition-[width] motion-safe:duration-(--duration-base) motion-safe:ease-(--ease-standard)", r.side === "sell" ? "bg-bad-bg" : "bg-ok-bg")} style={{ "--w": `${(r.total / deepest) * 100}%` } as React.CSSProperties} />
      <button
        ref={(el) => { refs.current[i] = el }}
        type="button"
        tabIndex={i === Math.min(focus, all.length - 1) ? 0 : -1}
        disabled={!onSelectPrice}
        onClick={() => { setFocus(i); onSelectPrice?.(r.price, r.side) }}
        onKeyDown={(e) => onKey(e, i)}
        aria-label={`${r.side === "sell" ? "Sell" : "Buy"} ${formatAmount(r.amount)} at ${format(r.price)}, total ${formatAmount(r.total)}`}
        className="relative grid h-6 w-full grid-cols-3 items-center gap-2 rounded-xs px-2 text-right text-sm tabular outline-none hover:bg-hover focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-default"
      >
        <span className={cn("text-left font-medium", r.side === "sell" ? "text-bad" : "text-ok")}>{format(r.price)}</span>
        <span className="text-ink">{formatAmount(r.amount)}</span>
        <span className="text-ink-2">{formatAmount(r.total)}</span>
      </button>
    </li>
  )

  const skeleton = (key: string) => (
    <ul key={key} className="grid gap-1 px-2 py-1" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => <li key={i}><Skeleton className="h-5 w-full" /></li>)}
    </ul>
  )
  const empty = (side: string) => <p className="px-2 py-3 text-sm text-ink-3">No {side} orders</p>

  return (
    <section aria-label={label} aria-busy={loading || undefined} className={cn("grid min-w-0 content-start", className)}>
      {steps && onStepChange && step !== undefined && (
        <div className="flex items-center justify-between gap-2 px-2 pb-2">
          <span className="text-sm text-ink-2">Group by</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-xs" aria-label="Smaller price groups" aria-disabled={stepIdx <= 0 || undefined} onClick={() => stepIdx > 0 && onStepChange(steps[stepIdx - 1])}><Minus /></Button>
            <output className="min-w-14 text-center text-sm font-medium text-ink tabular" aria-live="polite">{formatStep(step)}</output>
            <Button variant="ghost" size="icon-xs" aria-label="Larger price groups" aria-disabled={stepIdx >= steps.length - 1 || undefined} onClick={() => stepIdx < steps.length - 1 && onStepChange(steps[stepIdx + 1])}><Plus /></Button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-3 gap-2 border-b border-line px-4 pb-1 text-right text-xs text-ink-3" aria-hidden="true">
        <span className="text-left">{priceLabel}</span>
        <span>{amountLabel}</span>
        <span>{totalLabel}</span>
      </div>
      {loading ? skeleton("s") : (
        <ul aria-label="Sell orders, best price last" className="grid content-end px-2 pt-1">
          {sells.length ? sells.map((r, i) => row(r, i)) : <li>{empty("sell")}</li>}
        </ul>
      )}
      <div className="flex items-center justify-between gap-2 border-y border-line px-4 py-2 text-sm tabular">
        {last && !loading ? (
          <span className={cn("flex items-center gap-1 font-semibold", last.direction === "up" ? "text-ok" : "text-bad")}>
            {format(last.price)}
            {last.direction === "up" ? <ArrowUp className="size-3.5" aria-hidden="true" /> : <ArrowDown className="size-3.5" aria-hidden="true" />}
            <span className="sr-only">Last trade, {last.direction === "up" ? "up" : "down"} on the one before</span>
          </span>
        ) : <span />}
        <span className="text-ink-2">Spread {spread === null || loading ? "–" : format(spread)}</span>
      </div>
      {loading ? skeleton("b") : (
        <ul aria-label="Buy orders, best price first" className="grid content-start px-2 pb-1">
          {buys.length ? buys.map((r, i) => row(r, sells.length + i)) : <li>{empty("buy")}</li>}
        </ul>
      )}
    </section>
  )
}
