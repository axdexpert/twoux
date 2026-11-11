// Claude Code PreToolUse hook: stops agents editing TwoUX itself during app work.
// Allowed: the theme file (twoux.theme.json in an app, packages/ui/theme.json in the TwoUX repo). Maintainers: TWOUX_MAINTAINER=1.
let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
	if (process.env.TWOUX_MAINTAINER === "1") process.exit(0);
	let input = {};
	try { input = JSON.parse(raw); } catch { process.exit(0); }
	const tool = input.tool_name ?? "";
	const ti = input.tool_input ?? {};
	const PROTECTED = /(^|\/)(packages\/ui\/(src|registry)\/|node_modules\/@twoux\/)/;
	const ALLOWED = /packages\/ui\/theme\.json$/;
	let target = "";
	if (/^(Edit|Write|MultiEdit|NotebookEdit)$/.test(tool)) target = ti.file_path ?? ti.notebook_path ?? "";
	else if (tool === "Bash") {
		const cmd = ti.command ?? "";
		if (/(sed\s+-i|perl\s+-[a-z]*i|>\s*\S|\btee\b|\bmv\b|\bcp\b|\brm\b|\btruncate\b|writeFile)/.test(cmd)) target = (cmd.match(/\S*(packages\/ui\/(src|registry)\/|node_modules\/@twoux\/)\S*/) ?? [""])[0];
	}
	if (!target || ALLOWED.test(target) || !PROTECTED.test(target)) process.exit(0);
	process.stderr.write(
		`Blocked: ${target} is part of TwoUX (@twoux/ui), which app work must not change.\n` +
			"- To change colours, corners or font for the whole product: edit twoux.theme.json (in the TwoUX repo: packages/ui/theme.json) and run twoux theme.\n" +
			"- To change a component's behaviour: use its props or compose it in app code.\n" +
			"- If TwoUX is missing something: use the closest component and tell the person what is missing.\n",
	);
	process.exit(2);
});
