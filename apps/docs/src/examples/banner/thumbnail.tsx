import { Alert, AlertTitle } from "@twoux/ui";
import { TriangleAlert } from "lucide-react";

export default function Thumbnail() {
	return (
		<Alert variant="warning" className="w-72">
			<TriangleAlert />
			<AlertTitle>4 listings close with no applicants.</AlertTitle>
		</Alert>
	);
}
