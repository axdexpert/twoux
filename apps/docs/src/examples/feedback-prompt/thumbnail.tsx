import { FeedbackPrompt } from "@twoux/ui";

/* The real FeedbackPrompt before a vote. */
export default function Thumbnail() {
	return (
		<div className="w-56">
			<FeedbackPrompt description="About the screening questions guide" onVote={() => Promise.resolve()} />
		</div>
	);
}
