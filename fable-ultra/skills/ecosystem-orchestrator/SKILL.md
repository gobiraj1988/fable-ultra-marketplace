---
name: ecosystem-orchestrator
description: The X capstone of fable-ultra X OMEGA (LAYER 11). Invoke when the user hands over a single big mission or goal — "turn this idea into a business/ecosystem", "orchestrate the whole plugin toward X", "run the GOAL->...->ECOSYSTEM pipeline", "coordinate research + skills + agents + products + business as one system", or asks the X orchestrator / capstone to chain every existing skill toward one outcome with governance gates and a full audit trail. It sequences the plugin's OTHER skills (research-council, knowledge-lake, skill-factory, agent-factory, workflow-factory, software-build/android-app/ai-builder/vision-ocr/trading-bot/astrology-report/qs-works, dream-factory, self-upgrade, meta-brain) behind governance gates; it does NOT reimplement them. Governed by omega-constitution (10 X-LAWS). Not autonomous AGI: irreversible/real-money/real-account steps are gated to the human.
---

# X LAYER 11 — Ecosystem Orchestrator (the X Capstone)

Turn ONE mission into a coordinated ecosystem by chaining the plugin's existing skills through the
X pipeline, with a governance gate before every stage and a complete audit trail. This skill
COORDINATES; it never reimplements a sibling skill. First load `omega-constitution` (the 10 X-LAWS)
and read `memory/lessons.md`.

## 0. On invocation (do this first)
1. Restate the mission in one sentence; confirm it with the user before spending anything.
2. Create/append `ecosystem-run.md` (see §3) with the mission and an empty stage log.
3. Set the budget envelope: max stages, max USD (paid connectors/APIs), wall-clock, and the
   done-condition. No envelope => STOP and ask (X-LAW 09). Never run unbounded (§5).

## 1. THE PIPELINE — stage -> skill -> gate
Run only the stages the mission needs; skip a stage by writing "skipped: <reason>" in the log.
The GATE column maps each stage to its `governance-core` action-class check
(routine / risky / expensive / irreversible -> ALLOW / BLOCK / NEEDS-APPROVAL) run BEFORE the stage.

| # | Stage | Skill invoked (existing) | governance-core gate BEFORE stage |
|---|-------|--------------------------|-----------------------------------|
| 1 | GOAL | (this skill) parse mission, envelope | set budget envelope; expensive-class if paid work is planned |
| 2 | RESEARCH | `research-council` + WebSearch/WebFetch for grounding | routine; enforce sources cited, no fabrication (X-LAW 01/03) |
| 3 | KNOWLEDGE | `knowledge-lake` (store findings, retrieve prior lessons) | routine; persist only verified facts (X-LAW 03) |
| 4 | SKILLS | `skill-factory` — ONLY if a needed capability has no skill | routine; confirm capability gap, no duplicate skill |
| 5 | AGENTS | `agent-factory` (+ `agent-system` to run them) | risky; bound tool/permission scope before granting |
| 6 | WORKFLOWS | `workflow-factory` (chains agents via the Workflow tool) | expensive; cost ESTIMATE + dry-run plan before the real run |
| 7 | SYSTEMS/PRODUCTS | `software-build` / `android-app` / `ai-builder` / `vision-ocr` / `trading-bot` (paper only) / `astrology-report` / `qs-works` | acceptance criteria defined; live trade = irreversible -> NEEDS-APPROVAL, paper default (X-LAW 09) |
| 8 | BUSINESSES | `dream-factory` (plans/assets for a venture) | irreversible; money/accounts/live launch = NEEDS-APPROVAL, plan only otherwise |
| 9 | ECOSYSTEMS | (this skill) coordinate stages 2–8 into one system | routine; verify interfaces + owners |
| 10 | CONTINUOUS EVOLUTION | `self-upgrade` + `meta-brain` | each change re-verified + logged; safety-rail edits = BLOCK |

Absent capability at any stage => STOP-and-report in `ecosystem-run.md`; never fake a result (X-LAW 01/03).

## 2. EXECUTION discipline
1. Run all BUILD-type stages (7) via `ultra-code`'s BUILD<->VERIFY loop; a stage is "done" only
   with quoted execution evidence (X-LAW 02/11).
2. Supervise the whole run with `meta-brain` (progress, stalls, gate outcomes, budget burn).
3. Apply `model-max` discipline and `model-router` routing: cheapest model/path that still passes
   every gate (X-LAW 08). Use `mcp-connector` for external tools; missing/unauthed connector => STOP.
4. Chain stages with the Workflow tool: `agent(prompt,{label,schema,model,phase})`,
   `pipeline(items, ...stages)`, `parallel(thunks)`, and `Workflow({scriptPath})` to launch a run.
   Persist the run's state to disk so it can be recovered (§4).

## 3. STATE + AUDIT — `ecosystem-run.md` (X-LAW 08)
This file IS the audit trail. Update it after every stage and every gate decision. Keep these keys:

```
# Ecosystem Run — <mission>
Envelope: stages<=N | budget<=$X | wall-clock<=T | done-condition: <measurable>
| Stage | Skill | Gate result (who/when) | Status | Evidence (path/quote) | Cost |
|-------|-------|------------------------|--------|-----------------------|------|
Mission: <one line>
Current stage: <n>
Done: <list>   Blocked: <list + why>   Next: <single next action>
Spend so far: $X of $budget
```
Never write "done" for a stage without an Evidence cell (X-LAW 02). Append every failure as a
lesson to `memory/lessons.md` and to `knowledge-lake` (X-LAW 07).

## 4. RUN-STATE + RECOVERY (Windows-friendly)
- Store the launch run-id and per-stage status in `ecosystem-run.md` and a machine-readable
  `run-state.json` beside it.
- Long/background stages use the Task tools + the `schedule`/`cron` skills. There is NO standalone
  "Workflow resumeFromRunId" background-recovery tool — to recover, RELAUNCH from the run-state file:
  read `run-state.json`, then call `Workflow({scriptPath})` (optionally `resumeFromRunId` from that file).
- PowerShell (no bash brace-expansion): enumerate stages as
  `'research','knowledge','agents' | ForEach-Object { Write-Output $_ }`.

## 5. GATES + TERMINATION (mandatory)
Every expensive or irreversible stage passes `governance-core` before it runs; irreversible actions
(spending money, sending, publishing, live trades, deletions, creating real accounts) require explicit
per-action human approval — never inside an autonomous loop (X-LAW 09).
STOP the whole orchestration when ANY of these holds; write the reason in `ecosystem-run.md`:
1. Mission-complete AND verified against the done-condition (evidence quoted).
2. Budget exhausted (stages, USD, or wall-clock envelope hit).
3. A gate needs human approval that has not been given.
4. A safety/policy trigger fires (irreversible or out-of-scope action requested).
5. The user says stop.
The orchestrator is NEVER unbounded — if none of the above and no next action exists, STOP and report.

## 6. HONEST BOUNDARY (X-LAW 01)
This skill orchestrates REAL, bounded capabilities (subagents, the Workflow tool, files, MCP
connectors, local Ollama models via `model-router`) toward a mission. It is NOT autonomous AGI and
cannot run a real business by itself: real revenue needs human involvement, real money, and external
accounts (payments, hosting, exchanges, app stores) — all gated to the human at stages 7–8. It does
NOT promise profit, guaranteed outcomes, or a "complete ecosystem" without the human executing the
gated steps. Trading is paper-only unless the human explicitly authorizes live per-action. Say clearly
which parts are automated and which await the human.

## 7. OUTPUT — FINAL DELIVERABLE
Produce the omega-constitution FINAL DELIVERABLE template: 1 Objective · 2 Requirements ·
3 Assumptions · 4 Research findings · 5 Architecture (the ecosystem map) · 6 Implementation ·
7 Verification results (with quoted evidence) · 8 Risks · 9 Lessons learned · 10 Improvements ·
11 Audit summary (link `ecosystem-run.md`) · 12 Completion decision (DONE / BLOCKED / PARTIAL + why,
listing every human-gated step still outstanding).

## 8. Tamil narrative (on request)
If the user asks in Tamil or requests a Tamil summary, narrate the pipeline, gates, evidence, and the
final DONE/BLOCKED/PARTIAL decision in Tamil while keeping `ecosystem-run.md` and evidence in English.
