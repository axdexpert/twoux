import { SheetGrid, type SheetColumn, type SheetRow, type SheetSort } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Prospects with computed columns", description: "Focus a cell and use the arrow keys. Enter edits, Esc cancels, Tab saves and moves on. Press Up from the first row to reach the headers, then Enter for the column menu. Enter on a failed cell runs it again.", order: 1 };

const COLUMNS: SheetColumn[] = [
	{ id: "name", label: "Name", type: "text", width: 160, pinned: true, locked: true },
	{ id: "title", label: "Job title", type: "text", width: 200 },
	{ id: "seniority", label: "Seniority", type: "select", width: 120, options: ["Mid", "Senior", "Director", "VP"] },
	{ id: "size", label: "Company size", type: "number", width: 130 },
	{ id: "summary", label: "Summarise role", type: "ai", width: 260, costPerRow: 1, status: { done: 3, total: 5, running: true } },
	{ id: "email", label: "Work email", type: "enrichment", provider: "hubspot", width: 230, costPerRow: 0.5, status: { done: 5, total: 5, errors: 1 } },
];

export default function Example() {
	const [columns, setColumns] = useState(COLUMNS);
	const [sort, setSort] = useState<SheetSort>(null);
	const [rows, setRows] = useState<SheetRow[]>([
		{ id: "1", values: { name: "Ana Silva", title: "Head of Revenue Operations", seniority: "Senior", size: 240 }, computed: { summary: { state: "done", value: "Leads a function; shortlists tools." }, email: { state: "done", value: "ana.silva@harbourvale.co.uk" } } },
		{ id: "2", values: { name: "Ben Hughes", title: "Chief Operating Officer", seniority: "VP", size: 160 }, computed: { summary: { state: "done", value: "Runs the business; owns the budget." }, email: { state: "not-found" } } },
		{ id: "3", values: { name: "Chloe Patel", title: "", seniority: "Mid", size: 410 }, computed: { summary: { state: "failed", reason: "Job title is empty." }, email: { state: "done", value: "chloe.patel@mosaiclending.co.uk" } } },
		{ id: "4", values: { name: "Daniel Murray", title: "IT Director", seniority: "Director", size: 1200 }, computed: { summary: { state: "writing" }, email: { state: "failed", reason: "No company domain." } } },
		{ id: "5", values: { name: "Ella Brennan", title: "Operations Manager", seniority: "Mid", size: 130 }, computed: { summary: { state: "queued" }, email: { state: "done", value: "ella.brennan@orrin.dev" } } },
	]);
	return (
		<SheetGrid
			aria-label="Prospects"
			className="h-96 w-full"
			columns={columns}
			onColumnsChange={setColumns}
			rows={rows}
			onCellChange={(id, col, v) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, values: { ...r.values, [col]: v } } : r)))}
			sort={sort}
			onSortChange={setSort}
			onRetryCell={(id, col) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, computed: { ...r.computed, [col]: { state: "queued" } } } : r)))}
			onAddRows={(n) => setRows((rs) => [...rs, ...Array.from({ length: n }, (_, i) => ({ id: `n${rs.length + i}`, values: {} }))])}
		/>
	);
}
