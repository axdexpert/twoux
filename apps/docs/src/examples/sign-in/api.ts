export const install = "";
export const api = [
	{
		"component": "SignInOptions",
		"props": [
			{ "name": "providers", "type": "ProviderId[]", "default": "[\"google\", \"microsoft\"]", "description": "Provider buttons, in order, above the email field." },
			{ "name": "ssoDomains", "type": "string[]", "default": "[]", "description": "Email domains that must use single sign-on. The email button then reads Continue with SSO." },
			{ "name": "onProvider · onEmail · onSso", "type": "…", "description": "onEmail should send a sign-in link. onSso receives the domain." },
			{ "name": "busy", "type": "ProviderId | \"email\" | \"sso\"", "description": "The choice in progress, so its button shows the spinner." },
			{ "name": "error", "type": "string", "description": "Shown under the email field. Say what to do, and do not reveal whether an account exists." }
		]
	}
];
