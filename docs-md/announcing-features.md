# Announcing new and beta features

Mark new or beta things where people meet them, with a small text label that opens a short explanation. Keep a What's new list for the rest. Never use toasts or banners for announcements.

Kind: pattern · Group: Patterns: general

**Problem:** Launch messages compete with the messages people need to act on. Banners about a new report push down the list, popovers open on page load, and New labels stay for months until nobody notices them.

**Solution:** A New or Beta text label sits next to the new thing for 30 days. Pressing it opens a popover of one or two sentences and Learn more. A What's new list in the Help menu keeps the last 90 days. Beta pages also carry "Beta" after the page title and a feedback link. Status messages always come first.

**Built from:** App shell and sidebar navigation, Page header, Popover rules, Banner (inline alert), Tabs (underline), List table

## How it works

1. Decide the size of the change. A new page or area: label in the sidebar. A new tab, column, field or option: label next to its name. A small fix: no label, What's new only.
2. Add a text label "New" (or "Beta") after the name. It is a button that opens a popover: a heading, one or two sentences on what it does for the team, and Learn more.
3. Remove New labels after 30 days. Beta labels stay until the feature is generally available.
4. Add the item to What's new in the Help menu, which shows an unread dot until opened.
5. For a beta page, add "Beta" after the page title too, since people arrive by links, with a line on what may change and a Send feedback link.

## When to use

- New: a whole new page, tab, column, field or option that changes what people can do.
- Beta: a feature that may change, may be removed, or is not yet suitable for decisions that matter, such as an early AI shortlist summary.
- A banner on Home only when the whole product or workspace is in beta. It cannot be dismissed on Home and can be elsewhere.

## When not to use

- Not for bug fixes, speed improvements or small layout changes.
- Never as a toast, an auto-opening popover or a page banner for a single feature. Those slots are for status.
- Don't mark something both New and Beta. Beta wins.

## Guidelines

- Status messages always win. If a page has an error or a warning, no announcement appears beside it.
- The label is plain text in the accent colour at the caption size, not a status badge or a tag, so it is never mistaken for a record's state or a category.
- Label each new page, never a group heading, so the label never competes with the group's own toggle.
- Explanations lead with what the person can now do: "Compare time to hire across teams." Not the feature's name or the release.
- Beta explanations say what that means for the work: "Results may change. Check them before you use them in a hiring decision."
- Plan the end: a beta popover says when general availability is expected, if known.

## Content

- Labels are one word: "New" or "Beta". TwoUX has no "Preview" state.
- Popover heading names the capability: "Interview load by person". Not "Introducing...".
- Beta page title: "Pipeline forecast" followed by the Beta label, not "Pipeline forecast (Beta version)".

## Accessibility

- The label is a button with an accessible name such as "New: Interview load, more information", and opens its popover on Enter or Space.
- The popover closes on Esc and returns focus to the label; it never opens on hover or page load.
- The label is text, readable at the caption size against the sidebar background.

## Do

- Do announce in the place where the feature is used.
- Do keep each explanation to two sentences and a link.
- Do give every beta a way to send feedback.

## Don't

- Don't open an announcement on page load.
- Don't leave New labels beyond 30 days.
- Don't rely on email or release notes alone to tell people a feature is in beta.

## Related

- Onboarding to an empty workspace
- Navigation: what goes in the sidebar and the top bar
- Notifications: inbox, bell, toast or email digest
- Labelling AI output
- Banner (inline alert)
- Popover rules
