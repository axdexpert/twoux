/**
 * TwoUX compositions for the List table, built on the generated shadcn Table, Button and Badge.
 * TableSortHead: only the sorted column shows its arrow; aria-sort sits on that header only.
 * TablePagination: range and total, selection count first, Previous / "1 of 3" / Next.
 * BulkActionBar: grey band directly above the table while rows are selected (actions, count, Clear selection); up to four actions,
 *   the rest and any that don't fit in More; Esc clears; filters and header stay in view.
 * useRowKeyboard: J/K or arrows move row focus, X selects, ⇧J/⇧K extend, Enter opens, Esc clears.
 */
import { ArrowUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/cn"
import { Button } from "./button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "./dropdown-menu"
import { TableHead } from "./table"

type Sort = false | "asc" | "desc"

export function TableSortHead({
  sorted,
  onSort,
  align = "left",
  className,
  children,
  ...props
}: React.ComponentProps<typeof TableHead> & { sorted: Sort; onSort: () => void; align?: "left" | "right" }) {
  return (
    <TableHead
      aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}
      className={cn("p-0", className)}
      {...props}
    >
      <button
        type="button"
        onClick={onSort}
        className={cn(
          "group/sort flex h-9 w-full items-center gap-1 rounded-xs px-3 font-medium group-data-[size=dense]/table:h-7 group-data-[size=dense]/table:px-2 text-ink-2 transition-colors duration-(--duration-fast) ease-(--ease-out) hover:text-ink",
          align === "right" ? "flex-row-reverse text-right" : "text-left",
          sorted && "text-ink"
        )}
      >
        {children}
        <ArrowUp
          aria-hidden="true"
          className={cn(
            "size-3 shrink-0 transition-[opacity,rotate] duration-(--duration-fast) ease-(--ease-out)",
            sorted ? "opacity-100" : "opacity-0 group-hover/sort:opacity-60 group-focus-visible/sort:opacity-60",
            sorted === "desc" && "rotate-180"
          )}
        />
      </button>
    </TableHead>
  )
}

export function TablePagination({
  page,
  pageCount,
  pageSize,
  total,
  selected = 0,
  noun = "rows",
  onPageChange,
  className,
}: {
  /** Zero-based page index */
  page: number
  pageCount: number
  pageSize: number
  total: number
  selected?: number
  noun?: string
  onPageChange: (page: number) => void
  className?: string
}) {
  const from = total === 0 ? 0 : page * pageSize + 1
  const to = Math.min(total, (page + 1) * pageSize)
  const fmt = (n: number) => n.toLocaleString("en-GB")
  return (
    <nav aria-label="Pagination" data-slot="table-pagination" className={cn("flex h-10 items-center gap-3 border-t border-line px-3 text-sm text-ink-2", className)}>
      <p className="tabular min-w-0 truncate" aria-live="polite">
        {selected > 0 && <span className="font-medium text-ink">{fmt(selected)} of {fmt(total)} selected · </span>}
        Showing {fmt(from)}–{fmt(to)} of {fmt(total)} {noun}
      </p>
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" aria-label="Previous page" disabled={page <= 0} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft />
        </Button>
        <span className="tabular px-1">{fmt(page + 1)} of {fmt(Math.max(1, pageCount))}</span>
        <Button variant="ghost" size="icon-sm" aria-label="Next page" disabled={page >= pageCount - 1} onClick={() => onPageChange(page + 1)}>
          <ChevronRight />
        </Button>
      </div>
    </nav>
  )
}

export type BulkAction = {
  label: string
  icon?: React.ReactNode
  onSelect: () => void
  /** Shown on the button, or beside the item once it moves into More. Keeps working in both places. */
  shortcut?: string
  /** Red text; put destructive actions last. */
  destructive?: boolean
  disabled?: boolean
}

/** Most actions shown as buttons before the rest move into More (selection-bulk-actions). */
const MAX_VISIBLE = 4
const GAP = 4

export function BulkActionBar({
  count,
  onClear,
  noun,
  actions = [],
  size = "default",
  className,
  children,
}: {
  count: number
  onClear: () => void
  /** Plural noun for the count: "2 listings selected". Without it: "2 selected". */
  noun?: string
  /** The bar's actions, in order. Up to four show as buttons; the rest, and any that don't fit, move into More. */
  actions?: BulkAction[]
  /** Match the table: "dense" for Table or SheetGrid size="dense". */
  size?: "default" | "dense"
  className?: string
  /** Custom controls that always show before the actions, such as a menu button. */
  children?: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const area = React.useRef<HTMLDivElement>(null)
  const more = React.useRef<HTMLButtonElement>(null)
  const [fit, setFit] = React.useState(Math.min(actions.length, MAX_VISIBLE))
  const btn = size === "dense" ? "xs" : "sm"

  React.useEffect(() => {
    if (!count) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return
      if ((e.target as HTMLElement | null)?.closest("[role=dialog], [role=alertdialog], [role=menu]")) return
      onClear()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [count, onClear])

  // Measure every action button (overflowed ones stay laid out, invisible, so they keep their width and shortcut)
  // and show as many as fit beside More.
  React.useLayoutEffect(() => {
    const el = area.current
    if (!el || !count) return
    const measure = () => {
      const widths = Array.from(el.querySelectorAll<HTMLElement>("[data-bulk-action]")).map((b) => b.offsetWidth)
      const room = el.clientWidth
      const moreW = (more.current?.offsetWidth ?? 0) + GAP
      const total = widths.reduce((a, w) => a + w + GAP, 0)
      let n = widths.length
      if (n > MAX_VISIBLE || total > room) {
        n = 0
        let used = 0
        while (n < widths.length && n < MAX_VISIBLE && used + widths[n] + GAP + moreW <= room) used += widths[n++] + GAP
      }
      setFit(n)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [count, actions.length, actions.map((a) => a.label).join("|"), btn])

  if (!count) return null

  // Toolbar pattern: one Tab stop, arrows move between buttons
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
    const items = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled):not([data-overflow])") ?? [])
    const i = items.indexOf(document.activeElement as HTMLButtonElement)
    if (i < 0) return
    e.preventDefault()
    items[(i + (e.key === "ArrowRight" ? 1 : -1) + items.length) % items.length]?.focus()
  }

  const n = count.toLocaleString("en-GB")
  const label = `${n} ${noun ? `${noun} ` : ""}selected`
  const overflow = actions.slice(fit)
  const hide = "invisible absolute top-0 left-0"

  // A band directly above the table (below any filters), in the page flow: the header row stays visible.
  // The count and Clear selection always stay in view; actions that don't fit move into More.
  return (
    <div
      ref={ref}
      role="toolbar"
      aria-label={`Actions for ${label}`}
      data-slot="bulk-action-bar"
      data-size={size}
      onKeyDown={onKeyDown}
      className={cn(
        "@container/bulk flex h-10 animate-fade-in items-center gap-3 border-b border-line bg-surface-2 px-3 data-[size=dense]:h-8 data-[size=dense]:px-2",
        className
      )}
    >
      {children && <div className="flex shrink-0 items-center gap-1">{children}</div>}
      <div ref={area} className="relative flex h-full min-w-0 flex-1 items-center gap-1 overflow-hidden">
        {actions.map((a, i) => (
          <Button
            key={a.label}
            data-bulk-action=""
            data-overflow={i >= fit || undefined}
            aria-hidden={i >= fit || undefined}
            tabIndex={i >= fit ? -1 : undefined}
            variant="ghost"
            size={btn}
            shortcut={a.shortcut}
            disabled={a.disabled}
            onClick={a.onSelect}
            className={cn("shrink-0", a.destructive && "text-bad hover:text-bad", i >= fit && hide)}
          >
            {a.icon}
            {a.label}
          </Button>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              ref={more}
              variant="ghost"
              size={btn}
              aria-label={`More actions, ${overflow.length}`}
              data-overflow={!overflow.length || undefined}
              aria-hidden={!overflow.length || undefined}
              tabIndex={overflow.length ? undefined : -1}
              className={cn("shrink-0", !overflow.length && hide)}
            >
              More
              <ChevronDown className="text-ink-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {overflow.map((a) => (
              <DropdownMenuItem key={a.label} variant={a.destructive ? "destructive" : "default"} disabled={a.disabled} onSelect={a.onSelect}>
                {a.icon}
                {a.label}
                {a.shortcut && <DropdownMenuShortcut>{a.shortcut}</DropdownMenuShortcut>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="tabular text-sm font-medium whitespace-nowrap text-ink" aria-live="polite">
          {n} {noun && <span className="@max-lg/bulk:hidden">{noun} </span>}selected
        </span>
        <span aria-hidden="true" className="text-ink-3">·</span>
        <Button
          variant="ghost"
          size={btn}
          shortcut="Esc"
          onClick={onClear}
          aria-label="Clear selection"
          className="@max-lg/bulk:[&_[data-slot=kbd]]:hidden"
        >
          <span>Clear<span className="@max-lg/bulk:hidden"> selection</span></span>
        </Button>
      </div>
    </div>
  )
}

export function useRowKeyboard({
  count,
  onToggle,
  onOpen,
  onClear,
  selected = 0,
  enabled = true,
}: {
  count: number
  /** value is true when extending a selection with ⇧J / ⇧K */
  onToggle: (index: number, value?: boolean) => void
  onOpen?: (index: number) => void
  onClear?: () => void
  /** How many rows are selected. Esc clears them only when there are some, so otherwise it reaches the side panel or dialog. */
  selected?: number
  /** Single-key shortcuts can be turned off in settings. */
  enabled?: boolean
}) {
  const [focused, setFocused] = React.useState(-1)
  const ref = React.useRef<HTMLTableSectionElement>(null)

  React.useEffect(() => {
    if (focused >= count) setFocused(count - 1)
  }, [count, focused])

  React.useEffect(() => {
    ref.current?.querySelector<HTMLElement>(`[data-row-index="${focused}"]`)?.scrollIntoView({ block: "nearest" })
  }, [focused])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!enabled || e.metaKey || e.ctrlKey || e.altKey) return
    if ((e.target as HTMLElement).closest("input:not([type=checkbox]), textarea, [contenteditable=true]")) return
    const key = e.key.toLowerCase()
    const move = (d: number) => setFocused((f) => Math.max(0, Math.min(count - 1, (f < 0 ? (d > 0 ? -1 : count) : f) + d)))
    if ((key === "j" && !e.shiftKey) || e.key === "ArrowDown") move(1)
    else if ((key === "k" && !e.shiftKey) || e.key === "ArrowUp") move(-1)
    else if ((key === "j" || key === "k") && e.shiftKey) {
      const next = Math.max(0, Math.min(count - 1, focused + (key === "j" ? 1 : -1)))
      if (focused >= 0) onToggle(focused, true)
      onToggle(next, true)
      setFocused(next)
    }
    else if (key === "x" && focused >= 0) onToggle(focused)
    else if (e.key === "Enter" && focused >= 0 && onOpen) onOpen(focused)
    else if (e.key === "Escape" && onClear && selected > 0) onClear()
    else return
    e.preventDefault()
  }

  return {
    focused,
    setFocused,
    /** Spread on TableBody */
    bodyProps: { ref, tabIndex: 0, onKeyDown },
    /** Spread on each TableRow */
    rowProps: (index: number) => ({
      "data-row-index": index,
      "data-focused": focused === index || undefined,
      onMouseDown: () => setFocused(index),
    }),
  }
}
