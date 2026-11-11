# Timeline

Scheduled work across a few tracks on one time ruler, such as releases and maintenance per service or hiring campaigns per team. Spans and instants, a labelled Now line, four zoom levels; selecting an event opens it in the side panel.

Kind: component · Group: Data · Status: built, import from @twoux/ui

## When to use

- Seeing what runs in parallel across services, teams or resources, such as release and maintenance windows, and where it overlaps.
- Planning or reviewing phases with a start and an end, such as hiring campaigns per team, with deadlines as instants.

## When not to use

- For what happened, one item after another, in one stream. Use the Agent activity log or a Grouped list.
- For amounts over time. Use the Line chart card or a Bar chart.
- For editing dates by dragging. The Timeline is read-only; change dates in the record's side panel.
- For more than about 12 tracks or when people compare exact dates. Use a List table with start and end columns.

## Structure

1. Toolbar: period, Go to now, zoom
2. Ruler with UK date ticks
3. Sticky track label column
4. Spans (start to end) and instants (diamond)
5. Lanes for overlapping events in a track
6. Now line labelled with the time
7. Tooltip: track, status word, start, end, length

## Guidelines

- Keep to about 12 tracks and one period people plan in, such as two weeks or a quarter.
- Give every event a status word with statusLabel (Done, At risk, Blocked); the tint repeats it, never replaces it.
- Selecting an event opens its record in the SidePanel; pass its id back as selectedId so the timeline marks it.
- Pass now for current and future periods; leave it out for past ones. Go to now appears only when Now is in the period.
- Offer the zoom levels that fit the period with zooms: hour and day for a week, week and month for a quarter.
- Wrap it in ChartFrame for the title, the Table view (timelineTable) and the loading, error and no match states.

## Content

- Dates are UK format, "Wed 11 Nov, 09:00"; the tooltip and table give the full date with zone, as Timestamp does.
- Name tracks with nouns (Payments API, Engineering) and events by what happens (Release 4.13, Database upgrade).

## Accessibility

- 2.1.1 Keyboard and the APG grid: one tab stop, arrow keys move between events, Enter or Space opens one.
- Each event is a gridcell named "Label, track, start to end, status"; each track is a row with a row header.
- 1.4.1 Use of Color: status is a word in the tooltip, accessible name and table view, not the tint alone.
- 1.4.10 Reflow: only the time area scrolls, inside its own box, with the track column sticky.
- 2.1.4 Character Key Shortcuts: + and − zoom only while the timeline has focus.
- 1.1.1 and complex images: a description gives tracks, events, period and current time, and the Table view lists every event.
- 1.4.13 Content on Hover or Focus: the tooltip follows hover and focus and closes with Esc.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the timeline |
| ← → | Previous or next event in the track |
| ↑ ↓ | Nearest event in time on the track above or below |
| Home End | First or last event in the track (with Ctrl, overall) |
| Enter Space | Open the event in the side panel |
| + − | Zoom in or out (off when single-key shortcuts are turned off) |
| Esc | Clear the focused event and hide the tooltip |

## Examples

### hiring-campaigns

```tsx
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
```

### release-schedule

```tsx
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
```

## Related

- Side panel (drawer)
- List table
- Agent activity log
- Timestamp
- Segmented control
- Line chart card
