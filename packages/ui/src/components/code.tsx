import { cva, type VariantProps } from "class-variance-authority";
import { Check, Copy } from "lucide-react";
import { Swap } from "./motion";
import { type HTMLAttributes, type ReactNode, useState } from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";

/* Inline code: a token, prop, file or key inside a sentence. Never breaks mid-token. */
export function Code({ className, ...props }: HTMLAttributes<HTMLElement>) {
	return <code className={cn("whitespace-nowrap rounded-xs bg-surface-2 px-1 font-mono text-sm text-ink ring-1 ring-line ring-inset", className)} {...props} />;
}

/* ---------------- CodeBlock: structure follows shadcn/ui's code block ---------------- */

const blockVariants = cva("group/code relative overflow-hidden rounded-md border bg-surface-2", {
	variants: {
		variant: { default: "border-line", destructive: "border-bad-line bg-bad-bg/40" },
		size: { default: "text-sm", sm: "text-xs" },
	},
	defaultVariants: { variant: "default", size: "default" },
});

export function CodeBlock({ variant, size, className, ...props }: HTMLAttributes<HTMLDivElement> & VariantProps<typeof blockVariants>) {
	return <div data-size={size ?? "default"} className={cn(blockVariants({ variant, size }), className)} {...props} />;
}

export function CodeBlockHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("flex h-9 items-center gap-2 border-b border-line bg-surface pr-2 pl-3", className)} {...props} />;
}

export function CodeBlockTitle({ icon, className, children, ...props }: HTMLAttributes<HTMLDivElement> & { icon?: ReactNode }) {
	return (
		<div className={cn("flex min-w-0 flex-1 items-center gap-control text-sm text-ink-2 [&_svg]:size-3.5 [&_svg]:shrink-0", className)} {...props}>
			{icon}
			<span className="truncate font-mono">{children}</span>
		</div>
	);
}

/** Inside a header: sits at the end. Without a header: floats top-right and appears on hover or focus. */
export function CodeBlockActions({ className, floating, ...props }: HTMLAttributes<HTMLDivElement> & { floating?: boolean }) {
	return (
		<div
			className={cn(
				"flex items-center gap-0.5",
				floating && "absolute top-1.5 right-1.5 z-10 rounded-sm bg-surface-2 opacity-0 transition-opacity duration-(--duration-fast) group-hover/code:opacity-100 group-focus-within/code:opacity-100 pointer-coarse:opacity-100",
				className,
			)}
			{...props}
		/>
	);
}

export function CodeBlockCopyButton({ value, className }: { value: string; className?: string }) {
	const [copied, setCopied] = useState(false);
	return (
		<>
			<Button
				variant="ghost"
				size="icon-xs"
				className={className}
				aria-label={copied ? "Copied" : "Copy code"}
				title={copied ? "Copied" : "Copy"}
				onClick={() =>
					navigator.clipboard?.writeText(value).then(() => {
						setCopied(true);
						setTimeout(() => setCopied(false), 1500);
					})
				}
			>
				<Swap kind="icon" swapKey={copied ? "copied" : "copy"}>{copied ? <Check /> : <Copy />}</Swap>
			</Button>
			<span role="status" className="sr-only">{copied ? "Copied" : ""}</span>
		</>
	);
}

type LineVariant = "default" | "added" | "removed" | "highlighted";
const lineStyles: Record<LineVariant, string> = {
	default: "",
	added: "bg-ok-bg/70",
	removed: "bg-bad-bg/70",
	highlighted: "bg-primary-soft/70",
};
const markers: Record<LineVariant, string> = { default: " ", added: "+", removed: "−", highlighted: " " };

export interface CodeBlockContentProps extends HTMLAttributes<HTMLPreElement> {
	/** The code, as a string. Each line is rendered separately so lines can be numbered and marked. */
	code: string;
	lineNumbers?: boolean;
	startLine?: number;
	/** Wrap long lines instead of scrolling. */
	wrap?: boolean;
	/** 1-based line numbers to mark. Added and removed lines also get + and − so the change is not shown by colour alone. */
	highlight?: number[];
	added?: number[];
	removed?: number[];
}

export function CodeBlockContent({ code, lineNumbers, startLine = 1, wrap, highlight = [], added = [], removed = [], className, ...props }: CodeBlockContentProps) {
	const lines = code.replace(/\n$/, "").split("\n");
	const diff = added.length > 0 || removed.length > 0;
	const gutter = String(startLine + lines.length - 1).length;
	return (
		<pre
			// A scrollable region must be reachable by keyboard (WCAG 2.1.1).
			tabIndex={0}
			className={cn("m-0 max-w-full py-2 font-mono leading-relaxed text-ink outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary", wrap ? "whitespace-pre-wrap break-words" : "overflow-x-auto", className)}
			{...props}
		>
			<code className={cn("grid", !wrap && "min-w-max")}>
				{lines.map((text, i) => {
					const n = i + 1;
					const v: LineVariant = added.includes(n) ? "added" : removed.includes(n) ? "removed" : highlight.includes(n) ? "highlighted" : "default";
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: lines are positional
						<span key={i} className={cn("flex px-3.5", lineStyles[v])}>
							{lineNumbers && (
								<span aria-hidden="true" className={cn("mr-4 shrink-0 select-none text-right text-ink-3 tabular", gutter > 2 ? "min-w-8" : "min-w-5")}>
									{startLine + i}
								</span>
							)}
							{diff && (
								<span aria-hidden={v === "default"} className={cn("mr-2 w-2 shrink-0 select-none", v === "added" && "text-ok", v === "removed" && "text-bad")}>
									{markers[v]}
								</span>
							)}
							<span className={cn("min-w-0", wrap && "wrap-anywhere", v === "removed" && "text-ink-2")}>{text || " "}</span>
						</span>
					);
				})}
			</code>
		</pre>
	);
}

export function CodeBlockFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("flex items-center gap-2 border-t border-line bg-surface px-3 py-2 text-sm text-ink-2", className)} {...props} />;
}
