import { Button, toast } from "@twoux/ui";
import { useEffect, useState } from "react";

export const meta = { title: "Confirm with Undo", description: "Close a listing. The toast says what happened, offers Undo, and leaves in 6 seconds. ⌘Z undoes it too, even after the toast has gone.", order: 1 };

export default function Example() {
	const [open, setOpen] = useState(true);

	const reopen = () => {
		setOpen(true);
		toast.success("Listing reopened", { description: "Senior Product Designer, Leeds" });
	};

	const close = () => {
		setOpen(false);
		toast.success("Listing closed", {
			description: "Senior Product Designer, Leeds",
			action: { label: "Undo", onClick: reopen },
		});
	};

	// Undo stays reachable without the toast
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "z" && !open) {
				e.preventDefault();
				reopen();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});

	return (
		<div className="flex w-full max-w-md items-center justify-between rounded-sm border border-line bg-surface px-3 py-2.5">
			<div className="grid">
				<span className="text-base font-medium text-ink">Senior Product Designer</span>
				<span className="text-sm text-ink-3">Leeds · {open ? "Open" : "Closed"}</span>
			</div>
			<Button variant="outline" size="sm" onClick={open ? close : reopen}>
				{open ? "Close listing" : "Reopen"}
			</Button>
		</div>
	);
}
