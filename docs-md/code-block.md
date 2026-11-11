# Code block

Shows code, commands, IDs or log output exactly as written, so people can read and copy it. Inline Code marks a token inside a sentence.

Kind: component · Group: Content · Status: built, import from @twoux/ui

## When to use

- To let people copy a command, token, API key name or snippet exactly.
- To show a change as a diff, with added and removed lines.
- To show tool or agent output, such as a run log, using the small size.
- Inline Code for a prop, token or file name inside a sentence: `bg-surface`, `jobs.json`.

## When not to use

- When people need to edit the text. Use a Text input or the Prompt editor.
- For ordinary values in a table, such as an ID column. Use the mono table cell.
- Inline Code across several lines. Use a code block.

## Structure

1. Header (optional): file name or label
2. Actions: copy button, more if needed
3. Content: lines, with optional numbers
4. Line marks: highlighted, added (+), removed (−)
5. Footer (optional): show more, captions

## Guidelines

- Long single-line commands scroll sideways rather than wrapping, so they stay copyable as one line. Use wrap for prose-like output.
- Past about nine lines, cap the height and offer Show more in the footer.
- Without a header, the copy button floats top right and appears on hover or focus, and always on touch screens.
- Line numbers are optional, never copied and hidden from screen readers.
- Use the destructive variant for errors and failed output.
- Light border, grey fill: the block is read, not raised, so it takes no shadow.

## Content

- Label the header with the file name or what the code is: “twoux.css”, “Install”, “Run log”.
- Show code exactly as it should be typed. No ellipses inside commands.

## Accessibility

- The scrolling area is focusable (tabindex 0) so keyboard users can scroll it.
- Added and removed lines show + and − as well as colour.
- Copying announces “Copied” through a status message without moving focus; focus stays on the button.
- Wrapping is available so long output does not force two-dimensional scrolling at 320px.
- Code text keeps 4.5:1 on the grey fill; line numbers use ink-3 (5.4:1 on surface-2).

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the code area, then the copy button |
| Arrow keys | Scroll the code area when it has focus |
| Enter or Space | Copy, when the copy button has focus |

## Examples

### command

```tsx
import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton } from "@twoux/ui";

export const meta = { title: "Command", description: "One line, no header. Copy appears on hover or focus. Long commands scroll instead of wrapping.", order: 2 };

const cmd = "pnpm add @twoux/ui && pnpm llm";

export default function Example() {
	return (
		<CodeBlock className="w-full max-w-lg">
			<CodeBlockActions floating>
				<CodeBlockCopyButton value={cmd} />
			</CodeBlockActions>
			<CodeBlockContent code={`$ ${cmd}`} />
		</CodeBlock>
	);
}
```

### diff

```tsx
import { CodeBlock, CodeBlockContent, CodeBlockHeader, CodeBlockTitle } from "@twoux/ui";

export const meta = { title: "Diff", description: "Added and removed lines carry + and − as well as colour, so the change is clear without colour.", order: 3 };

export default function Example() {
	return (
		<CodeBlock className="w-full max-w-lg">
			<CodeBlockHeader>
				<CodeBlockTitle>Suggested change · listing title</CodeBlockTitle>
			</CodeBlockHeader>
			<CodeBlockContent code={`title: "Operations Coordinator"\ntitle: "Junior Operations Coordinator"\nteam: "Operations"`} removed={[1]} added={[2]} />
		</CodeBlock>
	);
}
```

### file

```tsx
import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockTitle } from "@twoux/ui";
import { FileCode2 } from "lucide-react";
// twoux-check-disable raw-colour: the colours are code sample text, not styles

export const meta = { title: "With file name", description: "The header names what the code is. Copy sits at the end of the header.", order: 1 };

const code = `@theme {
  --color-primary: var(--color-indigo-600);
  --color-line: var(--color-neutral-100);
  --shadow-card: 0 1px 2px rgb(23 23 40 / 0.04);
}`;

export default function Example() {
	return (
		<CodeBlock className="w-full max-w-lg">
			<CodeBlockHeader>
				<CodeBlockTitle icon={<FileCode2 />}>twoux.css</CodeBlockTitle>
				<CodeBlockActions>
					<CodeBlockCopyButton value={code} />
				</CodeBlockActions>
			</CodeBlockHeader>
			<CodeBlockContent code={code} lineNumbers highlight={[2]} />
		</CodeBlock>
	);
}
```

### inline

```tsx
import { Code } from "@twoux/ui";

export const meta = { title: "Inline", description: "For a token, prop or file inside a sentence. It never breaks mid-token.", order: 5 };

export default function Example() {
	return (
		<p className="max-w-md text-base text-ink">
			Style only with role tokens such as <Code>bg-surface</Code> and <Code>text-ink-2</Code>, defined in <Code>twoux.css</Code>.
		</p>
	);
}
```

### output

```tsx
import { CodeBlock, CodeBlockContent, CodeBlockFooter, CodeBlockHeader, CodeBlockTitle } from "@twoux/ui";

export const meta = { title: "Run output and errors", description: "Small size for agent and tool output. The destructive variant marks a failed run.", order: 4 };

export default function Example() {
	return (
		<div className="grid w-full max-w-lg gap-3">
			<CodeBlock size="sm">
				<CodeBlockHeader>
					<CodeBlockTitle>Run log · Rename low performers</CodeBlockTitle>
				</CodeBlockHeader>
				<CodeBlockContent code={"09:00:02  Found 2 listings under 3%\n09:00:05  Drafted 2 titles\n09:00:05  Waiting for approval"} />
			</CodeBlock>
			<CodeBlock size="sm" variant="destructive">
				<CodeBlockContent code={"09:00:07  Could not reach twoux.co.uk/jobs (timeout after 10s)"} wrap />
				<CodeBlockFooter>Try again from the run, or check the careers page link.</CodeBlockFooter>
			</CodeBlock>
		</div>
	);
}
```

## Related

- Text input
- Toast
