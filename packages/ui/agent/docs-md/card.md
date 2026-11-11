# Card

A white container that groups one object or one task, such as a settings section, a sign-in form or a summary, with an optional header, actions and footer.

Kind: component · Group: Content · Status: built, import from @twoux/ui

## When to use

- To group the fields and actions of one settings section or one form, so it reads as one unit.
- To show one summary of an object, such as a listing's status and owner, on a page that holds several.

## When not to use

- For rows of a list or table. Use the List table; cards break scanning and comparison across rows.
- Inside another card. Use a Separator or a heading to divide the content instead.
- To make text stand out. Use a Banner for a condition, or plain hierarchy.

## Structure

1. Container: white, light edge, 6px corners, resting shadow
2. Header: title and optional description
3. Action (optional): one button or menu, top right
4. Content
5. Footer (optional): actions on the right, or a tinted band with one secondary line

## Guidelines

- One card is one object or one task. If the content splits into two jobs, use two cards.
- Keep the header short: a title, an optional one-line description, and at most one action on the right.
- Put primary actions in the footer, right-aligned, with the main action last.
- Use the footer band for a single secondary line, such as “Already have an account? Sign in”.
- Cards on a white page keep their edge; cards on the grey app background can drop the shadow but keep the edge.

## Content

- Title in sentence case naming the object or task: “Notifications”, “Salary bands”.
- The description says what the section controls, not how to use the card.

## Accessibility

- When a card holds a section, give the title a real heading element at the right level, so it appears in the heading list.
- Do not make the whole card clickable when it contains other controls; link the title instead, so each target has one purpose.
- The card edge is decorative; the content does not rely on it to be understood.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Moves through the card's own controls in reading order; the card itself is not a stop |

## Examples

### settings

```tsx
import { Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, SwitchField } from "@twoux/ui";

export const meta = { title: "Settings section", description: "One card, one task. The title names it, the description says what it controls, and the footer holds the save action on the right.", order: 1 };

export default function Example() {
	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Applicant emails</CardTitle>
				<CardDescription>Choose when hiring managers hear about new applicants.</CardDescription>
				<CardAction>
					<Button variant="ghost" size="sm">Reset</Button>
				</CardAction>
			</CardHeader>
			<CardContent className="grid gap-3">
				<SwitchField id="email-each" label="Each new applicant" defaultChecked />
				<SwitchField id="email-digest" label="Daily digest at 9:00" />
			</CardContent>
			<CardFooter className="justify-end gap-2 border-t pt-4">
				<Button variant="outline" size="sm">Cancel</Button>
				<Button size="sm">Save</Button>
			</CardFooter>
		</Card>
	);
}
```

### sign-in

```tsx
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, FieldSeparator, TextField } from "@twoux/ui";

export const meta = { title: "Sign in, with a footer band", description: "The band holds one secondary line, apart from the main action. The labelled separator divides the two ways in.", order: 2 };

export default function Example() {
	return (
		<Card className="w-full max-w-sm">
			<CardHeader className="text-center">
				<CardTitle>Sign in to TwoUX Hiring</CardTitle>
				<CardDescription>Welcome back. Sign in to continue.</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<Button variant="outline" className="w-full">Continue with Google</Button>
				<FieldSeparator>or</FieldSeparator>
				<TextField id="signin-email" label="Work email" type="email" placeholder="name@company.co.uk" />
				<Button className="w-full">Continue</Button>
			</CardContent>
			<CardFooter band>
				Don't have an account?&nbsp;<a href="#signup" className="font-medium text-primary-ink hover:underline">Sign up</a>
			</CardFooter>
		</Card>
	);
}
```

## Related

- Banner (inline alert)
- Separator
- Empty state
