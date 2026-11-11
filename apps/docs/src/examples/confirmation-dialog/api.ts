export const install = "";
export const api = [
	{ component: "AlertDialog · AlertDialogTrigger · AlertDialogContent", props: [
		{ name: "AlertDialogContent size", type: '"default" | "sm"', default: '"default"', description: "420px wide at most." },
	] },
	{ component: "AlertDialogTitle · AlertDialogDescription", props: [
		{ name: "AlertDialogTitle", type: "ReactNode", description: "A question naming the action and count: “Close 2 listings?”" },
		{ name: "AlertDialogDescription", type: "ReactNode", description: "The consequence, and what is kept." },
	] },
	{ component: "AlertDialogCancel · AlertDialogAction", props: [
		{ name: "AlertDialogCancel", type: "Button props", description: "The safe option, first. Radix focuses it on open." },
		{ name: "AlertDialogAction variant", type: "Button variant", default: '"default"', description: 'Use "destructive", labelled with the action: “Close listings”.' },
	] },
];
