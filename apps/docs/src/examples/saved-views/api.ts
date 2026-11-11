export const install = "";
export const api = [
	{ component: "SavedViews", props: [
		{ name: "views · value · onValueChange", type: "{ id, name, count? }[] · string", description: "Tabs with live counts. Keep the view and its filters in the URL." },
		{ name: "dirty", type: "boolean", description: "Filters, sort or columns differ from the saved view: shows Unsaved changes." },
		{ name: "onReset · onSave", type: "() => void", description: "Back to the saved state, or update the current view." },
		{ name: "onSaveAs", type: "(name) => void", description: "Save view dialog. The name is required and unique; both are checked on submit." },
		{ name: "onRename", type: "(id, name) => void", description: "Adds Rename view to the ⋮ menu, using the same name dialog. Show a toast with Undo." },
		{ name: "defaultId · onSetDefault", type: "string · (id) => void", description: "The view that opens when the URL has no filters. Set as default is unavailable while the view has unsaved changes, and says why." },
		{ name: "onDelete", type: "(id) => void", description: "Adds Delete view. It runs at once: show a toast with Undo, no dialog. Not offered on the only view." },
	] },
];
