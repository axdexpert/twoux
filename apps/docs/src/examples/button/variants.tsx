import { Button } from "@twoux/ui";

export const meta = {
	title: "Variants",
	description: "Primary for the one main action, secondary for supporting actions, tertiary in toolbars and rows, warning for risky but reversible actions, destructive only inside a confirmation, link for navigation.",
	order: 2,
};

export default function Example() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<Button variant="default">Publish listing</Button>
			<Button variant="outline">Save draft</Button>
			<Button variant="ghost">Cancel</Button>
			<Button variant="warning">Close early</Button>
			<Button variant="destructive">Delete listing</Button>
			<Button variant="link">View all listings</Button>
		</div>
	);
}
