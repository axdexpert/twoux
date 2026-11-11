---
name: twoux-audit
description: Audit a screen, flow or whole app against TwoUX, propose fixes and apply the ones the person approves. Works on three kinds of app - one built with @twoux/ui (drift, wrong component, missing states, broken patterns), one not built with TwoUX (TwoUX's principles met with the app's own components and brand), and one moving onto TwoUX (a step-by-step migration plan). Every finding cites the TwoUX page behind it. Use when someone asks to audit, review, improve, clean up, "make consistent", refactor or migrate UI, even if they don't mention TwoUX.
---

# TwoUX audit

TwoUX's rules, job table and pages are the authority: `node_modules/@twoux/ui/agent/AGENTS.md` and `node_modules/@twoux/ui/agent/docs-md/<id>.md` (inside the TwoUX repo: `AGENTS.md` and `docs-md/`). Read AGENTS.md first.

## 1. Mode and scope
Pick the mode from the project, and say which one you chose:
- **TwoUX app:** `@twoux/ui` is a dependency and the screens use it. Every rule applies.
- **Principles:** the app is not built with TwoUX and the person isn't moving it onto TwoUX (`twoux init --principles` writes this into AGENTS.md). Only rules not marked **TwoUX only** apply. Fixes use the app's own components, tokens and brand; never bring in TwoUX components piece by piece, and never impose TwoUX's look.
- **Migrate:** the person wants to move the app onto TwoUX. Follow `docs-md/migrating.md`.

Then agree the scope: which screens or files, and whether to report only or also fix. Default: report first, fix after the person agrees.

## 2. Mechanical check
- TwoUX app: `npx twoux check <paths>` (TwoUX repo: `pnpm twoux-check <paths>`). Every error is a finding.
- Principles: `npx twoux check --principles <paths>`, which runs only the checks that hold outside TwoUX (copy tone).
- Migrate: also measure the app: React and Tailwind versions, CSS variable names shared with TwoUX (primary, border, muted, radius, font…), raw Tailwind colour classes (count by file), components whose names match TwoUX's (Button, Badge, Tabs, Dialog…), and the app's composites (filter chips, cards, panels, dialogs) with the TwoUX job each one does.

## 3. Read the screen as a person would
For each region, ask:
- **Job:** what is the person trying to do here? Find the job in the AGENTS.md job table. In a TwoUX app, is the component the one TwoUX names? In principles mode, does the app's component behave the way that TwoUX component does (a record opens beside the list, not in a modal or a new page)?
- **Pattern:** does a TwoUX pattern cover this flow (filtering, bulk actions, create, edit, delete, record detail, propose then apply, dashboards, errors, disabled and read-only, help, feedback)? Read its page and check every step. Patterns are principles: they hold in any app.
- **States:** loading (skeleton for tables), empty (no data vs no results), error in place with Try again, disabled with a reason vs read-only, unsaved changes.
- **Actions:** one primary per view; destructive actions confirm only when Undo can't fix them; every action keyboard-reachable with its shortcut shown.
- **Content:** read `docs-md/writing.md` and `docs-md/voice-and-tone.md`; they override any general UX writing or design skill. UK English, sentence case, verb-first labels; errors say what happened and what to do next; the tone fits the moment; no humour, apology, please, exclamation mark, celebration, "we" or words from the cut list; assistant text in the same voice. Every `tone` warning is a finding.
- **Craft:** reading order follows the job; hierarchy from size, weight and position; groups visible through spacing; edges aligned; none of the lazy defaults in `node_modules/@twoux/ui/agent/skills/twoux-design/SKILL.md` step 3. Render the screen at 1280, 768 and 320px in light and dark when you can.
- **AI:** proposals before changes, origin label, citations, no automated decisions about people.
- **Accessibility:** WCAG 2.2 AA: contrast, 24px targets, visible focus, names, status not by colour alone, reflow at 320px.

In principles mode, if the app's own design system deliberately does something differently from a TwoUX principle, report it as a conflict for the person to decide, not as a defect.

## 4. Propose
Group findings by severity: **Blocks people** (accessibility failures, data loss risk, wrong destructive behaviour), **Drift** (wrong component, restyles, raw values, broken patterns), **Polish**. For each: where (file:line or region), what is wrong, the proposed change, and the page that backs it (`docs-md/<id>.md`, which carries the sources). Never cite a rule that isn't in TwoUX's files, and in principles mode never cite a **TwoUX only** rule.

In migrate mode, the proposal is the plan from `docs-md/migrating.md` in order (platform, init, theme, token owners, raw colours, adapters, codemod, screen by screen, CI), filled in with what you measured: which tokens collide, how many raw classes, which adapters, which screens first and why.

Number the proposals so the person can approve them by number.

## 5. Apply what was approved
- Apply only the approved items, one screen or one migration step at a time, each small enough to review.
- TwoUX app: fix with TwoUX components and props, in app code only. Never edit `@twoux/ui` or `packages/ui`; if TwoUX lacks something, use the closest component and tell the person what is missing.
- Principles: fix with the app's own components and tokens, keeping its brand and its existing flows where they already work. Change behaviour, structure and words, not the look: an element you rebuild (a toast that gains role="status" and Undo, a modal that becomes a side panel) keeps the colours, shape and type it had, or takes them from the app's nearest existing element. Before finishing, compare every class you changed on a surface people see; if a colour, radius or font changed and no finding required it, put it back.
- Migrate: follow the step's instructions in `docs-md/migrating.md`; run the app's tests after each step and report what failed and why.
- Verify before reporting, using the project's own scripts (package.json): type-check, run the tests, and render each changed screen (start the dev server and open it in a browser or with Playwright) at 1280 and 320px. Try the states you fixed: empty, no results, an error, Undo, keyboard only. If a step can't run (no script, no browser), install nothing new; say which step didn't run and what still needs a look.
- Re-run the check from step 2 and list what changed, what was verified and how, what was left and why.
