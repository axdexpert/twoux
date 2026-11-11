import type { CatalogueAction, MappingTarget, SheetColumn, SheetRow } from "@twoux/ui";

export const SENIORITY = ["Entry", "Mid", "Senior", "Head of", "Director", "VP", "C-level"];

const FIRST = ["Ana", "Ben", "Chloe", "Daniel", "Ella", "Farah", "George", "Hannah", "Isaac", "Jade", "Kieran", "Leah", "Mohammed", "Niamh", "Oliver", "Priya", "Rhys", "Sofia", "Tom", "Uma", "Victor", "Wendy", "Yusuf", "Zara", "Aled", "Bethan", "Callum", "Dina", "Ewan", "Freya", "Gareth", "Holly", "Imran", "Josie", "Kofi", "Lucy", "Marek", "Nadia", "Owen", "Poppy"];
const LAST = ["Silva", "Hughes", "Patel", "Murray", "Brennan", "Khan", "Lowe", "Okafor", "Reid", "Turner", "Walsh", "Evans", "Ali", "Byrne", "Shaw", "Sharma", "Morgan", "Rossi", "Becker", "Nair", "Novak", "Price", "Hassan", "Ahmed", "Jones", "Rees", "Fraser", "Kaur", "Grant", "Hall", "Davies", "Wood", "Malik", "Parry", "Mensah", "Cole", "Kowalski", "Haddad", "Lloyd", "Scott"];
const COMPANIES: [string, string, number][] = [
	["Harbour & Vale", "harbourvale.co.uk", 240], ["Pennine Freight", "penninefreight.com", 1200], ["Kestrel Health", "kestrelhealth.io", 85], ["Larkfield Energy", "larkfield.energy", 3100],
	["Mosaic Lending", "mosaiclending.co.uk", 410], ["Thistle Analytics", "thistle.ai", 52], ["Quayside Retail", "quaysideretail.com", 2200], ["Brightwater Legal", "brightwaterlegal.co.uk", 160],
	["Orrin Software", "orrin.dev", 130], ["Copperleaf Foods", "copperleaf.co.uk", 780],
];
const TITLES: [string, string][] = [
	["Head of Revenue Operations", "Head of"], ["Finance Director", "Director"], ["Operations Manager", "Mid"], ["Chief Operating Officer", "C-level"], ["Senior Data Analyst", "Senior"],
	["VP Sales", "VP"], ["Procurement Lead", "Senior"], ["Marketing Executive", "Entry"], ["Head of People", "Head of"], ["IT Director", "Director"],
];
const SUMMARY: Record<string, string> = {
	"C-level": "Runs the business day to day; signs off new tools and owns the budget.",
	VP: "Owns a revenue target and a team of managers; buys to hit the number.",
	Director: "Owns a department budget; final say on tools within it.",
	"Head of": "Leads a function and shortlists tools; needs a director to sign.",
	Senior: "Hands-on specialist; evaluates tools and recommends them.",
	Mid: "Runs daily operations; a user, not a buyer.",
	Entry: "Early career; uses tools others choose.",
};
const day = (n: number) => new Date(Date.UTC(2026, 9, 30) - n * 86400000).toISOString().slice(0, 10);

export const STAGES = ["Lead", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];
export const OWNERS = ["Amara Osei", "Liam Doherty", "Priya Raman", "Tomasz Nowak", "Sian Pritchard"];
const PROBABILITY: Record<string, number> = { Lead: 10, Qualified: 25, Proposal: 50, Negotiation: 75 };
/** Closed deals have no probability: the column shows n/a. */
export const isClosed = (stage: unknown) => stage === "Won" || stage === "Lost";

export type Person = {
	id: string; name: string; title: string; company: string; domain: string; seniority: string; employees: number; added: string;
	stage?: string; owner?: string; deal?: number; probability?: number | null; closes?: string; subscribed?: boolean;
};
const PEOPLE_COUNT = 150;
export const PEOPLE: Person[] = Array.from({ length: PEOPLE_COUNT }, (_, i) => {
	const name = i < FIRST.length ? `${FIRST[i]} ${LAST[i]}` : `${FIRST[i % FIRST.length]} ${LAST[(i * 7 + 3 + Math.floor(i / FIRST.length)) % LAST.length]}`;
	const [company, domain, employees] = COMPANIES[(i * 7) % COMPANIES.length];
	const [title, seniority] = TITLES[(i * 3) % TITLES.length];
	const stage = STAGES[(i * 5 + Math.floor(i / 7)) % STAGES.length];
	const deal = Math.round((4 + ((i * 37) % 46)) * (employees >= 1000 ? 2.5 : employees >= 200 ? 1.4 : 1)) * 500;
	return {
		id: `p${i + 1}`, name, title: i === 22 ? "" : title, company, domain: i === 6 ? "" : domain, seniority, employees, added: day((i * 5) % 60),
		stage, owner: OWNERS[(i * 3 + 1) % OWNERS.length], deal, probability: isClosed(stage) ? null : PROBABILITY[stage],
		closes: new Date(Date.UTC(2026, 10, 10) + ((i * 11) % 75) * 86400000).toISOString().slice(0, 10), subscribed: i % 4 !== 2,
	};
});
export const weighted = (v: { stage?: unknown; deal?: unknown; probability?: unknown }) => {
	const deal = Number(v.deal ?? 0);
	if (v.stage === "Won") return deal;
	if (v.stage === "Lost") return 0;
	return Math.round((deal * Number(v.probability ?? 0)) / 100);
};
export const gbp = (n: number) => n.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

export const fitScore = (p: { seniority?: unknown; employees?: unknown }) => {
	const rank = SENIORITY.indexOf(String(p.seniority ?? ""));
	const size = Number(p.employees ?? 0);
	return String(Math.max(1, rank - 1) + (size >= 1000 ? 2 : size >= 200 ? 1 : 0));
};
export const summaryFor = (p: Person) => SUMMARY[p.seniority] ?? "Role unclear from the title.";
export const emailFor = (p: Person) => `${p.name.split(" ")[0].toLowerCase()}.${p.name.split(" ")[1].toLowerCase()}@${p.domain}`;

/** Rows whose look-up or summary fails or finds nothing, so the run shows each state. */
export const FAILS: Record<string, { email?: "failed" | "not-found"; summary?: "failed" }> = {
	p7: { email: "failed" },
	p20: { email: "not-found" },
	p23: { summary: "failed" },
};

export const COLUMNS: SheetColumn[] = [
	{ id: "name", label: "Name", type: "text", width: 190, pinned: true, locked: true, validate: (v) => (v.trim() ? undefined : "Enter a name. Every person needs one.") },
	{ id: "company", label: "Company", type: "text", width: 150, pinned: true },
	{ id: "title", label: "Job title", type: "text", width: 200 },
	{ id: "stage", label: "Stage", type: "select", width: 120, options: STAGES },
	{ id: "owner", label: "Owner", type: "text", width: 160 },
	{ id: "deal", label: "Deal size", type: "number", width: 110, currency: "GBP", total: "sum" },
	{ id: "probability", label: "Probability %", type: "number", width: 120, total: "average", notApplicable: (r) => isClosed(r.values.stage), validate: (v) => (!v.trim() || (Number(v) >= 0 && Number(v) <= 100) ? undefined : "Enter a percentage from 0 to 100.") },
	{ id: "weighted", label: "Weighted deal", type: "formula", width: 130, formula: "=Deal size × Probability %" },
	{ id: "closes", label: "Close date", type: "date", width: 120 },
	{ id: "subscribed", label: "Newsletter", type: "boolean", width: 150, onLabel: "Subscribed", offLabel: "Not subscribed" },
	{ id: "summary", label: "Summarise role", type: "ai", width: 280, costPerRow: 1 },
	{ id: "email", label: "Work email", type: "enrichment", provider: "hubspot", width: 240, costPerRow: 0.5 },
	{ id: "fit", label: "Fit score", type: "formula", width: 100, formula: "=RANK(Seniority) − 1 + SIZEBAND(Company size)" },
	{ id: "seniority", label: "Seniority", type: "select", width: 110, options: SENIORITY },
	{ id: "employees", label: "Company size", type: "number", width: 120 },
	{ id: "domain", label: "Company domain", type: "text", width: 170, validate: (v) => (!v.trim() || /^[\w-]+(\.[\w-]+)+$/.test(v.trim()) ? undefined : "Enter a domain such as twoux.co.uk, without https://.") },
	{ id: "added", label: "Added", type: "date", width: 120, hidden: true },
];

export const COMPANY_COLUMNS: SheetColumn[] = [
	{ id: "name", label: "Company", type: "text", width: 200, pinned: true, locked: true },
	{ id: "domain", label: "Domain", type: "text", width: 200 },
	{ id: "employees", label: "Employees", type: "number", width: 120 },
	{ id: "people", label: "People in table", type: "number", width: 140 },
];
export const COMPANY_ROWS: SheetRow[] = COMPANIES.map(([name, domain, employees], i) => ({ id: `c${i}`, values: { name, domain, employees, people: PEOPLE.filter((p) => p.company === name).length } }));

export const IMPORT_TARGETS: MappingTarget[] = [
	{ id: "name", label: "Name", kind: "text", required: true },
	{ id: "email", label: "Work email", kind: "email" },
	{ id: "title", label: "Job title", kind: "text" },
	{ id: "company", label: "Company", kind: "text" },
	{ id: "domain", label: "Company domain", kind: "url" },
	{ id: "seniority", label: "Seniority", kind: "select", options: SENIORITY },
	{ id: "employees", label: "Company size", kind: "number" },
];
export const IMPORT_ALIASES = { name: ["full name"], email: ["e-mail", "email address"], title: ["title", "role"], domain: ["website"], employees: ["headcount", "employees"] };

const csvPeople = [
	["Maya Fischer", "maya.fischer@larkfield.energy", "Larkfield Energy", "Head of Procurement", "Head of", "3100", "larkfield.energy", "UK"],
	["Ruairi Doyle", "ruairi.doyle@pennine", "Pennine Freight", "Finance Director", "Director", "1200", "penninefreight.com", "Ireland"],
	["Sana Iqbal", "sana.iqbal@mosaiclending.co.uk", "Mosaic Lending", "VP Sales", "VP", "410", "mosaiclending.co.uk", "UK"],
	["Theo Clarke", "theo.clarke@orrin.dev", "Orrin Software", "Senior Data Analyst", "Senior", "130", "orrin.dev", "UK"],
	["Lena Hoffmann", "lena.hoffmann@thistle.ai", "Thistle Analytics", "Chief Operating Officer", "C-level", "52", "thistle.ai", "Germany"],
	["Jamal Bakr", "jamal.bakr at quaysideretail.com", "Quayside Retail", "Operations Manager", "Mid", "2200", "quaysideretail.com", "UK"],
	["Iona Campbell", "iona.campbell@brightwaterlegal.co.uk", "Brightwater Legal", "Head of People", "Head of", "160", "brightwaterlegal.co.uk", "UK"],
	["Pavel Dvorak", "pavel.dvorak@kestrelhealth.io", "Kestrel Health", "IT Director", "Director", "85", "kestrelhealth.io", "Czechia"],
	["", "info@copperleaf.co.uk", "Copperleaf Foods", "Marketing Executive", "Entry", "780", "copperleaf.co.uk", "UK"],
	["Grace Ndlovu", "grace.ndlovu@harbourvale.co.uk", "Harbour & Vale", "Procurement Lead", "Senior", "240", "harbourvale.co.uk", "UK"],
	["Felix Wright", "felix.wright@larkfield.energy", "Larkfield Energy", "Operations Manager", "Mid", "3100", "larkfield.energy", "UK"],
	["Anya Petrova", "anya.petrova@@orrin.dev", "Orrin Software", "VP Sales", "VP", "130", "orrin.dev", "UK"],
	["Cian Murphy", "cian.murphy@penninefreight.com", "Pennine Freight", "Head of Revenue Operations", "Head of", "1200", "penninefreight.com", "Ireland"],
	["Meera Joshi", "meera.joshi@mosaiclending.co.uk", "Mosaic Lending", "Senior Data Analyst", "Senior", "four hundred", "mosaiclending.co.uk", "UK"],
	["Hugo Martin", "hugo.martin@quaysideretail.com", "Quayside Retail", "Finance Director", "Director", "2200", "quaysideretail.com", "France"],
];
const cell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
const filler = Array.from({ length: 12 }, (_, i) => {
	const [company, domain, size] = COMPANIES[(i * 3) % COMPANIES.length];
	const [title, seniority] = TITLES[(i * 7) % TITLES.length];
	const name = `${FIRST[(i * 11) % FIRST.length]} ${LAST[(i * 13 + 5) % LAST.length]}`;
	return [name, `${name.toLowerCase().replace(" ", ".")}@${domain}`, company, title, seniority, String(size), domain, "UK"];
});
export const SAMPLE_CSV = {
	name: "event-leads-oct.csv",
	text: [["Full name", "E-mail", "Company", "Title", "Seniority", "Headcount", "Website", "Country"], ...csvPeople, ...filler].map((r) => r.map(cell).join(",")).join("\n"),
};

export type IconKey = "sigma" | "at" | "clock" | "globe" | "mailcheck" | "tags" | "pen" | "languages";
export const ACTIONS: (Omit<CatalogueAction, "icon"> & { iconKey?: IconKey })[] = [
	{ id: "work-email", name: "Find work email", description: "Looks up the person's work email in HubSpot from their name and company domain.", category: "Enrichment", suggested: true, provider: "hubspot", costPerRow: 0.5, inputs: [{ id: "domain", label: "Company domain column", options: ["Company domain", "Company"] }] },
	{ id: "company-details", name: "Company details from Salesforce", description: "Industry, headcount and account owner from the matching Salesforce account.", category: "Enrichment", suggested: true, provider: "salesforce", costPerRow: 0.5, inputs: [{ id: "domain", label: "Match accounts on", options: ["Company domain", "Company"] }] },
	{ id: "domain-from-site", name: "Find company domain", description: "Finds the company's website domain from its name.", category: "Enrichment", iconKey: "globe", costPerRow: 0.2 },
	{ id: "verify-email", name: "Check email can receive mail", description: "Says whether an email address exists and accepts mail, without sending anything.", category: "Enrichment", iconKey: "mailcheck", costPerRow: 0.1, inputs: [{ id: "email", label: "Email column", options: ["Work email"] }] },
	{ id: "summarise", name: "Summarise role", description: "One sentence on what the person does and whether they buy tools, from their job title.", category: "AI", suggested: true, iconKey: "pen", costPerRow: 1, inputs: [{ id: "title", label: "Job title column", options: ["Job title"] }] },
	{ id: "classify", name: "Classify industry", description: "Puts each company into one of your industries, with the reason.", category: "AI", iconKey: "tags", costPerRow: 0.5, inputs: [{ id: "list", label: "Industries to choose from", options: ["TwoUX sectors (12)", "UK SIC sections (21)"] }] },
	{ id: "opener", name: "Write a first line", description: "A one-sentence opener for an email, from the role and company. You review it before anything is sent.", category: "AI", iconKey: "pen", costPerRow: 1 },
	{ id: "translate", name: "Translate", description: "Translates a text column into another language.", category: "AI", iconKey: "languages", costPerRow: 0.5, inputs: [{ id: "to", label: "Translate into", options: ["French", "German", "Spanish", "Welsh"] }] },
	{ id: "combine", name: "Combine columns", description: "Joins two or more columns into one, with a separator you choose.", category: "Formulas", suggested: true, iconKey: "sigma", costPerRow: 0 },
	{ id: "domain-from-email", name: "Domain from email", description: "Takes the part after @ from an email column.", category: "Formulas", iconKey: "at", costPerRow: 0 },
	{ id: "days-since", name: "Days since", description: "Counts the days since a date column, updated every morning.", category: "Formulas", iconKey: "clock", costPerRow: 0 },
	{ id: "hubspot-sync", name: "Send to HubSpot", description: "Creates or updates a HubSpot contact per row and shows the result in the column.", category: "Exports", provider: "hubspot", costPerRow: 0 },
	{ id: "sheets", name: "Add to a Google Sheet", description: "Appends each row to a sheet you choose and keeps it in step.", category: "Exports", provider: "google-sheets", costPerRow: 0 },
	{ id: "slack", name: "Post to Slack", description: "Posts a message to a channel when a row matches a filter.", category: "Exports", provider: "slack", costPerRow: 0 },
];

export type RunHistoryEntry = { id: string; label: string; rows: number; credits: number; outcome: "Done" | "Stopped" | "Failed"; at: number };
export const HISTORY_SEED: RunHistoryEntry[] = [
	{ id: "h1", label: "Work email · Companies sheet", rows: 10, credits: 5, outcome: "Done" as const, at: Date.now() - 3 * 3600_000 },
	{ id: "h2", label: "Summarise role · test on 10 rows", rows: 10, credits: 10, outcome: "Done" as const, at: Date.now() - 26 * 3600_000 },
];
