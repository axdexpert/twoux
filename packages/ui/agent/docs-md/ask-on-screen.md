# Ask about what's on screen

⌘J or Ask opens the assistant beside the data with the current selection and filters as removable context chips, so the scope of every answer is visible.

Kind: pattern · Group: Patterns: AI

**Problem:** People ask "why are these doing badly?" about the rows in front of them. A floating chat with no context makes them retype what they can see, and answers silently cover the wrong set of records.

**Solution:** The assistant opens in the same side panel as record detail. Selection and active filters become context chips automatically; removing a chip narrows the scope. Starters are based on what is on screen. Answers lead with the figure, then a table, then the reason.

**Built from:** Assistant side panel, Message composer, Follow-ups and starters, Team instructions and files, Side panel (drawer), Bulk action bar

## How it works

1. Open with ⌘J anywhere, or Ask in the bulk bar. No floating chat bubble on every page.
2. The composer shows context chips for what the assistant can see: "2 listings", "Status is Live, Expiring". Remove a chip to narrow it; @ adds a record.
3. The empty state offers two or three tasks based on the context, as chips, then the composer.
4. The answer leads with the figure, then a table, then the reason, with record IDs as citations.
5. Follow-ups appear under the answer as muted rows; any table in the answer can open as a filtered view.

## When to use

- For questions about records the person can see or has selected: compare, explain, summarise.
- When the answer will be checked against the list beside it.

## When not to use

- To change records. The assistant proposes; see Propose then apply.
- For filtering a list by known fields. Filter pills are faster than typing.

## Guidelines

- Scope is always visible and editable; the assistant never reads more than the chips say unless the person widens it.
- If the answer needs records outside the chips, ask before widening (see Clarifying before acting).
- A caveat sits by the composer and is specific: "Uses your workspace data only. Check figures before you act on them."
- Every message aligns to the same side in the side panel and on the page; who wrote it is shown by name ("You", "Assistant"), not by alignment.
- The composer is pinned to the bottom and only the thread scrolls. While someone reads or copies older messages, new output doesn't scroll them away; show "New answer ↓" instead.
- The Ask entry point is a secondary button. It never becomes a second primary button on the page and carries no AI styling.
- After context is added, the assistant says what it will use in one line: "Using 2 listings and team file Salary bands 2026." People can correct it before anything runs.
- Connecting an outside tool happens in the thread as a short step card, one step at a time, collapsing to "Connected as Leeds hiring team". People don't leave for settings.
- Errors keep the question: say what failed (no access, connection lost, service error), that nothing changed, and offer Try again with the question still in the composer.
- A refusal says plainly what the assistant won't do and what it can do instead: "I can't rank candidates for rejection. I can summarise each application against the role's criteria."

## Content

- Call it Assistant. Say what it did ("Read 2 listings and 3,000 views"), not that it is AI. No "magic" or "smart".
- Starters are broad, runnable tasks, not niche examples.

## Accessibility

- Streamed answers are announced once complete, not word by word.
- ⌘J returns focus to where it was when the panel closes.
- The thread is a region named "Assistant conversation"; each finished answer is announced once through a hidden live region.

## Do

- Do turn selection and filters into chips automatically.
- Do lead answers with the number.

## Don't

- Don't add a floating chat bubble to every page.
- Don't open with a blank "How can I help?".

## Related

- Propose, then apply
- Clarifying before acting
- Citing sources
- Keyboard-first navigation
- Assistant side panel
- Message composer
