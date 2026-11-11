# Help panel

Read-only help in the right-hand panel slot, opened from an Info link next to a heading or label, with the topic heading, short guidance and Learn more links.

Kind: component · Group: Feedback and overlays · Status: built, import from @twoux/ui

## When to use

- To explain a page, section or field whose meaning or consequences aren't obvious from its label, opened from an Info link.
- On each step of a multi-step create flow, such as Create listing.
- As the page-level help for any page with decisions, opened from the Help button when no Info link was used.

## When not to use

- To name an icon or show a shortcut. Use a tooltip.
- For forms or actions. Use the side panel or the page.
- For questions about the person's data. Use the assistant panel (⌘J).

## Structure

1. Header: topic heading (matches the heading or label it opened from) and close button
2. Body: two to five short paragraphs or lists answering what this is, why it matters and how to choose
3. Optional: a short example, such as a well-written job title
4. Learn more: up to three help centre links, each opening in a new tab
5. Feedback prompt: "Was this helpful?" at the foot

## Guidelines

- Opens in TwoUX's single right-hand slot at 440px, or the width the person last chose, replacing any open panel, and restores it on close.
- Without an Info link pressed, shows the page topic. After an Info link, shows that topic until another is chosen or the page changes.
- Reopening on the same page shows the last topic, not the page default.
- Never opens empty: pages with no help content don't show the Help trigger.
- Below 860px it takes the full width of the canvas.

## Content

- Heading matches the on-screen heading or label exactly: "Visa sponsorship".
- Plain UK English, short paragraphs, no marketing. Explain consequences: "Candidates who need sponsorship can apply only if this is on."
- Learn more links say what the reader will learn: "How closing dates affect applications".

## Accessibility

- A complementary landmark labelled "Help"; it does not trap focus.
- Opening from an Info link moves focus to the topic heading; Esc or close returns focus to that Info link.
- New-tab links say so in their accessible name.
- Content reflows to 320px wide without horizontal scrolling.

## Keyboard

| Keys | Action |
|---|---|
| Enter / Space (Info link) | Open the help panel at that topic |
| Tab | Move through links in the panel, then back to the page |
| Esc | Close the panel and return focus to the Info link |

## Examples

### salary

```tsx
import { FeedbackPrompt, HelpPanel, type HelpTopic, InfoLink, TextField } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Help for one field", description: "The Info link opens written help for that topic in the right-hand slot. Esc closes it and focus returns to the link. It ends with up to three Learn more links and a feedback prompt.", order: 1 };

const TOPICS: Record<string, HelpTopic> = {
	salary: {
		id: "salary",
		title: "Salary range",
		body: (
			<>
				<p>Listings with a salary range get more applicants, and UK job boards rank them higher.</p>
				<p><strong>Show a real range.</strong> Use the band you would actually pay, not a range so wide it says nothing. For example £30,000 to £36,000.</p>
				<p><strong>Check the minimum.</strong> Full-time roles must pay at least the National Living Wage for the hours worked.</p>
			</>
		),
		links: [{ label: "National Minimum Wage and Living Wage rates (GOV.UK)", href: "https://www.gov.uk/national-minimum-wage-rates" }],
	},
};

export default function Example() {
	const [open, setOpen] = useState(false);
	const [topic, setTopic] = useState<HelpTopic | null>(null);
	return (
		<div className="flex h-96 w-full overflow-hidden rounded-sm border border-line bg-surface">
			<div className="grid min-w-0 flex-1 content-start gap-1.5 p-5">
				<div className="flex items-center gap-2"><span className="text-base font-medium text-ink">Salary</span><InfoLink topic="salary" onOpen={(t) => { setTopic(TOPICS[t]); setOpen(true); }} /></div>
				<TextField id="help-salary" label="Salary from" prefix="£" placeholder="30,000" />
			</div>
			<HelpPanel open={open} onOpenChange={setOpen} topic={topic} footer={<FeedbackPrompt onVote={() => new Promise((r) => setTimeout(r, 500))} />} />
		</div>
	);
}
```

## Related

- Contextual help
- Secondary panels: which right-hand panel
- Side panel (drawer)
- Assistant side panel
- Feedback prompt
- Tooltip
