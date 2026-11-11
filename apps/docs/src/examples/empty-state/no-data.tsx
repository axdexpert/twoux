import { Button, Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@twoux/ui";
import { BriefcaseBusiness, Plus } from "lucide-react";

export const meta = { title: "No data yet", description: "Nothing has been created. The one action is the create action, not Clear filters.", order: 2 };

export default function Example() {
	return (
		<Empty className="w-full max-w-xl">
			<EmptyHeader>
				<EmptyMedia variant="icon"><BriefcaseBusiness /></EmptyMedia>
				<EmptyTitle>No listings yet</EmptyTitle>
				<EmptyDescription>Listings you publish appear here, with their applicants.</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button variant="outline" size="sm"><Plus />New listing</Button>
			</EmptyContent>
		</Empty>
	);
}
