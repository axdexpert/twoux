import { PROVIDERS, ProviderLogo, type ProviderId } from "@twoux/ui";

export const meta = { title: "Beside the name", description: "The mark identifies the service and the name says it. On a white tile in both themes, so dark marks stay visible.", order: 1 };

const SHOWN: ProviderId[] = ["google", "microsoft", "github", "slack", "notion", "google-drive"];

export default function Example() {
	return (
		<ul className="grid w-full max-w-md gap-1">
			{SHOWN.map((p) => (
				<li key={p} className="flex items-center gap-3 rounded-xs px-1 py-1.5">
					<ProviderLogo provider={p} />
					<span className="text-base text-ink">{PROVIDERS[p].label}</span>
				</li>
			))}
		</ul>
	);
}
