import { AvatarStack, PersonAvatar } from "@twoux/ui";

export const meta = { title: "Owners and interviewers", description: "Initials on a colour fixed per person (white text at 5.8:1 or more). A stack shows three, then +N, which names the rest on hover or focus.", order: 1 };

export default function Example() {
	return (
		<div className="grid gap-4">
			<div className="flex items-center gap-3">
				<PersonAvatar name="Priya Shah" size="lg" /><PersonAvatar name="Tom Becker" /><PersonAvatar name="Amara Okafor" size="sm" />
				<span className="text-base text-ink-2">Priya Shah owns this listing</span>
			</div>
			<div className="flex items-center gap-3">
				<AvatarStack label="Interviewers" people={[{ name: "Priya Shah" }, { name: "Tom Becker" }, { name: "Amara Okafor" }, { name: "Liam Walsh" }, { name: "Sofia Romano" }]} />
				<span className="text-base text-ink-2">5 interviewers</span>
			</div>
		</div>
	);
}
