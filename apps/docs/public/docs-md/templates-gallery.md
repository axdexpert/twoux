# Templates gallery

A dialog with categories on the left, search on top and cards that say what each template does and which tools it uses; picking one opens it as a draft task.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- Starting a new task from a proven pattern, such as sourcing or reporting.
- Showing what agents can do to people who have not used them.

## When not to use

- Running a saved task you already use. Use / in the Message composer (message-composer).
- Quick prompts in the empty state. Use starters (follow-ups-starters).

## Structure

1. Category nav with search
2. Heading and Close
3. Template cards (name, what it does, tools used)

## Guidelines

- Picking a template opens it as a draft task, never runs it.
- Cards say what the template does and which tools it uses.
- Search and categories make browsing easy.
- Expose the inputs the template needs before running.
- Curate and retire templates so the gallery stays current.

## Content

- Names are tasks ("Find hiring managers for open roles").
- Descriptions say the outcome in one line.

## Accessibility

- The gallery is a dialog labelled "Start from a template"; focus moves in on open, Esc closes and focus returns (APG dialog).
- The category nav marks the current item with aria-current (SC 4.1.2, 1.3.1).
- Search announces the number of matching templates (SC 4.1.3).

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move between search, categories and cards |
| Enter | Open the template as a draft |
| Esc | Close the gallery |

## Examples

### gallery

```tsx
import { Button, TemplatesGallery, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Start from a template", description: "Categories, search and cards that say what each template does and which tools it uses. Picking one opens a draft task; it never runs.", order: 1 };

export default function Example() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button variant="outline" onClick={() => setOpen(true)}>Browse templates</Button>
			<TemplatesGallery
				open={open}
				onOpenChange={setOpen}
				onPick={(t) => { setOpen(false); toast(`Opened “${t.name}” as a draft`); }}
				templates={[
					{ id: "1", name: "Weekly pipeline summary", does: "Summarises new applicants and stage changes every Monday.", tools: ["Listings", "Slack"], category: "Reporting" },
					{ id: "2", name: "Listings at risk", does: "Finds listings closing soon with few applicants and proposes extensions.", tools: ["Listings"], category: "Listings" },
					{ id: "3", name: "Interview slots", does: "Suggests interview times from interviewers' calendars.", tools: ["Calendar"], category: "Interviews" },
					{ id: "4", name: "Job description review", does: "Checks a draft for salary, inclusive language and length.", tools: ["Listings", "Team files"], category: "Listings" },
				]}
			/>
		</>
	);
}
```

## Related

- Task builder
- Prompt editor with fields
- Follow-ups and starters
