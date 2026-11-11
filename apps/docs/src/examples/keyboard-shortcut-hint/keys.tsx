import { Kbd } from "@twoux/ui";

export const meta = {
	title: "Keys",
	description: "One Kbd per key. Use symbols for modifiers: ⌘ ⇧ ⌥ ↵.",
	order: 1,
};

export default function Example() {
	return (
		<dl className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2">
			<dd className="flex gap-0.5"><Kbd>⌘</Kbd><Kbd>K</Kbd></dd><dt className="text-ink-2">Search or run a command</dt>
			<dd className="flex gap-0.5"><Kbd>J</Kbd><Kbd>K</Kbd></dd><dt className="text-ink-2">Next and previous row</dt>
			<dd className="flex gap-0.5"><Kbd>⇧</Kbd><Kbd>H</Kbd></dd><dt className="text-ink-2">Snooze</dt>
			<dd className="flex gap-0.5"><Kbd>Esc</Kbd></dd><dt className="text-ink-2">Close</dt>
		</dl>
	);
}
