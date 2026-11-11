# Field mapping

A list of target fields, each with the source column that fills it: required fields marked, type mismatches warned in words, and other source columns skipped or created as new columns. Used by imports and, later, automations.

Kind: component · Group: Data · Status: built, import from @twoux/ui

## When to use

- When data from one place fills fields in another: a CSV import, a connected service, an automation step.

## When not to use

- For choosing which columns show. Use the Columns menu.

## Structure

1. Headings: Field in the table, Column in the file
2. Row: type icon, field name, Required, arrow, source select with a sample value
3. Warning under a row: 3 of 20 values aren't an email address
4. Other columns in the file: Don't import or Create column

## Guidelines

- Map by name automatically, ignoring case and punctuation, and let people change every pair.
- Mark required fields in words, and check them when people submit, not by disabling the button.
- Warn about values that don't fit the field type under that row, with how many.
- Offer Create column for source columns no field uses, defaulting to Don't import.

## Content

- Warnings name the column and the type: "3 of 20 values in E-mail aren't an email address."

## Accessibility

- Each select is labelled by its field name; warnings are linked with aria-describedby.
- Warnings carry an icon and words, not colour alone.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move between selects |
| Space / Enter | Open a select |

## Examples

### automation

```tsx
import { type ExtraColumns, type FieldMap, FieldMapping, type MappingSource, type MappingTarget, autoMapFields } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Map a form's answers to table fields", description: "Fields with matching names are paired automatically. Required fields are marked, values that don't fit the field type are warned about, and unused columns can become new columns.", order: 1 };

const TARGETS: MappingTarget[] = [
	{ id: "name", label: "Name", kind: "text", required: true },
	{ id: "email", label: "Work email", kind: "email", required: true },
	{ id: "size", label: "Company size", kind: "number" },
	{ id: "start", label: "Start date", kind: "date" },
];
const SOURCES: MappingSource[] = [
	{ id: "q1", label: "Your name", samples: ["Ana Silva", "Ben Hughes", "Chloe Patel"] },
	{ id: "q2", label: "Email", samples: ["ana@harbourvale.co.uk", "ben at brightwater", "chloe@mosaiclending.co.uk"] },
	{ id: "q3", label: "Company size", samples: ["240", "about 150", "410"] },
	{ id: "q4", label: "How did you hear about us?", samples: ["Event", "Search"] },
];

export default function Example() {
	const [map, setMap] = useState<FieldMap>(() => ({ ...autoMapFields(TARGETS, SOURCES), name: "q1" }));
	const [extra, setExtra] = useState<ExtraColumns>({});
	return <FieldMapping className="w-full max-w-2xl" targets={TARGETS} sources={SOURCES} value={map} onChange={setMap} extra={extra} onExtraChange={setExtra} sourceHeading="Answer in the form" />;
}
```

## Related

- CSV import
- Sheet grid
