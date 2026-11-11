import { CheckboxField, FeedbackPrompt } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Was this helpful?", description: "One vote, sent on click and never twice. After voting, an optional comment with the privacy line and a 500 character limit. Failures keep what was typed and offer Try again.", order: 1 };

export default function Example() {
	const [fail, setFail] = useState(false);
	return (
		<div className="grid w-full max-w-md gap-4">
			<CheckboxField id="fb-fail" label="Simulate a failed send" checked={fail} onCheckedChange={(v) => setFail(v === true)} />
			<div className="rounded-sm border border-line bg-surface p-4">
				<FeedbackPrompt
					description="About the screening questions guide"
					onVote={() => new Promise((res, rej) => setTimeout(() => (fail ? rej(new Error("offline")) : res()), 600))}
					onFollowUp={() => new Promise((res) => setTimeout(res, 600))}
				/>
			</div>
		</div>
	);
}
