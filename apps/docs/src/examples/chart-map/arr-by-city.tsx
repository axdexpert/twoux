import { ChartFrame, MapChart, mapTable } from "@twoux/ui";
import world from "world-atlas/countries-110m.json";

export const meta = { title: "ARR by customer location", description: "Raw amounts go on markers, never as shading: circle area grows with ARR, so London and New York stand out without painting all of the UK or the US.", order: 2 };

const gbp = (n: number) => `£${(n / 1_000_000).toFixed(1)}m`;
// Annual recurring revenue by the city of the customer's head office.
const ARR = [
	{ id: "lon", label: "London", lon: -0.13, lat: 51.51, value: 4_820_000 },
	{ id: "man", label: "Manchester", lon: -2.24, lat: 53.48, value: 910_000 },
	{ id: "dub", label: "Dublin", lon: -6.26, lat: 53.35, value: 1_340_000 },
	{ id: "ber", label: "Berlin", lon: 13.4, lat: 52.52, value: 2_150_000 },
	{ id: "ams", label: "Amsterdam", lon: 4.9, lat: 52.37, value: 1_620_000 },
	{ id: "par", label: "Paris", lon: 2.35, lat: 48.86, value: 1_280_000 },
	{ id: "sto", label: "Stockholm", lon: 18.07, lat: 59.33, value: 740_000 },
	{ id: "nyc", label: "New York", lon: -74.0, lat: 40.71, value: 3_960_000 },
	{ id: "sfo", label: "San Francisco", lon: -122.42, lat: 37.77, value: 2_480_000 },
	{ id: "tor", label: "Toronto", lon: -79.38, lat: 43.65, value: 860_000 },
	{ id: "syd", label: "Sydney", lon: 151.21, lat: -33.87, value: 1_050_000 },
	{ id: "sin", label: "Singapore", lon: 103.82, lat: 1.35, value: 690_000 },
];

export default function Example() {
	return (
		<ChartFrame className="w-full" title="ARR by customer location" description="Head office city, as of 30 September" table={mapTable(ARR, { format: gbp, first: "City", valueLabel: "ARR" })} height={260}>
			<MapChart topology={world} object="countries" exclude={["010"]} markers={ARR} format={gbp} valueLabel="ARR" aria-label="Map showing ARR by customer head office city, as of 30 September" />
		</ChartFrame>
	);
}
