import { DateFilterPill, type DateRangeValue, FilterBar, FilterPill, FilterSummary, dateFilterToValues, describeDateFilter } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "In a filter bar", description: "DateFilterPill sits beside FilterPill and reads as a sentence. Presets and calendar ranges apply at once; typed dates apply on Enter. The value is stored as URL-safe strings.", order: 3 };

const STAGES = [{ value: "screen", label: "Screen", count: 42 }, { value: "interview", label: "Interview", count: 18 }, { value: "offer", label: "Offer", count: 4 }];

export default function Example() {
	const [stages, setStages] = useState(["interview"]);
	const [applied, setApplied] = useState<DateRangeValue>({ preset: "last-30-days" });
	const [closing, setClosing] = useState<DateRangeValue>({});
	const d = describeDateFilter(applied);
	return (
		<div className="grid max-w-full gap-3">
			<FilterBar>
				<FilterPill field="Stage" options={STAGES} selected={stages} onChange={setStages} onRemove={() => setStages([])} />
				<DateFilterPill field="Applied" value={applied} onChange={setApplied} onRemove={() => setApplied({})} />
				<DateFilterPill field="Closing date" value={closing} onChange={setClosing} presets={[]} />
			</FilterBar>
			<FilterSummary shown={12} total={64} noun="candidates" onClear={() => { setStages([]); setApplied({}); setClosing({}); }} />
			<p className="text-sm text-ink-3">
				URL: <code className="tabular">?applied={dateFilterToValues(applied).join(",") || "—"}</code>
				{d && <> · Applied {d.operator} {d.spoken}</>}
			</p>
		</div>
	);
}
