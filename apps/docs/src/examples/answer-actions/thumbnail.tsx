import { AnswerActions, AssistantMessage } from "@twoux/ui";

/* The real AnswerActions under a short AssistantMessage: Copy, Helpful, Not helpful and Regenerate. */
export default function Thumbnail() {
	return (
		<div className="w-60" aria-hidden="true">
			<AssistantMessage from="24 listings" actions={<AnswerActions text="" onRegenerate={() => {}} onFeedback={() => Promise.resolve()} />}>
				<p><strong>2 listings</strong> close this week with fewer than 10 applicants.</p>
			</AssistantMessage>
		</div>
	);
}
