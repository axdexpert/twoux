export const install = "";
export const api = [
	{
		component: "Checkbox",
		props: [
			{ name: "checked", type: 'boolean | "indeterminate"', description: "Controlled state. Use indeterminate for a parent with some children selected." },
			{ name: "defaultChecked", type: "boolean", description: "Uncontrolled initial state." },
			{ name: "onCheckedChange", type: '(checked: boolean | "indeterminate") => void', description: "Called when the person toggles it." },
			{ name: "disabled", type: "boolean", default: "false", description: "Prefer explaining why nearby; disabled controls cannot be focused." },
			{ name: "...props", type: "Radix Checkbox.Root props", description: "id, name, value, required, aria-*." },
		],
	},
	{
		component: "CheckboxField",
		props: [
			{ name: "id", type: "string", description: "Required: links the label and hint to the box." },
			{ name: "label", type: "string", description: "Sentence case, says what is turned on." },
			{ name: "hint", type: "string", description: "Optional consequence, read by screen readers via aria-describedby." },
		],
	},
];
