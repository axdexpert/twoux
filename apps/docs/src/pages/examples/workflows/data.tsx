import type { DiffLine, FlowDirection, FlowStep, FlowValue, SimulationCase } from "@twoux/ui";
import { ArrowRightLeft, CalendarClock, CircleStop, Clock, Hourglass, Inbox, ListTodo, Mail, MessageSquare, ScanSearch, Split, UserCheck, UserCog } from "lucide-react";
import type { ReactNode } from "react";

/* Workflows for a UK hiring team. Steps never decide about candidates on their own: a person reviews every rejection. */

export type StepTypeId = "application" | "stage" | "schedule" | "screen" | "email" | "offer" | "update" | "slack" | "task" | "condition" | "wait" | "review" | "end";
export type StepType = { id: StepTypeId; kind: FlowStep["kind"]; label: string; title: string; group: "Triggers" | "Actions" | "Logic"; icon: ReactNode; summary: string; issue?: string; reaches?: string; hint: string };

export const STEP_TYPES: StepType[] = [
	{ id: "application", kind: "trigger", group: "Triggers", label: "Application received", title: "New application", icon: <Inbox />, summary: "Any Live listing", hint: "Starts when someone applies to a listing" },
	{ id: "stage", kind: "trigger", group: "Triggers", label: "Candidate moved to stage", title: "Moved to stage", icon: <ArrowRightLeft />, summary: "Any stage", hint: "Starts when a candidate changes stage" },
	{ id: "schedule", kind: "trigger", group: "Triggers", label: "On a schedule", title: "Every Monday at 08:00", icon: <Clock />, summary: "Times in GMT", hint: "Starts at set times" },
	{ id: "screen", kind: "action", group: "Actions", label: "Screen CV", title: "Screen CV", icon: <ScanSearch />, summary: "Reads the CV against the listing's must-haves and writes a summary", hint: "The assistant summarises; it never rejects" },
	{ id: "email", kind: "action", group: "Actions", label: "Send email", title: "Send email", icon: <Mail />, summary: "To the candidate", issue: "choose an email template", reaches: "Emails the candidate", hint: "Sends an email from a template" },
	{ id: "offer", kind: "action", group: "Actions", label: "Offer interview times", title: "Offer interview times", icon: <CalendarClock />, summary: "Free times from the interviewer's calendar", issue: "choose an interviewer", reaches: "Emails the candidate", hint: "Lets the candidate pick a time" },
	{ id: "update", kind: "action", group: "Actions", label: "Update candidate", title: "Update candidate", icon: <UserCog />, summary: "Change stage, tags or owner", hint: "Changes the candidate record" },
	{ id: "slack", kind: "action", group: "Actions", label: "Post to Slack", title: "Post to Slack", icon: <MessageSquare />, summary: "#hiring", reaches: "Posts in Slack", hint: "Posts a message in a channel" },
	{ id: "task", kind: "action", group: "Actions", label: "Create task", title: "Create task", icon: <ListTodo />, summary: "For the listing's recruiter", hint: "Adds a task to someone's Inbox" },
	{ id: "condition", kind: "condition", group: "Logic", label: "Condition", title: "Condition", icon: <Split />, summary: "", issue: "say what to check", hint: "Splits into Yes and No" },
	{ id: "wait", kind: "action", group: "Logic", label: "Wait", title: "Wait 3 days", icon: <Hourglass />, summary: "Then carries on", hint: "Pauses before the next step" },
	{ id: "review", kind: "review", group: "Logic", label: "Recruiter review", title: "Recruiter review", icon: <UserCheck />, summary: "Waits in the recruiter's Inbox until they decide", hint: "A person decides before anything else happens" },
	{ id: "end", kind: "end", group: "Logic", label: "End", title: "End", icon: <CircleStop />, summary: "The workflow stops here", hint: "Ends this path" },
];
export const TYPE = Object.fromEntries(STEP_TYPES.map((t) => [t.id, t])) as Record<StepTypeId, StepType>;

/** A step with its type's icon and words; `over` sets what differs. */
export const step = (id: string, type: StepTypeId, x: number, y: number, over: Partial<FlowStep> = {}): FlowStep & { typeId: StepTypeId } => {
	const t = TYPE[type];
	return { id, typeId: type, kind: t.kind, type: t.label, title: t.title, summary: t.summary || undefined, icon: t.icon, position: { x, y }, issue: t.issue, reaches: t.reaches, ...over };
};
export type Step = ReturnType<typeof step>;
export type Flow = Omit<FlowValue, "steps"> & { steps: Step[]; direction?: FlowDirection };

const SCREEN: Flow = {
	steps: [
		step("t1", "application", 0, 0, { title: "New application", summary: "Live listings in Leeds, Manchester and Remote (UK)" }),
		step("s1", "screen", 0, 176, { title: "Screen CV against must-haves" }),
		step("c1", "condition", 0, 368, { title: "Meets every must-have?", summary: "From Screen CV", issue: undefined }),
		step("o1", "offer", -176, 568, { summary: "Two 45-minute times with the hiring manager, this week or next", issue: undefined }),
		step("u1", "update", -176, 768, { title: "Move to Interview", summary: "Stage: Interview" }),
		step("n1", "slack", -176, 952, { title: "Tell #hiring" }),
		step("r1", "review", 176, 568, { summary: "Goes to the recruiter's Inbox with the screening summary. Nothing is sent to the candidate." }),
		step("e1", "end", 0, 1136),
	],
	links: [
		{ id: "t1-out-s1", from: "t1", to: "s1" },
		{ id: "s1-out-c1", from: "s1", to: "c1" },
		{ id: "c1-yes-o1", from: "c1", to: "o1", branch: "yes" },
		{ id: "c1-no-r1", from: "c1", to: "r1", branch: "no" },
		{ id: "o1-out-u1", from: "o1", to: "u1" },
		{ id: "u1-out-n1", from: "u1", to: "n1" },
		{ id: "n1-out-e1", from: "n1", to: "e1" },
		{ id: "r1-out-e1", from: "r1", to: "e1" },
	],
};

const simple = (trigger: StepTypeId, triggerTitle: string, action: StepTypeId, actionTitle: string, extra: Partial<FlowStep> = {}): Flow => ({
	steps: [step("t1", trigger, 0, 0, { title: triggerTitle }), step("a1", action, 0, 176, { title: actionTitle, ...extra }), step("e1", "end", 0, 352)],
	links: [{ id: "t1-out-a1", from: "t1", to: "a1" }, { id: "a1-out-e1", from: "a1", to: "e1" }],
});

export type WorkflowStatus = "Live" | "Off" | "Draft" | "Needs attention";
export type Workflow = { id: string; name: string; description: string; status: WorkflowStatus; trigger: string; lastRun?: { at: Date; outcome: "Succeeded" | "Failed"; note?: string }; runs7d: number; owner: string; flow: Flow; published: boolean; savedAt: Date };

const ago = (min: number) => new Date(Date.now() - min * 60_000);

export const WORKFLOWS: Workflow[] = [
	{ id: "WF-201", name: "Screen new applications", description: "Screens CVs, offers interviews to strong matches, sends the rest to a recruiter", status: "Live", trigger: "Application received", lastRun: { at: ago(12), outcome: "Succeeded" }, runs7d: 214, owner: "Priya Shah", flow: SCREEN, published: true, savedAt: ago(60 * 26) },
	{ id: "WF-198", name: "Interview reminders", description: "Emails candidates and interviewers the day before", status: "Live", trigger: "On a schedule", lastRun: { at: ago(130), outcome: "Succeeded" }, runs7d: 96, owner: "Tom Hughes", flow: simple("schedule", "Every day at 09:00", "email", "Send reminder", { issue: undefined, summary: "Template: Interview tomorrow" }), published: true, savedAt: ago(60 * 24 * 9) },
	{ id: "WF-194", name: "Rejection drafts for review", description: "Drafts a rejection email when a recruiter moves someone to Rejected", status: "Needs attention", trigger: "Candidate moved to stage", lastRun: { at: ago(55), outcome: "Failed", note: "Slack connection expired" }, runs7d: 31, owner: "Priya Shah", flow: simple("stage", "Moved to Rejected", "task", "Ask the recruiter to send the draft"), published: true, savedAt: ago(60 * 24 * 3) },
	{ id: "WF-190", name: "Weekly pipeline digest", description: "Posts open roles and stage counts to #hiring", status: "Live", trigger: "On a schedule", lastRun: { at: ago(60 * 24 * 2), outcome: "Succeeded" }, runs7d: 1, owner: "Gareth Evans", flow: simple("schedule", "Every Monday at 08:00", "slack", "Post the digest"), published: true, savedAt: ago(60 * 24 * 20) },
	{ id: "WF-187", name: "Hand-off to people team", description: "Creates an onboarding task when an offer is accepted", status: "Live", trigger: "Candidate moved to stage", lastRun: { at: ago(60 * 7), outcome: "Succeeded" }, runs7d: 6, owner: "Imogen Hart", flow: simple("stage", "Moved to Hired", "task", "Start onboarding"), published: true, savedAt: ago(60 * 24 * 40) },
	{ id: "WF-183", name: "Re-engage silver medallists", description: "Suggests past finalists for new listings in the same team", status: "Off", trigger: "Application received", lastRun: { at: ago(60 * 24 * 18), outcome: "Succeeded" }, runs7d: 0, owner: "Tom Hughes", flow: simple("application", "New listing published", "task", "Suggest past finalists"), published: true, savedAt: ago(60 * 24 * 30) },
	{ id: "WF-205", name: "Reference requests", description: "Asks referees for a reference once an offer is made", status: "Draft", trigger: "Candidate moved to stage", runs7d: 0, owner: "Imogen Hart", flow: simple("stage", "Moved to Offer", "email", "Email each referee", { reaches: "Emails people outside the workspace" }), published: false, savedAt: ago(40) },
];

export const OWNERS = ["Priya Shah", "Tom Hughes", "Gareth Evans", "Imogen Hart"];
export const TEMPLATES = ["Interview invitation", "Interview tomorrow", "Application received", "Reference request", "Reminder: choose an interview time"];
export const INTERVIEWERS = ["Gareth Evans (hiring manager)", "Tom Hughes", "Priya Shah"];

/* ---------------------------------------------------------------- test run with sample data */

export const SAMPLE = { name: "Amara Okafor", listing: "Junior Product Designer · L-1040 · Leeds", applied: "11 November 2026, 09:14 GMT" };

/** What each step does with the sample application. "skip" steps would reach someone outside the workspace. */
export const TEST_RESULT: Record<string, { state: "done" | "skipped"; note: string; output?: [string, string][] }> = {
	t1: { state: "done", note: "1 application", output: [["Candidate", SAMPLE.name], ["Listing", SAMPLE.listing], ["Applied", SAMPLE.applied]] },
	s1: { state: "done", note: "4 of 4 must-haves met", output: [["Portfolio", "Met: 3 case studies linked"], ["Figma", "Met: 2 years"], ["Right to work in the UK", "Met: stated on the form"], ["Research", "Met: usability testing at Northwind"]] },
	c1: { state: "done", note: "Yes", output: [["Result", "Yes, every must-have met"]] },
	o1: { state: "skipped", note: "Skipped in test: emails the candidate", output: [["Would offer", "Thu 12 Nov 10:00–10:45, Fri 13 Nov 14:00–14:45"], ["Interviewer", "Gareth Evans"]] },
	u1: { state: "done", note: "Stage set on a test copy", output: [["Stage", "Applied → Interview"], ["Record", "Test copy, not the real candidate"]] },
	n1: { state: "skipped", note: "Skipped in test: posts in Slack", output: [["Would post", "Amara Okafor moved to Interview for Junior Product Designer"]] },
	r1: { state: "skipped", note: "Not on this path" },
	e1: { state: "done", note: "Finished" },
};

/* ---------------------------------------------------------------- assistant proposals */

export const SUGGESTIONS = ["Remind candidates who haven't chosen a time after 3 days", "Reject candidates who miss a must-have"];

export const REMINDER_DIFF: DiffLine[] = [
	{ type: "ctx", text: "Offer interview times" },
	{ type: "add", text: "Wait 3 days" },
	{ type: "add", text: "Condition: Still no time chosen?" },
	{ type: "add", text: "  Yes → Send reminder (template: Reminder: choose an interview time)" },
	{ type: "add", text: "  No  → Move to Interview" },
	{ type: "del", text: "Offer interview times → Move to Interview" },
	{ type: "ctx", text: "Move to Interview" },
];

export const REMINDER_SIM: SimulationCase[] = [
	{ name: "Chose a time on day 1", status: "pass", detail: "No reminder sent" },
	{ name: "Chose a time on day 3", status: "pass", detail: "No reminder sent" },
	{ name: "Didn't choose a time", status: "pass", detail: "1 reminder on day 4" },
	{ name: "Withdrew before day 3", status: "pass", detail: "Stops: candidate no longer active" },
	{ name: "Times no longer free on day 4", status: "fail", detail: "The reminder links to times that have gone. Offer new times instead of a reminder." },
];

/** Apply the reminder proposal: wait, check, remind; Move to Interview now follows a chosen time. */
export function withReminder(flow: Flow): Flow {
	const o1 = flow.steps.find((s) => s.id === "o1");
	const u1 = flow.steps.find((s) => s.id === "u1");
	if (!o1 || !u1) return flow;
	const x = o1.position.x;
	const y = o1.position.y;
	const shift = 400;
	const moved = flow.steps.map((s) => (s.position.y > y ? { ...s, position: { ...s.position, y: s.position.y + shift } } : s));
	return {
		steps: [
			...moved,
			step("w1", "wait", x, y + 192, { title: "Wait 3 days", summary: "From when the times were sent" }),
			step("c2", "condition", x, y + 376, { title: "Still no time chosen?", summary: "From Offer interview times", issue: undefined }),
			step("m1", "email", x - 352, y + 576, { title: "Send reminder", summary: "Template: Reminder: choose an interview time", issue: undefined }),
		],
		links: [
			...flow.links.filter((l) => !(l.from === "o1" && l.to === "u1")),
			{ id: "o1-out-w1", from: "o1", to: "w1" },
			{ id: "w1-out-c2", from: "w1", to: "c2" },
			{ id: "c2-yes-m1", from: "c2", to: "m1", branch: "yes" },
			{ id: "c2-no-u1", from: "c2", to: "u1", branch: "no" },
		],
	};
}

/** For an empty workflow, the assistant drafts the screening flow from the description. */
export const STARTER = SCREEN;
export const STARTER_DIFF: DiffLine[] = [
	{ type: "add", text: "Trigger: New application (Live listings)" },
	{ type: "add", text: "Screen CV against must-haves" },
	{ type: "add", text: "Condition: Meets every must-have?" },
	{ type: "add", text: "  Yes → Offer interview times → Move to Interview → Tell #hiring" },
	{ type: "add", text: "  No  → Recruiter review" },
	{ type: "add", text: "End" },
];
