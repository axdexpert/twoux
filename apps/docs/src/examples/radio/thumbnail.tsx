import { RadioField, RadioGroup } from "@twoux/ui";
export default function Thumbnail() {
	return (
		<RadioGroup defaultValue="a">
			<RadioField id="tr-a" value="a" label="Full time" />
			<RadioField id="tr-b" value="b" label="Part time" />
		</RadioGroup>
	);
}
