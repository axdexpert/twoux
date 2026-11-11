# Side panel (drawer)

A panel on the right that shows the selected row's detail beside the table, in push (default) or overlay mode; 440px by default and resizable from 360px to half the canvas in push mode.

Kind: component · Group: Feedback and overlays · Status: built, import from @twoux/ui

## When to use

- Viewing or editing one record while the list stays in view, such as a listing's figures beside the listings table.
- Working down a list one record at a time: J and K move the selection and the panel follows.
- Secondary tasks that should not take the person off the page, such as the Assistant's quick questions.

## When not to use

- The full picture of one record, with history and long sections. Open the full page (⇧↵).
- A decision that must interrupt the task. Use a Confirmation dialog.
- Confirming an action. Use a Toast.
- Comparing many records side by side. Use the table with the chosen columns.

## Structure

1. Control bar without a title: previous, next, position ("3 of 9"), open full page, close
2. Record ID, title and status line
3. Tabs (Overview, Candidates, Activity)
4. Sections split by full-width rules, each with a 13px heading and one action on the right
5. Empty fields show "Add"
6. Pinned footer: destructive action left, primary right

## Guidelines

- Push mode (default) on list pages: the table narrows so filters, page actions and the first columns stay usable and nothing is hidden behind the panel.
- Overlay mode when the page is narrower than about 1100px, or for wide content (dashboards, wide tables) that pushing would crush. The first columns stay visible.
- One component with mode="push" | "overlay"; the person can switch with ⇧P and the choice is remembered.
- Opens only from a person's action (Enter or a click on a row), never on its own.
- Esc closes it and focus returns to the row it came from.
- Do not repeat table header actions inside the panel; the footer holds actions for this record only.
- Below 860px the panel takes the full width of the canvas.
- A panel for one thing, such as settings or a form, has its title in the 44px header bar, with the object it belongs to beside it in muted text (Table settings · People) and Close on the right. A record panel that steps through a list keeps previous, next and the position in the bar, and shows the record's name and status under it.

## Content

- The control bar has no title; the record's own title sits below it, matching the row the person picked.
- Section headings are short nouns ("Performance", "Funnel", "Details") with one action each.
- Empty fields say "Add" and the field name rather than a dash, so the gap is an invitation, not an error.
- Figures sit next to a comparison ("vs board median") so a number can be judged without leaving.

## Accessibility

- The panel is a non-modal complementary region with a label; it does not trap focus, so J/K keep driving the table (2.1.2).
- In overlay mode the panel must not cover the focused row; the table scrolls the active row into the visible part (2.4.11).
- Tabs inside the panel follow the APG tabs pattern with arrow keys between tabs.
- Push and overlay both reflow to a single column at 320px wide without horizontal scrolling of text (1.4.10).
- Focus order inside the panel follows reading order: control bar, title, tabs, sections, footer (2.4.3).

## Keyboard

| Keys | Action |
|---|---|
| Enter | Open the panel for the focused row |
| J / K | Next or previous row; the panel follows |
| ⇧↵ | Open the record as a full page |
| ⇧P | Switch between push and overlay |
| Esc | Close the panel and return focus to the row |

## Examples

### record

```tsx
import { Badge, Button, PanelMode, SegmentedControl, Segment, SidePanel, Table, TableBody, TableCell, TableRow, Timestamp } from "@twoux/ui";
import { useState } from "react";
import { LISTINGS, STATUS_VARIANT } from "../list-table/data";

export const meta = { title: "Record beside the list", description: "Push mode narrows the table so the first columns stay usable; overlay floats over it. J and K move through records with the panel following; Esc closes and focus returns to the row.", order: 1 };

const ROWS = LISTINGS.slice(0, 6);

export default function Example() {
	const [open, setOpen] = useState<number | null>(1);
	const [mode, setMode] = useState<PanelMode>("push");
	const rec = open === null ? null : ROWS[open];
	return (
		<div className="grid w-full gap-2">
			<SegmentedControl value={mode} onValueChange={(v) => setMode(v as PanelMode)} size="sm" aria-label="Panel mode" className="justify-self-start">
				<Segment value="push">Push</Segment><Segment value="overlay">Overlay</Segment>
			</SegmentedControl>
			<div className="flex h-96 overflow-hidden rounded-sm border border-line bg-surface">
				<div className="min-w-0 flex-1 overflow-auto">
					<Table aria-label="Listings">
						<TableBody>
							{ROWS.map((l, i) => (
								<TableRow key={l.id} data-state={open === i ? "selected" : undefined} tabIndex={0} onClick={() => setOpen(i)} onKeyDown={(e) => { if (e.key === "Enter") setOpen(i); }} className="cursor-default">
									<TableCell className="font-medium text-ink">{l.role}</TableCell>
									<TableCell className="text-ink-2">{l.location}</TableCell>
									<TableCell><Badge variant={STATUS_VARIANT[l.status]} dot>{l.status}</Badge></TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				{rec && (
					<SidePanel
						open={open !== null}
						onOpenChange={(o) => !o && setOpen(null)}
						mode={mode}
						label="Listing details"
						title={rec.role}
						meta={<span className="flex items-center gap-2"><span className="font-mono">{rec.id}</span><Badge variant={STATUS_VARIANT[rec.status]} dot>{rec.status}</Badge></span>}
						position={{ index: open ?? 0, total: ROWS.length }}
						onPrevious={() => setOpen((o) => Math.max(0, (o ?? 0) - 1))}
						onNext={() => setOpen((o) => Math.min(ROWS.length - 1, (o ?? 0) + 1))}
						onOpenFull={() => {}}
						footer={<Button size="sm">Edit listing</Button>}
					>
						<dl className="grid grid-cols-[120px_1fr] gap-x-3 gap-y-2 text-base">
							<dt className="text-ink-2">Location</dt><dd className="text-ink">{rec.location}</dd>
							<dt className="text-ink-2">Applicants</dt><dd className="tabular text-ink">{rec.applicants}</dd>
							<dt className="text-ink-2">Closes</dt><dd><Timestamp value={`${rec.closes}T17:00:00Z`} format="absolute" /></dd>
							<dt className="text-ink-2">Hiring manager</dt><dd><Button variant="link" size="xs">Add</Button></dd>
						</dl>
					</SidePanel>
				)}
			</div>
		</div>
	);
}
```

## Related

- App shell and sidebar navigation
- Command palette (⌘K)
- Confirmation dialog
- Loading skeleton
