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

## Model-max + memory hooks (v5)

At the start of EVERY run: load this plugin's `model-max` skill and apply its MAX loop discipline
— this is what keeps quality high on any selected model tier (the shared contract lives in
`knowledge/ai/fable5-discipline.md`). model-max step 0 now **detects the active tier and loads the
tier-calibrated overlay** (discipline §0) for the whole run: Sonnet gets the fresh-re-run gate and
on-disk plan re-derivation each step; Opus gets the smallest-sufficient-design guard and re-run-
beats-reasoning; Fable/Haiku get their rows. Also read `$FU\memory\lessons.md` (fable-ultra home,
see discipline doctrine §4) and apply relevant lessons; append one dated lesson line after the run
ends. If `lessons.md` or the reference workflow script is missing, proceed without it and note
the absence — a missing memory file is never a reason to stop, and never a thing to fabricate.

**Resume-safe reconstruction (discipline §7).** After any context compaction, new session, or
`resumeFromRunId` mismatch, do NOT continue from conversational memory. Re-read the on-disk
`ultra-code-run.md` WORK STATE block, re-check its goal against the original, re-VERIFY the most
recent "done" item with a fresh run this turn, and only then continue BUILD. Splicing a remembered
plan onto a resumed run is the top Sonnet failure mode and is forbidden here.

## Stage model

Every ultra-code run has five stages. Adapt depth to the task; never skip VERIFY.

| Stage  | What happens                                                                | Exit criterion                          |
|--------|-----------------------------------------------------------------------------|-----------------------------------------|
| PLAN   | Decompose the goal into a concrete work-list with a measurable done-condition | Work-list + done-condition written down |
| BUILD  | Execute work items (fan out via Workflow `pipeline()` when items are independent) | Every work item attempted               |
| VERIFY | Run/tests/lint each artifact; adversarial verify for claims and findings      | Each item passes or has a named defect  |
| REVIEW | Cross-item review: integration, missed requirements, completeness critic      | No new defects found                    |
| LOOP   | Defects or unmet done-condition -> feed back into BUILD as new work items     | Done-condition met OR dry (see below)   |

Stage-gate rules (inline runs too, not just Workflow runs):

- **PLAN gates BUILD**: the work-list + done-condition are shown before any build step, and
  inline runs execute ONE work item at a time (model-max sizing: each item verifiable in one step).
- **VERIFY evidence format** (from the discipline doctrine): `<command> → exit <code> →
  "<observed output snippet>"`. Artifacts with no test harness get the strongest available check
  (compile/parse/render/lint) plus an explicit "not executed: <what and why>" note.
- **REVIEW independence**: the reviewer must not be the builder's context — in Workflow runs a
  separate critic agent; in inline runs a fresh subagent (Agent tool), or as a last resort a
  self-critique pass held to model-max's concrete-flaws standard.

## Termination — mandatory

Before starting, write the **done-condition** explicitly (e.g., "all endpoints implemented, tests
green, README complete"). The loop ends when:

1. The done-condition is met (verified, not assumed), **or**
2. **Loop-until-dry**: 2 consecutive LOOP iterations produce zero new work items, **or**
3. A hard iteration ceiling is hit (default 10) — then STOP and report remaining gaps honestly.

Never claim done without VERIFY evidence. If blocked (missing MCP connector, missing credential,
failing dependency), STOP and report exactly what the user must provide — never fake it.

**Loop pathologies — detect and break them before the ceiling does:**

- **Flaky VERIFY**: a verdict that flips between identical runs is nondeterminism, not progress.
  Re-run the identical check once; if pass/fail differs, mark the item FLAKY, make pinning the
  cause (time, ordering, network, randomness, mid-write reads) its own work item, and never
  count a flaky pass as VERIFY evidence.
- **Oscillating fix-break**: if fixing item A breaks item B and a later iteration reverses the
  same change (same file/test flipping direction across 2 iterations), stop treating them as
  independent — merge A+B into ONE work item with a joint done-condition and solve together.
- **Review inflation**: REVIEW may only add work items that trace to the done-condition. If two
  consecutive REVIEW passes add items while the done-condition is already met, the loop is
  padding — declare done and list the extras as optional follow-ups, not work items.
- **Premature done (carried-evidence)**: REVIEW may NOT declare the done-condition met by citing
  evidence from an earlier iteration. Every item that closes the done-condition must be re-verified
  with a fresh run THIS iteration (discipline §5). A "we already showed X passes two iterations ago"
  verdict is a Sonnet-style premature-done — re-run it this iteration, or the loop is not done.

## Orchestration rules (Workflow tool)

- Explicit user opt-in is required for multi-agent Workflow runs ("ultracode", "run a workflow",
  or invoking this skill counts). Otherwise run the stages inline yourself.
- Default to `pipeline()` — no barrier between stages; item A verifies while item B still builds.
  Use `parallel()` barriers ONLY when a stage genuinely needs all prior results (dedup, early-exit).
- Use `schema` on every `agent()` call that returns data — structured output, no parse overhead.
- Use `resumeFromRunId` when re-running after an edit: unchanged agent() calls return cached
  results instantly (~100% cache hit for identical prefix). `journal.jsonl` in the run's
  transcript dir records each agent's actual return value — read it before diagnosing a weird
  result, instead of re-running the whole pipeline to see what a stage returned.
- Budget-aware loops: when the user sets a token target, guard with
  `while (budget.total && budget.remaining() > 50_000)`, and log `budget.spent()` once per
  iteration so the ceiling never arrives as a surprise. Without a target, use the iteration
  ceiling instead — never an unguarded `while (true)`.
- Route BOTH quality dials per stage (see `model-router`): `model` (`'haiku'|'sonnet'|'opus'|
  'fable'`) AND `effort` (`'low'|'medium'|'high'|'xhigh'|'max'`). Mechanical BUILD items run cheap
  at `effort: 'low'`; PLAN/VERIFY/REVIEW get `'high'` or better (ceiling: `model: 'fable'` at
  `effort: 'max'`). Omit `model:` to inherit the session model when unsure.
- When parallel BUILD items mutate the SAME files, give those agents `isolation: 'worktree'`
  (a fresh git worktree each — expensive, so only when they would genuinely conflict).
- Reuse registered subagent types via `agentType` instead of re-describing the same role in a
  prompt every stage.
- Saved pipelines can run as sub-steps via `workflow(nameOrRef, args)` — **one level of nesting
  only**; reuse `workflow-factory` templates instead of re-authoring stages.
- Determinism: `Date.now()`, `Math.random()`, and argless `new Date()` THROW inside a workflow
  script (they would break resume replay) — pass timestamps and seeds in through `args`.
- Fan-out caps: 4096 items per `pipeline()`/`parallel()` call, ~16 concurrent agents
  (`min(16, cores-2)`), 1000 agents per run lifetime. Chunk anything larger; a run that would
  exceed the lifetime cap needs re-scoping, not a bigger loop.
- A reference workflow script lives at `scripts/ultra-code-workflow.js` in this skill — adapt its
  stage prompts and schemas to the actual task; don't run it verbatim. If it is missing in this
  install, author the script fresh from the stage model above.

## Token-efficiency engine

- **Pacing**: don't pace off a remembered cache TTL (it varies by surface) — match the wait to
  what you are actually waiting for. One ~480s check beats eight 60s polls for an ~8-minute CI
  run; use 1200s+ fallback heartbeats when something else is the real wake signal.
- **Scoped reads**: read only the lines you need from large files; never re-read a file you just
  edited (Edit/Write already errored if it failed).
- **Delegate bulk search**: fan file-sweeps out to Explore/general-purpose subagents so the main
  context stays lean; keep conclusions, not file dumps.
- **No redundant polling**: harness-tracked background work re-invokes you when done — don't poll.
- **No silent caps**: if you bound coverage (top-N, sampling), say what was dropped.

## Continuous operation

- Within a session: `/loop` with self-pacing (ScheduleWakeup) keeps iterating; size each delay to
  the thing being waited on, with 1200s+ fallback heartbeats for untracked work.
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
