import { ExportMenu, toast } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Export a table", description: "Options toggle without closing the menu. Downloads and copies run and close, then confirm with a toast. Opens with ⇧E.", order: 1 };

export default function Example() {
	const [onlyVisible, setOnlyVisible] = useState(true);
	const [includeAi, setIncludeAi] = useState(false);
	const scope = `${onlyVisible ? "visible" : "all"} columns${includeAi ? ", with AI columns" : ""}`;
	return (
		<ExportMenu
			onlyVisible={onlyVisible}
			onOnlyVisibleChange={setOnlyVisible}
			includeAi={includeAi}
			onIncludeAiChange={setIncludeAi}
			onDownload={(f) => toast.success(`listings.${f.toLowerCase()} downloaded`, { description: `24 rows, ${scope}` })}
			onCopy={(f) => toast.success(`Copied 24 rows as ${f}`)}
		/>
	);
}
