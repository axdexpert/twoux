export const install = "";
export const api = [
	{
		component: "Button",
		props: [
			{ name: "variant", type: '"default" | "outline" | "secondary" | "ghost" | "warning" | "destructive" | "link"', default: '"default"', description: "shadcn names. default is the indigo primary, once per view. outline for supporting actions, ghost in toolbars and rows. warning is a TwoUX addition." },
			{ name: "size", type: '"xs" | "sm" | "default" | "lg" | "icon-xs" | "icon-sm" | "icon" | "icon-lg"', default: '"default"', description: "TwoUX heights: 24, 28, 32, 36px. icon sizes are square; give them an aria-label." },
			{ name: "children", type: "ReactNode", description: "Icons go inside as children, before or after the label (shadcn convention)." },
			{ name: "loading", type: "boolean", default: "false", description: "TwoUX addition. Spinner, aria-busy, ignores clicks, stays focusable." },
			{ name: "shortcut", type: "string", description: 'TwoUX addition. Key shown after the label, e.g. "C" or "⌘↵". Hidden on icon and xs sizes.' },
			{ name: "asChild", type: "boolean", default: "false", description: "Render the child element, for example a router link, with button styles." },
		],
	},
];
