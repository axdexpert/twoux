/** Fictional data for the autonomous coding agent example. */
export type SessionStatus = "working" | "needs-you" | "ready" | "failed";
export type Session = { id: string; title: string; status: SessionStatus; prs?: number; ago: string; unread?: boolean; folder?: string; tags: string[]; ask: string };

export const SESSIONS: Session[] = [
	{ id: "ses_8f3k2m", title: "Fix part-penny rounding in invoice totals", status: "working", prs: 1, ago: "just now", unread: true, folder: "Billing migration", tags: ["billing", "bug"], ask: "Invoice totals are off by a penny when a line has a part-penny VAT amount. Fix it, add tests, and update the blueprint." },
	{ id: "ses_2p9d7q", title: "Move credit notes to the new ledger API", status: "ready", prs: 2, ago: "42 min", unread: true, folder: "Billing migration", tags: ["billing", "migration"], ask: "Move credit notes to the new ledger API behind the ledger-v2 flag." },
	{ id: "ses_6c1w4n", title: "Add retry with backoff to the export worker", status: "needs-you", ago: "2 h", tags: ["exports"], ask: "The export worker drops jobs when the storage service times out. Add retry with backoff." },
	{ id: "ses_4t8h5v", title: "Replace the date picker in the booking form", status: "ready", prs: 1, ago: "5 h", tags: ["booking", "ui"], ask: "Swap the legacy date picker for the shared one and keep the range rules." },
	{ id: "ses_9r2b6x", title: "Upgrade the queue client to v4", status: "failed", ago: "Yesterday", tags: ["deps"], ask: "Upgrade the queue client to v4 and fix the breaking changes." },
	{ id: "ses_1m7z3j", title: "Document the webhook signing scheme", status: "ready", prs: 1, ago: "2 days", tags: ["docs"], ask: "Write up the webhook signing scheme for the partner docs." },
];

export const FOLDERS = ["Billing migration", "Platform", "Docs"];

export type FileChange = { path: string; add: number; del: number; diff?: { code: string; added: number[]; removed: number[]; start: number } };

const ROUND_DIFF = `export function roundLine(net: number, vatRate: number): number {
  const vat = net * vatRate;
  return net + Math.round(vat * 100) / 100;
  return net + roundHalfEven(vat * 100) / 100;
}`;
const TEST_DIFF = `describe("roundLine", () => {
  it("rounds a half penny to the even penny", () => {
    expect(roundLine(10.25, 0.2)).toBe(12.3);
  });
  it("keeps whole pennies as they are", () => {
    expect(roundLine(10, 0.2)).toBe(12);
  });
});`;

export const FILES: FileChange[] = [
	{ path: "src/billing/round.ts", add: 48, del: 12, diff: { code: ROUND_DIFF, added: [4], removed: [3], start: 14 } },
	{ path: "src/billing/invoice.ts", add: 31, del: 19 },
	{ path: "src/billing/totals.ts", add: 22, del: 8 },
	{ path: "src/billing/round.test.ts", add: 96, del: 0, diff: { code: TEST_DIFF, added: [1, 2, 3, 4, 5, 6, 7, 8], removed: [], start: 1 } },
	{ path: "src/billing/invoice.test.ts", add: 64, del: 21 },
	{ path: "fixtures/part-pennies.json", add: 112, del: 0 },
	{ path: "docs/blueprint/billing.md", add: 20, del: 34 },
];

export const CHECKS: { name: string; state: "pass" | "fail"; detail: string; optional?: boolean }[] = [
	{ name: "Lint", state: "pass", detail: "41 s" },
	{ name: "Unit tests", state: "pass", detail: "7 of 7 in the billing suite, 2 min 8 s" },
	{ name: "Build", state: "pass", detail: "1 min 52 s" },
	{ name: "Accessibility snapshot", state: "fail", detail: "1 contrast warning in the invoice preview", optional: true },
];

export const REVIEWERS: { name: string; state: "Approved" | "Requested" }[] = [
	{ name: "Anita Okafor", state: "Approved" },
	{ name: "Tomasz Brandt", state: "Requested" },
];

export const TESTS = [
	"Rounds a half penny to the even penny",
	"Keeps whole pennies as they are",
	"Sums line totals after rounding each line",
	"Rounds negative credit lines the same way",
	"Handles a zero-rated line",
	"Matches the finance fixtures for all 24 invoices",
	"Leaves already issued invoices unchanged",
];

export const REPORT_LOG = `PASS  src/billing/round.test.ts (7 tests)
PASS  src/billing/invoice.test.ts (12 tests)
Fixtures  24 of 24 invoices match the finance totals
Tests     7 passed, 0 failed
Time      2.1 s`;

export type Severity = "high" | "medium" | "event" | "value";
export const SEVERITY: Record<Severity, { label: string; badge: "destructive" | "warning" | "default" | "success" }> = {
	high: { label: "High impact issue", badge: "destructive" },
	medium: { label: "Medium issue", badge: "warning" },
	event: { label: "Significant event", badge: "default" },
	value: { label: "Value provided", badge: "success" },
};

export const INSIGHTS: { at: string; sev: Severity; title: string; detail: string }[] = [
	{ at: "00:00", sev: "event", title: "Session started from your request", detail: "The agent read the invoice module and the billing blueprint." },
	{ at: "00:09", sev: "value", title: "Found the cause", detail: "Each line was rounded half up, so a half penny rounded the wrong way on credit lines." },
	{ at: "00:21", sev: "medium", title: "One fixture disagreed with finance", detail: "Invoice INV-2041 differed by 1p. The agent checked the finance export and corrected the fixture." },
	{ at: "00:34", sev: "event", title: "Ran the billing suite", detail: "7 of 7 tests passed on the second run." },
	{ at: "00:47", sev: "high", title: "Blueprint disagrees with the code", detail: "The blueprint says totals round once at the end. The code rounds per line. The agent proposed a change to the blueprint instead of editing it." },
	{ at: "01:02", sev: "value", title: "Opened a pull request", detail: "7 files, +393 −94, all required checks passed." },
	{ at: "01:05", sev: "event", title: "Asked you a question", detail: "Which rounding rule should apply to credit notes. The agent paused that part and carried on with the rest." },
	{ at: "01:12", sev: "medium", title: "Optional accessibility check failed", detail: "A contrast warning in the invoice preview, not caused by this change." },
	{ at: "01:18", sev: "value", title: "Ready for review", detail: "Waiting on your decision about the blueprint and the rounding rule." },
];

export const ANSWER =
	"The totals were wrong because each line was rounded half up, so credit lines drifted by a penny. I now round each line to the even penny and sum the rounded lines. All 7 tests pass and the 24 finance fixtures match. The blueprint says totals round once at the end, which the code never did, so I have proposed a change to it rather than editing it myself. I also need one decision from you about credit notes.";

export const SHORTCUTS = [
	{ title: "Session", items: [{ keys: ["⌘", "K"], action: "Search sessions" }, { keys: ["⌘", "↵"], action: "Send message" }, { keys: ["Esc"], action: "Stop the agent" }, { keys: ["⌘", "⇧", "F"], action: "Focus mode" }] },
	{ title: "Help", items: [{ keys: ["?"], action: "Show this list" }] },
];
