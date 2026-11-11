# Design tokens

Tokens are the only way a visual value enters TwoUX. They are named for their job, defined once in :root, and consumed by components. Raw hex, px and ms values in product code are bugs.

Kind: foundation · Group: Visual foundation

## Principles

- A token is a decision, not a value: a name and value pair that represents a small, repeatable design decision.
- Choose by meaning. Pick --ink-2 because it is secondary text, not because it is the grey you wanted; never use a token just because the value matches.
- Components before tokens. Check for an existing component before building a custom one with tokens.
- Never raw values. Use tokens instead of hard-coded values.

## Guidelines

- Naming: short role names with a family prefix. Colour roles are words (--bg, --surface, --ink, --accent, --ok); size families are prefixed (--t-* type, --r-* radius, --h-* height, --c-* categorical, --q-* ordinal). Numbers or size words step along a scale, and suffixes add a variant (-2, -soft, -bg, -line, -hover).
- Layers: role tokens in :root (the public API) are consumed by components; components may declare private local tokens such as --pk-x for the side panel's padding. Product code reads role tokens only through components.
- Today the role tokens hold raw values directly. A raw palette layer underneath is only needed when a second theme arrives; until then one layer keeps the system easy to read.
- Never change the value of an existing token to fix one screen. Add a role or fix the component.
- Enforce with lint: Stylelint for CSS and an ESLint rule for inline styles that reject hex, rgb, raw px font sizes and raw radii.

## Accessibility

- Contrast is checked at the token pairing, so a correctly used token pair passes 1.4.3 and 1.4.11 without re-checking each screen.
- The focus ring is a token (--ring) so every focusable element gets the same visible indicator.

## Do

- Write color: var(--ink-2), not color: #474756.
- Propose a new token in review when no existing role fits.

## Don't

- Do not use a text token for a border because the colour is right.
- Do not override token values inside a component or page.
- Do not use --c* or --q* outside charts.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--ink-2` | `#474756` | Example colour role |
| `--t-base` | `13px` | Example type step |
| `--r-md` | `6px` | Example radius role |
| `--h-sm` | `28px` | Example control height |
| `--c1` | `#5753e0` | Example data token |

## Related

- Consistency
- Colours
- Typography
- Spacing
