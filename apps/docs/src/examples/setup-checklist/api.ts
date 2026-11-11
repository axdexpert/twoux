export const install = "";
export const api = [
	{
		"component": "SetupChecklist",
		"props": [
			{ "name": "items", "type": "{ id, label, done, onStart? }[]", "description": "Three to five tasks. The count shows as text, \"2 of 4\"." },
			{ "name": "onDismiss", "type": "() => void", "description": "Shows a Hide button. Without it the checklist cannot be closed, which is rarely right." }
		]
	}
];
