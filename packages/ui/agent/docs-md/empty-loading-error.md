# Empty, loading and error states

One rule set for the three states every view has before or instead of data: loading, nothing to show, and failed.

Kind: pattern · Group: Patterns: general

**Problem:** A blank table can mean loading, no data, no matches or a failure. When screens handle these differently, people wait for data that never comes or give up on data that was about to arrive.

**Solution:** Skeleton rows while loading, an empty state with one next step when there is nothing, a zero results state when filters match nothing, and an error state that keeps the filters and offers Try again.

**Built from:** Loading skeleton, Empty state, Error state (failed to load), Banner (inline alert), List table, Data grid

## How it works

1. Under about one second, show nothing extra. Beyond that, keep the table's shape with skeleton rows.
2. If the load succeeds with no records, replace the table with an empty state: what goes here, and one action to add it.
3. If records exist but filters match none, show the zero results state with Clear filters.
4. If the load fails, replace the table with an error state that says what failed, keeps the filters and offers Try again (R).
5. When a refresh fails after data has loaded, keep the old data on screen and show a warning beside the refresh time.

## When to use

- On every table, grid, chart card, panel and assistant answer that loads data.

## When not to use

- For a brand new workspace with nothing set up. Use Onboarding to an empty workspace with the setup checklist.

## Guidelines

- Never show "No listings" before loading has finished; people stop waiting and miss the data.
- Skeletons for structured content (tables, cards); a spinner for a single element such as a button or expanding row; a progress bar beyond about ten seconds.
- Empty and zero results states replace the table and its headers, so screen readers don't meet an empty table.
- Every state offers a next step. No dead ends.
- Errors never use the empty state component; they use the error state or a banner.
- Show when data was last updated after each refresh.
- Charts follow the same states with chart-specific shapes: the plot skeleton while loading, an empty state for no data, a no match state with Clear filters after filtering, and an error state with Try again, each inside the chart card so the title and controls stay.
- Manual refresh lives in the table header as an icon button labelled "Refresh listings", next to "Last updated 2 minutes ago". Add a refresh button only where data changes while people watch; other views refresh on load.
- During a refresh keep the current rows on screen and usable; only the refresh button shows a spinner.
- If a refresh takes longer than about ten seconds, show a "Taking longer than usual" status beside the refresh time; if it partly fails, show a warning status there with what failed and Try again.
- Wrap each region (table, chart card, side panel) in its own error boundary, so a crash shows an error state in that region and the rest of the page still works.
- Inside a table or read-only details, an empty value shows a muted hyphen (-) with the accessible name "Not set". Never use a dash for a real zero; show 0.
- Keep the count in the table heading even when empty: "Listings (0)".

## Content

- Empty: "No listings yet" plus "Create listing". Zero results: "No listings match these filters" plus "Clear filters".
- Error: "Couldn't load listings", then the likeliest cause, then "Your filters are kept." Avoid "sorry" and error codes.
- Loading text names the thing without articles or end punctuation: "Loading listings".
- The empty state's action uses the same label as the header button it mirrors ("Create listing") and is a secondary button, since the header already has the primary.
- An empty state description explains why it is empty and never repeats the heading or button text.

## Accessibility

- Announce loading, loaded counts and failures as status messages without moving focus.
- Hide decorative empty state illustrations from screen readers with empty alt text.
- Error states are identified in text, not only with a red icon.
- The refresh button has loading text ("Refreshing listings"), and the new "Last updated" time is announced politely.

## Do

- Do keep the layout stable from skeleton to data.
- Do keep filters when a load fails.

## Don't

- Don't use a full-page spinner for a table load.
- Don't show a frame-only skeleton with no placeholder rows.
- Don't write jokes into error messages.

## Related

- Filtering and search
- Onboarding to an empty workspace
- Generated table columns and enrichment
- Empty state
- Loading skeleton
- Error state (failed to load)
