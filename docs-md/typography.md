# Typography

Geist for interface text, Geist Mono for IDs, keys and code. A seven-step scale from 11px to 24px with 13px as the default, tuned for dense tables. Numbers in columns use tabular figures.

Kind: foundation · Group: Visual foundation

## Principles

- 13px is the working size. Tables, forms and panels set at --t-base so a row of 36px holds one line with air. Body larger than this is for reading, not scanning.
- Hierarchy by size and weight, not by colour. Headings use the heading scale; never fake a heading with bold body text.
- Mono for values, not for style. Geist Mono marks IDs, keyboard keys and code: dedicated value types only.
- Sentence case everywhere, including headings, buttons and menu items.

## Guidelines

- Scale: --t-xs 11px (keycaps, counters, chart ticks), --t-sm 12px (metadata, table headers, helper text), --t-base 13px (default UI and table cells), --t-md 14px (reading text in panels and AI answers), --t-lg 16px (section titles), --t-xl 20px (panel titles), --t-2xl 24px (page title).
- No sentence text below 12px. TwoUX allows 11px only for non-sentence content (a keycap, a count, an axis tick). Never set a sentence at --t-xs.
- Line height between 1.2 and 1.45 of the size: tight for headings, about 1.4 for body.
- Line length for reading text (AI answers, descriptions) is capped near 80 characters, inside the comfortable range of 45 to 90.
- Weights: 400 for body, 500 for labels and controls, 600 for headings. Medium weight carries most component text and bold stays rare.
- Numbers that line up in columns (counts, salaries, dates) use font-variant-numeric: tabular-nums, the .num utility. Tabular figures keep vertically aligned columns readable.
- Avoid all caps. If a short label must be in caps, letterspace it, and keep caps to short labels.
- Text is left aligned, ragged right. Centred and justified text is atypical for product UI.

## Accessibility

- Text colour must reach 4.5:1; --ink-3 at 5.7:1 is the lightest allowed for text.
- Text must reflow at 320 CSS px wide without horizontal scrolling, except inside data tables.
- Use real heading elements in order; heading structure matters for accessibility, not just bold or size.

## Do

- Set listing IDs like JOB-1042 in --font-mono at --t-sm.
- Use tabular figures in every numeric column.
- Write headings in sentence case: 'Open listings', not 'Open Listings'.

## Don't

- Do not set font-size in px, rem or em directly; use a --t-* token.
- Do not use mono for emphasis or decoration.
- Do not set paragraphs in all caps.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--font-ui` | `"Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` | All interface text |
| `--font-mono` | `"Geist Mono", ui-monospace, "SF Mono", Menlo, monospace` | IDs, keycaps, code |
| `--t-xs` | `11px` | Keycaps, counters, chart ticks only |
| `--t-sm` | `12px` | Metadata, table headers, helper text |
| `--t-base` | `13px` | Default UI text and table cells |
| `--t-md` | `14px` | Reading text in panels and AI answers |
| `--t-lg` | `16px` | Section titles |
| `--t-xl` | `20px` | Panel and dialog titles |
| `--t-2xl` | `24px` | Page title (h1) |

## Related

- Spacing
- Content density
- Writing
- Design tokens
