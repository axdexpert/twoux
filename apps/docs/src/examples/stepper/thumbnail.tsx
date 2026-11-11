import { Stepper } from "@twoux/ui";

export default function Thumbnail() {
	return <Stepper className="w-44" current={1} steps={[{ title: "Add the role" }, { title: "Set salary" }, { title: "Publish" }]} aria-label="Example progress" />;
}
