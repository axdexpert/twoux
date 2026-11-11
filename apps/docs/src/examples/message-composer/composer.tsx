import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, MessageComposer, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Ask with context", description: "The selection and filters arrive as chips; removing one narrows what the assistant reads. Type @ for a listing or / for a saved task. Enter sends, Shift+Enter adds a line.", order: 1 };

export default function Example() {
	const [chips, setChips] = useState([{ id: "sel", label: "3 selected listings" }, { id: "f", label: "Team is Engineering" }]);
	return (
		<div className="w-full max-w-xl">
			<MessageComposer
				noun={{ one: "listing", many: "listings" }}
				chips={chips}
				onRemoveChip={(id) => setChips((c) => c.filter((x) => x.id !== id))}
				mentions={[{ id: "1", label: "FrontendEngineer" }, { id: "2", label: "DataAnalyst" }, { id: "3", label: "QAEngineer" }]}
				tasks={["Weekly-pipeline-summary", "Draft-rejection-reasons"]}
				onSend={(t, m) => toast(`Sent (${m}): ${t}`)}
				plusMenu={<><DropdownMenuLabel>Insert</DropdownMenuLabel><DropdownMenuItem>Mention a listing</DropdownMenuItem><DropdownMenuItem>Run a saved task</DropdownMenuItem><DropdownMenuItem>Attach a file</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuLabel>Connected tools</DropdownMenuLabel><DropdownMenuItem>Calendar</DropdownMenuItem></>}
			/>
		</div>
	);
}
