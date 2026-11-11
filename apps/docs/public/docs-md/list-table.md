# List table

A read-mostly table for scanning and triaging records such as listings or candidates, with a sticky header, sortable columns, J and K row focus and checkbox selection.

Kind: component · Group: Data · Status: built, import from @twoux/ui

## When to use

- People need to find records that match criteria, compare them, and act on one or several. These are the core table tasks.
- Every record has the same attributes and the set will keep growing, such as all live listings or an applicant inbox.
- People will scan, sort and analyse large volumes of rows rather than read each one.

## When not to use

- To edit cells, enrich with AI or total columns. Use the TwoUX Data grid, because a table is not an interactive widget and its cells are not focusable.
- For a short list of items under shared headings, such as candidates by stage. Use the TwoUX Grouped list.
- For page layout. Tables are only for structured data.
- For one figure that matters. Use the TwoUX Stat card with comparison instead of a one-row table.

## Structure

1. Table header (title, item count, actions)
2. Filter bar
3. Sticky column header row
4. Selection checkbox column
5. Identifying column (Role)
6. Data columns
7. Row focus indicator
8. Footer (count, selection count, pagination)

## Guidelines

- Keep the column header row visible on scroll when a table has more than 30 items per page, more than five columns or sortable columns.
- Put a human-readable identifier (the Role) first and order the remaining columns by importance.
- Only the sorted column shows its arrow; the others reveal it on hover. Expose the current sort with aria-sort on that header only.
- J and K (or the arrow keys) move row focus, X toggles selection, Enter opens the row in the side panel, Esc clears. Show each shortcut on its button so experts learn it.
- The header checkbox selects only the rows on the current page, and the footer reads "2 of 24 selected".
- Open a row in a non-modal side panel so the table stays visible; modals hide neighbouring rows.
- Never add cell editing or a totals row to a list table; that is the Data grid's job.
- For spreadsheet-like data people scan many rows of, such as an inventory, a ledger, an import or a mapping, use size="dense" (28px rows) and the Dense table parts. Keep the default 36px rows for everything else. Dense is a variant for that data, never a setting people switch.

## Content

- Left-align text and right-align numbers with a consistent number of decimals, in tabular figures.
- Write column labels as short, plain nouns.
- Show the total next to the title, and the selected count before the total when rows are selected. Hide the count while loading.
- Show a dash for an empty value and give it hidden text for screen readers, never a blank cell.
- Status is a bordered pill with a word, never colour alone.

## Accessibility

- 1.3.1 Info and Relationships: mark up header cells with scope="col" (and scope="row" for the Role cell) so each value is tied to its column.
- APG table pattern: use table semantics with an accessible name from a caption or aria-label, and aria-sort on the sorted header only.
- 2.1.4 Character Key Shortcuts: J, K, X, E and / are single-key shortcuts, so TwoUX lets people turn them off in settings.
- 2.4.7 Focus Visible: the focused row shows a visible indicator, and highlighted rows are never the only signal of selection or focus.
- 2.4.11 Focus Not Obscured: the sticky header must not fully cover the focused row; use scroll padding.
- Give repeated row actions unique names, for example "Open Junior Product Designer" rather than "Open".

## Keyboard

| Keys | Action |
|---|---|
| J / ↓ | Move row focus down |
| K / ↑ | Move row focus up |
| ⇧J / ⇧K | Extend selection down or up |
| X | Select or deselect the focused row |
| Enter | Open the focused row in the side panel |
| Esc | Close the side panel, or clear the selection |
| / | Focus search |
| F | Open the filter field list |
| ⇧P | Switch the side panel between push and overlay |

## Examples

### listings

```tsx
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Badge,
	BulkActionBar,
	Button,
	Checkbox,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TablePagination,
	TableRow,
	TableSortHead,
	toast,
	useRowKeyboard,
} from "@twoux/ui";
import { type ColumnDef, type RowSelectionState, type SortingState, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { CalendarPlus, CircleX, Copy, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { LISTINGS, type Listing, STATUS_VARIANT, formatDate } from "./data";

export const meta = { title: "Listings", description: "Click a header to sort; only the sorted column shows its arrow. Select rows to bring up the bulk bar. Focus the table and use J/K to move, X to select, Esc to clear.", order: 1 };

export default function Example() {
	const [sorting, setSorting] = useState<SortingState>([{ id: "closes", desc: false }]);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });
	const [confirm, setConfirm] = useState(false);

	const columns = useMemo<ColumnDef<Listing>[]>(
		() => [
			{
				id: "select",
				header: ({ table }) => (
					<Checkbox
						aria-label="Select all on this page"
						checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
						onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
					/>
				),
				cell: ({ row }) => <Checkbox aria-label={`Select ${row.original.role}`} checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} />,
				enableSorting: false,
			},
			{ accessorKey: "role", header: "Role", cell: ({ row }) => <span className="font-medium text-ink">{row.original.role}</span> },
			{ accessorKey: "location", header: "Location", cell: ({ getValue }) => <span className="text-ink-2">{getValue<string>()}</span> },
			{ accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant={STATUS_VARIANT[row.original.status]} dot>{row.original.status}</Badge> },
			{ accessorKey: "applicants", header: "Applicants", meta: { align: "right" }, cell: ({ getValue }) => <span className="tabular block text-right">{getValue<number>()}</span> },
			{ accessorKey: "closes", header: "Closes", cell: ({ getValue }) => <span className="tabular text-ink-2">{formatDate(getValue<string>())}</span> },
			{ id: "actions", header: () => <span className="sr-only">Actions</span>, enableSorting: false, cell: ({ row, table }) => <RowMenu listing={row.original} disabled={table.getSelectedRowModel().rows.length > 0} /> },
		],
		[],
	);

	const table = useReactTable({
		data: LISTINGS,
		columns,
		state: { sorting, rowSelection, pagination },
		onSortingChange: setSorting,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: (u) => {
			setPagination(u);
			setRowSelection({}); // changing page clears the selection
		},
		getRowId: (r) => r.id,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	const rows = table.getRowModel().rows;
	const selected = table.getSelectedRowModel().rows.length;
	const clear = () => setRowSelection({});
	const keys = useRowKeyboard({ count: rows.length, onToggle: (i, v) => rows[i]?.toggleSelected(v), onOpen: (i) => toast(`Opened ${rows[i].original.role}`), onClear: clear, selected });

	return (
		<div className="w-full overflow-hidden rounded-sm border border-line bg-surface">
			<BulkActionBar
				count={selected}
				noun={selected === 1 ? "listing" : "listings"}
				onClear={clear}
				actions={[
					{ label: "Extend 30 days", icon: <CalendarPlus />, shortcut: "T", onSelect: () => { toast.success(`Extended ${selected} listing${selected === 1 ? "" : "s"} by 30 days`, { action: { label: "Undo", onClick: () => {} } }); clear(); } },
					{ label: "Duplicate", icon: <Copy />, shortcut: "D", onSelect: () => { toast.success(`Duplicated ${selected} listing${selected === 1 ? "" : "s"}`); clear(); } },
					{ label: "Close listings", icon: <CircleX />, destructive: true, onSelect: () => setConfirm(true) },
				]}
			/>
			<Table aria-label="Listings">
				<TableHeader>
					{table.getHeaderGroups().map((hg) => (
						<TableRow key={hg.id} className="hover:bg-transparent">
							{hg.headers.map((h) => {
								const right = (h.column.columnDef.meta as { align?: string } | undefined)?.align === "right";
								if (!h.column.getCanSort()) return <TableHead key={h.id} className={h.id === "select" ? "w-9" : "w-10"}>{flexRender(h.column.columnDef.header, h.getContext())}</TableHead>;
								return (
									<TableSortHead key={h.id} sorted={h.column.getIsSorted()} onSort={() => h.column.toggleSorting(h.column.getIsSorted() === "asc")} align={right ? "right" : "left"}>
										{flexRender(h.column.columnDef.header, h.getContext())}
									</TableSortHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody {...keys.bodyProps} aria-label="Listings, use J and K to move, X to select">
					{rows.map((row, i) => (
						<TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined} {...keys.rowProps(i)}>
							{row.getVisibleCells().map((cell) => (
								<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
			<TablePagination
				page={pagination.pageIndex}
				pageCount={table.getPageCount()}
				pageSize={pagination.pageSize}
				total={LISTINGS.length}
				selected={selected}
				noun="listings"
				onPageChange={(p) => table.setPageIndex(p)}
			/>
			<AlertDialog open={confirm} onOpenChange={setConfirm}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Close {selected} listings?</AlertDialogTitle>
						<AlertDialogDescription>They come off every job board today. Applicants and notes are kept.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Keep open</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={() => { toast.success(`${selected} listing${selected === 1 ? "" : "s"} closed`); clear(); }}>Close listings</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

function RowMenu({ listing, disabled }: { listing: Listing; disabled: boolean }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${listing.role}`} disabled={disabled}><Ellipsis /></Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem><Pencil />Edit</DropdownMenuItem>
				<DropdownMenuItem><Copy />Duplicate</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive"><Trash2 />Close listing</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
```

## Related

- Data grid
- Filter pills and filter bar
- Bulk action bar
- Pagination and counts
- Columns menu
- Saved views
- Grouped list
- Dense table
