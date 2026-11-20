import { useMeta } from "../components/meta";
import { H2, OnThisPage } from "../components/docs";
import { PageHeader } from "./ComponentPage";

const p = "text-docs text-ink-prose";
const list = "grid list-disc gap-2 pl-6 text-docs text-ink-prose";
const link = "font-medium text-primary-ink hover:underline";

const SECTIONS = [
	{ id: "who", label: "Who is responsible" },
	{ id: "what", label: "What is collected" },
	{ id: "replay", label: "Session replay" },
	{ id: "storage", label: "Cookies and storage" },
	{ id: "why", label: "Why, and on what basis" },
	{ id: "where", label: "Where data goes and how long it stays" },
	{ id: "rights", label: "Your rights" },
	{ id: "changes", label: "Changes" },
];

/** The privacy notice for twoux.com: what the hosted site measures with PostHog, including session replay. */
export function Privacy() {
	useMeta("Privacy · TwoUX", "How twoux.com measures visits with PostHog, including session replay with every input masked, and how to ask for your data or object.");
	return (
		<div className="docs-cols pt-10 pb-20 max-md:pt-8">
			<div className="min-w-0">
				<PageHeader title="Privacy" summary="twoux.com measures how its pages are used, so the documentation can be improved. It sets no cookies, records sessions with every input masked, and keeps the data in the EU. This notice covers the website only; the TwoUX package and its command-line tool send nothing." />
				<article>
					<H2 id="who">Who is responsible</H2>
					<p className={p}>TwoUX is published by Dinosaurjoy Unipessoal, Lda., a company registered in Portugal, which is the controller of the data collected on twoux.com. Questions and requests go to <a href="mailto:hi@axdexpert.ai" className={link}>hi@axdexpert.ai</a>.</p>
					<address className={`${p} not-italic`}>Dinosaurjoy Unipessoal, Lda.<br />NIPC 515327751<br />Portugal</address>

					<H2 id="what">What is collected</H2>
					<p className={p}>When you visit twoux.com, PostHog records:</p>
					<ul className={list}>
						<li>The pages you open, the links and buttons you press, and how long the visit lasts</li>
						<li>Your browser, operating system, screen size and approximate location (country and city), derived from your IP address</li>
						<li>The page that sent you here, and any campaign tags in the address</li>
						<li>Page load times and errors the site hits in your browser</li>
					</ul>
					<p className={p}>No account, name or email address is collected. Visitors are not identified or followed across other websites.</p>

					<H2 id="replay">Session replay</H2>
					<p className={p}>Visits are recorded as session replays: a reconstruction of what the page showed and where you moved, scrolled and pressed. Replays are used to find pages that are confusing or broken.</p>
					<ul className={list}>
						<li>Everything typed into a field, including search, is masked and never recorded.</li>
						<li>A replay covers one visit. Reloading the page starts a new, unconnected replay.</li>
						<li>Replays are deleted automatically after 30 days.</li>
					</ul>

					<H2 id="storage">Cookies and storage</H2>
					<p className={p}>twoux.com sets no cookies and stores nothing in your browser for measurement. The PostHog script keeps its identifier in memory only, so it is gone when you close or reload the tab. The site does store display preferences in your browser, such as your theme and which sidebar sections are open, for you and not for measurement.</p>

					<H2 id="why">Why, and on what basis</H2>
					<p className={p}>The data is used only to understand which pages people read, where they get stuck and what breaks, so the documentation and the site can be improved. The legal basis is legitimate interest (GDPR Article 6(1)(f)). The data is never sold, used for advertising or used to train AI models.</p>

					<H2 id="where">Where data goes and how long it stays</H2>
					<ul className={list}>
						<li><strong className="font-semibold text-ink">PostHog</strong> processes the measurement data and replays on its EU Cloud, hosted in Frankfurt, Germany, under a data processing agreement.</li>
						<li><strong className="font-semibold text-ink">Hostinger</strong> hosts the website and keeps standard server logs of requests, including IP addresses.</li>
					</ul>
					<p className={p}>Replays are deleted after 30 days. Other measurement data is kept for as long as it is useful for improving the site, then deleted.</p>

					<H2 id="rights">Your rights</H2>
					<p className={p}>Under the GDPR you can ask to see, correct or delete data about you, ask for its processing to be restricted, or object to it. Email <a href="mailto:hi@axdexpert.ai" className={link}>hi@axdexpert.ai</a>. Because visits are not tied to a name, include the date and approximate time of your visit so it can be found.</p>
					<p className={p}>To stop measurement entirely, block scripts from posthog.com in your browser; the site works the same without them. You can also complain to the Portuguese data protection authority, the <a href="https://www.cnpd.pt" target="_blank" rel="noreferrer" className={link}>CNPD<span className="sr-only"> (opens in a new tab)</span></a>, or to the authority where you live.</p>

					<H2 id="changes">Changes</H2>
					<p className={p}>If what the site collects changes, this page changes first. Last updated 12 November 2026.</p>
				</article>
			</div>
			<OnThisPage items={SECTIONS} />
		</div>
	);
}
