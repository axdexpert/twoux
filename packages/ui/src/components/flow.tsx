/**
 * TwoUX Flow canvas: build an automation as connected steps, set each one up, and watch a test run move through it.
 * Built on @xyflow/react (MIT) for pan, zoom, edge paths and the minimap. TwoUX changes to the reference tools (n8n, Vapi):
 *  - Type and state are written as words on every step; status colours only carry status, never the type of a step
 *  - Keyboard: arrows move focus to the nearest step in that direction; Space picks a step up, arrows move it,
 *    Enter drops, Esc puts it back (the TwoUX drag-and-drop pattern). Shift+F10 opens the step menu
 *  - Connections can be selected (click, or Tab and Enter): delete them, insert a step in them, or drag either end
 *    to another step. Every drag has a menu path in the step's ⋮ (WCAG 2.5.7)
 *  - FlowStepList shows the same flow as a nested list beside the canvas, with the same menu
 *  - Vertical or horizontal: `direction` turns the handles, and layoutFlow tidies the steps into layers
 *  - Moves, connections and deletions are announced in words in a polite live region (WCAG 4.1.3)
 *  - Selecting a step calls onSelect; the app opens its settings in SidePanel (record-detail pattern)
 *  - Deleting applies at once and the app offers Undo; the canvas never asks for confirmation
 *  - Locking stops moving and connecting, but steps can still be opened
 */
import {
  Background,
  BackgroundVariant,
  EdgeLabelRenderer,
  Handle,
  MarkerType,
  MiniMap,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  getSmoothStepPath,
  useNodesInitialized,
  useReactFlow,
  useUpdateNodeInternals,
  type Connection,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeChange,
  type NodeProps,
} from "@xyflow/react"
import { AlertTriangle, CornerDownRight, Lock, LockOpen, Maximize, MoreVertical, Plus, Trash2, Users, ZoomIn, ZoomOut } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/cn"
import { Badge } from "./badge"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "./empty"
import { Kbd } from "./kbd"
import { ShimmerText } from "./motion"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

/* ---------------------------------------------------------------- model */

export type FlowStepKind = "trigger" | "action" | "condition" | "review" | "end"
export type FlowRunState = "waiting" | "running" | "done" | "skipped" | "failed"
export type FlowBranch = "yes" | "no"
export type FlowDirection = "vertical" | "horizontal"

export type FlowStep = {
  id: string
  kind: FlowStepKind
  /** What happens, verb first: "Screen CV", "Offer interview times" */
  title: string
  /** The step type the title came from, shown small above it: "Send email", "Application received" */
  type?: string
  /** One or two lines: what it reads, who it reaches, what it decides */
  summary?: string
  icon?: React.ReactNode
  position: { x: number; y: number }
  /** Why the step can't run yet: "choose an email template". Shown as "Needs set-up: …" */
  issue?: string
  /** Reaches people outside the workspace, such as emailing a candidate: "Emails the candidate" */
  reaches?: string
  /** State in the current or last run, with a note: "12 candidates", or the reason it failed */
  run?: { state: FlowRunState; note?: string }
}

export type FlowLink = { id: string; from: string; to: string; branch?: FlowBranch; /** e.g. "12 candidates" after a run */ label?: string }
export type FlowValue = { steps: FlowStep[]; links: FlowLink[] }
/** What changed, in words, for a toast with Undo: "Screen CV deleted" */
export type FlowChange = { type: "move" | "connect" | "disconnect" | "delete"; text: string }

export const FLOW_KIND_WORD: Record<FlowStepKind, string> = { trigger: "Trigger", action: "Action", condition: "Condition", review: "Review by a person", end: "End" }
const RUN_WORD: Record<FlowRunState, string> = { waiting: "Waiting", running: "Running", done: "Done", skipped: "Skipped", failed: "Failed" }
const BRANCH_WORD: Record<FlowBranch, string> = { yes: "Yes", no: "No" }
const STEP_W = 256
const GAP_Y = 168

/** The small word above the title: the step type, or its kind when the title already says the type. */
const typeWord = (s: FlowStep) => (s.type && s.type !== s.title && !s.title.startsWith(s.type) ? s.type : FLOW_KIND_WORD[s.kind])
const hasInput = (s: FlowStep) => s.kind !== "trigger"
const hasOutput = (s: FlowStep) => s.kind !== "end"
const linkId = (from: string, to: string, branch?: FlowBranch) => `${from}-${branch ?? "out"}-${to}`

/** Steps in flow order: triggers first, then breadth-first along the links (Yes before No); unreached steps last. */
export function flowOrder(value: FlowValue): FlowStep[] {
  const byId = new Map(value.steps.map((s) => [s.id, s]))
  const seen = new Set<string>()
  const queue = value.steps.filter((s) => s.kind === "trigger").map((s) => s.id)
  const out: FlowStep[] = []
  while (queue.length) {
    const id = queue.shift()!
    if (seen.has(id) || !byId.has(id)) continue
    seen.add(id)
    out.push(byId.get(id)!)
    const next = value.links.filter((l) => l.from === id).sort((a, b) => (a.branch === "no" ? 1 : 0) - (b.branch === "no" ? 1 : 0))
    queue.push(...next.map((l) => l.to))
  }
  return [...out, ...value.steps.filter((s) => !seen.has(s.id))]
}

/** A free position for a new step after `fromId` (beside it for a condition's No branch). */
export function placeAfter(value: FlowValue, fromId?: string, branch?: FlowBranch, direction: FlowDirection = "vertical"): { x: number; y: number } {
  const from = value.steps.find((s) => s.id === fromId)
  const across = branch === "no" ? 1 : 0
  const base = !from
    ? { x: 0, y: 0 }
    : direction === "vertical"
      ? { x: from.position.x + across * (STEP_W + 48), y: from.position.y + GAP_Y }
      : { x: from.position.x + STEP_W + 96, y: from.position.y + across * 200 }
  const taken = (p: { x: number; y: number }) => value.steps.some((s) => Math.abs(s.position.x - p.x) < STEP_W && Math.abs(s.position.y - p.y) < GAP_Y - 24)
  const p = { ...base }
  while (taken(p)) direction === "vertical" ? (p.x += STEP_W + 48) : (p.y += 200)
  return p
}

/**
 * Tidy the steps into layers along the flow: each step one layer after its furthest parent, placed across the layer
 * near its parents (Yes before No), never overlapping. Vertical runs top to bottom, horizontal left to right.
 */
export function layoutFlow<V extends FlowValue>(value: V, direction: FlowDirection = "vertical"): V {
  const MAIN = direction === "vertical" ? 200 : STEP_W + 112
  const CROSS = direction === "vertical" ? STEP_W + 64 : 200
  const order = flowOrder(value)
  const rank = new Map(order.map((s, i) => [s.id, i]))
  const depth = new Map<string, number>()
  for (let pass = 0; pass < order.length; pass++) {
    let changed = false
    for (const s of order) {
      const parents = value.links.filter((l) => l.to === s.id && rank.get(l.from)! < rank.get(s.id)!)
      const d = parents.length ? Math.max(...parents.map((l) => (depth.get(l.from) ?? 0) + 1)) : 0
      if (depth.get(s.id) !== d) { depth.set(s.id, d); changed = true }
    }
    if (!changed) break
  }
  const layers: FlowStep[][] = []
  for (const s of order) (layers[depth.get(s.id) ?? 0] ??= []).push(s)
  const cross = new Map<string, number>()
  layers.forEach((layer, d) => {
    if (!layer) return
    const want = layer.map((s) => {
      const ins = value.links.filter((l) => l.to === s.id && cross.has(l.from))
      if (!ins.length) return 0
      return ins.reduce((sum, l) => sum + cross.get(l.from)! + (l.branch === "yes" ? -CROSS / 2 : l.branch === "no" ? CROSS / 2 : 0), 0) / ins.length
    })
    const items = layer.map((s, i) => ({ s, want: d === 0 ? (i - (layer.length - 1) / 2) * CROSS : want[i] })).sort((a, b) => a.want - b.want)
    const at = items.map((it) => it.want)
    for (let i = 1; i < at.length; i++) at[i] = Math.max(at[i], at[i - 1] + CROSS)
    const shift = items.reduce((sum, it, i) => sum + it.want - at[i], 0) / items.length
    items.forEach((it, i) => cross.set(it.s.id, Math.round(at[i] + shift)))
  })
  return {
    ...value,
    steps: value.steps.map((s) => {
      const c = cross.get(s.id) ?? 0
      const m = (depth.get(s.id) ?? 0) * MAIN
      return { ...s, position: direction === "vertical" ? { x: c, y: m } : { x: m, y: c } }
    }),
  }
}

/** The step's full accessible name: title, type, set-up and run state, and how many connections leave it. */
function describe(step: FlowStep, value: FlowValue) {
  const outs = value.links.filter((l) => l.from === step.id).length
  return [
    step.title,
    FLOW_KIND_WORD[step.kind].toLowerCase(),
    step.issue ? `needs set-up: ${step.issue}` : null,
    step.run ? `${RUN_WORD[step.run.state].toLowerCase()}${step.run.note ? `, ${step.run.note}` : ""}` : null,
    hasOutput(step) ? `${outs} ${outs === 1 ? "connection" : "connections"} out` : null,
  ].filter(Boolean).join(", ")
}

/* ---------------------------------------------------------------- actions shared by the canvas and the step list */

type Actions = {
  value: FlowValue
  locked: boolean
  open: (id: string) => void
  addAfter?: (id: string, branch?: FlowBranch) => void
  insert?: (link: FlowLink) => void
  connect: (from: string, to: string, branch?: FlowBranch) => void
  disconnect: (link: FlowLink) => void
  remove: (id: string) => void
}

function useActions({ value, onValueChange, onSelect, onAddAfter, onInsert, locked, announce }: {
  value: FlowValue
  onValueChange: (next: FlowValue, change?: FlowChange) => void
  onSelect: (id: string | null) => void
  onAddAfter?: (id: string, branch?: FlowBranch) => void
  onInsert?: (link: FlowLink) => void
  locked: boolean
  announce: (text: string) => void
}): Actions {
  const title = (id: string) => value.steps.find((s) => s.id === id)?.title ?? "step"
  const emit = (next: FlowValue, change: FlowChange) => { onValueChange(next, change); announce(change.text) }
  return {
    value,
    locked,
    open: onSelect,
    addAfter: onAddAfter,
    insert: onInsert,
    connect: (from, to, branch) => {
      if (from === to || value.links.some((l) => l.from === from && l.to === to && l.branch === branch)) return
      const target = value.steps.find((s) => s.id === to)
      if (!target || !hasInput(target)) return
      const text = `Connected ${title(from)}${branch ? ` (${BRANCH_WORD[branch]})` : ""} to ${title(to)}`
      emit({ ...value, links: [...value.links, { id: linkId(from, to, branch), from, to, branch }] }, { type: "connect", text })
    },
    disconnect: (link) => {
      emit({ ...value, links: value.links.filter((l) => l.id !== link.id) }, { type: "disconnect", text: `Disconnected ${title(link.from)} from ${title(link.to)}` })
    },
    remove: (id) => {
      onSelect(null)
      emit({ steps: value.steps.filter((s) => s.id !== id), links: value.links.filter((l) => l.from !== id && l.to !== id) }, { type: "delete", text: `${title(id)} deleted` })
    },
  }
}

/** The step's ⋮ menu: the non-drag path for everything the canvas does by dragging. No icons: words carry every item. */
function StepMenuItems({ step, actions }: { step: FlowStep; actions: Actions }) {
  const { value, locked } = actions
  const targets = value.steps.filter((s) => s.id !== step.id && hasInput(s))
  const outs = value.links.filter((l) => l.from === step.id)
  const branches: (FlowBranch | undefined)[] = step.kind === "condition" ? ["yes", "no"] : [undefined]
  const name = (id: string) => value.steps.find((s) => s.id === id)?.title ?? id
  return (
    <>
      <DropdownMenuItem onSelect={() => actions.open(step.id)}>Open settings<DropdownMenuShortcut>Enter</DropdownMenuShortcut></DropdownMenuItem>
      {hasOutput(step) && actions.addAfter && !locked && branches.map((b) => (
        <DropdownMenuItem key={b ?? "out"} onSelect={() => actions.addAfter!(step.id, b)}>Add step after{b ? ` ${BRANCH_WORD[b]}` : ""}</DropdownMenuItem>
      ))}
      {hasOutput(step) && !locked && targets.length > 0 && branches.map((b) => (
        <DropdownMenuSub key={`c-${b ?? "out"}`}>
          <DropdownMenuSubTrigger>{b ? `Connect ${BRANCH_WORD[b]} to` : "Connect to"}</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="max-h-72 overflow-y-auto">
            {targets.map((t) => {
              const linked = outs.some((l) => l.to === t.id && l.branch === b)
              return <DropdownMenuItem key={t.id} disabled={linked} onSelect={() => actions.connect(step.id, t.id, b)}>{t.title}{linked && <span className="ml-auto text-sm text-ink-3">Connected</span>}</DropdownMenuItem>
            })}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      ))}
      {!locked && outs.length > 0 && (
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Disconnect</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {outs.map((l) => <DropdownMenuItem key={l.id} onSelect={() => actions.disconnect(l)}>{l.branch ? `${BRANCH_WORD[l.branch]}: ` : ""}{name(l.to)}</DropdownMenuItem>)}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      )}
      {!locked && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => actions.remove(step.id)}>Delete step<DropdownMenuShortcut>Delete</DropdownMenuShortcut></DropdownMenuItem>
        </>
      )}
    </>
  )
}

/* ---------------------------------------------------------------- step parts */

/** Run state as a word: Running shimmers (off under reduced motion), the rest are badges. */
export function FlowRunBadge({ run }: { run: NonNullable<FlowStep["run"]> }) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      {run.state === "running" ? (
        <ShimmerText className="text-sm font-medium">Running</ShimmerText>
      ) : (
        <Badge variant={run.state === "done" ? "success" : run.state === "failed" ? "destructive" : "secondary"}>{RUN_WORD[run.state]}</Badge>
      )}
      {run.note && <span className={cn("min-w-0 truncate text-sm", run.state === "failed" ? "text-bad" : "text-ink-2")}>{run.note}</span>}
    </span>
  )
}

function StepStatus({ step }: { step: FlowStep }) {
  if (step.run) return <FlowRunBadge run={step.run} />
  if (step.issue)
    return (
      <span className="flex min-w-0 items-start gap-1.5 text-sm text-warn">
        <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <span className="min-w-0">Needs set-up: {step.issue}</span>
      </span>
    )
  if (step.reaches)
    return (
      <span className="flex min-w-0 items-center gap-1.5 text-sm text-ink-3">
        <Users className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="min-w-0 truncate">{step.reaches}</span>
      </span>
    )
  return null
}

type Ctx = Actions & { menuFor: string | null; setMenuFor: (id: string | null) => void; movingId: string | null; direction: FlowDirection; edgeSel: string | null; setEdgeSel: (id: string | null) => void }
const ActionsCtx = React.createContext<Ctx | null>(null)

const HANDLE = "size-2.5! min-w-0! rounded-full! border! border-control! bg-surface! before:absolute before:-inset-2 before:content-[''] data-[locked=true]:pointer-events-none"

function StepNode({ data, selected }: NodeProps<Node<{ step: FlowStep }>>) {
  const { step } = data
  const ctx = React.useContext(ActionsCtx)!
  const failed = step.run?.state === "failed"
  const vertical = ctx.direction === "vertical"
  const moving = ctx.movingId === step.id
  return (
    <div
      data-slot="flow-step"
      data-moving={moving || undefined}
      className={cn(
        "relative grid w-64 gap-2 rounded-sm border bg-surface p-3 text-left shadow-card transition-[background-color,border-color,box-shadow] duration-(--duration-fast)",
        selected ? "border-line-strong bg-selected" : "border-line",
        step.run?.state === "running" && "border-primary",
        failed && "border-bad-line",
        step.run?.state === "skipped" && "opacity-70",
        moving && "border-primary shadow-pop",
      )}
    >
      {hasInput(step) && <Handle type="target" position={vertical ? Position.Top : Position.Left} className={HANDLE} data-locked={ctx.locked} aria-label={`Input of ${step.title}`} />}
      <div className="flex items-start gap-2">
        <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-xs border border-line bg-surface-2 text-ink-2 [&>svg]:size-4">{step.icon}</span>
        <span className="grid min-w-0 flex-1">
          <span className="truncate text-sm text-ink-3">{typeWord(step)}</span>
          <span className="truncate text-base font-medium text-ink">{step.title}</span>
        </span>
        <DropdownMenu open={ctx.menuFor === step.id} onOpenChange={(o) => ctx.setMenuFor(o ? step.id : null)}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs" tabIndex={-1} className="nodrag -mr-1 -mt-0.5" aria-label={`Actions for ${step.title}`}><MoreVertical /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <StepMenuItems step={step} actions={ctx} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {step.summary && <p className="line-clamp-2 text-sm text-ink-2">{step.summary}</p>}
      <StepStatus step={step} />
      {step.kind === "condition" ? (
        <>
          {vertical ? (
            <span className="flex justify-between px-6 text-sm font-medium text-ink-2" aria-hidden="true"><span>Yes</span><span>No</span></span>
          ) : (
            <>
              <span aria-hidden="true" className="absolute top-1/3 left-full ml-2 -translate-y-full text-sm font-medium text-ink-2">Yes</span>
              <span aria-hidden="true" className="absolute top-2/3 left-full ml-2 -translate-y-full text-sm font-medium text-ink-2">No</span>
            </>
          )}
          <Handle type="source" id="yes" position={vertical ? Position.Bottom : Position.Right} className={cn(HANDLE, vertical ? "left-1/4!" : "top-1/3!")} data-locked={ctx.locked} aria-label={`Yes output of ${step.title}`} />
          <Handle type="source" id="no" position={vertical ? Position.Bottom : Position.Right} className={cn(HANDLE, vertical ? "left-3/4!" : "top-2/3!")} data-locked={ctx.locked} aria-label={`No output of ${step.title}`} />
        </>
      ) : (
        hasOutput(step) && <Handle type="source" position={vertical ? Position.Bottom : Position.Right} className={HANDLE} data-locked={ctx.locked} aria-label={`Output of ${step.title}`} />
      )}
    </div>
  )
}

function LinkEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, data, selected }: EdgeProps<Edge<{ text?: string; active?: boolean; link: FlowLink; name: string }>>) {
  const ctx = React.useContext(ActionsCtx)!
  const [path, labelX, labelY] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius: 8 })
  const showTools = selected && !ctx.locked && data
  return (
    <>
      <path id={id} d={path} markerEnd={markerEnd} className={cn("react-flow__edge-path fill-none", selected ? "stroke-primary stroke-2" : data?.active ? "stroke-primary stroke-[1.5px]" : "stroke-control stroke-[1.5px]")} />
      <path d={path} className="react-flow__edge-interaction cursor-pointer fill-none stroke-transparent stroke-[20px]" />
      {(data?.text || showTools) && (
        <EdgeLabelRenderer>
          <span
            className={cn("nodrag nopan absolute top-0 left-0 flex translate-x-[calc(var(--lx)-50%)] translate-y-[calc(var(--ly)-50%)] items-center", showTools ? "pointer-events-auto z-10 gap-0.5 rounded-md border border-line bg-popover p-0.5 shadow-pop" : "pointer-events-none")}
            style={{ "--lx": `${labelX}px`, "--ly": `${labelY}px` } as React.CSSProperties}
          >
            {data?.text && <span className={cn("text-sm text-ink-2", showTools ? "px-1.5" : "rounded-xs border border-line bg-surface px-1.5")}>{data.text}</span>}
            {showTools && (
              <>
                {ctx.insert && (
                  <Tooltip>
                    <TooltipTrigger asChild><Button variant="ghost" size="icon-xs" aria-label={`Insert a step between ${data.name}`} onClick={() => ctx.insert!(data.link)}><Plus /></Button></TooltipTrigger>
                    <TooltipContent>Insert step</TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger asChild><Button variant="ghost" size="icon-xs" aria-label={`Delete the connection ${data.name}`} onClick={() => { ctx.setEdgeSel(null); ctx.disconnect(data.link) }}><Trash2 /></Button></TooltipTrigger>
                  <TooltipContent className="flex items-center gap-2">Delete connection<Kbd>Delete</Kbd></TooltipContent>
                </Tooltip>
              </>
            )}
          </span>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

const NODE_TYPES = { step: StepNode }
const EDGE_TYPES = { link: LinkEdge }

/* ---------------------------------------------------------------- canvas */

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)
const ARROW: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }
const DIR_WORD: Record<string, string> = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" }

function ToolButton({ label, keys, onClick, pressed, children }: { label: string; keys?: string; onClick: () => void; pressed?: boolean; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={label} aria-pressed={pressed} aria-keyshortcuts={keys} onClick={onClick}>{children}</Button>
      </TooltipTrigger>
      <TooltipContent className="flex items-center gap-2">{label}{keys && <Kbd>{keys.replace("Meta", "⌘").replace("Control", "Ctrl").replace(/\+/g, " ")}</Kbd>}</TooltipContent>
    </Tooltip>
  )
}

export type FlowCanvasProps = {
  value: FlowValue
  /** Every change, including each position while dragging. `change` is set once the move, connection or deletion is done: use it for a toast with Undo. */
  onValueChange: (next: FlowValue, change?: FlowChange) => void
  selectedId?: string | null
  /** A step was selected (open its settings in SidePanel), or the canvas was clicked (null). */
  onSelect: (id: string | null) => void
  /** Add step after, from a step's menu or the step list. The app opens its step picker and places the step with placeAfter. */
  onAddAfter?: (id: string, branch?: FlowBranch) => void
  /** Insert step, from a selected connection. The app opens its step picker and puts the new step between link.from and link.to. */
  onInsert?: (link: FlowLink) => void
  /** Shown in the empty state as Add trigger. */
  onAddTrigger?: () => void
  /** Which way the flow runs: handles sit top and bottom (vertical) or left and right (horizontal). Use layoutFlow to rearrange. */
  direction?: FlowDirection
  locked?: boolean
  onLockedChange?: (locked: boolean) => void
  "aria-label": string
  className?: string
}

function CanvasInner({ value, onValueChange, selectedId = null, onSelect, onAddAfter, onInsert, onAddTrigger, direction = "vertical", locked = false, onLockedChange, className, "aria-label": label }: FlowCanvasProps) {
  const flow = useReactFlow()
  const [message, setMessage] = React.useState("")
  const [menuFor, setMenuFor] = React.useState<string | null>(null)
  const [edgeSel, setEdgeSel] = React.useState<string | null>(null)
  const [moving, setMoving] = React.useState<{ id: string; from: { x: number; y: number } } | null>(null)
  const announce = React.useCallback((text: string) => setMessage(text), [])
  const actions = useActions({ value, onValueChange, onSelect, onAddAfter, onInsert, locked, announce })
  const valueRef = React.useRef(value)
  valueRef.current = value
  const dragStart = React.useRef<FlowValue | null>(null)
  const descId = React.useId()
  // Controlled nodes must carry the sizes React Flow measures, or the minimap and framing have nothing to work with.
  const [dims, setDims] = React.useState<Record<string, { width: number; height: number }>>({})
  const [ready, setReady] = React.useState(false)
  const box = React.useRef<HTMLDivElement>(null)

  const nodes = React.useMemo<Node<{ step: FlowStep }>[]>(
    () =>
      flowOrder(value).map((s) => ({
        id: s.id,
        type: "step",
        position: s.position,
        data: { step: s },
        selected: s.id === selectedId,
        ariaLabel: describe(s, value),
        deletable: false,
        // Locked: a drag on a step does nothing (without nopan it would pan the canvas, so the step still seems to move).
        className: locked ? "nopan cursor-default" : undefined,
        measured: dims[s.id],
        domAttributes: { "aria-describedby": descId },
      })),
    [value, selectedId, dims, descId, locked],
  )
  const edges = React.useMemo<Edge<{ text?: string; active?: boolean; link: FlowLink; name: string }>[]>(
    () =>
      value.links.map((l) => {
        const to = value.steps.find((s) => s.id === l.to)
        const from = value.steps.find((s) => s.id === l.from)
        const text = [l.branch && BRANCH_WORD[l.branch], l.label].filter(Boolean).join(" · ") || undefined
        const active = !!to?.run && to.run.state !== "waiting" && to.run.state !== "skipped"
        const name = `${from?.title ?? l.from}${l.branch ? ` (${BRANCH_WORD[l.branch]})` : ""} and ${to?.title ?? l.to}`
        return {
          id: l.id,
          type: "link",
          source: l.from,
          target: l.to,
          sourceHandle: l.branch ?? null,
          deletable: false,
          selected: l.id === edgeSel,
          ariaLabel: `Connection from ${from?.title ?? l.from}${l.branch ? `, ${BRANCH_WORD[l.branch]},` : ""} to ${to?.title ?? l.to}${l.label ? `, ${l.label}` : ""}`,
          markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: l.id === edgeSel || active ? "var(--color-primary)" : "var(--color-control)" },
          data: { text, active, link: l, name },
        }
      }),
    [value, edgeSel],
  )

  const onNodesChange = (changes: NodeChange<Node<{ step: FlowStep }>>[]) => {
    let next = valueRef.current
    for (const c of changes) {
      if (c.type === "position" && c.position) {
        const p = c.position
        next = { ...next, steps: next.steps.map((s) => (s.id === c.id ? { ...s, position: { x: Math.round(p.x), y: Math.round(p.y) } } : s)) }
      } else if (c.type === "dimensions" && c.dimensions) {
        const d = c.dimensions
        setDims((m) => (m[c.id]?.width === d.width && m[c.id]?.height === d.height ? m : { ...m, [c.id]: d }))
      } else if (c.type === "select" && c.selected) {
        setEdgeSel(null)
        onSelect(c.id)
      }
    }
    if (next !== valueRef.current) onValueChange(next)
  }

  const fit = () => flow.fitView({ padding: 0.1, duration: reduced() ? 0 : 200 })
  const zoom = (dir: 1 | -1) => (dir > 0 ? flow.zoomIn({ duration: reduced() ? 0 : 120 }) : flow.zoomOut({ duration: reduced() ? 0 : 120 }))
  const mod = isMac() ? "Meta" : "Control"

  // First view: the whole flow when it fits at a readable size (75% or more); otherwise its start, readable.
  // Runs again when the direction changes, because the steps have moved.
  const framedFor = React.useRef<string | null>(null)
  React.useEffect(() => {
    if (!ready || !box.current || framedFor.current === direction || value.steps.some((s) => !dims[s.id])) return
    framedFor.current = direction
    const b = flow.getNodesBounds(flow.getNodes())
    const { clientWidth: w, clientHeight: h } = box.current
    const whole = Math.min(w / (b.width + 96), h / (b.height + 96))
    const z = Math.min(1, Math.max(0.75, whole))
    const fits = whole >= 0.75
    const x = direction === "vertical" || fits ? w / 2 - (b.x + b.width / 2) * z : 32 - b.x * z
    const y = direction === "horizontal" || fits ? (h - b.height * z) / 2 - b.y * z : 32 - b.y * z
    flow.setViewport({ x, y, zoom: z }, { duration: framedFor.current && !reduced() ? 200 : 0 })
  }, [ready, dims, flow, value.steps, direction])

  // Handles move to other sides when the direction changes; React Flow must measure them again or links keep the old sides.
  const updateInternals = useUpdateNodeInternals()
  React.useEffect(() => {
    updateInternals(valueRef.current.steps.map((s) => s.id))
  }, [direction, updateInternals])

  // A step chosen elsewhere (the step list, a problem link) is brought into view.
  React.useEffect(() => {
    if (!selectedId || !box.current) return
    const n = flow.getInternalNode(selectedId)
    if (!n?.measured.width) return
    const { x, y, zoom: z } = flow.getViewport()
    const p = n.internals.positionAbsolute
    const left = p.x * z + x, top = p.y * z + y, right = left + n.measured.width * z, bottom = top + (n.measured.height ?? 0) * z
    const { clientWidth: w, clientHeight: h } = box.current
    if (left < 0 || top < 0 || right > w || bottom > h) flow.setCenter(p.x + n.measured.width / 2, p.y + (n.measured.height ?? 0) / 2, { zoom: z, duration: reduced() ? 0 : 200 })
  }, [selectedId, flow])

  const focusStep = (id: string) => box.current?.querySelector<HTMLElement>(`.react-flow__node[data-id="${CSS.escape(id)}"]`)?.focus()

  /** The nearest step in the arrow's direction, judged by what people see: distance along it, with sideways drift costing double. */
  const nearest = (fromId: string, key: string) => {
    const [dx, dy] = ARROW[key]
    // Along the arrow, distance between the steps' leading edges (so a shorter card isn't "nearer"); sideways, between centres.
    const centre = (s: FlowStep) => ({ x: s.position.x + (dx ? 0 : (dims[s.id]?.width ?? STEP_W) / 2), y: s.position.y + (dy ? 0 : (dims[s.id]?.height ?? 100) / 2) })
    const from = value.steps.find((s) => s.id === fromId)
    if (!from) return undefined
    const c = centre(from)
    let best: { id: string; score: number } | undefined
    for (const s of flowOrder(value)) {
      if (s.id === fromId) continue
      const p = centre(s)
      const along = (p.x - c.x) * dx + (p.y - c.y) * dy
      if (along <= 8) continue
      const side = Math.abs((p.x - c.x) * dy) + Math.abs((p.y - c.y) * dx)
      const score = along + 2 * side
      if (!best || score < best.score) best = { id: s.id, score }
    }
    return best?.id
  }

  const finishMove = (cancel: boolean) => {
    if (!moving) return
    const s = valueRef.current.steps.find((x) => x.id === moving.id)
    if (cancel) {
      onValueChange({ ...valueRef.current, steps: valueRef.current.steps.map((x) => (x.id === moving.id ? { ...x, position: moving.from } : x)) })
      announce(`Move cancelled. ${s?.title ?? "Step"} is back where it was.`)
    } else if (s) {
      onValueChange(valueRef.current, { type: "move", text: `${s.title} moved` })
      announce(`${s.title} dropped`)
    }
    setMoving(null)
  }

  // Capture phase, so these keys win over React Flow's own (which would move a selected step with the arrows).
  const onKeyDownCapture = (e: React.KeyboardEvent) => {
    const t = e.target as HTMLElement
    if (t.closest("input, textarea, select, [contenteditable=true], [role=menu], [role=menuitem]")) return
    const nodeEl = t.closest<HTMLElement>(".react-flow__node")
    const edgeEl = t.closest<SVGElement>(".react-flow__edge")
    const id = nodeEl?.dataset.id
    const stop = () => { e.preventDefault(); e.stopPropagation() }

    if (moving && id === moving.id) {
      if (e.key in ARROW) {
        stop()
        const [dx, dy] = ARROW[e.key]
        const step = e.shiftKey ? 40 : 8
        onValueChange({ ...valueRef.current, steps: valueRef.current.steps.map((s) => (s.id === id ? { ...s, position: { x: s.position.x + dx * step, y: s.position.y + dy * step } } : s)) })
        announce(`Moved ${DIR_WORD[e.key]}`)
      } else if (e.key === "Enter" || e.key === " ") { stop(); finishMove(false) }
      else if (e.key === "Escape") { stop(); finishMove(true) }
      else if (e.key === "Tab") finishMove(false)
      return
    }
    if ((e.metaKey || e.ctrlKey) && (e.key === "=" || e.key === "+")) { stop(); zoom(1) }
    else if ((e.metaKey || e.ctrlKey) && e.key === "-") { stop(); zoom(-1) }
    else if (e.shiftKey && (e.key === "!" || e.code === "Digit1")) { stop(); fit() }
    else if (id && e.shiftKey && e.key === "F10") { stop(); setMenuFor(id) }
    else if (id && e.key === "Enter") { stop(); setEdgeSel(null); onSelect(id) }
    else if (id && e.key === " " && !locked) {
      stop()
      const s = value.steps.find((x) => x.id === id)
      if (!s) return
      setMoving({ id, from: s.position })
      announce(`Picked up ${s.title}. Use the arrow keys to move it, Enter to drop, Escape to cancel.`)
    } else if (id && e.key in ARROW && !e.altKey && !e.metaKey && !e.ctrlKey) {
      stop()
      const to = nearest(id, e.key)
      if (to) focusStep(to)
    } else if (id && (e.key === "Home" || e.key === "End")) {
      stop()
      const order = flowOrder(value)
      const ends = order.filter((s) => s.kind === "end")
      const to = e.key === "Home" ? order[0] : (ends.at(-1) ?? order[order.length - 1])
      if (to) focusStep(to.id)
    } else if (edgeEl && e.key === "Enter") { stop(); setEdgeSel(edgeEl.dataset.id ?? null) }
    else if (!locked && (e.key === "Delete" || e.key === "Backspace")) {
      const link = value.links.find((l) => l.id === (edgeEl?.dataset.id ?? edgeSel))
      if (link) { stop(); setEdgeSel(null); actions.disconnect(link) }
      else if (id || selectedId) { stop(); actions.remove(id ?? selectedId!) }
    } else if (e.key === "Escape" && edgeSel) { stop(); setEdgeSel(null) }
  }

  return (
    <ActionsCtx.Provider value={{ ...actions, menuFor, setMenuFor, movingId: moving?.id ?? null, direction, edgeSel, setEdgeSel }}>
      <div ref={box} data-slot="flow-canvas" className={cn("relative h-full min-h-0 w-full bg-bg", className)} onKeyDownCapture={onKeyDownCapture}>
        <ReactFlow
          aria-label={label}
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          onNodesChange={onNodesChange}
          onInit={() => setReady(true)}
          onNodeDragStart={() => { dragStart.current = valueRef.current }}
          onNodeDragStop={(_, n) => {
            const s = valueRef.current.steps.find((x) => x.id === n.id)
            if (s && dragStart.current) onValueChange(valueRef.current, { type: "move", text: `${s.title} moved` })
            dragStart.current = null
          }}
          onEdgeClick={(_, edge) => { setEdgeSel(edge.id); if (selectedId) onSelect(null) }}
          onConnect={(c: Connection) => c.source && c.target && actions.connect(c.source, c.target, (c.sourceHandle as FlowBranch | null) ?? undefined)}
          onReconnect={(old, c) => {
            const v = valueRef.current
            const link = v.links.find((l) => l.id === old.id)
            if (!link || !c.source || !c.target || c.source === c.target) return
            const branch = (c.sourceHandle as FlowBranch | null) ?? undefined
            const title = (sid: string) => v.steps.find((s) => s.id === sid)?.title ?? "step"
            const text = `Connection now runs from ${title(c.source)}${branch ? ` (${BRANCH_WORD[branch]})` : ""} to ${title(c.target)}`
            onValueChange({ ...v, links: v.links.map((l) => (l.id === old.id ? { id: linkId(c.source, c.target, branch), from: c.source, to: c.target, branch } : l)) }, { type: "connect", text })
            announce(text)
            setEdgeSel(null)
          }}
          isValidConnection={(c) => c.source !== c.target && !!value.steps.find((s) => s.id === c.target && hasInput(s))}
          onPaneClick={() => { setEdgeSel(null); onSelect(null) }}
          nodesDraggable={!locked}
          nodesConnectable={!locked}
          edgesReconnectable={!locked}
          reconnectRadius={16}
          disableKeyboardA11y
          deleteKeyCode={null}
          selectionKeyCode={null}
          multiSelectionKeyCode={null}
          panActivationKeyCode={null}
          snapToGrid
          snapGrid={[8, 8]}
          minZoom={0.25}
          maxZoom={1.5}
          proOptions={{ hideAttribution: false }}
          attributionPosition="bottom-left"
          ariaLabelConfig={{ "edge.a11yDescription.default": "Press Enter to select, then Delete to remove it.", "minimap.ariaLabel": "Overview of the flow", "handle.ariaLabel": "Connection point" }}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="var(--color-line-strong)" />
          <MiniMap pannable zoomable ariaLabel="Overview of the flow" className="rounded-sm border border-line max-md:hidden" nodeBorderRadius={4} />
          <Panel position="bottom-center">
            <div role="toolbar" aria-label="Canvas" className="flex items-center gap-0.5 rounded-md border border-line bg-popover p-1 shadow-pop">
              <ToolButton label="Fit view" keys="Shift+1" onClick={fit}><Maximize /></ToolButton>
              <ToolButton label="Zoom out" keys={`${mod}+-`} onClick={() => zoom(-1)}><ZoomOut /></ToolButton>
              <ToolButton label="Zoom in" keys={`${mod}+=`} onClick={() => zoom(1)}><ZoomIn /></ToolButton>
              {onLockedChange && (
                <>
                  <span className="mx-0.5 h-4 w-px bg-line" aria-hidden="true" />
                  <ToolButton label={locked ? "Unlock canvas" : "Lock canvas"} pressed={locked} onClick={() => { onLockedChange(!locked); announce(locked ? "Canvas unlocked" : "Canvas locked. Steps can be opened but not moved, connected or deleted.") }}>
                    {locked ? <Lock /> : <LockOpen />}
                  </ToolButton>
                  {locked && <span aria-hidden="true" className="pr-2 pl-0.5 text-sm text-ink-2">Locked</span>}
                </>
              )}
            </div>
          </Panel>
        </ReactFlow>
        {value.steps.length === 0 && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center p-4">
            <Empty className="pointer-events-auto max-w-sm rounded-sm border border-line bg-surface shadow-card">
              <EmptyHeader>
                <EmptyTitle level={2}>No steps yet</EmptyTitle>
                <EmptyDescription>Add a trigger to say what starts this workflow, such as a new application.</EmptyDescription>
              </EmptyHeader>
              {onAddTrigger && <EmptyContent><Button size="sm" onClick={onAddTrigger}><Plus />Add trigger</Button></EmptyContent>}
            </Empty>
          </div>
        )}
        <p id={descId} className="sr-only">
          {locked
            ? "Arrow keys go to the next step in that direction. Enter opens settings, Shift F10 opens actions."
            : "Arrow keys go to the next step in that direction. Enter opens settings, Space picks the step up to move it, Shift F10 opens actions, Delete deletes."}
        </p>
        <p role="status" aria-live="polite" className="sr-only">{message}</p>
      </div>
    </ActionsCtx.Provider>
  )
}

/** The flow as connected steps on a canvas people pan and zoom. Fills its parent: give it a height. */
export function FlowCanvas(props: FlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  )
}

/* ---------------------------------------------------------------- step list */

export type FlowStepListProps = Omit<FlowCanvasProps, "onLockedChange" | "aria-label" | "direction" | "onInsert"> & { "aria-label": string }

/**
 * The same flow as a nested list, shown beside the canvas: steps in flow order, a condition's steps under If yes and
 * If no, a step reached twice written as "Continues to …". Choosing a row selects that step on the canvas too. Every row
 * has the step menu, so adding, connecting and deleting never need the canvas.
 */
export function FlowStepList({ value, onValueChange, selectedId = null, onSelect, onAddAfter, onAddTrigger, locked = false, className, "aria-label": label }: FlowStepListProps) {
  const [message, setMessage] = React.useState("")
  const actions = useActions({ value, onValueChange, onSelect, onAddAfter, locked, announce: setMessage })
  const byId = new Map(value.steps.map((s) => [s.id, s]))
  const placed = new Set<string>()

  const row = (s: FlowStep) => (
    <div className={cn("flex items-start gap-1 rounded-xs py-1 pr-1 pl-2", s.id === selectedId ? "bg-selected" : "hover:bg-hover")}>
      <button type="button" onClick={() => onSelect(s.id)} aria-current={s.id === selectedId || undefined} className="flex min-w-0 flex-1 items-start gap-2 rounded-xs py-0.5 text-left outline-none focus-visible:ring-3 focus-visible:ring-primary/20">
        <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center text-ink-3 [&>svg]:size-3.5">{s.icon}</span>
        <span className="grid min-w-0 flex-1">
          <span className="truncate text-base text-ink">{s.title}</span>
          {(s.run || s.issue) && <StepStatus step={s} />}
        </span>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-xs" aria-label={`Actions for ${s.title}`}><MoreVertical /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56"><StepMenuItems step={s} actions={actions} /></DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  const branch = (s: FlowStep, b: FlowBranch | undefined): React.ReactNode =>
    value.links.filter((l) => l.from === s.id && l.branch === b).map((l) => {
      const t = byId.get(l.to)
      if (!t) return null
      if (placed.has(t.id))
        return (
          <li key={l.id} className="flex items-center gap-1.5 py-1 pl-2 text-sm text-ink-2">
            <CornerDownRight className="size-3.5 text-ink-3" aria-hidden="true" />Continues to <button type="button" className="rounded-xs font-medium text-primary-ink hover:underline" onClick={() => onSelect(t.id)}>{t.title}</button>
          </li>
        )
      return <React.Fragment key={l.id}>{item(t)}</React.Fragment>
    })

  const item = (s: FlowStep): React.ReactNode => {
    placed.add(s.id)
    return (
      <li key={s.id} className="grid">
        {row(s)}
        {s.kind === "condition" ? (
          (["yes", "no"] as const).map((b) => (
            <div key={b} className="ml-4 grid border-l border-line pl-2">
              <p className="pt-1 pl-2 text-sm font-medium text-ink-2">If {BRANCH_WORD[b].toLowerCase()}</p>
              <ul className="grid">{value.links.some((l) => l.from === s.id && l.branch === b) ? branch(s, b) : <li className="py-1 pl-2 text-sm text-ink-3">No step yet</li>}</ul>
            </div>
          ))
        ) : (
          <ul className="grid">{branch(s, undefined)}</ul>
        )}
      </li>
    )
  }

  const tree = value.steps.filter((s) => s.kind === "trigger").map((r) => item(r))
  const loose = value.steps.filter((s) => !placed.has(s.id))

  return (
    <div data-slot="flow-step-list" className={cn("grid content-start gap-4", className)}>
      {value.steps.length === 0 ? (
        <Empty className="rounded-sm border border-line">
          <EmptyHeader><EmptyTitle level={2}>No steps yet</EmptyTitle><EmptyDescription>Add a trigger to say what starts this workflow, such as a new application.</EmptyDescription></EmptyHeader>
          {onAddTrigger && <EmptyContent><Button size="sm" onClick={onAddTrigger}><Plus />Add trigger</Button></EmptyContent>}
        </Empty>
      ) : (
        <ul aria-label={label} className="grid">{tree}</ul>
      )}
      {loose.length > 0 && (
        <section aria-label="Not connected" className="grid gap-1">
          <h3 className="pl-2 text-sm font-medium text-ink-2">Not connected · {loose.length}</h3>
          <ul className="grid">{loose.map((s) => <li key={s.id}>{row(s)}</li>)}</ul>
        </section>
      )}
      <p role="status" aria-live="polite" className="sr-only">{message}</p>
    </div>
  )
}
