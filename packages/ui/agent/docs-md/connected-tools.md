# Connected tools

Outside tools listed in the + menu and settings, each with a detail card saying what it can read and change, where data is stored and who connected it.

Kind: component · Group: AI and agents · Status: built, import from @twoux/ui

## When to use

- Connecting a tool at the moment it is needed, from the + menu.
- Reviewing what a connected tool can access.

## When not to use

- Setting what the agent may do with TwoUX data. Use Agent permissions (agent-permissions).
- Adding a single file. Use Attach a file in the Message composer (message-composer).

## Structure

1. Tools menu (tool, status, Connect, Browse tools)
2. Detail card (name, type, status badge, description, Can read, Can change, Data stored, Connected by, Privacy policy, Disconnect, Permissions)

## Guidelines

- Before and after connecting, say in plain words what it can read and change, where data is stored and who connected it.
- Let people scope a tool to what it needs.
- Give each tool a consistent icon and name across menus and answers.
- When a tool fails or is partly loaded, say so inline and offer reconnect or retry; avoid blank states that imply success.
- Show when data was last synced.

## Content

- "Brings candidates and pipeline stages into TwoUX so the assistant can compare them with your listings."
- Use "Nothing" rather than leaving Can change empty.

## Accessibility

- The tools list is a menu; each tool is a menuitemcheckbox when it toggles use, or a menuitem when it connects (APG menu).
- The detail card uses a description list for its fields (SC 1.3.1).
- Disconnect is a destructive action; confirm with the consequence and keep focus order (SC 2.4.3, 3.3.4).

## Keyboard

| Keys | Action |
|---|---|
| Right arrow | Open the tools submenu from the + menu |
| Space | Turn a connected tool on or off for this conversation |
| Enter | Connect or open the tool |
| Esc | Close the menu |

## Examples

### tool

```tsx
import { ConnectedToolCard, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Say what a tool can do", description: "Before and after connecting: what it can read, what it can change, where data is stored and who connected it.", order: 1 };

export default function Example() {
	const [on, setOn] = useState(true);
	return (
		<div className="w-full max-w-md">
			<ConnectedToolCard
				tool={{ id: "cal", name: "Google Calendar", kind: "Calendar", connected: on, canRead: "Free and busy times of interviewers", canChange: "Nothing. It suggests interview slots only.", stored: "Not stored; read when you ask", connectedBy: on ? "Priya Shah on 3 Nov" : undefined, privacyHref: "#privacy" }}
				onConnect={() => { setOn(true); toast.success("Connected Google Calendar"); }}
				onDisconnect={() => { setOn(false); toast.success("Disconnected Google Calendar", { action: { label: "Undo", onClick: () => setOn(true) } }); }}
			/>
		</div>
	);
}
```

## Related

- Agent permissions
- Message composer
- Team instructions and files
- Connector picker
- Provider logo
