import type React from "react";
import { seriesColor } from "@twoux/ui";

export const meta = { title: "The validated chart palette", description: "Categorical colours in fixed order (never cycled), the one-hue ordinal ramp for amounts, and status colours kept for status. Text never takes a series colour.", order: 1 };

const NAMES = ["Indigo", "Orange", "Teal", "Amber", "Magenta", "Green", "Blue", "Red"];

export default function Example() {
	return (
		<div className="grid w-full gap-5">
			<section className="grid gap-2">
				<h3 className="text-base font-semibold text-ink">Categorical, in this order</h3>
				<ol className="grid grid-cols-8 gap-1.5 max-md:grid-cols-4">
					{NAMES.map((n, i) => (
						<li key={n} className="grid gap-1">
							<span className="h-10 rounded-xs bg-(--c)" style={{ "--c": seriesColor(i) } as React.CSSProperties} />
							<span className="text-sm text-ink"><span className="tabular text-ink-3">{i + 1}</span> {n}</span>
						</li>
					))}
				</ol>
				<p className="text-sm text-ink-2">Scatter and categorical heatmaps use only 1 to 3. A 9th series folds into Other.</p>
			</section>
			<section className="grid gap-2">
				<h3 className="text-base font-semibold text-ink">Ordinal, for amounts</h3>
				<div className="flex gap-1">{["bg-q1", "bg-q2", "bg-q3", "bg-q4", "bg-q5"].map((c) => <span key={c} className={`h-6 flex-1 rounded-xs ${c}`} />)}</div>
				<p className="flex justify-between text-sm text-ink-3"><span>Fewer</span><span>More</span></p>
			</section>
		</div>
	);
}
