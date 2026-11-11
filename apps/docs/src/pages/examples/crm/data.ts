/** Fictional data for the contact record example. Dates are relative to today so overdue and upcoming always make sense. */

const midnight = new Date();
midnight.setHours(0, 0, 0, 0);
export const at = (days: number, hour = 10, minute = 0) => {
	const d = new Date(midnight);
	d.setDate(d.getDate() + days);
	d.setHours(hour, minute, 0, 0);
	return d;
};

export const STAGES = ["Subscriber", "Lead", "Qualified", "Opportunity", "Customer"] as const;

export type Contact = {
	id: string;
	name: string;
	title: string;
	company: string;
	email: string;
	phone: string;
	city: string;
	owner: string;
	source: string;
	stage: number;
	created: Date;
	score: number;
};

export const CONTACTS: Contact[] = [
	{ id: "C-2041", name: "Marta Okonkwo-Reyes", title: "Head of Procurement", company: "Halden Freight Group", email: "marta.okonkwo@haldenfreight.example", phone: "020 7946 0318", city: "Manchester", owner: "Daniel Ferreira", source: "Webinar sign-up", stage: 2, created: at(-212, 14, 5), score: 78 },
	{ id: "C-2042", name: "Idris Valkonen", title: "Operations Director", company: "Brightwell Logistics", email: "idris.valkonen@brightwell.example", phone: "0161 496 0224", city: "Leeds", owner: "Priya Nair", source: "Referral", stage: 3, created: at(-340, 9, 40), score: 86 },
	{ id: "C-2043", name: "Sophie Lindqvist", title: "Finance Manager", company: "Tarn & Moor Foods", email: "sophie.lindqvist@tarnmoor.example", phone: "0113 496 0777", city: "Bristol", owner: "Daniel Ferreira", source: "Pricing page form", stage: 1, created: at(-41, 16, 22), score: 52 },
	{ id: "C-2044", name: "Callum Adeyemi", title: "IT Lead", company: "Wexcombe Health Trust", email: "callum.adeyemi@wexcombe.example", phone: "0117 496 0145", city: "Cardiff", owner: "Amira Haddad", source: "Trade show", stage: 4, created: at(-598, 11, 15), score: 91 },
	{ id: "C-2045", name: "Hannah Brodsky", title: "Commercial Director", company: "Orrin & Pike Retail", email: "hannah.brodsky@orrinpike.example", phone: "029 2018 0463", city: "Glasgow", owner: "Priya Nair", source: "Outbound", stage: 0, created: at(-9, 13, 50), score: 31 },
	{ id: "C-2046", name: "Tomasz Whitcombe", title: "Supply Chain Analyst", company: "Ledgerwood Packaging", email: "tomasz.whitcombe@ledgerwood.example", phone: "0141 496 0652", city: "Birmingham", owner: "Amira Haddad", source: "Content download", stage: 1, created: at(-77, 10, 30), score: 47 },
	{ id: "C-2047", name: "Yusra Pemberton", title: "Chief Operating Officer", company: "Calder Valley Energy", email: "yusra.pemberton@caldervalley.example", phone: "0121 496 0391", city: "Sheffield", owner: "Daniel Ferreira", source: "Partner event", stage: 3, created: at(-155, 15, 12), score: 83 },
];

export type ActKind = "call" | "email" | "task" | "meeting" | "note";
export type Act = {
	id: string;
	kind: ActKind;
	title: string;
	body?: string;
	at: Date;
	by: string;
	done?: boolean;
	outcome?: "Connected" | "Left voicemail" | "No answer";
	duration?: string;
	opened?: boolean;
	attendees?: string[];
	draft?: boolean;
};

const HERO: Act[] = [
	{ id: "ACT-310", kind: "task", title: "Send the revised rate card", body: "Marta asked for the tiered pricing without the onboarding line. Check it with finance before it goes out.", at: at(-3, 17), by: "Daniel Ferreira", done: false },
	{ id: "ACT-311", kind: "task", title: "Confirm security questionnaire owner", body: "Her team needs a named contact on our side for the vendor review.", at: at(0, 16), by: "Daniel Ferreira", done: false },
	{ id: "ACT-312", kind: "meeting", title: "Pricing walkthrough with procurement", body: "Agenda: rate card, volume tiers, contract length. Marta is bringing her finance partner.", at: at(3, 11), by: "Daniel Ferreira", attendees: ["Marta Okonkwo-Reyes", "Anil Rao", "Daniel Ferreira"], duration: "45 min" },
	{ id: "ACT-313", kind: "task", title: "Draft a one-page summary for her finance partner", at: at(6, 12), by: "Daniel Ferreira", done: false },
	{ id: "ACT-314", kind: "email", title: "Re: Rate card and volume tiers", body: "Thanks for the call. I have attached the tiered pricing and a short note on how the volume bands work. Happy to walk your finance partner through it on Thursday.", at: at(-1, 15, 20), by: "Daniel Ferreira", opened: true },
	{ id: "ACT-315", kind: "call", title: "Discovery follow-up call", body: "Main concern is the vendor review timeline. Wants a decision before the end of the quarter. Asked about a named support contact.", at: at(-2, 10, 30), by: "Daniel Ferreira", outcome: "Connected", duration: "22 min" },
	{ id: "ACT-316", kind: "note", title: "Budget confirmed for this quarter", body: "Marta confirmed £60k to £80k is already allocated under freight systems. Sign-off sits with the COO, who has not been in any calls yet.", at: at(-6, 16, 45), by: "Priya Nair" },
	{ id: "ACT-317", kind: "email", title: "Security overview and data processing terms", body: "Sharing our security overview, the data processing terms and the sub-processor list ahead of your review.", at: at(-9, 9, 15), by: "Daniel Ferreira", opened: false },
	{ id: "ACT-318", kind: "call", title: "Voicemail after the webinar", body: "Left a short message pointing to the recording and offering a 20 minute slot.", at: at(-14, 14, 10), by: "Priya Nair", outcome: "Left voicemail", duration: "1 min" },
	{ id: "ACT-319", kind: "meeting", title: "Discovery call", body: "Walked through the current procurement process: three systems, no shared supplier record, manual rate checks each month.", at: at(-21, 13, 0), by: "Daniel Ferreira", attendees: ["Marta Okonkwo-Reyes", "Daniel Ferreira"], duration: "30 min" },
	{ id: "ACT-320", kind: "email", title: "Your place on the supplier data webinar", body: "You are booked on for Thursday. A calendar invite is attached and the recording follows afterwards.", at: at(-43, 11, 5), by: "Marketing automation", opened: true },
	{ id: "ACT-321", kind: "note", title: "Qualified after discovery", body: "Clear pain, budget and timeline. Moved to Qualified. Next step is a pricing session with finance in the room.", at: at(-48, 17, 30), by: "Daniel Ferreira" },
	{ id: "ACT-322", kind: "call", title: "Intro call", body: "Short qualification call. No answer on the first try.", at: at(-92, 10, 45), by: "Priya Nair", outcome: "No answer", duration: "0 min" },
	{ id: "ACT-323", kind: "email", title: "Welcome and what to expect", body: "Welcome pack with the product overview and three customer stories from freight and logistics.", at: at(-212, 14, 20), by: "Marketing automation", opened: true },
];

/** The other contacts get a shorter, templated history so J and K show a different record. */
const others = (c: Contact, i: number): Act[] => {
	const first = c.name.split(" ")[0];
	const n = (k: number) => `ACT-${400 + i * 10 + k}`;
	return [
		{ id: n(1), kind: "task", title: `Follow up with ${first} on the proposal`, at: at(i % 2 ? -1 : 2, 15), by: c.owner, done: false },
		{ id: n(2), kind: "meeting", title: `Review call with ${c.company}`, body: "Agenda: open questions on scope and the rollout plan.", at: at(5 + i, 14), by: c.owner, attendees: [c.name, c.owner], duration: "30 min" },
		{ id: n(3), kind: "email", title: `Notes from our conversation`, body: `Thanks for your time, ${first}. A summary of what we agreed and the next steps is below.`, at: at(-4 - i, 12, 10), by: c.owner, opened: i % 2 === 0 },
		{ id: n(4), kind: "call", title: "Check-in call", body: "Covered timing and who else needs to be involved.", at: at(-11 - i, 11, 30), by: c.owner, outcome: i % 3 === 0 ? "Left voicemail" : "Connected", duration: i % 3 === 0 ? "1 min" : "14 min" },
		{ id: n(5), kind: "note", title: `Source: ${c.source}`, body: `Came in through ${c.source.toLowerCase()}. Interest is in the supplier data features.`, at: c.created, by: c.owner },
	];
};

export const initialActivities = (): Record<string, Act[]> =>
	Object.fromEntries(CONTACTS.map((c, i) => [c.id, i === 0 ? HERO : others(c, i)]));

export type Deal = { id: string; name: string; amount: number; stage: string; tone: "default" | "success" | "warning" | "secondary"; closes: Date };
export type Ticket = { id: string; subject: string; priority: "High" | "Medium" | "Low"; status: "Open" | "Waiting on customer" | "Resolved"; updated: Date };
export type Company = { name: string; domain: string; industry: string; employees: string; city: string };

export const COMPANIES: Record<string, Company> = Object.fromEntries(
	CONTACTS.map((c, i) => [c.id, { name: c.company, domain: `${c.company.split(" ")[0].toLowerCase().replace(/[^a-z]/g, "")}.example`, industry: ["Freight and logistics", "Logistics", "Food production", "Healthcare", "Retail", "Packaging", "Energy"][i], employees: ["1,200 to 5,000", "200 to 1,000", "500 to 1,000", "5,000+", "1,000 to 5,000", "50 to 200", "1,000 to 5,000"][i], city: c.city }]),
);

export const DEALS: Record<string, Deal[]> = {
	"C-2041": [
		{ id: "D-881", name: "Halden Freight, supplier data platform", amount: 72000, stage: "Proposal", tone: "default", closes: at(34) },
		{ id: "D-884", name: "Halden Freight, onboarding package", amount: 9500, stage: "Qualification", tone: "secondary", closes: at(48) },
		{ id: "D-790", name: "Halden pilot, northern depots", amount: 14200, stage: "Closed won", tone: "success", closes: at(-120) },
	],
	"C-2042": [{ id: "D-902", name: "Brightwell Logistics, annual licence", amount: 58000, stage: "Negotiation", tone: "warning", closes: at(12) }],
	"C-2043": [{ id: "D-915", name: "Tarn & Moor, finance connector", amount: 12400, stage: "Qualification", tone: "secondary", closes: at(60) }],
	"C-2044": [{ id: "D-701", name: "Wexcombe Trust, three-year renewal", amount: 134000, stage: "Closed won", tone: "success", closes: at(-45) }],
	"C-2045": [],
	"C-2046": [{ id: "D-921", name: "Ledgerwood, analyst seats", amount: 6800, stage: "Qualification", tone: "secondary", closes: at(75) }],
	"C-2047": [{ id: "D-899", name: "Calder Valley, group rollout", amount: 96000, stage: "Proposal", tone: "default", closes: at(27) }],
};

export const TICKETS: Record<string, Ticket[]> = {
	"C-2041": [
		{ id: "T-5512", subject: "Vendor review: sub-processor list request", priority: "Medium", status: "Open", updated: at(-1, 15) },
		{ id: "T-5430", subject: "Pilot export missing depot codes", priority: "High", status: "Resolved", updated: at(-34, 11) },
	],
	"C-2042": [],
	"C-2043": [{ id: "T-5601", subject: "Invoice contact needs changing", priority: "Low", status: "Waiting on customer", updated: at(-3, 9) }],
	"C-2044": [{ id: "T-5588", subject: "SSO sign-in loop on the Edge browser", priority: "High", status: "Open", updated: at(0, 8) }],
	"C-2045": [],
	"C-2046": [],
	"C-2047": [],
};

export const SUMMARIES = [
	"Marta leads procurement at Halden Freight Group and is the main buyer for a £72,000 supplier data deal. Budget is confirmed and the COO signs off. The open risk is the vendor security review, which has a ticket open and a questionnaire owner still unnamed. A pricing walkthrough with her finance partner is booked for Thursday.",
	"Qualified buyer with confirmed budget of £60k to £80k. The last two weeks were mostly security and pricing questions, and she opened the latest email within the hour. Two tasks need attention before Thursday: the revised rate card is overdue and the security contact is due today.",
];

export const ASK_STARTERS = ["What should I do before Thursday?", "Why is the deal at risk?", "Draft a reply to the last email"];

export const ASK_ANSWERS: { match: RegExp; text: string }[] = [
	{ match: /thursday|before|next/i, text: "Three things. The rate card is three days overdue and Marta asked for it without the onboarding line. The security questionnaire needs a named owner on our side, due today. And her finance partner has not seen any pricing, so a one-page summary would help the meeting." },
	{ match: /risk|deal/i, text: "The deal is not stalled, but two things could slow it. The vendor security review has a sub-processor request open for a day. The COO, who signs off the budget, has not joined any call yet. Asking Marta to bring them to Thursday would close that gap." },
	{ match: /draft|reply|email/i, text: "Here is a short reply. Thanks Marta. I will send the revised rate card today, without the onboarding line, and Anil from our security team will be your named contact for the vendor review. Could your COO join the first ten minutes on Thursday?" },
];
export const ASK_DEFAULT = "From the activity on this record, Marta is engaged and the next step is the pricing walkthrough on Thursday. Ask about tasks, risks or a draft reply for something more specific.";
