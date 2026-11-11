"use client"

/**
 * PaneLayout: a workspace that fills its container with columns of panes, for tool pages such as trading screens
 * and editors (see proposals/resizable-panels.md). Panes resize with splitters and move by dragging their grip.
 * Every drag has a keyboard path (splitter arrows, Home, End; grip Space, arrows, Space, Esc) and a menu path
 * (Move up, down, left, right; Wider, Narrower, Taller, Shorter), as WCAG 2.5.7 asks, and every change is announced.
 * Splitters follow the WAI-ARIA window splitter pattern.
 * Any pane collapses to its header from its menu; a column of collapsed panes becomes a 36px strip that expands on click.
 * Below `stackBelow` pixels the panes stack in one column and the page scrolls instead.
 */
import { ChevronDown, ChevronRight, Ellipsis, GripVertical } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/cn"
import { Button } from "./button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu"

/** collapsed keeps a pane's header only; a column whose panes are all collapsed becomes a 36px strip. */
export type PaneLayoutValue = { id: string; size: number; panes: { id: string; size: number; collapsed?: boolean }[] }[]
export type PaneDef = {
  title: string
  /** Replaces the title in the header, such as a segmented control switching the pane's view. The title still names the pane. */
  header?: React.ReactNode
  /** One control at most, such as a period switch; everything else goes in the content. */
  actions?: React.ReactNode
  /** DropdownMenuItems for this pane, shown first in its ⋯ menu, such as Show as table. */
  menu?: React.ReactNode
  children: React.ReactNode
}

const MIN_W = 200
const MIN_H = 96
const STEP = 16
const BIG = 64

type Size = { width: number; height: number; stacked: boolean }
const SizeCtx = React.createContext<Size>({ width: 0, height: 0, stacked: false })
/** The content box of the pane this is rendered in, so a chart can draw at the height it has. */
export const usePaneSize = () => React.useContext(SizeCtx)

function useBox<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [box, setBox] = React.useState({ width: 0, height: 0 })
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setBox({ width: Math.round(e.contentRect.width), height: Math.round(e.contentRect.height) }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, box] as const
}

const clone = (l: PaneLayoutValue): PaneLayoutValue => l.map((c) => ({ ...c, panes: c.panes.map((p) => ({ ...p })) }))
const locate = (l: PaneLayoutValue, id: string) => {
  for (let c = 0; c < l.length; c++) {
    const i = l[c].panes.findIndex((p) => p.id === id)
    if (i >= 0) return { c, i }
  }
  return null
}
function moveTo(l: PaneLayoutValue, id: string, c: number, i: number): PaneLayoutValue {
  const at = locate(l, id)
  if (!at) return l
  const next = clone(l)
  const [pane] = next[at.c].panes.splice(at.i, 1)
  const target = next[c]
  // A pane's size is a share of its own column, so in a new column it takes an equal share.
  if (at.c !== c) pane.size = target.panes.length ? target.panes.reduce((t, p) => t + p.size, 0) / target.panes.length : 1
  target.panes.splice(Math.max(0, Math.min(i, target.panes.length)), 0, pane)
  return next.filter((col) => col.panes.length > 0)
}

export function PaneLayout({
  value,
  onValueChange,
  panes,
  onReset,
  stackBelow = 900,
  className,
  "aria-label": label,
}: {
  value: PaneLayoutValue
  onValueChange: (next: PaneLayoutValue) => void
  panes: Record<string, PaneDef>
  /** Adds Reset layout to every pane's menu. Apply it at once and offer Undo in a toast. */
  onReset?: () => void
  /** Container width below which panes stack in one column. */
  stackBelow?: number
  className?: string
  "aria-label": string
}) {
  const [rootRef, root] = useBox<HTMLDivElement>()
  const stacked = root.width > 0 && root.width < stackBelow
  const [message, setMessage] = React.useState("")
  const announce = React.useCallback((t: string) => setMessage((m) => (m === t ? `${t} ` : t)), [])
  const title = (id: string) => panes[id]?.title ?? id
  const where = (l: PaneLayoutValue, id: string) => {
    const at = locate(l, id)
    return at ? `column ${at.c + 1} of ${l.length}, position ${at.i + 1} of ${l[at.c].panes.length}` : ""
  }

  /* ---------- reorder ---------- */
  const [drag, setDrag] = React.useState<{ id: string; over: string | null; after: boolean } | null>(null)
  const startDrag = (id: string, e: React.PointerEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    let state = { id, over: null as string | null, after: false }
    setDrag(state)
    announce(`Dragging ${title(id)}.`)
    const onMove = (ev: PointerEvent) => {
      const hit = document.elementsFromPoint(ev.clientX, ev.clientY).map((el) => (el as HTMLElement).closest<HTMLElement>("[data-pane-id]")).find((el) => el && el.dataset.paneId !== id)
      if (!hit) return
      const r = hit.getBoundingClientRect()
      state = { id, over: hit.dataset.paneId ?? null, after: ev.clientY > r.top + r.height / 2 }
      setDrag(state)
    }
    const onUp = () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      setDrag(null)
      if (!state.over) return announce(`${title(id)} not moved.`)
      const to = locate(value, state.over)
      const from = locate(value, id)
      if (!to || !from) return
      const i = to.i + (state.after ? 1 : 0) - (from.c === to.c && from.i < to.i ? 1 : 0)
      const next = moveTo(value, id, to.c, i)
      onValueChange(next)
      announce(`${title(id)} moved to ${where(next, id)}.`)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }
  const step = (id: string, dir: "up" | "down" | "left" | "right", l = value) => {
    const at = locate(l, id)
    if (!at) return l
    if (dir === "up") return at.i > 0 ? moveTo(l, id, at.c, at.i - 1) : l
    if (dir === "down") return at.i < l[at.c].panes.length - 1 ? moveTo(l, id, at.c, at.i + 1) : l
    const c = at.c + (dir === "left" ? -1 : 1)
    if (c < 0 || c >= l.length) return l
    return moveTo(l, id, c, at.i)
  }
  const can = (id: string, dir: "up" | "down" | "left" | "right") => step(id, dir) !== value
  const menuMove = (id: string, dir: "up" | "down" | "left" | "right") => {
    const next = step(id, dir)
    onValueChange(next)
    announce(`${title(id)} moved to ${where(next, id)}.`)
  }

  // Keyboard pick-up on the grip: Space or Enter picks up and drops, arrows move, Esc puts it back.
  const [picked, setPicked] = React.useState<{ id: string; before: PaneLayoutValue } | null>(null)
  const gripKey = (id: string, e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      if (picked?.id === id) { setPicked(null); announce(`${title(id)} dropped at ${where(value, id)}.`) }
      else { setPicked({ id, before: value }); announce(`${title(id)} picked up. Use the arrow keys to move it, Space to drop it, Escape to cancel.`) }
      return
    }
    if (picked?.id !== id) return
    const dir = ({ ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" } as const)[e.key as "ArrowUp"]
    if (dir) {
      e.preventDefault()
      const next = step(id, dir)
      if (next !== value) { onValueChange(next); announce(`${where(next, id)}.`) }
    } else if (e.key === "Escape") {
      e.preventDefault()
      onValueChange(picked.before)
      setPicked(null)
      announce(`${title(id)} put back.`)
    }
  }
  // Moving a pane remounts its grip; keep keyboard focus on it.
  const grips = React.useRef(new Map<string, HTMLButtonElement>())
  React.useEffect(() => { if (picked) grips.current.get(picked.id)?.focus() }, [value, picked])

  /* ---------- resize ---------- */
  const colRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const resize = (kind: "col" | "pane", c: number, i: number, deltaPx: number) => {
    const next = clone(value)
    const list = kind === "col" ? next : next[c].panes
    const els = kind === "col" ? colRefs.current : Array.from(colRefs.current[c]?.querySelectorAll<HTMLElement>(":scope > [data-pane-id]") ?? [])
    const px = (k: number) => (kind === "col" ? els[k]?.getBoundingClientRect().width : els[k]?.getBoundingClientRect().height) ?? 0
    const a = px(i), b = px(i + 1)
    const min = kind === "col" ? MIN_W : MIN_H
    const d = Math.max(min - a, Math.min(b - min, deltaPx))
    if (!a || !b || !d) return value
    const total = list[i].size + list[i + 1].size
    list[i].size = (total * (a + d)) / (a + b)
    list[i + 1].size = total - list[i].size
    return next
  }
  const splitter = (kind: "col" | "pane", c: number, i: number, name: string) => {
    const vertical = kind === "col"
    const list = vertical ? value : value[c].panes
    const pct = Math.round((list[i].size / (list[i].size + list[i + 1].size)) * 100)
    const onPointerDown = (e: React.PointerEvent) => {
      if (e.button !== 0) return
      e.preventDefault()
      const start = vertical ? e.clientX : e.clientY
      const base = value
      let last = base
      const onMove = (ev: PointerEvent) => {
        const d = (vertical ? ev.clientX : ev.clientY) - start
        // Resize from the layout at pointer-down, so the splitter tracks the pointer exactly.
        last = resizeFrom(base, kind, c, i, d)
        onValueChange(last)
      }
      const onUp = () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp) }
      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onUp)
    }
    const onKeyDown = (e: React.KeyboardEvent) => {
      const by = e.shiftKey ? BIG : STEP
      const keys: Record<string, number> = vertical ? { ArrowLeft: -by, ArrowRight: by, Home: -1e5, End: 1e5 } : { ArrowUp: -by, ArrowDown: by, Home: -1e5, End: 1e5 }
      if (!(e.key in keys)) return
      e.preventDefault()
      onValueChange(resize(kind, c, i, keys[e.key]))
    }
    return (
      <div
        role="separator"
        tabIndex={0}
        aria-orientation={vertical ? "vertical" : "horizontal"}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Resize ${name}`}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        className={cn(
          "group/split relative z-10 shrink-0 touch-none bg-line outline-none",
          vertical ? "w-px cursor-col-resize" : "h-px cursor-row-resize",
          "before:absolute before:content-['']",
          vertical ? "before:inset-y-0 before:-inset-x-1" : "before:inset-x-0 before:-inset-y-1",
          "after:absolute after:bg-primary after:opacity-0 after:transition-opacity after:duration-(--duration-fast) after:content-[''] hover:after:opacity-100 focus-visible:after:opacity-100",
          vertical ? "after:inset-y-0 after:-left-px after:w-0.5" : "after:inset-x-0 after:-top-px after:h-0.5"
        )}
      />
    )
  }
  // Same as resize, but from a fixed starting layout (for pointer drags).
  const resizeFrom = (base: PaneLayoutValue, kind: "col" | "pane", c: number, i: number, d: number) => {
    const next = clone(base)
    const list = kind === "col" ? next : next[c].panes
    const els = kind === "col" ? colRefs.current : Array.from(colRefs.current[c]?.querySelectorAll<HTMLElement>(":scope > [data-pane-id]") ?? [])
    const total = list[i].size + list[i + 1].size
    const span = (kind === "col" ? els.slice(i, i + 2).reduce((s, el) => s + (el?.getBoundingClientRect().width ?? 0), 0) : els.slice(i, i + 2).reduce((s, el) => s + (el?.getBoundingClientRect().height ?? 0), 0))
    if (!span) return base
    const baseA = (span * list[i].size) / total
    const min = kind === "col" ? MIN_W : MIN_H
    const a = Math.max(min, Math.min(span - min, baseA + d))
    list[i].size = (total * a) / span
    list[i + 1].size = total - list[i].size
    return next
  }

  // Single-pointer resizing from the menu (WCAG 2.5.7): grow or shrink by 64px against the neighbour.
  const grow = (id: string, axis: "width" | "height", d: number) => {
    const at = locate(value, id)
    if (!at) return
    const next = axis === "width"
      ? at.c < value.length - 1 ? resize("col", at.c, at.c, d) : resize("col", at.c - 1, at.c - 1, -d)
      : at.i < value[at.c].panes.length - 1 ? resize("pane", at.c, at.i, d) : resize("pane", at.c, at.i - 1, -d)
    onValueChange(next)
    announce(`${title(id)} ${d > 0 ? (axis === "width" ? "wider" : "taller") : axis === "width" ? "narrower" : "shorter"}.`)
  }
  const toggle = (id: string) => {
    const next = clone(value)
    const at = locate(next, id)
    if (!at) return
    const p = next[at.c].panes[at.i]
    p.collapsed = !p.collapsed
    onValueChange(next)
    announce(`${title(id)} ${p.collapsed ? "collapsed" : "expanded"}.`)
  }
  const colCollapsed = (c: number) => !stacked && value[c].panes.every((p) => p.collapsed)
  const pane = (id: string, c: number, i: number) => {
    const def = panes[id]
    if (!def) return null
    const dropLine = drag?.over === id
    const collapsed = !!value[c].panes[i].collapsed
    if (colCollapsed(c)) {
      return (
        <section key={id} data-pane-id={id} aria-label={def.title} className="flex min-h-0 flex-1 flex-col items-center gap-2 bg-surface py-1">
          <Button variant="ghost" size="icon-xs" aria-label={`Expand ${def.title}`} aria-expanded={false} onClick={() => toggle(id)}><ChevronRight /></Button>
          <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => toggle(id)} className="min-h-0 truncate text-sm font-medium text-ink-2 [writing-mode:vertical-rl] hover:text-ink">{def.title}</button>
        </section>
      )
    }
    return (
      <PaneFrame
        collapsed={collapsed}
        onToggle={() => toggle(id)}
        key={id}
        id={id}
        def={def}
        stacked={stacked}
        size={value[c].panes[i].size}
        dragging={drag?.id === id || picked?.id === id}
        drop={dropLine ? (drag?.after ? "after" : "before") : null}
        gripRef={(el) => { if (el) grips.current.set(id, el); else grips.current.delete(id) }}
        onGripPointerDown={(e) => startDrag(id, e)}
        onGripKeyDown={(e) => gripKey(id, e)}
        menu={
          <DropdownMenuContent align="end">
            {def.menu && !collapsed && <>{def.menu}<DropdownMenuSeparator /></>}
            <DropdownMenuItem onSelect={() => toggle(id)}>{collapsed ? "Expand" : "Collapse"}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={!can(id, "up")} onSelect={() => menuMove(id, "up")}>Move up</DropdownMenuItem>
            <DropdownMenuItem disabled={!can(id, "down")} onSelect={() => menuMove(id, "down")}>Move down</DropdownMenuItem>
            {!stacked && <DropdownMenuItem disabled={!can(id, "left")} onSelect={() => menuMove(id, "left")}>Move left</DropdownMenuItem>}
            {!stacked && <DropdownMenuItem disabled={!can(id, "right")} onSelect={() => menuMove(id, "right")}>Move right</DropdownMenuItem>}
            {!stacked && (
              <>
                <DropdownMenuSeparator />
                {value.length > 1 && <DropdownMenuItem onSelect={(e) => { e.preventDefault(); grow(id, "width", BIG) }}>Wider</DropdownMenuItem>}
                {value.length > 1 && <DropdownMenuItem onSelect={(e) => { e.preventDefault(); grow(id, "width", -BIG) }}>Narrower</DropdownMenuItem>}
                {!collapsed && value[c].panes.filter((p) => !p.collapsed).length > 1 && <DropdownMenuItem onSelect={(e) => { e.preventDefault(); grow(id, "height", BIG) }}>Taller</DropdownMenuItem>}
                {!collapsed && value[c].panes.filter((p) => !p.collapsed).length > 1 && <DropdownMenuItem onSelect={(e) => { e.preventDefault(); grow(id, "height", -BIG) }}>Shorter</DropdownMenuItem>}
              </>
            )}
            {onReset && <><DropdownMenuSeparator /><DropdownMenuItem onSelect={onReset}>Reset layout</DropdownMenuItem></>}
          </DropdownMenuContent>
        }
      />
    )
  }

  return (
    <div ref={rootRef} role="region" aria-label={label} className={cn("flex min-h-0 min-w-0", stacked ? "flex-none flex-col gap-px bg-line" : "h-full flex-1 flex-row", className)}>
      {stacked
        ? value.flatMap((col, c) => col.panes.map((p, i) => pane(p.id, c, i)))
        : value.map((col, c) => (
            <React.Fragment key={col.id}>
              {c > 0 && (colCollapsed(c - 1) || colCollapsed(c) ? <span aria-hidden="true" className="w-px shrink-0 bg-line" /> : splitter("col", c - 1, c - 1, `${value[c - 1].panes.map((p) => title(p.id)).join(" and ")} column`))}
              <div ref={(el) => { colRefs.current[c] = el }} className={cn("flex min-h-0 min-w-0 flex-col", colCollapsed(c) ? "w-9 flex-none gap-px bg-line" : "basis-0 grow-(--g)")} style={{ "--g": col.size } as React.CSSProperties}>
                {col.panes.map((p, i) => (
                  <React.Fragment key={p.id}>
                    {i > 0 && !colCollapsed(c) && (col.panes[i - 1].collapsed || p.collapsed ? <span aria-hidden="true" className="h-px shrink-0 bg-line" /> : splitter("pane", c, i - 1, title(col.panes[i - 1].id)))}
                    {pane(p.id, c, i)}
                  </React.Fragment>
                ))}
              </div>
            </React.Fragment>
          ))}
      <p aria-live="polite" className="sr-only">{message}</p>
    </div>
  )
}

function PaneFrame({
  collapsed,
  onToggle,
  id,
  def,
  stacked,
  size,
  dragging,
  drop,
  gripRef,
  onGripPointerDown,
  onGripKeyDown,
  menu,
}: {
  id: string
  def: PaneDef
  stacked: boolean
  size: number
  dragging: boolean
  drop: "before" | "after" | null
  gripRef: (el: HTMLButtonElement | null) => void
  onGripPointerDown: (e: React.PointerEvent) => void
  onGripKeyDown: (e: React.KeyboardEvent) => void
  menu: React.ReactNode
  collapsed: boolean
  onToggle: () => void
}) {
  const [bodyRef, box] = useBox<HTMLDivElement>()
  const headingId = React.useId()
  return (
    <section
      data-pane-id={id}
      aria-labelledby={headingId}
      className={cn("relative flex min-w-0 flex-col bg-surface", stacked || collapsed ? "shrink-0" : "min-h-0 basis-0 grow-(--g)", dragging && "opacity-60")}
      style={stacked ? undefined : ({ "--g": size } as React.CSSProperties)}
    >
      {drop && <span aria-hidden="true" className={cn("absolute inset-x-0 z-20 h-0.5 bg-primary", drop === "before" ? "top-0" : "bottom-0")} />}
      <header className="flex h-8 shrink-0 items-center gap-1 border-b border-line pr-1 pl-0.5">
        <button
          ref={gripRef}
          type="button"
          aria-label={`Move ${def.title}`}
          aria-roledescription="draggable pane"
          aria-pressed={dragging || undefined}
          onPointerDown={onGripPointerDown}
          onKeyDown={onGripKeyDown}
          className="grid h-6 w-4 shrink-0 cursor-grab touch-none place-items-center rounded-xs text-ink-3 outline-none hover:bg-hover hover:text-ink-2 focus-visible:ring-2 focus-visible:ring-primary active:cursor-grabbing [&_svg]:size-3.5"
        >
          <GripVertical />
        </button>
        <h2 id={headingId} className={cn("min-w-0 truncate text-sm font-medium text-ink", def.header && "sr-only")}>{def.title}</h2>
        {def.header && <div className="flex min-w-0 items-center">{def.header}</div>}
        <span className="flex-1" />
        {collapsed ? <Button variant="ghost" size="icon-xs" aria-label={`Expand ${def.title}`} aria-expanded={false} onClick={onToggle}><ChevronDown /></Button> : def.actions}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs" aria-label={`${def.title} options`}><Ellipsis /></Button>
          </DropdownMenuTrigger>
          {menu}
        </DropdownMenu>
      </header>
      <div ref={bodyRef} hidden={collapsed} className={cn("min-h-0 flex-1", stacked ? "" : "overflow-auto")}>
        <SizeCtx.Provider value={{ ...box, stacked }}>{def.children}</SizeCtx.Provider>
      </div>
    </section>
  )
}
