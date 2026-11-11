import { MapChart } from "@twoux/ui";
import world from "world-atlas/countries-110m.json";

const VALUES = [
	{ id: "826", value: 18 }, { id: "276", value: 15 }, { id: "250", value: 11 }, { id: "724", value: 8 },
	{ id: "840", value: 16 }, { id: "124", value: 13 }, { id: "076", value: 7 }, { id: "356", value: 4 },
	{ id: "036", value: 17 }, { id: "392", value: 8 }, { id: "710", value: 6 }, { id: "484", value: 5 },
];

/* The real MapChart: countries shaded by a rate, the rest hatched as No data. */
export default function Thumbnail() {
	return (
		<div className="w-64">
			<MapChart topology={world} object="countries" exclude={["010"]} values={VALUES} aria-label="Example" />
		</div>
	);
}
