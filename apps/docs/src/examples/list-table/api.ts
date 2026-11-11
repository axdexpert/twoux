export const install = "pnpm add @tanstack/react-table";
export const api = [
	{ component: "Table · TableHeader · TableBody · TableRow · TableHead · TableCell", props: [
		{ name: "Table containerClassName", type: "string", description: "Give the wrapper a max height (max-h-120 overflow-auto) to keep the sticky header in view." },
		{ name: "TableRow data-state", type: '"selected"', description: "Indigo tint for selected rows." },
	] },
	{ component: "TableSortHead", props: [
		{ name: "sorted", type: 'false | "asc" | "desc"', description: "Only the sorted column shows its arrow and gets aria-sort." },
		{ name: "onSort", type: "() => void", description: "Toggle the sort for this column." },
		{ name: "align", type: '"left" | "right"', default: '"left"', description: "Right for numbers." },
	] },
	{ component: "useRowKeyboard", props: [
		{ name: "count · onToggle · onOpen · onClear", type: "number · (i, value?) => void", description: "J/K or arrows move, X selects, ⇧J/⇧K extend, Enter opens, Esc clears. Spread bodyProps on TableBody and rowProps(i) on each row." },
		{ name: "enabled", type: "boolean", default: "true", description: "Single-key shortcuts can be turned off in settings." },
	] },
	{ component: "TanStack Table", props: [{ name: "useReactTable", type: "—", description: "Sorting, selection and paging state. Clear the selection when the page changes." }] },
];
