# Filtering and search

Narrow a list to the rows that matter with filter pills that apply as you tick, show counts, and live in the URL.

Kind: pattern · Group: Patterns: general

**Problem:** Hiring teams work through hundreds of listings and candidates and need to narrow them quickly. If every screen filters differently, people relearn the controls each time and links to a filtered list break.

**Solution:** Use the filter bar (pills) for list pages and the filter panel only for search across many fields. List values apply on tick with match counts, typed values apply on Enter, and the whole query is stored in the URL.

**Built from:** Filter pills and filter bar, Filter panel, List table, Data grid, Pagination and counts, Empty state, Saved views

## How it works

1. Show one or two of the most used fields as dashed pills next to Filter (F). Everything else sits behind Filter in a type-ahead list grouped into most used and all fields.
2. Opening a pill shows its values with the number of rows each one matches. Ticking a list value applies it at once; numbers and dates apply on Enter.
3. An applied filter becomes a solid pill that reads as a sentence: field, operator, value, for example "Status is any of Live, Expiring". Its remove button sits on the left.
4. Clear and the result count sit straight after the pills, so the person sees what is applied and how many rows match without opening anything.
5. Every change to a filter updates the URL, so reload, back and a shared link all reproduce the same list.
6. If nothing matches, the table is replaced by a zero results state with Clear filters as the action.

## When to use

- On any list page with more than one screen of rows: listings, candidates, pipeline, inbox.
- When people mostly narrow by two or three known fields such as status, location or team.
- Use the filter panel instead of pills when there are many fields to filter by, as in candidate search, and the panel can stay open beside the results.

## When not to use

- To find one known record by name or ID. Use search in the command palette (⌘K) or the view's search (/) instead.
- For view settings that always have a value, such as a chart's date range or Daily vs Weekly. Pills are removable, so these use a rectangle (segmented control or dropdown) instead.
- When several tables share one page. Filters in the URL become ambiguous, so filter each table locally and do not persist.

## Guidelines

- Filters act on the whole collection, not just the rows loaded on screen. The count says so: "Showing 5 of 412 candidates".
- Apply on tick because TwoUX's queries return fast; filter interactively when results come back almost instantly and in a batch when they are slow.
- If a query will take more than about a second, dim the results and show a progress indicator rather than redrawing after every tick.
- Show match counts on every list option so people avoid combinations that return nothing.
- Never put a filter row inside each column header. The pill bar keeps the whole query in one visible, shareable place.
- Validate filter values read from the URL and fall back to defaults when they are invalid. Never put personal data in the URL.
- Offer a plain search box alone when people know the exact name, such as a candidate's surname. Add pills when they choose among known values, such as stage or location.
- Show and/or wording only once two or more filters are applied; one filter reads as a plain sentence.
- Returning to a list by Back, the breadcrumb or the sidebar restores the filters the person left with.
- When a page has two filterable lists, only the main one writes its filters to the URL; the other keeps its filters on screen only.

## Content

- Pill text follows field, operator, value in sentence case: "Posted is in the last 30 days".
- Zero results heading: "No listings match these filters", then one sentence suggesting the likeliest fix, then a Clear filters button.
- Counts use the noun of the list: "14 listings", not "14 results".

## Accessibility

- Announce the new result count in a polite live region after each change, without moving focus.
- Each pill's remove button is its own Tab stop, named after its filter: "Remove Status filter".
- The value list is a combobox with a listbox: arrow keys move, Space ticks, Enter applies a typed value, Esc closes and returns focus to the pill.
- F to open Filter is a single-key shortcut, so it can be turned off in the shortcut sheet.

## Do

- Do keep the active query visible as pills at all times.
- Do show how many rows each value matches.
- Do write filters to the URL on every change.

## Don't

- Don't hide applied filters behind a single "3 filters" badge on desktop.
- Don't add an Apply button to a fast list filter; it adds a step for nothing.
- Don't use the empty state illustration and copy for a failed load. That is an error state.

## Related

- Saved views
- Selection and bulk actions
- Empty, loading and error states
- Keyboard-first navigation
- Filter pills and filter bar
- Filter panel
