# Labelling AI output

Mark generated content with one small origin mark next to it. No AI colour, no sparkle on every button, no "AI-powered" copy.

Kind: pattern · Group: Patterns: AI

**Problem:** People need to know which values a model wrote before they rely on them. But products that colour and sparkle every AI feature teach people to ignore the marks, and each team styles them differently.

**Solution:** Generated content carries the origin mark and a line such as "Assistant · from your workspace data". Generated cells get the mark and a faint neutral tint and show when they were written. Buttons that start AI work look like every other button.

**Built from:** AI origin label, AI column, Assistant side panel, Suggested changes, Export menu, Colours

## How it works

1. Put the origin mark next to the generated output itself: under an answer, in a generated column header, on a drafted field.
2. When a whole group is generated, label the group header once instead of every item.
3. Say what produced it and from what: "Assistant · from your workspace data".
4. When a person edits a generated value, it becomes theirs and the mark goes; the original stays in history.
5. Exports name generated columns so they are never mistaken for real data.

## When to use

- For any value, text or chart the assistant or an agent produced that a person has not yet edited.

## When not to use

- On buttons and entry points. Name the action instead ("Ask", "Suggest titles").
- For non-generative automation such as rules or sorting.

## Guidelines

- One mark, used only for generated output, never as decoration.
- No separate AI colour. The tint on generated cells is a neutral surface so status and data colours keep their meaning.
- Label the action, not the technology: "Summarised from 12 notes" beats "AI-generated".
- Pair the mark with a way to see why: hovering it shows the sources and when it was written.
- Feedback (good, bad) sits under every answer next to the mark.
- The origin label is only for generative output. Rule-based automation (auto-close on expiry, duplicate detection) says what rule did it instead: "Closed automatically on 6 Dec".
- The more control an action hands over, the clearer its label before it runs: "Runs as Listings checker · changes need approval" on a scheduled task.
- If the whole surface is the assistant, don't repeat the mark on every part. The answer row carries it once.

## Content

- Use "Assistant" as the name. Avoid "magic", "smart" and "AI-powered".
- Mark text is short: "Assistant · 2 min ago".

## Accessibility

- The mark has a text label for screen readers ("Written by Assistant"); it is not only an icon or a tint.
- The tint meets contrast for the text on it.

## Do

- Do label generated output close to where it appears.
- Do remove the mark once a person has edited the value.

## Don't

- Don't give AI features their own colour or gradient.
- Don't add a sparkle to every button that calls a model.

## Related

- Citing sources
- Generated table columns and enrichment
- Ask about what's on screen
- AI origin label
