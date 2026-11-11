export const install = "";
export const api = [
	{ component: "Input (shadcn)", props: [{ name: "...props", type: "InputHTMLAttributes", description: "Plain field, 32px. Pair it with a Label or use TextField." }] },
	{ component: "TextField (TwoUX)", props: [
		{ name: "label", type: "string", description: "Always visible. Never use the placeholder as the label." },
		{ name: "hint / error", type: "string", description: "Linked with aria-describedby. Error replaces the hint and sets aria-invalid." },
		{ name: "required / optional", type: "boolean", description: "Marks the label with * or (optional)." },
		{ name: "prefix / suffix", type: "ReactNode", description: "Renders shadcn InputGroup addons inside the field." },
	] },
	{ component: "InputGroup (shadcn)", props: [{ name: "InputGroupAddon align", type: '"inline-start" | "inline-end"', description: "Icons, units or a Kbd inside the field." }] },
];
