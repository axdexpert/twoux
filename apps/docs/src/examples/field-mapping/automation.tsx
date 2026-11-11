import { type ExtraColumns, type FieldMap, FieldMapping, type MappingSource, type MappingTarget, autoMapFields } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Map a form's answers to table fields", description: "Fields with matching names are paired automatically. Required fields are marked, values that don't fit the field type are warned about, and unused columns can become new columns.", order: 1 };

const TARGETS: MappingTarget[] = [
	{ id: "name", label: "Name", kind: "text", required: true },
	{ id: "email", label: "Work email", kind: "email", required: true },
	{ id: "size", label: "Company size", kind: "number" },
	{ id: "start", label: "Start date", kind: "date" },
];
const SOURCES: MappingSource[] = [
	{ id: "q1", label: "Your name", samples: ["Ana Silva", "Ben Hughes", "Chloe Patel"] },
	{ id: "q2", label: "Email", samples: ["ana@harbourvale.co.uk", "ben at brightwater", "chloe@mosaiclending.co.uk"] },
	{ id: "q3", label: "Company size", samples: ["240", "about 150", "410"] },
	{ id: "q4", label: "How did you hear about us?", samples: ["Event", "Search"] },
];

export default function Example() {
	const [map, setMap] = useState<FieldMap>(() => ({ ...autoMapFields(TARGETS, SOURCES), name: "q1" }));
	const [extra, setExtra] = useState<ExtraColumns>({});
	return <FieldMapping className="w-full max-w-2xl" targets={TARGETS} sources={SOURCES} value={map} onChange={setMap} extra={extra} onExtraChange={setExtra} sourceHeading="Answer in the form" />;
}
