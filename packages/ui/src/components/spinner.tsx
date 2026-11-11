import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

/** Indeterminate progress. Decorative: the control or region that is busy carries aria-busy and the label. */
export function Spinner({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
	return (
		<span
			aria-hidden="true"
			className={cn("inline-block size-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent opacity-80", className)}
			{...props}
		/>
	);
}
