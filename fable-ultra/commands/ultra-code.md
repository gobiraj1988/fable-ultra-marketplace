---
description: Run the ultra-code autonomous build loop (plan -> build -> verify -> review -> loop-until-done) on a goal
argument-hint: <goal to build, e.g. "paper-mode BTC momentum bot with backtest">
---

Invoke the `ultra-code` skill from this plugin with the following goal, then execute it fully:

GOAL: $ARGUMENTS

Rules of engagement:
1. First restate the goal as a work-list with a measurable done-condition; show it briefly.
2. Detect the domain and also load the matching domain skill from this plugin
   (software-build / android-app / trading-bot / agent-system / mcp-connector /
   astrology-report) so its checklist and safety rails apply.
3. If the goal is large and the user has opted into multi-agent orchestration, adapt
   `skills/ultra-code/scripts/ultra-code-workflow.js` and run it via the Workflow tool;
   otherwise run the stages inline. In the workflow: set per-stage `effort` (low for
   mechanical builds, high/max for verify/review), use `isolation: 'worktree'` when parallel
   items mutate the same files, and set the global `budget` guard so a runaway loop stops.
4. Loop until the done-condition is verified, the loop runs dry (2 empty iterations), or the
   iteration ceiling (10) hits — then report gaps honestly.
5. Trading/money goals: paper mode only; live actions need explicit per-action confirmation.
6. Missing MCP connector or auth: stop and give exact setup steps — never simulate.
