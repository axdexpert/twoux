import { ColumnsMenu, type ColumnsMenuItem } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Show, hide and reorder columns", description: "Changes apply at once. Drag a handle, use Move up and Move down, or focus a handle, press Space, move with the arrow keys and press Space to drop.", order: 1 };

export default function Example() {
	const [columns, setColumns] = useState<ColumnsMenuItem[]>([
		{ id: "name", label: "Name", type: "text", locked: true },
		{ id: "title", label: "Job title", type: "text" },
		{ id: "company", label: "Company", type: "text" },
		{ id: "size", label: "Company size", type: "number" },
		{ id: "added", label: "Added", type: "date", hidden: true },
		{ id: "fit", label: "Fit score", type: "formula" },
		{ id: "summary", label: "Summarise role", type: "ai" },
		{ id: "email", label: "Work email", type: "enrichment", provider: "hubspot" },
	]);
	return (
		<div className="grid justify-items-start gap-2">
			<ColumnsMenu columns={columns} onChange={setColumns} align="start" />
			<p className="text-sm text-ink-2">Shown, in order: {columns.filter((c) => !c.hidden).map((c) => c.label).join(", ")}</p>
		</div>
	);
}
