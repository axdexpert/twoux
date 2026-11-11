import { type Candle, CandlestickChart } from "@twoux/ui";

const C: [number, number, number, number][] = [[742, 748, 739, 746], [746, 744, 741, 750], [744, 751, 743, 753], [751, 747, 745, 754], [747, 740, 738, 749], [740, 745, 737, 747], [745, 752, 744, 755], [752, 756, 750, 759], [756, 750, 748, 758], [750, 754, 749, 757], [754, 759, 752, 762], [759, 755, 753, 761]];
const CANDLES: Candle[] = C.map(([o, c, l, h], i) => ({ t: `${i + 3} Nov`, o, c, l, h, v: 1_200_000 + ((i * 7) % 5) * 400_000 }));

/* The real CandlestickChart at a small size: hollow up days, filled down days, the price axis on the right.
   The volume panel is turned off and the legend under the chart is clipped, both to fit the preview. */
export default function Thumbnail() {
	return (
		<div className="h-25 w-64 overflow-hidden">
			<CandlestickChart candles={CANDLES} height={100} volumeHeight={0} format={(n) => `${n}p`} aria-label="Example" />
		</div>
	);
}
