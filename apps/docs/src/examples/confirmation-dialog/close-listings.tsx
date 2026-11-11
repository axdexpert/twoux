import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button, toast } from "@twoux/ui";

export const meta = { title: "Close listings", description: "Closing removes listings from job boards and cannot be undone. Focus starts on the safe button, so Enter keeps them open. Esc does the same.", order: 1 };

export default function Example() {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline">Close 2 listings</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Close 2 listings?</AlertDialogTitle>
					<AlertDialogDescription>They come off every job board today. Applicants and notes are kept, but the listings cannot be reopened.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Keep open</AlertDialogCancel>
					<AlertDialogAction variant="destructive" onClick={() => toast.success("2 listings closed")}>Close listings</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
