import type { ChartSeries } from "@twoux/ui";

/** Fictional data for the Meridian Compute operations console. Figures agree with each other: running instances are the
 *  sum of the limits in use, the region is degraded because two alarms fire and one zone is disrupted. */

const H = 3600e3;
const NOW = Date.now();
export const ago = (hours: number) => new Date(NOW - hours * H);
export const ahead = (hours: number) => new Date(NOW + hours * H);


export const DAYS = Array.from({ length: 15 }, (_, i) => `${i + 1} Nov`);
export const HOURS_SERIES: ChartSeries[] = [
	{ id: "s", label: "standard.small", data: [410, 422, 418, 430, 441, 398, 360, 372, 436, 448, 452, 460, 455, 421, 390] },
	{ id: "m", label: "standard.medium", data: [620, 640, 655, 648, 672, 610, 566, 580, 668, 690, 704, 716, 702, 655, 612] },
	{ id: "c", label: "compute.large", data: [280, 296, 310, 305, 322, 270, 244, 251, 318, 335, 342, 351, 340, 301, 276] },
	{ id: "r", label: "memory.xlarge", data: [150, 150, 158, 162, 170, 148, 140, 142, 166, 174, 180, 186, 182, 160, 148] },
];

export const TIMES = ["00h", "03h", "06h", "09h", "12h", "15h", "18h", "21h"];
export const TRAFFIC_SERIES: ChartSeries[] = [
	{ id: "in", label: "Inbound", data: [38, 27, 92, 154, 161, 149, 84, 52] },
	{ id: "out", label: "Outbound", data: [52, 39, 118, 203, 214, 168, 109, 71] },
	{ id: "int", label: "Internal", data: [96, 88, 141, 207, 211, 176, 129, 104] },
];

export type AlarmState = "In alarm" | "Insufficient data" | "OK";
export type Alarm = { id: string; name: string; state: AlarmState; metric: string; current: string; since: Date; resource: string; runbook: string };
export const ALARMS: Alarm[] = [
	{ id: "a1", name: "cpu-high-web-tier", state: "In alarm", metric: "CPU above 85% for 10 minutes", current: "CPU 93% (6 of 8 hosts)", since: ago(0.2), resource: "web-tier, uk-south-1c", runbook: "#runbook-cpu" },
	{ id: "a2", name: "disk-latency-orders-db", state: "In alarm", metric: "Write latency above 40 ms", current: "Write latency 57 ms", since: ago(0.6), resource: "orders-db primary, uk-south-1c", runbook: "#runbook-disk-latency" },
	{ id: "a3", name: "queue-depth-batch-workers", state: "Insufficient data", metric: "No data for 15 minutes", current: "Last datapoint 18 minutes ago", since: ago(0.3), resource: "batch-workers, uk-south-1a", runbook: "#runbook-missing-data" },
	{ id: "a4", name: "healthy-hosts-checkout", state: "OK", metric: "At least 4 healthy hosts", current: "6 healthy hosts", since: ago(26), resource: "checkout load balancer", runbook: "#runbook-healthy-hosts" },
	{ id: "a5", name: "status-check-cache-01", state: "OK", metric: "Status checks passing", current: "2 of 2 checks passing", since: ago(71), resource: "cache-01, uk-south-1b", runbook: "#runbook-status-checks" },
];

export type Limit = { id: string; name: string; used: number; limit: number };
export const LIMITS: Limit[] = [
	{ id: "std", name: "Running standard instances", used: 900, limit: 920 },
	{ id: "cmp", name: "Running compute instances", used: 312, limit: 600 },
	{ id: "mem", name: "Running memory instances", used: 188, limit: 200 },
	{ id: "gpu", name: "Running accelerated instances", used: 24, limit: 64 },
	{ id: "eip", name: "Elastic IP addresses", used: 11, limit: 50 },
];

export type EventRow = { id: string; instance: string; type: string; status: "Scheduled" | "Ongoing"; starts: Date; ends: Date; note: string };
export const EVENTS: EventRow[] = [
	{ id: "evt-0a71c2", instance: "i-0b42e8", type: "Host maintenance", status: "Ongoing", starts: ago(2), ends: ahead(1), note: "Live migration to a patched host, no action needed" },
	{ id: "evt-0a71d9", instance: "i-09f1a3", type: "Instance retirement", status: "Scheduled", starts: ahead(52), ends: ahead(52), note: "Underlying hardware is being retired, stop and start the instance before this time" },
	{ id: "evt-0a7204", instance: "i-0c88d1", type: "Network maintenance", status: "Scheduled", starts: ahead(27), ends: ahead(29), note: "Brief loss of connectivity expected while a switch is replaced" },
	{ id: "evt-0a7231", instance: "i-0d3a77", type: "System reboot", status: "Scheduled", starts: ahead(76), ends: ahead(76), note: "Reboot to apply a firmware update, instance returns in about 5 minutes" },
	{ id: "evt-0a7248", instance: "i-0e19b0", type: "Host maintenance", status: "Scheduled", starts: ahead(120), ends: ahead(122), note: "Planned maintenance window for the host in zone b" },
];

export type ZoneState = "Operating normally" | "Disrupted";
export const CAPACITY: { zone: string; used: number; state: ZoneState; note?: string }[] = [
	{ zone: "uk-south-1a", used: 86, state: "Operating normally" },
	{ zone: "uk-south-1b", used: 71, state: "Operating normally" },
	{ zone: "uk-south-1c", used: 94, state: "Disrupted", note: "Elevated CPU and disk latency; launches may be slower" },
	{ zone: "uk-south-1d", used: 48, state: "Operating normally" },
];

export const NOTIFICATIONS = [
	{ id: "n1", text: "Alarm cpu-high-web-tier is in alarm", when: ago(0.2) },
	{ id: "n2", text: "Event evt-0a7204 starts in 27 hours", when: ago(1.5) },
	{ id: "n3", text: "You have used 98% of the standard instance limit", when: ago(5) },
];
