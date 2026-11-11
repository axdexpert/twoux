import { FieldSeparator, Separator } from "@twoux/ui";

export const meta = { title: "Plain and labelled", description: "A plain line divides groups when space alone is not enough. A labelled one sits between two routes to the same result.", order: 1 };

export default function Example() {
	return (
		<div className="grid w-full max-w-sm gap-6">
			<div className="grid gap-3 rounded-sm border border-line bg-surface p-4">
				<div className="grid gap-0.5">
					<span className="text-base font-medium text-ink">Senior Product Designer</span>
					<span className="text-sm text-ink-3">Leeds · Hybrid</span>
				</div>
				<Separator />
				<div className="flex justify-between text-base text-ink-2">
					<span>Applicants</span>
					<span className="tabular text-ink">38</span>
				</div>
			</div>
			<FieldSeparator>or</FieldSeparator>
		</div>
	);
}
