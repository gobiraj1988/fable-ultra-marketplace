---
name: ai-os
description: The standing operating doctrine of fable-ultra as a practical AI Operating System — token-efficiency, model-routing, knowledge, research, agent, and factory rules, each mapped to the skill that enforces it. Load at the start of any substantial fable-ultra session, or when the user asks how the AI OS should operate, how to minimize token cost, or which skill handles what. Do NOT load for small single-file edits, quick one-off questions, or a task already routed to one specific skill (that skill's own rules suffice). It is the operating profile; it directs the other skills rather than building itself. Governed by omega-constitution.
---

# fable-ultra AI-OS — Operating Doctrine

**Mission:** continuously evolve into the strongest PRACTICAL AI operating system with MAXIMUM
REUSE and MINIMUM token cost. Not AGI — a reusable, verifiable build system. Any model
(Sonnet / Opus / Haiku / local) is an interchangeable reasoning engine; never depend on one.

## Rule -> enforcing skill (the map)

| Doctrine | Rule | Enforced by |
|---|---|---|
| TOKEN | search first; retrieve only relevant context; never dump whole knowledge bases | `knowledge-lake` (targeted Grep/RAG) + `ultra-code` (scoped reads) |
| TOKEN | cache aggressively; reuse prior results | Workflow `resumeFromRunId` + `workflow-factory` templates |
| TOKEN | store every lesson permanently | `memory/lessons.md` + `knowledge-lake` |
| ROUTING | simple -> cheapest capable model; complex -> strongest; verify -> independent verifier | `model-router` + `model-max` |
| TIER-CALIBRATION | match the discipline countermeasure to the tier's characteristic failure (discipline §0) | `model-max` step 0 + `model-router` overhead table |
| KNOWLEDGE | store every success, failure, lesson, benchmark, reusable workflow (with source) | `knowledge-lake` |
| RESEARCH | research before coding; verify before claiming; benchmark before promoting; reject unsupported | `research-council` + `algorithm-factory` + omega-constitution Laws 2/5 |
| AGENTS | create agents only when reusable; retire failing; promote successful; track performance | `agent-factory` + `meta-brain` |
| ALGORITHMS | generate/test/benchmark/compare/promote — only proven enter production | `algorithm-factory` |
| SOFTWARE | research/design/build/test/fix/retest/document/deploy | `software-build` + `ultra-code` |
| TRADING | paper default; backtest + stress test mandatory; human approval | `trading-bot` + `governance-core` |
| GOVERNANCE | budget + approval gates on expensive/irreversible actions | `governance-core` |
| VERIFY | doctrine claims are proven by execution, never asserted | discipline contract (below) |

## Verification rule

Doctrine claims are proven by execution, never asserted — run the test suite and guardian checks
before declaring anything **Verified**, recording `<command> -> exit <code> -> "<output>"`. The
full discipline contract (plan-first, evidence format, independent critique, $FU portable home)
is `$FU\knowledge\ai\fable5-discipline.md`; `$FU` resolves per its section 4 (env
`FABLE_ULTRA_HOME` -> legacy `J:\fable 5\fable-ultra` if present -> `%USERPROFILE%\.fable-ultra`).

## OS failure modes (rule for each)

| Failure mode | Rule |
|---|---|
| Routed to a too-weak model | Two verification failures at the routed tier -> `model-router` escalates one tier, logs the miss in `memory/metrics.md`. |
| Stale knowledge-lake entry | Older than 90 days or unsourced = UNVERIFIED — re-check before acting; flag for `knowledge-lake` audit. |
| Workflow resume mismatch | Before `resumeFromRunId`, compare stored goal/plan to the current goal; on mismatch start fresh — never splice states. |
| Lesson-log bloat | `memory/lessons.md` = one dated line per run, under ~200 lines; over that, promote durable items to `knowledge-lake`, delete the rest. |

## Token-efficiency operating procedure (apply every task)

1. Before building, SEARCH existing skills / knowledge / lessons — reuse beats regenerate.
2. Read only the lines you need; never re-read a just-edited file.
3. Delegate bulk search to subagents; keep conclusions, not file dumps.
4. Route by size — SMALL/KNOWN (≤3 files, known pattern) -> direct edit, ≤20k tokens total.
   WORKFLOW-WORTHY (≥4 files or genuine parallel/adversarial-verify need) -> per-stage budgets
   of PLAN ≤30k, BUILD ≤150k/stage, VERIFY ≤50k, REVIEW ≤50k; a stage exceeding 2x its budget
   stops and re-scopes (a full workflow costs 100k–900k tokens — spend it deliberately).
5. Cache: resume workflows; reuse `workflow-factory` templates instead of re-authoring.
6. After the task, append ONE lesson; promote any reusable artifact to a template or skill.

## Success definition

Accurate · Verified · Auditable · Reusable · Scalable · Maintainable · Grounded · token-efficient ·
continuously improving. Missing any one = not done; say so.
