# Keyboard-first navigation

Every action has a key shown on its button. J/K move, Enter opens, Esc steps back one layer at a time, ⌘K runs anything, ⌘J asks the assistant.

Kind: pattern · Group: Patterns: general

**Problem:** Power users triage hundreds of rows a day. If shortcuts differ per screen, or Esc sometimes closes a panel and sometimes clears a selection, people stop trusting the keyboard.

**Solution:** One keyboard model across TwoUX: the same keys mean the same thing everywhere, shortcuts are shown on buttons, ? opens the full list, and single-key shortcuts can be turned off.

**Built from:** Command palette (⌘K), Shortcut sheet (?), Keyboard shortcut hint, List table, Side panel (drawer), Assistant side panel, Inbox (triage)

## How it works

1. J and K move the row focus; X selects; ⇧J extends the selection.
2. Enter opens the focused row in the side panel; ⇧↵ opens the full page.
3. Esc closes the top-most layer only, in this order: open menu or popover, then text field edit, then dialog, then side panel, then selection.
4. ⌘K opens the command palette: actions on the current selection first, then Go to. ↑↓ move, ↵ runs, Tab changes scope.
5. ⌘J opens the assistant with the current selection and filters as context.
6. ? opens the shortcut sheet, which also holds the switch for single-key shortcuts.

## When to use

- On every screen. A new action is not finished until it has a key, a place in ⌘K and a hint on its button.

## When not to use

- Don't add single-key shortcuts inside text fields or the composer; there the keys type text.
- Don't make a shortcut the only path to an action; every action is also a visible control.

## Guidelines

- Show the shortcut on the button or menu item itself so people learn it by using the product.
- Keep the set small and mnemonic: C create, E edit, F filter, T extend, D duplicate.
- Avoid ⌘ plus a single key that the browser or OS owns, except deliberate, well-used ones such as ⌘K.
- Single-key shortcuts can be turned off; ⌘ shortcuts stay on.
- Focus is always visible and never lost to the page body when a row or panel disappears.
- Use the same keys as tools people already know (J/K, ⌘K) instead of inventing new ones.

## Content

- Hints use symbols: ⌘K, ⇧↵, Esc. Shown in a muted key cap after the label.
- The shortcut sheet groups keys by Navigate, Table and Act.

## Accessibility

- Everything works by keyboard alone.
- Lists use roving tabindex so Tab enters and leaves a list in one step and arrows move inside it.
- Single-character shortcuts can be turned off for screen reader and voice control users.
- Closing a layer returns focus to the element that opened it.

## Do

- Do keep Esc's order the same on every screen.
- Do list every shortcut in ? and in ⌘K.

## Don't

- Don't let one Esc press close two layers.
- Don't reuse a key for different actions on different pages.

## Related

- Record detail: side panel, overlay or full page
- Selection and bulk actions
- Ask about what's on screen
- Command palette (⌘K)
- Shortcut sheet (?)
