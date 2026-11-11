export const install = "";
export const api = [
	{ component: "Stepper", props: [
		{ name: "steps", type: "{ title: string; description?: string }[]", description: "3 to 6 steps. Titles are short verb phrases." },
		{ name: "current", type: "number", description: "Index of the current step. Steps before it show as done." },
		{ name: "onStepSelect", type: "(index: number) => void", description: "Makes done steps buttons, to go back. Later steps stay locked." },
		{ name: "aria-label", type: "string", default: '"Progress"', description: "Name the task: “Publish a listing”." },
	] },
];
