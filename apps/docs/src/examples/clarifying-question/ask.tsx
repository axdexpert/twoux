import { ClarifyingQuestion, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Ask only what changes the result", description: "One question at a time, at most three. The recommended option comes first; number keys choose; Other is last; Skip keeps the defaults.", order: 1 };

export default function Example() {
	const [k, setK] = useState(0);
	return (
		<div className="w-full max-w-lg">
			<ClarifyingQuestion
				key={k}
				questions={[
					{ question: "Which listings should I compare?", options: [{ id: "team", title: "Same team, last 90 days", detail: "22 listings" }, { id: "all", title: "All listings this year", detail: "141 listings" }] },
					{ question: "How should I show the result?", options: [{ id: "table", title: "A short table" }, { id: "chart", title: "A chart by week" }] },
				]}
				onDone={(a) => { toast(`Continuing with: ${a.join(", ")}`); setK((x) => x + 1); }}
			/>
		</div>
	);
}
