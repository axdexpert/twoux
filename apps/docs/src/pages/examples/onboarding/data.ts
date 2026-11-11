/** Fictional data for the onboarding example (TwoUX). */
import type { Connector, ProviderId, Template } from "@twoux/ui";
import { Briefcase, CircleEllipsis, Headset, Megaphone, Receipt, Search, Settings2, Users, type LucideIcon } from "lucide-react";

export const SSO_DOMAINS = ["twoux.example"];
/** An address that signs in with Google, to show the error case. */
export const GOOGLE_DOMAIN = "harbourline.example";

export type UseCase = { id: string; label: string; icon: LucideIcon };
export const USE_CASES: UseCase[] = [
	{ id: "sales", label: "Sales follow-up", icon: Briefcase },
	{ id: "support", label: "Customer support", icon: Headset },
	{ id: "recruiting", label: "Recruiting", icon: Users },
	{ id: "finance", label: "Finance and reporting", icon: Receipt },
	{ id: "operations", label: "Operations", icon: Settings2 },
	{ id: "marketing", label: "Marketing", icon: Megaphone },
	{ id: "research", label: "Research", icon: Search },
	{ id: "other", label: "Something else", icon: CircleEllipsis },
];

/** What each connection adds, who it is shared with and how it connects. */
export type ConnectorMeta = { method: "oauth" | "apikey"; scope: string };
export const CONNECTORS: Connector[] = [
	{ id: "gmail", provider: "gmail", connected: true, can: ["Read and search email", "Draft replies for you to send", "Label and archive messages"] },
	{ id: "slack", provider: "slack", connected: true, problem: "Token expired. Reconnect to keep posting to channels.", can: ["Read channels you choose", "Post summaries and alerts", "Reply in threads when asked"] },
	{ id: "google-sheets", provider: "google-sheets", can: ["Read and update rows", "Create sheets from a report", "Watch a sheet for new rows"] },
	{ id: "google-calendar", provider: "google-calendar", can: ["See your meetings", "Suggest times that suit everyone", "Add events after you approve"] },
	{ id: "google-drive", provider: "google-drive", can: ["Search files and folders", "Read documents for context", "Save finished reports"] },
	{ id: "outlook", provider: "outlook", can: ["Read and search email", "Draft replies for you to send", "See your calendar"] },
	{ id: "excel", provider: "excel", can: ["Read workbooks in OneDrive", "Update tables and ranges", "Export a report as a workbook"] },
	{ id: "notion", provider: "notion", can: ["Search pages and databases", "Add rows to a database", "Write meeting notes into a page"] },
	{ id: "hubspot", provider: "hubspot", can: ["Read contacts, companies and deals", "Log calls and notes", "Move a deal to the next stage after you approve"] },
	{ id: "salesforce", provider: "salesforce", can: ["Read accounts and opportunities", "Log activity on a record", "Update fields after you approve"] },
	{ id: "jira", provider: "jira", can: ["Search issues", "Create and comment on issues", "Summarise a sprint"] },
	{ id: "linear", provider: "linear", can: ["Search issues and projects", "Create issues from a conversation", "Summarise a cycle"] },
	{ id: "zendesk", provider: "zendesk", can: ["Read tickets and macros", "Draft replies for agents", "Tag and route tickets"] },
	{ id: "airtable", provider: "airtable", can: ["Read and update records", "Create records from an email", "Watch a view for changes"] },
];
export const META: Record<string, ConnectorMeta> = Object.fromEntries(
	CONNECTORS.map((c) => [c.id, { method: c.id === "hubspot" ? "apikey" : "oauth", scope: ["gmail", "outlook", "google-calendar"].includes(c.id) ? "Only you" : "Everyone in TwoUX" } satisfies ConnectorMeta]),
);

export const TEMPLATES: Template[] = [
	{ id: "t1", name: "Triage the support inbox", does: "Sorts new emails by urgency and drafts a reply for each one.", tools: ["Gmail", "Slack"], category: "Support" },
	{ id: "t2", name: "Weekly pipeline report", does: "Summarises deals that moved, stalled or closed this week.", tools: ["HubSpot", "Google Sheets"], category: "Sales" },
	{ id: "t3", name: "Chase overdue invoices", does: "Lists unpaid invoices and drafts a reminder for you to approve.", tools: ["Gmail", "Excel"], category: "Finance" },
	{ id: "t4", name: "Prepare for a customer call", does: "Pulls the account history and recent emails into one page.", tools: ["Salesforce", "Gmail"], category: "Sales" },
	{ id: "t5", name: "Screen new applications", does: "Checks each application against the role criteria and flags gaps for a person to review.", tools: ["Notion", "Gmail"], category: "Recruiting" },
	{ id: "t6", name: "Summarise the sprint", does: "Writes a short update from closed and blocked issues.", tools: ["Jira", "Slack"], category: "Operations" },
	{ id: "t7", name: "Log meeting notes", does: "Adds decisions and actions from a call to the right Notion page.", tools: ["Notion", "Google Calendar"], category: "Operations" },
	{ id: "t8", name: "Tidy a messy spreadsheet", does: "Fixes dates, duplicates and spelling in a sheet, and shows what changed.", tools: ["Google Sheets"], category: "Finance" },
];

export const UPDATES = [
	{ id: "u1", date: "2026-11-04T09:00:00Z", title: "Automations", isNew: true, body: "Run an agent on a schedule or when something happens, such as a new email or a deal moving stage. Each automation shows its next run and the last result.", link: "Read about automations" },
	{ id: "u2", date: "2026-10-21T09:00:00Z", title: "Tables are in beta", isNew: false, body: "Keep structured results in a table your agents can read and update. Results may change while we test it, so tell us what is missing.", link: "Send feedback on tables" },
];

export type Agent = { id: string; name: string; does: string; status: "On" | "Paused" };
export const AGENTS: Agent[] = [
	{ id: "triage", name: "Inbox triage", does: "Sorts new support email and drafts replies", status: "On" },
	{ id: "pipeline", name: "Weekly pipeline report", does: "Posts a deal summary to Slack every Monday", status: "On" },
];

export type AgentSettings = {
	model: string;
	instructions: string;
	selfUpdates: boolean;
	triggers: string[];
	connectors: ProviderId[];
	skills: string[];
	knowledge: string[];
	abilities: Record<string, boolean>;
};
export const MODELS = ["Fast", "Balanced", "Thorough"];
export const POOLS = {
	triggers: ["Every weekday at 08:00", "New email in Gmail", "A deal changes stage", "A message in #support", "Every Monday at 09:00"],
	skills: ["Write in the TwoUX tone", "Summarise a thread", "Check an order status", "Draft a refund reply", "Prepare a weekly report"],
	knowledge: ["Refund policy", "Support handbook", "Pricing sheet 2026", "Product FAQ", "Escalation contacts"],
	connectors: ["gmail", "slack", "hubspot", "google-sheets", "notion", "zendesk"] as ProviderId[],
};
export const ABILITIES: { id: string; label: string; scope: string }[] = [
	{ id: "read-mail", label: "Read email", scope: "Only the Support inbox." },
	{ id: "draft-mail", label: "Draft replies", scope: "Drafts stay in Gmail until a person sends them." },
	{ id: "post-slack", label: "Post to Slack", scope: "Only #support and #pipeline." },
	{ id: "update-crm", label: "Update CRM records", scope: "Notes and tags only. Never deal values." },
	{ id: "tag-tickets", label: "Tag and route tickets", scope: "Any ticket in the Support queue." },
];
export const INITIAL_SETTINGS: Record<string, AgentSettings> = {
	triage: {
		model: "Balanced",
		instructions: "Read each new email in the Support inbox. Mark anything about a payment or an outage as urgent. Draft a reply in the TwoUX tone and leave it for a person to send. Never promise a refund.",
		selfUpdates: false,
		triggers: ["New email in Gmail", "Every weekday at 08:00"],
		connectors: ["gmail", "slack", "zendesk"],
		skills: ["Write in the TwoUX tone", "Draft a refund reply"],
		knowledge: ["Refund policy", "Support handbook", "Product FAQ"],
		abilities: { "read-mail": true, "draft-mail": true, "post-slack": true, "update-crm": false, "tag-tickets": true },
	},
	pipeline: {
		model: "Thorough",
		instructions: "Every Monday, list deals that moved, stalled or closed in the last seven days. Show the value of each and why it stalled if the notes say. Post the summary in #pipeline.",
		selfUpdates: true,
		triggers: ["Every Monday at 09:00"],
		connectors: ["hubspot", "slack", "google-sheets"],
		skills: ["Prepare a weekly report", "Summarise a thread"],
		knowledge: ["Pricing sheet 2026", "Escalation contacts"],
		abilities: { "read-mail": false, "draft-mail": false, "post-slack": true, "update-crm": true, "tag-tickets": false },
	},
};
