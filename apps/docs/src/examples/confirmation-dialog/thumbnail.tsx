import { Button } from "@twoux/ui";

/* AlertDialogContent drawn in place (the real one is fixed to the viewport): its surface, title, description and
   footer, with real Buttons as AlertDialogCancel (outline) and AlertDialogAction (destructive) render them. */
export default function Thumbnail() {
	return (
		<div className="grid w-64 gap-3 rounded-md border border-line bg-background p-4 shadow-pop" aria-hidden="true">
			<div className="grid gap-1">
				<span className="text-lg font-semibold text-ink">Close 2 listings?</span>
				<span className="text-base text-ink-2">They can't be reopened.</span>
			</div>
			<div className="flex justify-end gap-2">
				<Button variant="outline" size="sm" tabIndex={-1}>Keep open</Button>
				<Button variant="destructive" size="sm" tabIndex={-1}>Close listings</Button>
			</div>
		</div>
	);
}
