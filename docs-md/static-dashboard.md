# Static dashboard

A fixed overview page where the team sees the same items in the same order, most important first, answering the day's questions at a glance.

Kind: pattern · Group: Patterns: data and dashboards

**Problem:** A hiring lead opens the overview to answer a few questions fast: how many applications came in, which listings need attention, what is stuck. If the page is a wall of charts, or each team lays it out differently, the answer takes minutes instead of seconds.

**Solution:** Lay the page out in three bands on a 12-column grid: a top band with page actions and the headline numbers, a middle band of charts and short lists that explain those numbers, and a bottom band for setup help and updates. The order is set by the product team from research and does not change per person.

**Built from:** Page header, Segmented control, Stat card with comparison, Line chart card, Funnel, List table, Status badge, Banner (inline alert), Card, Empty state, Loading skeleton, Error state (failed to load)

## How it works

1. Write down the three to five questions the page must answer, such as "Are applications up or down this week?" and "Which listings expire in the next 7 days?". Every item must answer one of them.
2. Top band: the page header with page-level actions (period control, Post a listing) and a row of up to four key metrics with comparisons.
3. Middle band: charts and short lists that give the context behind the key metrics, such as applications per week and candidates waiting over 5 days.
4. Bottom band: getting started help for new workspaces, and short notes on product updates with a link to read more.
5. Size items from the 12-column grid: 3 columns for a small item, 6 for medium, 9 for large, 12 for full width. Height follows the content.
6. Give every item a way out to the full view ("View all 23 listings") so the dashboard stays a summary.

## When to use

- For a team-wide overview where everyone should see the same numbers in the same order, such as the weekly hiring report shared with department heads.
- When the order of items matters to getting the job done, for example during a hiring campaign where the funnel must stay in view.
- As the default home of a workspace before you know enough about how people want to rearrange it.

## When not to use

- When people in different roles need different items, such as a recruiter watching their own pipeline and a lead watching cost per hire. Use the configurable dashboard.
- To browse, filter or edit records. Link to the List table instead of embedding a full table.
- For a single metric explored in depth. Give it its own report page with a chart and a Breakdown table.

## Guidelines

- Keep to about seven items on one dashboard and about seven series or rows inside any one item. If you need more, split into a parent overview and child dashboards, such as one per department.
- Decide whether the page is operational (what needs action today) or analytical (trends over months). A mix is fine, but put the operational items first.
- Page-level controls change every item at once and always have a value, so the period uses a segmented control or dropdown, not a filter pill.
- Each item loads, fails and shows empty on its own. One failed chart shows an error state in its card; the rest of the page still works.
- Design the narrow layout too: on a phone the bands stack into one column in priority order, and dense charts are replaced by their headline number and a link to the full chart.
- Make the dashboard the first link in the side navigation when it is the landing page for returning users.

## Content

- Item titles name what is measured and the scope: "Applications this week", "Listings expiring in 7 days".
- Every number says what it compares against, using the Comparison over time pattern: "+12% vs previous 7 days".
- Use "previous" and "following", not "above" and "below": the layout stacks differently on narrow screens.
- Update notes are one sentence and a link, such as "You can now schedule the weekly hiring report. Set up a schedule".

## Accessibility

- The page has one h1; each item title is an h2 and any sub-heading inside an item is an h3, so screen reader users can jump between items by heading.
- Focus order follows the visual order, band by band and left to right.
- Every chart has its data available as a table (the Chart or Table switch) and a text summary of the headline.
- Status in items is a word in a badge, never colour alone.

## Do

- Do put the item that answers the most frequent question in the first row.
- Do link each item to the page where the work happens.
- Do show the time the data was last updated in the page header.

## Don't

- Don't show long lists such as activity logs; show the top five and link to the rest.
- Don't put complex filtering inside items. Send people to the list or report page for that.
- Don't mix fixed items and movable items on one page.

## Related

- Configurable dashboard
- Dashboard items
- Comparison over time
- Empty, loading and error states
- Board and board item
