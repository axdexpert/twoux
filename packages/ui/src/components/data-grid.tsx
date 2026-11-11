/**
 * TwoUX composition: an editable grid for enriching many columns (WAI-ARIA grid pattern).
 * One tab stop; arrows move between cells, Home/End to the row's ends; Enter or F2 edits, Esc cancels,
 * Enter saves and stays, Tab saves and moves on. Validation per column; the message shows in the status line.
 * Pinned columns and the header stay in view while scrolling; the totals row counts only the rows shown.
 * Optional row selection: a checkbox column (Shift+Space toggles the active row) and the bulk action bar above the header.
 */
import { Pencil } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/cn"
import { Checkbox } from "./checkbox"
import { type BulkAction, BulkActionBar } from "./data-table"

export type GridColumn = {
  id: string
  label: string
  /** px; pinned columns need one */
  width: number
  pin?: boolean
  editable?: boolean
  type?: "text" | "number"
  /** Return a message to block the save. */
  validate?: (value: string) => string | undefined
  total?: "sum" | "average"
}
export type GridRow = { id: string } & Record<string, string | number>

export function DataGrid({
  columns,
  rows,
  onCellChange,
  "aria-label": label,
  selectedRowIds,
  onSelectedRowIdsChange,
  bulkActions,
  noun,
  className,
}: {
  columns: GridColumn[]
  rows: GridRow[]
  onCellChange: (rowId: string, columnId: string, value: string | number) => void
  "aria-label": string
  /** Selected rows. Pass with onSelectedRowIdsChange to add a checkbox column. */
  selectedRowIds?: string[]
  onSelectedRowIdsChange?: (ids: string[]) => void
  /** Actions for the bulk action bar above the header while rows are selected; extras move into More. */
  bulkActions?: BulkAction[]
  /** Plural noun for the selection count: "2 listings selected". */
  noun?: string
  className?: string
}) {
  const selectable = !!onSelectedRowIdsChange
  const selected = selectedRowIds ?? []
  const setSelected = (ids: string[]) => onSelectedRowIdsChange?.(ids)
  const toggleRow = (id: string) => setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])
  const allChecked = rows.length > 0 && rows.every((r) => selected.includes(r.id)) ? true : rows.some((r) => selected.includes(r.id)) ? "indeterminate" : false
  // The checkbox column is pinned at the left edge, so pinned data columns start after it (w-9, 36px).
  const offset = selectable ? 36 : 0
  const [pos, setPos] = React.useState({ r: 0, c: 0 })
  const [editing, setEditing] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string>("")
  const [status, setStatus] = React.useState("")
  const grid = React.useRef<HTMLTableElement>(null)
  const lefts = columns.reduce<number[]>((acc, c, i) => [...acc, i === 0 ? offset : acc[i - 1] + (columns[i - 1].pin ? columns[i - 1].width : 0)], [])
  const totalsRow = columns.some((c) => c.total)

  const cellEl = (r: number, c: number) => grid.current?.querySelector<HTMLElement>(`[data-cell="${r}-${c}"]`)
  React.useEffect(() => { if (editing === null) cellEl(pos.r, pos.c)?.focus({ preventScroll: false }) }, [pos, editing])

  const move = (r: number, c: number) => setPos({ r: Math.max(0, Math.min(rows.length - 1, r)), c: Math.max(0, Math.min(columns.length - 1, c)) })
  const startEdit = (initial?: string) => {
    const col = columns[pos.c]
    if (!col.editable) { setStatus(`${col.label} can't be edited here.`); return }
    setError("")
    setEditing(initial ?? String(rows[pos.r][col.id] ?? ""))
  }
  const commit = (then: "stay" | "next") => {
    const col = columns[pos.c], row = rows[pos.r]
    const v = editing ?? ""
    const msg = col.validate?.(v)
    if (msg) { setError(msg); setStatus(`${col.label}: ${msg}`); return false }
    onCellChange(row.id, col.id, col.type === "number" ? Number(v) : v)
    setStatus(`Saved ${col.label} for ${row[columns[0].id]}.`)
    setEditing(null)
    if (then === "next") move(pos.r, pos.c + 1)
    return true
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (editing !== null) {
      if (e.key === "Escape") { e.preventDefault(); setEditing(null); setError(""); setStatus("Edit cancelled.") }
      else if (e.key === "Enter") { e.preventDefault(); commit("stay") }
      else if (e.key === "Tab") { e.preventDefault(); commit("next") }
      return
    }
    const k = e.key
    if (k === "ArrowRight") { e.preventDefault(); move(pos.r, pos.c + 1) }
    else if (k === "ArrowLeft") { e.preventDefault(); move(pos.r, pos.c - 1) }
    else if (k === "ArrowDown") { e.preventDefault(); move(pos.r + 1, pos.c) }
    else if (k === "ArrowUp") { e.preventDefault(); move(pos.r - 1, pos.c) }
    else if (k === "Home") { e.preventDefault(); move(e.ctrlKey ? 0 : pos.r, 0) }
    else if (k === "End") { e.preventDefault(); move(e.ctrlKey ? rows.length - 1 : pos.r, columns.length - 1) }
    else if (k === " " && e.shiftKey && selectable) { e.preventDefault(); toggleRow(rows[pos.r].id); setStatus(`${selected.includes(rows[pos.r].id) ? "Deselected" : "Selected"} ${rows[pos.r][columns[0].id]}.`) }
    else if (k === "Enter" || k === "F2") { e.preventDefault(); startEdit() }
    else if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey && columns[pos.c].editable) { e.preventDefault(); startEdit(k) }
  }

  const fmt = (v: unknown) => (typeof v === "number" ? v.toLocaleString("en-GB") : String(v ?? ""))
  const total = (c: GridColumn) => {
    const nums = rows.map((r) => Number(r[c.id])).filter((n) => !Number.isNaN(n))
    if (!nums.length) return ""
    const sum = nums.reduce((a, b) => a + b, 0)
    return c.total === "average" ? (sum / nums.length).toLocaleString("en-GB", { maximumFractionDigits: 1 }) : sum.toLocaleString("en-GB")
  }
  const stickyStyle = (i: number) => (columns[i].pin ? ({ "--l": `${lefts[i]}px` } as React.CSSProperties) : undefined)
  const widthStyle = (i: number) => ({ ...stickyStyle(i), "--w": `${columns[i].width}px` }) as React.CSSProperties

  return (
    <div className={cn("grid overflow-hidden rounded-sm border border-line bg-surface", className)}>
      {selectable && bulkActions?.length ? (
        <BulkActionBar count={selected.length} noun={noun} onClear={() => setSelected([])} actions={bulkActions} />
      ) : null}
      <div className="max-h-96 overflow-auto">
        <table ref={grid} role="grid" aria-label={label} aria-rowcount={rows.length + 1} aria-multiselectable={selectable || undefined} onKeyDown={onKey} className="w-max min-w-full border-separate border-spacing-0 text-base">
          <thead>
            <tr>
              {selectable && (
                <th scope="col" className="sticky top-0 left-0 z-30 h-9 w-9 min-w-9 border-b border-line bg-surface-2 pl-3">
                  <Checkbox aria-label="Select all rows" tabIndex={-1} className="translate-y-0.5" checked={allChecked} onCheckedChange={(v) => setSelected(v ? rows.map((r) => r.id) : [])} />
                </th>
              )}
              {columns.map((c, i) => (
                <th
                  key={c.id}
                  scope="col"
                  style={widthStyle(i)}
                  className={cn("sticky top-0 z-10 h-9 w-(--w) min-w-(--w) border-b border-line bg-surface-2 px-3 text-left text-sm font-medium whitespace-nowrap text-ink-2", c.pin && "left-(--l) z-20", c.type === "number" && "text-right")}
                >
                  <span className="inline-flex items-center gap-1">{c.label}{c.editable && <Pencil className="size-3 text-ink-3" aria-label="(editable)" />}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={row.id} aria-selected={selectable ? selected.includes(row.id) : undefined} className="group/row">
                {selectable && (
                  <td className={cn("sticky left-0 z-[2] h-9 w-9 min-w-9 border-b border-line pl-3", selected.includes(row.id) ? "bg-primary-soft" : "bg-surface")}>
                    <Checkbox aria-label={`Select ${row[columns[0].id]}`} tabIndex={-1} className="translate-y-0.5" checked={selected.includes(row.id)} onCheckedChange={() => toggleRow(row.id)} />
                  </td>
                )}
                {columns.map((c, ci) => {
                  const here = pos.r === r && pos.c === ci
                  const isEditing = here && editing !== null
                  return (
                    <td
                      key={c.id}
                      role="gridcell"
                      data-cell={`${r}-${ci}`}
                      tabIndex={here && !isEditing ? 0 : -1}
                      aria-readonly={!c.editable || undefined}
                      onMouseDown={() => { if (!isEditing) setPos({ r, c: ci }) }}
                      onDoubleClick={() => startEdit()}
                      style={widthStyle(ci)}
                      className={cn(
                        "h-9 w-(--w) min-w-(--w) border-b border-line px-3 whitespace-nowrap outline-none",
                        c.pin ? "sticky left-(--l) z-[1]" : "",
                        selected.includes(row.id) ? "bg-primary-soft" : "bg-surface",
                        c.type === "number" && "tabular text-right",
                        c.editable && !isEditing && "hover:bg-hover",
                        here && (isEditing && error ? "shadow-[inset_0_0_0_2px_var(--color-bad)]" : "shadow-[inset_0_0_0_2px_var(--color-primary)]"), isEditing && "bg-surface"
                      )}
                    >
                      {isEditing ? (
                        <input
                          autoFocus
                          value={editing}
                          aria-label={`${c.label} for ${row[columns[0].id]}`}
                          aria-invalid={!!error || undefined}
                          inputMode={c.type === "number" ? "decimal" : undefined}
                          onChange={(e) => { setEditing(e.target.value); setError("") }}
                          onBlur={() => { if (editing !== null && !commit("stay")) setEditing(null) }}
                          className={cn("h-full w-full bg-transparent outline-none", c.type === "number" && "text-right")}
                        />
                      ) : (
                        <span className="block truncate">{fmt(row[c.id])}</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
          {totalsRow && (
            <tfoot>
              <tr>
                {selectable && <td className="sticky bottom-0 left-0 z-[3] h-9 border-t border-line bg-surface-2" />}
                {columns.map((c, i) => (
                  <td key={c.id} style={widthStyle(i)} className={cn("sticky bottom-0 h-9 border-t border-line bg-surface-2 px-3 text-sm font-medium whitespace-nowrap text-ink", c.pin && "left-(--l) z-[2]", c.type === "number" && "tabular text-right")}>
                    {i === 0 ? `Totals (${rows.length} rows shown)` : c.total ? `${c.total === "average" ? "Avg " : ""}${total(c)}` : ""}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      <p aria-live="polite" className={cn("min-h-8 border-t border-line px-3 py-2 text-sm", error ? "text-bad" : "text-ink-3")}>
        {status || `Arrow keys move between cells. Enter or F2 edits, Esc cancels, Tab saves and moves on.${selectable ? " Shift+Space selects the row." : ""}`}
      </p>
    </div>
  )
}
