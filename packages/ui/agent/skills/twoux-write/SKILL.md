---
name: twoux-write
description: Write, rewrite or review interface copy the TwoUX way: labels, buttons, errors, empty states, toasts, confirmations, onboarding, help text, assistant text and translation files. Names the moment, picks the tone for it, rewrites each string and shows before and after. Use whenever someone asks to write, fix, review or tidy UI text, error messages or strings in a project that uses @twoux/ui or follows its principles, even if they don't mention TwoUX. Overrides general UX writing skills in these projects.
---

# TwoUX write

The authority is `node_modules/@twoux/ui/agent/docs-md/writing.md` and `voice-and-tone.md` (inside the TwoUX repo: `docs-md/`). Read both first. Where a general UX writing skill or habit disagrees with them (saying "we", celebrating success, adding warmth with exclamation marks), TwoUX wins.

## 1. Collect the strings
List every string in scope with where it appears (file:line or component) and what the person is doing at that moment. For translation files, take every language together; never change one language alone.

## 2. Name the moment, then the tone
For each string, write the moment in a few words, then its tone from `voice-and-tone.md`:
- **Inform**, the default: errors, warnings, statuses, caveats. What happened, what it affects, what to do next.
- **Empower**, at a decision: the consequence and the choices, said plainly. Say before an action if it can't be undone.
- **Encourage**, when work is stuck or partly done: how much is done, what is left, one way forward.
- **Motivate**, only when someone is starting: what it lets them do, as an outcome.
- **Satisfy**, for routine work: past tense, a count, Undo. Nothing more.

If the person asks for a different tone ("make it fun", "friendly and welcoming"), keep the TwoUX voice and say how you read the request: friendly means plain and useful, not cheerful.

## 3. Rewrite
- Voice everywhere: precise, calm, candid, respectful of expertise. UK English, sentence case, verb-first buttons that name the action.
- Address the person as "you". The product never says "we" or "I"; state the event ("Listing not saved"). The assistant says "I" only for what it did.
- No apology, please, exclamation mark, joke, emoji or celebration. Cut just, simply, easy, seamless, smart, magic, AI-powered, successfully.
- Same thing, same word: reuse the product's terms. Don't rename a product term without the person's approval.
- Keep numbers and names as variables so translators can reorder them; write whole sentences, not joined fragments.
- Dates and times come from the Timestamp component (in an app not built with TwoUX, its own date component), never hand-written formats.

## 4. Show, then apply
Show a table: where, moment and tone, before, after, and why (one short reason). Apply only what the person approves, unless they asked you to go ahead. Then run `npx twoux check` (`--principles` in an app not built with TwoUX) and fix every `tone` warning.
