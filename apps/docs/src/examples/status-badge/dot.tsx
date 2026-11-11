import { Badge } from "@twoux/ui";

export const meta = {
	title: "With dot",
	description: "A leading dot helps scanning down a long column. The word stays.",
	order: 2,
};

export default function Example() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<Badge variant="success" dot>Live</Badge>
			<Badge variant="warning" dot>Needs you</Badge>
			<Badge variant="destructive" dot>Failed</Badge>
		</div>
	);
}
