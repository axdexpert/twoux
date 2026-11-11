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
