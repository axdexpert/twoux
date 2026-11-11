export const install = "";
export const api = [
	{ component: "ErrorSummary", props: [
		{ name: "errors", type: "{ field: string; message: string; href: string }[]", description: "One entry per invalid field. href points at the input id." },
	] },
	{ component: "Field (error)", props: [
		{ name: "error", type: "string", description: "Field-level message, shown in place of the hint. Sets aria-invalid on the input." },
	] },
];
