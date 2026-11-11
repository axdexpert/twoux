import { Badge, FilterButton, type FilterFieldDef, FilterRow, type FilterValue, Table, TableBody, TableCell, TableRow, Timestamp, dateFilterFromValues, resolveDateRange } from "@twoux/ui";
import { useState } from "react";
import { LISTINGS, type Listing, STATUS_VARIANT } from "../list-table/data";

export const meta = {
	title: "Filter listings",
	description: "The filter button sits in the toolbar. Pick a field, then tick its values beside the list: each tick applies at once, and the filter shows as a chip on its own row only once it has a value. A date field (Closing date) opens typed dates and a calendar instead. + adds another field; Clear removes them all.",
	order: 1,
};

const FIELDS = [
	{ id: "status", label: "Status", noun: { one: "status", many: "statuses" } },
	{ id: "location", label: "Location", noun: { one: "location", many: "locations" } },
	{ id: "role", label: "Role", noun: { one: "role", many: "roles" } },
] as const;

export default function Example() {
	const [filters, setFilters] = useState<FilterValue>({ status: ["Open", "Closing soon"] });
	const matches = (l: Listing, skip?: string) =>
		Object.entries(filters).every(([f, vals]) => {
			if (f === skip) return true;
			if (f !== "closes") return vals.includes(String(l[f as keyof Listing]));
			// A date field holds dateFilterToValues; resolveDateRange turns it into the dates to compare.
			const { from, to } = resolveDateRange(dateFilterFromValues(vals, []));
			return (!from || l.closes >= from) && (!to || l.closes <= to);
		});
	const rows = LISTINGS.filter((l) => matches(l));
	// Counts reflect the other filters, so people see what a tick will give them.
	const fields: FilterFieldDef[] = [
		...FIELDS.map((f) => ({
			id: f.id,
			label: f.label,
			valueNoun: f.noun,
			options: [...new Set(LISTINGS.map((l) => String(l[f.id])))].sort().map((v) => ({ value: v, label: v, count: LISTINGS.filter((l) => matches(l, f.id) && String(l[f.id]) === v).length })),
		})),
		// Closing dates are in the future, so "last 30 days" presets mean nothing here: typed dates and the calendar only.
		{ id: "closes", label: "Closing date", kind: "date", presets: [], group: "All fields" },
	];

	return (
		<div className="grid w-full max-w-2xl overflow-hidden rounded-sm border border-line bg-surface">
			<div className="flex items-center gap-2 border-b border-line px-3 py-2">
				<span className="text-base font-medium text-ink">Listings</span>
				<span className="flex-1" />
				<FilterButton fields={fields} value={filters} onChange={setFilters} />
			</div>
			<FilterRow fields={fields} value={filters} onChange={setFilters} shown={rows.length} total={LISTINGS.length} noun="listings" className="border-b border-line bg-surface-2 px-3 py-2" />
			<div className="max-h-56 overflow-y-auto">
				<Table aria-label="Filtered listings">
					<TableBody>
						{rows.map((l) => (
							<TableRow key={l.id}>
								<TableCell className="font-medium text-ink">{l.role}</TableCell>
								<TableCell className="text-ink-2">{l.location}</TableCell>
								<TableCell className="text-ink-2"><Timestamp value={l.closes} format="date" short /></TableCell>
								<TableCell><Badge variant={STATUS_VARIANT[l.status]} dot>{l.status}</Badge></TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
