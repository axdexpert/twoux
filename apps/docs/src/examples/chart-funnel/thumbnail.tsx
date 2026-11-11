import { Funnel } from "@twoux/ui";

/* The real Funnel with three stages: label, bar on its track, count and the share that moved on. */
export default function Thumbnail() {
	return (
		<div className="w-64">
			<Funnel aria-label="Example" stages={[{ label: "Applied", value: 595 }, { label: "Screened", value: 126 }, { label: "Offered", value: 9 }]} />
		</div>
	);
}
