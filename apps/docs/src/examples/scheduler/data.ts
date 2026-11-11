import type { SchedulerEvent, SchedulerResource } from "@twoux/ui";

/** Interview week for a Senior Backend Engineer opening. Fixed dates so the demo always shows the same week. */
export const NOW = new Date(2026, 10, 12, 11, 20);

export const INTERVIEWERS: SchedulerResource[] = [
	{ id: "tom", label: "Tom Hughes" },
	{ id: "aisha", label: "Aisha Rahman" },
	{ id: "gareth", label: "Gareth Evans" },
];

const at = (day: number, h: number, m = 0) => new Date(2026, 10, day, h, m).toISOString();

export const INTERVIEWS: SchedulerEvent[] = [
	{ id: "INT-201", title: "Phone screen", detail: "Callum MacLeod", start: at(9, 9, 30), end: at(9, 10), resourceId: "aisha", status: "Confirmed" },
	{ id: "INT-202", title: "Technical interview", detail: "Priya Shah", start: at(9, 13), end: at(9, 14, 30), resourceId: "tom", status: "Confirmed" },
	{ id: "INT-203", title: "Phone screen", detail: "Sophie Turner", start: at(10, 10), end: at(10, 10, 30), resourceId: "aisha", status: "Confirmed" },
	{ id: "INT-204", title: "System design", detail: "Oliver Bennett", start: at(10, 14), end: at(10, 15, 30), resourceId: "gareth", status: "Tentative" },
	{ id: "INT-205", title: "Assessment centre", start: at(11, 0), end: at(11, 23, 59), resourceId: "gareth", allDay: true },
	{ id: "INT-206", title: "Technical interview", detail: "Niamh O'Connor", start: at(11, 9), end: at(11, 10, 30), resourceId: "tom", status: "Confirmed" },
	{ id: "INT-207", title: "Phone screen", detail: "Daniel Okafor", start: at(11, 9, 30), end: at(11, 10), resourceId: "aisha", status: "Confirmed" },
	{ id: "INT-208", title: "Final interview", detail: "Priya Shah", start: at(12, 10), end: at(12, 11), resourceId: "gareth", status: "Confirmed" },
	{ id: "INT-209", title: "Technical interview", detail: "Hannah Price", start: at(12, 13, 30), end: at(12, 15), resourceId: "tom", status: "Awaiting candidate" },
	{ id: "INT-210", title: "Phone screen", detail: "James Whitfield", start: at(12, 14), end: at(12, 14, 30), resourceId: "aisha", status: "Confirmed" },
	{ id: "INT-211", title: "Culture interview", detail: "Fatima Begum", start: at(12, 16), end: at(12, 16, 45), resourceId: "aisha", status: "Tentative" },
	{ id: "INT-212", title: "Final interview", detail: "Niamh O'Connor", start: at(13, 11), end: at(13, 12), resourceId: "gareth", status: "Confirmed" },
	{ id: "INT-213", title: "Hiring debrief", start: at(13, 15), end: at(13, 16), resourceId: "tom", status: "Confirmed" },
	{ id: "INT-214", title: "Phone screen", detail: "Rhys Morgan", start: at(16, 9), end: at(16, 9, 30), resourceId: "aisha", status: "Confirmed" },
	{ id: "INT-215", title: "Technical interview", detail: "Emily Clarke", start: at(17, 10), end: at(17, 11, 30), resourceId: "tom", status: "Tentative" },
	{ id: "INT-216", title: "Phone screen", detail: "Liam Doherty", start: at(18, 15), end: at(18, 15, 30), resourceId: "aisha", status: "Confirmed" },
];

export const STATUS_VARIANT = (s: string) => (s === "Confirmed" ? "success" : s === "Awaiting candidate" ? "warning" : "secondary") as "success" | "warning" | "secondary";
