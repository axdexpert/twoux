# Assistant page

The same conversation opened as a full page, with Answer and Records tabs and a Sources panel listing every record the answer used.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- Answers that rely on many records and need checking. The Sources panel lists every record so people can verify without hunting.
- Research-style questions across the whole workspace, such as Thorough answers that also read candidates and past listings.
- When the person wants to keep the answer as the main task, not as help beside a table.

## When not to use

- A quick question about the rows on screen. Use the Assistant side panel (assistant-panel) so the table stays visible.
- Watching an agent work through steps over time. Use the Agent run timeline (agent-run).
- Browsing past conversations. Use Previous conversations (conversation-history).

## Structure

1. Top bar (Answer and Records tabs, Share, Open in side panel)
2. Centred reading column (thread)
3. Records tab (the rows the answer used, as a table)
4. Sources panel (every cited record)
5. Message box

## Guidelines

- Expand opens the same conversation; "Open in side panel" goes back without losing the thread, context or scroll position.
- Use a centred reading column and align messages user to the end, assistant to the start, on full, dedicated surfaces.
- The Sources panel lists every record the answer used. Selecting a citation highlights its source in the panel.
- The Records tab shows the rows behind the answer as a table that can open as a filtered view, so the claim and the data sit one click apart.
- Say when there are no sources rather than showing filler: empty states keep trust.
- Long task conversations get an outline: a list of key moments (question asked, values given, changes applied) that jumps to each message.
- Long drafts open here beside the conversation rather than in a second panel.

## Content

- Tabs are nouns: Answer and Records (with a count). Avoid branded names for modes or tabs.
- Source rows show the record ID, title and what was used (for example "Views and applies, last 30 days").
- Keep the same caveat and origin label as in the panel so the two surfaces read as one product.

## Accessibility

- Answer and Records use the tabs pattern: role="tablist", role="tab" with aria-selected and aria-controls, arrow keys move between tabs.
- The Sources panel is an aside labelled "Sources" so it is reachable as a landmark.
- Highlighting a source after a citation is selected must not rely on colour alone; add an outline or marker (SC 1.4.1).
- New answers are announced through the thread's log region without moving focus (SC 4.1.3).

## Keyboard

| Keys | Action |
|---|---|
| Left / Right arrow | Move between Answer and Records tabs |
| Tab | Move from the tabs into the panel content |
| ⌘J / Ctrl+J | Focus the message box |
| Enter | Send |
| Esc | Close an open menu |

## Examples

### page

```tsx
import { AssistantMessage, AssistantPage, Citation, MessageComposer, SourcesList, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, UserMessage } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "The conversation as a full page", description: "A centred reading column with Answer and Records tabs, and a Sources panel listing every record the answer used. Selecting a citation highlights its source.", order: 1 };

const SOURCES = [{ id: "LST-1041", title: "Frontend Engineer", detail: "Manchester · 6 applicants" }, { id: "LST-1044", title: "Customer Success Lead", detail: "Bristol · 3 applicants" }];

export default function Example() {
	const [active, setActive] = useState<string>();
	return (
		<div className="h-120 w-full overflow-auto rounded-sm border border-line bg-surface">
			<AssistantPage
				thread={
					<>
						<UserMessage>Which listings close this week with fewer than 10 applicants?</UserMessage>
						<AssistantMessage from="24 listings">
							<p><strong>2 listings</strong>: Frontend Engineer <Citation id="LST-1041" active={active === "LST-1041"} onOpen={setActive} /> and Customer Success Lead <Citation id="LST-1044" active={active === "LST-1044"} onOpen={setActive} />.</p>
						</AssistantMessage>
					</>
				}
				records={<Table aria-label="Records used"><TableHeader><TableRow><TableHead>Listing</TableHead><TableHead className="text-right">Applicants</TableHead></TableRow></TableHeader><TableBody>{SOURCES.map((s) => <TableRow key={s.id}><TableCell>{s.title}</TableCell><TableCell className="tabular text-right">{s.detail?.split("· ")[1]}</TableCell></TableRow>)}</TableBody></Table>}
				sources={<SourcesList sources={SOURCES} active={active} onSelect={setActive} />}
				composer={<MessageComposer noun={{ one: "listing", many: "listings" }} onSend={() => {}} placeholder="Ask a follow-up" />}
			/>
		</div>
	);
}
```

## Related

- Assistant side panel
- Citations and sources
- Message composer
- Follow-ups and starters
- Tabs (underline)
