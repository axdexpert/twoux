export const install = "";
export const api = [
	{ component: "Table", props: [
		{ name: "size", type: '"default" | "dense"', default: '"default"', description: "dense: 28px rows and header, 8px cell padding, the same 13px text. Only for spreadsheet-like data (inventories, ledgers, imports, mapping); never a user preference or an app-wide switch." },
		{ name: "TableHead · TableCell data-pinned", type: '"" | "last"', description: "Freezes the column while the table scrolls sideways. Set its left offset in the --pin CSS variable, for example 64px: the widths of the frozen columns before it; \"last\" draws the edge. Use table-fixed and give the header cells widths." },
	] },
	{ component: "TableGroupRow", props: [
		{ name: "label · count · colSpan", type: "string · number · number", description: "A section row across the table, such as Inputs or Wastes and emissions. Put each group in its own TableBody with this row first." },
		{ name: "info", type: "ReactNode", description: "What belongs in the group, in a tooltip on an info button named “About <label>”." },
		{ name: "expanded · onExpandedChange · controls", type: "boolean · (open) => void · string", description: "Makes the label a button with aria-expanded (and aria-controls, the TableBody id). Leave the rows out while collapsed." },
	] },
	{ component: "TableRowNumber", props: [
		{ name: "n · label", type: "number · string", description: "The row number and the ⋮ menu, named “Actions for <label>”." },
		{ name: "children", type: "DropdownMenuItem[]", description: "Every row action, including any in-cell button's action." },
	] },
	{ component: "TableFilterRow", props: [
		{ name: "columns", type: "({ id, label, align? } | null)[]", description: "One per column, in order; null where there is no filter. Each field is named “Filter <label>”; Esc clears it." },
		{ name: "values · onChange", type: "Record<string, string> · (id, value) => void", description: "Filter the rows yourself and go back to the first page." },
	] },
	{ component: "TableCellAction", props: [
		{ name: "aria-label", type: "string", description: "Names the row: “Open Magnet preparation”. Shown on row hover and keyboard focus, always on touch. Put the same action in the row menu." },
	] },
	{ component: "TableNotApplicable · TableLinkedItems", props: [
		{ name: "—", type: "—", description: "“n/a” read as “not applicable” (empty values use a dash instead). Two items joined by an arrow, read as “from to”." },
	] },
];
