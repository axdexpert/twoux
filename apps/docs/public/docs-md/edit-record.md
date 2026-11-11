# Editing a record: inline, section or whole page

Change one value where it is shown, one section in place, or many linked settings on an edit page that mirrors the create form. Every saved edit can be undone.

Kind: pattern · Group: Patterns: general

**Problem:** Some screens open a full form to change a closing date; others edit linked settings one cell at a time and leave the record half changed. Edit forms drift away from the create form, so people meet the same field in two shapes.

**Solution:** Edit one value inline. Edit one section in place: it turns into a form with Save and Cancel. Use an edit page only when several settings depend on each other, and build it from the create form with the same fields in the same order. Saving shows a toast with Undo.

**Built from:** List table, Data grid, Card, Text input, Form validation, Page header, Breadcrumb, Button, Toast, Side panel (drawer)

## How it works

1. Ask what is changing. One value on one or many records: inline. Several values in one section of a record: section edit. Settings that depend on each other across sections: edit page.
2. Inline: follow Inline editing and validation. Enter edits, Enter saves, Esc cancels.
3. Section edit: an Edit button in the section header turns that section into a form with Save and Cancel at its end. Other sections stay read-only.
4. Edit page: title "Edit Junior Product Designer", breadcrumb ending in "Edit", the create form's fields and sections in the same order, Save changes and Cancel at the end.
5. On save, return to where the edit started and show "Listing updated. Undo". With no changes, return and show "No changes made".

## When to use

- Inline: values people change often or across many rows, such as stage, owner or closing date.
- Section edit: a group that belongs together, such as Location and pay on a listing.
- Edit page: changes where one setting limits another, such as switching a listing from Internal to Public, which adds job board and salary rules.

## When not to use

- Don't open an edit page to change one value.
- Don't mix create and edit in one view, such as adding a new listing from inside the edit page of another.
- Don't use edit for actions with their own consequence, such as Close listing or Reject candidate. They are actions with their own button and, where needed, confirmation.

## Guidelines

- The edit page reuses the create form component, so labels, order, hints and validation never drift apart.
- Save changes stays enabled. Validate on submit, keep the person's input, and show server errors above the buttons so nothing has to be typed again.
- An edited row that no longer matches the filters or sort stays in place, marked, until the list refreshes, so it doesn't vanish under the cursor.
- Lists of repeated values, such as screening questions or interview stages, use rows with Add and Remove. Removing a row takes effect on save and says so: "Removed when you save".
- Leaving an edit with unsaved changes asks "Discard changes?" with Keep editing focused.
- Every saved edit is reversible with Undo in the toast, ⌘Z and the record's activity.

## Content

- Edit page title: "Edit" plus the record name. Submit button: "Save changes".
- Section headings match the create form word for word.
- Limits on repeated rows say what is left: "You can add 3 more questions."

## Accessibility

- When a section switches to edit, focus moves to its first field; on Save or Cancel it returns to the section's Edit button.
- Each Edit button names its section: aria-label "Edit location and pay".
- When a repeated row is added, focus moves to its first input; when removed, focus moves to the next row or the Add button.

## Do

- Do edit in place when the change is small.
- Do mirror the create form exactly on the edit page.
- Do offer Undo after every saved edit.

## Don't

- Don't disable Save changes until something changes.
- Don't put two Edit modes on the screen at once; one section edits at a time.
- Don't open a dialog to edit a section of a record that is already in a side panel.

## Related

- Creating a record: dialog, single page or steps
- Inline editing and validation
- Undo and destructive actions
- Record detail: side panel, overlay or full page
- Form validation
- Data grid
