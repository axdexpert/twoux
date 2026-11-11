# Accessibility

TwoUX targets WCAG 2.2 level AA on every component and view. Keyboard is a first-class input, focus is always visible and always managed, and single-key shortcuts can be turned off.

Kind: foundation · Group: Key principles

## Principles

- Everything works from the keyboard. All functionality is operable through a keyboard interface.
- Focus is never lost and never hidden. It is always visible, moves in a logical order, and returns where it came from.
- Colour is never the only cue.
- Accessibility lives in components. Teams get it by using components and following their guidance: semantic markup and appropriate ARIA attributes.

## Guidelines

- Focus ring: every focusable element uses :focus-visible with --ring (a 2px --surface gap and a 2px accent ring). Removing focus indicators is catastrophic for keyboard users.
- Dialogs: focus moves into the dialog, Tab stays inside, Esc closes, focus returns to the element that opened it.
- Side panel and popovers: focus moves to the first useful control on open and back to the row or trigger on close. If the trigger is gone, focus moves somewhere logical, such as the next row.
- After deleting or closing rows, focus goes to the next row, so screen reader users notice the list changed.
- Lists and grids use one tab stop with arrow keys or J and K inside (roving tabindex or aria-activedescendant).
- Status messages (saved, closed 3 listings, AI finished) are announced through role=status without moving focus.
- Sticky headers, the bulk bar and the overlay side panel must not fully cover the focused element.
- Targets are at least 24 by 24 CSS px or spaced so they do not crowd.
- Errors say what is wrong and how to fix it.

## Accessibility

- Single-character shortcuts (J, K, X, C, E, F, T, D) can be turned off in the shortcut sheet; ⌘ shortcuts stay on. This meets 2.1.4, which requires that character-only shortcuts can be turned off, remapped or limited to focus.
- Text contrast 4.5:1, large text and non-text 3:1.
- Reflow at 320 CSS px; tables scroll in their own container.
- Reduced motion removes all animation.

## Do

- Test every new component with keyboard only before review.
- Return focus to the triggering row when the side panel closes.

## Don't

- Do not remove outlines without replacing them with --ring.
- Do not move focus for info messages; announce them.
- Do not ship a shortcut that only works with a mouse nearby.

## Related

- Keyboard model
- Colours
- Motion
- Writing
