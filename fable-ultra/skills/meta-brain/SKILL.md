---
name: meta-brain
description: System S+O+R of fable-ultra - the META-BRAIN / AUTONOMY / OPPORTUNITY-SURVIVAL supervisor. Tracks system health (quality, speed, cost, accuracy, failure rate per agent/skill/model in memory/metrics.md), runs autonomous background/scheduled loops with mandatory termination, and gates opportunities through research-validate-stress-test-paper-execute-monitor-score. Trigger phrases - 'monitor the system', 'watch or supervise this run', 'run this autonomously', 'set up a scheduled/cron/background agent', 'keep going until the goal is met', 'track our quality/cost/failure metrics', 'vet this opportunity', 'is this run stalling'. Governed by omega-constitution. It supervises and optimizes but does NOT guarantee outcomes - it surfaces risk and STOPS on danger. Differs from self-upgrade (which edits skills) - meta-brain only watches, schedules, and gates, feeding recommendations to self-upgrade. Do NOT trigger for - one-off metric questions, editing skills (use self-upgrade), or plain research with no gate.
---

# Meta-Brain — Supervisor, Autonomy Engine, Opportunity Gate

Governed by `omega-constitution`. This skill watches, schedules, and gates. It never fabricates a
metric (Law 01), never claims a loop succeeded without evidence (Law 02), and STOPS on danger rather
than pushing through. Honest bound: it optimizes and surfaces risk — it does **not** guarantee any
outcome. All real-money or live actions are paper-mode-default and need human approval (Law 10).

Process discipline (plan-first, verify-by-execution evidence format `<command> -> exit <code> -> "<output>"`,
independent critique, the `$FU` portable home) follows the shared contract in
`knowledge/ai/fable5-discipline.md` — apply it, do not restate it. `$FU` resolves per its doctrine
section 4 (env `FABLE_ULTRA_HOME` -> legacy `J:\fable 5\fable-ultra` if present -> `%USERPROFILE%\.fable-ultra`).
PowerShell (5.1-safe — use `if/else`, never the PS7-only null-coalescing operator):
`$FU = if ($env:FABLE_ULTRA_HOME) { $env:FABLE_ULTRA_HOME } elseif (Test-Path 'J:\fable 5\fable-ultra') { 'J:\fable 5\fable-ultra' } else { Join-Path $env:USERPROFILE '.fable-ultra' }`.
POSIX (Linux/macOS, incl. remote containers): `FU="${FABLE_ULTRA_HOME:-${CLAUDE_PLUGIN_ROOT:-$HOME/.fable-ultra}}"`.

## 1. Monitoring (System S)

Append **measured** rows only to `$FU\memory\metrics.md`. Never invent a number;
if a value was not measured this run, write `n/a`. Row format (one line per run/agent/skill/model):

```
| 2026-07-03T14:12:03 | run_id | ultra-code | skill:qs-works | model:sonnet | quality:0.92 | speed_s:41 | cost_usd:0.08 | accuracy:0.90 | fail_rate:0.05 | notes:pass |
```

Append with PowerShell (create the header once if the file is new):

```powershell
# Escape any literal | and newlines in free-text fields so they can't corrupt the table.
function San($v) { "$v" -replace '\r?\n',' ' -replace '\|','\' }
$row = "| $(Get-Date -Format s) | $(San $rid) | $(San $agent) | $(San $skill) | $(San $model) | quality:$q | speed_s:$sp | cost_usd:$c | accuracy:$a | fail_rate:$f | notes:$(San $n) |"
Add-Content "$FU\memory\metrics.md" $row
# Read-back check - the row is NOT "logged" until this passes (11 fields = 13 split parts).
$last = Get-Content "$FU\memory\metrics.md" -Tail 1
if (($last -split '\|').Count -ne 13) { throw "metrics.md row malformed - repair before claiming logged" }
```

POSIX equivalent (same sanitize, same append, same read-back check — the row is not "logged" until
the check passes):

```bash
san() { printf '%s' "$1" | tr -d '\r\n' | tr '|' '\\'; }
row="| $(date -u +%Y-%m-%dT%H:%M:%S) | $(san "$rid") | $(san "$agent") | $(san "$skill") | $(san "$model") | quality:$q | speed_s:$sp | cost_usd:$c | accuracy:$a | fail_rate:$f | notes:$(san "$n") |"
printf '%s\n' "$row" >> "$FU/memory/metrics.md"
[ "$(tail -1 "$FU/memory/metrics.md" | awk -F'|' '{print NF}')" = "13" ] || echo "metrics.md row malformed - repair before claiming logged"
```

Only after the read-back check passes may you report the row as logged, citing the check itself as
evidence in the discipline format.

After N runs, read the table back, aggregate per skill/model, and emit **continuous-improvement
recommendations** (e.g. "skill:qs-works fail_rate 0.18 over 5 runs → tighten trigger"). Log each
recommendation to `memory/lessons.md` (one dated line) and promote vetted ones to the knowledge-lake
via the `knowledge-lake` skill. These recommendations are the INPUT to `self-upgrade` — meta-brain
does not edit skills itself.

## 2. Autonomy Engine (System O)

Run long work as background Tasks (`TaskCreate` / `TaskUpdate` / `TaskGet` / `TaskList` /
`TaskOutput` / `TaskStop`) or scheduled agents (the `schedule` skill, or the real `CronCreate` /
`CronList` / `CronDelete`, `ScheduleWakeup`, `Monitor` tools if available — if none is present, say so
and STOP; do not fake a schedule, and do not name a scheduling tool you have not seen in this
session). Track goal + progress in a run-state file so work survives context resets:

```
# run-state.md
GOAL: <one sentence, measurable>
BUDGET: runs<=20 cost_usd<=5.00 wall_min<=60
PROGRESS: step 4/12 — <what is done, what remains>
LAST_RUN_ID: <id>   NEXT_ACTION: <concrete>
```

Recovery, cheapest path first:
- A Workflow run resumes NATIVELY — `Workflow({scriptPath, resumeFromRunId})` with `LAST_RUN_ID` from
  run-state.md replays cached results for the unchanged `agent()` prefix (from that run's
  `journal.jsonl`), so only changed/new stages re-run. Resume EXISTS; use it before relaunching.
- A background agent that is still alive needs no relaunch at all — steer it with `SendMessage`
  (its context stays intact) and re-check with `TaskOutput`; keep its record current via `TaskUpdate`.
- Only for non-Workflow work with no live agent do you **start fresh** (`TaskCreate`) or re-schedule,
  seeded with `GOAL` + `LAST_RUN_ID` + `NEXT_ACTION` so it continues where it stopped.

**Done-condition contract.** `GOAL` must be measurable and paired with a named evidence artifact,
recorded in run-state.md as `DONE_EVIDENCE`. Example — GOAL "all qs-works regression tests pass";
DONE_EVIDENCE `pytest tests/ -q -> exit 0 -> "12 passed"`. "Goal complete" in the stop table means
that artifact exists and matches the GOAL — "looks done" or a vague GOAL ("improve quality") is
never accepted; rewrite it measurable before starting the loop (Law 02).

**TERMINATION LOGIC is mandatory — never an unbounded loop.** Before every iteration, check the
stop table; halt on the FIRST hit:

| Stop trigger | Check | Action |
|---|---|---|
| Goal complete | done-condition holds, with evidence | Stop, report DONE |
| Budget exhausted | runs/cost/wall exceed the budget guard | Stop, report PARTIAL + remaining |
| Approval needed | next step is irreversible (Law 10) | Pause, ask the human |
| Safety triggered | fail_rate spike, repeated identical error, unsafe action | Stop, report BLOCKED |
| User stops | user says stop / cancels the Task | `TaskStop`, report state |

Write the stop reason to run-state.md and `lessons.md` every time.

## 3. Opportunity Survival Engine (System R)

Only **validated** opportunities proceed. Run the pipeline in order; a stage that fails ejects the
opportunity (log why to knowledge-lake + lessons):

1. **Research** — gather sources via `WebSearch` / `WebFetch` (or an Exa/Apify MCP if connected;
   if no search connector is reachable, say so and STOP — do not invent findings).
2. **Validate** — check the claim against knowledge-lake rules and independent sources.
3. **Stress-test** — adversarial checks, edge cases, downside/worst-case scenario.
4. **Paper-execute** — simulate only. Real money / live action is paper-mode-default (Law 10).
5. **Monitor** — track the paper run's metrics in metrics.md over a defined window.
6. **Score** — apply the rubric below.
7. **Approve/promote or reject** — promotion to any live/real-money action requires an explicit
   human confirmation, per-action, never inside the autonomous loop.

**Orchestration.** Run stages 1–6 as Workflow-tool subagents (sequential, one per stage) where the
Workflow/Task tools are available; otherwise run them inline in the same order. Each subagent must
return a structured output — `{stage, verdict PASS|FAIL, evidence[] (discipline format), score_inputs}`
— and the supervisor advances only on a parsed PASS; a missing or malformed structured output IS a
FAIL and ejects the opportunity. Stage 7 always goes to the human, never to a subagent.

### Scoring rubric (0–5 each; promote only if total ≥ 18/25 AND no dimension is 0)

| Dimension | 0 | 3 | 5 |
|---|---|---|---|
| Evidence quality | anecdotal | 2+ sources | independently verified |
| Validated edge | none/negative | plausible | measured in paper run |
| Downside risk | ruinous/unbounded | bounded, tolerable | bounded + hedged |
| Robustness | fails a stress test | survives base cases | survives adversarial |
| Reversibility | irreversible | recoverable | fully reversible |

A 0 in any dimension is an automatic reject regardless of total.

## 4. Supervising an ultra-code run

When `ultra-code` is running, read its `ultra-code-run.md` (progress log) on an interval (via the
`loop` skill or a scheduled check). Flag a **stall** when any hold:

- No progress-line change across two consecutive checks.
- The same error string repeats ≥ 2 times.
- fail_rate in metrics.md rises run-over-run, or cost/wall exceeds the budget guard.

On a stall: record it in metrics.md (`notes:stall`), append a lesson, and either pause for the human
or, if recovery is safe, recover by the System O order — `SendMessage` to steer the live agent, else
`Workflow({scriptPath, resumeFromRunId})` with `LAST_RUN_ID`, and only then a fresh Task seeded with
`NEXT_ACTION`. Do not silently retry more than once.

## 5. Honest limits

Meta-brain measures, schedules, gates, and recommends. It cannot guarantee a good outcome, predict
markets, or make an unsafe action safe. When uncertain it states the uncertainty (Law 03) and, when
a danger trigger fires, it STOPS rather than proceeding. Recommendations flow to `self-upgrade`
(skill edits) and `knowledge-lake` (durable, sourced storage); the running journal is `lessons.md`.
