import { Button, Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, Skeleton } from "@twoux/ui";
import { CircleAlert } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export const meta = { title: "Table failed to load", description: "Only the table is replaced; the header stays. Try again (or R) swaps back to the skeleton, then to the data or the error. Technical details stay folded away.", order: 1 };

export default function Example() {
	const [loading, setLoading] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const retry = useCallback(() => {
		setLoading(true);
		setTimeout(() => setLoading(false), 1200);
	}, []);

	// R retries while focus is inside this region and not in a text field
	useEffect(() => {
		const el = ref.current;
		const onKey = (e: KeyboardEvent) => {
			if (e.key.toLowerCase() === "r" && !e.metaKey && !e.ctrlKey && !loading && !(e.target as HTMLElement).closest("input, textarea")) retry();
		};
		el?.addEventListener("keydown", onKey);
		return () => el?.removeEventListener("keydown", onKey);
	}, [loading, retry]);

	return (
		<div ref={ref} className="grid w-full max-w-xl gap-2">
			<span className="text-base font-medium text-ink">Listings</span>
			{loading ? (
				<div className="grid min-h-56 content-start gap-0 overflow-hidden rounded-sm border border-line" aria-busy="true" aria-label="Loading listings">
					{["w-40", "w-52", "w-36", "w-48", "w-44", "w-32"].map((w) => (
						<div key={w} className="flex h-9 items-center gap-3 border-b border-line px-3 last:border-b-0">
							<Skeleton className={`h-2.5 ${w}`} />
							<Skeleton className="ml-auto h-2.5 w-6" />
						</div>
					))}
				</div>
			) : (
				<Empty className="min-h-56 border-solid border-line">
					<EmptyHeader>
						<EmptyMedia variant="error"><CircleAlert /></EmptyMedia>
						<EmptyTitle>Couldn't load listings</EmptyTitle>
						<EmptyDescription>The server took too long to reply. Your filters are kept.</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button variant="outline" size="sm" shortcut="R" onClick={retry}>Try again</Button>
						<details className="text-sm text-ink-3">
							<summary className="cursor-pointer rounded-xs hover:text-ink-2">Technical details</summary>
							<code className="mt-1 block font-mono">504 Gateway Timeout · GET /listings · req 7f3a91</code>
						</details>
					</EmptyContent>
				</Empty>
			)}
		</div>
	);
}
