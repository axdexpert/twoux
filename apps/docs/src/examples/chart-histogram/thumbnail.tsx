import { type Bin, Histogram } from "@twoux/ui";

const COUNTS = [2, 6, 12, 18, 14, 9, 5, 3, 1];
const BINS: Bin[] = COUNTS.map((count, i) => ({ from: 20 + i * 10, to: 30 + i * 10, count }));

/* The real Histogram with a median marker, at a small height. */
export default function Thumbnail() {
	return (
		<div className="w-64">
			<Histogram bins={BINS} height={110} format={(n) => `£${n}k`} xTitle="Salary" countLabel="offers" marker={{ value: 52, label: "Median" }} aria-label="Example" />
		</div>
	);
}
