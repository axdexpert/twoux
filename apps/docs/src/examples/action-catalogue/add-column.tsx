import { ActionCatalogue, type CatalogueAction, toast } from "@twoux/ui";
import { AtSign, PenLine, Sigma, Tags } from "lucide-react";

export const meta = { title: "Add a column to 2,000 rows", description: "Search or pick a category, choose an action, then set it up. Paid actions test on 10 rows by default; the total for every row is shown before you add.", order: 1 };

const ACTIONS: CatalogueAction[] = [
	{ id: "email", name: "Find work email", description: "Looks up the person's work email in HubSpot from their name and company domain.", category: "Enrichment", suggested: true, provider: "hubspot", costPerRow: 0.5, inputs: [{ id: "domain", label: "Company domain column", options: ["Company domain", "Company"] }] },
	{ id: "account", name: "Company details from Salesforce", description: "Industry, headcount and account owner from the matching account.", category: "Enrichment", provider: "salesforce", costPerRow: 0.5 },
	{ id: "summary", name: "Summarise role", description: "One sentence on what the person does and whether they buy tools.", category: "AI", suggested: true, icon: <PenLine />, costPerRow: 1 },
	{ id: "industry", name: "Classify industry", description: "Puts each company into one of your industries, with the reason.", category: "AI", icon: <Tags />, costPerRow: 0.5 },
	{ id: "combine", name: "Combine columns", description: "Joins two or more columns with a separator you choose.", category: "Formulas", suggested: true, icon: <Sigma />, costPerRow: 0 },
	{ id: "domain", name: "Domain from email", description: "Takes the part after @ from an email column.", category: "Formulas", icon: <AtSign />, costPerRow: 0 },
	{ id: "sheet", name: "Add to a Google Sheet", description: "Appends each row to a sheet you choose and keeps it in step.", category: "Exports", provider: "google-sheets", costPerRow: 0 },
];

export default function Example() {
	return (
		<div className="w-full max-w-md rounded-sm border border-line p-4">
			<ActionCatalogue actions={ACTIONS} rowCount={2000} onAdd={(c) => toast.success(`Added “${c.columnName}”`, { description: c.run === "test" ? "Testing on 10 rows." : c.run === "all" ? "Running on 2,000 rows." : "Not run yet." })} />
		</div>
	);
}
