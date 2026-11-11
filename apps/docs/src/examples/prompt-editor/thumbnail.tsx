import { Button } from "@twoux/ui";
import { X } from "lucide-react";

/* PromptEditor's prompt box, built with its classes: text with fields as removable chips, then Test on 3 rows.
   The inputs and outputs lists are left out to fit. */
const SEGMENTS: (string | { field: string })[] = ["List 3 requirements in ", { field: "description" }, " for ", { field: "role" }];

export default function Thumbnail() {
	return (
		<div className="grid w-64 gap-3" aria-hidden="true">
			<div className="rounded-sm border border-input bg-surface px-2.5 py-2 text-base leading-7 text-ink shadow-xs">
				{SEGMENTS.map((s) =>
					typeof s === "string" ? (
						<span key={s}>{s}</span>
					) : (
						<span key={s.field} className="mx-0.5 inline-flex h-5.5 items-center gap-1 rounded-xs bg-primary-soft pr-0.5 pl-1.5 align-baseline font-mono text-sm text-primary-ink">
							{s.field}
							<span className="grid size-4 place-items-center rounded-xs"><X className="size-3" aria-hidden="true" /></span>
						</span>
					),
				)}
			</div>
			<div className="flex items-center gap-2">
				<Button variant="outline" size="sm" tabIndex={-1}>Test on 3 rows</Button>
				<span className="text-sm text-ink-3">Before the whole table</span>
			</div>
		</div>
	);
}
