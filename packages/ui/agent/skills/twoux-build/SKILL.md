---
name: twoux-build
description: Build a new page, feature, layout or interaction with TwoUX so it matches the system without drift. Maps the request to TwoUX jobs and patterns, picks components by job, covers every state, and checks the result. Use whenever someone asks to build, add, create or design UI (a page, table, form, dashboard, settings section, AI feature) in a project that uses @twoux/ui.
---

# TwoUX build

TwoUX's rules, job table and pages are the authority: `node_modules/@twoux/ui/agent/AGENTS.md` and `node_modules/@twoux/ui/agent/docs-md/<id>.md` (inside the TwoUX repo: `AGENTS.md` and `docs-md/`). Read AGENTS.md first.

## 1. Understand the job
Restate the request as jobs people do ("narrow the candidates list", "move several candidates to the next stage", "see hiring health at a glance"). If the request bundles several, list them.

## 2. Find the pattern, then the components
- Look for a TwoUX pattern that covers the flow (patterns are listed in AGENTS.md and docs-md). Follow its steps in order.
- For each job, use the component the job table names. Read its page: When to use, When not to use, Behaviour, Accessibility, Keyboard, API.
- If something is missing or only planned, use the closest existing component and tell the person. Never build a local version, a lookalike or a partial one.

## 3. Plan before code
Write a short plan for the person: layout (regions in reading order), components per region, the states each region has (loading, empty, no results, error, disabled or read-only), keyboard shortcuts, and which sources back the main decisions. Ask only about decisions that are theirs (data, scope); decide UI questions from TwoUX.

## 4. Build
- Import everything from `@twoux/ui`. Use variants and sizes, not classes, to change a component. Layout classes (grid, flex, gap, width, margin) are yours.
- Tokens only: no hex, no arbitrary values, no inline styles (a CSS variable for data-driven values is allowed).
- To change the brand, corners or font, edit `twoux.theme.json` and run `npx twoux theme`. Never restyle per page.
- One primary action per view.

## 5. Write the copy
Read `docs-md/writing.md` and `docs-md/voice-and-tone.md` before writing any label, message or empty state. They override any general UX writing or design skill where the two differ.
- For each message, name the moment and its tone from the tone map: inform (default, errors and warnings), empower (decisions and confirmations), encourage (stuck or partly done), motivate (only when someone is starting), satisfy (routine: past tense, a count, Undo).
- Voice stays the same everywhere: precise, calm, candid, respectful of expertise. UK English, sentence case, verb-first labels.
- Errors say what happened and what to do next. No apology, please, exclamation mark, joke or celebration, and no "we": state the event.
- Cut the words listed in voice-and-tone: just, simply, easy, seamless, smart, magic, AI-powered, successfully…
- Assistant text uses the same voice: the answer first, no greeting, "I" only for what it did.

## 6. Finish the layout
For a new page, layout or dashboard, run `/twoux-design` on the result (outside Claude Code, follow `node_modules/@twoux/ui/agent/skills/twoux-design/SKILL.md`): lay out from the job, refuse the lazy defaults, render and check at several widths in light and dark. Correct components are not yet good UI.

## 7. Check
Run `npx twoux check` and fix every error and every `tone` warning. Check reflow at 320px and keyboard use (Tab order, shortcuts, focus return). Report what you built, the states covered, anything you chose not to do and why, and anything TwoUX doesn't have yet.
