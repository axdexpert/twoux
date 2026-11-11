import { Button } from "@twoux/ui";
import { Plus } from "lucide-react";

export const meta = {
	title: "One primary action per view",
	description: "The main action of the page is the only indigo button. Everything else is secondary or ghost.",
	order: 1,
};

export default function Example() {
	return (
		<div className="flex items-center gap-2">
			<Button variant="outline">Export</Button>
			<Button variant="default" shortcut="C"><Plus />
				New listing
			</Button>
		</div>
	);
}
