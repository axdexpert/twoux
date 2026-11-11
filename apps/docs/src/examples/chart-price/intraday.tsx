import { ChartFrame, PriceChart } from "@twoux/ui";

export const meta = { title: "Share price today", description: "Ten-minute prices from the open, the session's remaining slots left empty, the last price tagged on the right axis and the previous close as a dashed reference. The axis starts above zero and says so.", order: 1 };

const TIMES = ["08:00", "08:10", "08:20", "08:30", "08:40", "08:50", "09:00", "09:10", "09:20", "09:30", "09:40", "09:50", "10:00", "10:10", "10:20", "10:30", "10:40", "10:50", "11:00", "11:10", "11:20", "11:30", "11:40", "11:50", "12:00", "12:10", "12:20", "12:30", "12:40", "12:50", "13:00", "13:10", "13:20", "13:30", "13:40", "13:50", "14:00", "14:10", "14:20", "14:30", "14:40", "14:50", "15:00", "15:10", "15:20", "15:30", "15:40", "15:50", "16:00", "16:10", "16:20", "16:30"];
const TRADED = [741.8, 742.7, 742.5, 742.2, 741.0, 740.9, 742.6, 743.3, 745.0, 745.5, 746.2, 746.6, 744.4, 745.7, 746.6, 747.4, 745.2, 742.9, 741.8, 741.3, 741.9, 742.0, 742.9, 742.1, 742.7, 743.4, 742.6, 745.2, 746.1, 747.9, 747.2, 746.3, 746.0, 746.0, 747.0, 747.5, 747.1, 745.9, 745.3];
const PRICES = TIMES.map((_, i) => TRADED[i] ?? null);
const pence = (n: number) => `${n.toLocaleString("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}p`;

export default function Example() {
	return (
		<ChartFrame
			className="w-full"
			title="Ashdown plc share price"
			description="Today, in pence, 15 minutes delayed"
			table={{ columns: ["Time", "Price"], rows: TIMES.slice(0, TRADED.length).map((t, i) => [t, pence(TRADED[i])]) }}
		>
			<PriceChart x={TIMES} data={PRICES} format={pence} reference={{ value: 741.2, label: "Previous close" }} live aria-label="Ashdown plc share price today" />
		</ChartFrame>
	);
}
