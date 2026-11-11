export const install = "";
export const api = [
	{ component: "TablePagination", props: [
		{ name: "page · pageCount · pageSize · total", type: "number", description: "Zero-based page. Shows “Showing 1–100 of 1,262 listings”." },
		{ name: "selected", type: "number", default: "0", description: "When above 0, “2 of 1,262 selected” comes first." },
		{ name: "noun", type: "string", default: '"rows"', description: "What the count counts: “listings”, “candidates”." },
		{ name: "onPageChange", type: "(page: number) => void", description: "Clear the selection when the page changes." },
	] },
];
