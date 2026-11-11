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
