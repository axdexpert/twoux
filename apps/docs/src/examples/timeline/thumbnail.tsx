import { Timeline, TimelineTrack } from "@twoux/ui";

const TRACKS: TimelineTrack[] = [
	{ id: "a", label: "Payments", events: [{ id: "1", label: "4.12", start: "2026-11-10T00:00", end: "2026-11-11T00:00", status: "ok" }] },
	{ id: "b", label: "Billing", events: [{ id: "2", label: "Freeze", start: "2026-11-11T12:00", end: "2026-11-13T00:00", status: "warn" }] },
	{ id: "c", label: "Search", events: [{ id: "3", label: "Index", start: "2026-11-12T00:00", status: "neutral" }] },
];

/* The real Timeline: three tracks, spans and an instant, with the Now line. */
export default function Thumbnail() {
	return (
		<div className="w-64">
			<Timeline tracks={TRACKS} start="2026-11-09T00:00" end="2026-11-14T00:00" now="2026-11-11T08:00" zooms={["week"]} aria-label="Example" />
		</div>
	);
}
