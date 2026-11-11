# Colours

TwoUX is a mostly neutral interface, light by default with a dark theme people can choose. Colour is spent on two things only: the one accent that marks the main action and current selection, and three reserved status families. Every colour is applied through a role token, never a hex value.

Kind: foundation · Group: Visual foundation

## Principles

- Neutral first. Surfaces, text and lines are cool greys with a slight violet bias, so data and status carry the colour. Most of the UI stays white and greyscale, and colour is kept for calls to action and status.
- Light by default, dark by choice. Every role token holds a light and a dark value (CSS light-dark()), so components are written once and switch together when <html> gets data-theme="dark", or "system" to follow the device. Dark values are chosen for dark, not inverted: surfaces step lighter as they rise (page, surface, popover), status text moves to the 400 steps, status fills are mixed into the surface, and chart colours are a separate validated selection. Each pair is contrast-checked against its own theme's surface.
- One accent with one job. --accent marks the primary action, the current selection and focus. It never means good, bad or anything else.
- Status colours mean status. --ok, --warn and --bad (and --mute for neutral) describe the state of a record, such as a listing that is live, expiring or closed. They are never decoration and never a chart series.
- Choose by role, not by look. Pick the token whose name matches the job, even when another token happens to render the same hex.
- Colour is never the only cue. Every state that uses colour also has text, an icon or a shape change.

## When to use

- Use --accent for the single primary button in a view, the selected nav item, links and the focus ring.
- Use a status family (text, -bg, -line together) for badges, banners, inline validation and row state.

## When not to use

- Do not use status colours to make something look important; use type weight or position instead.
- Do not use --c1 to --c8 or --q1 to --q5 in UI chrome; those belong to charts only.

## Guidelines

- Text: --ink (17.8:1 on white) for primary text, --ink-2 (9.1:1) for secondary text and labels, --ink-3 (5.7:1) for metadata and placeholders. All three pass the 4.5:1 text minimum on both --surface and --bg.
- Ground: --bg (#F5F5F8) is the app chrome; --surface (#FFFFFF) is the inset canvas where work happens; --surface-2 is a quiet well inside a surface. --hover and --selected are row and item states.
- Lines: --line and --line-strong are separators for grouping. At 1.24:1 and 1.44:1 on white they are too faint to be the only thing that identifies a control, so inputs and buttons must also have a fill, label or text that meets 3:1 or 4.5:1.
- Status families come in threes: text (--ok #1E7F47), background (--ok-bg) and border (--ok-line). Use the three together so the pairing is always the tested one: --ok on --ok-bg is 4.51:1, --warn on --warn-bg 5.30:1, --bad on --bad-bg 4.79:1.
- Selected and active states pair colour with a second cue: a check, a filled background, a weight change or an underline.
- --progress (#D9A118) is 2.32:1 on white. It may only fill a bar or dot that sits next to a text value; it must never carry meaning alone.
- AI has no colour of its own. The origin mark and its text use the muted text colour; generated cells use the neutral generated tint.
- No gradients, glows or animated fills on AI surfaces, avatars or loading. Progress is shown with words, a timer and the standard spinner or progress bar.
- Form controls, links and the accent keep their usual colours inside the assistant.

## Accessibility

- Body text must reach 4.5:1 and large text 3:1 against its actual background; ratios are not rounded up, so 4.49:1 fails.
- Control boundaries, icons that carry meaning and the focus ring must reach 3:1 against adjacent colours.
- Disabled controls are exempt from contrast, but they must still be identifiable by label.
- Never convey status by colour alone. A red row also says 'Closed'; a green dot also says 'Live'.

## Do

- Use one --accent button per view so the main action is obvious.
- Pair every status colour with a word.
- Reference tokens by name in code.

## Don't

- Do not write hex, rgb or named colours in component code.
- Do not use --bad for anything that is not an error, a destructive action or a closed state.
- Do not pick a token because its colour matches what you want; pick it because its name matches the job.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#F5F5F8` | App chrome behind the canvas |
| `--surface` | `#FFFFFF` | Inset canvas, cards, panels, popovers |
| `--surface-2` | `#FAFAFC` | Wells and quiet areas inside a surface |
| `--hover` | `#ECECF2` | Row and item hover on a surface (tables, lists, menus) |
| `--selected` | `#E6E6EC` | Hover on the app background (sidebar, top bar) and the cell under the pointer in a grid; the current nav item sits raised on --surface instead |
| `--line` | `#E6E6EC` | Default separator |
| `--line-strong` | `#D6D6DF` | Stronger separator, keycap border |
| `--ink` | `#17171F` | Primary text (17.8:1 on white) |
| `--ink-2` | `#474756` | Secondary text and labels (9.1:1) |
| `--ink-3` | `#656574` | Metadata, placeholder (5.7:1) |
| `--accent` | `#5753E0` | Primary action, selection, links (5.65:1) |
| `--accent-hover` | `#4A46D1` | Primary action hover |
| `--accent-soft` | `#EEEDFD` | Accent tint for selected and AI surfaces |
| `--accent-ink` | `#4340C4` | Accent text on --accent-soft (6.56:1) |
| `--on-accent` | `#FFFFFF` | Text on --accent |
| `--ok / --ok-bg / --ok-line` | `#1E7F47 / #E8F6EE / #BFE3CD` | Positive status |
| `--warn / --warn-bg / --warn-line` | `#965606 / #FDF4E3 / #F0D7A8` | Caution status |
| `--bad / --bad-bg / --bad-line` | `#C2333B / #FCECED / #F1C3C6` | Error, destructive, closed |
| `--mute / --mute-bg / --mute-line` | `#474756 / #F2F2F5 / #E1E1E8` | Neutral status such as Draft |
| `--progress` | `#D9A118` | Progress fill only, always next to a text value |

## Related

- Data visualisation colours
- Design tokens
- Accessibility
- Shape and elevation
