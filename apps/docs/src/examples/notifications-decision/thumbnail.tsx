import { Badge, RadioField, RadioGroup } from "@twoux/ui";

/* The decision in small: the first question answered Yes, and the channel it decides. */
export default function Thumbnail() {
	return (
		<div className="grid w-64 gap-2" aria-hidden="true">
			<div className="grid gap-1.5 rounded-sm border border-line bg-surface p-3">
				<span className="text-base font-medium text-ink">1. Did the person just do this?</span>
				<RadioGroup value="yes" className="flex gap-4">
					<RadioField id="nd-thumb-y" value="yes" label="Yes" />
					<RadioField id="nd-thumb-n" value="no" label="No" />
				</RadioGroup>
			</div>
			<p className="flex items-center gap-2 text-base text-ink-2"><Badge>Toast</Badge>Confirms their own action.</p>
		</div>
	);
}
