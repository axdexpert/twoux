# File drop

Drop a file or choose one. Accepted types and the size limit show before choosing, and a preview replaces the icon once a file is picked.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- A single file the product needs, such as a logo, an avatar or a CSV.
- Where dragging a file in is a shortcut, not the only way.

## When not to use

- Attaching files to a message. Use the Message composer (message-composer).
- Importing many files with progress. Use a list with a status per file.

## Structure

1. Label
2. Drop area (icon or preview, "Drop a file here", accepted types and limit)
3. Remove and Replace or Upload buttons
4. Hidden native file input
5. Error under the area

## Guidelines

- Show accepted types and the size limit before anyone chooses a file.
- Let people choose with a button as well as drop. Drag and drop is never the only way.
- Errors name the file's size or type and say what to choose, for example "That file is 14.2 MB. Choose one up to 10 MB."
- The preview replaces the icon, with Remove and Replace beside it.
- Use a visible label, and a native file input that is hidden visually but still labelled and focusable by the Upload button.

## Content

- Hint: "PNG or JPEG, up to 10 MB".
- Wrong type: "That file type isn't supported. Choose PNG or JPEG."

## Accessibility

- The visible label is attached to the real input, which keeps its accessible name and value (SC 3.3.2, 4.1.2).
- The error is linked to the field with aria-invalid and announced when it appears (SC 3.3.1, 4.1.3).
- The drag state is not conveyed by colour alone: the text changes to "Drop to upload" (SC 1.4.1).

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move to the Upload button |
| Enter or Space | Open the system file chooser |
| Tab, then Enter | Remove or replace the chosen file |

## Examples

### logo

```tsx
import { FileDrop } from "@twoux/ui";
import { useEffect, useState } from "react";

export const meta = { title: "Upload a logo", description: "Types and limit show first. Drop a PNG or JPEG, or press Upload. Try a file over 10 MB or a PDF to see the error.", order: 1 };

export default function Example() {
	const [url, setUrl] = useState<string>();
	useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
	return (
		<div className="w-full max-w-md">
			<FileDrop
				id="company-logo"
				label="Company logo"
				accept="image/png,image/jpeg"
				hint="PNG or JPEG, up to 10 MB"
				maxBytes={10e6}
				preview={url}
				onFile={(f) => setUrl(URL.createObjectURL(f))}
				onRemove={() => setUrl(undefined)}
			/>
		</div>
	);
}
```

### server-error

```tsx
import { FileDrop } from "@twoux/ui";

export const meta = { title: "An error from the server", description: "The message names what is wrong with the file and what to choose instead.", order: 2 };

export default function Example() {
	return (
		<div className="w-full max-w-md">
			<FileDrop
				id="hiring-csv"
				label="Candidates file"
				accept="text/csv"
				hint="CSV, up to 5 MB"
				error="Row 14 has no email address. Add one and choose the file again."
				onFile={() => {}}
			/>
		</div>
	);
}
```

## Related

- Form validation
- Text input
- Message composer
- Provider logo
