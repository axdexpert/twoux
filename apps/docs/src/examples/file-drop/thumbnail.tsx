import { FileDrop } from "@twoux/ui";

/* The real FileDrop with nothing chosen yet. */
export default function Thumbnail() {
	return <FileDrop id="thumb-file-drop" label="Company logo" accept="image/png,image/jpeg" hint="Up to 10 MB" className="w-64" onFile={() => {}} />;
}
