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
