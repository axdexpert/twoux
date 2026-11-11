# Page actions and row actions

Actions that affect the page or many records sit in the page header or the bulk action bar; one or two frequent actions also sit on each row, and every row action is reachable from the selection too.

Kind: pattern · Group: Patterns: general

**Problem:** If row actions and page actions live in different places on every screen, people miss them. Rows crowded with buttons are noisy, and actions that exist only on hover can't be found by keyboard or touch users.

**Solution:** Global actions (Create listing, Export, actions on a selection) live in the page header and the bulk action bar. In-context actions live with the thing they change: a row's last column, a card or section header. The full set is always available globally; in-context copies are shortcuts for the common ones.

**Built from:** Page header, Bulk action bar, List table, Data grid, Dropdown menu, Button, Command palette (⌘K)

## How it works

1. List every action and who it acts on: the page or collection (Create listing, Export), a selection (Close, Extend), or one record (Edit, Duplicate).
2. Put page actions in the page header: up to four buttons, with the single primary action last on the right; more go in a More actions menu.
3. Put selection actions in the bulk action bar. Any action that can apply to many records is offered there, so nobody repeats it row by row.
4. On rows, keep one or two of the most used actions as icon buttons and the rest in a More actions menu in the last column. Choose them from usage data.
5. Put actions for a section or card in that section's header, on the right.

## When to use

- Global: creating a record, exporting, importing, and any action on selected rows.
- In-context: frequent one-record actions such as Duplicate listing or Copy link, and section actions such as Edit details in the side panel.
- Section actions: Edit details on a side panel section, Add interviewer on an interview card.

## When not to use

- Row menus for bulk actions. Bulk work belongs in the bulk action bar.
- A primary button inside a row. Rows use icon buttons or a menu, never filled buttons.
- Hover-only actions with no menu fallback; touch and keyboard users would never find them.

## Guidelines

- One primary action per view, in the page header.
- Header order from left to right: status actions (Pause, Reopen), View, Edit, other actions, Delete, then the primary action.
- Row menus hold up to seven items, most used first, with destructive items last after a separator.
- The More actions button on each row is always visible; quick icon buttons may appear on row hover or focus, and always on touch screens.
- Keep the actions column sticky on wide tables so actions stay in view while scrolling sideways.
- When an action depends on status, such as Reopen on a Closed listing, show the Status column so people see why it is offered.
- Every action is also in the command palette (⌘K) with its shortcut.

## Content

- Button labels are a verb, plus a noun when the verb alone is unclear: "Create listing", "Export", "Close 2 listings".
- Menu buttons name their set: "More actions", not "Options" or an unlabelled dots icon.
- No end punctuation in button or menu labels.

## Accessibility

- Icon-only row actions have an accessible name that includes the record: "Duplicate Junior Product Designer".
- The More actions button follows the menu button pattern: Enter or Space opens, arrows move, Esc closes and returns focus.
- Hover-revealed icons also appear when the row has keyboard focus.

## Do

- Do keep the full action set in the header, bulk bar and ⌘K.
- Do limit rows to one or two visible actions.
- Do put the primary action last on the right.

## Don't

- Don't make hover the only way to find a row action.
- Don't put two primary buttons on one page.
- Don't put actions for the whole table in a row menu.

## Related

- Selection and bulk actions
- Disabled and read-only states
- Keyboard-first navigation
- Page header
- Bulk action bar
- Dropdown menu
