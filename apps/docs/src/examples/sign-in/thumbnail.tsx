import { Button, PROVIDERS, ProviderLogo } from "@twoux/ui";

/* SignInOptions' buttons, built the way the component builds them: real Buttons, the provider mark bare in a shared
   column so marks and labels line up, and the primary email action below. The email field is left out to fit. */
export default function Thumbnail() {
	return (
		<div className="grid w-52 grid-cols-[1fr_auto_auto_1fr] gap-2" aria-hidden="true">
			<Button variant="outline" tabIndex={-1} className="col-span-full grid grid-cols-subgrid items-center [&>:first-child]:col-start-2">
				<ProviderLogo provider="google" size="sm" tile={false} />
				<span className="col-start-3 text-left">Continue with {PROVIDERS.google.label}</span>
			</Button>
			<Button tabIndex={-1} className="col-span-full">Continue with email</Button>
		</div>
	);
}
