export const install = "";
export const api = [
	{ component: "DropdownMenu parts", props: [
		{ name: "DropdownMenuItem destructive", type: "boolean", description: "Red, placed last after a separator." },
		{ name: "DropdownMenuShortcut", type: "ReactNode", description: "Keys on the right, one Kbd per key." },
		{ name: "Checkbox / Radio items", type: "Radix props", description: "checked + onCheckedChange, or a RadioGroup with value." },
		{ name: "Sub · SubTrigger · SubContent", type: "Radix props", description: "One level deep at most. Flips side when there is no room." },
		{ name: "DropdownMenuContent align / side", type: "Radix props", description: "Collision padding keeps it inside the window." },
	] },
];
