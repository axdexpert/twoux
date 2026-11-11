# Connector picker

Search and connect outside services. Each row says what connecting lets the product do, and a dialog explains the access before anything is shared.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- Connecting several outside services, from onboarding or from Settings.
- Showing what is connected and what needs attention in one place.

## When not to use

- Setting what an agent may do with a tool. Use Agent permissions (agent-permissions).
- Reviewing one tool in depth. Use the detail card in Connected tools (connected-tools).

## Structure

1. Search (with the number of services)
2. Connected group
3. All services group
4. Row (logo, name, what it lets the product do, Connect, Reconnect or Manage)
5. Connect dialog (access in plain words, who it is shared with, OAuth or API key, Cancel)

## Guidelines

- Add search with the count of services, and put Connected first.
- Say what connecting lets the product do, in plain words, before connecting: "Read and send email".
- Say who the connection is shared with, for example "Only you" or "Everyone in TwoUX".
- OAuth opens the provider in a new window. Say so on the button ("Continue to Slack") and bring people back with a status message.
- Test an API key before saving it, store it encrypted and never show it again. Say all three beside the field.
- When a connection expires, show Needs attention with the reason and a Reconnect button, never colour alone.
- Disconnecting lives in Settings and asks what stops working before it does.

## Content

- "Read your calendar to find free times. Cannot change events."
- "Slack needs you to sign in again. Reconnect to resume the daily summary."

## Accessibility

- Rows are a list under group headings; the group names are real headings (SC 1.3.1).
- Buttons repeat the service name for assistive technology: "Connect Slack" (SC 2.4.6, 4.1.2).
- The dialog traps focus, returns it to the button and announces success with role="status" (APG dialog, SC 4.1.3).
- Status is carried by words (Connected, Needs attention) as well as colour (SC 1.4.1).

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move through the search, then each row's button |
| Enter or Space | Connect, Reconnect or Manage |
| Esc | Close the dialog without connecting |

## Examples

### api-key

```tsx
import { Button, ConnectDialog, type Connector } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Connect with an API key", description: "The key is tested before it is saved. Try any text to see the error, or \"nw-live-key\" to connect.", order: 2 };

const XERO: Connector = { id: "xero", provider: "xero", can: ["Read invoices and payments", "Cannot create or change anything"] };

export default function Example() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button variant="outline" onClick={() => setOpen(true)}>Connect Xero</Button>
			<ConnectDialog
				connector={XERO}
				open={open}
				onOpenChange={setOpen}
				method="apikey"
				scope="Only you"
				onTestKey={async (key) => { await new Promise((r) => setTimeout(r, 700)); return key === "nw-live-key" ? undefined : "Xero did not accept that key. Check you copied all of it from Settings, API keys."; }}
				onDone={() => {}}
			/>
		</>
	);
}
```

### connect-oauth

```tsx
import { ConnectDialog, ConnectorPicker, toast, type Connector } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Search, connect, reconnect", description: "Connected first, then everything else. Slack shows Needs attention with Reconnect. Connecting asks first, in plain words.", order: 1 };

const START: Connector[] = [
	{ id: "gmail", provider: "gmail", can: ["Read and send email as you", "Find threads about a candidate"], connected: true },
	{ id: "slack", provider: "slack", can: ["Post summaries to channels you pick", "Read messages in those channels"], connected: true, problem: "Your Slack sign-in expired. Reconnect to resume the daily summary." },
	{ id: "calendar", provider: "google-calendar", can: ["Read free and busy times", "Create interview events"] },
	{ id: "drive", provider: "google-drive", can: ["Read files you choose", "Never change or delete files"] },
	{ id: "notion", provider: "notion", can: ["Read pages you share with it", "Add notes to a database"] },
];

export default function Example() {
	const [list, setList] = useState(START);
	const [open, setOpen] = useState<Connector | null>(null);
	return (
		<div className="w-full max-w-lg">
			<ConnectorPicker connectors={list} onConnect={setOpen} onManage={() => toast("Manage opens Settings, Connections")} />
			<ConnectDialog
				connector={open}
				open={!!open}
				onOpenChange={(o) => !o && setOpen(null)}
				scope="Everyone in TwoUX"
				onAuthorise={() => new Promise((r) => setTimeout(r, 1000))}
				onDone={() => open && setList((l) => l.map((c) => (c.id === open.id ? { ...c, connected: true, problem: undefined } : c)))}
			/>
		</div>
	);
}
```

## Related

- Connected tools
- Agent permissions
- Provider logo
- Empty state
- Confirmation dialog
