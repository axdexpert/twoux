# Configurable dashboard

A personal overview where each person adds, removes, moves and resizes items on a board, with an items palette to add from, a saved layout and a reset to the default.

Kind: pattern · Group: Patterns: data and dashboards

**Problem:** Recruiters, hiring managers and the head of talent watch different things. One fixed overview is either too crowded for each of them or missing what one of them needs, so they build their own spreadsheets instead.

**Solution:** Start from the static dashboard layout as the default, then let each person change it on a Board. Add items opens the items palette in a side panel; items move by drag, keyboard or menu; Remove is undoable and puts the item back in the palette; the layout is saved per person and Reset to default layout brings back the original.

**Built from:** Board and board item, Items palette, Side panel (drawer), Page header, Dropdown menu, Toast, Empty state, Stat card with comparison, Line chart card

## How it works

1. Build the default layout first with the static dashboard guidelines; this is what new people see and what Reset returns to.
2. Put Add items in the page header. It opens the items palette in a side panel that pushes the board, and closes with the same button or Esc.
3. People add an item by dragging it from the palette onto the board, or by choosing Add to dashboard on the palette item, which places it at the end of the board and moves focus to it.
4. People move and resize items by dragging the handles, by keyboard on the handle, or from the item menu (Move earlier, Move later, Wider, Narrower, Taller, Shorter).
5. Remove from dashboard is the last entry in the item menu. It removes at once, shows a toast with Undo, and the item reappears in the palette.
6. Save every change to the person's layout on the server as it happens; there is no Save button.
7. Reset to default layout sits in the page header's more menu. It applies at once and offers Undo in a toast.

## When to use

- For a personal home page where people in different roles need different items, such as "My open listings" for a recruiter and "Cost per hire" for the head of talent.
- When there are more useful items than fit on one screen, and each person only needs some of them.
- When people use the page for investigation and want related items side by side.

## When not to use

- For a shared report that must read the same for everyone. Use the static dashboard.
- When there are fewer than about six possible items. Rearranging adds work and little value; fix the layout instead.
- Inside a side panel or dialog. The board is the main content of its page.

## Guidelines

- Make the whole page configurable or none of it. Don't pin some items in place among movable ones.
- Moving an item keeps its size, its settings and what it shows, such as the period or the location it is set to.
- Show a drop preview the size and shape of the item while dragging. Items swap when there is room and push others along when there is not; a drop outside the board puts the item back.
- The board has 4 columns on wide screens, 2 on tablets and 1 on phones. Store one layout per column count, so a change on a laptop doesn't scramble the phone layout.
- Layouts are personal. Changing yours never changes a colleague's dashboard or the workspace default.
- When the board is empty, show an empty state with Add items and Reset to default layout.

## Content

- Header actions: "Add items" and, in the more menu, "Reset to default layout".
- Removal toast names the item: "Removed Applications this week. Undo".
- Reset toast: "Dashboard reset to the default layout. Undo".
- Empty board: "Your dashboard has no items" with "Add items to see your hiring numbers here."

## Accessibility

- Dragging is never the only way: every add, move and resize also works by keyboard and from a menu or button with a single pointer action.
- Announce each pick-up, move, resize, drop, add and removal in a polite live region, naming the item and its new position: "Applications this week moved to row 1, column 2".
- After Add to dashboard, move focus to the new item's handle; after Remove, move focus to the next item, or to Add items if the board is now empty.
- Drag and resize handles have names that include the item title: "Move Applications this week", "Resize Applications this week".

## Do

- Do return a removed item to the palette so it can be added again.
- Do keep Remove and Add items close in meaning and in place: one undoes the other.
- Do keep the layout the person made on their next visit and on any device with the same column count.

## Don't

- Don't ask for confirmation before removing an item; offer Undo.
- Don't show a banner inside the board after a removal. The toast is enough.
- Don't store the layout only in the browser; it is lost on another device or after clearing data.

## Related

- Static dashboard
- Dashboard items
- Board and board item
- Items palette
- Undo and destructive actions
