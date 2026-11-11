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
