# Clarifying before acting

When the answer would change the result, ask with a question card above the composer: options with a recommended default, number keys, Skip and Next.

Kind: pattern · Group: Patterns: AI

**Problem:** An assistant that guesses rewrites the wrong listings; one that asks too much becomes a form. Without a rule, each feature decides differently when to ask.

**Solution:** Ask only when the answer changes the result, at most three questions, one at a time. Each has a recommended option first, a one-line explanation per option, and "Use defaults" to skip the rest.

**Built from:** Clarifying question card, Assistant side panel, Message composer, Radio, Agent run timeline

## How it works

1. Before acting, check whether the request is ambiguous in a way that changes the outcome (which listings, which period, who receives it).
2. If yes, show the question card docked above the composer: "1 / 2", the question, then options.
3. Options have a title and one line each, the recommended one first and marked, Other last with free text.
4. Number keys 1 to 4 pick an option; Previous, Skip and Next ↵ move through the questions.
5. The thread shows "Waiting for your answer" with a timer; in an agent run the step is marked Needs you and appears in the Inbox.
6. Once answered, the card collapses into a one-line summary of the choice, and the work continues.

## When to use

- When the request is ambiguous and the action is costly to get wrong.
- When an agent hits a decision it is not allowed to make alone.

## When not to use

- When the answer can be inferred from context chips or retrieved from data; don't ask what you already know.
- For low-stakes answers; answer first and offer follow-ups instead.
- For approving a concrete change; use Propose then apply.

## Guidelines

- At most three questions per request, one at a time.
- Every question has a default and "Use defaults" skips the rest.
- Options before free text; the composer stays available for anything the options miss.
- Say why the answer matters in the option's line ("Leaves listings that are doing well alone").
- An unanswered question never blocks forever; in a scheduled run it expires and the run reports that nothing ran.
- Ask first when the stakes are high or confidence is low; otherwise answer for the common case and offer follow-up options to narrow it.
- If the person may not know the answer, say where to find it: "Salary bands are in Team files" with a link.
- Values needed to carry out an action (dates, amounts) are not clarifying questions; use an input card (see Asking for details inside the answer).

## Content

- Questions are short and specific: "Which titles should I rewrite?"
- Mark the default "(Recommended)" in text, not only with a colour.

## Accessibility

- Options are a radio group: arrows move, Space or the number key selects, Enter goes to Next.
- Focus moves into the card when it appears and returns to the composer when it closes.

## Do

- Do put the recommended option first.
- Do let people skip with defaults.

## Don't

- Don't ask more than three questions.
- Don't ask for information already in context.

## Related

- Ask about what's on screen
- Agents acting on your behalf
- Propose, then apply
- Clarifying question card
