import { AgentRun, Button } from "@twoux/ui";

export const meta = { title: "One run, step by step", description: "Every step has a state in shape and words. A step that picked rows names its filter; the waiting step is highlighted and holds its action.", order: 1 };

export default function Example() {
	return (
		<div className="w-full max-w-xl">
			<AgentRun
				task="Weekly listing check"
				status="Needs you"
				meta="Started by Priya Shah · Monday 09:00 · Every Monday"
				steps={[
					{ title: "Found listings closing within 7 days", detail: "Filter: Closes is in the next 7 days · 3 listings", state: "done", action: <Button variant="ghost" size="xs">Open as view</Button> },
					{ title: "Compared applicants with similar listings", state: "done" },
					{ title: "Proposed extending 2 listings by 30 days", detail: "Waiting for your review", state: "waiting", action: <Button size="xs">Review</Button> },
					{ title: "Post a summary to #hiring", state: "skipped", detail: "Skipped until the review is done" },
				]}
			/>
		</div>
	);
}
