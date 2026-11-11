# CSV import

A two-step dialog: choose a CSV file, its delimiter and header row; then match columns, read the problems before importing, preview the first 20 rows with problem cells marked, and import with the count on the button.

Kind: component · Group: Data · Status: built, import from @twoux/ui

## When to use

- Bringing rows from a spreadsheet into a table.

## When not to use

- For a single file attached to a record. Use File drop.
- For syncing a connected service. Use the connector and an automation.

## Structure

1. Step 1: File drop, Use the sample file, Delimiter, First row contains column names
2. Step 2: problem summary with what happens to bad rows
3. Field mapping
4. Preview of the first 20 rows, or only rows with problems, with Fix on problem cells
5. Footer: Back, Cancel, Import 1,248 rows

## Guidelines

- Show problems before importing, in a summary at the top that says what will happen to bad rows: skipped, or imported with the cells left empty.
- Mark problem cells in the preview with an icon and a word, and let people fix them in place.
- Put the number of rows on the Import button, so the result is known before pressing it.
- Accept the file by drop or by the Upload button, state the type and size limit, and explain a wrong file in words.
- Detect the delimiter and header row, and let people change both.
- Read dates day first, as in the UK (02/11/2026 is 2 November), accept ISO 8601 and written months (14 Mar 2026), and mark anything else, including impossible dates such as 31/02/2026, as Not a date. Hand dates to the app as ISO 8601 so it never re-reads them.

## Content

- Summary: "3 rows have an invalid email. They will be skipped or you can fix them."
- Wrong file: "That isn't a CSV file. Save the sheet as CSV and choose it again."

## Accessibility

- Progress is written as Step 2 of 2.
- The summary takes focus after a failed Import; problem cells have the word, not only a tint.

## Keyboard

| Keys | Action |
|---|---|
| Esc | Close the dialog |
| Enter (fixing) | Save the fixed value |
| Esc (fixing) | Cancel the fix |

## Examples

### leads

```tsx
import { Button, CsvImport, type MappingTarget, toast } from "@twoux/ui";
import { FileUp } from "lucide-react";
import { useState } from "react";

export const meta = { title: "Import event leads", description: "Use the sample file or choose your own CSV. The summary says what happens to rows with problems before anything is imported, and the button states how many rows will be added.", order: 1 };

const TARGETS: MappingTarget[] = [
	{ id: "name", label: "Name", kind: "text", required: true },
	{ id: "email", label: "Work email", kind: "email" },
	{ id: "company", label: "Company", kind: "text" },
	{ id: "size", label: "Company size", kind: "number" },
];
const SAMPLE = {
	name: "leads.csv",
	text: "Full name,E-mail,Company,Headcount,Country\nMaya Fischer,maya.fischer@larkfield.energy,Larkfield Energy,3100,UK\nRuairi Doyle,ruairi.doyle@pennine,Pennine Freight,1200,Ireland\nSana Iqbal,sana.iqbal@mosaiclending.co.uk,Mosaic Lending,410,UK\n,info@copperleaf.co.uk,Copperleaf Foods,780,UK\nTheo Clarke,theo.clarke@orrin.dev,Orrin Software,about 130,UK\nGrace Ndlovu,grace.ndlovu@harbourvale.co.uk,Harbour & Vale,240,UK",
};

export default function Example() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button variant="outline" onClick={() => setOpen(true)}><FileUp />Import CSV</Button>
			<CsvImport open={open} onOpenChange={setOpen} targets={TARGETS} tableName="People" sample={SAMPLE} aliases={{ email: ["e-mail"], size: ["headcount"] }} onImport={(r) => toast.success(`Imported ${r.rows.length} rows${r.skipped ? `, skipped ${r.skipped}` : ""}`)} />
		</>
	);
}
```

## Related

- Field mapping
- File drop
- Sheet grid
