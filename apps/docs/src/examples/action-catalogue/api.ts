export const install = "";
export const api = [
	{
		component: "ActionCatalogue",
		props: [
			{ name: "actions", type: "{ id, name, description, category, suggested?, provider?, icon?, costPerRow, inputs? }[]", description: "category: Enrichment, AI, Formulas or Exports. provider shows the service's logo; icon is a lucide icon otherwise." },
			{ name: "rowCount", type: "number", description: "Rows in the table now, for the estimate: About 1,000 credits for 2,000 rows." },
			{ name: "testRows", type: "number", default: "10", description: "Rows in the default test run for paid actions." },
			{ name: "onAdd", type: "({ action, columnName, inputs, run }) => void", description: "run: test, all or none. Put the component in a SidePanel titled Add column." },
		],
	},
];
