export const install = "";
export const api = [
	{ component: "Alert · AlertTitle · AlertDescription · AlertAction", props: [
		{ name: "Alert variant", type: '"default" | "warning" | "destructive"', default: '"default"', description: "Neutral for information. Red only for errors that stop the task; those use role alert, the others role status." },
		{ name: "icon (first child)", type: "lucide icon", description: "Info, TriangleAlert or CircleAlert. Sized 14px by the banner." },
		{ name: "AlertTitle", type: "ReactNode", description: "The message, one sentence." },
		{ name: "AlertAction", type: "ReactNode", description: "Dismiss (ghost) first, then at most one action (outline). Dismiss only when nothing is blocked." },
	] },
];
