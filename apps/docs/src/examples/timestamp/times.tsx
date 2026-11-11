import { Timestamp } from "@twoux/ui";

export const meta = { title: "Relative, short and absolute", description: "Relative in lists, with the full date and time zone on hover or focus. Short units in compact cells. Deadlines are always absolute.", order: 1 };

const ago = (m: number) => new Date(Date.now() - m * 60000);

export default function Example() {
	return (
		<dl className="grid grid-cols-[160px_1fr] gap-x-4 gap-y-2 text-base">
			<dt className="text-ink-2">Last edited</dt><dd><Timestamp value={ago(180)} by={<a href="#priya" className="font-medium text-primary-ink hover:underline">Priya Shah</a>} /></dd>
			<dt className="text-ink-2">In a table cell</dt><dd><Timestamp value={ago(60 * 26)} short /></dd>
			<dt className="text-ink-2">Closing date</dt><dd><Timestamp value="2026-12-04T17:00:00Z" format="absolute" /></dd>
			<dt className="text-ink-2">Applied via Assistant</dt><dd><Timestamp value={ago(12)} by={<span>Tom Becker via Assistant</span>} /></dd>
		</dl>
	);
}
