# Motion

Motion in TwoUX shows what changed and where it went: 120 to 260ms, eased by role, exits shorter than entrances, and nothing moves when people ask for reduced motion. It never decorates.

Kind: foundation · Group: Visual foundation

## Principles

- Motion explains a change. Use it when people need to see what happened: a panel arriving, a section expanding, a value updating, a setting switching. If nothing would be lost without it, leave it out.
- Productive, not expressive. Expressive motion suits rare, significant moments; a tool used all day has none worth the delay, so TwoUX has no expressive tier.
- Ease by role. Something arriving or changing in place decelerates (--ease-entrance, --ease-standard), something moving between two places eases at both ends (--ease-move), something leaving accelerates and gets out of the way (--ease-exit). Only a changing count overshoots (--ease-pop).
- Shortest that is not jarring. Most UI animation belongs between 100 and 500ms, and animations are far more often too long than too short; TwoUX stays between 120 and 260ms for anything people trigger.
- Overlays keep shadcn's motion. Dialogs, menus, popovers and tooltips open with shadcn's fade and 95% zoom; the sheet slides 40px with a fade over 200ms. The push side panel matches it with --duration-move and --ease-move, so the list beside it eases aside.
- Changes inside a screen use the motion helpers: Swap for a label or icon that changes state, Count for a number that changes, RollingNumber for a figure on a stat card, ShimmerText for a working status, StreamingText for AI text, AnimateHeight for a card that changes size. Nothing animates on first render.
- Never the only signal. Motion never carries information alone; every change motion shows is also visible in its end state.

## When to use

- Panels, sheets and dialogs arriving, so people see where they came from and where they will go back to.
- Sections expanding or collapsing, and cards changing height, so the content below doesn't jump.
- State changes on a control people just used: a switch, a selected segment, Copy turning into Copied.
- A value that updates while people watch, such as a stat card after a filter change or a count in a tab.
- Toasts arriving and leaving, so a confirmation is noticed without taking focus.

## When not to use

- Hover on table rows, list items and menu items. These change many times a second as the pointer moves; a fill that lags reads as a slow app.
- Rows loading, sorting or filtering in a table. People scan the result, not the transition.
- Anything that blocks the next action: never make people wait for an animation to finish before they can click or type.
- Decoration: entrance animations on page load, gradients that drift, icons that wiggle to get attention.
- Showing that AI is working when the result is under about one second away; show the result.

## Guidelines

- Hover, press and colour changes: --duration-fast (120ms).
- Tabs, menus, state swaps and small transforms such as a chevron turning: --duration-base (180ms).
- Panels and layout that move, such as the side panel push or the sidebar collapsing: --duration-move (200ms) with --ease-move, matching shadcn's sheet.
- Content swaps, height changes and progress fills: --duration-slow (260ms).
- Figures rolling to a new value: --duration-long (480ms), only for values people read after the change, never for something they trigger many times a minute.
- Exits are shorter than entrances and use --duration-exit with --ease-exit. Tooltips, hover cards and menus may disappear at once; nobody needs to watch them leave.
- Match the exit to the entrance: what slid in from the right leaves to the right, what faded in fades out.
- Direction follows the action. Going deeper (opening a record, the next step) moves forward; going back moves back.
- Contextual UI grows from its trigger: a menu or popover opens from the button that opened it. Global UI such as the command palette and toasts has no trigger to connect to.
- Loops (spinner 0.8s, thinking pulse 1.2s, skeleton shimmer 1.4s) always sit next to text such as 'Searching listings', and stop once content arrives. Theme tempo does not scale them.
- Animate with the tokens, never with raw values, so a theme tempo change reaches every animation: duration-(--duration-base) ease-(--ease-standard) in a class, var(--duration-base) in CSS.
- Tune motion for a whole product in the theme file: motion.tempo from 0.75 (quicker) to 1.25 (calmer) scales every duration token, and motion.character "crisp" removes the overshoot from pops. Never retime one component on one page.
- Streamed text appears without a typing animation or cursor blink; under reduced motion it arrives in sentences or paragraphs rather than word by word.

## Accessibility

- Under prefers-reduced-motion: reduce, TwoUX sets every transition and animation to 0ms, so changes happen at once. Values that change in place, such as a progress fill, jump straight to the new value.
- WCAG 2.3.3 (AAA) asks that interaction-triggered motion can be disabled; TwoUX meets it through the operating-system setting, with no extra control to find.
- Because the reduced-motion rule also stops spinners, every loading state must have text that says what is happening.
- Nothing flashes more than three times a second.
- Test every view with reduced motion turned on, on a laptop and on a touch screen.

## Do

- Animate a spatial change, such as a panel sliding in, so people see where it came from.
- Use the fast band for small interactions and the move or slow band for layout changes.
- Leave faster than you arrive.
- Change tempo in the theme file when the whole product should feel calmer or quicker.

## Don't

- Don't animate hover on rows or menu items, or make any frequent interaction lag.
- Don't use bounce, spring or scale-up entrances; the only overshoot is a count that changes.
- Don't go above 300ms for anything people trigger often, or make people wait for an animation before acting.
- Don't move something in a way that contradicts where it came from or where it goes.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | `120ms × tempo` | Hover, press, colour, small controls |
| `--duration-base` | `180ms × tempo` | Tabs, menus, state swaps, small transforms |
| `--duration-move` | `200ms × tempo` | Panels and layout that move (side panel, sidebar) |
| `--duration-slow` | `260ms × tempo` | Content swaps, height changes, progress fills |
| `--duration-long` | `480ms × tempo` | Figures rolling to a new value only |
| `--duration-exit` | `= --duration-fast` | Anything leaving |
| `--ease-standard` | `cubic-bezier(0.22, 1, 0.36, 1)` | State changes in place: swaps, numbers, heights, fills |
| `--ease-entrance` | `cubic-bezier(0.22, 1, 0.36, 1)` | Something arriving |
| `--ease-move` | `cubic-bezier(0.4, 0, 0.2, 1)` | Something moving between two places |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Something leaving. Never overshoots |
| `--ease-pop` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | A count that changes. Standard character only; crisp uses --ease-standard |
| `--motion-tempo` | `1 (0.75 to 1.25)` | Set by motion.tempo in the theme file. Scales every duration token |
| `--ease-out, --ease-in-out, --ease-soft, --ease-spring` | `aliases` | Earlier names for entrance, move, standard and pop. Kept for existing code |

## Related

- Accessibility
- Shape and elevation
- Design tokens
