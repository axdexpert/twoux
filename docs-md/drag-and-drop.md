# Drag and drop

Dragging is a shortcut, never the only way: every drag in TwoUX has a keyboard path and a menu path that do the same thing.

Kind: pattern · Group: Patterns: general

**Problem:** Dragging is quick for some people and impossible for others, including keyboard, switch and tremor users. Drags without a visible handle go unnoticed, and drops that land somewhere unexpected move a candidate to the wrong stage.

**Solution:** Mark draggable things with a handle, show where the item will land while it moves, and send an invalid drop back to where it started. Offer the same move from the keyboard (pick up, arrows, drop) and from a menu item such as Move to stage.

**Built from:** Board and board item, Columns menu, Grouped list, Dropdown menu, Confirmation dialog, Toast

## How it works

1. Decide whether the drag is a shortcut (reordering columns, uploading a CV by dropping it) or the main way to do the task (arranging a dashboard). Main-way drags need the strongest signifiers and alternatives.
2. Give each draggable item a 16px grip handle in a 24px target, and change the cursor to grab on hover; resize handles use the matching resize cursor.
3. While dragging, lift the item with a shadow and show a drop preview the size of the item where it will land.
4. If the drop target is not allowed, show it as unavailable during the drag and return the item to its start on release.
5. After a drop, confirm the result in place and in a toast with Undo, unless the move is irreversible (such as moving a candidate to Rejected, which emails them); that opens a confirmation dialog first.

## When to use

- Reordering things whose order matters: pipeline stages, columns in the Columns menu, dashboard items on a board.
- Moving a candidate card between stages on a pipeline board, alongside the Move to stage menu.
- Dropping files, such as a CV or a job description document, onto an upload area that also has a Choose file button.

## When not to use

- For sorting a table. Use sortable column headers; order there comes from the data, not from the person.
- For bulk moves of many records. Select them and use the bulk action bar.
- As the only way to do anything (WCAG 2.5.7).

## Guidelines

- Every drag has a single-pointer alternative: arrow buttons or menu items such as Move up, Move down, Move to stage.
- Every drag has a keyboard path: Tab to the handle, Enter or Space to pick up, arrows to move, Enter to drop, Esc to cancel.
- Items of equal size swap places; otherwise the moving item pushes the others along. Never let items overlap.
- Moves save per person or per team as the context says, and the result is visible at once: no Save button for a reorder.
- Scroll the list or board automatically when the dragged item nears its edge.
- Respect reduced motion: drop items into place without the slide animation.
- Show every stage of a drag. Ready: the grip darkens on hover and focus, with a grab cursor and a tooltip saying how to move it. Dragging: a lifted copy follows the pointer, the board tints to show where drops are allowed, and a dashed slot shows exactly where the item will land.
- Other items glide to make room (180ms, off with reduced motion) instead of jumping. On drop, a short highlight settles on the moved item and the new position is announced. Esc cancels and puts it back.

## Content

- Handle accessible name: "Move Junior Product Designer", with a description of the keys.
- Live announcements say position in words: "Picked up Interview. Stage 3 of 6." then "Interview moved to stage 2 of 6."
- Upload area text names both paths: "Drop a CV here or choose a file".

## Accessibility

- Dragging is never the only way to move, reorder or resize (2.5.7 Dragging Movements).
- Handles meet the 24 by 24px target size (2.5.8).
- Pick-up, each move, drop and cancel are announced in a polite live region (4.1.3).
- Esc cancels and returns the item and focus to where they started.

## Do

- Do show a drop preview where the item will land.
- Do offer the same move as a menu item.
- Do use the same handle icon for every drag in the product.

## Don't

- Don't make a whole row draggable with no handle; it fights text selection and click to open.
- Don't drop silently into an invalid place; send the item back.
- Don't trigger an email to a candidate from a drop without confirming first.

## Related

- Board and board item
- Columns menu
- Undo and destructive actions
- Keyboard-first navigation
