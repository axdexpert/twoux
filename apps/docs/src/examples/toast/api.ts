export const install = "";
export const api = [
	{ component: "Toaster", props: [
		{ name: "(mount once)", type: "—", description: "Place one Toaster at the app root. TwoUX sets bottom right, 16px offset, one toast at a time, 6 seconds, 340px wide, solid surface. It moves up above the focused element and any element marked data-toast-avoid." },
	] },
	{ component: "toast · toast.success · toast.error", props: [
		{ name: "message", type: "string", description: "What happened, past tense: “Listing closed”." },
		{ name: "description", type: "string", description: "Optional: which record, one line." },
		{ name: "action", type: "{ label: \"Undo\"; onClick }", description: "Undo only. Never Close or Cancel. Also bind ⌘Z to the same handler." },
	] },
];
