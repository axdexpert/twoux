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
