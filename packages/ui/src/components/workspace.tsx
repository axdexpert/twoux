/**
 * TwoUX compositions for a data workspace: a sheet of records whose columns are typed, calculated by a formula,
 * written by the assistant or looked up from another service, each run per row at a stated cost.
 *
 * SheetGrid: a spreadsheet keyboard after Excel and Google Sheets (one tab stop; arrows, Shift+arrows and drag select a
 *   range; copy and paste tab-separated values to and from Excel or Sheets, validated per column; Delete clears; fill
 *   down and right; undo and redo; every action announced in the status line), size="dense" for 28px rows,
 *   optional group rows with totals, filter row, row selection, row menu and Open button, plus typed columns with a type icon, a menu per column, row numbers, a status row for computed columns,
 *   computed cell states, Add row and Add 10 rows, Wrap text per column, pinned first columns.
 * ColumnsMenu: search, show or hide all, eye toggles, reorder by drag, by keyboard (pick up, arrows, drop, Esc) or by
 *   Move up and Move down buttons. Optional Wrap long text and Rows per page for list tables. Applies at once.
 * RunStatusBar: "Table up to date", or progress with the cost so far and Stop; run history; Auto-run with its cost per row.
 */
import {
  Activity,
  ArrowDown,
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  EllipsisVertical,
  Eye,
  EyeOff,
  FoldHorizontal,
  GripVertical,
  Hash,
  History,
  ListFilter,
  Loader2,
  Lock,
  type LucideIcon,
  MoveHorizontal,
  PanelRight,
  Pencil,
  Pin,
  PinOff,
  Plug,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  Sigma,
  Square,
  SquareChevronDown,
  ToggleRight,
  Trash2,
  Type,
  UnfoldHorizontal,
  WrapText,
  Columns3,
} from "lucide-react"
import * as React from "react"
import { toast } from "sonner"
import { cn } from "../lib/cn"
import { useWorkspace } from "../lib/workspace"
import { AiMark } from "./ai-basics"
import { AiCell, type AiCellState } from "./ai-work"
import { Badge } from "./badge"
import { Button } from "./button"
import { Checkbox } from "./checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { Input } from "./input"
import { ShimmerText } from "./motion"
import { ProviderLogo } from "./onboarding"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import type { ProviderId } from "./provider-logos.data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import type { ShortcutGroup } from "./shortcut-sheet"
import { Switch } from "./switch"

/* ---------------------------------------------------------------- types */

export type ColumnType = "text" | "number" | "date" | "select" | "boolean" | "formula" | "ai" | "enrichment"

export const COLUMN_TYPES: Record<ColumnType, { label: string; icon: LucideIcon | null; computed: boolean }> = {
  text: { label: "Text", icon: Type, computed: false },
  number: { label: "Number", icon: Hash, computed: false },
  date: { label: "Date", icon: Calendar, computed: false },
  select: { label: "Select", icon: SquareChevronDown, computed: false },
  boolean: { label: "Yes or no", icon: ToggleRight, computed: false },
  formula: { label: "Formula", icon: Sigma, computed: true },
  ai: { label: "AI", icon: null, computed: true },
  enrichment: { label: "Enrichment", icon: Plug, computed: true },
}

/** Progress of a computed column, shown in the status row under its header. */
export type ColumnRunStatus = { done: number; total: number; errors?: number; running?: boolean; stale?: boolean }

export type SheetColumn = {
  id: string
  label: string
  type: ColumnType
  /** px */
  width: number
  pinned?: boolean
  hidden?: boolean
  wrap?: boolean
  /** Always shown, can't be hidden or deleted: the column that names the record. */
  locked?: boolean
  /** Choices for a select column. */
  options?: string[]
  /** Shown in the column menu of a formula column, e.g. "=Seniority & Company". */
  formula?: string
  /** The service an enrichment column looks values up in. Its logo replaces the type icon. */
  provider?: ProviderId
  /** Credits per row, stated before every run and retry. */
  costPerRow?: number
  /** Return a message to block the save or the paste. */
  validate?: (value: string) => string | undefined
  status?: ColumnRunStatus
  /** Number columns: an ISO currency code (GBP) formats values as money; pasted £, $ and € are understood. */
  currency?: string
  /** Show a total in the footer, and in each group row when rows are grouped. */
  total?: "sum" | "average"
  /** Yes or no columns: the word beside the switch, e.g. "Subscribed" and "Not subscribed". */
  onLabel?: string
  offLabel?: string
  /** Rows where the column doesn't apply show "n/a" (read as "not applicable") and can't be edited or pasted into. */
  notApplicable?: (row: SheetRow) => boolean
  /** Custom display for a typed column, such as an avatar beside an owner's name. Editing still uses the column's type. */
  render?: (value: SheetValue, row: SheetRow) => React.ReactNode
}

export type ComputedCellState = AiCellState | { state: "not-found" }
export type SheetValue = string | number | boolean | null | undefined
export type SheetRow = { id: string; values: Record<string, SheetValue>; computed?: Record<string, ComputedCellState> }
export type SheetSort = { columnId: string; direction: "asc" | "desc" } | null

const isComputed = (c: SheetColumn) => COLUMN_TYPES[c.type].computed
const fmtNum = (n: number) => n.toLocaleString("en-GB", { maximumFractionDigits: 2 })
export const formatCredits = (n: number) => `${n.toLocaleString("en-GB", { maximumFractionDigits: 1 })} ${n === 1 ? "credit" : "credits"}`
const fmtDate = (v: string) => {
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(d)
}

/** The type icon of a column: the provider's logo for enrichment, the origin mark for AI, otherwise a muted icon. */
export function ColumnTypeIcon({ type, provider, className }: { type: ColumnType; provider?: ProviderId; className?: string }) {
  if (type === "enrichment" && provider) return <ProviderLogo provider={provider} size="sm" className={cn("size-4 p-px", className)} />
  if (type === "ai") return <AiMark className={cn("size-3.5", className)} />
  const Icon = COLUMN_TYPES[type].icon ?? Type
  return <Icon aria-hidden="true" className={cn("size-3.5 shrink-0 text-ink-3", className)} />
}

const SORT_WORDS: Record<string, [string, string]> = { number: ["Sort smallest first", "Sort largest first"], date: ["Sort oldest first", "Sort newest first"] }

function statusText(s: ColumnRunStatus) {
  const pct = s.total ? Math.floor((s.done / s.total) * 100) : 100
  const errs = s.errors ? `${s.errors} ${s.errors === 1 ? "error" : "errors"}` : ""
  if (s.running) return { tone: "running" as const, text: `${pct}%`, errs }
  if (s.stale) return { tone: "stale" as const, text: "Out of date", errs }
  if (s.errors) return { tone: "error" as const, text: errs, errs: "" }
  if (s.done < s.total) return { tone: "partial" as const, text: `${pct}% run`, errs }
  return { tone: "ok" as const, text: "Up to date", errs }
}

function ColumnStatus({ status }: { status: ColumnRunStatus }) {
  const s = statusText(status)
  return (
    <span className="inline-flex min-w-0 items-center gap-control text-sm whitespace-nowrap">
      {s.tone === "running" && <Loader2 className="size-3 shrink-0 animate-spin text-ink-3" aria-hidden="true" />}
      {s.tone === "ok" && <Check className="size-3 shrink-0 text-ok" aria-hidden="true" />}
      {s.tone === "error" && <CircleAlert className="size-3 shrink-0 text-bad" aria-hidden="true" />}
      {s.tone === "stale" && <RefreshCw className="size-3 shrink-0 text-warn" aria-hidden="true" />}
      <span className={cn("tabular", s.tone === "error" ? "text-bad" : s.tone === "ok" ? "text-ink-2" : "text-ink-2")}>{s.text}</span>
      {s.errs && <span className="tabular text-bad">· {s.errs}</span>}
    </span>
  )
}

function ComputedCell({ col, cell, wrap }: { col: SheetColumn; cell?: ComputedCellState; wrap?: boolean }) {
  if (!cell) return <span className="text-ink-3"><span aria-hidden="true">–</span><span className="sr-only">Empty</span></span>
  if (cell.state === "not-found") return <span className="text-sm text-ink-3">Not found</span>
  if (col.type === "ai" && cell.state !== "done") return <AiCell cell={cell} />
  if (cell.state === "queued") return <span className="text-sm text-ink-3">Waiting</span>
  if (cell.state === "writing")
    return <span role="status" className="inline-flex items-center gap-control text-sm text-ink-3"><Loader2 className="size-3 animate-spin" aria-hidden="true" />{col.type === "formula" ? "Calculating" : "Looking up"}</span>
  if (cell.state === "failed")
    return (
      <span className="inline-flex min-w-0 items-center gap-control text-sm text-bad">
        <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
        <span className={wrap ? "whitespace-normal" : "truncate"}>{cell.reason}</span>
      </span>
    )
  return <span className={cn("block", wrap ? "whitespace-normal break-words" : "truncate")}>{cell.value}</span>
}

/* ---------------------------------------------------------------- spreadsheet helpers */

type Cell = { r: number; c: number }
type Rect = { r1: number; c1: number; r2: number; c2: number }
type CellChange = { rowId: string; columnId: string; before: SheetValue; after: SheetValue }
type Batch = { label: string; changes: CellChange[] }
type Reject = { key: string; where: string; reason: string }
/** One cell written by a paste, fill, clear, undo or edit. */
export type SheetCellChange = { rowId: string; columnId: string; value: SheetValue }

const rectOf = (a: Cell, b: Cell): Rect => ({ r1: Math.min(a.r, b.r), c1: Math.min(a.c, b.c), r2: Math.max(a.r, b.r), c2: Math.max(a.c, b.c) })
const isBlank = (v: SheetValue) => v === null || v === undefined || v === ""
const detectMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent)
const plural = (n: number, one: string, many = `${one}s`) => `${n.toLocaleString("en-GB")} ${n === 1 ? one : many}`
const TRUE_WORDS = ["true", "yes", "y", "1", "on", "x", "✓"]
const FALSE_WORDS = ["false", "no", "n", "0", "off"]

/** Tab-separated values, quoted the way Excel and Google Sheets quote them, so a copied range pastes into either. */
export function toTsv(cells: string[][]) {
  return cells.map((row) => row.map((s) => (/[\t\n\r"]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s)).join("\t")).join("\n")
}

/** Reads what Excel or Google Sheets put on the clipboard: tabs between cells, newlines between rows, quotes around a cell that holds either. */
export function parseTsv(text: string): string[][] {
  const t = text.replace(/\r\n?/g, "\n").replace(/\n$/, "")
  const out: string[][] = []
  let row: string[] = []
  let cell = ""
  let quoted = false
  for (let i = 0; i < t.length; i++) {
    const ch = t[i]
    if (quoted) {
      if (ch === '"' && t[i + 1] === '"') { cell += '"'; i++ }
      else if (ch === '"') quoted = false
      else cell += ch
    } else if (ch === '"' && cell === "") quoted = true
    else if (ch === "\t") { row.push(cell); cell = "" }
    else if (ch === "\n") { row.push(cell); out.push(row); row = []; cell = "" }
    else cell += ch
  }
  row.push(cell)
  out.push(row)
  return out
}

const pad = (n: number) => String(n).padStart(2, "0")
/** 2025-03-14, 14/03/2025 (day first, as in the UK) or 14 Mar 2025, as an ISO date (2025-03-14), or null when it is not a real date. */
export function toIsoDate(v: string): string | null {
  const uk = v.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/)
  const iso = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  let y: number, m: number, d: number
  if (uk) [d, m, y] = [+uk[1], +uk[2], +uk[3]]
  else if (iso) [y, m, d] = [+iso[1], +iso[2], +iso[3]]
  else {
    if (!/[a-z]/i.test(v)) return null
    const t = new Date(v)
    if (Number.isNaN(t.getTime())) return null
    ;[y, m, d] = [t.getFullYear(), t.getMonth() + 1, t.getDate()]
  }
  const t = new Date(Date.UTC(y, m - 1, d))
  if (t.getUTCMonth() !== m - 1 || t.getUTCDate() !== d) return null
  return `${y}-${pad(m)}-${pad(d)}`
}

const computedHow = (col: SheetColumn) => (col.type === "formula" ? "calculated by a formula" : col.type === "ai" ? "written by the assistant" : "looked up")

/** Turns typed or pasted text into the column's value, or says why it doesn't fit. */
function coerce(col: SheetColumn, raw: string, row: SheetRow): { value: SheetValue } | { reason: string } {
  if (isComputed(col)) return { reason: `${col.label} is ${computedHow(col)}, so it can't be typed or pasted into.` }
  if (col.notApplicable?.(row)) return { reason: `${col.label} doesn't apply to this row.` }
  const v = raw.trim()
  if (col.type === "boolean") {
    const w = v.toLowerCase()
    if (TRUE_WORDS.includes(w) || (col.onLabel && w === col.onLabel.toLowerCase())) return { value: true }
    if (w === "" || FALSE_WORDS.includes(w) || (col.offLabel && w === col.offLabel.toLowerCase())) return { value: false }
    return { reason: `Enter yes or no${col.onLabel ? `, or ${col.onLabel}` : ""}.` }
  }
  const custom = col.validate?.(v)
  if (custom) return { reason: custom }
  if (v === "") return { value: "" }
  if (col.type === "number") {
    const n = Number(v.replace(/[,\s£$€]/g, "").replace(/^\((.*)\)$/, "-$1"))
    return Number.isNaN(n) ? { reason: "Enter a number, such as 1200." } : { value: n }
  }
  if (col.type === "date") {
    const d = toIsoDate(v)
    return d ? { value: d } : { reason: "Enter a date, such as 2025-03-14 or 14/03/2025." }
  }
  if (col.type === "select") {
    const o = (col.options ?? []).find((x) => x.toLowerCase() === v.toLowerCase())
    return o ? { value: o } : { reason: `Choose one of ${(col.options ?? []).join(", ")}.` }
  }
  return { value: raw.replace(/\r/g, "") }
}

const valueOf = (col: SheetColumn, row: SheetRow): SheetValue => {
  if (isComputed(col)) { const c = row.computed?.[col.id]; return c?.state === "done" ? c.value : null }
  return row.values[col.id]
}
/** What a cell puts on the clipboard: the raw value, so numbers stay numbers in Excel and Google Sheets. */
const copyText = (col: SheetColumn, row: SheetRow) => {
  if (col.notApplicable?.(row)) return "n/a"
  const v = valueOf(col, row)
  if (col.type === "boolean") return v ? "TRUE" : "FALSE"
  return isBlank(v) ? "" : String(v)
}
const fmtFor = (col: SheetColumn | undefined, n: number) =>
  col?.currency ? n.toLocaleString("en-GB", { style: "currency", currency: col.currency, maximumFractionDigits: Number.isInteger(n) ? 0 : 2 }) : fmtNum(n)
const numbersOf = (col: SheetColumn, rows: SheetRow[]) =>
  rows.map((r) => valueOf(col, r)).filter((v) => (typeof v === "number" ? true : typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v)))).map(Number)
const aggregate = (col: SheetColumn, rows: SheetRow[]) => {
  const nums = numbersOf(col, rows)
  if (!nums.length) return null
  const sum = nums.reduce((a, b) => a + b, 0)
  return col.total === "average" ? sum / nums.length : sum
}

type Line = { kind: "row"; row: SheetRow; n: number } | { kind: "group"; key: string; label: string; rows: SheetRow[]; open: boolean }

/** The SheetGrid keys, for the ShortcutSheet. ⌘ on a Mac, Ctrl elsewhere. */
export function sheetGridShortcuts(mac = detectMac()): ShortcutGroup[] {
  const M = mac ? "⌘" : "Ctrl"
  return [
    {
      title: "Sheet: move and select",
      items: [
        { keys: ["←", "→", "↑", "↓"], action: "Move one cell" },
        { keys: [M, "Arrow"], action: "Jump to the edge of the data" },
        { keys: ["Home", "End"], action: "First or last cell in the row" },
        { keys: [M, "Home", "End"], action: "First or last cell in the sheet" },
        { keys: ["Page Up", "Page Down"], action: "Move 10 rows" },
        { keys: ["⇧", "Arrow"], action: "Extend the selection" },
        { keys: [M, "⇧", "Arrow"], action: "Extend the selection to the edge of the data" },
        { keys: [M, "A"], action: "Select all cells" },
        { keys: ["Ctrl", "Space"], action: "Select the column" },
        { keys: ["⇧", "Space"], action: "Select or deselect the rows" },
        { keys: ["⇧", "F10"], action: "Open the row's actions" },
        { keys: [mac ? "⌥" : "Alt", "⇧", "← →"], action: "On a header: make the column narrower or wider" },
        { keys: ["Esc"], action: "Clear the selection" },
      ],
    },
    {
      title: "Sheet: edit",
      items: [
        { keys: ["Enter", "F2"], action: "Edit the cell; start typing to replace it" },
        { keys: ["Enter"], action: "Save and move down (⇧ Enter: up)" },
        { keys: ["Tab"], action: "Save and move right (⇧ Tab: left)" },
        { keys: [M, "Enter"], action: "Save the value into every selected cell" },
        { keys: ["Esc"], action: "Cancel the edit" },
        { keys: ["Delete"], action: "Clear the selected cells" },
        { keys: [M, "C"], action: "Copy, to paste here, in Excel or in Google Sheets" },
        { keys: [M, "X"], action: "Copy and clear" },
        { keys: [M, "V"], action: "Paste from here, Excel or Google Sheets" },
        { keys: [M, "D"], action: "Fill down" },
        { keys: [M, "R"], action: "Fill right" },
        { keys: [M, "Z"], action: "Undo" },
        { keys: mac ? [M, "⇧", "Z"] : ["Ctrl", "Y"], action: "Redo" },
        { keys: ["Space"], action: "Turn a yes or no cell on or off" },
        { keys: [M, ";"], action: "Put today's date in a date cell" },
        { keys: [M, "/"], action: "Show these shortcuts" },
      ],
    },
  ]
}

type SheetRowApi = {
  mouseDown: (e: React.MouseEvent, r: number, c: number, isEditing: boolean) => void
  click: (e: React.MouseEvent) => void
  mouseEnter: (e: React.MouseEvent, r: number, c: number) => void
  doubleClick: () => void
  contextMenu: (e: React.MouseEvent, r: number, c: number, row: SheetRow) => void
  renderValue: (col: SheetColumn, row: SheetRow) => React.ReactNode
  editor: (col: SheetColumn, row: SheetRow) => React.ReactNode
  rowMenu: (row: SheetRow) => React.ReactNode
  toggleRow: (row: SheetRow) => void
  rowName: (row: SheetRow) => string
  openRow: (id: string) => void
}

const SheetBodyRow = React.memo(function SheetBodyRow({
  api, row, n, r, rowIndex, visible, lefts, cellCls, dense, activeC, editing, error, selC1, selC2, rejected, checked, selectable, selecting, slot, hasRowMenu, menuOpen, openColId,
}: {
  api: SheetRowApi
  row: SheetRow
  n: number
  r: number
  rowIndex: number
  visible: SheetColumn[]
  lefts: number[]
  cellCls: string
  dense: boolean
  /** The active cell's column in this row, or -1. */
  activeC: number
  editing: string | null
  error: string
  /** The selected range's columns in this row when more than one cell is selected, or -1. */
  selC1: number
  selC2: number
  rejected: Record<string, string>
  checked: boolean
  selectable: boolean
  /** Some row is checked: every row shows its checkbox instead of its number. */
  selecting: boolean
  /** Width of the number or checkbox, px. */
  slot: number
  hasRowMenu: boolean
  /** Re-renders the row when its menu opens or closes. */
  menuOpen: boolean
  openColId?: string
}) {
  const name = api.rowName(row)
  return (
    <tr aria-rowindex={rowIndex} aria-selected={selectable ? checked : undefined} className="group/row">
      <th scope="row" className={cn("sticky left-0 z-10 border-r border-b border-line px-1 text-sm font-normal", dense ? "h-7" : "h-9", activeC >= 0 ? "bg-primary-soft font-medium text-primary-ink" : checked ? "bg-primary-soft text-ink-3" : "bg-surface-2 text-ink-3 group-hover/row:bg-hover")}>
        {/* The number and the checkbox share one slot: the checkbox shows on hover, on focus and while any row is checked. */}
        <span className="flex items-center">
          <span style={{ "--s": `${slot}px` } as React.CSSProperties} className="group/slot relative grid h-5 w-(--s) shrink-0 place-items-center">
            <span className={cn("tabular w-full text-right", selectable && (checked || selecting ? "invisible" : "group-hover/row:invisible pointer-coarse:invisible"))}>{n}</span>
            {selectable && (
              <span className={cn("absolute inset-0 grid place-items-center", !(checked || selecting) && "opacity-0 group-hover/row:opacity-100 focus-within:opacity-100 pointer-coarse:opacity-100")}>
                <Checkbox tabIndex={-1} aria-label={`Select ${name}`} checked={checked} onCheckedChange={() => api.toggleRow(row)} />
              </span>
            )}
          </span>
          {hasRowMenu && <span className={cn("flex", !menuOpen && "opacity-0 group-hover/row:opacity-100 focus-within:opacity-100 pointer-coarse:opacity-100")}>{api.rowMenu(row)}</span>}
        </span>
      </th>
      {visible.map((c, ci) => {
        const here = activeC === ci
        const isEditing = here && editing !== null
        const failed = row.computed?.[c.id]?.state === "failed"
        const selected = selC1 >= 0 && ci >= selC1 && ci <= selC2
        const why = rejected[`${row.id}:${c.id}`]
        const openHere = openColId === c.id && !isEditing
        const pinned = c.pinned
        return (
          <td
            key={c.id}
            role="gridcell"
            data-cell={`${r}:${ci}`}
            tabIndex={here && !isEditing ? 0 : -1}
            aria-selected={selected || here}
            aria-readonly={isComputed(c) || !!c.notApplicable?.(row) || undefined}
            aria-invalid={failed || !!why || undefined}
            title={why ? `Not pasted: ${why}` : undefined}
            onMouseDown={(e) => api.mouseDown(e, r, ci, isEditing)}
            onClick={(e) => api.click(e)}
            onMouseEnter={(e) => api.mouseEnter(e, r, ci)}
            onDoubleClick={() => api.doubleClick()}
            onContextMenu={(e) => api.contextMenu(e, r, ci, row)}
            style={pinned ? ({ "--l": `${lefts[ci]}px` } as React.CSSProperties) : undefined}
            className={cn(
              "group/cell scroll-mt-(--hh) scroll-mb-(--fh) scroll-ml-(--pl) border-b border-line",
              cellCls,
              c.wrap ? "py-2 align-top" : "whitespace-nowrap",
              !isEditing && "select-none",
              // The row being worked on is tinted; under the pointer, the row takes --color-hover and the cell --color-selected.
              // The active cell stays on the surface with a 2px primary outline, so it reads at a glance.
              selected ? "bg-primary-soft" : here ? "bg-surface" : activeC >= 0 ? "bg-active-row" : "bg-surface group-hover/row:bg-hover",
              pinned && cn("sticky left-(--l) z-1", !visible[ci + 1]?.pinned && "border-r"),
              c.type === "number" && "tabular text-right",
              !isEditing && !selected && !here && "hover:bg-selected hover:shadow-[inset_0_0_0_1px_var(--color-line-strong)]",
              why && !here && "outline-1 -outline-offset-1 outline-dashed outline-bad",
              here ? "outline-2 -outline-offset-2 outline-solid" : "outline-none",
              here && (isEditing && error ? "outline-bad" : "outline-primary")
            )}
          >
            {isEditing ? api.editor(c, row) : openHere ? (
              <span className="flex min-w-0 items-center gap-control">
                <span className="min-w-0 flex-1">{api.renderValue(c, row)}</span>
                <Button
                  variant="outline"
                  size="xs"
                  tabIndex={-1}
                  aria-label={`Open ${name}`}
                  onMouseDown={(e) => e.stopPropagation()}
                  onDoubleClick={(e) => e.stopPropagation()}
                  onClick={() => api.openRow(row.id)}
                  className="h-5 opacity-0 transition-opacity duration-(--duration-fast) group-hover/row:opacity-100 group-focus-within/row:opacity-100 pointer-coarse:opacity-100"
                >
                  Open
                </Button>
              </span>
            ) : api.renderValue(c, row)}
            {why && <span className="sr-only">Not pasted: {why}</span>}
          </td>
        )
      })}
    </tr>
  )
})

/* ---------------------------------------------------------------- sheet grid */

export function SheetGrid({
  columns,
  onColumnsChange,
  rows,
  onCellChange,
  onCellsChange,
  sort = null,
  onSortChange,
  onFilterColumn,
  onInsertColumn,
  onEditColumn,
  onRetryCell,
  onRetryColumn,
  onAddRows,
  size = "default",
  groupBy,
  filterRow = false,
  selectedRowIds,
  onSelectedRowIdsChange,
  rowActions,
  onOpenRow,
  "aria-label": label,
  className,
}: {
  columns: SheetColumn[]
  /** Rename, type, wrap, freeze, hide, insert and delete all come back through here. Delete shows Undo. */
  onColumnsChange: (columns: SheetColumn[]) => void
  rows: SheetRow[]
  /** Called once per cell. Use a functional state update: a paste or fill calls it for every cell it writes. */
  onCellChange: (rowId: string, columnId: string, value: string | number | boolean) => void
  /** Optional: receive a paste, fill, clear, undo or redo as one batch instead of one onCellChange per cell. */
  onCellsChange?: (changes: SheetCellChange[]) => void
  sort?: SheetSort
  onSortChange?: (sort: SheetSort) => void
  /** Adds a filter pill for the column to the page's FilterBar. */
  onFilterColumn?: (columnId: string) => void
  /** Insert a column at this index of `columns`. Without it, a text column is inserted and renamed in place. */
  onInsertColumn?: (index: number) => void
  /** Open the set-up of a computed column (prompt, inputs, provider). */
  onEditColumn?: (columnId: string) => void
  /** Run one failed cell again. Enter on a failed cell calls it; the status line states the cost. */
  onRetryCell?: (rowId: string, columnId: string) => void
  /** Run every failed cell in the column again. */
  onRetryColumn?: (columnId: string) => void
  onAddRows?: (count: number) => void
  /** dense: 28px rows, only for spreadsheet-like data (inventories, ledgers, imports, mapping). Never a user preference. */
  size?: "default" | "dense"
  /** Group rows by this column's value, with a collapsible group row that shows the count and each total column's sum. */
  groupBy?: string
  /** A search field under each header that filters the rows by that column. */
  filterRow?: boolean
  /** Adds a checkbox to each row number. Shift+Space selects the rows of the selected cells. Pair with BulkActionBar. */
  selectedRowIds?: string[]
  onSelectedRowIdsChange?: (ids: string[]) => void
  /** Items for the row's ⋮ menu (DropdownMenuItem). Opens from the row number, a right click, or ⇧F10. */
  rowActions?: (row: SheetRow) => React.ReactNode
  /** Adds Open to the row menu and an Open button in the name cell, shown on hover and focus. */
  onOpenRow?: (rowId: string) => void
  "aria-label": string
  className?: string
}) {
  const dense = size === "dense"
  const isMac = React.useMemo(detectMac, [])
  const M = isMac ? "⌘" : "Ctrl+"
  const mod = (e: { metaKey: boolean; ctrlKey: boolean }) => (isMac ? e.metaKey : e.ctrlKey)

  const visible = React.useMemo(() => {
    const v = columns.filter((c) => !c.hidden)
    return [...v.filter((c) => c.pinned), ...v.filter((c) => !c.pinned)]
  }, [columns])

  const [filters, setFilters] = React.useState<Record<string, string>>({})
  const [collapsed, setCollapsed] = React.useState<Set<string>>(() => new Set())

  const filteredRows = React.useMemo(() => {
    const active = Object.entries(filters).filter(([, q]) => q.trim())
    if (!active.length) return rows
    return rows.filter((r) => active.every(([id, q]) => {
      const col = columns.find((c) => c.id === id)
      return !col || copyText(col, r).toLowerCase().includes(q.trim().toLowerCase())
    }))
  }, [rows, filters, columns])

  const shownRows = React.useMemo(() => {
    if (!sort) return filteredRows
    const col = columns.find((c) => c.id === sort.columnId)
    if (!col) return filteredRows
    const dir = sort.direction === "asc" ? 1 : -1
    return [...filteredRows].sort((a, b) => {
      const x = valueOf(col, a), y = valueOf(col, b)
      const ex = isBlank(x), ey = isBlank(y)
      if (ex || ey) return ex === ey ? 0 : ex ? 1 : -1
      if (col.type === "number") return (Number(x) - Number(y)) * dir
      return String(x).localeCompare(String(y), "en-GB", { numeric: true }) * dir
    })
  }, [filteredRows, sort, columns])

  const lines = React.useMemo<Line[]>(() => {
    const gcol = groupBy ? columns.find((c) => c.id === groupBy) : undefined
    if (!gcol) return shownRows.map((row, i) => ({ kind: "row" as const, row, n: i + 1 }))
    const groups = new Map<string, SheetRow[]>()
    for (const o of gcol.options ?? []) groups.set(o, [])
    for (const row of shownRows) {
      const k = copyText(gcol, row) || "(Empty)"
      if (!groups.has(k)) groups.set(k, [])
      groups.get(k)!.push(row)
    }
    // Rows are numbered in the order they show, counting collapsed groups too, so numbers don't shift on collapse.
    const out: Line[] = []
    let n = 0
    for (const [key, rs] of groups) {
      if (!rs.length) continue
      const open = !collapsed.has(key)
      out.push({ kind: "group", key, label: key, rows: rs, open })
      for (const row of rs) { n++; if (open) out.push({ kind: "row", row, n }) }
    }
    return out
  }, [shownRows, groupBy, columns, collapsed])

  const rowAt = (r: number) => { const l = lines[r]; return l?.kind === "row" ? l.row : null }
  const dataLines = (R: Rect) => {
    const out: { r: number; row: SheetRow; n: number }[] = []
    for (let r = Math.max(0, R.r1); r <= R.r2; r++) { const l = lines[r]; if (l?.kind === "row") out.push({ r, row: l.row, n: l.n }) }
    return out
  }

  const top = filterRow ? -2 : -1
  const [pos, setPos] = React.useState<Cell>({ r: 0, c: 0 })
  const [ext, setExt] = React.useState<Cell>({ r: 0, c: 0 })
  const [selAll, setSelAll] = React.useState(false)
  const [editing, setEditing] = React.useState<string | null>(null)
  const [error, setError] = React.useState("")
  const [status, setStatusText] = React.useState("")
  const [addSaid, setAddSaid] = React.useState("")
  const [tone, setTone] = React.useState<"plain" | "bad">("plain")
  const [rejected, setRejected] = React.useState<Record<string, string>>({})
  const [menuFor, setMenuFor] = React.useState<string | null>(null)
  const [rowMenu, setRowMenu] = React.useState<string | null>(null)
  const [renaming, setRenaming] = React.useState<string | null>(null)
  const renameNext = React.useRef(false)
  const grid = React.useRef<HTMLTableElement>(null)
  const dragging = React.useRef(false)
  const history = React.useRef<{ undo: Batch[]; redo: Batch[] }>({ undo: [], redo: [] })
  const clip = React.useRef<{ kind: "copy" | "cut" | "paste"; handled: boolean } | null>(null)
  const clickOpens = React.useRef(false)
  /** Row count before Add row, so the grid can move to the first new row once it arrives. */
  const adding = React.useRef<number | null>(null)

  const say = (msg: string, t: "plain" | "bad" = "plain") => { setStatusText(msg); setTone(t) }
  const setStatus = (msg: string) => say(msg)

  const selection = new Set(selectedRowIds ?? [])
  const selectable = !!onSelectedRowIdsChange
  const hasRowMenu = !!rowActions || !!onOpenRow
  const hasStatusRow = visible.some((c) => isComputed(c) && c.status)
  const hasTotals = visible.some((c) => c.total)
  const H = dense ? 28 : 36
  // The row header is one slot (the number, or the checkbox in its place) plus the ⋮ menu: about 47px for 150 rows.
  const SLOT = Math.max(16, String(Math.max(1, rows.length)).length * 7 + 2)
  const ROWHEAD = 8 + SLOT + (hasRowMenu ? 16 : 0)
  // Live width while a column edge is dragged; saved through onColumnsChange on release.
  const [drag, setDrag] = React.useState<{ id: string; w: number } | null>(null)
  const wOf = (c: SheetColumn) => (drag?.id === c.id ? drag.w : c.width)
  // Column status (the run's progress) changes every tick but never shows in body cells, so it doesn't re-render rows.
  // Frozen columns never take more than 60% of the grid's width, so a narrow screen can still scroll sideways.
  const boxRef = React.useRef<HTMLDivElement>(null)
  const [boxW, setBoxW] = React.useState(0)
  React.useEffect(() => {
    const el = boxRef.current
    if (!el || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(([e]) => setBoxW(Math.round(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const frozen = (() => {
    const ids: string[] = []
    let w = ROWHEAD
    for (const c of visible) {
      if (!c.pinned || (boxW && w + c.width > boxW * 0.6)) break
      ids.push(c.id)
      w += c.width
    }
    return ids.join("|")
  })()
  // Column status (the run's progress) changes every tick but never shows in body cells, so it doesn't re-render rows.
  const bodySig = frozen + "#" + visible.map((c) => [c.id, c.label, c.type, c.width, c.wrap, c.currency, c.onLabel, c.offLabel, c.options?.join("/"), c.validate, c.render, c.notApplicable].map(String).join("~")).join("|")
  const bodyCols = React.useMemo(() => {
    const ids = new Set(frozen.split("|"))
    return visible.map((c) => (!!c.pinned === ids.has(c.id) ? c : { ...c, pinned: ids.has(c.id) }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodySig])
  // Only a pinned column's drag moves the columns after it, so dragging an ordinary edge doesn't re-render the rows.
  const pinDrag = drag && bodyCols.find((c) => c.id === drag.id)?.pinned ? drag : null
  const lefts = React.useMemo(() => bodyCols.reduce<number[]>((acc, c, i) => {
    const p = bodyCols[i - 1]
    return [...acc, i === 0 ? ROWHEAD : acc[i - 1] + (p.pinned ? (pinDrag?.id === p.id ? pinDrag.w : p.width) : 0)]
  }, []), [bodyCols, ROWHEAD, pinDrag])
  const pinnedWidth = ROWHEAD + bodyCols.filter((c) => c.pinned).reduce((n, c) => n + wOf(c), 0)
  const tableWidth = ROWHEAD + visible.reduce((n, c) => n + wOf(c), 0)
  const headHeight = H + (filterRow ? H : 0) + (hasStatusRow ? 28 : 0)
  const nameCol = columns.find((c) => c.locked) ?? visible[0]
  const rowName = (r: SheetRow) => String(r.values[nameCol?.id ?? ""] ?? `row ${rows.indexOf(r) + 1}`)
  const cellCls = dense ? "h-7 px-2" : "h-9 px-3"

  const range: Rect | null = pos.r < 0 || !lines.length ? null : selAll ? { r1: 0, c1: 0, r2: lines.length - 1, c2: visible.length - 1 } : rectOf(pos, ext)
  const inRange = (r: number, c: number) => !!range && r >= range.r1 && r <= range.r2 && c >= range.c1 && c <= range.c2
  const rangeCells = range ? (range.r2 - range.r1 + 1) * (range.c2 - range.c1 + 1) : 0

  const cellEl = (r: number, c: number) => grid.current?.querySelector<HTMLElement>(`[data-cell="${r}:${c}"]`)
  const focusCell = React.useCallback(() => cellEl(pos.r, pos.c)?.focus(), [pos])
  // Focus follows the active cell while the person is working in the grid, including after an edit or a menu closes.
  const engaged = React.useRef(false)
  React.useEffect(() => { if (editing === null && renaming === null && menuFor === null && rowMenu === null && engaged.current) focusCell() }, [pos, editing, renaming, menuFor, rowMenu, focusCell])
  React.useEffect(() => { if (ext.r !== pos.r || ext.c !== pos.c) cellEl(ext.r, ext.c)?.scrollIntoView({ block: "nearest", inline: "nearest" }) }, [ext, pos])
  React.useEffect(() => {
    const clamp = (p: Cell) => ({ r: Math.max(top, Math.min(p.r, lines.length - 1)), c: Math.max(0, Math.min(p.c, visible.length - 1)) })
    setPos(clamp)
    setExt(clamp)
  }, [lines.length, visible.length, top])
  // After Add row: scroll to the bottom, where the rows went, and make the first new row's first cell active.
  React.useEffect(() => {
    const before = adding.current
    if (before === null || lines.length <= before) return
    adding.current = null
    engaged.current = true
    const box = boxRef.current
    if (box) box.scrollTop = box.scrollHeight
    const p = { r: before, c: 0 }
    setPos(p); setExt(p); setSelAll(false)
  }, [lines.length])
  React.useEffect(() => {
    const up = () => { dragging.current = false }
    document.addEventListener("mouseup", up)
    return () => document.removeEventListener("mouseup", up)
  }, [])

  const keyOf = (row: SheetRow, col: SheetColumn) => `${row.id}:${col.id}`
  const clampBody = (p: Cell) => ({ r: Math.max(0, Math.min(lines.length - 1, p.r)), c: Math.max(0, Math.min(visible.length - 1, p.c)) })
  const announceCell = (p: Cell) => {
    const row = rowAt(p.r), col = visible[p.c]
    const why = row && col && rejected[keyOf(row, col)]
    if (why) say(`Not pasted into ${col.label} for ${rowName(row)}: ${why}`, "bad")
  }
  /** Header and filter rows included. */
  const move = (r: number, c: number) => {
    const p = { r: Math.max(top, Math.min(lines.length - 1, r)), c: Math.max(0, Math.min(visible.length - 1, c)) }
    setPos(p); setExt(p); setSelAll(false); announceCell(p)
  }
  const go = (to: Cell) => { const p = clampBody(to); setPos(p); setExt(p); setSelAll(false); announceCell(p) }
  const describe = (R: Rect) => {
    const ls = dataLines(R)
    if (!ls.length) return "No cells selected."
    const nC = R.c2 - R.c1 + 1
    const cols = nC > 1 ? `${visible[R.c1].label} to ${visible[R.c2].label}` : visible[R.c1].label
    const rws = ls.length > 1 ? `rows ${ls[0].n} to ${ls[ls.length - 1].n}` : `row ${ls[0].n}`
    return `${plural(ls.length * nC, "cell")} selected: ${cols}, ${rws}.`
  }
  const extendTo = (to: Cell) => {
    const p = clampBody(to)
    setExt(p); setSelAll(false)
    say(describe(rectOf(pos, p)))
  }
  const edge = (from: Cell, dr: number, dc: number): Cell => {
    const inb = (r: number, c: number) => r >= 0 && r < lines.length && c >= 0 && c < visible.length
    const empty = (r: number, c: number) => { const row = rowAt(r); return !row || isBlank(valueOf(visible[c], row)) }
    let { r, c } = from
    if (!inb(r + dr, c + dc)) return from
    if (!empty(r, c) && !empty(r + dr, c + dc)) { while (inb(r + dr, c + dc) && !empty(r + dr, c + dc)) { r += dr; c += dc } }
    else { r += dr; c += dc; while (inb(r + dr, c + dc) && empty(r, c)) { r += dr; c += dc } }
    return { r, c }
  }
  const nextData = (r: number, d: 1 | -1) => { for (let i = r + d; i >= 0 && i < lines.length; i += d) if (lines[i].kind === "row") return i; return r }

  /* ----- writing cells, with undo */
  const write = (changes: SheetCellChange[]) => {
    if (!changes.length) return
    if (onCellsChange) onCellsChange(changes)
    else for (const ch of changes) onCellChange(ch.rowId, ch.columnId, (ch.value ?? "") as string | number | boolean)
  }
  const apply = (lbl: string, changes: CellChange[]) => {
    const real = changes.filter((c) => c.before !== c.after && !(isBlank(c.before) && isBlank(c.after)))
    if (!real.length) return 0
    write(real.map((c) => ({ rowId: c.rowId, columnId: c.columnId, value: c.after })))
    const h = history.current
    h.undo.push({ label: lbl, changes: real })
    if (h.undo.length > 100) h.undo.shift()
    h.redo = []
    setRejected((prev) => {
      const gone = real.filter((c) => `${c.rowId}:${c.columnId}` in prev)
      if (!gone.length) return prev
      const next = { ...prev }
      for (const c of gone) delete next[`${c.rowId}:${c.columnId}`]
      return next
    })
    return real.length
  }
  const undo = () => {
    const b = history.current.undo.pop()
    if (!b) return say("Nothing to undo.")
    write(b.changes.map((c) => ({ rowId: c.rowId, columnId: c.columnId, value: c.before })))
    history.current.redo.push(b)
    setRejected({})
    say(`Undid ${b.label}${b.changes.length > 1 ? ` of ${plural(b.changes.length, "cell")}` : ""}.`)
  }
  const redo = () => {
    const b = history.current.redo.pop()
    if (!b) return say("Nothing to redo.")
    write(b.changes.map((c) => ({ rowId: c.rowId, columnId: c.columnId, value: c.after })))
    history.current.undo.push(b)
    say(`Redid ${b.label}${b.changes.length > 1 ? ` of ${plural(b.changes.length, "cell")}` : ""}.`)
  }
  const report = (done: string, n: number, rejects: Reject[], extra = "") => {
    setRejected(Object.fromEntries(rejects.map((x) => [x.key, x.reason])))
    let msg = `${done} ${plural(n, "cell")}.`
    if (rejects.length) msg += ` ${plural(rejects.length, "cell")} left as they were. ${rejects[0].where}: ${rejects[0].reason}${rejects.length > 1 ? " Each one is outlined in red; move to it to read why." : ""}`
    msg += extra
    say(msg, rejects.length || extra ? "bad" : "plain")
  }

  const tsvOfRange = () => {
    if (!range) return ""
    return toTsv(dataLines(range).map(({ row }) => visible.slice(range.c1, range.c2 + 1).map((col) => copyText(col, row))))
  }
  const clearRange = (lbl = "clear") => {
    if (!range) return 0
    const changes: CellChange[] = []
    let kept = 0
    for (const { row } of dataLines(range)) for (const col of visible.slice(range.c1, range.c2 + 1)) {
      if (isComputed(col) || col.notApplicable?.(row)) { kept++; continue }
      changes.push({ rowId: row.id, columnId: col.id, before: valueOf(col, row), after: col.type === "boolean" ? false : "" })
    }
    const n = apply(lbl, changes)
    if (lbl === "clear") {
      const row = rowAt(pos.r), col = visible[pos.c]
      if (rangeCells === 1 && row && col) say(n ? `Cleared ${col.label} for ${rowName(row)}.` : kept ? `${col.label} is ${computedHow(col)}, so it can't be cleared.` : "Nothing to clear.")
      else say(`Cleared ${plural(n, "cell")}.${kept ? ` ${plural(kept, "calculated or not applicable cell")} kept.` : ""}`)
    }
    return n
  }
  const afterCopy = (kind: "copy" | "cut") => {
    if (!range) return
    const ls = dataLines(range), nC = range.c2 - range.c1 + 1
    if (kind === "cut") { const n = clearRange("cut"); say(`Cut ${plural(n, "cell")}. Paste them where you want them.`) }
    else say(`Copied ${plural(ls.length * nC, "cell")}. Paste here, or into Excel or Google Sheets.`)
  }
  const pasteText = (text: string) => {
    const R = range
    if (!R) return
    const data = parseTsv(text)
    const h = data.length, w = Math.max(...data.map((r) => r.length))
    const targets: { r: number; row: SheetRow; n: number }[] = []
    for (let r = R.r1; r < lines.length; r++) { const l = lines[r]; if (l.kind === "row") targets.push({ r, row: l.row, n: l.n }) }
    const selRows = dataLines(R).length, selCols = R.c2 - R.c1 + 1
    let outH = h, outW = w
    // One value into a bigger selection fills it; a block that divides the selection evenly repeats, as in Excel.
    if ((h === 1 && w === 1) || (selRows % h === 0 && selCols % w === 0)) { outH = Math.max(h, selRows); outW = Math.max(w, selCols) }
    const changes: CellChange[] = []
    const rejects: Reject[] = []
    let lost = 0
    for (let i = 0; i < outH; i++) {
      for (let j = 0; j < outW; j++) {
        const t = targets[i], c = R.c1 + j
        if (!t || c >= visible.length) { lost++; continue }
        const col = visible[c]
        const res = coerce(col, data[i % h]?.[j % w] ?? "", t.row)
        if ("reason" in res) rejects.push({ key: keyOf(t.row, col), where: `${col.label}, row ${t.n}`, reason: res.reason })
        else changes.push({ rowId: t.row.id, columnId: col.id, before: valueOf(col, t.row), after: res.value })
      }
    }
    apply("paste", changes)
    if (targets.length) {
      const last = targets[Math.min(outH, targets.length) - 1]
      setPos({ r: targets[0].r, c: R.c1 }); setExt({ r: last.r, c: Math.min(visible.length - 1, R.c1 + outW - 1) }); setSelAll(false)
    }
    report("Pasted", changes.length, rejects, lost ? ` ${plural(lost, "value")} didn't fit: the sheet ends at row ${targets[targets.length - 1]?.n ?? 0}, column ${visible[visible.length - 1]?.label}. Add rows, then paste again.` : "")
  }
  const fill = (dir: "down" | "right") => {
    const R = range
    if (!R) return
    const ls = dataLines(R)
    const changes: CellChange[] = []
    const rejects: Reject[] = []
    let kept = 0
    const put = (col: SheetColumn, row: SheetRow, n: number, text: string) => {
      if (isComputed(col)) { kept++; return }
      const res = coerce(col, text, row)
      if ("reason" in res) rejects.push({ key: keyOf(row, col), where: `${col.label}, row ${n}`, reason: res.reason })
      else changes.push({ rowId: row.id, columnId: col.id, before: valueOf(col, row), after: res.value })
    }
    if (dir === "down") {
      let src: SheetRow | null = null
      let targets = ls
      if (ls.length <= 1) { const above = nextData(R.r1, -1); src = above !== R.r1 ? rowAt(above) : null }
      else { src = ls[0].row; targets = ls.slice(1) }
      if (!src) return say("Nothing above to fill down from.")
      for (let c = R.c1; c <= R.c2; c++) for (const t of targets) put(visible[c], t.row, t.n, copyText(visible[c], src))
    } else {
      const from = R.c1 === R.c2 ? R.c1 - 1 : R.c1
      if (from < 0) return say("Nothing to the left to fill right from.")
      for (const t of ls) for (let c = R.c1 === R.c2 ? R.c1 : R.c1 + 1; c <= R.c2; c++) put(visible[c], t.row, t.n, copyText(visible[from], t.row))
    }
    apply(dir === "down" ? "fill down" : "fill right", changes)
    report(dir === "down" ? "Filled down" : "Filled right", changes.length, rejects, kept ? ` ${plural(kept, "calculated cell")} kept.` : "")
  }

  // Copy, cut and paste use the browser's own clipboard events, so they work with the keyboard and the Edit menu.
  const clipHandlers = React.useRef({ copy: (_e: ClipboardEvent, _k: "copy" | "cut") => {}, paste: (_e: ClipboardEvent) => {} })
  clipHandlers.current = {
    copy: (e, kind) => {
      if (!range || editing !== null) return
      e.preventDefault()
      e.clipboardData?.setData("text/plain", tsvOfRange())
      if (clip.current) clip.current.handled = true
      afterCopy(kind)
    },
    paste: (e) => {
      if (!range || editing !== null) return
      e.preventDefault()
      if (clip.current) clip.current.handled = true
      pasteText(e.clipboardData?.getData("text/plain") ?? "")
    },
  }
  React.useEffect(() => {
    const inGrid = () => { const a = document.activeElement; return !!a && !!grid.current?.contains(a) && !a.closest("input, textarea, select") }
    const onCopy = (e: ClipboardEvent) => { if (inGrid()) clipHandlers.current.copy(e, "copy") }
    const onCut = (e: ClipboardEvent) => { if (inGrid()) clipHandlers.current.copy(e, "cut") }
    const onPaste = (e: ClipboardEvent) => { if (inGrid()) clipHandlers.current.paste(e) }
    document.addEventListener("copy", onCopy)
    document.addEventListener("cut", onCut)
    document.addEventListener("paste", onPaste)
    return () => { document.removeEventListener("copy", onCopy); document.removeEventListener("cut", onCut); document.removeEventListener("paste", onPaste) }
  }, [])
  /** If the browser doesn't raise its own clipboard event for the shortcut, use the Clipboard API instead. */
  const clipboardFallback = (kind: "copy" | "cut" | "paste") => {
    clip.current = { kind, handled: false }
    window.setTimeout(() => {
      const c = clip.current
      clip.current = null
      if (!c || c.handled) return
      if (kind === "paste") navigator.clipboard?.readText().then(pasteText).catch(() => say(`Couldn't read the clipboard. Press ${M}V again, or allow clipboard access.`, "bad"))
      else navigator.clipboard?.writeText(tsvOfRange()).then(() => afterCopy(kind)).catch(() => say(`Couldn't ${kind} to the clipboard. Press ${M}${kind === "cut" ? "X" : "C"} again, or allow clipboard access.`, "bad"))
    }, 60)
  }

  const patch = (id: string, p: Partial<SheetColumn>) => onColumnsChange(columns.map((c) => (c.id === id ? { ...c, ...p } : c)))
  const insertAt = (index: number) => {
    if (onInsertColumn) return onInsertColumn(index)
    const id = `col-${Date.now().toString(36)}`
    const next = [...columns]
    next.splice(index, 0, { id, label: "New column", type: "text", width: 160 })
    onColumnsChange(next)
    renameNext.current = true
    setRenaming(id)
  }
  const remove = (col: SheetColumn) => {
    const before = columns
    onColumnsChange(columns.filter((c) => c.id !== col.id))
    toast(`Deleted column “${col.label}”`, { description: "Its values are kept until you leave the table.", action: { label: "Undo", onClick: () => onColumnsChange(before) } })
  }
  const togglePin = (col: SheetColumn) => {
    patch(col.id, { pinned: !col.pinned })
    setStatus(col.pinned ? `Unpinned ${col.label}.` : `Pinned ${col.label}. It stays in view when you scroll sideways.`)
  }
  const MIN_W = 60, MAX_W = 640
  const clampW = (w: number) => Math.round(Math.max(MIN_W, Math.min(MAX_W, w)))
  const setWidth = (col: SheetColumn, w: number) => { const next = clampW(w); patch(col.id, { width: next }); setStatus(`${col.label} is ${next}px wide.`) }
  /** Fit to the widest value: measured with the grid's own font, plus room for the header's icons. */
  const fitWidth = (col: SheetColumn) => {
    const ctx = document.createElement("canvas").getContext("2d")
    const el = grid.current
    if (!ctx || !el) return
    const cs = getComputedStyle(el)
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
    const pad = (dense ? 16 : 24) + (col.type === "select" ? 18 : col.type === "boolean" ? 40 : 0)
    let w = ctx.measureText(col.label).width + (dense ? 16 : 24) + 44
    for (const row of rows) w = Math.max(w, ctx.measureText(copyText(col, row)).width + pad)
    setWidth(col, Math.min(w, 480))
  }
  const startResize = (e: React.PointerEvent, col: SheetColumn) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    const x0 = e.clientX, w0 = col.width
    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)
    let w = w0
    const onMove = (ev: PointerEvent) => { w = clampW(w0 + ev.clientX - x0); setDrag({ id: col.id, w }) }
    const onUp = () => {
      target.removeEventListener("pointermove", onMove)
      target.removeEventListener("pointerup", onUp)
      target.removeEventListener("pointercancel", onUp)
      setDrag(null)
      if (w !== w0) setWidth(col, w)
    }
    target.addEventListener("pointermove", onMove)
    target.addEventListener("pointerup", onUp)
    target.addEventListener("pointercancel", onUp)
  }
  const toggleGroup = (key: string) => {
    const g = lines.find((l) => l.kind === "group" && l.key === key)
    setCollapsed((s) => { const n = new Set(s); if (n.has(key)) n.delete(key); else n.add(key); return n })
    if (g?.kind === "group") say(`${g.label} ${g.open ? `collapsed, ${plural(g.rows.length, "row")} hidden` : "expanded"}.`)
  }
  const toggleBool = (row: SheetRow, col: SheetColumn) => {
    if (col.notApplicable?.(row)) return say(`${col.label} doesn't apply to ${rowName(row)}.`)
    const next = !valueOf(col, row)
    apply("edit", [{ rowId: row.id, columnId: col.id, before: valueOf(col, row), after: next }])
    say(`${col.label} for ${rowName(row)}: ${next ? col.onLabel ?? "Yes" : col.offLabel ?? "No"}.`)
  }
  const setSelected = (ids: Set<string>) => onSelectedRowIdsChange?.([...ids])
  const toggleRows = (rs: SheetRow[]) => {
    if (!selectable || !rs.length) return
    const all = rs.every((r) => selection.has(r.id))
    const next = new Set(selection)
    for (const r of rs) if (all) next.delete(r.id); else next.add(r.id)
    setSelected(next)
    say(`${all ? "Deselected" : "Selected"} ${plural(rs.length, "row")}. ${plural(next.size, "row")} selected in all.`)
  }

  const startEdit = (initial?: string) => {
    const col = visible[pos.c], line = lines[pos.r]
    if (!col || !line) return
    if (line.kind === "group") return toggleGroup(line.key)
    const row = line.row
    if (col.notApplicable?.(row)) return say(`${col.label} doesn't apply to ${rowName(row)}.`)
    if (col.type === "boolean") return toggleBool(row, col)
    if (isComputed(col)) {
      const cell = row.computed?.[col.id]
      if (cell?.state === "failed" && onRetryCell) {
        onRetryCell(row.id, col.id)
        setStatus(`Running ${col.label} again for ${rowName(row)}${col.costPerRow ? `, about ${formatCredits(col.costPerRow)}` : ""}.`)
        return
      }
      setStatus(`${col.label} is ${computedHow(col)}, so it can't be typed in.${onEditColumn ? " Open the column menu to edit how it's made." : ""}`)
      return
    }
    setError("")
    setEditing(initial ?? String(row.values[col.id] ?? ""))
  }
  const commit = (then: "stay" | "next" | "prev" | "down" | "up", raw?: string) => {
    const col = visible[pos.c], row = rowAt(pos.r)
    if (!col || !row) { setEditing(null); return false }
    const res = coerce(col, raw ?? editing ?? "", row)
    if ("reason" in res) { setError(res.reason); say(`${col.label}: ${res.reason}`, "bad"); return false }
    apply("edit", [{ rowId: row.id, columnId: col.id, before: valueOf(col, row), after: res.value }])
    setError("")
    setStatus(`Saved ${col.label} for ${rowName(row)}.`)
    setEditing(null)
    if (then === "next") go({ r: pos.r, c: pos.c + 1 })
    else if (then === "prev") go({ r: pos.r, c: pos.c - 1 })
    else if (then === "down") go({ r: nextData(pos.r, 1), c: pos.c })
    else if (then === "up") go({ r: nextData(pos.r, -1), c: pos.c })
    return true
  }
  /** ⌘Enter: the typed value goes into every selected cell. */
  const fillSelection = () => {
    if (!range || editing === null) return
    const text = editing
    const changes: CellChange[] = []
    const rejects: Reject[] = []
    for (const t of dataLines(range)) for (const col of visible.slice(range.c1, range.c2 + 1)) {
      const res = coerce(col, text, t.row)
      if ("reason" in res) rejects.push({ key: keyOf(t.row, col), where: `${col.label}, row ${t.n}`, reason: res.reason })
      else changes.push({ rowId: t.row.id, columnId: col.id, before: valueOf(col, t.row), after: res.value })
    }
    apply("fill", changes)
    setEditing(null)
    setError("")
    report("Filled", changes.length, rejects)
  }
  const cancel = () => { setEditing(null); setError(""); setStatus("Edit cancelled.") }

  const onFilterKey = (e: React.KeyboardEvent, input: HTMLInputElement) => {
    const c = Number(input.dataset.filter)
    const col = visible[c]
    if (e.key === "ArrowDown" || e.key === "Enter") { e.preventDefault(); move(0, c) }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(top, c) }
    else if (e.key === "Escape" && input.value) { e.preventDefault(); e.stopPropagation(); setFilters((f) => ({ ...f, [col.id]: "" })); say(`Cleared the ${col.label} filter.`) }
    else if (e.key === "ArrowLeft" && input.selectionStart === 0 && input.selectionEnd === 0 && c > 0) { e.preventDefault(); move(-1, c - 1) }
    else if (e.key === "ArrowRight" && input.selectionStart === input.value.length && c < visible.length - 1) { e.preventDefault(); move(-1, c + 1) }
  }

  const onKey = (e: React.KeyboardEvent) => {
    const t = e.target as HTMLElement
    if (renaming !== null) return
    if (t.closest("[role=menu]")) return
    if (t.dataset.filter !== undefined) return onFilterKey(e, t as HTMLInputElement)
    if (editing !== null) {
      if (visible[pos.c]?.type === "select") return
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); cancel() }
      else if (e.key === "Enter") { e.preventDefault(); if (mod(e)) fillSelection(); else commit(e.shiftKey ? "up" : "down") }
      else if (e.key === "Tab") { e.preventDefault(); commit(e.shiftKey ? "prev" : "next") }
      return
    }
    const k = e.key, m = mod(e), sh = e.shiftKey
    const header = pos.r < 0
    const arrow = ({ ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] } as Record<string, [number, number]>)[k]
    if (arrow && !e.altKey) {
      e.preventDefault()
      const [dr, dc] = arrow
      if (header) return move(pos.r + dr, pos.c + dc)
      if (m) { const to = edge(sh ? ext : pos, dr, dc); return sh ? extendTo(to) : go(to) }
      if (sh) return extendTo({ r: ext.r + dr, c: ext.c + dc })
      return move(pos.r + dr, pos.c + dc)
    }
    if (k === "Home" || k === "End") {
      e.preventDefault()
      const c = k === "Home" ? 0 : visible.length - 1
      if (header) return move(pos.r, c)
      const r = m ? (k === "Home" ? 0 : lines.length - 1) : sh ? ext.r : pos.r
      return sh ? extendTo({ r, c }) : go({ r, c })
    }
    if (k === "PageDown" || k === "PageUp") {
      e.preventDefault()
      const d = k === "PageDown" ? 10 : -10
      if (header) return d > 0 ? go({ r: 0, c: pos.c }) : undefined
      return sh ? extendTo({ r: ext.r + d, c: ext.c }) : go({ r: pos.r + d, c: pos.c })
    }
    if (header) {
      if (e.altKey && sh && (k === "ArrowRight" || k === "ArrowLeft")) { e.preventDefault(); const col = visible[pos.c]; return setWidth(col, col.width + (k === "ArrowRight" ? 16 : -16)) }
      if ((k === "ArrowDown" && e.altKey) || k === "F2") { e.preventDefault(); setMenuFor(visible[pos.c].id) }
      // Enter and Space open the menu through the trigger itself.
      return
    }
    if (e.ctrlKey && !e.metaKey && !e.altKey && k.toLowerCase() === "y") { e.preventDefault(); return redo() }
    if (m && !e.altKey) {
      const low = k.toLowerCase()
      if (low === "c" || low === "x" || low === "v") return clipboardFallback(low === "c" ? "copy" : low === "x" ? "cut" : "paste")
      if (low === "a") { e.preventDefault(); setSelAll(true); return say(`Selected all ${plural(dataLines({ r1: 0, c1: 0, r2: lines.length - 1, c2: 0 }).length * visible.length, "cell")}.`) }
      if (low === "d") { e.preventDefault(); return fill("down") }
      if (low === "r") { e.preventDefault(); return fill("right") }
      if (low === "z") { e.preventDefault(); return sh ? redo() : undo() }
      // As in Google Sheets: ⌘/ lists the shortcuts, ⌘; puts today's date in a date cell.
      if (k === "/") { e.preventDefault(); document.dispatchEvent(new KeyboardEvent("keydown", { key: "?" })); return }
      if (k === ";") {
        e.preventDefault()
        const col = visible[pos.c], row = rowAt(pos.r)
        if (!col || !row || col.type !== "date" || col.notApplicable?.(row)) return say("⌘; puts today's date in a date cell.")
        const today = new Date().toISOString().slice(0, 10)
        apply("edit", [{ rowId: row.id, columnId: col.id, before: valueOf(col, row), after: today }])
        return say(`${col.label} for ${rowName(row)}: today.`)
      }
      return
    }
    if (k === "Escape" && rangeCells > 1) { e.preventDefault(); e.stopPropagation(); go(pos); return say("Selection cleared.") }
    if (k === " " && sh) { e.preventDefault(); return toggleRows(range ? dataLines(range).map((l) => l.row) : []) }
    if (k === " " && e.ctrlKey) { e.preventDefault(); setPos({ r: 0, c: pos.c }); setExt({ r: lines.length - 1, c: pos.c }); setSelAll(false); return say(`Selected the ${visible[pos.c].label} column.`) }
    if ((k === "F10" && sh) || k === "ContextMenu") { const row = rowAt(pos.r); if (row && hasRowMenu) { e.preventDefault(); setRowMenu(row.id) } return }
    const line = lines[pos.r]
    if (line?.kind === "group") {
      if (k === "Enter" || k === " " || k === "F2") { e.preventDefault(); toggleGroup(line.key) }
      return
    }
    const col = visible[pos.c], row = rowAt(pos.r)
    if (!col || !row) return
    if (col.type === "boolean" && (k === "Enter" || k === " ")) { e.preventDefault(); return toggleBool(row, col) }
    if (k === "Enter" || k === "F2") { e.preventDefault(); startEdit() }
    else if (k === "Delete" || k === "Backspace") { e.preventDefault(); clearRange() }
    else if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey && !isComputed(col) && !col.notApplicable?.(row) && col.type === "select") { e.preventDefault(); startEdit() }
    else if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey && !isComputed(col) && !col.notApplicable?.(row) && !["date", "boolean"].includes(col.type)) { e.preventDefault(); startEdit(k) }
  }

  const pinStyle = (i: number) => (bodyCols[i]?.pinned ? ({ "--l": `${lefts[i]}px` } as React.CSSProperties) : undefined)

  const headerMenu = (col: SheetColumn, i: number) => {
    const full = columns.indexOf(col)
    const [asc, desc] = SORT_WORDS[col.type] ?? ["Sort A to Z", "Sort Z to A"]
    const sorted = sort?.columnId === col.id ? sort.direction : null
    return (
      <DropdownMenuContent
        align="start"
        className="w-60"
        onCloseAutoFocus={(e) => { if (renameNext.current) e.preventDefault() }}
      >
        <DropdownMenuLabel className="flex items-center gap-control text-ink-2"><ColumnTypeIcon type={col.type} provider={col.provider} />{COLUMN_TYPES[col.type].label} column{col.costPerRow ? ` · ${formatCredits(col.costPerRow)} / row` : ""}</DropdownMenuLabel>
        {col.formula && <p className="truncate px-2 pb-2 font-mono text-sm text-ink-2">{col.formula}</p>}
        <DropdownMenuItem onSelect={() => { renameNext.current = true; setRenaming(col.id) }}><Pencil />Rename</DropdownMenuItem>
        {isComputed(col) ? (
          <>
            {onEditColumn && <DropdownMenuItem onSelect={() => onEditColumn(col.id)}><Settings2 />Edit column</DropdownMenuItem>}
            {onRetryColumn && !!col.status?.errors && <DropdownMenuItem onSelect={() => onRetryColumn(col.id)}><RefreshCw />Run {col.status.errors} failed {col.status.errors === 1 ? "cell" : "cells"} again{col.costPerRow ? ` · ≈ ${formatCredits(col.costPerRow * col.status.errors)}` : ""}</DropdownMenuItem>}
          </>
        ) : (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger><ColumnTypeIcon type={col.type} />Change type</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-44">
              <DropdownMenuRadioGroup value={col.type} onValueChange={(v) => { patch(col.id, { type: v as ColumnType }); setStatus(`${col.label} is now a ${COLUMN_TYPES[v as ColumnType].label.toLowerCase()} column. Values that don't fit are kept as text.`) }}>
                {(["text", "number", "date", "select", "boolean"] as const).map((t) => <DropdownMenuRadioItem key={t} value={t}>{COLUMN_TYPES[t].label}</DropdownMenuRadioItem>)}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}
        {onSortChange && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onSortChange({ columnId: col.id, direction: "asc" })}><ArrowUp />{asc}{sorted === "asc" && <Check className="ml-auto" />}</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onSortChange({ columnId: col.id, direction: "desc" })}><ArrowDown />{desc}{sorted === "desc" && <Check className="ml-auto" />}</DropdownMenuItem>
            {sorted && <DropdownMenuItem onSelect={() => onSortChange(null)}><ArrowUpDown />Clear sort</DropdownMenuItem>}
          </>
        )}
        {onFilterColumn && <DropdownMenuItem onSelect={() => onFilterColumn(col.id)}><ListFilter />Filter by this column</DropdownMenuItem>}
        <DropdownMenuSeparator />
        <DropdownMenuItem role="menuitemcheckbox" aria-checked={!!col.wrap} onSelect={(e) => { e.preventDefault(); patch(col.id, { wrap: !col.wrap }) }}><WrapText />Wrap text{col.wrap && <Check className="ml-auto" />}</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => togglePin(col)}>{col.pinned ? <><PinOff />Unpin column</> : <><Pin />Pin column</>}</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger><MoveHorizontal />Column width</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-52">
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setWidth(col, col.width + 40) }}><UnfoldHorizontal />Wider<DropdownMenuShortcut>{isMac ? "⌥⇧→" : "Alt+Shift+→"}</DropdownMenuShortcut></DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setWidth(col, col.width - 40) }}><FoldHorizontal />Narrower<DropdownMenuShortcut>{isMac ? "⌥⇧←" : "Alt+Shift+←"}</DropdownMenuShortcut></DropdownMenuItem>
            <DropdownMenuItem onSelect={() => fitWidth(col)}><MoveHorizontal />Fit to content</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        {!col.locked && <DropdownMenuItem onSelect={() => { patch(col.id, { hidden: true }); setStatus(`Hid ${col.label}. Show it again from Columns.`); move(pos.r, Math.min(i, visible.length - 2)) }}><EyeOff />Hide column</DropdownMenuItem>}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => insertAt(full)}><ArrowLeftToLine />Insert column left</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => insertAt(full + 1)}><ArrowRightToLine />Insert column right</DropdownMenuItem>
        {!col.locked && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => remove(col)}><Trash2 />Delete column</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    )
  }

  const renderValue = (col: SheetColumn, row: SheetRow) => {
    if (col.notApplicable?.(row)) return <span aria-label="not applicable" className="text-sm text-ink-3">n/a</span>
    if (isComputed(col)) return <ComputedCell col={col} cell={row.computed?.[col.id]} wrap={col.wrap} />
    const v = row.values[col.id]
    if (col.type === "boolean")
      return (
        <span className="inline-flex items-center gap-2">
          <Switch size="sm" tabIndex={-1} checked={!!v} aria-label={`${col.label} for ${rowName(row)}`} onCheckedChange={() => toggleBool(row, col)} />
          <span className={cn("truncate", v ? "text-ink" : "text-ink-3")}>{v ? col.onLabel ?? "Yes" : col.offLabel ?? "No"}</span>
        </span>
      )
    if (col.render) return col.render(v, row)
    // A select reads as a selector: the value and a chevron that opens the list. Click the active cell, the chevron, or press Enter.
    if (col.type === "select")
      return (
        <span className="flex min-w-0 items-center gap-1">
          <span className={cn("min-w-0 flex-1 truncate", isBlank(v) && "text-ink-3")}>{isBlank(v) ? <span className="opacity-0 group-hover/cell:opacity-100">Choose</span> : String(v)}</span>
          <span data-cell-open aria-hidden="true" className="-mr-1 grid size-4 shrink-0 cursor-pointer place-items-center rounded-xs text-ink-3 opacity-0 group-hover/row:opacity-100 group-focus/cell:opacity-100 hover:bg-selected hover:text-ink pointer-coarse:opacity-100">
            <ChevronDown className="size-3" />
          </span>
        </span>
      )
    if (isBlank(v)) return null
    const text = col.type === "number" && typeof v === "number" ? fmtFor(col, v) : col.type === "date" ? fmtDate(String(v)) : String(v)
    return <span className={cn("block", col.wrap ? "whitespace-normal break-words" : "truncate")}>{text}</span>
  }

  const editor = (col: SheetColumn, row: SheetRow) => {
    if (col.type === "select")
      return (
        <Select defaultOpen value={editing ?? ""} onValueChange={(v) => commit("stay", v)} onOpenChange={(o) => { if (!o) setEditing((cur) => { if (cur !== null) setStatus("Edit cancelled."); return null }) }}>
          {/* The cell is the trigger: its 2px outline already marks it, so the trigger draws no border, shadow or ring of its own. */}
          <SelectTrigger size="sm" aria-label={`${col.label} for ${rowName(row)}`} className="w-full gap-1 rounded-none border-0 bg-transparent p-0 shadow-none hover:border-0 focus-visible:ring-0 data-[size=sm]:h-full"><SelectValue placeholder="Choose" /></SelectTrigger>
          {/* Opens below the cell, never over it, so the row being changed stays in view. */}
          <SelectContent position="popper" align="start" sideOffset={4}>{(col.options ?? []).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
        </Select>
      )
    return (
      <input
        autoFocus
        type={col.type === "date" ? "date" : "text"}
        value={editing ?? ""}
        aria-label={`${col.label} for ${rowName(row)}`}
        aria-invalid={!!error || undefined}
        inputMode={col.type === "number" ? "decimal" : undefined}
        onChange={(e) => { setEditing(e.target.value); setError("") }}
        onBlur={() => { if (editing !== null && !commit("stay")) setEditing(null) }}
        className={cn("h-full w-full bg-transparent outline-none", col.type === "number" && "text-right")}
      />
    )
  }

  // Sum, average and count of the selected numbers, as in the status bar of Excel and Google Sheets.
  const rangeStats = (() => {
    if (!range || rangeCells < 2) return null
    const ls = dataLines(range)
    const cols = visible.slice(range.c1, range.c2 + 1)
    let count = 0
    const nums: number[] = []
    for (const { row } of ls) for (const col of cols) {
      const v = valueOf(col, row)
      if (isBlank(v) || col.notApplicable?.(row)) continue
      count++
      if (col.type === "number" && v !== null && v !== undefined && !Number.isNaN(Number(v))) nums.push(Number(v))
    }
    const numCols = cols.filter((c) => c.type === "number")
    const money = numCols.length && numCols.every((c) => c.currency && c.currency === numCols[0].currency) ? numCols[0] : undefined
    const sum = nums.reduce((a, b) => a + b, 0)
    return nums.length ? `Sum ${fmtFor(money, sum)} · Average ${fmtFor(money, Math.round((sum / nums.length) * 100) / 100)} · Count ${count}` : `Count ${count}`
  })()

  const rowMenuFor = (row: SheetRow) => (
    <DropdownMenu open={rowMenu === row.id} onOpenChange={(o) => setRowMenu(o ? row.id : null)}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-xs" tabIndex={-1} aria-label={`Actions for ${rowName(row)}`} className="relative size-5 text-ink-3 after:absolute after:-inset-0.5 hover:text-ink" onMouseDown={(e) => e.stopPropagation()}>
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52" onCloseAutoFocus={(e) => e.preventDefault()}>
        {onOpenRow && <DropdownMenuItem onSelect={() => onOpenRow(row.id)}><PanelRight />Open</DropdownMenuItem>}
        {onOpenRow && rowActions && <DropdownMenuSeparator />}
        {rowActions?.(row)}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  // Body rows are memoised: a key press re-renders only the rows whose cells change. They call back through this
  // stable object, which always holds the latest handlers.
  const rowApiRef = React.useRef<SheetRowApi>(null as unknown as SheetRowApi)
  rowApiRef.current = {
    mouseDown: (e, r, c, isEditing) => {
      clickOpens.current = false
      if (isEditing || e.button !== 0) return
      if (e.shiftKey && pos.r >= 0) { e.preventDefault(); extendTo({ r, c }); return }
      // A second click on the active select cell, or a click on its chevron, opens the list.
      clickOpens.current = visible[c]?.type === "select" && ((pos.r === r && pos.c === c && rangeCells <= 1) || !!(e.target as HTMLElement).closest("[data-cell-open]"))
      setPos({ r, c }); setExt({ r, c }); setSelAll(false); dragging.current = true
    },
    click: () => { if (clickOpens.current) { clickOpens.current = false; startEdit() } },
    mouseEnter: (e, r, c) => { if (dragging.current && e.buttons === 1 && (ext.r !== r || ext.c !== c)) extendTo({ r, c }) },
    doubleClick: () => startEdit(),
    contextMenu: (e, r, c, row) => { if (!hasRowMenu) return; e.preventDefault(); go({ r, c }); setRowMenu(row.id) },
    renderValue,
    editor,
    rowMenu: rowMenuFor,
    toggleRow: (row) => toggleRows([row]),
    rowName,
    openRow: (id) => onOpenRow?.(id),
  }
  const rowApi = React.useMemo<SheetRowApi>(() => ({
    mouseDown: (...a) => rowApiRef.current.mouseDown(...a),
    click: (...a) => rowApiRef.current.click(...a),
    mouseEnter: (...a) => rowApiRef.current.mouseEnter(...a),
    doubleClick: () => rowApiRef.current.doubleClick(),
    contextMenu: (...a) => rowApiRef.current.contextMenu(...a),
    renderValue: (...a) => rowApiRef.current.renderValue(...a),
    editor: (...a) => rowApiRef.current.editor(...a),
    rowMenu: (...a) => rowApiRef.current.rowMenu(...a),
    toggleRow: (...a) => rowApiRef.current.toggleRow(...a),
    rowName: (...a) => rowApiRef.current.rowName(...a),
    openRow: (...a) => rowApiRef.current.openRow(...a),
  }), [])

  const shownIds = filteredRows.map((r) => r.id)
  const allChecked = shownIds.length > 0 && shownIds.every((id) => selection.has(id))
  const someChecked = shownIds.some((id) => selection.has(id))
  const headerRows = 1 + (filterRow ? 1 : 0) + (hasStatusRow ? 1 : 0)
  const pinCls = (i: number, head = false) => bodyCols[i]?.pinned && cn("sticky left-(--l)", head ? "z-30" : "z-1", !bodyCols[i + 1]?.pinned && "border-r")

  // In a workspace the sheet fills its region edge to edge; elsewhere it is a framed card.
  const inWorkspace = useWorkspace()
  return (
    <div
      data-slot="sheet-grid"
      data-size={size}
      onFocus={() => { engaged.current = true }}
      onBlur={(e) => { const to = e.relatedTarget as HTMLElement | null; if (to && !e.currentTarget.contains(to) && !to.closest("[role=menu], [role=listbox]")) engaged.current = false }}
      className={cn("flex min-h-0 flex-col overflow-hidden bg-surface", !inWorkspace && "rounded-sm border border-line", className)}>
      <div
        ref={boxRef}
        className="min-h-0 flex-1 overflow-auto"
        style={{ "--pl": `${pinnedWidth}px`, "--tf": `${H}px`, "--ts": `${H + (filterRow ? H : 0)}px`, "--hh": `${headHeight}px`, "--fh": `${hasTotals ? H : 0}px`, "--rh": `${ROWHEAD}px` } as React.CSSProperties}
      >
        <table
          ref={grid}
          role="grid"
          aria-label={label}
          aria-multiselectable="true"
          aria-rowcount={lines.length + headerRows + (hasTotals ? 1 : 0)}
          aria-colcount={visible.length + 1}
          onKeyDown={onKey}
          style={{ "--tw": `${tableWidth}px` } as React.CSSProperties}
          className="w-(--tw) min-w-full table-fixed border-separate border-spacing-0 text-base"
        >
          <colgroup>
            <col className="w-(--rh)" />
            {visible.map((c) => <col key={c.id} className="w-(--w)" style={{ "--w": `${wOf(c)}px` } as React.CSSProperties} />)}
          </colgroup>
          <thead>
            <tr aria-rowindex={1}>
              <th scope="col" className={cn("sticky top-0 left-0 z-40 border-r border-b border-line bg-surface-2 px-1 text-left", dense ? "h-7" : "h-9")}>
                {selectable ? (
                  <span style={{ "--s": `${SLOT}px` } as React.CSSProperties} className="grid w-(--s) place-items-center">
                    <Checkbox tabIndex={-1} aria-label="Select all rows shown" checked={allChecked ? true : someChecked ? "indeterminate" : false} onCheckedChange={() => { const next = new Set(selection); for (const id of shownIds) if (allChecked) next.delete(id); else next.add(id); setSelected(next); say(allChecked ? "Deselected all rows shown." : `Selected ${plural(shownIds.length, "row")}.`) }} />
                  </span>
                ) : <span className="sr-only">Row</span>}
              </th>
              {visible.map((c, i) => {
                const sorted = sort?.columnId === c.id ? sort.direction : null
                const here = pos.r === top && pos.c === i
                return (
                  <th
                    key={c.id}
                    scope="col"
                    aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}
                    style={pinStyle(i)}
                    className={cn("group/head sticky top-0 z-20 border-b border-line bg-surface-2 p-0 text-left text-sm font-medium text-ink-2", dense ? "h-7" : "h-9", pinCls(i, true))}
                  >
                    {renaming === c.id ? (
                      <div className="px-1">
                        <Input
                          autoFocus
                          defaultValue={c.label}
                          aria-label={`Rename ${c.label}`}
                          className={cn(dense && "h-6")}
                          onFocus={(e) => e.currentTarget.select()}
                          onKeyDown={(e) => {
                            e.stopPropagation()
                            if (e.key === "Enter") e.currentTarget.blur()
                            if (e.key === "Escape") { e.preventDefault(); e.currentTarget.dataset.cancel = "1"; e.currentTarget.blur() }
                          }}
                          onBlur={(e) => {
                            const name = e.currentTarget.value.trim()
                            if (!e.currentTarget.dataset.cancel && name && name !== c.label) { patch(c.id, { label: name }); setStatus(`Renamed to ${name}.`) }
                            renameNext.current = false
                            setRenaming(null)
                            setPos({ r: top, c: Math.max(0, visible.findIndex((x) => x.id === c.id)) })
                            window.setTimeout(() => grid.current?.querySelector<HTMLElement>(`[data-col="${c.id}"]`)?.focus())
                          }}
                        />
                      </div>
                    ) : (
                      <DropdownMenu open={menuFor === c.id} onOpenChange={(o) => setMenuFor(o ? c.id : null)}>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            data-cell={`${top}:${i}`}
                            data-col={c.id}
                            tabIndex={here && editing === null ? 0 : -1}
                            aria-haspopup="menu"
                            onMouseDown={() => { setPos({ r: top, c: i }); setExt({ r: top, c: i }) }}
                            onKeyDown={(e) => { if (e.key.startsWith("Arrow") && !e.altKey) e.preventDefault() }}
                            className={cn("flex w-full items-center gap-control text-left hover:bg-hover", dense ? "h-7 px-2" : "h-9 px-3", here ? "outline-2 -outline-offset-2 outline-solid outline-primary" : "outline-none", pos.r >= 0 && pos.c === i && "bg-primary-soft text-primary-ink")}
                          >
                            <ColumnTypeIcon type={c.type} provider={c.provider} />
                            <span className={cn("min-w-0 flex-1 truncate", c.type === "number" && "text-right")}>{c.label}</span>
                            {c.pinned && <Pin className="size-3 shrink-0 text-ink-3" aria-label="Pinned" />}
                            {sorted && (sorted === "asc" ? <ArrowUp className="size-3 shrink-0 text-ink-3" aria-hidden="true" /> : <ArrowDown className="size-3 shrink-0 text-ink-3" aria-hidden="true" />)}
                            <ChevronDown className="size-3 shrink-0 text-ink-3" aria-hidden="true" />
                          </button>
                        </DropdownMenuTrigger>
                        {headerMenu(c, i)}
                      </DropdownMenu>
                    )}
                    {/* Drag to resize, double-click to fit. Keyboard: ⌥⇧ and an arrow on the header, or Column width in its menu. */}
                    <span
                      aria-hidden="true"
                      title="Drag to resize, double-click to fit"
                      onPointerDown={(e) => startResize(e, c)}
                      onDoubleClick={(e) => { e.stopPropagation(); fitWidth(c) }}
                      className={cn(
                        "absolute top-0 right-0 z-10 h-full w-2 cursor-col-resize touch-none",
                        "after:absolute after:inset-y-1 after:right-0 after:w-0.5 after:rounded-full after:bg-primary after:opacity-0 after:transition-opacity after:duration-(--duration-fast) hover:after:opacity-100",
                        drag?.id === c.id && "after:opacity-100"
                      )}
                    />
                  </th>
                )
              })}
            </tr>
            {filterRow && (
              <tr aria-rowindex={2}>
                <th scope="row" className={cn("sticky top-(--tf) left-0 z-40 border-r border-b border-line bg-surface px-1 text-xs font-normal text-ink-3", dense ? "h-7" : "h-9")}>
                  <span style={{ "--s": `${SLOT}px` } as React.CSSProperties} className="grid w-(--s) place-items-center"><Search className="size-3.5" aria-hidden="true" /></span><span className="sr-only">Filters</span>
                </th>
                {visible.map((c, i) => {
                  const here = pos.r === -1 && pos.c === i
                  return (
                    <td key={c.id} style={pinStyle(i)} className={cn("sticky top-(--tf) z-20 border-b border-line bg-surface px-1", dense ? "h-7" : "h-9", pinCls(i, true))}>
                      <input
                        data-cell={`-1:${i}`}
                        data-filter={i}
                        tabIndex={here ? 0 : -1}
                        value={filters[c.id] ?? ""}
                        placeholder="Search"
                        aria-label={`Filter ${c.label}`}
                        onFocus={() => { if (!here) { setPos({ r: -1, c: i }); setExt({ r: -1, c: i }) } }}
                        onChange={(e) => {
                          const q = e.target.value
                          setFilters((f) => ({ ...f, [c.id]: q }))
                          const n = rows.filter((r) => Object.entries({ ...filters, [c.id]: q }).every(([id, v]) => { const col = columns.find((x) => x.id === id); return !v.trim() || !col || copyText(col, r).toLowerCase().includes(v.trim().toLowerCase()) })).length
                          say(`Showing ${plural(n, "row")} of ${rows.length.toLocaleString("en-GB")}.`)
                        }}
                        className={cn(
                          "w-full min-w-0 rounded-xs border border-input bg-background px-control text-sm text-ink outline-none placeholder:text-ink-3 hover:border-input-hover focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30",
                          dense ? "h-5.5" : "h-7",
                          c.type === "number" && "text-right",
                          filters[c.id] && "border-primary"
                        )}
                      />
                    </td>
                  )
                })}
              </tr>
            )}
            {hasStatusRow && (
              <tr aria-rowindex={filterRow ? 3 : 2}>
                <th scope="row" title="Run status" className="sticky top-(--ts) left-0 z-40 h-7 border-r border-b border-line bg-surface px-1 text-xs font-normal text-ink-3">
                  <span style={{ "--s": `${SLOT}px` } as React.CSSProperties} className="grid w-(--s) place-items-center"><Activity className="size-3.5" aria-hidden="true" /></span><span className="sr-only">Status</span>
                </th>
                {visible.map((c, i) => (
                  <td key={c.id} style={pinStyle(i)} className={cn("sticky top-(--ts) z-20 h-7 border-b border-line bg-surface", dense ? "px-2" : "px-3", pinCls(i, true))}>
                    {isComputed(c) && c.status ? <ColumnStatus status={c.status} /> : null}
                  </td>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {lines.map((line, r) => {
              if (line.kind === "group") {
                return (
                  <tr key={`g:${line.key}`} aria-rowindex={r + headerRows + 1} data-slot="sheet-group-row">
                    <th scope="row" className={cn("sticky left-0 z-10 border-r border-b border-line bg-surface-2", dense ? "h-7" : "h-9")}><span className="sr-only">Group</span></th>
                    {visible.map((c, ci) => {
                      const here = pos.r === r && pos.c === ci
                      const agg = c.total ? aggregate(c, line.rows) : null
                      return (
                        <td
                          key={c.id}
                          role="gridcell"
                          data-cell={`${r}:${ci}`}
                          tabIndex={here ? 0 : -1}
                          aria-readonly="true"
                          aria-expanded={ci === 0 ? line.open : undefined}
                          onMouseDown={() => go({ r, c: ci })}
                          style={pinStyle(ci)}
                          className={cn(
                            "scroll-mt-(--hh) scroll-mb-(--fh) scroll-ml-(--pl) border-b border-line bg-surface-2 whitespace-nowrap select-none",
                            cellCls,
                            pinCls(ci),
                            c.type === "number" && "tabular text-right text-sm text-ink-2",
                            here ? "outline-2 -outline-offset-2 outline-solid outline-primary" : "outline-none"
                          )}
                        >
                          {ci === 0 ? (
                            <span className="flex min-w-0 items-center gap-control">
                              <button type="button" tabIndex={-1} aria-label={`${line.open ? "Collapse" : "Expand"} ${line.label}`} onMouseDown={(e) => e.stopPropagation()} onClick={() => { go({ r, c: 0 }); toggleGroup(line.key) }} className="-ml-1 grid size-5 shrink-0 place-items-center rounded-xs text-ink-3 hover:bg-hover hover:text-ink">
                                <ChevronRight aria-hidden="true" className={cn("size-3.5 transition-transform duration-(--duration-fast) ease-(--ease-out)", line.open && "rotate-90")} />
                              </button>
                              <span className="truncate font-medium text-ink">{line.label}</span>
                              <span className="tabular shrink-0 text-sm text-ink-3">{line.rows.length}</span>
                            </span>
                          ) : agg !== null ? (
                            <span>{c.total === "average" ? "Avg " : ""}{fmtFor(c, agg)}</span>
                          ) : null}
                        </td>
                      )
                    })}
                  </tr>
                )
              }
              const row = line.row
              const multi = !!range && rangeCells > 1 && r >= range.r1 && r <= range.r2
              const active = pos.r === r
              return (
                <SheetBodyRow
                  key={row.id}
                  api={rowApi}
                  row={row}
                  n={line.n}
                  r={r}
                  rowIndex={r + headerRows + 1}
                  visible={bodyCols}
                  lefts={lefts}
                  cellCls={cellCls}
                  dense={dense}
                  activeC={active ? pos.c : -1}
                  editing={active ? editing : null}
                  error={active ? error : ""}
                  selC1={multi ? range.c1 : -1}
                  selC2={multi ? range.c2 : -1}
                  rejected={rejected}
                  checked={selection.has(row.id)}
                  selectable={selectable}
                  selecting={selection.size > 0}
                  slot={SLOT}
                  hasRowMenu={hasRowMenu}
                  menuOpen={rowMenu === row.id}
                  openColId={onOpenRow ? nameCol?.id : undefined}
                />
              )
            })}
          </tbody>
          {hasTotals && (
            <tfoot>
              <tr aria-rowindex={lines.length + headerRows + 1}>
                <th scope="row" title="Total" className={cn("sticky bottom-0 left-0 z-40 border-t border-r border-line bg-surface-2 px-1 text-sm font-medium text-ink-2", dense ? "h-7" : "h-9")}>
                  <span style={{ "--s": `${SLOT}px` } as React.CSSProperties} className="grid w-(--s) place-items-center"><Sigma className="size-3.5" aria-hidden="true" /></span><span className="sr-only">Total</span>
                </th>
                {visible.map((c, i) => {
                  const agg = c.total ? aggregate(c, filteredRows) : null
                  return (
                    <td key={c.id} style={pinStyle(i)} className={cn("sticky bottom-0 z-20 border-t border-line bg-surface-2 text-sm font-medium whitespace-nowrap text-ink", cellCls, pinCls(i, true), c.type === "number" && "tabular text-right")}>
                      {agg !== null ? `${c.total === "average" ? "Avg " : ""}${fmtFor(c, agg)}` : i === 0 ? plural(filteredRows.length, "row") : ""}
                    </td>
                  )
                })}
              </tr>
            </tfoot>
          )}
        </table>
        {lines.length === 0 && <p className="px-4 py-6 text-base text-ink-2">{rows.length ? "No rows match these filters." : "No rows yet. Add a row or import a CSV file."}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1 border-t border-line px-2 py-1">
        {onAddRows && (
          <>
            {/* Adding rows is announced, not written into the status line: the new row itself is the confirmation. */}
            <Button variant="ghost" size="xs" onClick={() => { adding.current = lines.length; onAddRows(1); setAddSaid("Added 1 row at the bottom.") }}><Plus />Add row</Button>
            <Button variant="ghost" size="xs" onClick={() => { adding.current = lines.length; onAddRows(10); setAddSaid("Added 10 rows at the bottom.") }}>Add 10 rows</Button>
            <span aria-live="polite" className="sr-only">{addSaid}</span>
            <span className="mx-1 h-4 w-px bg-line" aria-hidden="true" />
          </>
        )}
        <p aria-live="polite" className={cn("min-w-0 flex-1 truncate text-sm", tone === "bad" || error ? "text-bad" : "text-ink-3")}>
          {status || `Arrow keys move, Shift+arrows select. Enter edits; Enter again saves and moves down. ${M}C copies, ${M}V pastes, ${M}Z undoes.`}
        </p>
        {rangeStats && <span className="tabular shrink-0 text-sm text-ink-2">{rangeStats}</span>}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- columns menu */

export type ColumnsMenuItem = { id: string; label: string; type?: ColumnType; provider?: ProviderId; hidden?: boolean; locked?: boolean }

/** Which columns show and in what order, for sheets and list tables. Applies at once; reorder by drag, by keyboard or with the Move buttons. */
export function ColumnsMenu<T extends ColumnsMenuItem>({
  columns,
  onChange,
  align = "end",
  wrap,
  onWrapChange,
  pageSize,
  pageSizes = [25, 50, 100],
  onPageSizeChange,
  note,
}: {
  columns: T[]
  onChange: (columns: T[]) => void
  align?: "start" | "end"
  /** List tables: wrap long text in cells. Shown when onWrapChange is passed. */
  wrap?: boolean
  onWrapChange?: (wrap: boolean) => void
  /** List tables: rows per page. Shown when onPageSizeChange is passed. */
  pageSize?: number
  pageSizes?: number[]
  onPageSizeChange?: (size: number) => void
  /** Where the choice is kept, such as "Saved for you on this table". */
  note?: string
}) {
  const [query, setQuery] = React.useState("")
  const [grabbed, setGrabbed] = React.useState<{ id: string; before: T[] } | null>(null)
  const [dragId, setDragId] = React.useState<string | null>(null)
  const [said, setSaid] = React.useState("")
  const shownCount = columns.filter((c) => !c.hidden).length
  const list = columns.filter((c) => c.label.toLowerCase().includes(query.trim().toLowerCase()))

  const moveTo = (id: string, to: number) => {
    const from = columns.findIndex((c) => c.id === id)
    if (from < 0 || to < 0 || to >= columns.length || to === from) return
    const next = [...columns]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
    setSaid(`${item.label} moved to position ${to + 1} of ${columns.length}.`)
  }
  const setHidden = (id: string, hidden: boolean) => onChange(columns.map((c) => (c.id === id ? { ...c, hidden } : c)))

  return (
    <Popover onOpenChange={(o) => { if (!o) { setQuery(""); setGrabbed(null) } }}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm"><Columns3 />Columns</Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-80 p-0">
        <div className="grid gap-2 border-b border-line p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-3" aria-hidden="true" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a column" aria-label="Find a column" className="pl-8" />
          </div>
          <div className="flex items-center gap-1">
            <span className="tabular flex-1 text-sm text-ink-2">{shownCount} of {columns.length} shown</span>
            <Button variant="ghost" size="xs" onClick={() => onChange(columns.map((c) => ({ ...c, hidden: false })))}>Show all</Button>
            <Button variant="ghost" size="xs" onClick={() => onChange(columns.map((c) => (c.locked ? c : { ...c, hidden: true })))}>Hide all</Button>
          </div>
        </div>
        <ul aria-label="Columns, in table order" className="grid max-h-80 overflow-y-auto p-1">
          {list.map((c) => {
            const i = columns.indexOf(c)
            const isGrabbed = grabbed?.id === c.id
            return (
              <li
                key={c.id}
                onDragOver={(e) => { if (dragId) e.preventDefault() }}
                onDrop={(e) => { e.preventDefault(); if (dragId) moveTo(dragId, i); setDragId(null) }}
                className={cn("flex h-8 items-center gap-control rounded-xs px-1 hover:bg-hover", (isGrabbed || dragId === c.id) && "bg-selected")}
              >
                <button
                  type="button"
                  draggable={!query}
                  onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; setDragId(c.id) }}
                  onDragEnd={() => setDragId(null)}
                  aria-label={`Reorder ${c.label}`}
                  aria-pressed={isGrabbed}
                  aria-describedby="columns-menu-help"
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault()
                      if (isGrabbed) { setGrabbed(null); setSaid(`Dropped ${c.label} at position ${i + 1} of ${columns.length}.`) }
                      else { setGrabbed({ id: c.id, before: columns }); setSaid(`Picked up ${c.label}. Use the arrow keys to move it, Space to drop, Esc to cancel.`) }
                    } else if (isGrabbed && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
                      e.preventDefault()
                      moveTo(c.id, i + (e.key === "ArrowUp" ? -1 : 1))
                    } else if (isGrabbed && e.key === "Escape") {
                      e.preventDefault(); e.stopPropagation()
                      onChange(grabbed.before); setGrabbed(null); setSaid(`Move cancelled. ${c.label} is back where it was.`)
                    }
                  }}
                  className="relative grid size-6 shrink-0 cursor-grab place-items-center rounded-xs text-ink-3 hover:text-ink"
                >
                  <GripVertical className="size-3.5" aria-hidden="true" />
                </button>
                {c.type && <ColumnTypeIcon type={c.type} provider={c.provider} />}
                <span className={cn("min-w-0 flex-1 truncate text-base", c.hidden ? "text-ink-3" : "text-ink")}>{c.label}</span>
                <Button variant="ghost" size="icon-xs" aria-label={`Move ${c.label} up`} disabled={i === 0} onClick={() => moveTo(c.id, i - 1)}><ArrowUp /></Button>
                <Button variant="ghost" size="icon-xs" aria-label={`Move ${c.label} down`} disabled={i === columns.length - 1} onClick={() => moveTo(c.id, i + 1)}><ArrowDown /></Button>
                {c.locked ? (
                  <span className="grid size-6 place-items-center text-ink-3"><Lock className="size-3.5" aria-hidden="true" /><span className="sr-only">Always shown</span></span>
                ) : (
                  <Button variant="ghost" size="icon-xs" aria-label={c.hidden ? `Show ${c.label}` : `Hide ${c.label}`} aria-pressed={!c.hidden} onClick={() => setHidden(c.id, !c.hidden)}>
                    {c.hidden ? <EyeOff /> : <Eye className="text-ink" />}
                  </Button>
                )}
              </li>
            )
          })}
          {!list.length && <li className="px-2 py-3 text-base text-ink-2">No columns match “{query}”.</li>}
        </ul>
        {(onWrapChange || onPageSizeChange) && (
          <div className="grid gap-2 border-t border-line px-3 py-2">
            {onWrapChange && (
              <label className="flex h-7 items-center justify-between gap-3 text-base text-ink">
                Wrap long text
                <Switch checked={!!wrap} onCheckedChange={onWrapChange} />
              </label>
            )}
            {onPageSizeChange && (
              <div className="flex h-7 items-center justify-between gap-3 text-base text-ink">
                <span id="columns-menu-page-size">Rows per page</span>
                <RadioGroup aria-labelledby="columns-menu-page-size" value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))} className="flex gap-3">
                  {pageSizes.map((n) => (
                    <label key={n} className="tabular flex items-center gap-control text-base text-ink">
                      <RadioGroupItem value={String(n)} />
                      {n}
                    </label>
                  ))}
                </RadioGroup>
              </div>
            )}
          </div>
        )}
        <p id="columns-menu-help" className="border-t border-line px-3 py-2 text-xs text-ink-3">{note ? `${note}. ` : ""}Drag a handle, or focus it and press Space, then the arrow keys.</p>
        <p aria-live="assertive" className="sr-only">{said}</p>
      </PopoverContent>
    </Popover>
  )
}

/* ---------------------------------------------------------------- run status bar */

export type RunHistoryItem = { id: string; label: string; rows: number; credits: number; outcome: "Done" | "Stopped" | "Failed"; errors?: number; when: React.ReactNode }

/** The bottom bar of a sheet: what is running, how far it is, what it has cost, and Stop. */
export function RunStatusBar({
  running,
  done,
  total,
  errors = 0,
  creditsUsed,
  costPerRow,
  label,
  onStop,
  onRunRemaining,
  onShowErrors,
  autoRun,
  onAutoRunChange,
  history,
  className,
}: {
  running: boolean
  /** Rows finished (done, failed or not found) in the current or last run. */
  done: number
  total: number
  errors?: number
  /** Credits spent by the current or last run. */
  creditsUsed: number
  /** Credits per row for every computed column together; stated next to Auto-run and Run remaining. */
  costPerRow: number
  /** What is running: "Summarise role and Work email". */
  label?: string
  onStop: () => void
  onRunRemaining?: () => void
  onShowErrors?: () => void
  autoRun: boolean
  onAutoRunChange: (on: boolean) => void
  history?: RunHistoryItem[]
  className?: string
}) {
  const pct = total ? Math.floor((done / total) * 100) : 100
  const n = (x: number) => x.toLocaleString("en-GB")
  const remaining = total - done
  const errorText = errors ? `${n(errors)} ${errors === 1 ? "error" : "errors"}` : ""
  const historyTitle = React.useId()
  return (
    <div role="region" aria-label="Run status" data-slot="run-status-bar" className={cn("flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line bg-surface px-3 py-2 text-sm", className)}>
      <div role="status" className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
        {running ? (
          <>
            <Loader2 className="size-3.5 shrink-0 animate-spin text-ink-3" aria-hidden="true" />
            <ShimmerText className="font-medium">{label ? `Running ${label}` : "Running"}</ShimmerText>
            <span className="tabular text-ink-2">{n(done)} of {n(total)} rows · {pct}%</span>
            <span role="progressbar" aria-label="Rows run" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done} className="h-1.5 w-24 overflow-hidden rounded-full bg-hover">
              <span className="block h-full w-(--p) rounded-full bg-primary transition-all duration-(--duration-slow) ease-(--ease-standard)" style={{ "--p": `${pct}%` } as React.CSSProperties} />
            </span>
            <span className="tabular text-ink-2">{formatCredits(creditsUsed)} so far</span>
          </>
        ) : remaining > 0 ? (
          <>
            <Square className="size-3 shrink-0 text-ink-3" aria-hidden="true" />
            <span className="font-medium text-ink">Stopped at {pct}%</span>
            <span className="tabular text-ink-2">{n(done)} of {n(total)} rows · {formatCredits(creditsUsed)} used</span>
          </>
        ) : (
          <>
            <Check className="size-3.5 shrink-0 text-ok" aria-hidden="true" />
            <span className="font-medium text-ink">{errors ? "Every row has run" : "Table up to date"}</span>
            <span className="tabular text-ink-2">{n(total)} rows · {formatCredits(creditsUsed)} used</span>
          </>
        )}
        {errorText && (onShowErrors
          ? <Button variant="link" size="xs" className="text-bad" onClick={onShowErrors}><CircleAlert />{errorText}</Button>
          : <span className="inline-flex items-center gap-1 text-bad"><CircleAlert className="size-3.5" aria-hidden="true" />{errorText}</span>)}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {running ? (
          <Button variant="outline" size="sm" onClick={onStop}><Square />Stop</Button>
        ) : remaining > 0 && onRunRemaining ? (
          <Button variant="outline" size="sm" onClick={onRunRemaining}>Run {n(remaining)} remaining · ≈ {formatCredits(remaining * costPerRow)}</Button>
        ) : null}
        <label className="flex items-center gap-2 text-ink">
          <Switch checked={autoRun} onCheckedChange={onAutoRunChange} aria-describedby="auto-run-cost" />
          Auto-run new rows
          <span id="auto-run-cost" className="tabular text-ink-3">≈ {formatCredits(costPerRow)} / row</span>
        </label>
        {history && (
          <Popover>
            <PopoverTrigger asChild><Button variant="ghost" size="sm"><History />History</Button></PopoverTrigger>
            {/* Focus the panel itself on open, not the first row: a relative Timestamp there would open its tooltip unasked. Tab reaches the rows. */}
            <PopoverContent align="end" tabIndex={-1} aria-labelledby={historyTitle} onOpenAutoFocus={(e) => { e.preventDefault(); (e.target as HTMLElement).focus() }} className="w-96 max-w-(--radix-popover-content-available-width) p-0">
              <h3 id={historyTitle} className="border-b border-line px-3 py-2 text-base font-semibold text-ink">Run history</h3>
              {history.length ? (
                <ul className="grid max-h-80 divide-y divide-line overflow-y-auto">
                  {history.map((h) => (
                    <li key={h.id} className="grid gap-0.5 px-3 py-2">
                      <span className="flex items-center gap-2"><span className="min-w-0 flex-1 truncate text-base text-ink">{h.label}</span><Badge variant={h.outcome === "Done" ? "success" : h.outcome === "Failed" ? "destructive" : "secondary"} dot>{h.outcome}</Badge></span>
                      <span className="tabular text-sm text-ink-2">{n(h.rows)} rows · {formatCredits(h.credits)}{h.errors ? ` · ${n(h.errors)} ${h.errors === 1 ? "error" : "errors"}` : ""} · {h.when}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="px-3 py-3 text-base text-ink-2">No runs yet.</p>}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  )
}
