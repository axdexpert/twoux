# Managing agents

One Agents page lists every agent with its source, what it does, whether it is on and where it may act. People turn agents on and off with Undo, edit scope in the side panel, and agents are never switched off or deleted without someone choosing to.

Kind: pattern · Group: Patterns: AI

**Problem:** As a team adds agents (a listings checker, a scheduler, a third-party sourcing tool), nobody can see in one place which are on, who added them, what they can reach and which listings they touch. Trust drops when an agent acts somewhere people didn't expect.

**Solution:** An Agents page with a list table: name and avatar, source, short description, capabilities as tags, scope, status as a word badge and an On switch. Selecting a row opens the agent in the side panel with its permissions, scope and activity log. Add agent sits in the page header.

**Built from:** Page header, List table, Filter pills and filter bar, Switch, Status badge, Tag, Side panel (drawer), Agent permissions, Connected tools, Toast, Inbox (triage)

## How it works

1. List agents in a table with name, source (TwoUX, your team, or the third party that provides it), what it does, scope, owner and status.
2. Turn an agent on or off with its switch. The change applies at once with a toast and Undo; runs in progress finish or stop as the person chooses.
3. Open a row to see and edit its permissions per action, its scope (which teams, listings or locations) and its activity log.
4. Add agent opens the templates gallery or connected tools; a new agent starts Off with changes set to Ask first.
5. If an agent can't run (a connection expired), mark it "Needs attention" and send its owner an Inbox item. Don't switch it off.

## When to use

- When a workspace has more than one agent, or any agent from a third party.
- To answer "what can act on our listings, and who said it could".
- When an admin reviews access, for example before a new team joins the workspace.

## When not to use

- To set what one agent may do in a single run. Use the permission card in the run (Ask first, Allow).
- For outside tools the assistant can read from. Use Connected tools.
- For saved tasks a person runs themselves. Those live in Saved tasks.

## Guidelines

- Show the source next to the name so people can judge trust before turning an agent on.
- Permissions and scope are visible on the page and editable in place, never only inside a setup flow.
- Never switch off or delete an agent automatically. Failures are reported, not acted on.
- Actions that decide on candidates (reject, advance, score for shortlisting) can't be set to Allow for any agent; they stay with a person.
- Deleting an agent removes its schedule but keeps its activity log. It is irreversible, so it uses the confirmation dialog.

## Content

- Page title "Agents" with one line: "Agents that can read or change your hiring data, and where."
- Status words: On, Off, Needs attention. Capability tags are verbs: "Reads listings", "Suggests closing dates".
- Button: "Add agent".

## Accessibility

- Each switch is named with the agent: "Turn on Listings checker".
- Status is a word in a badge, so it reads without colour.
- The switch change and its Undo are announced as a status message.

## Do

- Do show source, scope and status at a glance.
- Do start new agents Off with changes on Ask first.
- Do let people edit scope from the row's side panel.

## Don't

- Don't auto-disable or delete an agent.
- Don't let any agent be allowed to decide on candidates.
- Don't hide permissions inside the setup flow.

## Related

- Agents acting on your behalf
- Agent activity log
- Saved tasks and schedules
- Agent permissions
- Connected tools
