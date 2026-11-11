# Saved views

Store a filtered, sorted, column-chosen list under a name so people and teams return to it in one click.

Kind: pattern · Group: Patterns: general

**Problem:** People rebuild the same filters every morning, and teams share screenshots of lists instead of links. Without one way to save, each screen invents its own favourites.

**Solution:** When filters are on, Save view stores filters, sort and columns together with a name. Views show live counts, mark unsaved changes, and reproduce from the URL.

**Built from:** Saved views, Filter pills and filter bar, Columns menu, List table, Data grid, Tabs (underline)

## How it works

1. Save view appears only once at least one filter, sort or column change differs from the default.
2. Save view asks for a name (required) and an optional description, validating duplicate names inline.
3. The view appears as a tab or sidebar item with its live row count, for example "Live 14".
4. If the person changes a saved view, its name shows an unsaved mark and the menu offers Update view, Save as new and Revert.
5. The view's state also lives in the URL, so a copied link opens the same view for anyone with access.

## When to use

- For lists people check repeatedly with the same filters, such as "My live listings" or "Closing this week".
- To give a team a shared starting point that everyone sees the same way.

## When not to use

- For a one-off filter. The URL already makes it shareable; use Filtering and search.
- For per-person display choices such as row density or wrapping. Those belong in the Columns menu and are remembered automatically.

## Guidelines

- A view stores filters, sort order, visible columns and grouping. Opening it restores all four.
- A default view loads when the page opens, unless the URL already carries filters.
- Changing a saved view never overwrites it silently. Updating needs an explicit Update view.
- Deleting a view uses a simple confirmation, because a team view can be in other people's sidebars.
- Keep the number of pinned views short; long rows of tabs slow the choice down.
- Group the views list into Team views and My views, and add a search box once there are more than about ten.
- People can set any view as their own default with Set as default. It is unavailable while the current view has unsaved changes, and the reason is shown.
- Update view shows the filters before and after in the menu, then saves with Undo in the toast.
- People can drop unsaved changes in any of three ways: Revert, choosing the view again, or Clear filters.

## Content

- Name views by what they contain, not who made them: "Closing this week", not "Rahul's view".
- Menu actions: "Save view", "Save as new view", "Update view", "Revert changes", "Delete view".

## Accessibility

- The unsaved mark is text ("Edited") as well as a dot, so it does not rely on colour.
- Confirm a save with a status message announced politely, not a moved focus.

## Do

- Do show the live count on each view.
- Do mark a modified view and offer Revert.

## Don't

- Don't save a view automatically when filters change.
- Don't store a view only in local storage; it must reproduce from its link.

## Related

- Filtering and search
- Keyboard-first navigation
- Saved views
- Columns menu
