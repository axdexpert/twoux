---
name: twoux-design
description: Make a new or existing TwoUX screen good UI, not just correct UI. Plans the layout from the job, sets hierarchy with TwoUX's own type, spacing and elevation, refuses the lazy defaults (nested cards, card grids as page structure, eyebrow labels, decoration), then renders the screen and checks spacing, alignment, contrast, states, real content and reflow in light and dark. Use when building a new page, layout or dashboard, after /twoux-build has chosen the components, or when someone asks to polish, tidy, refine or "make it look good" in a project that uses @twoux/ui.
---

# TwoUX design

Good UI in TwoUX comes from the job, the hierarchy and the finish, never from a new look. TwoUX already decided the palette, type, radius, density, motion and components; this skill makes a screen use them well. It overrides any general design skill that asks for a new palette, a display font, a signature visual move, a hero or extra motion.

The authority is `node_modules/@twoux/ui/agent/AGENTS.md` and the pages in `node_modules/@twoux/ui/agent/docs-md/` (inside the TwoUX repo: `AGENTS.md` and `docs-md/`). Read `layout.md`, `spacing.md`, `typography.md`, `shape-elevation.md`, `content-density.md` and `voice-and-tone.md` before step 2.

## 1. Lay out from the job
- Write the screen's job in one sentence and what people read first, second and third. That order is the layout's order.
- Use the one app shell (`layout.md`): top bar, PageHeader with one primary action, then content. Record detail opens in the side panel, never a modal or a new layout.
- Pick the main region by the work: a table or list to scan and act, a form in Card sections to create or edit, a dashboard pattern (`static-dashboard.md`, `dashboard-items.md`) to answer questions at a glance. The main region gets the most width; supporting regions are narrower and quieter.
- Everything on the screen earns its place by answering the job. Remove what doesn't before styling what's left.

## 2. Set the hierarchy with TwoUX, not with new styles
- One h1, in PageHeader. Section headings from the heading scale. Hierarchy comes from size, weight and position, not colour.
- Group by proximity first: 4 to 8px inside a group, 16px or more between groups, the same gap between items of the same kind, more space above a heading than below it. Spacing comes from components and their props, not typed values.
- Separate with TwoUX's three elevations (flat, card, float) and the grey fill (`bg-surface-2`) only for quiet supporting groups. Tint only when it means something (selection, do, don't, status).
- One left edge per column: labels, headings, table text and buttons line up. Numbers in columns use tabular figures.
- Reading text (descriptions, assistant answers) stays near 80 characters wide; tables and dashboards use the full width.

## 3. Refuse the lazy defaults
These look finished but make a screen worse. If one seems needed, the job usually calls for a different component.
- Cards as the page's structure, or a grid of same-size cards with an icon, heading and text. Use a table, a list or sections. Never put a card inside a card.
- A small label or kicker above a heading, and section numbers (01, 02) unless the order itself matters.
- A row of big numbers opening every page. Stat cards belong only where the numbers are the point, with a comparison (`stat-compare.md`).
- A modal for something that needs neither interruption nor protected focus.
- Coloured side borders on cards, rows or callouts; status belongs in a Badge or Banner.
- Gradients, glass, glows, gradient text, decorative illustrations, emoji or Unicode glyphs as icons, monospace used for looks rather than for IDs, code and keys.
- Motion that decorates. Use only TwoUX's helpers (Swap, Count, AnimateHeight…) where something changed.
- Sparklines, rings or charts used as filler where a number or a word would do.

## 4. Render and check
Build with `/twoux-build`, then look at the result. If you can run the app and a browser (a dev server plus Playwright, the browser tool or screenshots), capture the screen at 1280, 1024, 768 and 320px wide, in light and dark. Check the render, not the intention:
- **Spacing and alignment:** groups read as groups; same-kind gaps are equal; edges line up; nothing nudged with outside margins.
- **Hierarchy:** with the text blurred, the first thing the eye lands on is the most important thing; one primary button.
- **Contrast:** text 4.5:1, control edges and meaningful icons 3:1, in both themes.
- **Real content:** long names, empty values, zero, one and many, large numbers, long translations. Nothing truncates without a tooltip or wraps badly.
- **States:** loading (skeleton), empty, no results, error with Try again, disabled with a reason, read-only. Each in place, in its own region.
- **Keyboard:** visible focus on every control, sensible Tab order, shortcuts shown, focus returns after panels and dialogs close.
- **Reflow:** at 320px nothing scrolls sideways except tables, code and charts inside their own box; navigation collapses behind its button.
- **Copy:** each message fits its moment in `voice-and-tone.md`.

If you can't render, say so plainly, check the source against the same list, and name what still needs a look in a browser.

## 5. Fix and report
- Fix with layout classes, component props and composition in app code. Never restyle a component or edit `@twoux/ui`; if the screen needs something TwoUX lacks, use the closest component and tell the person what is missing.
- Run `npx twoux check` and fix every error and `tone` warning.
- Report: the job and reading order you designed for, what you removed or refused and why, which widths and themes you rendered, and anything you couldn't verify.

Craft checks in steps 3 and 4 are adapted from Impeccable's craft floor (github.com/pbakaus/impeccable, Apache 2.0), rewritten for TwoUX's fixed tokens and components.
