import { FileDrop } from "@twoux/ui";
import { useEffect, useState } from "react";

export const meta = { title: "Upload a logo", description: "Types and limit show first. Drop a PNG or JPEG, or press Upload. Try a file over 10 MB or a PDF to see the error.", order: 1 };

export default function Example() {
	const [url, setUrl] = useState<string>();
	useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
	return (
		<div className="w-full max-w-md">
			<FileDrop
				id="company-logo"
				label="Company logo"
				accept="image/png,image/jpeg"
				hint="PNG or JPEG, up to 10 MB"
				maxBytes={10e6}
				preview={url}
				onFile={(f) => setUrl(URL.createObjectURL(f))}
				onRemove={() => setUrl(undefined)}
			/>
		</div>
	);
}
