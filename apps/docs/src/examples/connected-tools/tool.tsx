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
