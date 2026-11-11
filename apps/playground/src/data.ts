export type Listing = { id: string; role: string; team: string; location: string; status: "Open" | "Closing soon" | "Draft" | "Closed"; applicants: number; closes: string };

export const LISTINGS: Listing[] = [
	{ id: "L-1040", role: "Junior Product Designer", team: "Design", location: "Leeds", status: "Open", applicants: 38, closes: "2026-12-04" },
	{ id: "L-1041", role: "Frontend Engineer", team: "Engineering", location: "Manchester", status: "Closing soon", applicants: 112, closes: "2026-11-21" },
	{ id: "L-1042", role: "Data Analyst", team: "Data", location: "Remote (UK)", status: "Open", applicants: 64, closes: "2026-12-12" },
	{ id: "L-1043", role: "Recruitment Coordinator", team: "People", location: "London", status: "Draft", applicants: 0, closes: "2027-01-09" },
	{ id: "L-1044", role: "Customer Success Lead", team: "Customer", location: "Bristol", status: "Open", applicants: 21, closes: "2026-12-01" },
	{ id: "L-1045", role: "QA Engineer", team: "Engineering", location: "Glasgow", status: "Closed", applicants: 47, closes: "2026-10-30" },
];

export type Candidate = { id: string; name: string; listingId: string; stage: "Applied" | "Screen" | "Interview" | "Offer"; applied: string };

export const CANDIDATES: Candidate[] = [
	{ id: "C-201", name: "Amara Okafor", listingId: "L-1040", stage: "Screen", applied: "2026-11-02" },
	{ id: "C-202", name: "Tom Becker", listingId: "L-1041", stage: "Applied", applied: "2026-11-04" },
	{ id: "C-203", name: "Priya Shah", listingId: "L-1041", stage: "Interview", applied: "2026-10-28" },
	{ id: "C-204", name: "Liam Walsh", listingId: "L-1042", stage: "Applied", applied: "2026-11-05" },
	{ id: "C-205", name: "Sofia Romano", listingId: "L-1040", stage: "Offer", applied: "2026-10-20" },
];
