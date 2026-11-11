import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@twoux/ui";

export default function Thumbnail() {
	return (
		<Card className="w-56 gap-3 py-3">
			<CardHeader className="px-3">
				<CardTitle>Applicant emails</CardTitle>
				<CardDescription className="text-sm">When managers hear about applicants.</CardDescription>
			</CardHeader>
			<CardFooter band className="-mb-3 py-2 text-sm">Already set up? Sign in</CardFooter>
		</Card>
	);
}
