import { PriceChart } from "@twoux/ui";

const X = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
const DATA = [741.8, 743.3, 746.6, 741.8, 742.7, 747.2, 745.3, null, null];

/* The real PriceChart: the session so far, the previous close as a dashed reference and the last price tagged. */
export default function Thumbnail() {
	return (
		<div className="w-64">
			<PriceChart x={X} data={DATA} height={100} format={(n) => `${n.toFixed(1)}p`} reference={{ value: 741.2, label: "Previous close" }} aria-label="Example" />
		</div>
	);
}
