export const install = "";
export const api = [
	{
		"component": "ConnectorPicker",
		"props": [
			{ "name": "connectors", "type": "{ id, provider, can[], connected?, problem?, note? }[]", "description": "can lists what connecting lets the product do, in plain words. problem marks a connected service that needs attention." },
			{ "name": "onConnect", "type": "(c: Connector) => void", "description": "Called for Connect and for Reconnect. Open the ConnectDialog." },
			{ "name": "onManage", "type": "(c: Connector) => void", "description": "Shows Manage on connected rows. Disconnecting belongs in Settings and asks what stops working." }
		]
	},
	{
		"component": "ConnectDialog",
		"props": [
			{ "name": "connector · open · onOpenChange", "type": "…", "description": "Shows the access asked for before anything is connected." },
			{ "name": "method", "type": "\"oauth\" | \"apikey\"", "default": "\"oauth\"", "description": "oauth opens the provider in a new window. apikey tests the key before saving it." },
			{ "name": "scope", "type": "string", "default": "\"Only you\"", "description": "Who the connection is shared with, for example \"Everyone in TwoUX\"." },
			{ "name": "onAuthorise · onTestKey · onDone", "type": "…", "description": "onTestKey resolves with an error message, or undefined when the key works." }
		]
	}
];
