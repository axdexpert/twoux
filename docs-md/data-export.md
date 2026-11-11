# Data export

One Export menu on every table: choose what to include first, then the format, then copy instead of download if you want.

Kind: pattern · Group: Patterns: general

**Problem:** People export to share with hiring managers or to work in a spreadsheet. When each table exports differently, they get files with hidden columns, raw field names or AI guesses mixed with real data.

**Solution:** Export (⇧E) opens one menu: options first (visible columns only, include AI columns, selected rows or all matching rows), then formats, then copy to clipboard. The file matches what is on screen.

**Built from:** Export menu, List table, Data grid, Bulk action bar, Toast, Inbox (triage)

## How it works

1. Export sits in the table toolbar with the other global table actions, and in the bulk bar when rows are selected.
2. Options come first: rows (selected, or all N matching the filters), visible columns only, include AI columns.
3. Then the format (CSV, Excel), then Copy to clipboard for quick pastes.
4. Small exports download at once with a toast. Exports likely to take more than about ten seconds run in the background with progress, and finish with an Inbox item linking to the file.
5. If the export fails, say why and offer Try again in a banner, not a toast.

## When to use

- On any list table, data grid, breakdown table or chart that has a table view.

## When not to use

- To share a view with a colleague inside TwoUX. Share the view's link instead (Saved views).
- As a fix for missing analysis. If many people export the same table, add the analysis to the product.

## Guidelines

- The file matches the screen: same rows, same visible columns, same order, column names as shown, not database field names.
- AI columns are excluded by default and, when included, are named with a suffix such as "(AI)" so generated values are never mistaken for real data.
- Say the scope in numbers before export: "Export 412 candidates".
- Long exports do not block the page; people can keep working.

## Content

- Menu label: "Export". Actions name the scope: "Export 2 rows as CSV".

## Accessibility

- Announce "Export ready" or "Export failed" as a status message.
- The export menu is a standard menu button reachable by keyboard; ⇧E opens it.

## Do

- Do export what the person sees.
- Do label AI columns in the file.

## Don't

- Don't put Export in a different place on each table.
- Don't block the screen while a large export runs.

## Related

- Selection and bulk actions
- Generated table columns and enrichment
- Notifications: inbox, bell, toast or email digest
- Export menu
