import { ProviderLogo } from "@twoux/ui";

export default function Thumbnail() {
	return (
		<span className="inline-flex items-center gap-2" aria-hidden="true">
			<ProviderLogo provider="google" size="lg" />
			<ProviderLogo provider="slack" size="lg" />
			<ProviderLogo provider="github" size="lg" />
		</span>
	);
}
