# Data visualisation

Start from the question the person is asking, pick the one chart that answers it, give it a noun title, units and a period, and ship it with a table view and its four states.

Kind: pattern · Group: Patterns: data and dashboards

**Problem:** Hiring leads open dashboards to answer a few questions: is volume going up, did something break, how do teams compare, why did this week drop. When charts are picked for looks, or each team invents its own axis and colour habits, people misread them or stop trusting them.

**Solution:** Name the objective first (trend, anomaly, comparison, investigation), then choose the chart from a fixed table, show the fewest series that answer it, and finish it the same way every time: noun title, period, one y-axis, colours in order, table view, accessible name and the four states.

**Built from:** Line chart card, Bar chart, Stacked area chart, Bar and line chart, Donut chart, Scatter chart, Heatmap, Funnel, Stat card with comparison, Breakdown table, Data visualisation colours, Board and board item

## How it works

1. Write the question in one line, then tag it: trend over time, spotting something unusual, comparing groups, or investigating a known problem.
2. Choose the chart: change over time is a line; amounts per category or period are bars; parts of a total over time are a stacked area; two to five parts at one moment are a donut; ordered stages are a funnel; two measures across records are a scatter; one number is a stat card.
3. Show the fewest series that answer the question: up to eight lines or bars, four on a bar and line chart, five parts on a donut. Past that, fold into "Other" or add a series filter.
4. Finish the chart: noun title, period subtitle, axis titles with units, one y-axis, legend only for two or more series, categorical colours in order.
5. Add the table view and the accessible name and description.
6. Build the four states: loading, empty, no match and error.

## When to use

- Whenever a screen shows numbers that people read as a shape: trends, comparisons, splits.
- On dashboards and report pages, and in a record's detail when history matters, such as applications per day for a listing.

## When not to use

- For decoration or to fill space. If nobody acts on it, leave it out.
- When the person needs exact values per record. Use the List table or Breakdown table.
- When there is one number that matters. Use the Stat card with comparison.

## Guidelines

- Never let the chart suggest something the data does not say. Bars and areas start at zero; a line that starts elsewhere says so on the axis.
- Keep the number of charts per view small, and give charts of equal importance the same size.
- A series keeps its colour on every chart on the page, and hiding a series never repaints the others.
- Show gaps where data is missing. A missing day is not a zero.
- When a chart has three or more series, offer a series filter; with one series, offer neither a filter nor a legend.
- Thresholds are dashed, fixed lines with a text label, such as "Target 40". They are not a series and never use the status colours on their own.

## Content

- Titles are nouns that name the measure: "Applications", "Time to first reply". Never "Chart 1" or a sentence about the result.
- Axis titles are one to three words with the unit: "Salary (£k)". Time axes need no title; the dates speak for themselves.
- Dates on axes are short and UK style: "3 Nov", "Mon", "Nov". Currency carries its symbol: "£32k".
- State copy follows TwoUX's states pattern: "Loading applications", "No applications in this period", "No data matches these filters" with Clear filters, and "Couldn't load applications" with Try again.
- Use "previous" and "following", not "above" and "below", and "select", not "click".

## Accessibility

- Give every chart an accessible name matching its visible title and a description in the form "[Chart type] showing [data], [period]."
- Every chart has a Table view with the same values; it is the long description and the fallback for anyone who reads tables more easily.
- Colour is never the only cue: series have names in the tooltip and direct labels, groups have shapes or line styles.
- Marks needed to read the data reach 3:1 against the background; text uses text colours, never the series colour.
- The plot, legend and popover are reachable by keyboard in a logical order, and pinned popovers stay until dismissed.

## Do

- Do start from the question and name it in the chart title.
- Do ship a Table view with every chart.
- Do split two units into two charts side by side.

## Don't

- Don't add a second y-axis.
- Don't colour each bar of a single series differently.
- Don't use a donut for change over time or for more than five parts.
- Don't print values or labels in the series colour.

## Related

- Chart drill-down
- Comparison over time
- Empty, loading and error states
- Filtering and search
