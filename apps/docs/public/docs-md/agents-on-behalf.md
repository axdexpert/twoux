# Agents acting on your behalf

Agents work within permissions set per action (Off, Ask first, Allow), show every run as a list of steps, stop to wait for you through the Inbox, and can always be stopped.

Kind: pattern · Group: Patterns: AI

**Problem:** An agent that renames listings or emails candidates on a schedule acts while nobody watches. Without clear permissions, run history and a single place to approve, people either don't trust agents or are surprised by them.

**Solution:** Permissions are set up front per action in plain words, with safe defaults. Each run is a timeline of steps with state. A step that needs approval waits, is marked Needs you and appears in the Inbox. Stop is always visible.

**Built from:** Agent permissions, Agent run timeline, Inbox (triage), Suggested changes, Connected tools, Clarifying question card

## How it works

1. Set permissions per action before the first run: Read defaults to Allow, changes to Ask first, anything that reaches people outside the workspace to Off.
2. The run shows each step with its state in shape and colour: done, running, waiting for you, skipped, failed.
3. Steps that pick rows show the filter they used and open it as a view.
4. A step that needs approval holds its action, is highlighted, says which permission caused it ("Edit listings is set to Ask first") and appears in the Inbox as Needs you.
5. Approve in the Inbox detail without leaving; the run continues. Rejecting is acknowledged in the run ("Skipped").
6. Stop is always visible. A stopped run keeps what it did and says what it didn't.

## When to use

- For multi-step work that runs without the person watching: scheduled tasks, long enrichment, follow-ups.

## When not to use

- For high-risk actions where silence would count as consent. Those stay Off or Ask first, never notice-only.

## Guidelines

- Permissions are explicit, editable and never buried in setup; changing one is one click from the run that hit it.
- Each permission says in plain words what it allows: "Sends from your address".
- Before a scheduled run makes changes, a notice lets people review or cancel.
- Every run records who started it, when, what it read and changed, in an activity log that can be queried.
- A request waiting for approval never blocks forever; it expires and reports that nothing ran.
- Start with low automation; people raise it per action once they trust the results.
- Agents are never disabled or deleted without someone choosing to.
- When a run needs approval in a conversation, show an approval card above the composer with what will run, in plain words, and the tool name in code style.
- For a tool the run will call again, offer "Allow once" and "Allow in this conversation". "Always allow" changes the agent's permission to Allow and is offered only for Read and reversible changes inside the workspace.
- Before approval, say whether it can be undone and who else will see it: "Can be undone for 7 days. Applicants won't be notified."
- After a decision the card closes at once and the thread keeps a resolved line: Approved, Rejected, Approved automatically, or Expired with "Nothing was sent."
- If the person rejects, the assistant acknowledges it and carries on without that step: "Skipped emailing the Leeds team."
- Irreversible actions use the confirmation dialog; when one record is affected the person types its name, when several the dialog lists them. Never both.

## Content

- Run titles say the goal: "Rename low-performing listings". Footer: "Started by Rahul S. · 2 min ago · Every Monday".
- Decisions are logged in past tense: "Approved", "Skipped: email hiring managers. Email is Off in permissions."

## Accessibility

- Step states use icon shape and a word, not colour alone.
- The approval card is not a modal: focus moves to its heading, not to Allow, and the thread stays reachable.
- Resolved states are text, and an expiry is posted as a message in reading order.

## Do

- Do default anything that reaches people outside the workspace to Off.
- Do show which permission made a step wait or skip, with a Change link.

## Don't

- Don't hide permissions in settings only.
- Don't treat silence as consent for risky actions.

## Related

- Propose, then apply
- Notifications: inbox, bell, toast or email digest
- Saved tasks and schedules
- Showing reasoning and progress
- Agent permissions
- Agent run timeline
