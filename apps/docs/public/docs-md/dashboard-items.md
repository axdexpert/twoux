# Dashboard items

The catalogue of item types a dashboard is built from, such as key metrics, charts, short lists, alerts, quick links, getting started and feature news, and what each one should contain.

Kind: pattern · Group: Patterns: data and dashboards

**Problem:** Without a shared catalogue, every new dashboard item invents its own header, actions and amount of data. Items grow into mini reports with their own filters and tables, and the dashboard stops being readable at a glance.

**Solution:** Every item is a board item with the same anatomy: title, optional description, at most one header action, a more menu, content, and an optional footer link. The content is one of a small set of types, each with a clear job and size, and each links to the page where the full data lives.

**Built from:** Board and board item, Card, Stat card with comparison, Line chart card, Bar chart, Funnel, List table, Status badge, Banner (inline alert), Stepper, Dropdown menu, Empty state, Loading skeleton, Error state (failed to load), AI origin label

## How it works

1. Key metrics (full width): two to four Stat cards with comparison, such as Live listings, Applications this week, Median days to first review, Offers accepted. Each opens its report.
2. Chart (medium or large): one chart that explains a key metric, such as applications per week or the views to offers funnel, with the Chart or Table switch and a View report link.
3. List or table (medium or large): the top five records that need attention, such as listings expiring in 7 days or candidates waiting over 5 days, with status badges and "View all 23" in the footer.
4. Status and alerts (small or full width): what is wrong now and what to do, such as "Indeed sync failed for 2 listings" with Retry sync. It shows "No issues" when all is well rather than disappearing.
5. Quick links and resources (small): three to five links to frequent destinations or help, such as Post a listing, Import candidates, Interview scorecard guide.
6. Getting started (medium): the workspace setup checklist for new teams, with progress such as "2 of 5 done". People can dismiss it once they are set up.
7. Feature news (small): one product update in a sentence with one link. It is dismissible, and there is never more than one on a dashboard.

## When to use

- Whenever you add anything to a static or configurable dashboard: pick a type from this catalogue first.
- When a summary can be read on its own without the other items.
- When the item has a clear destination for people who need more detail.

## When not to use

- For data people need to filter, sort and act on in bulk. Link to the List table.
- For long text or logs, such as the full activity history of a listing. Put it on the record page.
- For a single number with no comparison and no action. Fold it into the key metrics row or leave it out.

## Guidelines

- One item, one job. Combine at most two visual types in an item, such as a chart with its breakdown table, never a chart, a table and a list.
- At most one action in the header, for the most common next step. Everything else goes in the more menu: Preferences first, then other actions by how often they are used, then Remove from dashboard last.
- Show all the content by default. Preferences can hide parts, such as a column or the table under a chart, but only on configurable dashboards.
- Keep the content light: no inline filters beyond a period or one select, no row selection, no editing. Link out for anything more.
- Size by content: small (1 of 4 columns) for one number or a few links, medium (2) for a chart or short list, large (3) for a chart that compares several series, full width (4) for key metrics.
- An AI summary item, if offered, carries the origin label, cites the records it used by ID and only suggests. It never ranks, rejects or advances candidates.
- Give each item's title heading level 2 (level={2} on ChartFrame, BoardItem and ChangeList) so the page outline runs from the h1 straight to the items and screen reader users can jump between them.

## Content

- Title is a noun phrase with scope: "Candidates waiting over 5 days", not "Waiting" or "Widget 3".
- Footer links say how many: "View all 23 listings", not "See more".
- Item menu labels are verbs or plain nouns: "Preferences", "View report", "Remove from dashboard".
- An item with nothing to show explains why and what to do: "No listings expire in the next 7 days."

## Accessibility

- Each item is a region labelled by its h2 title.
- Key metric changes are read as words: "Up 12% vs previous 7 days", not only an arrow and a colour.
- A table inside a narrow item scrolls inside the item, not the page, and keeps its header row.
- Alerts that appear after load are announced politely; failures that block work use the error state in the item.

## Do

- Do treat each item as an executive summary of its subject.
- Do give every list and chart item a link to its full page.
- Do keep loading, empty and error states inside the item's frame so the layout does not jump.

## Don't

- Don't add actions that belong on another page, such as Post a listing inside a chart item.
- Don't use expanding footers or accordions inside items.
- Don't show more than one feature news item, and never one that cannot be dismissed.

## Related

- Static dashboard
- Configurable dashboard
- Board and board item
- Stat card with comparison
- Line chart card
- Onboarding to an empty workspace
