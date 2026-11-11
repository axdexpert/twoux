# Agent activity log

A chronological list of what agents and the assistant did across runs: time, an icon with a word for the outcome, a past-tense label that links to the run or message, grouped by day.

Kind: pattern · Group: Patterns: AI

**Problem:** A single run shows its own steps, but people ask broader questions: what did the listings agent do this week, which run changed LST-1044, when did someone approve that. Without a log they search through conversations and inbox items from memory.

**Solution:** An activity log on each agent and on the assistant page lists events in time order, newest last within each day, grouped under Today, Yesterday and dated dividers. Each event has a time, a status icon with a word, and a past-tense label that opens the run step, message or record it refers to. A filter narrows by agent, event type or outcome.

**Built from:** Agent run timeline, Grouped list, Filter pills and filter bar, Status badge, Separator, Side panel (drawer), Assistant page

## How it works

1. Group events by day with a labelled divider: Today, Yesterday, then dates such as "Tue 4 Nov 2026".
2. Each row: time in a fixed-width column, outcome icon with a word, a past-tense label, and who started it.
3. The label links to where it happened: the run step, the conversation message or the record.
4. Filter by agent, event type (read, changed, waited, failed) or outcome using the filter bar.
5. On a long conversation, the assistant page can show the same list as an outline whose rows jump to each message.

## When to use

- On each agent's detail to answer "what did it do and when".
- On a long task conversation, as an outline to move between key moments.
- When someone needs to trace which run changed a listing, for example during a review of closing dates.

## When not to use

- While a single run is in progress. Use the agent run timeline with its live steps and Stop.
- For a record's own change history. Use the record's history, which also shows changes people made.
- As a notification feed. Things that need someone go to the Inbox.

## Guidelines

- Every event an agent took is in the log: what it read, changed, waited for and failed, with who started the run.
- Use the same step states and icons as the run timeline; outcome is a word plus an icon, never colour alone.
- Mark events a person did differently from agent events, with the person's avatar, so approvals and rejections stand out.
- Omit the time column where the label already links to a timestamped message.
- Don't auto-scroll to new events unless the person is already at the end of the list.

## Content

- Agent events in the past tense: "Changed closing date on LST-1044", "Read 9 listings".
- Person events start with the verb: "Approved 2 changes", "Rejected sending to Leeds team".
- Times in the person's local time, with the full date and time on hover.

## Accessibility

- Day groups are lists with a heading each, so screen reader users can jump by day.
- New events in an open log are announced politely, at most once every few seconds.
- Outcome icons have text equivalents; the word is visible, not only in a tooltip.

## Do

- Do link every event to where it happened.
- Do group by day once activity spans dates.
- Do mark events people did with their avatar.

## Don't

- Don't pull people to the bottom while they read older events.
- Don't leave out failed or skipped events to make the log look tidy.
- Don't show a time column when the label already links to a timestamped message.

## Related

- Agents acting on your behalf
- Showing reasoning and progress
- Saved tasks and schedules
- Agent run timeline
