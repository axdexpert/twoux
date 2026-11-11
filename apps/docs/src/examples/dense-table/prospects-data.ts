// The TwoUX prospects table from the Data workspace example, with only columns people type into,
// so every cell is editable. Shared by the dense examples on the Dense table and Sheet grid pages.
import type { SheetColumn, SheetRow } from "@twoux/ui";
import { COLUMNS, PEOPLE } from "../../pages/examples/data-workspace/data";

const EDITABLE = ["name", "company", "title", "stage", "seniority", "owner", "deal", "probability", "closes", "subscribed", "employees", "domain"];

export const PROSPECT_COLUMNS: SheetColumn[] = EDITABLE.map((id) => {
	const c = COLUMNS.find((x) => x.id === id)!;
	// Probability is a plain number here, so it stays editable on won and lost deals too.
	return id === "probability" ? { ...c, notApplicable: undefined } : { ...c, hidden: false };
});

export const prospectRows = (count = 60): SheetRow[] =>
	PEOPLE.slice(0, count).map(({ id, ...p }) => ({ id, values: { ...p, probability: p.probability ?? 0 } }));
