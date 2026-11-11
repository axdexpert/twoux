/**
 * TwoUX compositions for the dense Table (size="dense", 28px rows) used for spreadsheet-like data: inventories,
 * ledgers, imports and mapping. Built on the generated shadcn Table, Button, Input, DropdownMenu and Tooltip.
 * TableGroupRow: a full-width section row with its label, an optional info tooltip and count, optionally collapsible.
 * TableRowNumber: the row number with a ⋮ menu of row actions, named "Actions for <row>".
 * TableFilterRow: one compact search field under each filterable header, named "Filter <column>".
 * TableCellAction: an in-cell button revealed on row hover and keyboard focus, always shown on touch. Its action is
 *   always in the row menu too, so it is never the only way.
 * TableNotApplicable and TableLinkedItems: "n/a" read as "not applicable", and two items joined by an arrow.
 */
import { ArrowRight, ChevronRight, EllipsisVertical, Info, Search } from "lucide-react"
import * as React from "react"
import { cn } from "../lib/cn"
import { Button } from "./button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu"
import { TableCell, TableRow } from "./table"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

/* ---------------------------------------------------------------- group row */

/**
 * Put each group in its own TableBody with this row first. With onExpandedChange the label becomes a button with
 * aria-expanded; leave the group's rows out while it is collapsed.
 */
export function TableGroupRow({
  label,
  info,
  count,
  colSpan,
  expanded,
  onExpandedChange,
  controls,
  children,
  className,
}: {
  label: string
  /** What belongs in the group, in a tooltip on the info button. */
  info?: React.ReactNode
  count?: number
  /** The number of columns in the table. */
  colSpan: number
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  /** id of the TableBody the row opens and closes. */
  controls?: string
  /** Extra content on the right of the row, such as a group total. */
  children?: React.ReactNode
  className?: string
}) {
  const collapsible = !!onExpandedChange
  const open = expanded ?? true
  const name = (
    <>
      {collapsible && <ChevronRight aria-hidden="true" className={cn("size-3.5 shrink-0 text-ink-3 transition-transform duration-(--duration-fast) ease-(--ease-out)", open && "rotate-90")} />}
      <span className="truncate font-medium text-ink">{label}</span>
      {count !== undefined && <span className="tabular shrink-0 text-sm font-normal text-ink-3">{count.toLocaleString("en-GB")}<span className="sr-only"> rows</span></span>}
    </>
  )
  return (
    <TableRow data-slot="table-group-row" className={cn("bg-surface-2 hover:bg-surface-2", className)}>
      <th scope="rowgroup" colSpan={colSpan} className="h-9 p-0 text-left align-middle text-base font-normal group-data-[size=dense]/table:h-7">
        <div className="sticky left-0 flex w-fit max-w-full items-center gap-control px-3 group-data-[size=dense]/table:px-2">
          {collapsible ? (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={controls}
              onClick={() => onExpandedChange?.(!open)}
              className="-ml-1 flex min-w-0 items-center gap-control rounded-xs px-1 outline-none hover:bg-hover focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {name}
            </button>
          ) : name}
          {info && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" aria-label={`About ${label}`} className="relative grid size-5 shrink-0 place-items-center rounded-xs text-ink-3 outline-none after:absolute after:-inset-0.5 hover:bg-hover hover:text-ink focus-visible:ring-2 focus-visible:ring-ring/50">
                  <Info className="size-3.5" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-64">{info}</TooltipContent>
            </Tooltip>
          )}
          {children}
        </div>
      </th>
    </TableRow>
  )
}

/* ---------------------------------------------------------------- row number + row actions */

/** The first cell of a row: its number, then ⋮ with the row's actions (DropdownMenuItem children). */
export function TableRowNumber({
  n,
  label,
  children,
  className,
  ...props
}: Omit<React.ComponentProps<typeof TableCell>, "children"> & {
  n: number
  /** Names the row in the menu button: "Actions for <label>". */
  label: string
  /** The row's actions. Include every in-cell action here too. */
  children: React.ReactNode
}) {
  return (
    <TableCell data-slot="table-row-number" className={cn("w-16 pr-1 text-sm text-ink-3 group-data-[size=dense]/table:pr-0.5", className)} {...props}>
      <span className="flex items-center justify-between gap-1">
        <span className="tabular">{n.toLocaleString("en-GB")}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs" aria-label={`Actions for ${label}`} className="size-5 text-ink-3 hover:text-ink data-[state=open]:bg-hover data-[state=open]:text-ink">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">{children}</DropdownMenuContent>
        </DropdownMenu>
      </span>
    </TableCell>
  )
}

/* ---------------------------------------------------------------- filter row */

export type TableFilterColumn = { id: string; label: string; align?: "left" | "right" } | null

/** Goes in TableHeader under the header row. Pass null for a column with no filter (selection, row number, actions). */
export function TableFilterRow({
  columns,
  values,
  onChange,
  className,
}: {
  columns: TableFilterColumn[]
  values: Record<string, string>
  onChange: (columnId: string, value: string) => void
  className?: string
}) {
  return (
    <TableRow data-slot="table-filter-row" className={cn("bg-surface hover:bg-surface", className)}>
      {columns.map((c, i) => (
        <TableCell key={c?.id ?? `none-${i}`} className="px-1 group-data-[size=dense]/table:px-1">
          {c && (
            <span className="relative block">
              <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1.5 size-3 -translate-y-1/2 text-ink-3" />
              <input
                type="search"
                value={values[c.id] ?? ""}
                onChange={(e) => onChange(c.id, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape" && values[c.id]) { e.preventDefault(); e.stopPropagation(); onChange(c.id, "") } }}
                placeholder="Search"
                aria-label={`Filter ${c.label}`}
                className={cn(
                  "h-7 w-full min-w-0 rounded-xs border border-input bg-background pr-2 pl-5.5 text-sm text-ink outline-none placeholder:text-ink-3 hover:border-input-hover focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 group-data-[size=dense]/table:h-5.5 [&::-webkit-search-cancel-button]:hidden",
                  c.align === "right" && "text-right",
                  values[c.id] && "border-primary"
                )}
              />
            </span>
          )}
        </TableCell>
      ))}
    </TableRow>
  )
}

/* ---------------------------------------------------------------- in-cell action */

/**
 * A quiet button inside a cell, such as Open or Share, revealed while the row is hovered or has keyboard focus and
 * always shown on touch screens. aria-label names the row ("Open Magnet preparation"). Put the same action in the
 * row's ⋮ menu: an in-cell button is a shortcut, never the only way.
 */
export function TableCellAction({ className, ...props }: React.ComponentProps<typeof Button> & { "aria-label": string }) {
  return (
    <Button
      data-slot="table-cell-action"
      variant="outline"
      size="xs"
      className={cn(
        "h-5 shrink-0 px-control opacity-0 transition-opacity duration-(--duration-fast) ease-(--ease-out) focus-visible:opacity-100 pointer-coarse:opacity-100 in-[tr:hover]:opacity-100 in-[tr:focus-within]:opacity-100 in-data-[focused=true]:opacity-100",
        className
      )}
      {...props}
    />
  )
}

/* ---------------------------------------------------------------- small cell contents */

/** "n/a" for a value that doesn't apply to this row, read as "not applicable". Not the same as empty (a dash). */
export function TableNotApplicable({ className }: { className?: string }) {
  return <span aria-label="not applicable" className={cn("text-sm text-ink-3", className)}>n/a</span>
}

/** Two linked items, such as a process and what it makes: "Magnet preparation → NdFeB magnet powder". */
export function TableLinkedItems({ from, to, className }: { from: React.ReactNode; to: React.ReactNode; className?: string }) {
  return (
    <span className={cn("flex min-w-0 items-center gap-control", className)}>
      <span className="min-w-0 truncate">{from}</span>
      <ArrowRight className="size-3 shrink-0 text-ink-3" aria-hidden="true" />
      <span className="sr-only">to</span>
      <span className="min-w-0 truncate text-ink-2">{to}</span>
    </span>
  )
}
