export const install = "";
export const api = [
	{ component: "CodeBlock", props: [
		{ name: "variant", type: '"default" | "destructive"', default: '"default"', description: "Destructive for errors and failed output." },
		{ name: "size", type: '"default" | "sm"', default: '"default"', description: "sm for tool and agent output." },
	] },
	{ component: "CodeBlockContent", props: [
		{ name: "code", type: "string", description: "The code. Split into lines so they can be numbered and marked." },
		{ name: "lineNumbers", type: "boolean", default: "false", description: "Not copied, hidden from screen readers." },
		{ name: "startLine", type: "number", default: "1", description: "First line number." },
		{ name: "wrap", type: "boolean", default: "false", description: "Wrap long lines instead of scrolling." },
		{ name: "highlight / added / removed", type: "number[]", description: "1-based lines to mark. Added and removed also show + and −." },
	] },
	{ component: "CodeBlockHeader · Title · Actions · CopyButton · Footer", props: [
		{ name: "CodeBlockTitle icon", type: "ReactNode", description: "Optional icon before the file name." },
		{ name: "CodeBlockActions floating", type: "boolean", default: "false", description: "Without a header: top right, shown on hover or focus." },
		{ name: "CodeBlockCopyButton value", type: "string", description: "Required. Announces Copied without moving focus." },
	] },
	{ component: "Code", props: [{ name: "children", type: "ReactNode", description: "Inline token, prop or file name." }] },
];
