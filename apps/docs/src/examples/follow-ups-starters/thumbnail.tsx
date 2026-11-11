import { FollowUps, Starters } from "@twoux/ui";

/* The real Starters and FollowUps, trimmed to one each. */
export default function Thumbnail() {
	return (
		<div className="grid w-64 gap-3">
			<Starters items={["Why are these doing badly?"]} onPick={() => {}} />
			<FollowUps items={["Which job boards are they on?"]} onPick={() => {}} />
		</div>
	);
}
