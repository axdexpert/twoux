export const install = "";
export const api = [
	{ component: "Tooltip · TooltipTrigger · TooltipContent", props: [
		{ name: "TooltipTrigger asChild", type: "boolean", description: "Wrap the button that the tooltip names." },
		{ name: "TooltipContent side", type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: "Flips automatically when there is no room (8px collision padding)." },
		{ name: "TooltipContent children", type: "ReactNode", description: "Same words as the accessible name, then a Kbd for the shortcut." },
	] },
	{ component: "TooltipProvider", props: [{ name: "delayDuration", type: "number", default: "300", description: "Wrap the app once." }] },
];
