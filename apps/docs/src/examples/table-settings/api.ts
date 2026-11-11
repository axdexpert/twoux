export const install = "";
export const api = [
	{
		component: "TableSettings",
		props: [
			{ name: "open · onOpenChange · mode", type: "boolean · (open) => void · \"push\" | \"overlay\"", description: "Renders in the SidePanel slot. Closing with unsaved changes asks Discard changes? first." },
			{ name: "value · onSave", type: "{ duplicates, matchOn, deleteEmptyRows, template: { shared, audience } } · (value) => void | Promise", description: "Save shows Saving until the promise settles, then a toast." },
			{ name: "columns", type: "{ id, label }[]", description: "Columns that can identify a duplicate." },
			{ name: "tableName · workspaceName · templateLink", type: "string", description: "Used in the copy and the template link field." },
		],
	},
];
