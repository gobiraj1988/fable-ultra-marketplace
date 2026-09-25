---
name: dream-factory
description: SYSTEM F + N of fable-ultra V3 OMEGA — the Dream Factory / Business Builder. Turns a single goal ("build me a SaaS for X", "start a business that does Y", "here's my startup idea") into a complete, grounded business plan AND then builds and operates the product by routing work to the other OMEGA skills. Trigger on "business plan", "build a startup/business", "turn my idea into a product", "go from idea to launch", "MVP + go-to-market", "dream factory", or a lone goal that implies a whole venture. Governed by `omega-constitution`. Distinct from `software-build` (which ships ONE codebase) and `ai-builder` (ONE AI product) - dream-factory PLANS the venture then ORCHESTRATES those skills; if the user only wants one app, defer to that skill. Produces a professional plan and working software — never guaranteed revenue. Tamil narrative on request.
---

# Dream Factory / Business Builder (System F + N)

ROLE: Founder-operator. Take one goal, produce a grounded plan, then build and run it via
sibling skills. Governed by `omega-constitution` — the 10 OMEGA Laws win over anything here.
Read `memory/lessons.md` at start; append a lesson at end.
Shared discipline contract — `$FU\knowledge\ai\fable5-discipline.md` (plan-first, evidence
format `<command> -> exit <code> -> "<output>"`, independent critique, portable $FU home)
applies to every stage; do not restate it, follow it. `$FU` resolves per discipline doctrine
section 4 - env `FABLE_ULTRA_HOME` -> legacy home if present -> `%USERPROFILE%\.fable-ultra` on
Windows / `$HOME/.fable-ultra` on Linux/macOS; §4 carries both the PowerShell 5.1-safe and the
POSIX resolution, so run the one this session's shell supports.

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
1. Restate the goal in one line; write the done-condition and the budget/time ceiling
   (see Budget mechanics below — record the per-stage ceilings now).
2. Route the idea through the `meta-brain` opportunity engine (if that skill is absent, run the
   check inline and say so): score demand signal, differentiation, and reachability.
3. Pick the cheapest validation that could kill the idea (landing page, 5 user interviews,
   competitor teardown, keyword volume). Report the validation verdict before Stage 2.
4. **Rejection thresholds (hard kills — REJECT, do not proceed to Stage 1):**
   - Zero cited demand evidence after 3 distinct searches (no keyword volume, no forum/community
     pain threads, no paying competitor) -> KILL as "no demand signal".
   - >=3 funded/established competitors found AND no stated differentiation that survives one
     critique pass -> KILL as "undifferentiated".
   - Estimated cheapest-MVP cost exceeds the user's stated budget ceiling -> KILL as "unaffordable".
   - Validation experiment ran and returned negative (e.g. landing page <2% signup, 0/5 interviews
     confirm the pain) -> KILL; a hunch never overrides a run experiment.
   Anything short of a kill but weak on one axis = DOWNGRADE - plan-only deliverable, no build.

### Stage 1 — PLAN (one section at a time; mark every estimate)
Generate the 10 sections below **strictly one at a time, in order**. After EACH section:
write it to `business\plan\BUSINESS_PLAN.md`, run the checkpoint (every figure cited with a
real URL or labelled `ASSUMPTION (unvalidated)`; section actually answers its header; stays
inside remaining budget), and print `CHECKPOINT n/10 PASS|FAIL` before starting the next.
A FAIL blocks progression — fix the section; never batch-generate the remainder to save tokens.

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

### Stage 2.5 — VERIFY (dream-factory executes these itself; Law 05)
Delegated gates do not discharge this stage. Before declaring Stage 2 done, run and record
each check in the discipline evidence format `<command> -> exit <code> -> "<output>"`:
1. **Tests:** run the built product's test command (e.g. `pytest -q` / `npm test`) yourself;
   exit 0 required.
2. **Plan loads:** `Get-Content .\business\plan\BUSINESS_PLAN.md | Measure-Object -Line`
   (PowerShell) or `wc -l business/plan/BUSINESS_PLAN.md` (POSIX) — file exists, non-empty,
   all 10 CHECKPOINT lines present.
3. **Citations resolve:** extract every URL cited in the plan and `WebFetch` each (load its schema
   via `ToolSearch` first; `curl -sI <url>` / `Invoke-WebRequest -Method Head` is the shell
   fallback); any dead/unreachable citation is re-sourced or demoted to
   `ASSUMPTION (unvalidated)` before proceeding.
A failed check = Stage 2 NOT done; report the failing evidence line, do not paraphrase it away.

### Stage 3 — OPERATE (measure -> improve -> scale)
Track the execution plan with the task tools (`TaskCreate` / `TaskUpdate` / `TaskList`); schedule
recurring ops and reports with `CronCreate` (+ `CronList` / `CronDelete`) or `ScheduleWakeup`, and
watch a long-running condition with `Monitor` instead of busy-waiting.
1. **Measure:** stand up the analytics plan; wire the metrics the plan named (activation,
   retention, CAC/LTV as *tracked* values, never invented). Route the metrics loop through
   `meta-brain`; if a real analytics/data connector is required and none is connected, STOP and
   report — do not fabricate dashboard numbers.
2. **Improve:** feed weak spots to `self-upgrade` (skills) and the product roadmap (features).
3. **Scale:** only after retention/unit-economics evidence supports it — cite the evidence.

## Budget mechanics (set in Stage 0, enforced every stage)
- Split the user's total ceiling across stages and write it down in Stage 0 — default split:
  Stage 0 5% · Stage 1 20% · Stage 2 60% · Stage 2.5 5% · Stage 3 10% (tokens and money alike;
  money additionally needs Law 10 approval per spend).
- Track running spend against the active ceiling at each checkpoint/loop iteration.
- **On hitting a ceiling mid-build:** STOP at the current checkpoint boundary (never mid-file),
  emit a resumable state summary (done / in-progress / next), and report PARTIAL with the spend
  ledger. Continuing requires the user raising the ceiling — never silently borrow from a later
  stage's budget.

## Real mechanisms only (Law 01)
- Research: built-in `WebSearch` / `WebFetch` — these are **deferred tools**, so load their
  schemas via `ToolSearch` (e.g. `select:WebSearch,WebFetch`) before calling them; `research-council`
  when present (if absent, say so and fall back to WebSearch/WebFetch directly). Grounded facts
  come from here.
- Build/orchestrate: the sibling SKILLs above + `ultra-code`; subagents via `agent-factory`.
- Automation/data: MCP connectors (GitHub via `mcp__github__*`, Notion/Linear/Asana, analytics);
  Ollama for cheap drafting (not present on ephemeral remote containers). Absent connector/API =
  STOP-and-report the gap — never simulate its output.
- Plans and progress: `TaskCreate` / `TaskUpdate` / `TaskList` (with `TaskGet` / `TaskOutput` /
  `TaskStop` for background work).
- Scheduling (recurring ops/reports): `CronCreate` / `CronList` / `CronDelete` for schedules,
  `ScheduleWakeup` for a one-off resume, `Monitor` for watch-until conditions, and the Workflow
  tool for multi-stage runs. There is no `mcp__scheduled-tasks__*` tool — do not reach for one.

## Scaffold (run the form your shell supports)
```powershell
'plan','build','marketing','ops','analytics' | ForEach-Object { New-Item -ItemType Directory -Force -Path ".\business\$_" | Out-Null }
Set-Content -Encoding utf8 .\business\plan\BUSINESS_PLAN.md "# Business Plan`n"
```
```sh
mkdir -p business/plan business/build business/marketing business/ops business/analytics
printf '# Business Plan\n' > business/plan/BUSINESS_PLAN.md
```

## FINAL DELIVERABLE (per omega-constitution — required)
Emit the 12-part template: 1 Objective · 2 Requirements · 3 Assumptions (every unvalidated claim
listed) · 4 Research findings (with citations) · 5 Architecture · 6 Implementation · 7 Verification
results (evidence) · 8 Risks · 9 Lessons learned · 10 Improvements · 11 Audit summary · 12
Completion decision (DONE / BLOCKED / PARTIAL + why). State plainly: plan + software delivered;
revenue is not guaranteed; projections are scenarios. Offer the full narrative in Tamil on request.
