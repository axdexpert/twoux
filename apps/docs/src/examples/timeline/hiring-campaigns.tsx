import { ChartFrame, ChartStatus, Segment, SegmentedControl, Timeline, TimelineTrack, timelineTable } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Hiring campaign phases by team", description: "A quarter of hiring campaigns at month and week zoom, with closing dates as instants. The state control shows the frame's loading, empty and error states.", order: 2 };

const TRACKS: TimelineTrack[] = [
	{ id: "eng", label: "Engineering", events: [
		{ id: "c1", label: "Sourcing: backend", start: "2026-10-05", end: "2026-10-30", status: "ok", statusLabel: "Done" },
		{ id: "c2", label: "Interviews: backend", start: "2026-10-26", end: "2026-11-27", status: "warn", statusLabel: "Behind plan" },
		{ id: "c3", label: "Offers close", start: "2026-12-04", status: "neutral", statusLabel: "Planned" },
	] },
	{ id: "sales", label: "Sales", events: [
		{ id: "c4", label: "Account executives, London", start: "2026-10-12", end: "2026-12-11", status: "ok", statusLabel: "On track" },
		{ id: "c5", label: "SDR graduate intake", start: "2026-11-16", end: "2026-12-18", status: "neutral", statusLabel: "Planned" },
	] },
	{ id: "support", label: "Customer support", events: [
		{ id: "c6", label: "Weekend cover", start: "2026-10-19", end: "2026-11-13", status: "bad", statusLabel: "Paused" },
		{ id: "c7", label: "Listing closes", start: "2026-11-13", status: "bad", statusLabel: "Paused" },
	] },
	{ id: "finance", label: "Finance", events: [
		{ id: "c8", label: "Financial controller", start: "2026-11-02", end: "2026-12-23", status: "ok", statusLabel: "On track" },
	] },
];

export default function Example() {
	const [state, setState] = useState<ChartStatus>("ready");
	return (
		<div className="grid w-full gap-2">
			<SegmentedControl size="sm" value={state} onValueChange={(v) => setState(v as ChartStatus)} aria-label="Example state" className="justify-self-start">
				<Segment value="ready">Data</Segment><Segment value="loading">Loading</Segment><Segment value="error">Error</Segment>
			</SegmentedControl>
			<ChartFrame className="w-full" title="Hiring campaigns" description="Q4 2026, all teams" status={state} onRetry={() => setState("ready")} table={timelineTable(TRACKS)} height={200}>
				<Timeline tracks={TRACKS} start="2026-10-01" end="2027-01-01" now="2026-11-11T09:00" defaultZoom="week" zooms={["week", "month"]} aria-label="Hiring campaigns" />
			</ChartFrame>
		</div>
	);
}
