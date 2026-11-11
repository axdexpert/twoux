# Migrating an existing app

Move an existing product onto TwoUX one screen at a time, keeping its brand and the way it already works. Primitives come over quietly behind the app's own names; the change people notice comes from rebuilding composites and page flows on TwoUX patterns.

Kind: foundation · Group: Adopting TwoUX

## How it works

1. Check the platform. TwoUX components need React 19 and Tailwind CSS 4; upgrade those first, on their own branch, and run the app's tests before any TwoUX change. twoux init warns when a version is too old.
2. Install @twoux/ui and run npx twoux init. It links AGENTS.md and CLAUDE.md, adds the guard hook, the five skills and twoux.theme.json, and never overwrites existing files.
3. Set the theme before touching a component: the product's primary colour, corner radii and font in twoux.theme.json, then npx twoux theme. The generator refuses colours that fail WCAG contrast.
4. Decide who owns each shared token name. Apps built on shadcn define many of the same CSS variables as TwoUX (primary, border, muted, radius, font). Whichever stylesheet loads last repaints the other's components, so pick one owner per name and delete the other definition.
5. Keep raw Tailwind colours building while you migrate. TwoUX switches off Tailwind's default palette; if the app still uses classes such as text-slate-500, add those colour families back in an @theme block after TwoUX's stylesheet, and remove them once the codemod in step 6 has run.
6. Swap primitives behind the app's own names. Write one thin adapter per component (same name and props, TwoUX inside) so importing files don't change; map variants and sizes to TwoUX's. Expect tests that assert class names to fail, and fix the tests, not the adapters.
7. Codemod raw colour classes to roles (text-slate-500 to text-ink-3, border-slate-200 to border-line, bg-primary-50 to bg-selected). A person reviews the mappings that change meaning, such as light grey text that would fail contrast.
8. Move one screen at a time. Map each composite to the TwoUX job and pattern (filters to the filter bar, record detail to the side panel, delete to Undo, errors in place, the assistant's output to the origin label), rebuild it with /twoux-build and /twoux-design, and keep the product's layout where it already works.
9. Lock it in. Run npx twoux check in CI on every migrated folder, so new drift fails the build while the rest of the app is still moving.

## Principles

- Replace gradually. Each screen moves on its own and ships when it is done; the old and new run side by side until the last screen moves.
- Keep the brand and the workflow. TwoUX takes the product's colour, corners and font through the theme file, and the flows people already know stay where they are unless a TwoUX pattern fixes a real problem in them.
- Start where people see the difference. Swapping buttons and inputs changes little in an app that is already tidy; the rough edges live in composites (filter chips, review cards, dialogs, the sidebar) and in how pages combine them.
- Propose, then apply. Every step is shown as a list of changes the team approves before anything is rewritten.

## Guidelines

- Ask /twoux-audit for the migration plan: it measures the app (versions, shared token names, raw colour classes, primitives that match TwoUX's names, composites that map to TwoUX patterns) and proposes the steps above in order, applying only what the team approves.
- Before moving a screen, decide which of its differences from TwoUX are product decisions to keep and which are drift to remove. Write the kept ones down; they are candidates for a TwoUX proposal, not exceptions to repeat.
- Keep each migration change small enough to review: one adapter, one codemod pass or one screen per pull request.

## Do

- Theme TwoUX with the product's brand colour and font, then swap primitives behind adapters so nothing else changes in that pull request.
- Rebuild the product's own review card as a TwoUX list row with a side panel, because that is the screen people use all day.

## Don't

- Don't rebuild the app in TwoUX's demo look; people should still recognise their product.
- Don't load both stylesheets and leave shared token names to load order.
- Don't stop after the primitives and call the migration done; the visible gains come from the composites.

## Related

- Consistency
- Design tokens
- Colours
- Writing
- Voice and tone
