export type Role = "Owner" | "Operations lead" | "Buyer" | "Inventory planner" | "Warehouse manager" | "Viewer";

export const ROLES: { role: Role; limit: string; description: string }[] = [
	{ role: "Owner", limit: "No limit", description: "Approves anything, manages billing" },
	{ role: "Operations lead", limit: "$50,000", description: "Approves orders up to $50,000" },
	{ role: "Buyer", limit: "$25,000", description: "Approves orders up to $25,000" },
	{ role: "Inventory planner", limit: "$10,000", description: "Approves orders up to $10,000" },
	{ role: "Warehouse manager", limit: "$5,000", description: "Approves transfers and counts up to $5,000" },
	{ role: "Viewer", limit: "Cannot approve", description: "Sees everything, approves nothing" },
];

export const PERMISSION_ROLES: Role[] = ["Owner", "Operations lead", "Buyer", "Inventory planner", "Warehouse manager", "Viewer"];

export const PERMISSIONS: { label: string; roles: Role[] }[] = [
	{ label: "Approve purchase orders", roles: ["Owner", "Operations lead", "Buyer", "Inventory planner"] },
	{ label: "Approve stock transfers", roles: ["Owner", "Operations lead", "Inventory planner", "Warehouse manager"] },
	{ label: "Edit agent rules", roles: ["Owner", "Operations lead"] },
	{ label: "Change approval limits", roles: ["Owner"] },
	{ label: "Invite and remove people", roles: ["Owner", "Operations lead"] },
	{ label: "See costs and margins", roles: ["Owner", "Operations lead", "Buyer", "Inventory planner"] },
];

export type Member = {
	id: string;
	name: string;
	email: string;
	role: Role;
	warehouses: string;
	limit: string;
	approvals: number;
	trend: number[];
	lastActive: string;
	status: "Active" | "Invited";
	you?: boolean;
};

export const MEMBERS: Member[] = [
	{ id: "m1", name: "Daniel Kim", email: "daniel@harborpine.com", role: "Owner", warehouses: "All 4", limit: "No limit", approvals: 32, trend: [3, 4, 2, 5, 3, 6, 4, 5], lastActive: "Yesterday", status: "Active" },
	{ id: "m2", name: "Marcus Bell", email: "marcus@harborpine.com", role: "Operations lead", warehouses: "All 4", limit: "$50,000", approvals: 248, trend: [22, 30, 28, 35, 31, 38, 33, 31], lastActive: "8 min ago", status: "Active" },
	{ id: "m3", name: "Leila Farahani", email: "leila@harborpine.com", role: "Buyer", warehouses: "All 4", limit: "$25,000", approvals: 196, trend: [18, 22, 25, 21, 27, 26, 29, 28], lastActive: "40 min ago", status: "Active" },
	{ id: "m4", name: "Dana Okafor", email: "dana@harborpine.com", role: "Inventory planner", warehouses: "All 4", limit: "$10,000", approvals: 312, trend: [30, 34, 38, 36, 41, 44, 43, 46], lastActive: "Active now", status: "Active", you: true },
	{ id: "m5", name: "Renee Thomas", email: "renee@harborpine.com", role: "Warehouse manager", warehouses: "Columbus", limit: "$5,000", approvals: 74, trend: [8, 9, 7, 10, 9, 11, 10, 10], lastActive: "1 h ago", status: "Active" },
	{ id: "m6", name: "Yuki Tanaka", email: "yuki@harborpine.com", role: "Warehouse manager", warehouses: "Dallas", limit: "$5,000", approvals: 61, trend: [6, 8, 7, 9, 8, 7, 8, 8], lastActive: "3 h ago", status: "Active" },
	{ id: "m7", name: "Karim Haddad", email: "karim@harborpine.com", role: "Warehouse manager", warehouses: "Reno", limit: "$5,000", approvals: 47, trend: [5, 6, 4, 7, 6, 6, 7, 6], lastActive: "Today, 6:10", status: "Active" },
	{ id: "m8", name: "Ama Mensah", email: "ama@harborpine.com", role: "Viewer", warehouses: "All 4", limit: "Cannot approve", approvals: 0, trend: [], lastActive: "Invite sent 4 Nov", status: "Invited" },
];

export const WAREHOUSES = ["Dallas", "Columbus", "Reno", "Savannah"];
