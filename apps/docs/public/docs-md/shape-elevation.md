# Shape and elevation

Four radii, each tied to a role, and two shadows. The page is flat; only layers that float above it (menus, popovers, toasts, dialogs) get a real shadow.

Kind: foundation · Group: Visual foundation

## Principles

- Radius follows role, and stays tight: 4 to 8px. Small parts are tightest, overlays the roundest.
- Flat by default. Raised and overlay elevation are used sparingly because they make a UI busy. Borders and surface changes do the grouping.
- A shadow means 'this floats'. If it casts a --shadow-pop, it sits above the page and can be dismissed.

## Guidelines

- rounded-xs 4px: parts that sit inside a control or a row. Badges, checkboxes, keycaps, menu and palette items, segments, skeleton bars, tags.
- rounded-sm 6px: controls and cards. Buttons, inputs, toggles, the segmented track, banners, cards, empty and error states.
- rounded-md 8px: layers that float. Menus, popovers, the command palette, toasts and dialogs.
- rounded-lg 12px and rounded-xl 16px stay in the scale for marketing surfaces; product UI does not use them.
- Fully round (99px or 50%) is only for avatars, dots and pill toggles.
- --shadow-pop is for overlays only: command menu, menus, popovers, toasts, tooltips and dialogs, the UI that floats over other UI.
- --shadow-sm is a 1px lift on primary and secondary buttons and the AI composer, a tactile cue rather than elevation.
- Known drift: the side panel uses a raw shadow value and several components use raw 2, 3 and 5px radii and raw z-index values. These should become tokens (for example a --shadow-panel and a --z-* scale).

## Accessibility

- A shadow is never the only boundary of a control; it also has a border or fill that meets 3:1 where the boundary matters.
- Overlays must not hide the element that has focus.

## Do

- Match radius to role: a button inside a card still uses rounded-sm.
- Pair --shadow-pop with --surface: each elevation has its own surface and shadow.

## Don't

- Do not put a shadow on a card that sits on the canvas.
- Do not invent radii like 5px or 10px.

## Tokens

| Token | Value | Use |
|---|---|---|
| `rounded-xs` | `4px` | Badges, checkboxes, keycaps, menu items, segments |
| `rounded-sm` | `6px` | Buttons, inputs, toggles, banners, cards |
| `rounded-md` | `8px` | Menus, popovers, palette, toasts, dialogs |
| `--shadow-sm` | `0 1px 2px rgba(23,23,40,.05)` | Button lift, composer |
| `--shadow-pop` | `0 0 0 1px var(--line), 0 10px 28px -8px rgba(23,23,40,.20)` | Floating layers only |
| `--ring` | `0 0 0 2px var(--surface), 0 0 0 4px color-mix(in srgb, var(--accent) 55%, transparent)` | Focus ring on :focus-visible |

## Related

- Colours
- Layout
- Motion
- Design tokens
