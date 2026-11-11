import { Alert, AlertTitle, Button } from "@twoux/ui";
import { TriangleAlert } from "lucide-react";

/* The end of CsvImport's second step: the problem summary as a warning Alert, then the footer whose Import button
   states the row count. The mapping and preview table are left out to fit. */
export default function Thumbnail() {
	return (
		<div className="grid w-64 gap-3" aria-hidden="true">
			<Alert variant="warning">
				<TriangleAlert />
				<AlertTitle>2 rows have no email. They will be skipped.</AlertTitle>
			</Alert>
			<div className="flex justify-end gap-2">
				<Button variant="outline" tabIndex={-1}>Cancel</Button>
				<Button tabIndex={-1}>Import 4 rows</Button>
			</div>
		</div>
	);
}
