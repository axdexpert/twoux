import { binValues, ChartFrame, Histogram, histogramTable } from "@twoux/ui";

export const meta = { title: "Salary offers", description: "140 offers in £5k bins with the median marked. The shape shows the long tail a single average hides.", order: 1 };

const OFFERS = [23000, 27000, 28500, 29500, 30000, 30000, 30000, 30000, 31500, 32500, 33000, 33500, 33500, 34000, 34000, 35500, 36000, 36000, 36500, 37000, 37500, 38000, 38000, 38000, 38000, 38500, 38500, 39000, 39500, 40000, 40000, 40500, 40500, 40500, 40500, 41000, 41000, 41000, 41500, 41500, 42000, 42500, 42500, 43000, 43000, 43000, 43500, 43500, 43500, 44000, 44000, 45000, 45000, 45500, 45500, 46500, 46500, 46500, 47000, 49500, 50000, 50500, 50500, 50500, 50500, 51000, 51000, 51000, 51500, 51500, 52000, 52500, 53000, 53500, 53500, 53500, 54000, 54000, 54500, 55000, 55000, 55000, 55000, 55500, 56000, 56500, 57000, 57500, 57500, 57500, 57500, 57500, 58000, 58000, 58500, 59000, 60000, 62000, 62000, 62000, 62500, 62500, 63000, 63000, 63000, 63000, 63500, 64000, 64500, 65000, 65000, 65500, 66000, 67000, 67500, 68000, 68000, 68000, 70000, 70500, 75500, 75500, 76000, 76500, 76500, 77500, 78500, 79500, 79500, 79500, 82500, 83000, 83500, 83500, 88000, 91000, 92000, 93500, 101500, 104000];
const BINS = binValues(OFFERS, { binWidth: 5000, start: 20000 });
const gbp = (n: number) => `£${n / 1000}k`;

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Salary offers" description="Offers made, last 12 months" table={histogramTable(BINS, gbp, "Salary")}>
			<Histogram bins={BINS} format={gbp} xTitle="Annual salary offered" countLabel="offers" marker={{ value: 52000, label: "Median £52k" }} aria-label="Salary offers, last 12 months" />
		</ChartFrame>
	);
}
