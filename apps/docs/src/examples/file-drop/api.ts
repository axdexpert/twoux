export const install = "";
export const api = [
	{
		"component": "FileDrop",
		"props": [
			{ "name": "id · label", "type": "string", "description": "The label is attached to the hidden native input." },
			{ "name": "accept · hint", "type": "string", "description": "accept is a list of MIME types, for example \"image/png,image/jpeg\". hint is shown before choosing: \"PNG or JPEG, up to 10 MB\"." },
			{ "name": "maxBytes", "type": "number", "description": "Larger files are refused with their size in the message." },
			{ "name": "preview · onRemove", "type": "string · () => void", "description": "A URL for the chosen file. It replaces the icon and adds Remove and Replace." },
			{ "name": "onFile", "type": "(file: File) => void", "description": "Called only for a file that passed the type and size checks." },
			{ "name": "error", "type": "string", "description": "A server-side error. Say what to choose instead." }
		]
	}
];
