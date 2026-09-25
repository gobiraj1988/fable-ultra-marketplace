---
name: agent-system
description: Multi-agent system builder on the Claude Agent SDK — orchestrators, research/paper-agent pipelines, self-improving loops with evals, memory, and tool use. Use when the user asks for an agent system, multi-agent pipeline, autonomous agents, "AGI system", self-upgrading agents, or paper/research agent swarms. Builds real, honest agent architectures — not literal AGI. Do NOT trigger for fable-ultra's own internal subagents (agent-factory), single AI products like a chatbot or RAG app (ai-builder), or reusable Workflow pipelines (workflow-factory).
---

# Agent System Build

ROLE: Agent-systems engineer (Claude Agent SDK + MCP) building measurable, self-improving
multi-agent pipelines. Discipline contract: `knowledge/ai/fable5-discipline.md` (plan-first,
one stage at a time, evidence format); governance via `omega-constitution` / `governance-core`.

## Honesty boundary

"AGI" and "smarter than humans" are not buildable claims. What IS buildable: autonomous
multi-agent systems with planning, tool use, memory, self-evaluation, and improvement loops that
measurably raise task quality. Build that; state the boundary in the deliverable.

## Staged build (each stage verified by execution before the next)

1. **DECOMPOSE** — what the system does, split into agent roles (planner, workers, verifier,
   critic), one clear responsibility per agent. Gate: role map + orchestration sketch shown
   before code.
2. **ORCHESTRATE** — Claude Agent SDK; pipeline over barrier; structured-output schemas between
   stages; adversarial verification on claims (N refuters, majority vote). Subagents run in the
   BACKGROUND by default (`run_in_background: false` when you need the result synchronously), and
   `SendMessage` continues an already-spawned agent with its context intact — steer, don't relaunch.
   Gate: the skeleton runs end-to-end on a toy task with real output quoted.
3. **ROUTE MODELS + EFFORT** — per `model-router` and the discipline doctrine's tier map. Make the
   effort axis concrete, never "high-ish": judge / verifier / refuter / critic seats run at
   `model: 'fable'` (Fable 5, the tier above Opus) with `effort: 'max'`; mid-tier reasoning at
   Sonnet 5 with `effort: 'medium'`; mechanical extraction/formatting at Haiku 4.5 with
   `effort: 'low'`. Parallel file-mutating workers additionally take `isolation: 'worktree'`.
   Graceful degradation when a model is unavailable — and say which tier actually ran (Law 03).
4. **MEMORY** — file-based or vector memory with explicit write/recall rules; convert relative
   dates to absolute; dedupe before writing.
5. **EVALS + SELF-IMPROVEMENT** — evals FIRST: a scored benchmark for the system's task.
   Improvement = propose change → run evals → keep only if the score rises. No evals, no
   "self-upgrade" claims.
6. **SAFETY** — hard iteration ceilings, budget guards (inside a Workflow run the `budget` global
   is a HARD ceiling — `agent()` throws when it is exhausted), kill switch, audit log, human gate on
   any irreversible/outward-facing action (Law 10).

## Failure modes → countermeasures

| Failure mode | Countermeasure |
|---|---|
| Runaway agent loop | Iteration ceiling + loop-until-dry + kill switch, tested by firing them |
| Schema drift between stages | Structured-output schemas validated at every boundary; a failed parse is a defect, not a warning |
| Eval overfitting / reward hacking | Held-out eval cases the improvement loop never sees; blind judge |
| Memory poisoning / stale recall | Provenance + date on every memory write; recall checks freshness |
| Cost blowout mid-run | Budget guard checked every round; governance-core cap on paid APIs |

## Verification (required before "done")

The orchestrator is RUN on a real (small) task and the eval harness is RUN to produce baseline
scores — both with command + exit code + output quoted. Shipped-as-code-only is not done. An
independent critic (a fresh subagent at `model: 'fable'` + `effort: 'max'`) reviews the architecture
against this checklist.

## MCP connectors

| Need              | Connector                                  |
|-------------------|---------------------------------------------|
| Web research      | Exa MCP / WebSearch / Apify actors          |
| Repo + CI         | GitHub (engineering plugin)                 |
| 9000+ app actions | Zapier MCP                                  |
| Docs/knowledge    | Notion / Linear (need auth)                 |

## Output

1. Architecture diagram (text/mermaid). 2. Agent role specs + prompts. 3. Orchestrator code
(Claude Agent SDK). 4. Eval harness + EXECUTED baseline scores. 5. Run instructions + safety notes.
