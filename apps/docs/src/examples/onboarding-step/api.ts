export const install = "";
export const api = [
	{
		"component": "OnboardingStep",
		"props": [
			{ "name": "step · total", "type": "number", "description": "1-based. Shown as text, \"Step 2 of 5\". The dots are decoration." },
			{ "name": "title · description", "type": "string", "description": "The heading receives focus on each new step. The description says why you ask." },
			{ "name": "optional", "type": "boolean", "description": "Adds Optional to the step text and shows Skip (with onSkip)." },
			{ "name": "onBack · onSkip · onContinue", "type": "() => void", "description": "Continue is never disabled. Validate in onContinue and show the error under the field." },
			{ "name": "aside", "type": "ReactNode", "description": "A side panel on wide screens, for example what a connection adds." }
		]
	}
];
