import { Badge, Button, PROVIDERS, ProviderLogo } from "@twoux/ui";
import type { ReactNode } from "react";

/* Two ConnectorPicker rows (connected, then not yet), built with its classes: logo, name with the status badge beside it, what it does, and an
   outline action. The search field and group headings are left out to fit. */
function Row({ provider, status, note, action }: { provider: "gmail" | "notion"; status?: ReactNode; note: string; action: string }) {
	return (
		<div className="flex items-center gap-2.5 rounded-xs px-1 py-1.5">
			<ProviderLogo provider={provider} />
			<span className="grid min-w-0 flex-1">
				<span className="flex items-center gap-2 text-base font-medium text-ink">{PROVIDERS[provider].label}{status}</span>
				<span className="truncate text-sm text-ink-2">{note}</span>
			</span>
			<Button variant="outline" size="sm" tabIndex={-1}>{action}</Button>
		</div>
	);
}

export default function Thumbnail() {
	return (
		<div className="grid w-64" aria-hidden="true">
			<Row provider="gmail" status={<Badge variant="success" dot>Connected</Badge>} note="Read and send email" action="Manage" />
			<Row provider="notion" note="Read pages you share" action="Connect" />
		</div>
	);
}
