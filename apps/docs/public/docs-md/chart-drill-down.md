# Chart drill-down

Select a point on a chart to see what makes it up, then narrow the chart or the whole page to that point, with every applied filter shown as a pill you can remove.

Kind: pattern · Group: Patterns: data and dashboards

**Problem:** A hiring lead sees applications drop on 12 Oct and wants to know why. Without a way in from the chart, they rebuild the same filters by hand on another page and lose the thread.

**Solution:** Offer three levels and pick one per chart. A breakdown in the details popover answers most questions. If more is needed, a footer in the pinned popover filters either this chart or the whole page, never both on one page. Filters land as pills in the filter bar, write to the URL and come off with one click.

**Built from:** Line chart card, Bar chart, Stacked area chart, Donut chart, Filter pills and filter bar, Breakdown table, List table, Popover rules

## How it works

1. Hover or move the crosshair to a point; the details popover shows each series' value. Select it or press Enter to pin the popover.
2. Breakdown: under a value, list up to seven parts that make it up, such as applications on 12 Oct by listing. More than seven ends with a link: "View all 14 in table".
3. Link either the part's name to its record or its value to a filtered List table, never both.
4. Chart drill-down: the popover footer has a title saying where the filter goes ("Filter this chart"), the chosen point as read-only values ("Date 12 Oct"), an optional select ("Team"), and one button.
5. Page drill-down: the same footer, titled "Filter this page", applies the values to the page's filter bar so every chart and table updates.
6. Every applied value appears as a pill ("Date is 12 Oct") and in the URL, so Clear filters, removing a pill or Back returns to the default view.

## When to use

- When people look at charts to investigate: a spike, a drop or an outlier they need to explain.
- Page drill-down on dashboards where several charts and a table share filters, such as a hiring overview by team and location.

## When not to use

- Do not mix chart drill-down and page drill-down on the same page. Pick one; two levels of filters conflict.
- For a chart with one series and nothing beneath it. The tooltip is enough.
- On a Board item people rearrange: send them to the full report page instead of filtering inside a tile.

## Guidelines

- Always say which filters a drill-down will apply and where, before it runs.
- Pre-filled values from the selected point are read-only in the popover; only the optional extra choice is editable.
- Filtering is a reversible view change, so it needs no confirmation and no Undo toast: the pill and Back undo it.
- A pinned popover follows Popover rules: one open at a time, never cut off, Esc closes it and returns focus to the point.
- Popover footers hold at most two buttons; more go in a menu.
- The popover breakdown is never the only place a value lives. The Breakdown table under the chart holds the same split.

## Content

- Footer title names the target: "Filter this chart" or "Filter this page". Description lists what will apply: "Date is 12 Oct and Team is Design."
- Button names the action and target: "Filter chart", "Filter page". Not "Apply" or "Submit".
- Breakdown rows read as key and value: "Junior Product Designer, Leeds  18".

## Accessibility

- Enter on a focused point pins the popover; Tab moves through its links, select and button; Esc closes it and returns focus to the same point.
- The popover is labelled by the point it describes: "Applications, 12 Oct".
- After a drill-down applies, announce the new state politely: "Filtered to 12 Oct. 3 charts updated."
- Read-only values are text, not disabled inputs, so they are read in full and not skipped.

## Do

- Do show every drill-down filter as a pill in the filter bar.
- Do cap a popover breakdown at seven items with a link to the rest.
- Do keep the drill-down state in the URL.

## Don't

- Don't offer chart and page drill-down on the same page.
- Don't link both the name and the value in a breakdown row.
- Don't apply filters from a hover; only from a pinned popover and a button.

## Related

- Data visualisation
- Filtering and search
- Comparison over time
- Record detail: side panel, overlay or full page
