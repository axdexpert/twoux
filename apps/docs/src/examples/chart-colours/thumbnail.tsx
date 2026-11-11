import type React from "react";
import { seriesColor } from "@twoux/ui";

export default function Thumbnail() {
	return <div className="flex gap-1" aria-hidden="true">{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <span key={i} className="size-5 rounded-xs bg-(--c)" style={{ "--c": seriesColor(i) } as React.CSSProperties} />)}</div>;
}
