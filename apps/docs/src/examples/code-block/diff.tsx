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
