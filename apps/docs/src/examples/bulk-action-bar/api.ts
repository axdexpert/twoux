export const install = "";
export const api = [
	// Place it directly above the table (after any filters), inside the same card.
	{ component: "BulkActionBar", props: [
		{ name: "count", type: "number", description: "Selected rows. The bar renders only when above 0." },
		{ name: "onClear", type: "() => void", description: "Clear selection button and Esc (ignored while a dialog or menu is open)." },
		{ name: "noun", type: "string", description: "Plural noun for the count: \"2 listings selected\". Without it: \"2 selected\"." },
		{ name: "size", type: "\"default\" | \"dense\"", default: "\"default\"", description: "Match the table: \"dense\" for Table or SheetGrid size=\"dense\"." },
		{ name: "actions", type: "{ label, icon?, onSelect, shortcut?, destructive?, disabled? }[]", description: "In order, destructive last. Up to four show as buttons; the rest, and any that don't fit the width, move into More. Shortcuts work in both places." },
		{ name: "children", type: "ReactNode", description: "Custom controls that always show before the actions, such as a Categorise menu button." },
	] },
];
