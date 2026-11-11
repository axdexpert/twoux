import { Button } from "@twoux/ui";

export const meta = { title: "All sizes and variants", description: "Every combination, for checking alignment. Rows share a baseline at each size.", order: 9 };

const variants = ["default", "outline", "secondary", "ghost", "warning", "destructive"] as const;
const sizes = ["xs", "sm", "default", "lg"] as const;

export default function Example() {
	return (
		<div className="grid grid-cols-[auto_repeat(6,auto)] items-center gap-x-3 gap-y-3">
			<span />
			{variants.map((v) => (
				<span key={v} className="text-sm text-ink-3">{v}</span>
			))}
			{sizes.map((s) => (
				<div key={s} className="contents">
					<span className="font-mono text-sm text-ink-3">{s}</span>
					{variants.map((v) => (
						<Button key={v} size={s} variant={v}>Button</Button>
					))}
				</div>
			))}
		</div>
	);
}
