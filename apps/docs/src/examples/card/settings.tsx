import { Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, SwitchField } from "@twoux/ui";

export const meta = { title: "Settings section", description: "One card, one task. The title names it, the description says what it controls, and the footer holds the save action on the right.", order: 1 };

export default function Example() {
	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Applicant emails</CardTitle>
				<CardDescription>Choose when hiring managers hear about new applicants.</CardDescription>
				<CardAction>
					<Button variant="ghost" size="sm">Reset</Button>
				</CardAction>
			</CardHeader>
			<CardContent className="grid gap-3">
				<SwitchField id="email-each" label="Each new applicant" defaultChecked />
				<SwitchField id="email-digest" label="Daily digest at 9:00" />
			</CardContent>
			<CardFooter className="justify-end gap-2 border-t pt-4">
				<Button variant="outline" size="sm">Cancel</Button>
				<Button size="sm">Save</Button>
			</CardFooter>
		</Card>
	);
}
