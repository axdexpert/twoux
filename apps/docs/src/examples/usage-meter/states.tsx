import { toast, UsageMeter } from "@twoux/ui";

export const meta = { title: "Plenty, close, and at the limit", description: "The upgrade link appears from 80% used, and the warning says what stops. Colour is never the only signal.", order: 1 };

export default function Example() {
	const common = { unit: "credits", limit: 20000, resets: "1 Dec", atLimit: "Agents pause until 1 Dec", onDetails: () => toast("Opens the usage breakdown"), onUpgrade: () => toast("Opens the plans") };
	return (
		<div className="grid w-full max-w-xs gap-6">
			<UsageMeter {...common} used={8400} />
			<UsageMeter {...common} used={17200} />
			<UsageMeter {...common} used={20000} />
		</div>
	);
}
