import { SignInOptions, toast, type ProviderId } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Providers, then email", description: "Providers first. An email on a single sign-on domain changes the button to Continue with SSO. Try sam@twoux.example.", order: 1 };

export default function Example() {
	const [busy, setBusy] = useState<ProviderId | "email" | "sso" | undefined>();
	const run = (what: ProviderId | "email" | "sso", message: string) => {
		setBusy(what);
		setTimeout(() => { setBusy(undefined); toast.success(message); }, 900);
	};
	return (
		<div className="grid w-full max-w-sm gap-4">
			<h1 className="text-xl font-semibold text-ink">Sign in to TwoUX</h1>
			<SignInOptions
				providers={["google", "microsoft"]}
				ssoDomains={["twoux.example"]}
				busy={busy}
				onProvider={(p) => run(p, "Opened the sign-in window")}
				onEmail={(email) => run("email", `Sign-in link sent to ${email}. Check your inbox.`)}
				onSso={(domain) => run("sso", `Continuing with ${domain}`)}
			/>
		</div>
	);
}
