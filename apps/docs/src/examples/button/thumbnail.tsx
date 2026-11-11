import { Button } from "@twoux/ui";

export default function Thumbnail() {
	return (
		<div className="flex items-center gap-2">
			<Button variant="outline">Export</Button>
			<Button variant="default" shortcut="C">
				New listing
			</Button>
		</div>
	);
}
