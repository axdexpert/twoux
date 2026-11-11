# Spacing

Spacing sits on a 4px grid with 2px for fine detail. Space shows relationship: closer means related. Apps use role utilities: fixed ones inside controls that never change, and region ones between parts that tighten by themselves in a workspace.

Kind: foundation · Group: Visual foundation

## Principles

- Proximity is meaning. Related items sit closer than unrelated ones, and items of the same kind share the same gap.
- 4px grid. Spacing is built from small multiples, from 2px to 40px on a 4px grid.
- Spacing comes from components and tokens, not from pixel values typed into a page.

## Guidelines

- Use the role utilities, not numbers. Inside a control: gap-hair (2px), gap-tight (4px), gap-control (6px, icon to label in buttons, menu items and badges only), gap-inline (8px). Between parts: gap-group. Inside a card, pane or panel: p-region. Page sides and top: px-page, pt-page-top.
- Fixed roles never change; region roles change with the layout. On an inset canvas a region is padded 16px, groups sit 16px apart and the page has 24px sides and a 20px top. In a workspace (AppShell frame="flush") regions are padded 8px, groups 12px, the page 12px and 8px, and regions meet at a 1px line.
- Inside a group (a form field's label, input and help text) use 4 to 8px; between groups use gap-group so the grouping is visible.
- Below 860px every page, workspace or not, uses the inset values with 16px page sides, so stacked panes do not crowd.
- The numeric steps (p-2, gap-3) are for TwoUX's own components. twoux check warns on them in app code and names the role to use.
- Every value sits on the 4px grid except two documented ones: 6px between an icon and its label in a row (gap-control), and the padding inside controls generated from shadcn, which stays as shadcn ships it so every button, input and menu keeps its shape.

## Accessibility

- Spacing between small targets counts: a target under 24 by 24px still passes if a 24px circle around it does not overlap another target.
- Content must reflow at 320 CSS px; fixed gaps must not force horizontal scrolling outside tables.

## Do

- Use the same gap between all rows of a property list.
- Let the component own its internal padding.

## Don't

- Do not add margin to a component from outside to nudge it into place.
- Do not invent in-between values like 13px or 18px.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--spacing-hair` | `2px` | Fixed. Icon to text nudges, keycap padding, badge inset (gap-hair, p-hair) |
| `--spacing-tight` | `4px` | Fixed. Inside a control; label to help text |
| `--spacing-control` | `6px` | Fixed. Icon to label inside buttons, menu items and badges only |
| `--spacing-inline` | `8px` | Fixed. Between controls in a row; field label to input |
| `--spacing-group` | `16px · 12px in a workspace` | Region. Between groups and sections (gap-group) |
| `--spacing-region` | `16px · 8px in a workspace` | Region. Inside a card, pane or panel (p-region) |
| `--spacing-page` | `24px · 12px in a workspace` | Region. Page sides (px-page) |
| `--spacing-page-top` | `20px · 8px in a workspace` | Region. Page top (pt-page-top) |
| `--spacing-region-gap` | `16px · 1px in a workspace` | Region. Between cards on a page; in a workspace regions meet at a divider |

## Related

- Content density
- Layout
- Design tokens
