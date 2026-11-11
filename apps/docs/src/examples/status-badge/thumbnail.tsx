import { Badge } from "@twoux/ui";

export default function Thumbnail() {
	return (
		<div className="flex flex-wrap items-center justify-center gap-1.5">
			<Badge variant="success">Live</Badge>
			<Badge variant="warning">Expires soon</Badge>
			<Badge variant="secondary">Draft</Badge>
		</div>
	);
}
