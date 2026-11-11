# Box plot

Distributions of several groups on one axis: a box for the middle half, a line for the median, whiskers to 1.5 times the IQR and dots for outliers.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- Comparing how spread out several groups are, such as response times by team.
- Finding outliers worth opening, such as the slowest tickets.

## When not to use

- For one group's shape. Use the TwoUX Histogram.
- For audiences new to statistics; show median and range in a table or a range plot instead.

## Structure

1. Title and subtitle
2. Group labels
3. Shared value axis with title and unit
4. Box from Q1 to Q3
5. Median line
6. Whiskers with caps
7. Outlier dots
8. Legend explaining the parts
9. Tooltip: median, middle half, whiskers, outliers

## Guidelines

- Put every group on one shared axis.
- Whiskers reach the furthest value within 1.5 times the IQR; values beyond are outlier dots.
- Always show the legend explaining box, median, whiskers and outliers.
- Order groups by meaning or by median, not alphabetically by default.
- Use ChartFrame for the four states: loading keeps the frame, an error says what failed with Try again, an empty period says so, and no match offers Clear filters.

## Content

- Say Middle half (Q1 to Q3) rather than only IQR.
- Axis title gives the measure and unit, such as Hours to first response.

## Accessibility

- 1.1.1 and WAI complex images: the chart has a short generated summary as its accessible name and a Table view with every value.
- 2.1.1 Keyboard: the chart is one tab stop; arrow keys move between marks and show the same tooltip as hover.
- 1.4.13 Content on Hover or Focus: the tooltip never covers the mark it describes, stays while the pointer is over the chart and closes with Esc.
- Accessible description: "Box plot showing first response time by team, last 40 tickets."

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the chart |
| ← → ↑ ↓ | Move to the previous or next mark and show its values |
| Home End | Jump to the first or last mark |
| Esc | Hide the tooltip |

## Examples

### response-times

```tsx
import { BoxPlot, boxTable, ChartFrame } from "@twoux/ui";

export const meta = { title: "First response time by team", description: "Four teams on one axis: the box is the middle half of tickets, the line the median, dots the slow outliers worth opening.", order: 1 };

const TEAMS = [
	{ id: "billing", label: "Billing", values: [4.7, 1.3, 2.9, 3.3, 4.0, 4.2, 3.4, 2.1, 3.4, 5.1, 2.6, 1.9, 2.4, 5.4, 2.1, 3.7, 2.2, 0.9, 2.4, 3.3, 1.7, 10.8, 3.2, 2.4, 2.7, 5.0, 2.8, 1.3, 4.3, 5.4, 1.6, 2.1, 6.8, 2.9, 2.9, 2.7, 3.0, 1.8, 1.6, 7.0] },
	{ id: "onboarding", label: "Onboarding", values: [9.5, 3.2, 3.3, 11.4, 7.0, 2.4, 4.1, 9.9, 3.3, 18.5, 2.0, 15.3, 5.2, 11.0, 9.5, 6.5, 9.4, 6.5, 8.4, 7.9, 4.3, 2.1, 5.7, 4.8, 4.1, 4.7, 6.5, 2.3, 3.5, 4.4, 5.6, 5.3, 31.2, 8.4, 11.4, 4.3, 6.2, 5.9, 2.1, 5.7] },
	{ id: "integrations", label: "Integrations", values: [27.7, 7.3, 6.3, 18.5, 10.2, 22.2, 8.0, 22.1, 6.1, 3.5, 8.3, 12.8, 6.9, 10.9, 12.7, 11.7, 12.8, 9.4, 6.0, 8.5, 15.8, 5.0, 5.4, 20.1, 7.7, 15.4, 7.4, 7.5, 13.6, 2.9, 12.4, 3.6, 8.6, 9.0, 4.1, 2.2, 20.4, 11.0, 13.6, 11.3] },
	{ id: "enterprise", label: "Enterprise", values: [0.9, 1.8, 2.3, 1.1, 2.6, 3.0, 1.8, 2.4, 3.9, 0.8, 2.1, 2.3, 1.2, 0.8, 2.0, 1.3, 2.6, 3.6, 2.2, 4.0, 0.9, 1.5, 2.8, 2.4, 1.4, 2.4, 1.8, 4.9, 3.3, 4.0, 2.5, 2.9, 4.1, 1.5, 2.4, 1.9, 1.4, 1.6, 3.1, 1.5] },
];
const hours = (n: number) => `${Math.round(n * 10) / 10}h`;

export default function Example() {
	return (
		<ChartFrame className="w-full" title="First response time by team" description="Last 40 tickets per team" table={boxTable(TEAMS, hours, "Team")}>
			<BoxPlot groups={TEAMS} format={hours} xTitle="Hours to first response" aria-label="First response time by team, last 40 tickets" />
		</ChartFrame>
	);
}
```

## Related

- Histogram
- Scatter chart
- Breakdown table
