# Record detail: side panel, overlay or full page

Open a record in a side panel that pushes the list by default, overlay it on narrow or wide-content pages, and go to the full page for deep work.

Kind: pattern · Group: Patterns: general

**Problem:** Opening records in modals hides the list people compare against; opening a full page every time loses their place. Teams pick a different container on every screen.

**Solution:** Enter or a click opens the side panel in push mode. J and K move to the next record and the panel follows. Esc closes. Open (⇧↵) goes to the full page. Overlay replaces push below about 1100px or when the content needs width.

**Built from:** Side panel (drawer), List table, Data grid, Page header, Breadcrumb, Tabs (underline)

## How it works

1. Enter or a click on a row opens the side panel. The row stays highlighted and the list stays usable.
2. The panel has a control bar (previous, next, position, open full page, close), then ID, title and status, then tabs and sections.
3. J and K move to the next or previous row; the panel follows without closing.
4. Open (⇧↵) moves to the full record page, with breadcrumbs back to the list and the same filters.
5. Esc closes the panel and returns focus to the row that opened it.

## When to use

- Push side panel: on list pages people work through one record after another (listings, candidates, inbox).
- Overlay side panel: when the page is narrower than about 1100px, or holds wide tables or dashboards that pushing would crush.
- Full page: for long records, history, or editing many related sections.

## When not to use

- Don't use a modal dialog for record detail; it hides the rows people compare against. Modals are for confirmations.
- Don't open the detail inline as an expanding row; expanded rows pile up and clutter the table.

## Guidelines

- A split view never replaces the full page; the panel is for deciding the next step, the page is for everything about one record.
- Only one secondary panel of a kind at a time; the assistant and record detail share the same side panel slot.
- Keep the identifying columns visible next to a pushed panel so people know which row they are on.
- People can switch push and overlay with ⇧P, and the choice is remembered.
- With several rows selected, the panel shows a useful summary of the selection, not a list of names.
- The side panel shares the single right-hand slot with the assistant and help panels; opening one replaces the other, and closing it restores the previous one.
- If a form in the panel has unsaved changes, J, K, Esc and close ask before discarding (see Unsaved changes). Single-field edits save on Enter and never ask.
- Section actions sit in each section's header on the right ("Edit details"); record-wide actions sit in the panel footer.
- The Details section shows absolute timestamps with their source: "Created 6 November 2026, 09:14 GMT by Priya Shah".

## Content

- Empty fields say "Add", so the gap is also the way to fill it.
- Timestamps are relative with the exact date on hover.
- Fields the person can't edit are shown as read-only text with the reason on hover, such as "Set by the job board feed".

## Accessibility

- A push panel is non-modal: it sits in the focus order after the list and never traps focus.
- An overlay panel that covers content behaves as a modal dialog: focus moves in, Tab is trapped, Esc closes and focus returns.
- The panel must not fully hide the focused row.

## Do

- Do keep J/K working while the panel is open.
- Do return focus to the row on close.

## Don't

- Don't open record detail in a centred modal.
- Don't open a second panel on top of the first.

## Related

- Keyboard-first navigation
- Inline editing and validation
- Ask about what's on screen
- Side panel (drawer)
