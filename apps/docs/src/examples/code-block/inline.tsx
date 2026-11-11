import { Code } from "@twoux/ui";

export const meta = { title: "Inline", description: "For a token, prop or file inside a sentence. It never breaks mid-token.", order: 5 };

export default function Example() {
	return (
		<p className="max-w-md text-base text-ink">
			Style only with role tokens such as <Code>bg-surface</Code> and <Code>text-ink-2</Code>, defined in <Code>twoux.css</Code>.
		</p>
	);
}
