/**
 * TwoUX composition after an open-source board layout (Apache 2.0, see NOTICE.md): a grid of
 * self-contained items people can reorder and resize. Built on TwoUX's Card, Button and Dropdown menu.
 * Every drag has a keyboard and a menu alternative (WCAG 2.1.1, 2.5.7), and every change is announced.
 */
import { Ellipsis, GripVertical, MoveHorizontal, Plus, Search } from "lucide-react"
import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "../lib/cn"
import { Button } from "./button"
import { Input } from "./input"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu"

export type BoardItemData = { id: string; title: string; columnSpan?: number }
const PALETTE_MIME = "application/x-twoux-board-item"
const COLUMNS = 4
const SPAN: Record<number, string> = { 1: "", 2: "@2xl:col-span-2", 3: "@2xl:col-span-2 @5xl:col-span-3", 4: "@2xl:col-span-2 @5xl:col-span-4" }
const reducedMotion = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

type Drag = { id: string; from: number; over: number; x: number; y: number; w: number; h: number; dx: number; dy: number }
type BoardCtx = {
  items: BoardItemData[]
  move: (id: string, to: number) => void
  resize: (id: string, span: number) => void
  remove: (id: string) => void
  announce: (text: string) => void
  startDrag: (id: string, e: React.PointerEvent, card: HTMLElement) => void
  draggingId: string | null
  settledId: string | null
}
const Ctx = React.createContext<BoardCtx | null>(null)
const useBoard = () => {
  const c = React.useContext(Ctx)
  if (!c) throw new Error("BoardItem must be inside Board")
  return c
}

export function Board({
  items,
  onItemsChange,
  renderItem,
  empty,
  onAddFromPalette,
  className,
  "aria-label": label = "Dashboard",
}: {
  items: BoardItemData[]
  onItemsChange: (items: BoardItemData[]) => void
  renderItem: (item: BoardItemData) => React.ReactNode
  /** Shown when there are no items, e.g. an Empty state with "Add items". */
  empty: React.ReactNode
  /** An item dragged in from the ItemsPalette was dropped at this position. */
  onAddFromPalette?: (paletteId: string, index: number) => void
  className?: string
  "aria-label"?: string
}) {
  const [message, setMessage] = React.useState("")
  const [drag, setDragState] = React.useState<Drag | null>(null)
  const dragRef = React.useRef<Drag | null>(null)
  const setDrag = (d: Drag | null) => { dragRef.current = d; setDragState(d) }
  const [paletteOver, setPaletteOver] = React.useState<number | null>(null)
  const [settledId, setSettledId] = React.useState<string | null>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const announce = React.useCallback((t: string) => setMessage((m) => (m === t ? `${t} ` : t)), [])

  const settle = (id: string) => { setSettledId(id); setTimeout(() => setSettledId((s) => (s === id ? null : s)), 900) }
  const move = (id: string, to: number) => {
    const from = items.findIndex((i) => i.id === id)
    const clamped = Math.max(0, Math.min(items.length - 1, to))
    if (from < 0 || from === clamped) return
    const next = [...items]
    const [it] = next.splice(from, 1)
    next.splice(clamped, 0, it)
    onItemsChange(next)
    announce(`${it.title} moved to position ${clamped + 1} of ${items.length}.`)
  }

  // Which slot is under the pointer, against the layout measured when the drag started (so the moving slot can't chase itself).
  const snapshot = () => Array.from(listRef.current?.querySelectorAll<HTMLElement>("[data-cell-id]") ?? []).map((c) => ({ id: c.dataset.cellId!, r: c.getBoundingClientRect() }))
  const slotFrom = (cells: { id: string; r: DOMRect }[], x: number, y: number) => {
    let best = { i: cells.length, d: Number.POSITIVE_INFINITY }
    cells.forEach(({ r }, i) => {
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) { best = { i, d: -1 }; return }
      if (best.d < 0) return
      const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2))
      if (d < best.d) best = { i: i === cells.length - 1 && (y > r.bottom || x > r.right) ? cells.length : i, d }
    })
    return best.i
  }

  const startDrag = (id: string, e: React.PointerEvent, card: HTMLElement) => {
    if (e.button !== 0) return
    const r = card.getBoundingClientRect()
    const from = items.findIndex((i) => i.id === id)
    const sx = e.clientX, sy = e.clientY
    const cells = snapshot()
    let started = false
    const onMove = (ev: PointerEvent) => {
      if (!started && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 4) return // a click on the handle is not a drag
      if (!started) { started = true; announce(`Dragging ${items[from].title}.`) }
      setDrag({ id, from, over: Math.min(slotFrom(cells, ev.clientX, ev.clientY), items.length - 1), x: ev.clientX, y: ev.clientY, w: r.width, h: r.height, dx: sx - r.left, dy: sy - r.top })
    }
    const finish = (commit: boolean) => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("keydown", onKey)
      const d = dragRef.current
      setDrag(null)
      if (d && commit && d.over !== d.from) { move(id, d.over); settle(id) }
      else if (d && !commit) announce(`Move cancelled. ${items[from].title} is back at position ${from + 1}.`)
    }
    const onUp = () => finish(true)
    const onKey = (ev: KeyboardEvent) => { if (ev.key === "Escape") { ev.preventDefault(); finish(false) } }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("keydown", onKey)
  }

  // Items in the order they'd have if dropped now; the dragged one becomes the landing slot.
  const preview = React.useMemo(() => {
    if (!drag) return items
    const rest = items.filter((i) => i.id !== drag.id)
    return [...rest.slice(0, drag.over), items[drag.from], ...rest.slice(drag.over)]
  }, [items, drag])

  // FLIP: cells glide to their new places instead of jumping.
  const rects = React.useRef(new Map<string, DOMRect>())
  React.useLayoutEffect(() => {
    const cells = Array.from(listRef.current?.querySelectorAll<HTMLElement>("[data-cell-id]") ?? [])
    const reduce = reducedMotion()
    for (const c of cells) {
      const id = c.dataset.cellId!
      const now = c.getBoundingClientRect()
      const before = rects.current.get(id)
      if (before && !reduce && (before.left !== now.left || before.top !== now.top)) {
        c.animate([{ transform: `translate(${before.left - now.left}px, ${before.top - now.top}px)` }, { transform: "none" }], { duration: 180, easing: "cubic-bezier(0.2, 0, 0, 1)" })
      }
      rects.current.set(id, now)
    }
  })

  const draggingItem = drag ? items[drag.from] : null
  const active = !!drag || paletteOver !== null
  const value: BoardCtx = {
    items,
    move,
    resize: (id, span) => {
      const sp = Math.max(1, Math.min(COLUMNS, span))
      const it = items.find((i) => i.id === id)
      if (!it || (it.columnSpan ?? 1) === sp) return
      onItemsChange(items.map((i) => (i.id === id ? { ...i, columnSpan: sp } : i)))
      announce(`${it.title} now ${sp} of ${COLUMNS} columns wide.`)
      settle(id)
    },
    remove: (id) => {
      const it = items.find((i) => i.id === id)
      onItemsChange(items.filter((i) => i.id !== id))
      if (it) announce(`${it.title} removed.`)
    },
    announce,
    startDrag,
    draggingId: drag?.id ?? null,
    settledId,
  }

  const paletteCells = React.useRef<{ id: string; r: DOMRect }[] | null>(null)
  const onPaletteOver = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes(PALETTE_MIME)) return
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
    paletteCells.current ??= snapshot()
    const at = slotFrom(paletteCells.current, e.clientX, e.clientY)
    if (at !== paletteOver) setPaletteOver(at)
  }
  const onPaletteDrop = (e: React.DragEvent) => {
    const pid = e.dataTransfer.getData(PALETTE_MIME)
    if (pid && onAddFromPalette) { e.preventDefault(); onAddFromPalette(pid, paletteOver ?? items.length) }
    paletteCells.current = null
    setPaletteOver(null)
  }

  const slot = (key: string, span = 1, h?: number) => (
    <li
      key={key}
      aria-hidden="true"
      className={cn("min-h-24 rounded-sm border-2 border-dashed border-primary/50 bg-primary-soft/60 h-(--slot-h)", SPAN[span])}
      style={h ? ({ "--slot-h": `${h}px` } as React.CSSProperties) : undefined}
    />
  )

  return (
    <Ctx.Provider value={value}>
      <section
        aria-label={label}
        data-slot="board"
        data-dragging={active || undefined}
        className={cn("@container rounded-md transition-[background-color,box-shadow] duration-(--duration-fast)", active && "bg-primary-soft/30 ring-1 ring-primary/25 ring-offset-4 ring-offset-bg", className)}
        onDragOver={onPaletteOver}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) { paletteCells.current = null; setPaletteOver(null) } }}
        onDrop={onPaletteDrop}
      >
        {items.length === 0 && paletteOver === null ? (
          empty
        ) : (
          <ul ref={listRef} className="grid grid-cols-1 gap-3 @2xl:grid-cols-2 @5xl:grid-cols-4">
            {preview.map((it, i) => {
              if (drag && it.id === drag.id) return slot(`slot-${it.id}`, it.columnSpan ?? 1, drag.h)
              return (
                <React.Fragment key={it.id}>
                  {paletteOver === i && slot("palette-slot")}
                  <li data-cell-id={it.id} data-slot="board-cell" className={cn("min-w-0", SPAN[it.columnSpan ?? 1])}>
                    {renderItem(it)}
                  </li>
                </React.Fragment>
              )
            })}
            {paletteOver !== null && paletteOver >= preview.length && slot("palette-slot")}
          </ul>
        )}
        {drag && draggingItem && typeof document !== "undefined" && createPortal(
          <div
            aria-hidden="true"
            className="pointer-events-none fixed z-50 w-(--w) rotate-1 cursor-grabbing opacity-95 shadow-pop left-(--x) top-(--y) [&_[data-slot=board-item]]:shadow-pop"
            style={{ "--w": `${drag.w}px`, "--x": `${drag.x - drag.dx}px`, "--y": `${drag.y - drag.dy}px` } as React.CSSProperties}
          >
            {renderItem(draggingItem)}
          </div>,
          document.body,
        )}
        <div aria-live="assertive" className="sr-only">{message}</div>
      </section>
    </Ctx.Provider>
  )
}

export function BoardItem({
  id,
  header,
  description,
  settings,
  actions,
  footer,
  disableContentPaddings = false,
  level = 3,
  className,
  children,
}: {
  id: string
  header: string
  /** Heading level of the header. Use 2 when the board sits straight under the page's h1. */
  level?: 2 | 3 | 4
  description?: string
  /** Extra items for the item's menu; Move, Resize and Remove are always there. */
  settings?: React.ReactNode
  /** One or two quiet buttons in the header, before the menu (Refresh, View in…). */
  actions?: React.ReactNode
  footer?: React.ReactNode
  disableContentPaddings?: boolean
  className?: string
  children: React.ReactNode
}) {
  const board = useBoard()
  const index = board.items.findIndex((i) => i.id === id)
  const span = board.items[index]?.columnSpan ?? 1
  const [grabbed, setGrabbed] = React.useState<{ from: number } | null>(null)
  const handle = React.useRef<HTMLButtonElement>(null)
  const card = React.useRef<HTMLElement>(null)
  const headingId = React.useId()
  const settled = board.settledId === id

  // Keyboard reorder: Enter or Space picks up, arrows move, Enter drops, Esc puts it back.
  const onHandleKey = (e: React.KeyboardEvent) => {
    const k = e.key
    if (!grabbed && (k === "Enter" || k === " ")) {
      e.preventDefault()
      setGrabbed({ from: index })
      board.announce(`Picked up ${header}, position ${index + 1} of ${board.items.length}. Use arrow keys to move, Enter to drop, Escape to cancel.`)
      return
    }
    if (!grabbed) return
    if (["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].includes(k)) {
      e.preventDefault()
      board.move(id, index + (k === "ArrowLeft" || k === "ArrowUp" ? -1 : 1))
    } else if (k === "Enter" || k === " ") {
      e.preventDefault()
      setGrabbed(null)
      board.announce(`${header} dropped at position ${index + 1}.`)
    } else if (k === "Escape") {
      e.preventDefault()
      board.move(id, grabbed.from)
      setGrabbed(null)
      board.announce(`Move cancelled. ${header} is back at position ${grabbed.from + 1}.`)
    }
  }
  React.useEffect(() => { if (grabbed) handle.current?.focus() }, [grabbed, index])

  return (
    <article
      ref={card}
      aria-labelledby={headingId}
      data-slot="board-item"
      data-grabbed={grabbed ? "" : undefined}
      className={cn(
        "group/item flex h-full flex-col rounded-sm border bg-surface shadow-card transition-[box-shadow,border-color] duration-(--duration-base) ease-(--ease-out)",
        grabbed ? "border-primary shadow-pop ring-3 ring-primary/20" : settled ? "border-primary ring-3 ring-primary/20" : "border-line hover:border-line-strong",
        className
      )}
    >
      <header className="flex items-start gap-1 py-2 pr-2 pl-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              ref={handle}
              type="button"
              aria-label={`Move ${header}`}
              aria-description="Drag to move, or press Enter and use the arrow keys."
              aria-pressed={!!grabbed}
              onKeyDown={onHandleKey}
              onPointerDown={(e) => { if (card.current && !grabbed) board.startDrag(id, e, card.current) }}
              className="relative mt-px grid size-6 shrink-0 cursor-grab touch-none place-items-center rounded-xs text-ink-3 transition-colors group-hover/item:bg-hover group-hover/item:text-ink-2 hover:text-ink active:cursor-grabbing aria-pressed:bg-primary-soft aria-pressed:text-primary-ink"
            >
              <GripVertical className="size-3.5" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Drag to move, or press Enter to use the arrow keys</TooltipContent>
        </Tooltip>
        <div className="grid min-w-0 flex-1 gap-0.5 pt-0.5">
          {React.createElement(`h${level}`, { id: headingId, className: "truncate text-base font-semibold text-ink" }, header)}
          {description && <p className="truncate text-sm text-ink-3">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={`Settings for ${header}`}><Ellipsis /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {settings}
            {settings && <DropdownMenuSeparator />}
            <DropdownMenuItem disabled={index === 0} onSelect={() => board.move(id, index - 1)}>Move earlier</DropdownMenuItem>
            <DropdownMenuItem disabled={index === board.items.length - 1} onSelect={() => board.move(id, index + 1)}>Move later</DropdownMenuItem>
            <DropdownMenuItem disabled={span >= COLUMNS} onSelect={() => board.resize(id, span + 1)}><MoveHorizontal />Wider</DropdownMenuItem>
            <DropdownMenuItem disabled={span <= 1} onSelect={() => board.resize(id, span - 1)}>Narrower</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => board.remove(id)}>Remove from dashboard</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <div className={cn("min-h-0 flex-1", !disableContentPaddings && "px-3 pb-3")}>{children}</div>
      {footer && <footer className="border-t border-line px-3 py-2 text-sm text-ink-2">{footer}</footer>}
    </article>
  )
}

/* ---------------------------------------------------------------- items palette */

export type PaletteItem = { id: string; title: string; description: string; type: "Key metrics" | "Chart" | "List" | "Status" | "Links" }

/** Items not yet on the board: title, one line, type. Add with the button (keyboard and one click) or drag onto the board. */
export function ItemsPalette({ items, onAdd, className }: { items: PaletteItem[]; onAdd: (id: string) => void; className?: string }) {
  const [q, setQ] = React.useState("")
  const shown = items.filter((i) => `${i.title} ${i.description}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <div data-slot="items-palette" className={cn("grid content-start gap-2", className)}>
      {items.length > 10 && (
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-3" aria-hidden="true" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find an item" aria-label="Find an item" className="pl-8" />
        </div>
      )}
      {items.length === 0 ? (
        <p className="py-6 text-center text-base text-ink-2">All items are on your dashboard.</p>
      ) : shown.length === 0 ? (
        <p className="flex items-center justify-center gap-2 py-6 text-base text-ink-2">No items match. <Button variant="ghost" size="xs" onClick={() => setQ("")}>Clear search</Button></p>
      ) : (
        <ul className="grid gap-2" aria-label="Items you can add">
          {shown.map((it) => (
            <li
              key={it.id}
              draggable
              onDragStart={(e) => { e.dataTransfer.setData(PALETTE_MIME, it.id); e.dataTransfer.effectAllowed = "copy" }}
              className="group/pal flex cursor-grab items-start gap-2 rounded-sm border border-line bg-surface p-2 shadow-xs transition-[border-color,box-shadow] duration-(--duration-fast) hover:border-line-strong hover:shadow-card active:cursor-grabbing"
            >
              <GripVertical className="mt-0.5 size-3.5 shrink-0 text-ink-3 transition-colors group-hover/pal:text-ink-2" aria-hidden="true" />
              <span className="grid min-w-0 flex-1 gap-0.5">
                <span className="text-base font-medium text-ink">{it.title}</span>
                <span className="text-sm text-ink-2">{it.description}</span>
                <span className="text-xs text-ink-3">{it.type}</span>
              </span>
              <Button variant="outline" size="xs" onClick={() => onAdd(it.id)} aria-label={`Add ${it.title} to dashboard`}><Plus />Add</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
