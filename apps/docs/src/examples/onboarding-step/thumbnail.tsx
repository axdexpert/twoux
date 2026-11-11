import { Button } from "@twoux/ui";

/* OnboardingStep built with its classes (the real one moves focus to its heading, so it can't sit in the gallery):
   the step count with Optional, then the footer with Back, progress dots, Skip and Continue. The 20px title and the
   field are left out to fit and to keep the preview's weight in line with its neighbours. */
export default function Thumbnail() {
	return (
		<section className="grid w-64 overflow-hidden rounded-md border border-line bg-surface shadow-card" aria-hidden="true">
			<div className="flex flex-col gap-3 p-3">
				<p className="text-sm text-ink-3">Step 2 of 3 · Optional</p>
				<footer className="flex items-center gap-2 border-t border-line pt-3">
					<Button variant="ghost" size="sm" tabIndex={-1}>Back</Button>
					<span className="flex flex-1 justify-center gap-1">
						<span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
						<span className="h-1.5 w-4 rounded-full bg-primary" />
						<span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
					</span>
					<Button variant="ghost" size="sm" tabIndex={-1}>Skip</Button>
					<Button size="sm" tabIndex={-1}>Continue</Button>
				</footer>
			</div>
		</section>
	);
}
