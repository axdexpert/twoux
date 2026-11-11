import { FieldMapping } from "@twoux/ui";

/* The real FieldMapping, trimmed to two fields (Required is left out to fit): type icon and name, the arrow, then the chosen column. */
export default function Thumbnail() {
	return (
		<FieldMapping
			className="w-64"
			targets={[
				{ id: "name", label: "Name", kind: "text" },
				{ id: "email", label: "Work email", kind: "email" },
			]}
			sources={[
				{ id: "q1", label: "Full name", samples: [] },
				{ id: "q2", label: "E-mail", samples: [] },
			]}
			value={{ name: "q1", email: "q2" }}
			onChange={() => {}}
			targetHeading="Field"
			sourceHeading="Column"
		/>
	);
}
