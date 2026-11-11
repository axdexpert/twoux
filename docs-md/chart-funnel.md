# Funnel

Horizontal bars for ordered stages (views, applies, interviews, offers) that show each stage's count and its rate from the stage before, darkest to lightest.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- Showing ordered stages where people care how many make it from one step to the next.
- Comparing amounts at each stage, which simple bars make quick to read.

## When not to use

- For unordered categories. Use the TwoUX Bar chart.
- For change over time. Use the TwoUX Line chart card.

## Structure

1. Title and subtitle (scope, starting count)
2. Stage label
3. Bar (length by count)
4. Count
5. Rate from the previous stage

## Guidelines

- Encode counts as bar length from a shared left edge; length is judged accurately.
- Show each stage's rate from the stage before; that is the number people act on.
- Stages go darkest to lightest in one hue, following order.
- Write counts beside bars so colour and length are not the only cues.
- Show the four states: skeleton bars while loading, empty, no match with Clear filters, error with Try again.
- A stage's count links to the List table filtered to that stage, so people go from "Interviewed 42" to those 42 candidates.
- Do not use a donut for stages; order is the point and a ring loses it.

## Content

- Stage names are the steps people use, "Viewed", "Applied", "Interviewed".
- The subtitle states the base, "from 6,840 views".
- Write rates as percentages with the same decimals on every stage.

## Accessibility

- 1.1.1 Non-text Content: the accessible name lists each stage with its count.
- 1.4.11 Non-text Contrast: the lightest stage bar still reaches 3:1, or the printed count carries the value.
- 1.3.1 Info and Relationships: stages are in reading order in the markup.
- Stage links are named by stage and count: "View 42 interviewed candidates".
- Arrow keys move between stages when the funnel is focused.

## Examples

### pipeline

```tsx
import { ChartFrame, Funnel } from "@twoux/ui";

export const meta = { title: "Hiring funnel", description: "Ordered stages as horizontal bars. Each stage shows its count and the share that moved on from the stage before.", order: 1 };

export default function Example() {
	return (
		<ChartFrame className="w-full max-w-2xl" title="Pipeline, this quarter" description="All listings">
			<Funnel aria-label="Hiring funnel this quarter" stages={[{ label: "Viewed", value: 8420 }, { label: "Applied", value: 595 }, { label: "Screened", value: 126 }, { label: "Interviewed", value: 48 }, { label: "Offered", value: 9 }]} />
		</ChartFrame>
	);
}
```

## Related

- Bar chart
- Stat card with comparison
- Data visualisation colours
