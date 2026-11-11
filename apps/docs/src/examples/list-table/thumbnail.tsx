import { Badge, Checkbox, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@twoux/ui";
import { MoreHorizontal } from "lucide-react";

const ROWS = [
	["Product Designer", "Open", "success"],
	["Data Analyst", "Draft", "secondary"],
] as const;

/* Compact in the gallery: the real Table with select checkboxes, a bold name column and status badges, as the
   Listings example builds it. With `anatomy`, the component page shows every part a preview can carry, each marked
   with data-anatomy="n" (n is the part's number in the anatomy list), so the page can place matching numbers. */
export default function Thumbnail({ anatomy = false }: { anatomy?: boolean }) {
	if (!anatomy) {
		return (
			<div className="w-64 overflow-hidden rounded-sm border border-line bg-surface">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-8"><Checkbox tabIndex={-1} aria-label="Select all" /></TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{ROWS.map(([role, status, v]) => (
							<TableRow key={role}>
								<TableCell><Checkbox tabIndex={-1} aria-label={`Select ${role}`} /></TableCell>
								<TableCell className="font-medium text-ink">{role}</TableCell>
								<TableCell><Badge variant={v} dot>{status}</Badge></TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}
	return (
		<div className="w-80 overflow-hidden rounded-sm border border-line bg-surface text-sm">
			<div data-anatomy="1" className="flex h-8 items-center gap-2 px-3">
				<span className="font-medium text-ink">Listings</span>
				<span className="tabular text-ink-3">3</span>
				<MoreHorizontal className="ml-auto size-3.5 text-ink-3" aria-hidden="true" />
			</div>
			<div data-anatomy="3" className="grid h-7 grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-2 border-t border-line bg-surface-2 px-3 font-medium text-ink-2">
				<span className="size-3.5 rounded-xs border border-control" />
				<span>Role</span>
				<span>Status</span>
			</div>
			{ANATOMY_ROWS.map(([role, status, v], i) => (
				<div key={role} data-anatomy={i === 1 ? "7" : undefined} className="grid h-8 grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-2 border-t border-line px-3 data-[anatomy=7]:bg-selected">
					<span data-anatomy={i === 0 ? "4" : undefined} className="size-3.5 rounded-xs border border-control" />
					<span data-anatomy={i === 0 ? "5" : undefined} className="truncate font-medium text-ink">{role}</span>
					<span data-anatomy={i === 0 ? "6" : undefined}><Badge variant={v}>{status}</Badge></span>
				</div>
			))}
			<div data-anatomy="8" className="flex h-7 items-center border-t border-line px-3 text-ink-3">3 listings</div>
		</div>
	);
}

const ANATOMY_ROWS = [
	["Junior Product Designer", "Open", "success"],
	["Frontend Engineer", "Closing soon", "warning"],
	["Data Analyst", "Draft", "secondary"],
] as const;
