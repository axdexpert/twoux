# AI column

A generated table column that fills one row at a time, cites each row, shows when it was written and never overwrites real data.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- Adding a judgement or summary per row, such as "Likely reason" for a low apply rate.
- When people need to compare many rows on the same question.

## When not to use

- Changing real fields such as title or closing date. Use Suggested changes (suggested-changes).
- One-off questions. Use the Assistant side panel (assistant-panel).
- Decisions about candidates that would filter or rank them for hiring. These are high-risk; keep them as human decisions with the assistant as a reference only.

## Structure

1. Header (assistant mark, name, "2 min ago", Refresh)
2. Cells (value and citation, writing state, failed state with Try again)
3. Add a column menu (suggested columns, Describe your own…)

## Guidelines

- Mark the header once and show when the column was written.
- Never overwrite real data; the column is separate and can be removed.
- Cells fill one by one with a visible state and a Stop. A failed cell says why ("The listing has no description") and offers Try again.
- Each cell cites its record.
- When source data changes, mark the column out of date instead of silently rewriting.
- Show the cost per row before running on the whole table, and test on a few rows first.

## Content

- Name columns by the question they answer ("Likely reason", "Risk of closing empty").
- Cell text is short and leads with the judgement: "Many views, few applies."
- Failed cells explain in plain words and say what to do.

## Accessibility

- Follow the grid pattern: arrow keys move between cells, Enter or F2 to act, Esc to return (APG grid).
- Header is a columnheader; the Refresh button has a name ("Refresh column") (SC 4.1.2).
- Announce progress and completion ("12 of 24 written") as a status message (SC 4.1.3); filling cells is auto-updating content that needs Stop (SC 2.2.2).
- Writing, failed and out-of-date states use text, not colour alone (SC 1.4.1).

## Keyboard

| Keys | Action |
|---|---|
| Arrow keys | Move between cells |
| Enter / F2 | Act on the cell, for example Try again |
| Esc | Return to grid navigation |

## Examples

### summaries

```tsx
import { AiCell, type AiCellState, AiColumnHeader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@twoux/ui";
import { useEffect, useState } from "react";

export const meta = { title: "A generated column", description: "Marked once in the header with when it was written. Cells fill one at a time, each cites its record, and a failed cell says why with Try again. Real data is never overwritten.", order: 1 };

const ROWS = [["LST-1040", "Junior Product Designer", "Portfolio, Figma, hybrid in Leeds"], ["LST-1041", "Frontend Engineer", "React and TypeScript, 3+ years"], ["LST-1043", "Recruitment Coordinator", ""], ["LST-1045", "QA Engineer", "Playwright, CI, test plans"]];

export default function Example() {
	const [n, setN] = useState(0);
	useEffect(() => { if (n < ROWS.length) { const t = setTimeout(() => setN((x) => x + 1), 600); return () => clearTimeout(t); } }, [n]);
	const cell = (i: number): AiCellState => (i > n ? { state: "queued" } : i === n ? { state: "writing" } : ROWS[i][2] ? { state: "done", value: ROWS[i][2], source: ROWS[i][0] } : { state: "failed", reason: "The listing has no description" });
	return (
		<div className="w-full overflow-hidden rounded-sm border border-line">
			<Table aria-label="Listings with requirements summary">
				<TableHeader><TableRow><TableHead>Listing</TableHead><TableHead className="bg-primary-soft/40"><AiColumnHeader name="Key requirements" written={n >= ROWS.length ? "just now" : "writing"} onRefresh={() => setN(0)} /></TableHead></TableRow></TableHeader>
				<TableBody>{ROWS.map((r, i) => <TableRow key={r[0]}><TableCell className="font-medium text-ink">{r[1]}</TableCell><TableCell className="max-w-72 bg-primary-soft/20"><AiCell cell={cell(i)} onRetry={() => setN(i)} /></TableCell></TableRow>)}</TableBody>
			</Table>
		</div>
	);
}
```

## Related

- Prompt editor with fields
- Citations and sources
- AI origin label
