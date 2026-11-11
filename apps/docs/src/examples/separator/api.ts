export const install = "";
export const api = [
	{ component: "Separator", props: [
		{ name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Vertical inside toolbars." },
		{ name: "decorative", type: "boolean", default: "true", description: "Set false only in menus and toolbars, where the line divides groups for screen readers." },
	] },
	{ component: "FieldSeparator", props: [{ name: "children", type: "ReactNode", description: "Optional label centred on the line, such as “or”." }] },
];
