# Sign in

Provider buttons first, then email. Single sign-on is found from the email domain, and an email link means no password to remember.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- The first screen of an account: sign in and create account in one flow.
- Letting people choose how they sign in: a provider, single sign-on or an email link.

## When not to use

- Asking for anything beyond how to sign in. Setup questions belong in Onboarding step (onboarding-step).
- Gating content that people could read first. Show it before asking them to sign in.

## Structure

1. Provider buttons (logo and "Continue with" name)
2. Divider ("or")
3. Work email field
4. Continue button (becomes "Continue with SSO" for SSO domains)
5. Error under the field

## Guidelines

- Put provider buttons first, then email. One primary action: the email button.
- Find single sign-on from the email domain. Say "twoux.example signs in with single sign-on" and change the button to Continue with SSO.
- Use an email link so there is no password to remember or retype.
- Put errors under the field and say what to do, for example "This email uses Google to sign in. Continue with Google instead."
- Do not reveal which part was wrong, or whether an account exists, unless the product already shows that elsewhere. Use the same message either way.
- Set autocomplete on every field (email, current-password, one-time-code) so browsers and password managers can fill them.
- Validate on press, not on every keystroke, and keep the email people typed after an error.

## Content

- Button: "Continue with Google", "Continue with email", "Continue with SSO".
- Field error: "Enter your work email, for example sam@company.com."
- Do not write "Wrong password" or "No account found". Write what to try next.

## Accessibility

- The email field has a visible label and the right type and autocomplete values (SC 1.3.5, 3.3.2).
- The error is linked to the field with aria-invalid and the field description, and is announced when it appears (SC 3.3.1, 4.1.3).
- Signing in never depends on remembering or transcribing a password alone: providers and email links are alternatives (SC 3.3.8).

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move through the provider buttons, the email field and the primary button |
| Enter | In the email field, submit the form |
| Space or Enter | Press the focused provider button |

## Examples

### error

```tsx
import { SignInOptions } from "@twoux/ui";

export const meta = { title: "Say what to do next", description: "The error sits under the field and names the way in. It does not say which part was wrong.", order: 2 };

export default function Example() {
	return (
		<div className="w-full max-w-sm">
			<SignInOptions
				providers={["google"]}
				error="This email signs in with Google. Continue with Google instead."
				onProvider={() => {}}
				onEmail={() => {}}
			/>
		</div>
	);
}
```

### sign-in

```tsx
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
```

## Related

- Provider logo
- Onboarding step
- Text input
- Form validation
- Error messages
