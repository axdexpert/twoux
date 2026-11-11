export const install = "";
export const api = [
	{ component: "Timeline", props: [
		{ name: "tracks", type: "{ id, label, events: TimelineEvent[] }[]", description: "One row per track, labelled in a sticky column. Overlapping events in a track stack in lanes. Keep to about 12 tracks." },
		{ name: "TimelineEvent", type: "{ id, label, start, end?, status?, statusLabel? }", description: "With end it is a span, without it an instant (a deploy, a deadline). status is ok, warn, bad or neutral; statusLabel is the word shown in the tooltip, accessible name and table (defaults On track, At risk, Blocked, Planned)." },
		{ name: "start · end", type: "Date | string", description: "The period shown. Events outside it are left out; events that cross an edge are cut at it." },
		{ name: "now", type: "Date | string", description: "Draws a Now line labelled with the time as text, and adds Go to now. Leave out for past periods." },
		{ name: "zoom · defaultZoom · onZoomChange · zooms", type: "\"hour\" | \"day\" | \"week\" | \"month\"", description: "The scale of the ruler. zooms limits the levels in the zoom control; + and − step through them while the timeline has focus. The time at the centre stays in place." },
		{ name: "onSelect · selectedId", type: "(event, track) => void · string | null", description: "Click, Enter or Space on an event. Open the record in a SidePanel and pass its id back as selectedId." },
		{ name: "aria-label · emptyText", type: "string", description: "The accessible name, equal to the visible title; the message when nothing falls in the period." },
	] },
	{ component: "timelineTable", props: [
		{ name: "(tracks)", type: "function", description: "Table view for ChartFrame: track, event, starts, ends and status, in time order." },
	] },
	{ component: "timelineDate", props: [
		{ name: "(date)", type: "function", description: "UK date as the timeline writes it: \"Wed 11 Nov, 09:00\", or the day alone at midnight." },
	] },
];
