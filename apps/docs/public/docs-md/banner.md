# Banner (inline alert)

A persistent message inside the page about a condition that affects what the person is looking at, with at most one action.

Kind: component · Group: Feedback and overlays · Status: built, import from @twoux/ui

## When to use

- A condition on the current page that stays true until it is resolved, such as "Two listings expire this week."
- Something blocks a task until fixed, such as form errors before Publish.
- Data-loss or connection problems that affect the whole page. These may sit above the page header.

## When not to use

- Confirming an action the person just took. Use a Toast.
- Background events that need someone to act later. Use the Inbox.
- A whole region failed to load. Use the Error state in place of that region.
- Feature announcements or tips. Leave them out, or put them in the setup checklist in the sidebar.

## Structure

1. Icon (info, warning or error)
2. Message: one sentence
3. Dismiss (ghost), only when nothing is blocked
4. One action (secondary button), such as Review
5. Form variant: error strip with count and "Go to first" link

## Guidelines

- Place the banner in context: above the table it refers to, or above the submit button for form problems.
- Show one banner per region. If several apply, order them from most to least severe.
- Offer Dismiss only when nothing is blocked and no action is required. Condition banners clear themselves when the condition ends.
- At most one action, as a secondary button on the right. Dismiss sits before it as a ghost button.
- Use neutral styling for information and keep red for errors that stop the task.
- The form error strip counts the problems and links to the first one: "2 fields need fixing before you can publish. Go to first".

## Content

- Say what is true and what to do: the condition, then a verb on the button ("Review").
- One or two short sentences, sentence case, no title when one sentence is enough.
- For errors, say what went wrong and how to recover, without blaming the person.
- No apologies, no "please", no exclamation marks.

## Accessibility

- Information banners that appear after load sit in a polite live region; the form error strip uses role="alert" because it reports a blocking problem (4.1.3).
- The icon is never the only cue: the sentence states severity in words, and the icon has an accessible label (1.4.1).
- Errors name the field and describe the problem in text, and "Go to first" moves focus to it (3.3.1).
- A banner must not be sticky over content in a way that hides the focused element (2.4.11).

## Keyboard

| Keys | Action |
|---|---|
| Tab | Reaches Dismiss, then the action |
| Enter | Activates the focused button or the "Go to first" link |

## Examples

### states

```tsx
import { Alert, AlertAction, AlertDescription, AlertTitle, Button } from "@twoux/ui";
import { CircleAlert, Info, TriangleAlert } from "lucide-react";
import { useState } from "react";

export const meta = { title: "Information, warning and error", description: "Information is neutral and can be dismissed. A warning names one next step. An error that blocks publishing counts the problems and links to the first.", order: 1 };

export default function Example() {
	const [showInfo, setShowInfo] = useState(true);
	return (
		<div className="grid w-full max-w-xl gap-3">
			{showInfo && (
				<Alert>
					<Info />
					<AlertTitle>Salary bands were updated on 3 November.</AlertTitle>
					<AlertAction>
						<Button variant="ghost" size="sm" onClick={() => setShowInfo(false)}>Dismiss</Button>
					</AlertAction>
				</Alert>
			)}
			<Alert variant="warning">
				<TriangleAlert />
				<AlertTitle>4 listings close this week with no applicants.</AlertTitle>
				<AlertAction>
					<Button variant="outline" size="sm">Review</Button>
				</AlertAction>
			</Alert>
			<Alert variant="destructive">
				<CircleAlert />
				<AlertTitle>2 fields need fixing before you can publish.</AlertTitle>
				<AlertDescription>
					<a href="#salary" className="font-medium text-ink underline decoration-bad-line underline-offset-2 hover:decoration-bad">Go to first</a>
				</AlertDescription>
			</Alert>
		</div>
	);
}
```

## Related

- Toast
- Error state (failed to load)
- Notifications vs inbox vs toast
- Page header
