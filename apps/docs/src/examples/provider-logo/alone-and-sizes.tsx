import { ProviderLogo } from "@twoux/ui";

export const meta = { title: "Alone, with a label", description: "When the mark has no name beside it, give it a label. Three sizes; the mark inside is never changed.", order: 2 };

export default function Example() {
	return (
		<div className="flex items-center gap-4">
			<ProviderLogo provider="slack" size="sm" label="Slack" />
			<ProviderLogo provider="slack" size="md" label="Slack" />
			<ProviderLogo provider="slack" size="lg" label="Slack" />
		</div>
	);
}
