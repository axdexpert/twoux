import { Badge } from "@twoux/ui";

export const meta = {
	title: "Record status",
	description: "Always a word. Colour repeats the meaning but never carries it alone.",
	order: 1,
};

export default function Example() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<Badge variant="success">Live</Badge>
			<Badge variant="warning">Expires in 3 days</Badge>
			<Badge variant="destructive">Closed early</Badge>
			<Badge variant="secondary">Draft</Badge>
			<Badge variant="default">Featured</Badge>
		</div>
	);
}
