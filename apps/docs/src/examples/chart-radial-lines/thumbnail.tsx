import { RadialLines } from "@twoux/ui";

const HOURS = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}`);

/* The real RadialLines: two queues over the 24 hours of a day, midnight at the top. */
export default function Thumbnail() {
	return (
		<div className="w-64">
			<RadialLines periods={HOURS} periodLabel="Hour" maxSize={200} aria-label="Example" series={[
				{ id: "a", label: "Billing", data: [6, 4, 3, 2, 2, 3, 8, 18, 34, 52, 61, 58, 49, 55, 60, 54, 44, 31, 22, 17, 14, 12, 10, 8] },
				{ id: "b", label: "Technical", data: [14, 12, 10, 9, 9, 11, 16, 24, 31, 38, 42, 40, 36, 39, 43, 41, 37, 33, 29, 27, 24, 21, 18, 16] },
			]} />
		</div>
	);
}
