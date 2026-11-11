import { Button } from "@twoux/ui";
import { Clock, Copy } from "lucide-react";

export const meta = {
	title: "With keyboard shortcut",
	description: "Every frequent action shows its key, so people learn it by using it. The key is also in the tooltip for screen readers.",
	order: 4,
};

export default function Example() {
	return (
		<div className="flex items-center gap-1 rounded-sm bg-surface p-1 shadow-pop">
			<Button variant="ghost" size="sm" shortcut="T" title="Extend 30 days (T)"><Clock />
				Extend 30 days
			</Button>
			<Button variant="ghost" size="sm" shortcut="D" title="Duplicate (D)"><Copy />
				Duplicate
			</Button>
		</div>
	);
}
