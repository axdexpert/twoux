import { Button } from "@twoux/ui";
import { ChevronDown, ExternalLink, Plus } from "lucide-react";

export const meta = {
	title: "With icons",
	description: "An icon before the label clarifies the action. An icon after it says what happens next: a chevron opens a menu, an arrow leaves the app.",
	order: 4,
};

export default function Example() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<Button variant="default"><Plus />New listing</Button>
			<Button variant="outline">Status<ChevronDown /></Button>
			<Button variant="ghost">View public page<ExternalLink /></Button>
		</div>
	);
}
