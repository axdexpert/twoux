import { Tag, TagList } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Categories on a listing", description: "Tags are quieter than status badges and have 4px corners (pills mean filters). A dot only when the colour means something. In a table cell, three at most, then +N.", order: 1 };

export default function Example() {
	const [tags, setTags] = useState(["Design", "Hybrid", "Graduate scheme"]);
	return (
		<div className="grid gap-4">
			<div className="flex flex-wrap gap-1.5">{tags.map((t, i) => <Tag key={t} color={i === 0 ? "var(--color-c1)" : undefined} onRemove={() => setTags((x) => x.filter((y) => y !== t))}>{t}</Tag>)}</div>
			<div className="flex items-center gap-3 text-base text-ink-2">In a table cell: <TagList tags={["Engineering", "Remote", "Senior", "Visa sponsorship", "Urgent"]} /></div>
		</div>
	);
}
