import { CircleCheck } from "lucide-react";

/* A success toast, copied from TwoUX's Toaster classes: status icon, title and description, and Undo as a quiet
   text button. Sonner's own markup can't render statically, so this mirrors it. */
export default function Thumbnail() {
	return (
		<div className="flex w-64 items-center gap-2 rounded-md border border-line bg-surface px-3 py-2.5 text-base text-ink shadow-pop" aria-hidden="true">
			<CircleCheck className="size-3.5 shrink-0 text-ok" />
			<span className="grid min-w-0 flex-1">
				<span className="font-medium">Listing closed</span>
				<span className="truncate text-ink-2">Senior Product Designer</span>
			</span>
			<span className="flex h-6 shrink-0 items-center rounded-xs px-2 font-medium text-primary-ink">Undo</span>
		</div>
	);
}
