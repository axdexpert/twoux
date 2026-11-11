# Selection and bulk actions

Pick rows with X or checkboxes, then act on all of them from one bar above the table that says how many rows it will touch.

Kind: pattern · Group: Patterns: general

**Problem:** Extending, closing or exporting listings one by one is slow, and bulk actions placed in different spots on each page are missed or misfired.

**Solution:** Selecting rows shows the bulk action bar directly above the table, with the actions, the count and Esc to clear. Filters and column headers stay where they were.

**Built from:** List table, Data grid, Bulk action bar, Checkbox, Toast, Confirmation dialog, Keyboard shortcut hint

## How it works

1. Select a row with its checkbox or X; ⇧J extends the selection downward. The header checkbox selects only the rows on the current page.
2. The bulk action bar appears directly above the table: the actions with their shortcuts on the left, the count ("2 listings selected") and Clear selection (Esc) on the right.
3. If more rows match than are on screen, the bar offers "Select all 412", and the count updates to say so.
4. Choosing an action runs it on the selected rows. Reversible actions show a toast with Undo; irreversible ones confirm first.
5. If an action cannot apply to some selected rows, say how many and why before it runs.

## When to use

- When the same action is often applied to many rows: extend, close, assign, export, ask the assistant.

## When not to use

- For an action on one record. Use the row's actions or the side panel.
- When the action needs per-row input, such as different closing dates. Use inline editing in the data grid.

## Guidelines

- Every bulk action is also available on a single selected row. The bar only adds the multi-row case.
- Labels are verb plus noun and say how many rows: "Close 2 listings".
- Keep the filters visible while rows are selected; the bar sits between the filters and the table instead of replacing the toolbar.
- Changing filters or sort clears the selection, so an action never touches rows the person can no longer see.
- Bulk results confirm in one toast ("2 listings extended") with Undo, not one toast per row.
- A bulk action that can't apply to the current selection stays in the bar as unavailable, with a reason: "Available when all selected listings are Live".
- The bar holds every action that can run on more than one record; row menus never offer "Close all" or similar.
- Order bar actions the same way as the page header: status actions first, destructive near the end, the main action last.
- Beyond four actions, the rest go in a More menu in the bar.

## Content

- Count format: "2 listings selected" in the bar, "2 of 24 selected" in the table footer.
- Destructive bulk confirmations name the count and the consequence: "Close 2 listings? They stop taking applications now."

## Accessibility

- Selected rows set aria-selected="true"; the selection is also shown with a tick, not colour alone.
- Announce the selection count when it changes.
- The header checkbox shows an indeterminate state when some rows are selected.
- Unavailable bulk actions use aria-disabled so their reason can be reached by keyboard.

## Do

- Do keep the count in the bar beside Clear selection, and name it in the toolbar's label so screen readers hear it before the actions.
- Do offer Undo after a reversible bulk action.

## Don't

- Don't replace the filter bar with the bulk bar; people lose sight of what they selected from.
- Don't silently skip rows an action can't apply to.

## Related

- Undo and destructive actions
- Keyboard-first navigation
- Data export
- Ask about what's on screen
- Bulk action bar
