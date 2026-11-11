import { StatCompare } from "@twoux/ui";

export default function Thumbnail() {
	return <StatCompare label="Applications" value="595" change="+12%" period="October" good spark={[42, 48, 51, 47, 55, 60, 58, 66]} className="w-48" />;
}
