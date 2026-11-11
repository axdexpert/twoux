export const install = "";
export const api = [
	{
		"component": "DataGrid",
		"props": [
			{
				"name": "columns",
				"type": "{ id, label, width, pin?, editable?, type?, validate?, total? }[]",
				"description": "Pin the identifying column. validate returns a message to block the save. total: sum or average of rows shown."
			},
			{
				"name": "rows · onCellChange",
				"type": "{ id, … }[] · (rowId, colId, value) => void",
				"description": "Save per cell; show Undo for bulk changes."
			},
			{
				"name": "selectedRowIds · onSelectedRowIdsChange",
				"type": "string[] · (ids) => void",
				"description": "Adds a pinned checkbox column with select all. Shift+Space toggles the active row."
			},
			{
				"name": "bulkActions · noun",
				"type": "BulkAction[] · string",
				"description": "Actions for the bulk action bar shown above the header while rows are selected (extras move into More); noun names the count (\"2 listings selected\")."
			},
			{
				"name": "aria-label",
				"type": "string",
				"description": "Names the grid. One tab stop; arrows move; Enter or F2 edits."
			}
		]
	}
];
