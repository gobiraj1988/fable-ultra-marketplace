# Changelog — fable-ultra

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
