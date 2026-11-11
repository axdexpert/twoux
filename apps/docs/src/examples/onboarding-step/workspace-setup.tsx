import { Field, FieldDescription, FieldError, FieldLabel, Input, OnboardingStep } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Set up a workspace", description: "Three steps. The name is required, inviting is optional. What was typed stays when you go Back.", order: 1 };

export default function Example() {
	const [step, setStep] = useState(1);
	const [name, setName] = useState("");
	const [invites, setInvites] = useState("");
	const [error, setError] = useState("");
	const next = () => {
		if (step === 1 && !name.trim()) { setError("Enter a name for your workspace, for example TwoUX."); return; }
		setError("");
		setStep((s) => Math.min(3, s + 1));
	};
	return (
		<div className="flex w-full justify-center">
			{step === 1 && (
				<OnboardingStep step={1} total={3} title="Name your workspace" description="Teammates see this name when you invite them." onContinue={next}>
					<Field data-invalid={!!error || undefined}>
						<FieldLabel htmlFor="ws-name">Workspace name</FieldLabel>
						<Input id="ws-name" value={name} aria-invalid={!!error || undefined} autoComplete="organization" onChange={(e) => { setName(e.target.value); setError(""); }} />
						{error && <FieldError>{error}</FieldError>}
					</Field>
				</OnboardingStep>
			)}
			{step === 2 && (
				<OnboardingStep step={2} total={3} title="Invite your team" description="They get an email with a link. You can also do this later in Settings." optional onBack={() => setStep(1)} onSkip={() => setStep(3)} onContinue={next}>
					<Field>
						<FieldLabel htmlFor="ws-invites">Email addresses</FieldLabel>
						<Input id="ws-invites" type="email" value={invites} placeholder="sam@twoux.example" onChange={(e) => setInvites(e.target.value)} />
						<FieldDescription>Separate several addresses with commas.</FieldDescription>
					</Field>
				</OnboardingStep>
			)}
			{step === 3 && (
				<OnboardingStep step={3} total={3} title="You are ready" description={`${name || "Your workspace"} is set up.`} continueLabel="Open workspace" onBack={() => setStep(2)} onContinue={() => setStep(1)}>
					<p className="text-base text-ink-2">{invites ? `An invitation will go to ${invites}.` : "You have not invited anyone yet."}</p>
				</OnboardingStep>
			)}
		</div>
	);
}
