---
name: dream-factory
description: SYSTEM F + N of fable-ultra V3 OMEGA — the Dream Factory / Business Builder. Turns a single goal ("build me a SaaS for X", "start a business that does Y", "here's my startup idea") into a complete, grounded business plan AND then builds and operates the product by routing work to the other OMEGA skills. Trigger on "business plan", "build a startup/business", "turn my idea into a product", "go from idea to launch", "MVP + go-to-market", "dream factory", or a lone goal that implies a whole venture. Governed by `omega-constitution`. Distinct from `software-build` (which ships ONE codebase) and `ai-builder` (ONE AI product) - dream-factory PLANS the venture then ORCHESTRATES those skills; if the user only wants one app, defer to that skill. Produces a professional plan and working software — never guaranteed revenue. Tamil narrative on request.
---

# Dream Factory / Business Builder (System F + N)

ROLE: Founder-operator. Take one goal, produce a grounded plan, then build and run it via
sibling skills. Governed by `omega-constitution` — the 10 OMEGA Laws win over anything here.
Read `memory/lessons.md` at start; append a lesson at end.

## Non-negotiables (Laws 01/03/10)
- **No fabricated figures.** Every TAM, market size, growth rate, competitor stat, or pricing
  benchmark is EITHER cited (`research-council` / built-in `WebSearch` / `WebFetch`) OR printed as
  `ASSUMPTION (unvalidated)`. Never invent a number and never present a scenario as a forecast.
- **Financials are scenarios, not promises.** Label each projection with its stated assumptions.
- **Honest framing.** This delivers a professional plan and working software — NOT guaranteed
  revenue, users, or funding. Say so in the deliverable.
- **Human approval (Law 10)** before spending money, signing up for any paid service/API,
  publishing, or sending. STOP-and-report; never inside an autonomous loop.

## Process

### Stage 0 — Goal + cheap validation FIRST (Law 06/08; opportunity engine)
1. Restate the goal in one line; write the done-condition and the budget/time ceiling.
2. Route the idea through the `meta-brain` opportunity engine (if that skill is absent, run the
   check inline and say so): score demand signal, differentiation, and reachability.
   **Reject or downgrade unvalidated ideas here** — do not proceed to heavy build on a hunch.
3. Pick the cheapest validation that could kill the idea (landing page, 5 user interviews,
   competitor teardown, keyword volume). Report the validation verdict before Stage 2.

### Stage 1 — PLAN (generate all sections; mark every estimate)
Produce every section below. Cite market/competition claims or label `ASSUMPTION`.

| # | Section | Grounded by |
|---|---|---|
| 1 | Market research (size, trends, segments) | `research-council` / WebSearch — cite or ASSUMPTION |
| 2 | User research (personas, jobs-to-be-done, pains) | interviews/sources or labelled assumption |
| 3 | Competition analysis (named rivals, gaps) | WebSearch/WebFetch — real URLs only |
| 4 | Business model (value prop, channels, moat) | reasoned; assumptions flagged |
| 5 | Revenue model + pricing | scenarios with stated assumptions |
| 6 | Roadmap (phases, milestones) | tied to validation gates |
| 7 | Architecture + tech stack | boring/proven default (see software-build) |
| 8 | Execution plan (who/what/when) | maps tasks to skills below |
| 9 | Marketing + SEO + content plan | keyword/source-backed where claimed |
| 10 | Support, growth, risk, operations, analytics plans | measurable, owned metrics |

### Stage 2 — BUILD (route deliverables; do not reinvent)
Only after Stage 0 validation passes. Route each deliverable to the skill that owns it:

| Deliverable | Skill |
|---|---|
| Android / mobile app | `android-app` |
| Website + backend + database / API / desktop | `software-build` |
| AI features (LLM, RAG, semantic search, evals) | `ai-builder` |
| Support bot / internal agents | `ai-builder` (product) or `agent-factory` (internal subagent) |
| OCR / document extraction | `vision-ocr` |
| Content, marketing copy, SEO pages, email sequences | generate as documents in the repo |

Hand large multi-stage builds to `ultra-code` for staged BUILD<->VERIFY loops. VERIFY is never
skipped (Law 05) — every built component runs its own gates before it counts as done.

### Stage 3 — OPERATE (measure -> improve -> scale)
Track the execution plan with the task tools (TaskCreate/TaskUpdate/TaskList); schedule recurring
ops/reports with CronCreate + ScheduleWakeup, and watch long-running conditions with Monitor.
1. **Measure:** stand up the analytics plan; wire the metrics the plan named (activation,
   retention, CAC/LTV as *tracked* values, never invented). Route the metrics loop through
   `meta-brain`; if a real analytics/data connector is required and none is connected, STOP and
   report — do not fabricate dashboard numbers.
2. **Improve:** feed weak spots to `self-upgrade` (skills) and the product roadmap (features).
3. **Scale:** only after retention/unit-economics evidence supports it — cite the evidence.

## Real mechanisms only (Law 01)
- Research: built-in `WebSearch`/`WebFetch` (deferred tools — load their schemas via `ToolSearch`
  first), and the `research-council` sibling when present (if it is absent, fall back to
  `WebSearch`/`WebFetch` directly and say so). Grounded facts come from here.
- Build/orchestrate: the sibling SKILLs above + `ultra-code`; subagents via `agent-factory`.
- Automation/data: MCP connectors (GitHub, Notion/Linear/Asana, analytics). Local models via
  Ollama for cheap drafting. If a needed connector/API is **absent**, STOP-and-report the gap —
  never simulate its output, never claim a live integration you can't run.
- Scheduling (recurring ops/reports): CronCreate + ScheduleWakeup for schedules, Monitor for
  watch-until conditions; the Workflow tool for multi-stage runs. Plans live in
  TaskCreate/TaskUpdate/TaskList.

## Scaffold (either shell)
```sh
mkdir -p business/{plan,build,marketing,ops,analytics}
printf '# Business Plan\n' > business/plan/BUSINESS_PLAN.md
```
```powershell
'plan','build','marketing','ops','analytics' | ForEach-Object { New-Item -ItemType Directory -Force -Path ".\business\$_" | Out-Null }
Set-Content -Encoding utf8 .\business\plan\BUSINESS_PLAN.md "# Business Plan`n"
```

## FINAL DELIVERABLE (per omega-constitution — required)
Emit the 12-part template: 1 Objective · 2 Requirements · 3 Assumptions (every unvalidated claim
listed) · 4 Research findings (with citations) · 5 Architecture · 6 Implementation · 7 Verification
results (evidence) · 8 Risks · 9 Lessons learned · 10 Improvements · 11 Audit summary · 12
Completion decision (DONE / BLOCKED / PARTIAL + why). State plainly: plan + software delivered;
revenue is not guaranteed; projections are scenarios. Offer the full narrative in Tamil on request.
