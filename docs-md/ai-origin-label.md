# AI origin label

One small mark and short text on generated content, such as "Assistant · from your workspace data". No sparkle on every button and no separate AI colour.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- Under every assistant answer, with the feedback actions.
- On a generated column header, once for the group, not on every cell.
- Where generated and human content sit together, so people can tell them apart.

## When not to use

- On buttons that start an action. Name the action instead ("Draft titles"), and keep the mark for content.
- As decoration or branding across the product.
- To say where a value came from. Use Citations and sources (citations-sources).

## Structure

1. Assistant mark (icon)
2. Text (who and from what)
3. Optional time ("2 min ago")

## Guidelines

- Label the origin, not the feature. Say what produced it and from what.
- One mark per group of generated content: a column header, an answer.
- No separate AI colour. TwoUX uses its neutral palette plus a faint tint on generated columns, always with the mark and text.
- Do not use the sparkle as the universal AI sign; it loses meaning when it is everywhere.
- Generated output must also be machine-detectable as generated, for example a data attribute or metadata on the record.

## Content

- "Assistant · from your workspace data". Never "AI-powered", "smart" or "magic".
- When a person edits generated text, the label goes; the history keeps the original.

## Accessibility

- The mark is decorative (aria-hidden) and the text carries the meaning (SC 1.3.1, 1.4.1).
- The tint on generated columns must keep text contrast; the column header text identifies it (SC 1.4.11 for the mark).
- Use the same wording everywhere (SC 3.2.4).

## Examples

### labels

```tsx
import { AiOrigin } from "@twoux/ui";

export const meta = { title: "Say what made it, from what", description: "One small mark and plain words, once per group of generated content. No separate AI colour, no gradients.", order: 1 };

export default function Example() {
	return (
		<div className="grid gap-3">
			<AiOrigin from="your workspace data" time="2 min ago" />
			<AiOrigin from="24 listings and the 2026 salary bands" />
			<div className="rounded-sm border border-line bg-surface p-3"><AiOrigin from="the job description" /><p className="mt-1.5 text-base text-ink">Junior designer with a portfolio of 2 or 3 product case studies; Figma required; hybrid in Leeds.</p></div>
		</div>
	);
}
```

## Related

- Assistant side panel
- AI column
- Citations and sources
- Confidence note
- Why this choice
