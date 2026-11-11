export const install = "";
export const api = [
	{ component: "SplitButton", props: [
		{ name: "children · onClick", type: "ReactNode · () => void", description: "The main action, labelled with a verb: Import data." },
		{ name: "menuLabel", type: "string", description: "Names the chevron part: “More import options”." },
		{ name: "menu", type: "DropdownMenuItem[]", description: "The variants of the main action (Import all, Import selection). Disable an item that can't run yet rather than hiding it." },
		{ name: "variant", type: '"default" | "outline" | "secondary"', default: '"outline"', description: "default only when it is the page's one primary action." },
		{ name: "size · disabled · loading · shortcut · align", type: '"xs" | "sm" | "default" · boolean · boolean · string · "start" | "end"', default: '"sm"', description: "As on Button. The menu opens under the chevron, aligned to the end." },
	] },
	{ component: "ButtonGroup · ButtonGroupSeparator", props: [
		{ name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "shadcn's ButtonGroup, which SplitButton is built on. Use it directly only for a set of related buttons that act on the same thing." },
	] },
];
