export const install = "";
export const api = [
	{ component: "Combobox", props: [
		{ name: "label", type: "string", description: "Always visible. Names the trigger with the value: \"Location, Leeds\"." },
		{ name: "options", type: "{ value, label, description?, group?, disabled? }[]", description: "Matched on label and description, ignoring case and accents. Options with a group are listed under that heading." },
		{ name: "value · onValueChange", type: "string | null · (value) => void", description: "One value." },
		{ name: "multiple · value · onValueChange · max", type: "true · string[] · (value) => void · number", description: "Several values. Chosen ones are listed first when the list opens; the footer shows the count, the limit and Clear." },
		{ name: "noun", type: "{ one, many }", description: "Used in messages: Search locations, No locations match \"lee\"." },
		{ name: "onSearch · filter={null}", type: "(text) => void", description: "Server search: called 250ms after typing stops; the app passes the filtered options." },
		{ name: "loading · loadError · onRetry", type: "boolean · string · () => void", description: "\"Searching…\" appears only after one second. The error shows inside the list with Try again." },
		{ name: "onCreate", type: "(text) => option | void | Promise", description: "Offers Create \"text\" when nothing matches exactly. Return the new option to select it, or open an overlay side panel." },
		{ name: "hint · error · required · optional · disabled · readOnly · name", type: "", description: "As on TextField. name submits one hidden value per chosen option." },
	] },
	{ component: "matchOption", props: [{ name: "(option, text)", type: "boolean", description: "The default matching, for apps that filter part of a list themselves." }] },
];
