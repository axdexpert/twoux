import { Button, ConfidenceNote, toast } from "@twoux/ui";

export const meta = { title: "Unsure, and why", description: "The cause in words, then the safer option and a way to check. Use it when the output reaches people, shared records or money.", order: 1 };

export default function Example() {
	return (
		<div className="grid w-full max-w-xl gap-3">
			<ConfidenceNote
				cause="the venue's opening hours are from March, so they may be out of date"
				action={<><Button size="xs" variant="outline" onClick={() => toast("Opened the venue page")}>Check the venue page</Button><Button size="xs" variant="ghost" onClick={() => toast("Draft saved without a time")}>Send without a time</Button></>}
			>
				Check the hours before this goes to 14 applicants. If you cannot, send the invitation without a time and ask them to reply.
			</ConfidenceNote>
			<ConfidenceNote cause="your request does not say whether the new closing date applies to the 3 selected listings or to every listing in this view">
				I have not changed anything. Tell me which, and whether future listings should follow it too.
			</ConfidenceNote>
		</div>
	);
}
