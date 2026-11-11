import { DateRangePicker, type DateRangeValue, resolveDateRange, formatDateLong } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Range with presets", description: "Pick a preset or two dates. A preset is kept by name, so a saved view still means last 30 days next month.", order: 2 };

export default function Example() {
	const [value, setValue] = useState<DateRangeValue>({ preset: "last-30-days" });
	const { from, to } = resolveDateRange(value);
	return (
		<div className="grid w-80 gap-3">
			<DateRangePicker label="Applied" value={value} onValueChange={setValue} presets maxDays={366} />
			<p className="text-sm text-ink-2">
				{from && to ? <>Showing applications from {formatDateLong(from)} to {formatDateLong(to)}.</> : "Choose a period."}
			</p>
		</div>
	);
}
