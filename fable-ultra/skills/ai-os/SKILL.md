---
name: ai-os
description: The standing operating doctrine of fable-ultra as a practical AI Operating System — token-efficiency, model-routing, knowledge, research, agent, and factory rules, each mapped to the skill that enforces it. Load at the start of any substantial fable-ultra session, or when the user asks how the AI OS should operate, how to minimize token cost, or which skill handles what. It is the operating profile; it directs the other skills rather than building itself. Governed by omega-constitution.
---

# fable-ultra AI-OS — Operating Doctrine

**Mission:** continuously evolve into the strongest PRACTICAL AI operating system with MAXIMUM
REUSE and MINIMUM token cost. Not AGI — a reusable, verifiable build system. Any model
(Fable 5 / Opus / Sonnet / Haiku / local) is an interchangeable reasoning engine; never depend
on one.

## Rule -> enforcing skill (the map)

| Doctrine | Rule | Enforced by |
|---|---|---|
| TOKEN | search first; retrieve only relevant context; never dump whole knowledge bases | `knowledge-lake` (targeted Grep/RAG) + `ultra-code` (scoped reads) |
| TOKEN | cache aggressively; reuse prior results | Workflow `resumeFromRunId` + `workflow-factory` templates |
| TOKEN | store every lesson permanently | `memory/lessons.md` + `knowledge-lake` |
| ROUTING | two dials: model tier AND reasoning effort — simple -> cheapest capable model at low effort; complex -> strongest (ceiling Fable 5); verify -> independent verifier at high effort | `model-router` + `model-max` |
| KNOWLEDGE | store every success, failure, lesson, benchmark, reusable workflow (with source) | `knowledge-lake` |
| RESEARCH | research before coding; verify before claiming; benchmark before promoting; reject unsupported | `research-council` + `algorithm-factory` + omega-constitution Laws 2/5 |
| AGENTS | create agents only when reusable; retire failing; promote successful; track performance | `agent-factory` + `meta-brain` |
| ALGORITHMS | generate/test/benchmark/compare/promote — only proven enter production | `algorithm-factory` |
| SOFTWARE | research/design/build/test/fix/retest/document/deploy | `software-build` + `ultra-code` |
| TRADING | paper default; backtest + stress test mandatory; human approval | `trading-bot` + `governance-core` |
| GOVERNANCE | budget + approval gates on expensive/irreversible actions | `governance-core` |

## Token-efficiency operating procedure (apply every task)

1. Before building, SEARCH existing skills / knowledge / lessons — reuse beats regenerate.
2. Read only the lines you need; never re-read a just-edited file.
3. Delegate bulk search to subagents; keep conclusions, not file dumps.
4. Prefer direct edits over multi-agent workflows for small/known work; reserve workflows for
   genuinely parallel or adversarial-verify needs. Inside a workflow, track real spend with the
   `budget` global (`total` / `spent()` / `remaining()` — a hard ceiling; `agent()` throws once
   exhausted) instead of guessing from static estimates.
5. Cache: resume workflows; reuse `workflow-factory` templates instead of re-authoring.
6. After the task, append ONE lesson; promote any reusable artifact to a template or skill.

## Success definition

Accurate · Verified · Auditable · Reusable · Scalable · Maintainable · Grounded · token-efficient ·
continuously improving. Missing any one = not done; say so.
