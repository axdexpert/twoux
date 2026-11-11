<p align="center">
  <img src=".github/assets/banner.png" alt="TwoUX: a list table with two listings selected and a confirmation dialog asking “Close 2 listings?”" width="100%">
</p>

<h1 align="center">TwoUX</h1>

<p align="center">
  A compact, keyboard-first design system for complex, data-heavy B2B apps, built for teams that ship UI through AI coding agents.
</p>

<p align="center">
  <img alt="Built on shadcn/ui and Radix" src="https://img.shields.io/badge/built_on-shadcn%2Fui_%2B_Radix-17171F?style=flat-square">
  <img alt="Tailwind CSS v4" src="https://img.shields.io/badge/Tailwind-v4-5753E0?style=flat-square">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-5753E0?style=flat-square">
  <img alt="WCAG 2.2 AA" src="https://img.shields.io/badge/WCAG-2.2_AA-00704A?style=flat-square">
  <img alt="75 components" src="https://img.shields.io/badge/components-75-5753E0?style=flat-square">
  <img alt="Free to use, TwoUX Licence" src="https://img.shields.io/badge/licence-free_to_use-5753E0?style=flat-square">
</p>

---

Agents write UI fast and drift quietly: a new grey here, a hand-rolled dropdown there. TwoUX gives every agent in the chain the same answer to "what do I use for this?", so the product stays consistent with no designer in the loop.

It's for dense tools where people make decisions all day: tables, dashboards, ledgers, CRMs, queues and AI agent supervision. One density (compact), light and dark themes, WCAG 2.2 AA checked in the browser.

## What you get

- **75 components** on shadcn/ui and Radix, restyled with role tokens, with live examples and an API page each.
- **46 patterns** named, with the problem each one solves.
- **Files your agent reads before writing UI.** `AGENTS.md` has the rules and a table of 122 jobs, each mapped to one component. `llms.txt`, `llms-full.txt` and `docs-md/` hold every page.
- **`twoux check`**, a linter that catches raw colours, one-off values, local copies and restyled controls, plus a Claude Code guard.
- **One theme file.** Set your brand colour, corners and font in `theme.json`, run `pnpm theme`, and the generator refuses colours that fail WCAG contrast.

## Getting started

```bash
pnpm install
pnpm dev          # docs site on http://localhost:3100
```

```tsx
import "@twoux/ui/styles.css";
import { Button, Toaster, toast } from "@twoux/ui";

<Button shortcut="C" onClick={() => toast.success("Listing created")}>New listing</Button>
```

Point your coding agent at `AGENTS.md` (Claude Code reads `CLAUDE.md`, which includes it).

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Regenerates the agent files and starts the docs site |
| `pnpm theme` | Builds the brand layer from `theme.json`, checking contrast |
| `pnpm twoux-check` | Lints app code: raw colours, one-off values, local copies, restyled controls |
| `pnpm llm` | Regenerates `AGENTS.md`, `CLAUDE.md`, `llms.txt`, `llms-full.txt` and `docs-md/` |
| `pnpm verify` | Type check, interaction tests, responsive checks and a design audit |

## Licence

Free to use, under the TwoUX Licence (`LICENSE.md`). Build and ship any number of your own products with it, including commercial products and client work. Don't sell or republish TwoUX, or a modified copy, as a design system, UI kit, template or component library, and don't train models on it. Third-party notices are in `NOTICE.md`. The name and logo are not licensed for your own products.
