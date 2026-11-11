import { Button, TemplatesGallery, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Start from a template", description: "Categories, search and cards that say what each template does and which tools it uses. Picking one opens a draft task; it never runs.", order: 1 };

export default function Example() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button variant="outline" onClick={() => setOpen(true)}>Browse templates</Button>
			<TemplatesGallery
				open={open}
				onOpenChange={setOpen}
				onPick={(t) => { setOpen(false); toast(`Opened “${t.name}” as a draft`); }}
				templates={[
					{ id: "1", name: "Weekly pipeline summary", does: "Summarises new applicants and stage changes every Monday.", tools: ["Listings", "Slack"], category: "Reporting" },
					{ id: "2", name: "Listings at risk", does: "Finds listings closing soon with few applicants and proposes extensions.", tools: ["Listings"], category: "Listings" },
					{ id: "3", name: "Interview slots", does: "Suggests interview times from interviewers' calendars.", tools: ["Calendar"], category: "Interviews" },
					{ id: "4", name: "Job description review", does: "Checks a draft for salary, inclusive language and length.", tools: ["Listings", "Team files"], category: "Listings" },
				]}
			/>
		</>
	);
}
