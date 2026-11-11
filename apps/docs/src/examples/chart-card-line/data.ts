import type { ChartSeries } from "@twoux/ui";

export const WEEKS = ["6 Oct", "13 Oct", "20 Oct", "27 Oct", "3 Nov", "10 Nov", "17 Nov", "24 Nov"];

export const APPLICATIONS: ChartSeries[] = [
	{ id: "design", label: "Design", data: [42, 51, 47, 63, 58, 71, 66, 80] },
	{ id: "eng", label: "Engineering", data: [88, 94, 102, 97, 115, 121, 118, 132] },
	{ id: "data", label: "Data", data: [21, 25, 19, 28, 31, 27, 34, 38] },
];

export const HIRES: ChartSeries[] = [
	{ id: "design", label: "Design", data: [1, 0, 2, 1, 1, 2, 1, 3] },
	{ id: "eng", label: "Engineering", data: [2, 3, 2, 4, 3, 5, 4, 5] },
	{ id: "data", label: "Data", data: [0, 1, 1, 0, 1, 1, 2, 1] },
];
