# Keyboard model

TwoUX is built to be driven from the keyboard. ⌘K runs any command, ⌘J opens the assistant, ? shows every shortcut, J and K move through lists, and Esc always closes the innermost layer first.

Kind: foundation · Group: Key principles

## Principles

- Shortcuts are accelerators, not the only path. Everything is also reachable by Tab and by the command menu. APG: do not use shortcuts as a substitute for navigation.
- Few, mnemonic, and familiar. APG warns that too many shortcuts add cognitive load and recommends mnemonics and known conventions.
- Discoverable. Shortcuts are shown in tooltips, menus and buttons as keycaps, so people learn them where they already look.
- Can be turned off. Single-key shortcuts have a switch; ⌘ shortcuts stay on.

## Guidelines

- Global: ⌘K command menu; ⌘J ask the assistant; ? shortcut sheet; / search this view; G then L go to listings; G then P go to pipeline; ⌘Z undo last action.
- Lists: J next row, K previous row, X select, ⇧J extend selection, ↵ open in side panel, ⇧↵ open as full page, ⇧P toggle side by side.
- Actions on the current row or selection: C new listing, E edit, F add filter, T extend 30 days, D duplicate, ⇧E export, ⇧V columns.
- Destructive actions need Shift: ⇧C close listing. Shift keeps a stray keypress from doing harm, and the toast offers Undo.
- Inside popovers, menus and the command menu: ↑ and ↓ move, ↵ chooses, Tab changes scope or moves, Esc closes.
- Esc order, innermost first: 1. open popover or menu; 2. assistant sub-menus and history; 3. the assistant panel; 4. the side panel; 5. clear the row selection. One press closes one layer, and focus returns to what opened it.
- No browser or OS conflicts: avoid ⌘ plus a single key that the browser owns (find, refresh, bookmarks) and modifier combinations with Tab, Enter, Space or Escape.
- Single-key shortcuts are ignored while focus is in a text field.

## Accessibility

- 2.1.4: single-character shortcuts can be turned off in the shortcut sheet ('Turn off if you use a screen reader or voice control').
- All functionality is available through the keyboard, with or without shortcuts.
- J and K move a visible focus or active-row indicator and scroll the row into view.
- The focused row stays visible when the side panel or bulk bar is open.

## Do

- Show the keycap in the button or tooltip for any action that has a shortcut.
- Add new shortcuts to the shortcut sheet and the command menu at the same time.

## Don't

- Do not bind a destructive action to a single unshifted key.
- Do not override ⌘S, ⌘F, ⌘L or ⌘R.
- Do not make Esc close more than one layer at a time.

## Related

- Accessibility
- Consistency
- Layout
