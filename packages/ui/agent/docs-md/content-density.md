# Content density

TwoUX ships one density: compact. Controls are 28 or 32px high and table rows 36px. Spacing that protects reading and pointing is kept, so compact never means cramped targets. Tool pages that pass three tests use workspace density: the same sizes with the chrome and gaps taken out.

Kind: foundation · Group: Visual foundation

## Principles

- Compact only. Compact suits data-heavy views such as dashboards, resource lists and details; that is every main view in TwoUX, so a second mode would double the testing for little gain.
- One density means one set of numbers. People, reviewers and code generators never have to ask which mode a screen is in.
- Dense data, roomy reading. Informational content such as alerts and help keeps more space even in compact mode; TwoUX keeps 14px text and wider line height in AI answers and descriptions.
- Workspace density takes away chrome, never size. A trading or operations screen fits every region in view by dropping the canvas margin, card frames and gaps between regions, not by shrinking text or targets.

## Guidelines

- Control heights: --h-sm 28px for toolbars, filters and buttons inside rows or panels; --h-md 32px for primary forms and page-level actions; --row 36px for table and list rows.
- Every pointer target is at least 24 by 24 CSS px, or has enough clear space around it. Icon buttons at --h-sm (28px square) pass outright.
- Small targets inside dropdowns and pickers keep extra padding, even in compact mode.
- Never shrink alerts, validation messages or empty states to save space.
- One variant, for data rather than people: Table and SheetGrid take size="dense" (28px rows, the same 13px text) for spreadsheet-like data such as inventories, ledgers, imports and mapping. It is chosen per table by whoever builds the screen, never a switch people turn on.
- Use workspace density only when all three are true: people watch and act on several regions at once; experts work in it for long, repeated sessions; the content is mostly numbers or tables scanned across many rows. Trading, operations consoles, data workspaces and editors pass; forms, settings, onboarding, record detail, list pages and glance dashboards do not.
- Workspace density is a layout, not a size: AppShell frame="flush" with the sidebar as a rail, regions in a Pane layout divided by 1px lines, 8px padding inside panes, charts flush (the default inside a flush shell), and size="dense" for spreadsheet-like tables.
- Even in a workspace, text stays on TwoUX's type scale (13px body, 12px meta, never smaller), targets at 24px or more, and alerts, validation messages and empty states keep their size.
- Below 900px a workspace stacks its panes and the page scrolls; it never becomes a separate mobile app.
- Choose workspace density per page when the page is designed, never as a switch people turn on. Salt's high density (20px controls, 11px text) is the counter-example: Salt itself says it does not meet WCAG 2.2 AA, target size included, and is not recommended as a default.

## Accessibility

- Target size minimum is 24 by 24 CSS px at AA, with a spacing exception for smaller targets.
- Compact rows must still reflow and stay readable at 400% zoom; tables may scroll horizontally inside their own container.
- Because density is not a user setting, zoom and text-size support carry the job of making things bigger.

## Do

- Use --row for every list and table, including the inbox and AI history.
- Check targets with the 24px circle test when placing icon buttons side by side.

## Don't

- Do not add a 'comfortable' variant to a single component.
- Do not shrink text below --t-sm to fit more in a row.
- Do not use workspace density to fit more on a page that fails one of the three tests; give it the inset canvas.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--h-sm` | `28px` | Small controls: toolbars, filters, in-row and in-panel buttons |
| `--h-md` | `32px` | Default controls: forms, page actions |
| `--row` | `36px` | Table and list row height: the 32px control plus 2px above and below |
| `--size-row-dense` | `28px` | Table and SheetGrid size="dense", spreadsheet-like data only |

## Related

- Spacing
- Typography
- Layout
- Accessibility
- Dense table
- Pane layout
- App shell and sidebar navigation
