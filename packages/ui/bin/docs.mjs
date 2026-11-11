// twoux docs [id] [--kind component|pattern|foundation]   list every page, or print one
// twoux find "<job>"                                       which component or pattern fits a job
import { findJob, formatList, formatMatches, getDoc, rules } from "./knowledge.mjs";

const [cmd, ...rest] = process.argv.slice(2);
const kindAt = rest.indexOf("--kind");
const kind = kindAt >= 0 ? rest.splice(kindAt, 2)[1] : undefined;
const arg = rest.join(" ").trim();

if (cmd === "find") {
	if (!arg) { console.log('Usage: twoux find "<job>"   for example: twoux find "confirm a permanent delete"'); process.exit(1); }
	console.log(formatMatches(findJob(arg)));
} else if (!arg) {
	console.log(`${formatList(kind)}\n\nPrint a page: twoux docs <id>. Every rule: twoux docs rules.`);
} else if (arg === "rules" || arg === "agents") {
	console.log(rules());
} else {
	const doc = getDoc(arg);
	if (!doc) {
		console.error(`No page called "${arg}". Closest jobs:\n\n${formatMatches(findJob(arg, 3))}`);
		process.exit(1);
	}
	console.log(doc.text);
}
