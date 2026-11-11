import { ChartFrame, Waterfall, type WaterfallStep, waterfallTable } from "@twoux/ui";

export const meta = { title: "Cash flow for the month", description: "Opening balance, money in and money out, then the closing balance as a total. Grey totals, two categorical colours for in and out, a + or − on every change that fits.", order: 1 };

const STEPS: WaterfallStep[] = [
	{ id: "open", label: "Opening", value: 1_240_000, total: true },
	{ id: "subs", label: "Subscriptions", value: 486_000 },
	{ id: "services", label: "Services", value: 92_000 },
	{ id: "payroll", label: "Payroll", value: -412_000 },
	{ id: "hosting", label: "Hosting", value: -88_000 },
	{ id: "rent", label: "Rent", value: -46_000 },
	{ id: "vat", label: "VAT", value: -131_000 },
	{ id: "close", label: "Closing", total: true },
];
const gbp = (n: number) => (Math.abs(n) >= 1_000_000 ? `£${(n / 1_000_000).toFixed(2)}m` : n === 0 ? "£0" : `£${Math.round(n / 1000)}k`);

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Cash flow" description="October 2026, all accounts" table={waterfallTable(STEPS, gbp)}>
			<Waterfall steps={STEPS} format={gbp} labels={{ increase: "Money in", decrease: "Money out", total: "Balance" }} aria-label="Cash flow, October 2026" />
		</ChartFrame>
	);
}
