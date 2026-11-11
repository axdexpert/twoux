import { FeedbackPrompt, HelpPanel, type HelpTopic, InfoLink, TextField } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Help for one field", description: "The Info link opens written help for that topic in the right-hand slot. Esc closes it and focus returns to the link. It ends with up to three Learn more links and a feedback prompt.", order: 1 };

const TOPICS: Record<string, HelpTopic> = {
	salary: {
		id: "salary",
		title: "Salary range",
		body: (
			<>
				<p>Listings with a salary range get more applicants, and UK job boards rank them higher.</p>
				<p><strong>Show a real range.</strong> Use the band you would actually pay, not a range so wide it says nothing. For example £30,000 to £36,000.</p>
				<p><strong>Check the minimum.</strong> Full-time roles must pay at least the National Living Wage for the hours worked.</p>
			</>
		),
		links: [{ label: "National Minimum Wage and Living Wage rates (GOV.UK)", href: "https://www.gov.uk/national-minimum-wage-rates" }],
	},
};

export default function Example() {
	const [open, setOpen] = useState(false);
	const [topic, setTopic] = useState<HelpTopic | null>(null);
	return (
		<div className="flex h-96 w-full overflow-hidden rounded-sm border border-line bg-surface">
			<div className="grid min-w-0 flex-1 content-start gap-1.5 p-5">
				<div className="flex items-center gap-2"><span className="text-base font-medium text-ink">Salary</span><InfoLink topic="salary" onOpen={(t) => { setTopic(TOPICS[t]); setOpen(true); }} /></div>
				<TextField id="help-salary" label="Salary from" prefix="£" placeholder="30,000" />
			</div>
			<HelpPanel open={open} onOpenChange={setOpen} topic={topic} footer={<FeedbackPrompt onVote={() => new Promise((r) => setTimeout(r, 500))} />} />
		</div>
	);
}
