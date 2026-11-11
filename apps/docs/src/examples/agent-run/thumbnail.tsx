import { AgentRun, Button } from "@twoux/ui";

/* The real AgentRun with two steps; its meta footer is hidden to fit. */
export default function Thumbnail() {
	return (
		<div className="w-64 [&_footer]:hidden" aria-hidden="true">
			<AgentRun
				task="Weekly listing check"
				status="Needs you"
				meta=""
				steps={[
					{ title: "Found 3 listings closing", state: "done" },
					{ title: "Proposed 2 extensions", state: "waiting", action: <Button size="xs" tabIndex={-1}>Review</Button> },
				]}
			/>
		</div>
	);
}
