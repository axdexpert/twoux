# Price chart

One price over a session: a line with a light wash, the last value tagged on the right axis, the previous close as a dashed reference, a live dot, and an axis that says when it does not start at zero.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- A price or rate that moves within a narrow band, where the movement is the point, such as a share price today.
- A live value where people need the latest level and where it stands against a reference.

## When not to use

- For amounts that should be compared from zero, such as revenue. Use the TwoUX Line chart card, which always starts at zero.
- For open, high, low and close per day. Use the TwoUX Candlestick chart.

## Structure

1. Title and subtitle (unit, delay)
2. Plot: line with a 10% wash down to the axis floor
3. Right axis with ticks and the last-value tag
4. Dashed reference line with label (previous close)
5. Live dot at the last point
6. Time axis across the whole session
7. Note under the axis when it does not start at zero
8. Crosshair tooltip: time, price, change against the reference

## Guidelines

- Start the axis at zero unless the range is narrow; when it does not, say so under the axis.
- Lay out the whole session on the time axis so the empty part of the day stays visible.
- Tag the last value on the right axis and hide ticks that would collide with it.
- Draw the reference as a dashed grey line with a text label, never a series.
- Fill under the line with a light wash of the series colour, not a solid block.
- The live dot pulses only while the market is open, and never under reduced motion.
- Use ChartFrame for the four states: loading keeps the frame, an error says what failed with Try again, an empty period says so, and no match offers Clear filters.

## Content

- Put the unit and delay in the subtitle, such as In pence, 15 minutes delayed.
- Label the reference by what it is (Previous close), with its value.

## Accessibility

- 1.1.1 and WAI complex images: the chart has a short generated summary as its accessible name and a Table view with every value.
- 2.1.1 Keyboard: the chart is one tab stop; arrow keys move between marks and show the same tooltip as hover.
- 1.4.13 Content on Hover or Focus: the tooltip never covers the mark it describes, stays while the pointer is over the chart and closes with Esc.
- Accessible description: "Line chart showing Ashdown plc share price today in pence."
- 2.2.2 and 2.3.3: the pulsing dot is under five seconds per cycle and stops under prefers-reduced-motion.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the chart |
| ← → ↑ ↓ | Move to the previous or next mark and show its values |
| Home End | Jump to the first or last mark |
| Esc | Hide the tooltip |

## Examples

### intraday

```tsx
import { ChartFrame, PriceChart } from "@twoux/ui";

export const meta = { title: "Share price today", description: "Ten-minute prices from the open, the session's remaining slots left empty, the last price tagged on the right axis and the previous close as a dashed reference. The axis starts above zero and says so.", order: 1 };

const TIMES = ["08:00", "08:10", "08:20", "08:30", "08:40", "08:50", "09:00", "09:10", "09:20", "09:30", "09:40", "09:50", "10:00", "10:10", "10:20", "10:30", "10:40", "10:50", "11:00", "11:10", "11:20", "11:30", "11:40", "11:50", "12:00", "12:10", "12:20", "12:30", "12:40", "12:50", "13:00", "13:10", "13:20", "13:30", "13:40", "13:50", "14:00", "14:10", "14:20", "14:30", "14:40", "14:50", "15:00", "15:10", "15:20", "15:30", "15:40", "15:50", "16:00", "16:10", "16:20", "16:30"];
const TRADED = [741.8, 742.7, 742.5, 742.2, 741.0, 740.9, 742.6, 743.3, 745.0, 745.5, 746.2, 746.6, 744.4, 745.7, 746.6, 747.4, 745.2, 742.9, 741.8, 741.3, 741.9, 742.0, 742.9, 742.1, 742.7, 743.4, 742.6, 745.2, 746.1, 747.9, 747.2, 746.3, 746.0, 746.0, 747.0, 747.5, 747.1, 745.9, 745.3];
const PRICES = TIMES.map((_, i) => TRADED[i] ?? null);
const pence = (n: number) => `${n.toLocaleString("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}p`;

export default function Example() {
	return (
		<ChartFrame
			className="w-full"
			title="Ashdown plc share price"
			description="Today, in pence, 15 minutes delayed"
			table={{ columns: ["Time", "Price"], rows: TIMES.slice(0, TRADED.length).map((t, i) => [t, pence(TRADED[i])]) }}
		>
			<PriceChart x={TIMES} data={PRICES} format={pence} reference={{ value: 741.2, label: "Previous close" }} live aria-label="Ashdown plc share price today" />
		</ChartFrame>
	);
}
```

## Related

- Line chart card
- Candlestick chart
- Change list
