import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@twoux/ui";
import { CircleAlert } from "lucide-react";

export default function Thumbnail() {
	return (
		<Empty className="w-56 gap-2 border-solid border-line p-4 md:p-4">
			<EmptyHeader>
				<EmptyMedia variant="error"><CircleAlert /></EmptyMedia>
				<EmptyTitle className="text-base">Couldn't load listings</EmptyTitle>
			</EmptyHeader>
		</Empty>
	);
}
