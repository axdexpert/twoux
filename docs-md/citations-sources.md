# Citations and sources

Record IDs inline in answers that open the record, plus a Sources panel on the full page listing every record and file the answer used.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- Every claim about a record or figure in an answer or an AI column cell.
- When an answer relies on a team file, cite the file.

## When not to use

- Generic wording with no factual claim. Do not add filler citations.
- To label content as generated. Use the AI origin label (ai-origin-label).

## Structure

1. Inline citation (record ID, for example LST-1044)
2. Sources panel (record rows, files)
3. Highlight state on the cited source

## Guidelines

- Citations are record IDs that open the record, so checking takes one click.
- In the panel, a citation focuses the row in the table; on the full page it highlights the source in the Sources panel.
- Place citations at the end of the claim they support, consistently.
- Say when a source is missing or stale rather than showing an empty state that implies success.
- Point to the exact data used where possible (views, applies, period).

## Content

- Use the record's own ID format (LST-1044), not numbers like [1], so the citation is meaningful on its own.
- Sources list title, ID and what was read.

## Accessibility

- Citations are links with an accessible name that includes the record, for example "LST-1044, Operations Coordinator" (SC 2.4.6, 4.1.2).
- Do not signal citations by colour alone; use the chip shape (SC 1.4.1).
- Moving focus to the cited row must keep that row visible (SC 2.4.11).

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move to the next citation |
| Enter | Open or highlight the cited record |

## Examples

### cite

```tsx
import { Citation, SourcesList } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Every claim names its record", description: "Citations are record IDs at the end of the claim. Selecting one highlights the source; on a list page it would focus the row.", order: 1 };

const SRC = [{ id: "LST-1041", title: "Frontend Engineer", detail: "6 applicants · closes 21 Nov" }, { id: "LST-1044", title: "Customer Success Lead", detail: "3 applicants · closes 23 Nov" }];

export default function Example() {
	const [a, setA] = useState<string>();
	return (
		<div className="grid w-full max-w-2xl grid-cols-[1fr_240px] gap-4 max-md:grid-cols-1">
			<p className="text-base text-ink">Two listings close this week with fewer than 10 applicants: Frontend Engineer <Citation id="LST-1041" active={a === "LST-1041"} onOpen={setA} /> and Customer Success Lead <Citation id="LST-1044" active={a === "LST-1044"} onOpen={setA} />.</p>
			<SourcesList sources={SRC} active={a} onSelect={setA} />
		</div>
	);
}
```

## Related

- Assistant page
- AI column
- Team instructions and files
- AI origin label
- Confidence note
- Why this choice
