export const install = "";
export const api = [
	{ component: "Badge", props: [
		{ name: "variant", type: '"default" | "success" | "warning" | "destructive" | "secondary" | "outline"', default: '"default"', description: "shadcn names plus success and warning. Status tones are soft: the word carries the meaning." },
		{ name: "dot", type: "boolean", default: "false", description: "TwoUX addition. Leading dot in the tone colour." },
		{ name: "children", type: "ReactNode", description: "The status word. Never a badge without text." },
	] },
];
