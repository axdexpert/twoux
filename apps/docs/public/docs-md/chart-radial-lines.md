# Radial lines

A line chart wrapped round a circle for cyclical periods (hour of day, day of week, month), so the last period runs into the first. One to three series, values from zero, gaps for missing data.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- Showing how a measure rises and falls through a repeating cycle where the wrap-around matters, such as support tickets by hour of day across two queues.
- Daily or weekly rhythms, such as sign-ins by day of week, where Sunday into Monday should read as one stretch.

## When not to use

- For time that does not repeat, such as revenue by month over two years. Use the TwoUX Line chart card.
- For exact comparisons between periods. Use a Bar chart: values near the centre are hard to compare.
- For a cycle against a second dimension, such as hour by weekday. Use the TwoUX Heatmap.
- For more than three series. Split them into small charts side by side.

## Structure

1. Title and subtitle with the period averaged and time zone
2. Value rings from zero, three or four, labelled along the top spoke
3. One spoke per period, labels round the outside
4. Lines in series colours, joined from the last period to the first
5. Gaps for missing data
6. Legend for two or more series
7. Tooltip for the nearest period on hover or focus

## Guidelines

- Use radial lines only for cyclical periods: hour of day, day of week, month of year.
- Start the first period at 12 o'clock and run clockwise.
- Start the value axis at zero with three or four labelled rings; never crop the centre.
- Draw missing data as a gap, never as zero. Join the last period to the first only when both have values.
- Show one to three series as lines; no area fill.
- Show a legend only for two or more series; legend keys hide series without changing colours.
- Use ChartFrame for the four states: loading keeps the frame, an error says what failed with Try again, an empty period says so, and no match offers Clear filters.

## Content

- Name the measure and the cycle in the title: Tickets opened by hour.
- Say what was averaged and the time zone in the description: Average per day, last 30 days, UK time.
- Write periods as people read them: 00:00 to 23:00, Mon to Sun, Jan to Dec.

## Accessibility

- 1.1.1 and WAI complex images: the accessible name gives the cycle, where it starts, and each series' highest and lowest period and gaps.
- 2.1.1 Keyboard: one tab stop; arrow keys move round the cycle and wrap, showing the same tooltip as hover.
- 1.4.13 Content on Hover or Focus: the tooltip stays while the period is active and Esc hides it.
- 1.4.11 Non-text Contrast: lines meet 3:1 against the surface.
- 1.4.10 Reflow: the chart shrinks to its container and the table view lists every value.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the chart |
| → ↓ | Next period, clockwise; wraps from the last to the first |
| ← ↑ | Previous period, anticlockwise |
| Home End | Go to the first or last period |
| Esc | Hide the tooltip |

## Examples

### logins-by-weekday

```tsx
import { ChartFrame, RadialLines, radialLinesTable } from "@twoux/ui";

export const meta = { title: "One series: sign-ins by day of week", description: "One series needs no legend. Sunday meets Monday, so the weekend dip reads as one shape.", order: 2 };

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SERIES = [{ id: "signins", label: "Sign-ins", data: [4_820, 5_130, 5_060, 4_910, 3_980, 820, 640] }];

export default function Example() {
	return (
		<ChartFrame className="w-full max-w-md" title="Sign-ins by day of week" description="Average per day, last 12 weeks" table={radialLinesTable(DAYS, SERIES, undefined, "Day")} height={260}>
			<RadialLines periods={DAYS} series={SERIES} periodLabel="Day" maxSize={260} aria-label="Sign-ins by day of week, last 12 weeks" />
		</ChartFrame>
	);
}
```

### tickets-by-hour

```tsx
import { ChartFrame, RadialLines, radialLinesTable } from "@twoux/ui";

export const meta = { title: "Support tickets by hour of day", description: "Two queues over 24 hours. Midnight sits at the top, so the overnight hours read as one stretch. 04:00 has no data after a logging outage and shows as a gap.", order: 1 };

const HOURS = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`);
const SERIES = [
	{ id: "billing", label: "Billing", data: [6, 4, 3, 2, null, 3, 8, 18, 34, 52, 61, 58, 49, 55, 60, 54, 44, 31, 22, 17, 14, 12, 10, 8] },
	{ id: "technical", label: "Technical", data: [14, 12, 10, 9, null, 11, 16, 24, 31, 38, 42, 40, 36, 39, 43, 41, 37, 33, 29, 27, 24, 21, 18, 16] },
];

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Tickets opened by hour" description="Average per day, last 30 days, UK time" table={radialLinesTable(HOURS, SERIES, undefined, "Hour")} height={320}>
			<RadialLines periods={HOURS} series={SERIES} periodLabel="Hour" aria-label="Support tickets opened by hour of day, last 30 days" />
		</ChartFrame>
	);
}
```

## Related

- Line chart card
- Heatmap
- Bar chart
- Data visualisation
