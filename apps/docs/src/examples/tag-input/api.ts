export const install = "";
export const api = [
	{ component: "TagInput", props: [
		{ name: "label", type: "string", description: "Always visible; also names the list of tags." },
		{ name: "value · onValueChange", type: "string[] · (value) => void", description: "Includes values that aren't valid: they stay as marked tags until fixed or removed." },
		{ name: "validateValue", type: "(value) => string | undefined", description: "The reason a value isn't valid, such as \"Not an email address.\" The error under the field counts them." },
		{ name: "max", type: "number", description: "Most values. Shows \"3 of 10\"; values past it stay in the input." },
		{ name: "noun", type: "{ one, many }", default: "value, values", description: "Used in messages: \"2 addresses aren't valid. Fix or remove them.\"" },
		{ name: "hint · error · placeholder", type: "string", description: "Hint defaults to \"Separate <many> with commas or new lines\". The hint line also says what just happened." },
		{ name: "required · optional · disabled · readOnly · name", type: "", description: "readOnly keeps tags focusable without remove or edit. name submits each value separately." },
	] },
];
