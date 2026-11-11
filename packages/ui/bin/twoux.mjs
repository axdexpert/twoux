#!/usr/bin/env node
// twoux: TwoUX's command line. Run from your project root.
//   twoux init                              set up this project for AI agents (AGENTS.md, CLAUDE.md, guard, skills, MCP, theme, proposals)
//   twoux find "<job>"                      which component or pattern fits a job
//   twoux docs [id]                         list every page, or print one
//   twoux check [paths…] [--check-links]   lint app code and proposals against TwoUX's rules
//   twoux theme                             build twoux-theme.css from twoux.theme.json
//   twoux mcp                               MCP server over stdio, for agents that speak MCP
//   twoux guard                             Claude Code PreToolUse hook (reads the tool call on stdin)
const [cmd, ...rest] = process.argv.slice(2);
const run = { check: "./check.mjs", theme: "./theme.mjs", guard: "./guard.mjs", init: "./init.mjs", docs: "./docs.mjs", find: "./docs.mjs", mcp: "./mcp.mjs" }[cmd];
if (!run) {
	console.log(`Usage: twoux <command> [options]

  init [--force] [--principles]      set up this project for AI agents
  find "<job>"                       which component or pattern fits a job
  docs [id] [--kind <kind>]          list every page, or print one (docs rules: every rule)
  check [paths…] [--check-links]     lint app code against TwoUX's rules
  theme                              build twoux-theme.css from twoux.theme.json
  mcp                                MCP server over stdio
  guard                              Claude Code hook, run by init`);
	process.exit(cmd ? 1 : 0);
}
process.argv = [process.argv[0], run, ...(run === "./docs.mjs" ? [cmd] : []), ...rest];
await import(run);
