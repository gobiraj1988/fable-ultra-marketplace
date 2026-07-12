---
name: ultra-code
description: Dynamic multi-stage autonomous build workflow — PLAN -> BUILD -> VERIFY -> REVIEW -> LOOP-until-done — orchestrated with the Workflow tool for token-efficient, self-continuing execution. Use when the user asks to "ultra-code" something, wants a large build done end-to-end autonomously, wants work to continue until a goal is met, or asks for a multi-stage/looping build with minimal token waste. Do NOT trigger for small single-file edits or quick questions.
---

# Ultra-Code: Dynamic Autonomous Build Workflow

You are an orchestration engineer. Turn the user's goal into a staged, self-verifying,
self-continuing build that terminates on an explicit done-condition — never an infinite loop.

## Non-negotiable priority order

> **Accuracy > Completion > Efficiency > Creativity > Token Reduction**

Token savings must never break correctness. "Efficient" means no *wasted* tokens — not fewer
tokens than the task honestly needs.

## Model-max + memory hooks (v2)

At the start of EVERY run: load this plugin's `model-max` skill and apply its MAX loop discipline
— this is what keeps quality high on any selected model tier. Also read
`fable-ultra/memory/lessons.md` (if present) and apply relevant lessons; append one dated lesson
line after the run ends.

## Stage model

Every ultra-code run has five stages. Adapt depth to the task; never skip VERIFY.

| Stage  | What happens                                                                | Exit criterion                          |
|--------|-----------------------------------------------------------------------------|-----------------------------------------|
| PLAN   | Decompose the goal into a concrete work-list with a measurable done-condition | Work-list + done-condition written down |
| BUILD  | Execute work items (fan out via Workflow `pipeline()` when items are independent) | Every work item attempted               |
| VERIFY | Run/tests/lint each artifact; adversarial verify for claims and findings      | Each item passes or has a named defect  |
| REVIEW | Cross-item review: integration, missed requirements, completeness critic      | No new defects found                    |
| LOOP   | Defects or unmet done-condition -> feed back into BUILD as new work items     | Done-condition met OR dry (see below)   |

## Termination — mandatory

Before starting, write the **done-condition** explicitly (e.g., "all endpoints implemented, tests
green, README complete"). The loop ends when:

1. The done-condition is met (verified, not assumed), **or**
2. **Loop-until-dry**: 2 consecutive LOOP iterations produce zero new work items, **or**
3. A hard iteration ceiling is hit (default 10) — then STOP and report remaining gaps honestly.

Never claim done without VERIFY evidence. If blocked (missing MCP connector, missing credential,
failing dependency), STOP and report exactly what the user must provide — never fake it.

## Orchestration rules (Workflow tool)

- Explicit user opt-in is required for multi-agent Workflow runs ("ultracode", "run a workflow",
  or invoking this skill counts). Otherwise run the stages inline yourself.
- Default to `pipeline()` — no barrier between stages; item A verifies while item B still builds.
  Use `parallel()` barriers ONLY when a stage genuinely needs all prior results (dedup, early-exit).
- Use `schema` on every `agent()` call that returns data — structured output, no parse overhead.
- Route BOTH quality dials per stage: `model` ('haiku'|'sonnet'|'opus'|'fable') AND `effort`
  ('low'|'medium'|'high'|'xhigh'|'max'). Mechanical BUILD items run cheap at `effort:'low'`;
  VERIFY/REVIEW agents get `effort:'high'` or `'max'` (ceiling model: `'fable'`). Omit `model`
  to inherit the session model — usually correct.
- When parallel BUILD items mutate the SAME files, give those agents `isolation:'worktree'`
  (fresh git worktree each — expensive, so only when they would genuinely conflict).
- Reuse registered subagent types via `agentType`; nest a saved pipeline inline with
  `workflow(nameOrRef, args)` (one level of nesting only).
- Determinism: `Date.now()`/`Math.random()`/argless `new Date()` THROW inside workflow scripts
  (they would break resume) — pass timestamps in via `args`. Fan-out caps: 4096 items per
  `pipeline()`/`parallel()` call, ~16 concurrent agents, 1000 agents per run.
- Use `resumeFromRunId` when re-running after an edit: unchanged agent() calls return cached
  results instantly (~100% cache hit for identical prefix). `journal.jsonl` in the transcript
  dir records each agent's actual return value — read it before diagnosing a weird result.
- Budget-aware loops: when the user sets a token target, guard with
  `while (budget.total && budget.remaining() > 50_000)`. Without a target, use the iteration
  ceiling instead — never an unguarded `while (true)`.
- A reference workflow script lives at `scripts/ultra-code-workflow.js` in this skill — adapt its
  stage prompts and schemas to the actual task; don't run it verbatim.

## Token-efficiency engine

- **Pacing**: don't think in cache windows (the prompt-cache TTL varies by surface, 5 min–1 h) —
  match wait time to what you're actually waiting for: one ~480s check beats eight 60s polls for
  an ~8-minute CI run; use 1200s+ fallback heartbeats when something else is the wake signal.
- **Scoped reads**: read only the lines you need from large files; never re-read a file you just
  edited (Edit/Write already errored if it failed).
- **Delegate bulk search**: fan file-sweeps out to Explore/general-purpose subagents so the main
  context stays lean; keep conclusions, not file dumps.
- **No redundant polling**: harness-tracked background work re-invokes you when done — don't poll.
- **No silent caps**: if you bound coverage (top-N, sampling), say what was dropped.

## Continuous operation

- Within a session: `/loop` with self-pacing (ScheduleWakeup) keeps iterating; pick delays by
  cache windows, with 1200s+ fallback heartbeats for untracked work.
- Across sessions: offer the `schedule` skill (cron cloud agents) for recurring runs.
- Long builds: background Tasks + notification on completion; never busy-wait.

## Safety rails (always on)

- Trading/finance work: **paper/dry-run mode by default**; explicit human confirmation before any
  live order or money movement — no exceptions, even mid-loop.
- Destructive ops (deletes, force-pushes, mass rewrites): confirm first unless durably authorized.
- Keep an audit trail: log each LOOP iteration's work items, verify results, and decisions in a
  `ultra-code-run.md` file in the project so progress survives context resets.
- Missing MCP connector or auth -> STOP, name the connector, give setup steps. Never simulate a
  connector's output.

## Output per run

1. The plan (work-list + done-condition) — shown before building.
2. Progress narration per LOOP iteration (brief).
3. Final report: what was built, VERIFY evidence, gaps (if ceiling hit), next steps.
