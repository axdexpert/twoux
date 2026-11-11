export const install = "";
export const api = [
	{
		"component": "ConnectedToolCard",
		"props": [
			{
				"name": "tool",
				"type": "{ name, kind, connected, canRead, canChange, stored, connectedBy?, privacyHref? }",
				"description": "Say what it can read and change, and where data is stored."
			},
			{
				"name": "onConnect · onDisconnect",
				"type": "() => void",
				"description": "Disconnect offers Undo."
			}
		]
	}
];
