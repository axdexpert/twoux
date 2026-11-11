export const install = "";
export const api = [
	{ component: "Command · CommandDialog", props: [
		{ name: "Command shouldFilter", type: "boolean", default: "true", description: "Built-in fuzzy filtering. Set false when you rank results yourself." },
		{ name: "Command loop", type: "boolean", default: "false", description: "Arrow keys wrap from last to first." },
		{ name: "CommandDialog open / onOpenChange", type: "boolean / (open) => void", description: "Radix Dialog: focus trap, Esc closes, focus returns on close." },
		{ name: "CommandDialog title", type: "string", default: '"Command menu"', description: "Accessible name, visually hidden." },
	] },
	{ component: "Parts", props: [
		{ name: "CommandInput", type: "cmdk Input", description: "Search field with icon. context slot for a scope chip." },
		{ name: "CommandGroup heading", type: "string", description: "Sentence case, quiet. Not uppercase." },
		{ name: "CommandItem onSelect", type: "() => void", description: "One line: icon, label, optional CommandItemMeta, CommandShortcut." },
		{ name: "CommandEmpty · CommandSeparator · CommandFooter", type: "—", description: "Empty message that suggests what to try; divider; key hints." },
	] },
];
