import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { PageIcon } from "./page-icons";

/** The docs' one card for linking to a page or section: icon tile, title, optional meta, two-line summary. */
export function DocCard({ to, title, summary, meta, id, icon }: { to: string; title: string; summary: string; meta?: string; id?: string; icon?: LucideIcon }) {
	return (
		<Link to={to} className="group flex items-start gap-3 rounded-sm border border-line bg-surface p-4 shadow-card transition-[border-color,box-shadow] duration-(--duration-fast) hover:shadow-raised">
			<PageIcon id={id} icon={icon} />
			<div className="min-w-0">
				<div className="flex flex-wrap items-baseline gap-x-2">
					<span className="text-docs font-semibold group-hover:text-primary-ink">{title}</span>
					{meta && <span className="text-sm text-ink-3">{meta}</span>}
				</div>
				<p className="mt-0.5 line-clamp-2 text-docs-sm text-ink-2">{summary}</p>
			</div>
		</Link>
	);
}
