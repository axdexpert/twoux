# Confirmation dialog

A modal question before an irreversible or high-impact action, stating the consequence and offering the safe option first.

Kind: component · Group: Feedback and overlays · Status: built, import from @twoux/ui

## When to use

- Before actions that cannot be undone or that affect other people, such as closing listings that stop taking applications.
- Bulk actions on many records where a mistake is costly to repair.
- When the person must read a consequence they could not otherwise see, such as what happens to existing applicants.

## When not to use

- Reversible actions. Do them at once and offer Undo in a Toast.
- Collecting lots of input or showing a record. Use the Side panel.
- Reporting an error. Use a Banner or the Error state in place.
- Low-risk actions that are easy to redo, which need no confirmation at all.

## Structure

1. Title: a question naming the action and count ("Close 2 listings?")
2. Body: the consequence, and what is kept
3. Footer: safe secondary button ("Keep open")
4. Footer: destructive button named after the action ("Close listings")

## Guidelines

- Width up to 420px, centred, with the page dimmed behind it. One dialog at a time; never open a dialog from a dialog.
- Footer buttons sit on the right: the safe option first, the destructive action last in the destructive colour.
- On open, focus goes to the safe button, so Enter cannot destroy anything by accident.
- Esc and the safe button both close it with no change. On close, focus returns to the control that opened it.
- For the most dangerous, rare actions, require an unusual step such as typing the listing name.
- After confirming, report the result with a Toast.

## Content

- Title as a specific question with the verb and the object: "Close 2 listings?", never "Are you sure?".
- Body states the consequence and what stays: "They stop taking applications now. The 140 people who already applied stay in your pipeline."
- Buttons name the outcome ("Keep open", "Close listings"), never Yes, No or OK.
- The confirm label matches the title's verb.

## Accessibility

- Use role="alertdialog" with aria-modal="true", aria-labelledby on the title and aria-describedby on the consequence.
- Tab and Shift+Tab cycle inside the dialog; Esc closes it, so focus is contained but never trapped (2.1.2).
- Focus returns to the opener on close, or to the next logical row if the opener was removed (2.4.3).
- Confirming before data changes is one of the three ways to meet 3.3.4 Error Prevention.
- The destructive button is identified by its label, not only its red colour (1.4.1).

## Keyboard

| Keys | Action |
|---|---|
| Tab / ⇧Tab | Move between the two buttons, wrapping inside the dialog |
| Enter | Activates the focused button (the safe one on open) |
| Esc | Closes without changing anything |

## Examples

### close-listings

```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button, toast } from "@twoux/ui";

export const meta = { title: "Close listings", description: "Closing removes listings from job boards and cannot be undone. Focus starts on the safe button, so Enter keeps them open. Esc does the same.", order: 1 };

export default function Example() {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline">Close 2 listings</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Close 2 listings?</AlertDialogTitle>
					<AlertDialogDescription>They come off every job board today. Applicants and notes are kept, but the listings cannot be reopened.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Keep open</AlertDialogCancel>
					<AlertDialogAction variant="destructive" onClick={() => toast.success("2 listings closed")}>Close listings</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
```

## Related

- Toast
- Side panel (drawer)
- Shortcut sheet (?)
