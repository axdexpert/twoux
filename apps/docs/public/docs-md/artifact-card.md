# Generated file card

A compact card under an answer for one thing the assistant made: name, type and size, origin label, and up to two actions with the rest in a More menu.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- For each draft or file the assistant produced in an answer.
- In agent run results when a step produced a file.
- For a short command or snippet a person will copy into another tool.

## When not to use

- For records that already exist. Cite them by ID instead.
- For files people attached. Those are context chips in the composer.
- For a figure or short table that answers the question. Keep it in the answer text.

## Structure

1. Icon for the type (document, table, chart, code)
2. Title: file name or what it is
3. Metadata: type, size in KB or MB, rows or words
4. Origin label with sources on hover
5. Actions: up to two buttons (Open, Download, Copy, Suggest for record) and More (⋯)
6. Inline preview (optional): first lines of a snippet, or the chart image

## Guidelines

- One card per output, stacked under the answer in the order they were made.
- Code and commands preview in the Code block style with Copy; long previews cut at about eight lines with Open for the rest.
- While a file is being made, the card shows a skeleton line and "Writing job description"; text around it may stream, the card does not.
- If making the file failed, the card says why and offers Try again; other cards in the answer stay.

## Content

- Sizes in KB, MB or GB with one decimal at most: "1.2 MB".
- Loading text names the thing: "Writing job description", "Loading 38 listings".
- Title is the file name or a plain description, never "Artifact" or "Output 1".

## Accessibility

- The card is a group with an accessible name from its title.
- Action names include the file: "Open job description".
- The More menu follows the menu button pattern.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Reach the card's actions in order |
| Enter | Run the focused action |
| ↓ / ↑ | Move through the More menu |
| Esc | Close the More menu |

## Examples

### draft

```tsx
import { ArtifactCard, Button, toast } from "@twoux/ui";
import { useEffect, useState } from "react";

export const meta = { title: "A draft the assistant made", description: "One card per output, with type and size, the origin label and two actions. While it is being written, the card says so; the draft reaches the record only through Suggest for record.", order: 1 };

export default function Example() {
	const [writing, setWriting] = useState(true);
	useEffect(() => { const t = setTimeout(() => setWriting(false), 1400); return () => clearTimeout(t); }, []);
	return (
		<div className="w-full max-w-lg">
			<ArtifactCard
				title="Job description"
				meta="Document · 312 words"
				from="LST-1044 and the hiring handbook"
				writing={writing}
				actions={<><Button variant="outline" size="xs" onClick={() => toast("Proposed for LST-1044")}>Suggest for record</Button><Button variant="ghost" size="xs">Open</Button></>}
				preview={<p>Customer Success Lead, Bristol (hybrid). £45,000 to £52,000. You'll look after 40 hiring teams, help them get value from TwoUX in their first 90 days…</p>}
			/>
		</div>
	);
}
```

## Related

- Generated drafts and files
- Code block
- AI origin label
- Answer actions
