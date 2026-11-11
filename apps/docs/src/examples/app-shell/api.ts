export const install = "";
export const api = [
	{
		"component": "AppShell",
		"props": [
			{
				"name": "sidebar · topBar · panel",
				"type": "ReactNode",
				"description": "Sidebar content, the top bar (breadcrumb and page controls) and the right-hand slot."
			},
			{
				"name": "children",
				"type": "ReactNode",
				"description": "The page. Below 860px the sidebar moves into a sheet behind the menu button."
			},
			{
				"name": "sidebarRail · onSidebarRailChange",
				"type": "boolean · (rail) => void",
				"default": "false",
				"description": "Shows the sidebar as a 48px rail of icons, each named in a tooltip. Passing onSidebarRailChange adds the Collapse sidebar button and ⌘B / Ctrl+B. Save the choice per person. useSidebarRail() lets sidebar content such as a logo shrink with it."
			},
			{
				"name": "frame",
				"type": "\"inset\" | \"flush\"",
				"default": "\"inset\"",
				"description": "\"flush\" turns on workspace density, only for tool pages that pass the three tests on the Content density page (several regions watched together, long expert sessions, mostly numbers or tables). The canvas goes edge to edge; inside it ChartFrame and SheetGrid drop their frames and PageHeader tightens its padding. Sizes never change. Components read it with useWorkspace()."
			},
			{
				"name": "sidebarCollapsed",
				"type": "boolean",
				"default": "false",
				"description": "Focus mode: hides the sidebar on wide screens; the menu button still opens it."
			}
		]
	},
	{
		"component": "SidebarSection · SidebarItem",
		"props": [
			{
				"name": "title",
				"type": "string",
				"description": "Group heading. Two levels at most."
			},
			{
				"name": "label · icon · count · current · href | onClick",
				"type": "…",
				"description": "Text on every item; current sets aria-current and the fill."
			}
		]
	}
];
