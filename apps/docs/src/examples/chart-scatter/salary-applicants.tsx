import { ChartFrame, ScatterChart } from "@twoux/ui";

export const meta = { title: "Salary against applicants", description: "One dot per listing, up to three teams, each with its own colour and shape. Arrow keys move along the x axis; Enter pins the details with a link to the listing.", order: 1 };

const P = [
	["Junior Product Designer", 30, 38, "Design"], ["Senior Product Designer", 58, 37, "Design"], ["Content Designer", 42, 21, "Design"],
	["Frontend Engineer", 52, 112, "Engineering"], ["Backend Engineer", 60, 64, "Engineering"], ["QA Engineer", 40, 47, "Engineering"], ["Platform Engineer", 68, 29, "Engineering"],
	["Data Analyst", 41, 64, "Data"], ["Analytics Engineer", 55, 33, "Data"], ["Data Scientist", 62, 41, "Data"],
] as const;

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Salary and applicants" description="Open listings, salary from in £000s">
			<ScatterChart aria-label="Salary against applicants by team" xTitle="Salary from (£000s)" yTitle="Applicants" points={P.map(([label, x, y, group], i) => ({ id: String(i), label, x, y, group, href: "#listing" }))} />
		</ChartFrame>
	);
}
