# Breakdown table

A table under a chart that splits its figure by team, location or owner, with current and previous periods side by side and change in both units.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- A chart needs its exact values and a split by dimension; the table doubles as the chart's long description.
- People compare values across rows.

## When not to use

- For many columns people edit. Use the TwoUX Data grid.
- For record lists. Use the TwoUX List table.

## Structure

1. Breakdown switch (By team, By location, By owner)
2. Export CSV
3. Columns: dimension, This period, Previous period, Change, Change %

## Guidelines

- Sit directly under the chart it explains.
- Show change with sign and arrow, not colour alone.
- Show a dash when there is nothing to compare, with hidden text for screen readers.
- Sort by the current period by default and allow sorting by any column.
- When a chart offers drill-down, the breakdown table is where the same split lives in full; a popover breakdown never holds data that is not also here.
- Each row's count can link to the filtered List table behind it; link the count or the name, not both.
- Rows follow the chart's filters and series toggles, so the table and chart never disagree.

## Content

- Right-align numbers with consistent decimals.
- Column headers state the period, "This period", "Previous period".
- Write change with its sign, "+12" and "−8%", so direction reads without colour.

## Accessibility

- 1.3.1 Info and Relationships: real table markup with scoped headers.
- APG sortable table: aria-sort on the sorted header only.
- The By team, By location, By owner switch exposes the pressed state.
- When the chart filters change, announce the new row count politely without moving focus.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move to the switch, Export and sortable headers |
| Enter / Space | Change breakdown or sort |

## Examples

### by-team

```tsx
import type React from "react";
import { CartesianChart, ChartFrame, ChartLegend, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, seriesColor } from "@twoux/ui";
import { APPLICATIONS, WEEKS } from "../chart-card-line/data";

export const meta = { title: "Chart with its breakdown", description: "The table under the chart splits the same figure by team, with current, previous and change. The colour key in each row ties it to the chart.", order: 1 };

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Applications per week" description="Last 8 weeks" legend={<ChartLegend items={APPLICATIONS.map((s, i) => ({ id: s.id, label: s.label, color: seriesColor(i), shape: "line" }))} />}>
			<CartesianChart kind="line" x={WEEKS} series={APPLICATIONS} height={180} aria-label="Applications per week by team" />
			<div className="overflow-hidden rounded-xs border border-line">
				<Table aria-label="Applications by team">
					<TableHeader><TableRow><TableHead>Team</TableHead><TableHead className="text-right">This week</TableHead><TableHead className="text-right">Last week</TableHead><TableHead className="text-right">Change</TableHead></TableRow></TableHeader>
					<TableBody>
						{APPLICATIONS.map((s, i) => {
							const [now, prev] = [s.data[s.data.length - 1] ?? 0, s.data[s.data.length - 2] ?? 0];
							const pct = Math.round(((now - prev) / (prev || 1)) * 100);
							return (
								<TableRow key={s.id}>
									<TableCell><span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-0.5 w-3 rounded-full bg-(--c)" style={{ "--c": seriesColor(i) } as React.CSSProperties} />{s.label}</span></TableCell>
									<TableCell className="tabular text-right font-medium">{now}</TableCell>
									<TableCell className="tabular text-right text-ink-2">{prev}</TableCell>
									<TableCell className="tabular text-right">{pct >= 0 ? "↑" : "↓"} {Math.abs(pct)}%</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</ChartFrame>
	);
}
```

## Related

- Line chart card
- Bar chart
- Stat card with comparison
- Export menu
