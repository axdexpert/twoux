export type Listing = { id: string; role: string; location: string; status: "Open" | "Closing soon" | "Draft" | "Closed"; applicants: number; closes: string };

const ROLES = ["Junior Product Designer", "Senior Product Designer", "Frontend Engineer", "Data Analyst", "Recruitment Coordinator", "Customer Success Lead", "Backend Engineer", "Content Designer", "QA Engineer", "Product Manager", "UX Researcher", "Platform Engineer"];
const PLACES = ["Leeds", "Manchester", "London", "Bristol", "Glasgow", "Remote (UK)", "Birmingham", "Cardiff"];
const STATUS: Listing["status"][] = ["Open", "Open", "Closing soon", "Open", "Draft", "Closed"];

export const LISTINGS: Listing[] = Array.from({ length: 24 }, (_, i) => {
	const day = ((i * 7) % 27) + 1;
	return {
		id: `L-${1040 + i}`,
		role: ROLES[i % ROLES.length],
		location: PLACES[(i * 3) % PLACES.length],
		status: STATUS[i % STATUS.length],
		applicants: (i * 37) % 140,
		closes: `2026-12-${String(day).padStart(2, "0")}`,
	};
});

export const STATUS_VARIANT = { Open: "success", "Closing soon": "warning", Draft: "secondary", Closed: "secondary" } as const;

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
