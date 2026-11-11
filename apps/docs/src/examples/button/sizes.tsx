import { Button } from "@twoux/ui";
import { Download } from "lucide-react";

export const meta = {
	title: "Sizes",
	description: "Four compact sizes. 32px is the default. 28px in toolbars and filter bars, 24px inside table rows, 36px only for the single action of an empty state or sign-in page.",
	order: 3,
};

export default function Example() {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<Button size="xs" variant="outline"><Download />Export</Button>
			<Button size="sm" variant="outline"><Download />Export</Button>
			<Button variant="outline"><Download />Export</Button>
			<Button size="lg" variant="outline"><Download />Export</Button>
		</div>
	);
}
