# Showing reasoning and progress

While working, say the current step in words with a running timer and a Stop; when done, collapse to "Thought for 2.1s · 4 steps" that opens on request.

Kind: pattern · Group: Patterns: AI

**Problem:** A bare spinner for ten seconds makes people think the assistant is stuck, and a wall of reasoning buries the answer. Without one rule, each surface shows progress differently.

**Solution:** Thinking shows "Thinking" with a timer, then step titles with one line of detail. Send becomes Stop. When the answer starts, the steps collapse into one summary line that stays in the history.

**Built from:** Thinking and steps, Assistant side panel, Agent run timeline, Step card, Message composer

## How it works

1. Under about one second, show nothing; stream the answer straight away.
2. Otherwise show "Thinking" with a running timer and the send button becomes Stop.
3. Each step appears with a short title and one line of detail: "Reading 9 listings".
4. Beyond about ten seconds, show the current step with an estimate, or a progress bar when the total is known ("3 of 50 rows").
5. When the answer starts, collapse to "Thought for 2.1s · 4 steps", expandable on click.
6. Stop keeps what was done so far, marks the run as stopped, and offers Regenerate.

## When to use

- Any assistant answer, agent run or AI column run that takes more than a second.

## When not to use

- To justify an answer. Step text is a progress report, not proof; use citations for evidence.

## Guidelines

- Show what was read and done, with counts and time, in neutral words. No first-person "I'm thinking hard".
- Keep proposed, done and evidence apart: plan steps, completed steps, and citations are three different things.
- Step states have one look everywhere: queued, running, waiting for you, done, skipped, failed, stopped.
- Stop is always visible while anything runs and acts at once.
- Never show credentials, token counts or raw system prompts in steps.
- Collapsed by default in the side panel, where the answer is the main content.
- Two stages: working (nothing to show yet: step text and timer) and writing (the answer streams). Keep a small working indicator until the last part has arrived, so a pause in streaming doesn't look like the end.
- Stream only prose. Tables, lists of records and files render in place as a skeleton with "Loading 12 listings" until complete, then appear whole.
- Thinking is reasoning; steps that read or change data are execution. Execution goes in the agent run or step card, never inside "Thinking".
- Offer "Answer now" only when a useful answer exists from the work so far; what was done stays visible.
- Show thinking expanded by default only where the answer isn't the main content, such as a generated column cell's detail.
- Summaries count honestly: "2 of 5 steps" for steps in order, "3 done · 1 running · 1 queued" for parallel steps; add failed and stopped only when non-zero, and end with why it stopped: "2 of 5 steps · stopped".
- A group's status is its most urgent child's: failed over waiting over running over done. Nest steps two levels at most.

## Content

- Step titles are present participles while running ("Reading 9 listings") and past tense when done ("Read 9 listings").
- Duration uses rounded values: "Thought for 7s".

## Accessibility

- Announce the current step politely and the finished state once; don't announce every token.
- Step state uses icon shape as well as colour.
- The working label stays the same text ("Thinking") while it runs, so screen readers aren't re-reading a changing label.

## Do

- Do name the current step in words.
- Do keep the collapsed summary in the conversation history.

## Don't

- Don't show a bare looping animation for long waits.
- Don't swap the label for streaming reasoning text; it flickers.

## Related

- Propose, then apply
- Agents acting on your behalf
- Generated table columns and enrichment
- Thinking and steps
