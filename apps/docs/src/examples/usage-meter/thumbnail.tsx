import { UsageMeter } from "@twoux/ui";

export default function Thumbnail() {
	return (
		<div className="w-52" aria-hidden="true">
			<UsageMeter used={13200} limit={20000} unit="credits" resets="1 Dec" />
		</div>
	);
}
