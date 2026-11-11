# Agent permissions

Per-action access set in plain words with three levels, Off, Ask first and Allow, grouped into Read and Change.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- Setting what an agent may read and change before it runs.
- Adjusting automation per action as trust grows.

## When not to use

- Approving one specific change. Use Suggested changes (suggested-changes).
- Connecting an outside account. Use Connected tools (connected-tools).

## Structure

1. Group header (Read, Change) with summary level
2. Permission rows (action, what it covers, Off / Ask first / Allow segmented control)

## Guidelines

- Three levels per action: Off, Ask first, Allow.
- Defaults: reading Allow, changes Ask first, anything that reaches people outside the workspace Off.
- Group by Read and Change and describe each in plain words ("Sends from your address").
- Ask first is just-in-time consent: the agent pauses with a proposal. Set up front only the default, not a one-off decision.
- Remind people of the setting when it blocks a step ("Email is Off in permissions") with a link to change it.
- Candidate data is personal data; keep it Ask first so a person reviews each use.
- Per-run choices ("Allow once", "Allow in this conversation") never change the saved level; only "Always allow" does, and it shows here as Allow with who set it and when.
- Allow is never preselected or focused when a level is offered for a risky action.

## Content

- Name actions, not systems: "Edit, extend or close listings", "Email candidates".
- Detail line says what it covers or what happens ("Shows a proposal before each change").

## Accessibility

- Each segmented control is a group labelled by its row, with toggle buttons using aria-pressed (APG button).
- Alternatively use a radiogroup with arrow keys; pick one and use it consistently (SC 3.2.4).
- Changing a level must not change context (SC 3.2.2).
- The selected state is shown with more than colour (SC 1.4.1, 1.4.11).

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move between permission rows |
| Enter / Space | Set the focused level |

## Examples

### levels

```tsx
import { AgentPermissions, type Permission } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Off, Ask first or Allow", description: "Reading defaults to Allow, changes to Ask first, anything that reaches people outside the workspace to Off. Decisions about candidates can never be set to Allow.", order: 1 };

export default function Example() {
	const [items, setItems] = useState<Permission[]>([
		{ id: "r1", group: "Read", action: "Read listings and applicants", covers: "Titles, descriptions, stages and counts", level: "allow" },
		{ id: "r2", group: "Read", action: "Read team files", covers: "Salary bands and the hiring handbook", level: "allow" },
		{ id: "c1", group: "Change", action: "Edit listings", covers: "Titles, descriptions, closing dates", level: "ask" },
		{ id: "c2", group: "Change", action: "Move candidates between stages", covers: "Screen, interview, offer, reject", level: "ask", neverAllow: true },
		{ id: "c3", group: "Change", action: "Email candidates", covers: "Sends from your address", level: "off" },
	]);
	return <div className="w-full max-w-2xl"><AgentPermissions items={items} onChange={(id, level) => setItems((x) => x.map((p) => (p.id === id ? { ...p, level } : p)))} /></div>;
}
```

## Related

- Agent run timeline
- Suggested changes
- Connected tools
- Segmented control
- Plan preview
- Change review
- Connector picker
