# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Engineering teams at B2B SaaS companies: developers and tech leads who ship product UI through AI coding agents (Claude Code, Cursor, Codex, GitHub Copilot), often with no designer in the loop. A developer asks an agent, the agent may hand parts to other agents, and every handover is a chance for drift.

The end users of the products they build are power users of complex B2B apps (analysts, finance teams, sales teams in a CRM, operators clearing queues, people supervising AI agents) who work in the product all day, use the keyboard heavily and need to decide fast and precisely.

## Product Purpose

TwoUX is the engineering-first design system for complex apps. It gives teams production-ready components and gives their AI agents the UX knowledge and guardrails to make the right design decision every time, so the product stays consistent and slop never ships.

Success: the same job always uses the same component, tokens and behaviour, whichever engineer or agent built the screen, and the result is clean, good-looking and easy to use despite the product's complexity.

Confirmed public positioning (home page):
- Title: "The engineering-first design system for complex apps."
- Subtitle: "For teams building complex B2B products with AI coding agents. Beautiful, production-ready components meet research-backed UX principles, giving your AI the tools, knowledge and guardrails to make smarter design decisions, build better experiences and keep slop out of your product."

## Positioning

Four things together, confirmed as the edge:
1. **UX knowledge for agents.** Research-backed rules, a job table that maps each job to one component (and what not to use), pattern steps and the reasoning behind each decision, delivered to agents as files (AGENTS.md, llms.txt, docs-md, skills), and later through a hosted MCP server.
2. **Guardrails that catch drift.** `twoux check` (lint for raw values, local copies, restyled controls), a Claude Code guard hook, and a browser audit for type scale, spacing grid, radius, contrast, focus and target size.
3. **Built for complex B2B UI.** Compact, keyboard-first components for tables, spreadsheet grids, dashboards, charts and AI and agent interfaces, in light and dark.
4. **shadcn base, owned.** Every component is generated from shadcn/ui's untouched source by a script; each change has a written reason (SHADCN-DIFF.md), so shadcn knowledge applies directly.

## Operating Context

- Teams install `@twoux/ui` into React 19 + Tailwind v4 apps and point their agent at AGENTS.md; Claude Code reads CLAUDE.md, which includes it.
- The brand layer is one file, `theme.json` (primary colour, corners, button shape, font); `pnpm theme` builds it and refuses colours that fail WCAG contrast.
- The docs site (apps/docs) is the reference people and agents read: foundations, component pages with live examples and API, patterns, For AI agents, and the home page at `/` with docs at `/docs`.
- The public edition (repository and website) is generated from this private master repo by `pnpm export` (scripts/export); the master is never stripped by hand.

## Capabilities and Constraints

- One edition, free to use: every component, chart, pattern, example app and knowledge file. No Pro tier, no paid parts.
- Licence: the TwoUX Licence (`LICENSE.md`, shown at `/licence`). Free use in any number of own products, commercial and client work included; no selling or republishing TwoUX as a design system, UI kit, template or component library, paid or free; no model training on it. Source-available, not OSI open source. Not yet reviewed by a lawyer.
- Public surfaces must not name the design systems, research or products studied, nor link per-guideline sources. Public wording: grounded in WCAG, WAI-ARIA and the design systems of major SaaS products. Full citations and rationale stay in the master repo.
- Public pages must be indexable by search engines and AI assistants (prerendered HTML, sitemap); only AI training crawlers are blocked.
- Undecided: legal review of the licence, domain purchase, the hosted MCP server, trademark filing.

## Brand Commitments

- Name: **TwoUX** (renamed from Strata on 2026-11-07). Not registered yet; use TwoUX™, never ®.
- Voice: plain UK English, direct, no hype. Public copy written under the owner's name must not read as AI-written: no em dashes, no tidy marketing lists of three for their own sake.
- Interface copy (components, examples, docs-site UI) follows `docs-md/voice-and-tone.md` and `docs-md/writing.md`: precise, calm, candid, respectful of expertise. No humour, playful or celebratory copy, exclamation marks or "we"; delight comes from speed and precision, not words. This overrides any general writing or design skill.
- Engineering-first: talk to engineers about mechanisms (files, checks, components), not adjectives.
- Third-party marks (Google, Slack, Excel…) appear only to identify services people connect, unaltered. Never use marks of products that were studied as references.

## Evidence on Hand

- Agent evals in `evals/`: 13 runs with fresh Claude agents (Opus, Sonnet, Haiku) on realistic tasks. Results: 0 of 10 runs changed a TwoUX component on their own; 3 of 3 brand changes went through theme.json; the closest component was used and a proposal written whenever something was missing; Codex and ChatGPT not tested yet.
- `pnpm verify`: typecheck, interaction tests, responsive checks at 390 and 768px, and a design audit with zero issues in light and dark.
- Counts come from the content files at build time (components, patterns, jobs); never hard-code them.
- **No customers, testimonials, logos or case studies yet.** Do not invent any.

## Product Principles

1. Same job, same component, every time, for every engineer and every agent.
2. Decide the UX, not only the look: which component fits, how a flow behaves, when to confirm and when to offer Undo.
3. Guardrails over guidelines: anything that can be checked is checked, so drift is caught before it ships.
4. Complexity made simple: dense and keyboard-first for experts, without becoming cluttered.
5. Proof over claims: accessibility measured in the browser, numbers taken from the source.

## Accessibility & Inclusion

WCAG 2.2 AA on every surface, measured in a real browser in light and dark: text contrast, visible focus, 24px targets (or the spacing exception), keyboard paths for every action, single-key shortcuts that can be turned off (2.1.4), and reduced motion respected.
