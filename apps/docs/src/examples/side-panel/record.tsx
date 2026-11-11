import { Badge, Button, PanelMode, SegmentedControl, Segment, SidePanel, Table, TableBody, TableCell, TableRow, Timestamp } from "@twoux/ui";
import { useState } from "react";
import { LISTINGS, STATUS_VARIANT } from "../list-table/data";

export const meta = { title: "Record beside the list", description: "Push mode narrows the table so the first columns stay usable; overlay floats over it. J and K move through records with the panel following; Esc closes and focus returns to the row.", order: 1 };

const ROWS = LISTINGS.slice(0, 6);

export default function Example() {
	const [open, setOpen] = useState<number | null>(1);
	const [mode, setMode] = useState<PanelMode>("push");
	const rec = open === null ? null : ROWS[open];
	return (
		<div className="grid w-full gap-2">
			<SegmentedControl value={mode} onValueChange={(v) => setMode(v as PanelMode)} size="sm" aria-label="Panel mode" className="justify-self-start">
				<Segment value="push">Push</Segment><Segment value="overlay">Overlay</Segment>
			</SegmentedControl>
			<div className="flex h-96 overflow-hidden rounded-sm border border-line bg-surface">
				<div className="min-w-0 flex-1 overflow-auto">
					<Table aria-label="Listings">
						<TableBody>
							{ROWS.map((l, i) => (
								<TableRow key={l.id} data-state={open === i ? "selected" : undefined} tabIndex={0} onClick={() => setOpen(i)} onKeyDown={(e) => { if (e.key === "Enter") setOpen(i); }} className="cursor-default">
									<TableCell className="font-medium text-ink">{l.role}</TableCell>
									<TableCell className="text-ink-2">{l.location}</TableCell>
									<TableCell><Badge variant={STATUS_VARIANT[l.status]} dot>{l.status}</Badge></TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				{rec && (
					<SidePanel
						open={open !== null}
						onOpenChange={(o) => !o && setOpen(null)}
						mode={mode}
						label="Listing details"
						title={rec.role}
						meta={<span className="flex items-center gap-2"><span className="font-mono">{rec.id}</span><Badge variant={STATUS_VARIANT[rec.status]} dot>{rec.status}</Badge></span>}
						position={{ index: open ?? 0, total: ROWS.length }}
						onPrevious={() => setOpen((o) => Math.max(0, (o ?? 0) - 1))}
						onNext={() => setOpen((o) => Math.min(ROWS.length - 1, (o ?? 0) + 1))}
						onOpenFull={() => {}}
						footer={<Button size="sm">Edit listing</Button>}
					>
						<dl className="grid grid-cols-[120px_1fr] gap-x-3 gap-y-2 text-base">
							<dt className="text-ink-2">Location</dt><dd className="text-ink">{rec.location}</dd>
							<dt className="text-ink-2">Applicants</dt><dd className="tabular text-ink">{rec.applicants}</dd>
							<dt className="text-ink-2">Closes</dt><dd><Timestamp value={`${rec.closes}T17:00:00Z`} format="absolute" /></dd>
							<dt className="text-ink-2">Hiring manager</dt><dd><Button variant="link" size="xs">Add</Button></dd>
						</dl>
					</SidePanel>
				)}
			</div>
		</div>
	);
}
