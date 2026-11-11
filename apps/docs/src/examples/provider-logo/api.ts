export const install = "";
export const api = [
	{
		"component": "ProviderLogo",
		"props": [
			{ "name": "provider", "type": "ProviderId", "description": "A service from the generated list (PROVIDERS). Add one in scripts/provider-logos.mjs." },
			{ "name": "size", "type": "\"sm\" | \"md\" | \"lg\"", "default": "\"md\"", "description": "20, 28 or 36px tile. The mark is never cropped or recoloured." },
			{ "name": "tile", "type": "boolean", "default": "true", "description": "The white tile behind the mark. Set false to show a full-colour mark bare, as inside a sign-in button. Black marks (Apple, GitHub, Okta, Notion, HubSpot) keep their tile regardless, because they cannot be recoloured." },
			{ "name": "label", "type": "string", "description": "Pass when the mark stands alone, so it has role=\"img\" and a name. Beside the service's name leave it out; the mark is then hidden from assistive technology." }
		]
	}
];
