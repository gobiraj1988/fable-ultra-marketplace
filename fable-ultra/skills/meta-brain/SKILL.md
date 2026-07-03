---
name: meta-brain
description: System S + O + R of fable-ultra V3 OMEGA — the META-BRAIN / AUTONOMY ENGINE / OPPORTUNITY SURVIVAL ENGINE. The always-watching supervisor that tracks system health (quality, speed, cost, accuracy, failure rate per agent/skill/model in memory/metrics.md), runs autonomous background/scheduled loops with mandatory termination, and gates opportunities through a research->validate->stress-test->paper-execute->monitor->score pipeline. Trigger phrases - "monitor the system", "watch this run", "supervise ultra-code", "run this autonomously", "set up a scheduled agent / cron / background task for this", "keep going until the goal is met", "track our quality/cost/failure metrics", "vet this opportunity", "should we promote this idea", "is this run stalling". Governed by omega-constitution (the 10 OMEGA Laws). It SUPERVISES and optimizes; it does NOT guarantee outcomes — it surfaces risk and STOPS on danger. Differs from self-upgrade (which edits SKILL.md files); meta-brain watches, schedules, and gates but does not modify skills — it feeds recommendations to self-upgrade. Defers to model-router for model choice and knowledge-lake for durable storage.
---

# Meta-Brain — Supervisor, Autonomy Engine, Opportunity Gate

Governed by `omega-constitution`. This skill watches, schedules, and gates. It never fabricates a
metric (Law 01), never claims a loop succeeded without evidence (Law 02), and STOPS on danger rather
than pushing through. Honest bound: it optimizes and surfaces risk — it does **not** guarantee any
outcome. All real-money or live actions are paper-mode-default and need human approval (Law 10).

## 1. Monitoring (System S)

Append **measured** rows only to `J:\fable 5\fable-ultra\memory\metrics.md`. Never invent a number;
if a value was not measured this run, write `n/a`. Row format (one line per run/agent/skill/model):

```
| 2026-07-03T14:12:03 | run_id | ultra-code | skill:qs-works | model:sonnet | quality:0.92 | speed_s:41 | cost_usd:0.08 | accuracy:0.90 | fail_rate:0.05 | notes:pass |
```

Append with PowerShell (create the header once if the file is new):

```powershell
# Escape any literal | and newlines in free-text fields so they can't corrupt the table.
function San($v) { "$v" -replace '\r?\n',' ' -replace '\|','\' }
$row = "| $(Get-Date -Format s) | $(San $rid) | $(San $agent) | $(San $skill) | $(San $model) | quality:$q | speed_s:$sp | cost_usd:$c | accuracy:$a | fail_rate:$f | notes:$(San $n) |"
Add-Content "J:\fable 5\fable-ultra\memory\metrics.md" $row
```

After N runs, read the table back, aggregate per skill/model, and emit **continuous-improvement
recommendations** (e.g. "skill:qs-works fail_rate 0.18 over 5 runs → tighten trigger"). Log each
recommendation to `memory/lessons.md` (one dated line) and promote vetted ones to the knowledge-lake
via the `knowledge-lake` skill. These recommendations are the INPUT to `self-upgrade` — meta-brain
does not edit skills itself.

## 2. Autonomy Engine (System O)

Run long work as background Tasks (`TaskCreate` / `TaskGet` / `TaskList` / `TaskStop`) or scheduled
agents (the `schedule` skill, or `CronCreate` / `mcp__scheduled-tasks__create_scheduled_task` if
available — if none is present, say so and STOP; do not fake a schedule). Track goal + progress in a
run-state file so work survives context resets:

```
# run-state.md
GOAL: <one sentence, measurable>
BUDGET: runs<=20 cost_usd<=5.00 wall_min<=60
PROGRESS: step 4/12 — <what is done, what remains>
LAST_RUN_ID: <id>   NEXT_ACTION: <concrete>
```

Recover a crashed/paused run by reading run-state.md and **starting a fresh** Task (`TaskCreate`) or
scheduled agent, seeded with `GOAL` + `LAST_RUN_ID` + `NEXT_ACTION` so it continues where it stopped.
(If a native resume-by-run-id tool is ever connected, use it; otherwise START A NEW RUN from
run-state.md — never assume a resume capability that is not present.)

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
or, if recovery is safe, relaunch a fresh Task from run-state.md's `LAST_RUN_ID` + `NEXT_ACTION` (see
System O). Do not silently retry more than once.

## 5. Honest limits

Meta-brain measures, schedules, gates, and recommends. It cannot guarantee a good outcome, predict
markets, or make an unsafe action safe. When uncertain it states the uncertainty (Law 03) and, when
a danger trigger fires, it STOPS rather than proceeding. Recommendations flow to `self-upgrade`
(skill edits) and `knowledge-lake` (durable, sourced storage); the running journal is `lessons.md`.
