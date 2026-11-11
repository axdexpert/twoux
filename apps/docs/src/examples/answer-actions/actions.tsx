import { AnswerActions, AssistantMessage, DropdownMenuItem } from "@twoux/ui";

export const meta = { title: "Under every answer", description: "Copy, Helpful, Not helpful and Regenerate (latest answer only), with the rest under More. Always visible, not on hover. Feedback shows sending, then stays pressed.", order: 1 };

export default function Example() {
	return (
		<div className="w-full max-w-lg">
			<AssistantMessage from="24 listings" actions={<AnswerActions text="2 listings close this week with fewer than 10 applicants." onRegenerate={() => {}} onFeedback={() => new Promise((r) => setTimeout(r, 500))} more={<><DropdownMenuItem>Save as task</DropdownMenuItem><DropdownMenuItem>Open as page</DropdownMenuItem><DropdownMenuItem>Copy link</DropdownMenuItem></>} />}>
				<p><strong>2 listings</strong> close this week with fewer than 10 applicants.</p>
			</AssistantMessage>
		</div>
	);
}
