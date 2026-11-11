import { Alert, AlertAction, AlertDescription, AlertTitle, Button } from "@twoux/ui";
import { CircleAlert, Info, TriangleAlert } from "lucide-react";
import { useState } from "react";

export const meta = { title: "Information, warning and error", description: "Information is neutral and can be dismissed. A warning names one next step. An error that blocks publishing counts the problems and links to the first.", order: 1 };

export default function Example() {
	const [showInfo, setShowInfo] = useState(true);
	return (
		<div className="grid w-full max-w-xl gap-3">
			{showInfo && (
				<Alert>
					<Info />
					<AlertTitle>Salary bands were updated on 3 November.</AlertTitle>
					<AlertAction>
						<Button variant="ghost" size="sm" onClick={() => setShowInfo(false)}>Dismiss</Button>
					</AlertAction>
				</Alert>
			)}
			<Alert variant="warning">
				<TriangleAlert />
				<AlertTitle>4 listings close this week with no applicants.</AlertTitle>
				<AlertAction>
					<Button variant="outline" size="sm">Review</Button>
				</AlertAction>
			</Alert>
			<Alert variant="destructive">
				<CircleAlert />
				<AlertTitle>2 fields need fixing before you can publish.</AlertTitle>
				<AlertDescription>
					<a href="#salary" className="font-medium text-ink underline decoration-bad-line underline-offset-2 hover:decoration-bad">Go to first</a>
				</AlertDescription>
			</Alert>
		</div>
	);
}
