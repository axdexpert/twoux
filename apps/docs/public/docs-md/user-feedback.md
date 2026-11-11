# Collecting product feedback

Ask "Was this helpful?" in a quiet spot after people have read or used something, record the Yes or No straight away, then offer one short optional question.

Kind: pattern · Group: Patterns: general

**Problem:** Feedback pop-ups mid-task annoy people and get dismissed, long surveys get abandoned, and a free-text box in a hiring tool invites people to paste candidate names and other personal data.

**Solution:** Use the feedback prompt at the end of help topics, reports and new features. A Yes or No vote is sent on its own. An optional follow-up of one to three questions appears after the vote, with a reminder not to include personal data.

**Built from:** Feedback prompt, Help panel, Button, Text input, Radio, Checkbox

## How it works

1. Place the prompt at the end of the content, after people have read or used it: the foot of a help topic, the end of a report, the side of a new feature's page.
2. Ask one specific question about that content: "Was this helpful?" with Yes and No.
3. Send the vote as soon as it is chosen. Show a loading state on the button, then a short thank you with the chosen answer.
4. After the vote, reveal an optional follow-up: one to three fields, such as "What was missing?". Send it separately.
5. If sending fails, say so beside the prompt and offer Try again.

## When to use

- At the end of each help topic and help centre article.
- On a feature in beta, such as a new pipeline report, to learn whether it is useful.
- After a new workflow is used for the first time, such as the first bulk extend, as a quiet line in the result banner rather than a pop-up.

## When not to use

- On assistant answers. They have their own good and bad controls next to the origin label.
- In a dialog or pop-up that interrupts a task.
- For more than three questions. Link to a separate survey page instead.

## Guidelines

- Never interrupt. The prompt sits in the page flow, never as a modal or a toast.
- One prompt per page, with at most one follow-up form.
- Keep the follow-up to three questions or fewer; more lowers response and adds data to process.
- Free text carries a privacy line, and the feedback store strips email addresses and phone numbers before saving.
- In a side panel, place the expanding follow-up so the page doesn't jump; on narrow screens, the prompt moves to the end of the content.
- Don't promise a reply. Only say "We'll get back to you" if someone really will.

## Content

- Question: "Was this helpful?" or "Was this report useful?". Answers: "Yes" and "No".
- Thank you: "Thanks, your feedback is recorded." with the chosen answer shown as selected.
- Privacy line under free text: "Don't include candidate names or other personal details."

## Accessibility

- Yes and No are buttons with visible text, not icon-only thumbs.
- After a successful vote, focus moves to the thank you message so it isn't lost.
- Send errors are announced through a live region.

## Do

- Do record the vote before asking anything else.
- Do ask about the specific content, not "How are we doing?".
- Do keep the prompt in the page flow, at the end of the content.

## Don't

- Don't show a feedback pop-up during a task.
- Don't put two follow-up forms on one page.
- Don't collect personal data in feedback free text.

## Related

- Contextual help
- Labelling AI output
- Feedback prompt
- Help panel
