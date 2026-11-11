# Onboarding step

One step of first-run setup on a plain page: why we ask, the fields, which step this is, and Back, Skip and Continue.

Kind: component · Group: Navigation · Status: built, import from @twoux/ui

## When to use

- A few setup steps that the product cannot guess, such as workspace name and who to invite.
- Steps that depend on each other, where each answer shapes the next.

## When not to use

- Teaching the product with a tour or video. Show it in the product and use contextual help (workspace-onboarding).
- A long form. Ask only what is needed to start and let people finish the rest later in Settings.

## Structure

1. "Step n of N" text (with Optional when it is)
2. Heading (receives focus)
3. Why we ask, in one line
4. Fields
5. Back, Skip (optional steps), Continue
6. Progress dots (decoration only)
7. Aside panel (optional, wide screens)

## Guidelines

- Keep it to a few steps. Each step says why it asks.
- Optional steps say Optional and offer Skip. Required steps do not offer it.
- Never disable Continue. Validate when it is pressed and put the error under the field.
- Say "Step 2 of 5" in text. Dots alone do not tell people how much is left.
- Move focus to the heading when the step changes, so a screen reader says where the person is.
- Use a plain background. No gradients, no illustration, no auto-playing video.
- Keep what was entered when going Back. Never ask for the same thing twice.

## Content

- Heading: a short question or task, such as "Name your workspace".
- Why line: "Teammates see this name when you invite them."
- Skip, not "Do this later" or "Not now", on optional steps.

## Accessibility

- The "Step n of N" text is real text; the dots are hidden from assistive technology (SC 1.4.1).
- The heading has tabindex -1 and receives focus on each step; the section is labelled by it (SC 2.4.3, 2.4.6).
- Errors are shown under the field and linked to it (SC 3.3.1).

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move through the fields, Back, Skip and Continue in order |
| Enter | In a text field, press Continue |
| Shift+Tab | Move back, starting from the heading on a new step |

## Examples

### workspace-setup

```tsx
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
```

## Related

- Onboarding to an empty workspace
- Stepper
- Text input
- Form validation
- Setup checklist
- Sign in
