import { Badge, Button, Segment, SegmentedControl, useTheme } from "@twoux/ui";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMeta } from "../components/meta";
import { EXAMPLE_APPS, isNew } from "../content";
import { posthogCapture, posthogLogger } from "../posthog";
import { PageHeader } from "./ComponentPage";

/* Example apps as a gallery, the way template libraries show templates: a grid of cards with a screenshot, what the
   app is and the parts it shows, richest first. Choosing a card opens that app live (/examples#id) at desktop, tablet
   or phone width; "Open full page" opens it on its own. Screenshots follow the docs theme
   (scripts/examples/thumbs.mjs makes them). */

type App = (typeof EXAMPLE_APPS)[number];
type Viewport = "desktop" | "tablet" | "phone";
const WIDTH: Record<Viewport, string> = { desktop: "max-w-full", tablet: "max-w-3xl", phone: "max-w-sm" };

function OpenFullPage({ app, entryPoint, size = "sm" }: { app: App; entryPoint: "gallery" | "preview"; size?: "sm" | "icon-sm" }) {
	return (
		<Button asChild variant={size === "sm" ? "outline" : "ghost"} size={size}>
			<a href={app.to} target="_blank" rel="noreferrer" aria-label={size === "icon-sm" ? `Open ${app.label} full page (opens in a new tab)` : undefined} onClick={() => {
				posthogCapture("example_full_page_opened", { example_id: app.id, entry_point: entryPoint });
				posthogLogger.info("example full page opened", { example_id: app.id, entry_point: entryPoint });
			}}>
				{size === "sm" && "Open full page"}
				<ExternalLink />
				{size === "sm" && <span className="sr-only">(opens {app.label} in a new tab)</span>}
			</a>
		</Button>
	);
}

function AppCard({ app, theme }: { app: App; theme: "light" | "dark" }) {
	return (
		<li className="group relative grid content-start gap-3 rounded-md border border-line bg-surface p-2 pb-4 shadow-card transition-colors duration-(--duration-fast) hover:border-line-strong">
			<div className="aspect-[16/10] overflow-hidden rounded-sm border border-line bg-surface-2">
				<img src={`/thumbs/${app.id}-${theme}.jpg`} alt="" loading="lazy" width={960} height={600} className="size-full object-cover object-top" />
			</div>
			<div className="grid gap-1 px-2">
				<div className="flex items-start justify-between gap-2">
					<h2 className="text-md font-semibold text-ink">
						<Link to={`/examples#${app.id}`} onClick={() => {
							posthogCapture("example_preview_opened", { example_id: app.id });
							posthogLogger.info("example preview opened", { example_id: app.id });
						}} className="rounded-xs outline-none after:absolute after:inset-0 after:rounded-md focus-visible:after:ring-3 focus-visible:after:ring-primary/30">
							{app.label}
						</Link>
						{isNew(`example:${app.id}`) && <><span className="sr-only">, </span><Badge className="ml-2 align-middle">New</Badge></>}
					</h2>
					<span className="relative z-10 -mt-1 -mr-1"><OpenFullPage app={app} entryPoint="gallery" size="icon-sm" /></span>
				</div>
				<p className="text-docs-sm text-ink-2">{app.description}</p>
				<p className="text-sm text-ink-3"><span className="sr-only">Shows: </span>{app.shows.join(" · ")}</p>
			</div>
		</li>
	);
}

function AppPreview({ app }: { app: App }) {
	const [viewport, setViewport] = useState<Viewport>("desktop");
	return (
		<section aria-labelledby={`${app.id}-title`}>
			<Link to="/examples" className="mb-4 inline-flex items-center gap-1.5 rounded-xs text-docs-sm font-medium text-primary-ink hover:underline">
				<ArrowLeft className="size-4" aria-hidden="true" />All example apps
			</Link>
			<div className="mb-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
				<div className="grid min-w-0 gap-1">
					<h1 id={`${app.id}-title`} className="text-2xl font-semibold text-ink">{app.label}</h1>
					<p className="text-docs-sm text-ink-2">{app.description}</p>
					<p className="text-sm text-ink-3">Shows {app.shows.join(", ")}</p>
				</div>
				<div className="flex items-center gap-2">
					<SegmentedControl value={viewport} onValueChange={(v) => setViewport(v as Viewport)} size="sm" aria-label={`Preview width for ${app.label}`} className="max-sm:hidden">
						<Segment value="desktop">Desktop</Segment>
						<Segment value="tablet">Tablet</Segment>
						<Segment value="phone">Phone</Segment>
					</SegmentedControl>
					<OpenFullPage app={app} entryPoint="preview" />
				</div>
			</div>
			<div className="overflow-hidden rounded-md border border-line bg-surface-2 bg-dots">
				<iframe
					key={app.id}
					src={app.to}
					title={`${app.label}, live example`}
					className={`mx-auto block h-180 w-full border-x border-line bg-bg transition-all duration-(--duration-base) ease-(--ease-out) max-md:h-150 ${WIDTH[viewport]} ${viewport === "desktop" ? "border-x-0" : ""}`}
				/>
			</div>
		</section>
	);
}

export function ExampleApps() {
	const { hash } = useLocation();
	const { resolved } = useTheme();
	const app = EXAMPLE_APPS.find((a) => `#${a.id}` === hash);
	useMeta(
		app ? `${app.label} · Example apps · TwoUX` : "Example apps · TwoUX",
		app ? app.description : "Full B2B screens built only from TwoUX components: workflows, agents, trading, data, operations, CRM, onboarding and hiring. Use them live, at any width.",
	);
	useEffect(() => { window.scrollTo({ top: 0 }); }, [hash]);
	return (
		<div className="mx-auto w-full max-w-7xl px-8 pt-10 pb-20 max-md:px-4 max-md:pt-8">
			{app ? (
				<AppPreview app={app} />
			) : (
				<>
					<PageHeader title="Example apps" summary={`${EXAMPLE_APPS.length} complete screens built only from @twoux/ui. Choose one to use it live at desktop, tablet or phone width, or open it on its own page.`} />
					<ul className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
						{EXAMPLE_APPS.map((a) => <AppCard key={a.id} app={a} theme={resolved} />)}
					</ul>
				</>
			)}
		</div>
	);
}
