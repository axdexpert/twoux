/**
 * TwoUX compositions for the frame of every screen, built from generated shadcn parts (Sheet, Button, Tabs).
 * AppShell + Sidebar*: tinted sidebar with text labels on every item, an inset white canvas, a top bar.
 *   Below 860px the sidebar moves into a sheet behind a menu button.
 *   sidebarRail collapses the sidebar to a 48px rail of icons (names in tooltips), toggled by a button or ⌘B / Ctrl+B.
 *   frame="flush" drops the canvas margin and corners, for workspaces that need every pixel (trading, editors).
 * PageHeader: title, at most three actions with the one primary rightmost, optional view tabs.
 * SidePanel: the single right-hand slot for record detail, help or the assistant; push or overlay. In push mode it is
 *   440px by default and resizable from 360px to half the canvas: splitter (drag, arrows, Home, End, double-click to reset)
 *   or the Panel width menu (Narrow, Default, Wide) for a single click.
 * HelpPanel + InfoLink: written help for the topic in view, in the same slot.
 */
import { ChevronDown, ChevronUp, ExternalLink, Info, Maximize2, Menu, MoveHorizontal, PanelLeftClose, PanelLeftOpen, X } from "lucide-react"
import * as React from "react"
import { FeatureLabel } from "./labels"
import { Count } from "./motion"
import { cn } from "../lib/cn"
import { Button } from "./button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "./dropdown-menu"
import { Kbd } from "./kbd"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "./sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import { WorkspaceContext } from "../lib/workspace"

/* ---------------------------------------------------------------- app shell */

const RailContext = React.createContext(false)
/** True while the sidebar shows as a rail of icons, so app content in the sidebar (a logo, a switcher) can shrink with it. */
export const useSidebarRail = () => React.useContext(RailContext)
const MOD = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl+"

export function AppShell({
  sidebar,
  topBar,
  panel,
  children,
  sidebarCollapsed = false,
  sidebarRail = false,
  onSidebarRailChange,
  frame = "inset",
  className,
}: {
  sidebar: React.ReactNode
  topBar?: React.ReactNode
  panel?: React.ReactNode
  children: React.ReactNode
  /** Focus mode: hides the sidebar on wide screens; the menu button still opens it */
  sidebarCollapsed?: boolean
  /** Shows the sidebar as a rail of icons, each named in a tooltip. Save the choice per person, as with any layout preference. */
  sidebarRail?: boolean
  /** Adds the Collapse sidebar button and the ⌘B / Ctrl+B shortcut. */
  onSidebarRailChange?: (rail: boolean) => void
  /** "flush" puts the canvas edge to edge with no margin or corners and turns on workspace density for everything inside
   *  (useWorkspace): only for tool pages that pass the three tests on the Content density page. */
  frame?: "inset" | "flush"
  className?: string
}) {
  const [navOpen, setNavOpen] = React.useState(false)
  React.useEffect(() => {
    if (!onSidebarRailChange) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "b" && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey) {
        e.preventDefault()
        onSidebarRailChange(!sidebarRail)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [sidebarRail, onSidebarRailChange])
  const flush = frame === "flush"
  const toggleLabel = sidebarRail ? "Expand sidebar" : "Collapse sidebar"
  return (
    <div
      data-slot="app-shell"
      data-collapsed={sidebarCollapsed || undefined}
      data-rail={(sidebarRail && !sidebarCollapsed) || undefined}
      className={cn("grid h-full min-h-0 grid-cols-[224px_minmax(0,1fr)] bg-bg transition-[grid-template-columns] duration-(--duration-move) ease-(--ease-move) min-[861px]:data-collapsed:grid-cols-[0px_minmax(0,1fr)] min-[861px]:data-rail:grid-cols-[48px_minmax(0,1fr)] max-[860px]:grid-cols-1", className)}
    >
      <RailContext.Provider value={sidebarRail && !sidebarCollapsed}>
        <TooltipProvider delayDuration={200}>
          <nav aria-label="Main" inert={sidebarCollapsed || undefined} className={cn("flex min-h-0 flex-col gap-4 overflow-x-hidden overflow-y-auto px-2 py-3 in-data-collapsed:px-0 in-data-rail:px-2 max-[860px]:hidden", flush && "border-r border-line")}>
            {sidebar}
            {onSidebarRailChange && (
              <div className="mt-auto flex in-data-rail:justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label={toggleLabel} aria-keyshortcuts="Meta+B Control+B" aria-expanded={!sidebarRail} onClick={() => onSidebarRailChange(!sidebarRail)}>
                      {sidebarRail ? <PanelLeftOpen /> : <PanelLeftClose />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{toggleLabel} <Kbd>{MOD}B</Kbd></TooltipContent>
                </Tooltip>
              </div>
            )}
          </nav>
        </TooltipProvider>
      </RailContext.Provider>
      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetContent side="left" className="bg-bg px-2 py-3">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Main navigation</SheetDescription>
          <nav aria-label="Main" className="flex flex-col gap-4" onClick={(e) => { if ((e.target as HTMLElement).closest("a, [data-slot=sidebar-item]")) setNavOpen(false) }}>{sidebar}</nav>
        </SheetContent>
      </Sheet>
      <div data-density={flush ? "workspace" : undefined} className={cn("flex min-h-0 min-w-0 overflow-hidden bg-surface", flush ? "" : "m-2 rounded-md border border-line max-[860px]:m-0 max-[860px]:rounded-none max-[860px]:border-0")}>
        <div className="flex min-w-0 flex-1 flex-col">
          {topBar !== undefined && (
            <div className={cn("flex shrink-0 items-center gap-2 border-b border-line max-[860px]:px-2", flush ? "h-10 px-3" : "h-11 px-4")}>
              <Button variant="ghost" size="icon-sm" className="min-[861px]:hidden" aria-label="Open navigation" onClick={() => setNavOpen(true)}><Menu /></Button>
              {topBar}
            </div>
          )}
          <main className="min-h-0 flex-1 overflow-y-auto"><WorkspaceContext.Provider value={flush}>{children}</WorkspaceContext.Provider></main>
        </div>
        <WorkspaceContext.Provider value={flush}>{panel}</WorkspaceContext.Provider>
      </div>
    </div>
  )
}

export function SidebarSection({ title, children }: { title?: string; children: React.ReactNode }) {
  const id = React.useId()
  const rail = useSidebarRail()
  return (
    <div role="group" aria-labelledby={title ? id : undefined} className={cn("grid gap-0.5", rail && title && "border-t border-line pt-3")}>
      {title && <span id={id} className={cn("px-2 pb-1 text-xs font-medium text-ink-3", rail && "sr-only")}>{title}</span>}
      <ul className="grid gap-0.5">{children}</ul>
    </div>
  )
}

export function SidebarItem({ icon, label, count, tag, current = false, href, onClick }: { icon?: React.ReactNode; label: string; count?: number; /** A New or Beta label after the name (plain text here; the page title carries the popover) */ tag?: "New" | "Beta"; current?: boolean; href?: string; onClick?: () => void }) {
  const rail = useSidebarRail() && !!icon
  const cls = cn(
    "flex h-7 w-full items-center gap-2 rounded-xs px-2 text-base transition-colors duration-(--duration-fast) [&_svg]:size-3.5 [&_svg]:shrink-0",
    rail && "relative h-9 justify-center px-0 [&_svg]:size-4",
    current ? "bg-surface font-medium text-ink shadow-xs ring-1 ring-line [&_svg]:text-ink-2" : "text-ink-2 hover:bg-selected hover:text-ink [&_svg]:text-ink-3"
  )
  const name = count !== undefined && count > 0 ? `${label}, ${count}` : label
  const body = rail ? (
    <>
      {icon}
      <span className="sr-only">{name}</span>
      {count !== undefined && count > 0 && <span aria-hidden="true" className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />}
    </>
  ) : (
    <>
      {icon}
      <span className="min-w-0 flex-1 truncate text-left">{label}{tag && <FeatureLabel kind={tag} className="ml-2" />}</span>
      {count !== undefined && count > 0 && <Count value={count} className="text-sm text-ink-3" />}
    </>
  )
  const el = href ? (
    <a data-slot="sidebar-item" href={href} aria-current={current ? "page" : undefined} className={cls} onClick={onClick}>{body}</a>
  ) : (
    <button data-slot="sidebar-item" type="button" aria-current={current ? "page" : undefined} className={cls} onClick={onClick}>{body}</button>
  )
  return (
    <li>
      {rail ? (
        <Tooltip>
          <TooltipTrigger asChild>{el}</TooltipTrigger>
          <TooltipContent side="right">{label}{count !== undefined && count > 0 ? ` · ${count}` : ""}{tag ? ` · ${tag}` : ""}</TooltipContent>
        </Tooltip>
      ) : el}
    </li>
  )
}

/* ---------------------------------------------------------------- page header */

export function PageHeader({ title, titleAddon, description, actions, tabs, className }: { title: string; /** After the title: an InfoLink or a FeatureLabel */ titleAddon?: React.ReactNode; description?: string; actions?: React.ReactNode; tabs?: React.ReactNode; className?: string }) {
  // Region spacing tokens: 24px sides and 20px top on an inset canvas, 12px and 8px in a workspace.
  return (
    <header data-slot="page-header" className={cn("grid gap-3 px-page pt-page-top", !tabs && "pb-group", className)}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="grid min-w-0 gap-0.5">
          <div className="flex flex-wrap items-center gap-x-2"><h1 className="text-xl font-semibold text-ink">{title}</h1>{titleAddon}</div>
          {description && <p className="text-base text-ink-2">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {tabs}
    </header>
  )
}

/* ---------------------------------------------------------------- side panel */

export type PanelMode = "push" | "overlay"

export function SidePanel({
  open,
  onOpenChange,
  mode = "push",
  label,
  title,
  meta,
  position,
  onPrevious,
  onNext,
  onOpenFull,
  footer,
  resizable = true,
  width: widthProp,
  onWidthChange,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Push mode only. On by default; turn it off for panels whose content has one right width. */
  resizable?: boolean
  /** Width in px, to save per person with onWidthChange. Leave out to let the panel keep its own. */
  width?: number
  onWidthChange?: (px: number) => void
  mode?: PanelMode
  /** What the panel is for, read by screen readers: “Listing details”. */
  label: string
  title: React.ReactNode
  /** Record ID and status line under the title. */
  meta?: React.ReactNode
  /** “3 of 9” with previous and next. */
  position?: { index: number; total: number }
  onPrevious?: () => void
  onNext?: () => void
  onOpenFull?: () => void
  /** Pinned footer: the record's one main action. */
  footer?: React.ReactNode
  children: React.ReactNode
}) {
  // Panels for one thing (settings, a form) put the title in the header bar. Record panels that step through a list keep the
  // bar for previous, next and position, and show the record's name and meta under it.
  const titleInBar = !position
  const [ownWidth, setOwnWidth] = React.useState(PANEL_DEFAULT)
  const width = widthProp ?? ownWidth
  const setWidth = (px: number) => { setOwnWidth(px); onWidthChange?.(px) }
  const canResize = resizable && mode === "push"
  const bar = (
    <div className={cn("flex h-11 shrink-0 items-center gap-1 border-b border-line", titleInBar ? "pr-2 pl-4" : "px-2")}>
      {position && (
        <>
          <Button variant="ghost" size="icon-sm" aria-label="Previous record" disabled={position.index <= 0} onClick={onPrevious} shortcut="K"><ChevronUp /></Button>
          <Button variant="ghost" size="icon-sm" aria-label="Next record" disabled={position.index >= position.total - 1} onClick={onNext} shortcut="J"><ChevronDown /></Button>
          <span className="tabular px-1 text-sm text-ink-3">{position.index + 1} of {position.total}</span>
        </>
      )}
      {titleInBar ? (
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <h2 className="truncate text-md font-semibold text-ink">{title}</h2>
          {meta && <span className="truncate text-sm text-ink-3">{meta}</span>}
        </div>
      ) : <span className="flex-1" />}
      {canResize && <PanelWidthMenu width={width} onChange={setWidth} />}
      {onOpenFull && <Button variant="ghost" size="icon-sm" aria-label="Open as full page" onClick={onOpenFull}><Maximize2 /></Button>}
      <Button variant="ghost" size="icon-sm" aria-label={`Close ${label.toLowerCase()}`} onClick={() => onOpenChange(false)}><X /></Button>
    </div>
  )
  const body = (
    <>
      {!titleInBar && (
        <div className="grid gap-1 px-4 pt-4 pb-3">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          {meta && <div className="text-sm text-ink-2">{meta}</div>}
        </div>
      )}
      <div className={cn("min-h-0 flex-1 overflow-y-auto px-4 pb-4", titleInBar && "pt-4")}>{children}</div>
      {footer && <div className="flex shrink-0 justify-end gap-2 border-t border-line px-4 py-3">{footer}</div>}
    </>
  )

  // Esc closes and focus returns to whatever opened the panel (the row), for push mode too.
  const opener = React.useRef<HTMLElement | null>(null)
  React.useEffect(() => {
    if (!open) { opener.current?.focus?.(); return }
    opener.current = document.activeElement as HTMLElement | null
    if (mode !== "push") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return
      if ((e.target as HTMLElement | null)?.closest("[role=dialog], [role=alertdialog], [role=menu], [role=listbox]")) return
      onOpenChange(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, mode, onOpenChange])

  if (mode === "overlay")
    return (
      <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
        <SheetContent side="right" showCloseButton={false} aria-label={label} onInteractOutside={(e) => e.preventDefault()}>
          <SheetTitle className="sr-only">{label}</SheetTitle>
          <SheetDescription className="sr-only">{label}</SheetDescription>
          {bar}
          {body}
        </SheetContent>
      </Sheet>
    )
  return <PushPanel open={open} label={label} width={width} onWidthChange={canResize ? setWidth : undefined}>{bar}{body}</PushPanel>
}

const PANEL_MIN = 360
const PANEL_DEFAULT = 440
/** Half the canvas the panel sits in, never less than the minimum. */
const panelMax = (el: HTMLElement | null) => Math.max(PANEL_MIN, Math.floor((el?.parentElement?.getBoundingClientRect().width ?? 2 * PANEL_DEFAULT) / 2))

/* Single-click widths (WCAG 2.5.7): the same result as dragging the splitter. */
function PanelWidthMenu({ width, onChange }: { width: number; onChange: (px: number) => void }) {
  const ref = React.useRef<HTMLButtonElement>(null)
  const wide = () => panelMax(ref.current?.closest("aside") ?? null)
  const value = width <= PANEL_MIN ? "narrow" : width === PANEL_DEFAULT ? "default" : width >= wide() - 1 ? "wide" : "custom"
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button ref={ref} variant="ghost" size="icon-sm" aria-label="Panel width"><MoveHorizontal /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Panel width</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={(v) => onChange(v === "narrow" ? PANEL_MIN : v === "wide" ? wide() : PANEL_DEFAULT)}>
          <DropdownMenuRadioItem value="narrow">Narrow</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="default">Default</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="wide">Wide, half the page</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* Push mode: the panel's width grows from 0 so the list beside it eases aside instead of jumping, and the content
   fades in with the sheet's motion (40px, 200ms ease-in-out, from shadcn's Base UI sheet). It stays mounted while it closes. */
function PushPanel({ open, label, width = PANEL_DEFAULT, onWidthChange, children }: { open: boolean; label: string; width?: number; onWidthChange?: (px: number) => void; children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(open)
  const [resizing, setResizing] = React.useState(false)
  const aside = React.useRef<HTMLElement>(null)
  const clamp = (px: number) => Math.round(Math.max(PANEL_MIN, Math.min(panelMax(aside.current), px)))
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || !onWidthChange) return
    e.preventDefault()
    const start = e.clientX, from = width
    setResizing(true)
    const onMove = (ev: PointerEvent) => onWidthChange(clamp(from + start - ev.clientX))
    const onUp = () => { setResizing(false); window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp) }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!onWidthChange) return
    const by = e.shiftKey ? 64 : 16
    // The panel sits on the right, so the left arrow makes it wider.
    const next = { ArrowLeft: width + by, ArrowRight: width - by, Home: PANEL_MIN, End: panelMax(aside.current) }[e.key]
    if (next === undefined) return
    e.preventDefault()
    onWidthChange(clamp(next))
  }
  React.useEffect(() => {
    if (open) { setMounted(true); return }
    const t = window.setTimeout(() => setMounted(false), 200)
    return () => window.clearTimeout(t)
  }, [open])
  if (!mounted) return null
  return (
    <aside
      ref={aside}
      aria-label={label}
      data-slot="side-panel"
      data-state={open ? "open" : "closed"}
      data-resizing={resizing || undefined}
      inert={!open || undefined}
      style={{ "--pw": `${width}px` } as React.CSSProperties}
      className="relative flex w-(--pw) shrink-0 justify-end overflow-hidden bg-surface transition-[width] duration-(--duration-move) ease-(--ease-move) starting:w-0 data-[state=closed]:w-0 data-resizing:transition-none max-[860px]:fixed max-[860px]:inset-0 max-[860px]:z-40 max-[860px]:w-full"
    >
      {onWidthChange && (
        <div
          role="separator"
          tabIndex={0}
          aria-orientation="vertical"
          aria-label={`Resize ${label.toLowerCase()}`}
          aria-valuemin={PANEL_MIN}
          aria-valuemax={panelMax(aside.current)}
          aria-valuenow={width}
          onPointerDown={onPointerDown}
          onKeyDown={onKeyDown}
          onDoubleClick={() => onWidthChange(PANEL_DEFAULT)}
          className="absolute inset-y-0 left-0 z-10 w-2 cursor-col-resize touch-none outline-none after:absolute after:inset-y-0 after:left-0 after:w-0.5 after:bg-primary after:opacity-0 after:transition-opacity after:duration-(--duration-fast) after:content-[''] hover:after:opacity-100 focus-visible:after:opacity-100 max-[860px]:hidden"
        />
      )}
      <div className="flex w-(--pw) min-w-(--pw) shrink-0 flex-col border-l border-line transition-[opacity,translate] duration-(--duration-move) ease-(--ease-move) starting:translate-x-10 starting:opacity-0 in-data-[state=closed]:translate-x-10 in-data-[state=closed]:opacity-0 max-[860px]:w-full max-[860px]:min-w-0">
        {children}
      </div>
    </aside>
  )
}

/* ---------------------------------------------------------------- help */

export type HelpTopic = { id: string; title: string; body: React.ReactNode; links?: { label: string; href: string }[] }

export function HelpPanel({ open, onOpenChange, topic, mode = "push", footer }: { open: boolean; onOpenChange: (o: boolean) => void; topic: HelpTopic | null; mode?: PanelMode; footer?: React.ReactNode }) {
  if (!topic) return null
  return (
    <SidePanel open={open} onOpenChange={onOpenChange} mode={mode} label="Help" title={topic.title}>
      <div className="grid gap-3 text-base text-ink-2 [&_p]:max-w-prose [&_strong]:font-medium [&_strong]:text-ink">{topic.body}</div>
      {topic.links && topic.links.length > 0 && (
        <div className="mt-5 grid gap-2 border-t border-line pt-4">
          <span className="text-sm font-medium text-ink">Learn more</span>
          {topic.links.slice(0, 3).map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-base font-medium text-primary-ink hover:underline">
              {l.label}
              <ExternalLink className="size-3" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
        </div>
      )}
      {footer && <div className="mt-5 border-t border-line pt-4">{footer}</div>}
    </SidePanel>
  )
}

/** Small “Info” link next to a heading or label that opens the help panel at that topic. */
export function InfoLink({ topic, onOpen, label = "Info" }: { topic: string; onOpen: (topicId: string) => void; label?: string }) {
  return (
    <button type="button" onClick={() => onOpen(topic)} className="relative inline-flex items-center gap-0.5 rounded-xs text-sm font-medium text-primary-ink after:absolute after:-inset-1 hover:underline">
      <Info className="size-3" aria-hidden="true" />
      {label}
    </button>
  )
}
