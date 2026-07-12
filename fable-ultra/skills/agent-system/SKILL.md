---
name: agent-system
description: Multi-agent system builder on the Claude Agent SDK — orchestrators, research/paper-agent pipelines, self-improving loops with evals, memory, and tool use. Use when the user asks for an agent system, multi-agent pipeline, autonomous agents, "AGI system", self-upgrading agents, or paper/research agent swarms. Builds real, honest agent architectures — not literal AGI.
---

# Agent System Build

ROLE: Agent-systems engineer (Claude Agent SDK + MCP) building measurable, self-improving
multi-agent pipelines.

## Honesty boundary

"AGI" and "smarter than humans" are not buildable claims. What IS buildable: autonomous
multi-agent systems with planning, tool use, memory, self-evaluation, and improvement loops that
measurably raise task quality. Build that; state the boundary in the deliverable.

## Checklist

1. **Task decomposition** — what the system does, split into agent roles (planner, workers,
   verifier, critic). One clear responsibility per agent.
2. **Orchestration** — Claude Agent SDK; pipeline over barrier; structured-output schemas between
   stages; adversarial verification on claims (N refuters, majority vote). Subagents run in the
   background by default (`run_in_background: false` for sync); `SendMessage` continues a spawned
   agent with context intact — steer, don't relaunch.
3. **Model routing** — strongest tier for judge/verify stages (Fable 5, `model: 'fable'`, above
   Opus), Sonnet 5 for mid-tier work, Haiku 4.5 for mechanical stages; set per-agent `effort` to
   match; graceful degradation when a model is unavailable.
4. **Memory** — file-based or vector memory with explicit write/recall rules; convert relative
   dates to absolute; dedupe before writing.
5. **Self-improvement loop** — evals first: a scored benchmark for the system's task. Improvement
   = propose change -> run evals -> keep only if the score rises. No evals, no "self-upgrade"
   claims.
6. **Paper/research agents** — multi-modal search sweep -> deep-read -> adversarial fact-check ->
   cited synthesis; every claim traceable to a source.
7. **Safety** — hard iteration ceilings, budget guards (in Workflow runs the `budget` global is a
   hard ceiling — `agent()` throws when exhausted), kill switch, audit log, human gate on any
   irreversible/outward-facing action.

## MCP connectors

| Need              | Connector                                  |
|-------------------|---------------------------------------------|
| Web research      | Exa MCP / WebSearch / Apify actors          |
| Repo + CI         | GitHub (engineering plugin)                 |
| 9000+ app actions | Zapier MCP                                  |
| Docs/knowledge    | Notion / Linear (need auth)                 |

## Output

1. Architecture diagram (text/mermaid). 2. Agent role specs + prompts. 3. Orchestrator code
(Claude Agent SDK). 4. Eval harness + baseline scores. 5. Run instructions + safety notes.
