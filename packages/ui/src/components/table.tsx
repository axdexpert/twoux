/**
 * Generated from shadcn/ui new-york-v4 "table" by scripts/tailor-shadcn.mjs. Do not edit by hand.
 * TwoUX changes:
 *  - Adds containerClassName, so a table can scroll inside a fixed height and keep its header sticky
 *  - Adds size="dense": 28px rows and header with 8px padding, the same 13px text, for spreadsheet-like data (inventories, ledgers, imports, mapping). Not a density setting
 *  - Sticky header on the quiet surface, with the light divider
 *  - Rows: light divider, hover fill, indigo tint when selected, an indigo edge on the keyboard-focused row
 *  - Rows and header use the row tokens (36px, or 28px dense), 12px side padding and 2px top and bottom, so a 28px control in a cell keeps the row at 36px; header labels 12px medium grey, in sentence case
 *  - Frozen columns: data-pinned on a head and its cells keeps them in view when the table scrolls sideways, at left var(--pin); data-pinned="last" draws the edge
 */
"use client"

import * as React from "react"
import { cn } from "../lib/cn"

function Table({ className, containerClassName, size = "default", ...props }: React.ComponentProps<"table"> & { containerClassName?: string; size?: "default" | "dense" }) {
  return (
    <div
      data-slot="table-container"
      className={cn("relative w-full overflow-x-auto", containerClassName)}
    >
      <table
        data-slot="table"
        data-size={size}
        className={cn("group/table w-full caption-bottom text-base", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("sticky top-0 z-10 bg-surface-2 [&_tr]:border-b [&_tr]:border-line", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-line bg-surface-2 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-line transition-colors duration-(--duration-fast) ease-(--ease-out) outline-none hover:bg-hover has-aria-expanded:bg-hover data-[state=selected]:bg-primary-soft data-[focused=true]:shadow-[inset_2px_0_0_var(--color-primary)]",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-row px-3 text-left align-middle text-sm font-medium whitespace-nowrap text-ink-2 group-data-[size=dense]/table:h-row-dense group-data-[size=dense]/table:px-2 data-pinned:sticky data-pinned:left-[var(--pin,0px)] data-pinned:z-20 data-pinned:bg-surface-2 data-[pinned=last]:border-r data-[pinned=last]:border-line [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "h-row px-3 py-hair align-middle whitespace-nowrap group-data-[size=dense]/table:h-row-dense group-data-[size=dense]/table:px-2 group-data-[size=dense]/table:py-0 data-pinned:sticky data-pinned:left-[var(--pin,0px)] data-pinned:z-1 data-pinned:bg-surface data-[pinned=last]:border-r data-[pinned=last]:border-line in-[tr:hover]:data-pinned:bg-hover in-data-[state=selected]:data-pinned:bg-primary-soft [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-base text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
