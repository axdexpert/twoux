import { Button, ConfidenceNote } from "@twoux/ui";

/* The real ConfidenceNote: the cause after "Not sure:", the safer option, then an action. */
export default function Thumbnail() {
	return (
		<ConfidenceNote className="w-64" cause="the hours are from March" action={<Button size="xs" variant="outline" tabIndex={-1}>Check the venue page</Button>}>
			Check them before this is sent.
		</ConfidenceNote>
	);
}
