import { Button, FilterPanel, type FilterSection, Table, TableBody, TableCell, TableRow, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Search candidates by many fields", description: "Sections collapse and show how many values are set. Each option shows its count. The footer says what the main action will affect.", order: 1 };

const PEOPLE = [
	{ name: "Amara Okafor", stage: "Screen", source: "Referral", location: "Leeds" },
	{ name: "Tom Becker", stage: "Applied", source: "Job board", location: "Manchester" },
	{ name: "Priya Shah", stage: "Interview", source: "Careers page", location: "London" },
	{ name: "Liam Walsh", stage: "Applied", source: "Job board", location: "Leeds" },
	{ name: "Sofia Romano", stage: "Offer", source: "Agency", location: "Remote (UK)" },
	{ name: "Hana Kim", stage: "Screen", source: "Job board", location: "Glasgow" },
];
type K = "stage" | "source" | "location";

export default function Example() {
	const [value, setValue] = useState<Record<string, string[]>>({ stage: ["Applied", "Screen"] });
	const match = (p: (typeof PEOPLE)[number], skip?: K) => (Object.entries(value) as [K, string[]][]).every(([k, v]) => k === skip || !v.length || v.includes(p[k]));
	const rows = PEOPLE.filter((p) => match(p));
	const section = (id: K, title: string, open?: boolean): FilterSection => ({ id, title, defaultOpen: open, options: [...new Set(PEOPLE.map((p) => p[id]))].sort().map((v) => ({ value: v, label: v, count: PEOPLE.filter((p) => match(p, id) && p[id] === v).length })) });
	return (
		<div className="grid h-96 w-full grid-cols-[240px_1fr] overflow-hidden rounded-sm border border-line bg-surface max-md:grid-cols-1">
			<FilterPanel className="border-r border-line" value={value} onChange={setValue} sections={[section("stage", "Stage", true), section("source", "Source", true), section("location", "Location")]} />
			<div className="flex min-h-0 flex-col">
				<div className="min-h-0 flex-1 overflow-auto">
					<Table aria-label="Candidates"><TableBody>{rows.map((p) => <TableRow key={p.name}><TableCell className="font-medium text-ink">{p.name}</TableCell><TableCell className="text-ink-2">{p.stage}</TableCell><TableCell className="text-ink-2">{p.location}</TableCell></TableRow>)}</TableBody></Table>
				</div>
				<div className="flex items-center justify-between gap-2 border-t border-line px-3 py-2">
					<span className="tabular text-sm text-ink-2" aria-live="polite">Showing {rows.length} of {PEOPLE.length} candidates</span>
					<Button size="sm" disabled={!rows.length} onClick={() => toast.success(`Added ${rows.length} to the pipeline`)}>Add {rows.length} to pipeline</Button>
				</div>
			</div>
		</div>
	);
}
