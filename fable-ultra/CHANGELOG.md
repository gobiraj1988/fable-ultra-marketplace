# Changelog — fable-ultra

## 5.0.0 — 2026-07-20 — the tier-calibrated discipline overlay (Fable-Ultra 5)

The headline advance: process failures are NOT tier-agnostic, so the discipline no longer is
either. A new **§0 tier-calibrated overlay** in `knowledge/ai/fable5-discipline.md` matches each
tier's characteristic solo failure to a concrete countermeasure, and every engine loads the row
for the active tier at the start of a run. This is the mechanism behind the (sharply honest) claim
that **on multi-step verifiable build loops, Sonnet 5 or Opus 4.8 running fable-ultra's scaffolding
can match-or-exceed a *solo* Fable 5** — because on exactly those tasks process/verification
failures dominate over raw-reasoning failures. It does NOT claim parity on one-shot raw reasoning
(there Fable still wins) and changes no model weights (OMEGA Law 1).

The overlay table:

| Tier | Its characteristic solo failure | Overlay countermeasure |
|---|---|---|
| Sonnet 5 | Asserts "done" from an earlier run's memory; loses the plan on long horizons | Fresh re-run before any done-claim (§5) + re-derive plan/state from on-disk `ultra-code-run.md` each step (§7) |
| Opus 4.8 | Over-architects routine work; trusts confident reasoning over a re-run; agreeable when it should push back | Smallest-sufficient-design guard + re-run beats reasoning + steel-man disagreement |
| Fable 5 | Highest raw capability solo, but no forced adversarial verify / externalized state / cross-run memory | Still force independent verify + on-disk state + lessons memory (what fable-ultra adds over solo Fable) |
| Haiku 4.5 | Formatting slips; loses multi-step coherence | Narrow mechanical stages; one schema'd call; escalate early |

Changes (additive; no new skills; skill count stays **26**; all safety rails immutable):

- **NEW `knowledge/ai/fable5-discipline.md` §0** — the tier-calibrated overlay table (above).
- **Strengthened discipline §5** — the done-gate is now HARD: a done-claim must be preceded by a
  re-run executed THIS turn, never a memory of an earlier run (the #1 Sonnet failure).
- **NEW discipline §7** — resume-safe reconstruction: after any context compaction / new session /
  `resumeFromRunId` mismatch, re-derive plan+state from the on-disk `ultra-code-run.md`, re-check
  it against the original goal, and re-VERIFY the last "done" item fresh before continuing — never
  splice from conversational memory.
- **NEW discipline §1.4** — independent critique now means the verifier is NOT shown the builder's
  reasoning (goal + diff only); independence is the point.
- `model-max` — THE MAX LOOP gains **step 0 "Detect tier, load overlay"**; per-tier emphasis
  (Opus smallest-sufficient-design at plan; Sonnet on-disk re-derivation each item; fresh-this-turn
  done). Failure-mode table reorganized by tier.
- `ultra-code` — "model-max + memory hooks" section now covers tier detection + resume-safe
  reconstruction; **NEW loop pathology "premature done (carried-evidence)"** — REVIEW may not close
  the done-condition citing evidence from an earlier iteration; re-verify fresh this iteration.
- `ultra-code/scripts/ultra-code-workflow.js` — every build/verify/review `agent()` now carries a
  `TIER_PREAMBLE` (verify-by-execution-this-turn; Sonnet re-derive-from-disk; Opus smallest-fix;
  independent verifier not shown builder reasoning). REVIEW prompt rejects carried-evidence.
  Schemas unchanged; `node --check` passes.
- `model-router` — **NEW "RIGHT TIER, RIGHT EFFORT, RIGHT OVERHEAD"** section: overhead (scaffolding
  cost) is a real third lever — light-touch on Opus/routine, full scaffolding on Sonnet/Haiku (it is
  what closes the gap), forced adversarial verify still mandatory for Opus/Fable on judge/hard work.
  ROUTE template gains an OVERLAY line.
- `self-upgrade` — the discipline overlay file is now a **first-class upgrade target** (not just
  SKILL.md); evidence-gathering tags observations by tier so recurring same-tier failures can
  sharpen an overlay row. Backup/restore generalized to a resolved `$TARGET` path. One-cycle-per-
  request and immutable rails preserved.
- `fable5-ultra-prompt-engine` — generalized "Fable 5" → any Claude tier; the VERIFY step now
  **calibrates the prompt's self-validation bar to the target tier** (Sonnet/Haiku: bake in
  self-checks + re-run-before-done; Opus: smallest-fix guard; Fable: still require independent
  verify). Skeleton and examples unchanged.
- `ai-os` — one new rule→enforcer row for TIER-CALIBRATION; otherwise unchanged.
- Domain skills (`software-build`, `android-app`, `trading-bot`, `ai-builder`) — each now applies
  the tier overlay and the fresh-this-turn done-gate. On `trading-bot` the executed-vs-described
  gate is named the prime rail on Sonnet; the backtest plausibility screen and all safety rails
  are immutable and unchanged.

Verified before packaging (dogfooding the plugin's own shipping gates): `python -m json.tool`
manifest OK (description 406 chars, ≤500); every edited SKILL.md frontmatter parses as strict YAML
with `name`+`description` present, no tabs, no colon-space in the description value, every
description ≤1024 chars; `node --check` on the workflow script passes; skill count still 26.

What was deliberately NOT changed: skill count (26 — faithful to the OMEGA PRIME Evolution rule:
evolve via better verification/memory, not more layers), every safety rail (paper-mode-default,
human-confirmation-for-irreversible, no-fabricated-output, loop ceilings), and the Claude
Code-specific tool surface (`/model`, Workflow `agent()`/`pipeline()`, `/loop`, `claude plugin`).
The tool-surface references are preserved as-is because this plugin targets Claude Code's model
surface; a ZCode-tool-surface port is a separate, larger migration and is out of scope here.

## 4.2.3 — 2026-07-12 — trading-bot backtest plausibility screen (self-upgrade cycle)

- `trading-bot` BACKTEST gate: executed metrics are now necessary but NOT sufficient —
  suspiciously good results (Sharpe > 3, near-zero max drawdown, win rate > 80% on daily bars,
  loss-free equity curves) FAIL the gate until the leak is found (look-ahead, label timing,
  fills, survivorship, duplicated data) or the exception is precisely documented. Paper-first
  rails and per-action human sign-off unchanged.
- Eval: scenario — a leaked backtest printing Sharpe 5.2 passed the old gate (executed = pass);
  it now fails with a named hunt list. Aligned with the 2026-07-03 lesson: honest metrics catch
  bad strategies early.
- Self-upgrade queue from the 4.2.0 re-audit is now EMPTY (governance-core 4.2.1, ultra-code
  4.2.2, trading-bot 4.2.3). Next cycles should draw from fresh run evidence, not this list.

## 4.2.2 — 2026-07-12 — ultra-code loop-pathology rules (self-upgrade cycle)

- `ultra-code` Termination: three in-loop pathologies now have explicit detect+break rules —
  flaky VERIFY (re-run once; flipping verdict = FLAKY, cause-pinning becomes its own item, a
  flaky pass is never evidence), oscillating fix-break (same change flipping direction across 2
  iterations → merge the items with a joint done-condition), and review inflation (2 consecutive
  REVIEW passes adding items while the done-condition already holds → declare done, extras
  become optional follow-ups). Iteration ceiling (10) and dry-round (2) rails unchanged.
- Eval: scenario coverage 0/3 → 3/3 against the re-audit finding; real-session evidence — this
  session's own mid-patch validation snapshot was exactly the "mid-write reads" flaky case.
- Remaining queued target: trading-bot backtest plausibility threshold (4.2.3).

## 4.2.1 — 2026-07-12 — governance-core budget hard-stop hardened (self-upgrade cycle)

Target chosen from the 4.2.0 re-audit's remaining-weakness list; strengthens a gate, does not
weaken it (section-6 rail intact; user-directed cycle).

- `governance-core` §3: the hard-stop check now RECOMPUTES the spend total from every est-cost
  row instead of trusting the last row's manually-written running-total. A caller's arithmetic
  or formatting slip can no longer silently defeat the limit; stated-vs-recomputed drift is
  reported and the recomputed value wins.
- Verified by execution before keeping: corrupt ledger (true spend 22.00 over a 20.00 limit,
  last row falsely stating 4.80) — OLD check printed "BUDGET OK 4.8 of 20"; NEW check printed
  "LEDGER DRIFT ... recomputed 22" + "HARD-STOP BLOCK recomputed-total 22 >= limit 20". Healthy
  ledger still passes with no false drift.
- Next queued targets (not in this cycle): ultra-code flaky-VERIFY/oscillation handling;
  trading-bot plausibility threshold for suspiciously good backtests (e.g. Sharpe > 3).

## 4.2.0 — 2026-07-12 — model-agnostic discipline contract + full 26-skill audit upgrade

Full-plugin upgrade driven by a formal 26-skill audit (5 axes: trigger clarity, process
discipline, verify-by-execution, failure modes, modern orchestration; per-skill scores and gaps
recorded before editing). Goal: ANY selected model (Haiku/Sonnet 5/Opus/Fable 5) executes at
Fable-5-grade discipline — explicitly model-agnostic, not Sonnet-specific.

- **NEW `knowledge/ai/fable5-discipline.md`** — the shared model-agnostic execution contract:
  plan-first, one-item-at-a-time, verify-by-execution with a single evidence format
  (`<command> → exit <code> → "<output>"`), independent/adversarial critique, honest stop rule,
  current model tier map (claude-fable-5 / claude-opus-4-8 / claude-sonnet-5 /
  claude-haiku-4-5), per-stage `effort` routing, Workflow orchestration defaults, and the
  **portable fable-ultra home `$FU`** (env FABLE_ULTRA_HOME → legacy `J:\fable 5\fable-ultra` →
  `%USERPROFILE%\.fable-ultra`). All skills now reference it instead of restating process rules.
- **Core engines hand-upgraded:** `model-max` (adversarial verifier subagent option, budget
  caps, escalation hand-off to model-router, portable memory paths, anti-double-load trigger),
  `model-router` (current model IDs + /fast note, per-stage effort as a second routing lever,
  mandatory ROUTE/GATE/WHY/FALLBACK decision template, governance-core spend hook, portable
  leaderboard path), `ultra-code` (stage-gate rules for inline runs, concrete VERIFY evidence
  format, REVIEW independence requirement, effort routing + `workflow()` sub-pipelines,
  missing-file fallbacks).
- **Domain skills hand-upgraded:** `android-app` (staged PLAN→SCAFFOLD→FEATURE→VERIFY→RELEASE
  gates, gradlew-executed verification, Android failure-mode table, negative triggers),
  `trading-bot` (every stage now gated on EXECUTED evidence — backtest/risk/kill-switch must
  actually run; walk-forward + sensitivity grid; governance-core NEEDS-APPROVAL for live;
  honest "AGI trader" boundary), `algorithm-factory` (promote threshold fixed at DEFINE, N≥5
  runs median+spread, warmup/overfit guards, null-result path, Workflow fan-out + verifier),
  `software-build` (stop/report protocol, e2e delivery evidence bar, negative triggers),
  `ai-builder` (staged INGEST→RETRIEVE→GENERATE→EVAL gates, executed-eval done-bar, router +
  governance hooks, negative triggers), `agent-system` (staged build, failure-mode table
  incl. reward hacking/memory poisoning, executed baseline scores required, negative triggers).
- **17 remaining skills patched** against their audit gaps (negative triggers, verify sections,
  executable checks, budget/governance hooks, portable `$FU` paths, research-council role-count
  fix, workflow-factory dry-run path fix) — each patch verified by an independent checker agent.
- **`.mcp.json`** — secrets rule (env-only, never literal), validation rule (every entry must
  start and answer a tool call before shipping), mcp-registry discovery note, claude.ai
  connectors explicitly session-level (never hardcoded), ai-builder row added, trading data
  connectors scoped to paper/data (execution stays human-gated).

## 4.1.5 — 2026-07-07 — full-plugin audit fixes (6 verified defects)

Five-dimension adversarial audit (cross-refs, code snippets, paths, docs, triggers). Confirmed
defects fixed; every fix re-verified by execution where applicable:

- MAJOR `research-council`: Workflow sketch used a wrong agent() shape (object arg + nonexistent
  `role` opt) and fed `parallel()` promises instead of thunks — rewritten to the canonical
  `agent(prompt, {label, schema, model})` / `parallel(thunks)`; now node-syntax-verified; also adds
  the Economist to the sketch roles (matching its own table).
- `model-router`: `$null -eq (Select-String -Path .. -Quiet)` guard was dead code (with -Path,
  no-match returns False, not null) — the `## Failures` section could never be created. Fixed to
  `-not (...)`; verified by execution (creates once, no duplicate on re-run).
- `self-upgrade`: evidence step pointed at `ultra-code-run.md` "under the plugin directory" — they
  are written in project working directories; corrected so evidence gathering looks where files are.
- `ecosystem-orchestrator` + `governance-core`: referenced a nonexistent `cron` skill — corrected
  to the `schedule` skill / Cron tools.
- `README.md`: stale v1 opening ("six grounded domain-builder skills") — now reflects 26 skills.
- Trigger-overlap dimension: reviewed inline; all overlapping descriptions already carry explicit
  differs/defer notes — no unmitigated overlap found.

## 4.1.4 — 2026-07-04 — valid-YAML hardening (all 26 skills load on any parser)

- Removed `": "` (colon-space) from 6 skill descriptions (agent-factory, algorithm-factory,
  dream-factory, ecosystem-orchestrator, knowledge-lake, research-council). A colon-space in an
  unquoted YAML scalar is invalid and a strict parser drops the skill. Lenient parsers (current
  Claude surfaces) tolerated it, but this removes the latent risk. Verified: all 26 SKILL.md
  frontmatters now pass a strict YAML parse (pyyaml) AND every description is <=1024.
- Context: Claude chat showing 24/26 was a STALE SYNC of the pre-4.1.3 commit (meta-brain +
  workflow-factory descriptions were >1024 there and got dropped). Re-sync the marketplace to
  pick up 4.1.4 and all 26 skills.

## 4.1.3 — 2026-07-04 — skill-description length fix

- Shortened `meta-brain` (1164->900) and `workflow-factory` (1037->860) skill descriptions. The
  Cowork validator caps each skill's `description` frontmatter at 1024 chars; these two were over,
  blocking the plugin upload ("field 'description' in SKILL.md must be at most 1024 characters").
  Trigger phrases preserved; no behavior change. All 26 skill descriptions now <=1024.

## 4.1.2 — 2026-07-04 — packaging fix

- Shortened `plugin.json` description from 654 to under 500 chars. The Cowork/marketplace validator
  rejects descriptions over 500 chars ("Plugin description must be at most 500 characters"), which
  was blocking local `.plugin` upload. No skill/behavior change.

## 4.1.1 — 2026-07-03 — OMEGA PRIME reconciliation (in place, no new skills)

Adopted the OMEGA PRIME doctrine WITHOUT adding layers/skills/versions-for-their-own-sake — exactly
as its own CORE OPERATING RULE demands. Skill count unchanged (26).

- `omega-constitution`: added the **Evolution rule** — evolve through better knowledge/verification/
  algorithms/workflows/memory/benchmarks/research, NOT more layers/versions/prompts.
- `knowledge-lake`: entry template now carries full provenance — Source · Confidence · Date ·
  Domain · **Verify** (VERIFIED/UNVERIFIED/REFUTED).
- Stored the doctrine as a provenance-tagged knowledge object: `knowledge/ai/omega-prime-doctrine.md`.

## 4.1.0 — 2026-07-03 — AI-OS doctrine

Token-minimal iteration (no multi-agent workflow — direct edits only, honoring the AI-OS token rule).

- NEW `ai-os`: the standing operating doctrine — token-efficiency, model-routing, knowledge,
  research, agent, and factory rules, each mapped to the enforcing skill; the OS's entry-point
  operating profile.
- NEW `algorithm-factory`: benchmark-gated algorithm selection (define metric -> generate 2–5 ->
  test correctness -> benchmark -> compare -> promote only a measured winner -> store). Distinct
  from skill-factory and trading-bot.
- FIX `ecosystem-orchestrator`: pipeline GATE column now references governance-core's real action
  classes (routine/risky/expensive/irreversible) instead of invented gate names; removed a
  reference to a nonexistent "X-LAW 11". Backup kept during edit, then removed after verification.

## 4.0.0 — 2026-07-03 — X OMEGA

The autonomous-intelligence-infrastructure capstone. Only genuine gaps built (truth over
appearance) — the other 9 X-layers already existed from v3 and were mapped, not rebuilt.

- NEW `workflow-factory` (X Layer 5): create/test/version/register reusable Workflow pipeline
  templates (research/dev/verify/deploy/business/learning), each Node-syntax-checked with
  mandatory termination logic before registering.
- NEW `ecosystem-orchestrator` (X Layer 11, capstone): drives a single mission through
  GOAL->RESEARCH->KNOWLEDGE->SKILLS->AGENTS->WORKFLOWS->PRODUCTS->BUSINESSES->EVOLUTION by
  chaining existing skills, with a governance gate before each stage, audit trail, and mandatory
  termination. Honest boundary: coordinates real capabilities; not autonomous AGI; real businesses
  need human involvement + money + accounts behind approval gates.
- NEW `governance-core` (X Layer 12): active enforcement — ALLOW/BLOCK/NEEDS-APPROVAL gates on
  irreversible/expensive/risky actions, a budget ledger with hard stop, per-decision audit log,
  per-domain compliance, and immutable safety rails that self-upgrade cannot bypass.
- `research-council` gains the Economist role (X Layer 8 = 8 members).
- 10 existing X-layers mapped to existing skills in OMEGA-X-BUILD.md — no duplication.

## 3.0.0 — 2026-07-03 — OMEGA

Major: fable-ultra becomes a governed autonomous build operating system.

- NEW `omega-constitution`: governance backbone — 10 OMEGA Laws, GOAL->..->SCALE lifecycle,
  quality gates, mandatory FINAL DELIVERABLE template, success definition, and the 19-system ->
  skill map. All V3 skills defer to it.
- NEW `model-router` (System A): task-aware model selection + escalation chain (small->mid->
  premium->council), realized via Workflow per-agent model/effort; measured leaderboards only.
- NEW `research-council` (System B): 7-role multi-agent deliberation (Scientist/Critic/Builder/
  Tester/Auditor/Risk Officer/Strategist) -> cited recommendation with preserved dissent.
- NEW `skill-factory` (Systems C+P): auto-create/test/verify/version/register/publish skills and
  plugin assets, adversarially verified before shipping.
- NEW `agent-factory` (System D): create/test/deploy/monitor/retire least-privilege subagents;
  distinct from agent-system (which builds agent products for users).
- NEW `knowledge-lake` (Systems E+Q): permanent source-attributed knowledge store + enterprise
  memory feeding self-upgrade; ASSUMPTION-labeling for unsourced claims.
- NEW `dream-factory` (Systems F+N): single goal -> grounded business plan -> built & operated via
  the other skills; estimates flagged, human approval before spend/publish.
- NEW `meta-brain` (Systems S+O+R): system-health metrics, autonomy engine with mandatory
  termination logic, and opportunity survival engine (paper-default, human-gated).
- Existing skills mapped to OMEGA systems G/H/I/J/K/L/M with no behavior change.

## 2.1.0 — 2026-07-03

- NEW skill `ai-builder`: build real AI products — LLM apps, RAG pipelines, embeddings/semantic
  search, AI agents, extraction/classification — small-model-first architectures (decomposition,
  tight schemas, verifier pass, escalation router) with mandatory golden-set evals.
- NEW skill `vision-ocr`: image reading and OCR systems — engine picker (text-layer first,
  Tesseract, Claude vision, hybrid), validation-gated extraction to structured data, labeled-sample
  accuracy reports, human-review queue for low confidence; feeds qs-works quality gates for
  drawing/BOQ reading.

## 2.0.0 — 2026-07-03

- NEW skill `model-max`: quality-forcing engine — makes any selected Claude model execute with
  Fable-5-grade process discipline (plan -> small verified increments -> self-critique loop ->
  evidence-based done -> honest escalation). Auto-loaded by ultra-code.
- NEW skill `self-upgrade`: eval-gated self-modification — the plugin improves its own skill
  files, keeps changes only when a before/after eval shows improvement, with immutable safety
  rails and versioned changelog.
- NEW skill `qs-works`: advanced QS/Excel/document production — routes to installed qs-suite +
  xlsx/docx/pdf specialist skills, then applies QS quality gates (traceability, cross-checked
  totals, live formulas, verification table).
- NEW: `memory/lessons.md` — cross-run lessons memory, read at start / appended at end of runs.
- NEW command: `/self-upgrade`.
- ultra-code now auto-applies model-max discipline and the lessons memory hooks.

## 1.0.0 — 2026-07-03

- Initial release: ultra-code loop engine, fable5-ultra-prompt-engine (imported), six domain
  builders, sample MCP map, paper-mode trading rails. Verified via btc-momentum-paper test drive.
