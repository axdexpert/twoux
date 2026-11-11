import { Badge, Button, ChartFrame, SidePanel, Timeline, TimelineEvent, TimelineTrack, timelineDate, timelineTable } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Releases and maintenance by service", description: "Two weeks of releases, maintenance windows and freezes across five services. Select an event, or press Enter on it, to open it in the side panel; + and − zoom.", order: 1 };

const TRACKS: TimelineTrack[] = [
	{ id: "payments", label: "Payments API", events: [
		{ id: "REL-412", label: "Release 4.12", start: "2026-11-10T09:00", end: "2026-11-10T11:00", status: "ok", statusLabel: "Done" },
		{ id: "MNT-88", label: "Database upgrade", start: "2026-11-12T22:00", end: "2026-11-13T02:00", status: "warn", statusLabel: "At risk" },
		{ id: "REL-413", label: "Release 4.13", start: "2026-11-17T09:00", end: "2026-11-17T10:30", status: "neutral" },
	] },
	{ id: "billing", label: "Billing", events: [
		{ id: "FRZ-11", label: "Month-end freeze", start: "2026-11-16T00:00", end: "2026-11-19T00:00", status: "neutral", statusLabel: "Scheduled" },
		{ id: "REL-207", label: "Invoice PDF fix", start: "2026-11-11T13:00", status: "ok", statusLabel: "Deployed" },
	] },
	{ id: "auth", label: "Identity", events: [
		{ id: "MNT-91", label: "Certificate rotation", start: "2026-11-11T06:00", end: "2026-11-11T08:00", status: "ok", statusLabel: "Done" },
		{ id: "REL-330", label: "SSO for Okta", start: "2026-11-11T12:00", end: "2026-11-12T18:00", status: "bad", statusLabel: "Blocked" },
	] },
	{ id: "search", label: "Search", events: [
		{ id: "MNT-93", label: "Index rebuild", start: "2026-11-14T01:00", end: "2026-11-14T07:00", status: "neutral" },
		{ id: "REL-119", label: "Ranking change", start: "2026-11-18T10:00", status: "warn", statusLabel: "Needs review" },
	] },
	{ id: "web", label: "Web app", events: [
		{ id: "REL-905", label: "Weekly release", start: "2026-11-12T10:00", end: "2026-11-12T12:00", status: "ok", statusLabel: "On track" },
		{ id: "REL-906", label: "Weekly release", start: "2026-11-19T10:00", end: "2026-11-19T12:00", status: "neutral" },
	] },
];
const VARIANT = { ok: "success", warn: "warning", bad: "destructive", neutral: "secondary" } as const;

export default function Example() {
	const [open, setOpen] = useState<{ e: TimelineEvent; track: string } | null>(null);
	return (
		<div className="flex w-full overflow-hidden rounded-sm border border-line bg-surface">
			<div className="min-w-0 flex-1 p-3">
				<ChartFrame className="w-full" title="Releases and maintenance" description="All services, 9 to 22 November" table={timelineTable(TRACKS)} height={260}>
					<Timeline
						tracks={TRACKS}
						start="2026-11-09T00:00"
						end="2026-11-23T00:00"
						now="2026-11-11T14:30"
						defaultZoom="day"
						zooms={["hour", "day", "week"]}
						selectedId={open?.e.id ?? null}
						onSelect={(e, t) => setOpen({ e, track: t.label })}
						aria-label="Releases and maintenance"
					/>
				</ChartFrame>
			</div>
			{open && (
				<SidePanel
					open
					onOpenChange={(o) => !o && setOpen(null)}
					label="Change details"
					title={open.e.label}
					meta={<span className="flex items-center gap-2"><span className="font-mono">{open.e.id}</span><Badge variant={VARIANT[open.e.status ?? "neutral"]}>{open.e.statusLabel ?? "Planned"}</Badge></span>}
					footer={<Button size="sm">Edit change</Button>}
				>
					<dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-base">
						<dt className="text-ink-2">Service</dt><dd className="text-ink">{open.track}</dd>
						<dt className="text-ink-2">Starts</dt><dd className="text-ink">{timelineDate(new Date(open.e.start))}</dd>
						<dt className="text-ink-2">Ends</dt><dd className="text-ink">{open.e.end ? timelineDate(new Date(open.e.end)) : "Same time"}</dd>
					</dl>
				</SidePanel>
			)}
		</div>
	);
}
