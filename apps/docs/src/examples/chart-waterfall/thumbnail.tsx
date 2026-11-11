import { Waterfall } from "@twoux/ui";

/* The real Waterfall: grey totals from zero, money in and out in two categorical colours with + and − labels. */
export default function Thumbnail() {
	return (
		<div className="w-64">
			<Waterfall
				aria-label="Example"
				height={90}
				format={(n) => `£${Math.round(n / 100) / 10}m`}
				labels={{ increase: "In", decrease: "Out", total: "Balance" }}
				steps={[
					{ id: "open", label: "Open", value: 1240, total: true },
					{ id: "in", label: "In", value: 580 },
					{ id: "pay", label: "Pay", value: -412 },
					{ id: "vat", label: "VAT", value: -260 },
					{ id: "close", label: "Close", total: true },
				]}
			/>
		</div>
	);
}
