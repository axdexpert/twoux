# Contextual help

Answer "what is this, why does it matter, how do I choose" in three steps of depth: the words on the screen, a help panel opened from an Info link, and a help centre article in a new tab.

Kind: pattern · Group: Patterns: general

**Problem:** Help that lives only in a separate help centre isn't found at the moment of need, and help crammed into the page as long descriptions slows everyone down. Tooltips stuffed with paragraphs disappear before they are read.

**Solution:** Write the screen first: clear headings, labels and short descriptions. For anything that needs more, put an Info link next to the heading or label that opens the help panel on the right with page, section or field help. Each help topic ends with links to the full article.

**Built from:** Help panel, Page header, Text input, Tooltip, Side panel (drawer), Shortcut sheet (?)

## How it works

1. Small: headings, labels, one or two lines of description, and constraint text under fields. Most questions end here.
2. Medium: an Info link beside a page heading, section heading or field label opens the help panel at that topic.
3. With no Info link pressed, the help panel shows help for the whole page.
4. Large: the panel's Learn more list links to help centre articles, which open in a new tab so the task is not lost.
5. Closing and reopening the panel on the same page shows the last topic read, not the page default.

## When to use

- Decisions with consequences people may not know, such as what Visa sponsorship does to who can apply, or what Closing date means for applications in progress.
- Concepts specific to the product, such as how pipeline stages map to candidate emails.
- Every step of a multi-step create flow, such as Create listing.

## When not to use

- To name an icon button or show its shortcut. Use a tooltip.
- For questions about the records on screen, such as "which listings close this week". Use the assistant (⌘J).
- On the home page or any page with nothing to explain. Never show an empty help panel.

## Guidelines

- Place Info links next to headings and field labels only, never inside descriptions or body text.
- The help topic's heading matches the heading or label it was opened from, word for word.
- Help panel content is read-only reference. Forms and actions belong in the page or the side panel.
- Requirements go in constraint text under the field before any error, not only in the help panel and never only in a placeholder.
- Don't add standalone Learn more links on a page that has help panel content, except inside a banner or dialog.
- Keep descriptions to one or two lines; longer explanation moves to the help panel.

## Content

- Answer three questions in order: what is this, why does it matter, how do I choose.
- Page headings start with a noun for views ("Listings") and a verb for tasks ("Create listing").
- Info link text is "Info"; its accessible name adds the topic: "Info about Visa sponsorship".
- Help centre links say where they go: "Learn how pipeline stages work", not "Click here".

## Accessibility

- The help panel is a labelled complementary region; opening it from an Info link moves focus to the topic heading, and closing it returns focus to the link.
- Info links are buttons (they open a panel), not links, and say which topic they open.
- External help links are marked as opening in a new tab, in text and in the accessible name.

## Do

- Do write the label and description first; add help only for what they can't carry.
- Do give every page that has decisions a page-level help topic.
- Do open help centre articles in a new tab.

## Don't

- Don't put paragraphs in tooltips.
- Don't switch the panel back to the default topic when it is reopened.
- Don't use the help panel as a form.

## Related

- Secondary panels: which right-hand panel
- Onboarding to an empty workspace
- Help panel
- Tooltip
- Shortcut sheet (?)
- Collecting product feedback
