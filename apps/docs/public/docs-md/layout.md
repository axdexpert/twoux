# Layout

One app shell for the whole product: a 224px side navigation on the grey --bg, and an inset white canvas where the work happens. Record details open in a side panel that overlays by default and can push the list aside. Below 860px the shell collapses to one column.

Kind: foundation · Group: Visual foundation

## Principles

- One shell, every screen. A product uses only one app layout; TwoUX has one, so navigation never moves.
- Familiar beats novel. A left nav with a central canvas is the layout people already know from other work tools.
- Keep the list in view. Opening a record should not lose the user's place in the list; a split view shows item details next to the collection.
- Design for widths, not devices. Don't design for specific screen sizes or devices.

## Guidelines

- Shell: .app is a two-column grid, side nav 224px and canvas 1fr, on --bg. The canvas is --surface with 8px margin, a 1px --line border and --r-lg corners, so the work area reads as one sheet inset in the chrome.
- Canvas anatomy, top to bottom: a 44px top bar (breadcrumb, Ask ⌘J, command search ⌘K), the page header (h1 at --t-2xl and up to two actions), then content. Repeated across every view in the same order.
- Side panel, overlay (default): 440px, slides over the right of the canvas, below the top bar. Use it to peek at a record while moving through the list with J and K. It suits tables with few important columns.
- Side panel, push (side by side, ⇧P): the page gets a right margin so the list and panel sit together without overlap. Use it when comparing a record with its neighbours or when the hidden columns matter. People can change the panel position, and TwoUX remembers the choice.
- Full page (Open, ⇧↵): for editing and long reading. Modal dialogs are only for short, blocking decisions such as confirming a close.
- Breakpoints: at 860px and below the side nav hides and grids go to one column; at 1100px and above wide dashboard tiles may span two columns. Components also use 560, 640 and 760px; these should be folded into the two shell breakpoints.
- Reading width: AI answers and long descriptions are capped near 80 characters even on wide canvases.

## Accessibility

- An overlay panel must not entirely cover the focused element; when a row behind the panel has focus, scroll it clear or switch to push.
- At 320 CSS px wide the page reflows to one column; data tables may scroll inside their own container.
- Navigation keeps the same relative order on every page.
- Moving focus into the panel on open and back to the row on close keeps focus order meaningful.

## Do

- Use the shell component for every route, including settings and the assistant.
- Open records in the side panel from lists; open them as a page from links elsewhere.

## Don't

- Do not build a second layout for one feature.
- Do not use a modal to show record details.
- Do not let an overlay panel cover the selected row.

## Related

- Content density
- Keyboard model
- Shape and elevation
- Spacing
