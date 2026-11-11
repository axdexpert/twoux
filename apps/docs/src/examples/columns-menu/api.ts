export const install = "";
export const api = [
	{
		component: "ColumnsMenu",
		props: [
			{ name: "columns", type: "{ id, label, type?, provider?, hidden?, locked? }[]", description: "In table order. SheetColumn works as is. Locked columns are always shown." },
			{ name: "onChange", type: "(columns) => void", description: "Called on every toggle and move; there is no Apply." },
			{ name: "wrap · onWrapChange", type: "boolean · (wrap) => void", description: "List tables: shows Wrap long text. Applies at once." },
			{ name: "pageSize · pageSizes · onPageSizeChange", type: "number · number[] · (size) => void", default: "pageSizes [25, 50, 100]", description: "List tables: shows Rows per page as a radio group. Reset to the first page when it changes." },
			{ name: "note", type: "string", description: "Where the choice is kept, such as \"Saved for you on this table\"." },
			{ name: "align", type: "\"start\" | \"end\"", default: "\"end\"", description: "Which edge of the button the menu lines up with." },
		],
	},
];
