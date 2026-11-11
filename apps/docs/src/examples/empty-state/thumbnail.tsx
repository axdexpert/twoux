import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@twoux/ui";
import { SearchX } from "lucide-react";

export default function Thumbnail() {
	return (
		<Empty className="w-56 gap-2 p-4 md:p-4">
			<EmptyHeader>
				<EmptyMedia variant="icon"><SearchX /></EmptyMedia>
				<EmptyTitle className="text-base">No listings match</EmptyTitle>
			</EmptyHeader>
		</Empty>
	);
}
