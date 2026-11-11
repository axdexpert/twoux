import { TagInput } from "@twoux/ui";

export const meta = { title: "States", description: "Invalid values are counted under the field. Read-only tags stay focusable and readable.", order: 2 };

const noop = () => {};
const domain = (v: string) => (/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(v) ? undefined : "Not a domain, such as acme.co.uk.");

export default function Example() {
	return (
		<div className="grid w-96 max-w-full gap-4">
			<TagInput label="Allowed domains" noun={{ one: "domain", many: "domains" }} value={["acme.co.uk", "acme com", "acme.com"]} onValueChange={noop} validateValue={domain} />
			<TagInput label="Keywords" noun={{ one: "keyword", many: "keywords" }} value={["Data engineer", "Analytics", "Remote"]} onValueChange={noop} readOnly />
		</div>
	);
}
