import { useSidebarRail } from "@twoux/ui";
import { TwoUXLogo } from "./twoux-logo";

/** Top of an example app's sidebar: the TwoUX wordmark, then the app or workspace name when there is one. In a rail, only the mark. */
export function ExampleBrand({ label }: { label?: string }) {
	const rail = useSidebarRail();
	if (rail) return <div className="flex justify-center pt-1"><TwoUXLogo mark className="h-4" /></div>;
	return (
		<div className="flex min-w-0 items-center gap-2 px-2 pt-1">
			<TwoUXLogo className="h-4 shrink-0" />
			{label && <span className="min-w-0 truncate text-base font-semibold text-ink-2">{label}</span>}
		</div>
	);
}
