# Comparison over time

Every headline number says what it compares against: this period vs the previous period of the same length, with arrow, sign and colour.

Kind: pattern · Group: Patterns: general

**Problem:** "312 applications" means nothing on its own. Teams add comparisons in different ways (vs last month, vs last year, percentage or absolute), so numbers on different screens can't be read together.

**Solution:** TwoUX compares the current period with the previous period of the same length by default. Stats show the number, then the change with arrow, sign and colour, then what it is compared with. Charts draw the previous period as a dashed grey line behind the current one.

**Built from:** Stat card with comparison, Line chart card, Breakdown table, Bar chart, Segmented control, Data visualisation colours

## How it works

1. Pick the period with one control above the chart: 7d, 30d, 90d. It drives every chart and stat on the page.
2. The stat leads with the number, then the change ("↑ 18%"), then the comparison in words ("vs 264 the 30 days before").
3. The line chart shows the previous period as a dashed grey line behind the current period, with a legend naming both.
4. Under the chart, the breakdown table shows current and previous side by side and the change in both units.
5. Every chart can switch to a table, which is also its accessible version.

## When to use

- For any KPI or trend on a dashboard, report or record header.
- Next to a single figure in a record, compare with the board median instead of time, so people can judge it without opening a report.

## When not to use

- When there is no previous period (new listing, new team). Show a dash, not "+100%".
- To compare categories in one period. Use a bar chart or breakdown, not a time comparison.

## Guidelines

- Never rely on colour alone for up or down; always add an arrow and a sign.
- Green and red follow meaning, not direction. A fall in time to first apply is good.
- Bars start at zero. Line charts may start elsewhere, but say so on the axis.
- One y-axis per chart. Two measures with different scales get two charts side by side.
- Keep each series the same colour on every chart; status colours never colour a series.
- The current, incomplete period is marked as incomplete so a half week does not look like a drop.

## Content

- Change text: "↑ 18% vs 264 the 30 days before". Units are always stated.
- Chart footer names the source and when it updated: "updated 12 min ago".

## Accessibility

- The change is read as text ("up 18 percent"), not only drawn as an arrow.
- Chart points are reachable with the arrow keys, and the table view carries every number.

## Do

- Do say what every number is compared against.
- Do use the previous period of the same length.

## Don't

- Don't use two y-axes.
- Don't show a percentage change from zero.

## Related

- Data export
- Filtering and search
- Stat card with comparison
- Line chart card
- Breakdown table
