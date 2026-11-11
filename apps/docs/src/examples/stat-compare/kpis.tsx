import { StatCompare } from "@twoux/ui";

export const meta = { title: "Key numbers", description: "One number, its change against a named period, and whether that change is good, said in colour and in words. Time to hire going down is good; applications going down is not.", order: 1 };

export default function Example() {
	return (
		<div className="grid w-full grid-cols-3 gap-3 max-md:grid-cols-1">
			{[
				{ label: "Applications this month", value: "595", change: "+12%", period: "October", good: true, spark: [42, 48, 51, 47, 55, 60, 58, 66] },
				{ label: "Median time to hire", value: "23 days", change: "-4 days", period: "last quarter", good: true, spark: [31, 30, 29, 27, 27, 25, 24, 23] },
				{ label: "Offer acceptance", value: "71%", change: "-6 pts", period: "last quarter", good: false, spark: [80, 79, 77, 78, 75, 74, 72, 71] },
			].map((s) => (
				<div key={s.label} className="rounded-sm border border-line bg-surface p-4 shadow-card"><StatCompare {...s} /></div>
			))}
		</div>
	);
}
