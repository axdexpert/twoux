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
