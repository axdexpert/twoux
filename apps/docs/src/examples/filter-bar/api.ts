export const install = "";
export const api = [
	{ component: "FilterButton", props: [
		{ name: "fields", type: "FilterFieldDef[]", description: "{ id, label, options, operator?, valueNoun?, group? }. Options carry counts that reflect the other active filters." },
		{ name: "fields[].kind · presets · maxDays", type: "\"date\" · DatePreset[] · number", description: "A date field: picking it opens typed dates, presets and a calendar beside the list, and FilterRow shows a DateFilterPill (\"Closing date is between 1 Dec – 5 Dec 2026\"). Its FilterValue entry holds dateFilterToValues; filter rows with resolveDateRange(dateFilterFromValues(values))." },
		{ name: "value · onChange", type: "FilterValue", description: "Field id to its values, in the order added. Shared with FilterRow. Ticks apply at once, no Apply button." },
		{ name: "label", type: "string", default: '"Filter"', description: "Names the icon button; shown with F in its tooltip. F opens it." },
	] },
	{ component: "FilterRow", props: [
		{ name: "fields · value · onChange", type: "FilterFieldDef[] · FilterValue", description: "The same as FilterButton. Renders nothing until a filter is applied, so the row appears only when it has something to say." },
		{ name: "shown · total · noun", type: "number · number · string", description: "“16 of 150 people” and Clear. Filter the whole collection, not only loaded rows." },
		{ name: "className", type: "string", description: "Row styling where it sits, such as a border under the toolbar." },
	] },
	{ component: "setFilterValue", props: [{ name: "(value, id, values)", type: "FilterValue", description: "Sets one field's values. An empty list removes the field, so a filter exists only while it filters something." }] },
	{ component: "Building blocks", props: [{ name: "FilterBar · FilterPill · FilterMenu · FilterSummary", type: "components", description: "What FilterButton and FilterRow are made of. Use them directly only for a layout the pair can't express, and propose it first." }] },
];
