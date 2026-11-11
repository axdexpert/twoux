import { useEffect } from "react";

/** Title and description for search engines and AI assistants; the prerender step bakes them into each page's HTML. */
export function useMeta(title: string, description?: string) {
	useEffect(() => {
		document.title = title;
		if (!description) return;
		let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
		if (!tag) { tag = document.createElement("meta"); tag.name = "description"; document.head.append(tag); }
		tag.content = description;
		document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
		document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
	}, [title, description]);
}
