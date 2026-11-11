# Filter pills and filter bar

Filters applied from one button in the toolbar and shown as segmented chips on their own row: each reads as a sentence, values apply as soon as they are ticked, and the row appears only while something is filtered.

Kind: component · Group: Data · Status: built, import from @twoux/ui

## When to use

- People filter a table by a few properties and need to see every active filter without opening anything.
- People combine several properties, values and operators on a large collection.
- Results load quickly enough for each change to apply live.

## When not to use

- When there are many fields to filter by, as in candidate search. Use the TwoUX Filter panel.
- For collections under about five items. Do not filter at all.
- For settings that always have a value, such as a chart's date range or Daily and Weekly. Use a rectangle control or the TwoUX segmented control.

## Structure

1. Filter button in the toolbar (F): fields, then the chosen field’s values beside them
2. Filter row, shown only once a filter is applied
3. Applied filter chip: field, operator, value, remove
4. Add another filter (+)
5. Result count
6. Clear

## Guidelines

- Shape says what a control does. A filter is a segmented chip (field, operator, value, remove) on the filter row; actions and view settings are buttons in the toolbar.
- Each chip reads field, operator, value, for example "Status is any of Live, Expiring". Three or more values are counted: "3 statuses".
- Put the filter button in the toolbar. Picking a field opens its values beside the field list, and the chip appears on the filter row only once a value is ticked, never as an empty suggestion.
- List values apply as soon as they are ticked and show how many rows each matches. Typed values (numbers, dates) apply on Enter.
- Put the result count and Clear at the end of the filter row, and filter the full collection, not only the loaded rows.
- Each chip can be removed on its own with the remove button at its end; + after the chips adds another field.

## Content

- Use "is", "is not" and "is any of" as operators, matching the field, operator, value token model.
- Dates offer quick picks first, then "in the last N days", then a calendar.
- Write the result count as a full phrase, "24 listings", not a bare number.
- Show the field name before the value so values like "2" or "London" are never ambiguous.

## Accessibility

- 4.1.3 Status Messages: announce the updated result count without moving focus.
- 4.1.2 Name, Role, Value: each remove button is named "Remove Status filter"; ticked values expose their checked state.
- 1.4.11 Non-text Contrast: the chip border must reach 3:1 against the filter row, since it is the chip’s only boundary.
- 2.1.4 Character Key Shortcuts: F can be turned off with the other single-key shortcuts.
- Moving focus or scroll back to the top after each change is avoided so people keep their place.

## Keyboard

| Keys | Action |
|---|---|
| F | Open the field list |
| ↑ ↓, Enter | Move through and choose fields or values |
| Space | Tick or untick a list value (applies at once) |
| Enter | Apply a typed number or date |
| Esc | Close the values, then the field list, and return focus to the filter button |

## Examples

### listings

```tsx
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
```

## Related

- Filter panel
- Saved views
- List table
- Data grid
