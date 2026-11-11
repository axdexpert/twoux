import { DonutChart } from "@twoux/ui";

export default function Thumbnail() {
	return <div className="w-90"><DonutChart aria-label="Example" segments={[{ id: "a", label: "Job boards", value: 5 }, { id: "b", label: "Careers page", value: 3 }, { id: "c", label: "Referrals", value: 1 }]} /></div>;
}
