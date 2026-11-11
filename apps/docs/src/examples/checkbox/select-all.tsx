import { Checkbox } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Select all", description: "The parent shows indeterminate when only some rows are selected. Clicking it selects all; clicking again clears all.", order: 3 };

const roles = ["Junior Product Designer", "Graduate Data Analyst", "Junior QA Engineer"];

export default function Example() {
	const [sel, setSel] = useState<string[]>([roles[0]]);
	const all = sel.length === roles.length ? true : sel.length ? "indeterminate" : false;
	return (
		<div className="w-72 overflow-hidden rounded-sm border border-line bg-surface">
			<label className="flex h-row cursor-pointer items-center gap-2.5 bg-surface-2 px-3 text-sm font-medium text-ink-2">
				<Checkbox checked={all} onCheckedChange={() => setSel(all === true ? [] : roles)} aria-label="Select all listings" />
				{sel.length ? `${sel.length} of ${roles.length} selected` : "Select all"}
			</label>
			{roles.map((r) => (
				<label key={r} className="flex h-row cursor-pointer items-center gap-2.5 border-t border-line px-3 hover:bg-surface-2">
					<Checkbox checked={sel.includes(r)} onCheckedChange={(v) => setSel((s) => (v ? [...s, r] : s.filter((x) => x !== r)))} />
					{r}
				</label>
			))}
		</div>
	);
}
