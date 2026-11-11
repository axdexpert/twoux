import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockTitle } from "@twoux/ui";
import { FileCode2 } from "lucide-react";

const CODE = "@theme {\n  --color-primary: indigo;\n}";

/* The real CodeBlock as in the "With file name" example: file icon and name, Copy at the end of the header, line
   numbers and one highlighted line. */
export default function Thumbnail() {
	return (
		<CodeBlock size="sm" className="w-64">
			<CodeBlockHeader>
				<CodeBlockTitle icon={<FileCode2 />}>twoux.css</CodeBlockTitle>
				<CodeBlockActions>
					<CodeBlockCopyButton value={CODE} />
				</CodeBlockActions>
			</CodeBlockHeader>
			<CodeBlockContent code={CODE} lineNumbers highlight={[2]} />
		</CodeBlock>
	);
}
