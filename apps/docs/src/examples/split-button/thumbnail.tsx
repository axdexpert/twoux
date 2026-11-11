import { SplitButton } from "@twoux/ui";
import { Upload } from "lucide-react";

/* The real SplitButton: the main action with its icon, and the chevron part that opens its variants. */
const noop = () => {};

export default function Thumbnail() {
	return <SplitButton onClick={noop} menuLabel="More import options" menu={null}><Upload />Import data</SplitButton>;
}
