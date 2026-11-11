import { FollowUps, Starters, toast } from "@twoux/ui";

export const meta = { title: "Starters and follow-ups", description: "Starters come from what is selected; follow-ups continue the last answer, muted and apart from it. Three at most.", order: 1 };

export default function Example() {
	return (
		<div className="grid w-full max-w-lg gap-6">
			<Starters items={["Why are these 2 doing badly?", "Compare applicants with last quarter", "Draft a shorter description"]} onPick={(q) => toast(q)} onHide={() => {}} />
			<FollowUps items={["Which job boards are they on?", "Show the same for Design", "Extend both by 30 days"]} onPick={(q) => toast(q)} />
		</div>
	);
}
