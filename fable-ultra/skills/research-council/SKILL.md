---
name: research-council
description: OMEGA Research Council (System B) — an eight-role multi-agent deliberation that produces a verified, cited recommendation on a hard, contested, or high-stakes question. Roles (Scientist, Critic, Builder, Tester, Auditor, Risk Officer, Economist, Strategist) run as Workflow subagents through independent research -> cross-examination -> debate -> consensus -> verification -> recommendation. Use when the user says "research council", "convene the council", "deliberate", "steelman and stress-test this", "give me a decision with dissent preserved", "should we X — argue both sides with sources", or wants a defensible go/no-go with a risk analysis and evidence package. DIFFERS from the top-level `deep-research` skill (a single fan-out/verify/synthesize web-research harness) - this skill CALLS deep-research (or WebSearch/WebFetch/Exa) for grounding and wraps it in adversarial multi-role decision-making. For a plain cited report with no decision or dissent, use `deep-research` directly instead.
---

# OMEGA Research Council — System B

Governed by the **omega-constitution** skill (the 10 OMEGA Laws). Load it first. The Laws that
bite hardest here: **01** never fabricate (no invented sources), **02** no "done" without
verification evidence, **03** never hide uncertainty, **04** evidence > confidence,
**05** verification > generation. When any rule below conflicts with a Law, the Law wins.

**Honest boundary:** a council reduces single-perspective error by forcing disagreement into the
open — it does **not** make the answer omniscient or guaranteed correct. Surface residual
uncertainty; never present consensus as proof (Law 03).

Process discipline — plan-first, verify-by-execution evidence in the format `<command> -> exit <code> -> "<output>"`, independent critique, and the portable `$FU` home — follows the shared
contract in `knowledge/ai/fable5-discipline.md`; read it once, do not restate it here.

## The eight roles (each a subagent with one job)

| Role | Mandate | Primary output |
|---|---|---|
| Scientist | Evidence & first-principles: what is actually known, mechanism, base rates | Grounded claim set, each cited |
| Critic | Attack the claims: find the weakest link, counter-evidence, failure of logic | Refutations + surviving claims |
| Builder | Feasibility: can it actually be built/done with real resources & constraints | Buildability verdict + blockers |
| Tester | How we would verify each claim empirically; what experiment/metric decides it | Verification plan per claim |
| Auditor | Assumptions & gaps: what is assumed, unstated, or unsourced | Assumption ledger + open gaps |
| Risk Officer | What could go wrong: failure modes, blast radius, tail risks | Ranked risk register |
| Economist | Costs, incentives, unit economics, opportunity cost, market/price reality | Cost-benefit + economic verdict |
| Strategist | Trade-offs & the actual recommendation, given all of the above | Decision + alternatives |

## Workflow orchestration (Workflow tool)

Six stages. Stage 1 fans out with a **`parallel()`** barrier (roles must not see each other yet, to
keep views independent); later stages read prior outputs. Use `schema` on every `agent()` so
outputs are structured, and `resumeFromRunId` on re-runs to reuse cached role work.

```js
// Sketch — adapt prompts/schemas to the real question. Not run verbatim.
// Canonical API: agent(promptString, {label, schema, model, phase}) · parallel(thunks) · pipeline(items, ...stages)
const question = "<the decision to resolve>";
const ROLES = ["scientist","critic","builder","tester","auditor","economist","riskofficer","strategist"];
const esc = (r) => (r === "critic" || r === "auditor") ? "opus" : undefined; // escalate adversarial seats (model-router)

// 1) INDEPENDENT RESEARCH — parallel(THUNKS) barrier: all views formed before anyone reads another
const views = await parallel(ROLES.map(r => () =>
  agent(rolePrompt(r, question), { label: r, model: esc(r), schema: ViewSchema })));
// 2) CROSS-EXAMINATION — each reads all others, flags disagreements
const xexam = await parallel(views.map((v, i) => () =>
  agent(crossExamPrompt(v, views), { label: "xexam:" + ROLES[i], schema: DisagreementSchema })));
// 3) DEBATE — challenge the flagged assumptions head-on
const debate = await agent(debatePrompt(views, xexam), { label: "debate", schema: DebateSchema });
// 4) CONSENSUS ATTEMPT — where do all eight agree / where is it irreducibly split
const consensus = await agent(consensusPrompt(debate), { label: "consensus", schema: ConsensusSchema });
// 5) VERIFICATION PASS — re-check every load-bearing claim against its cited source (Law 05)
const verified = await agent(verifyPrompt(consensus), { label: "verify", model: "opus", schema: VerifySchema });
// 6) RECOMMENDATION — Strategist writes the decision using ONLY verified claims
const decision = await agent(decisionPrompt(verified), { label: "decision", schema: DecisionSchema });
```

If you are not running an explicit Workflow, execute the same six stages inline yourself in the
same order — the discipline, not the tool, is what matters.

## Output schemas (the `schema` values above — reject and re-run any stage that fails its shape)

```ts
ViewSchema         = { role, claims: [{ id, text, kind: "fact"|"judgment", source, confidence: "hi"|"med"|"lo" }], assumptions: [string] }  // source REQUIRED when kind="fact" (Law 01)
DisagreementSchema = { role, disagreements: [{ claimId, holder, objection, counterEvidence }] }
DebateSchema       = { rounds: [{ claimId, challenge, rebuttal, status: "upheld"|"refuted"|"unresolved" }] }
ConsensusSchema    = { agreed: [claimId], split: [{ claimId, positions: [{ role, stance }] }] }
VerifySchema       = { checked: [{ claimId, source, verdict: "verified"|"failed"|"unreachable", note }] }
DecisionSchema     = { recommendation, alternatives: [string], residualUncertainty: [string], usedClaimIds: [claimId] }
```

## Budgets (hard caps — stop at the cap, never drift)

- **Sources:** max 8 per role in Stage 1 (Scientist may use 12); dedupe before citing.
- **Debate:** max 2 rounds per disputed claim; still `unresolved` after round 2 -> record as split (Law 03), do not loop.
- **Tokens:** ~15k output per Stage-1 seat, ~10k per later stage, ~150k for the whole council; on breach, summarize what exists and move on.
- **Retries:** one re-run per failed schema; a second failure escalates that seat's model once (model-router), then reports the gap instead of retrying.

## Grounding — no source, no claim (Law 01)

1. Every **factual** claim in any role output must carry a citation (URL / doc / dataset). Opinions
   and trade-off judgments are labeled as such, not dressed as facts.
2. Get sources in this order of preference:
   - the top-level **`deep-research`** skill (fan-out + adversarial fact-check) — invoke it for the question, then feed its cited report to the Scientist;
   - else **WebSearch** + **WebFetch** (built-in) for direct lookups;
   - else the **Exa MCP** connector (`web_search_exa` / `web_fetch_exa`) or **Apify** `rag-web-browser` actor if configured.
3. **If none of the above is available**, do not invent sources. **STOP** and report: "Research is
   ungrounded — enable deep-research / WebSearch / an Exa or Apify MCP, or supply the sources, and I
   will convene the council." (Law 01). A reasoning-only council is allowed only if the user
   explicitly waives grounding, and the report is then stamped **UNGROUNDED — reasoning only**.

## Model tier escalation (model-router)

Ask the **model-router** skill to escalate the adversarial seats — **Critic** and **Auditor** —
to the strongest available tier (their job is to break claims; capability matters most there).
Run the mechanical seats at standard tier to respect Law 08 (optimize cost). If model-router is
absent, keep all seats on the selected model and **say so** — never claim escalation you didn't do
(Law 03). Local **Ollama** models may serve standard seats when configured; never a verify seat.

## Outputs (all five, in order)

1. **Research Report** — the verified answer with inline citations and confidence per claim.
2. **Alternative Views** — genuine dissent preserved verbatim, **not** smoothed into consensus; if
   the council split, show the split and who held which position (Law 03).
3. **Risk Analysis** — the Risk Officer's ranked register: failure mode -> likelihood -> impact ->
   mitigation.
4. **Evidence Package** — the full source list (title, URL/locator, what it supports, access date).
5. **Decision Summary** — the Strategist's recommendation with trade-offs, and an explicit
   **residual-uncertainty** section: what is still unverified and what would change the answer.

## Close-out (Laws 07, 09)

- Append one dated lesson to `$FU\memory\lessons.md`.
- Append durable, source-attributed findings to the knowledge-lake — via the **knowledge-lake**
  skill if installed, else to `$FU\memory\knowledge-lake.md`.
- `$FU` resolves per `knowledge/ai/fable5-discipline.md` section 4: env `FABLE_ULTRA_HOME` -> legacy `J:\fable 5\fable-ultra` if present -> `%USERPROFILE%\.fable-ultra`.

```powershell
$FU = if ($env:FABLE_ULTRA_HOME) { $env:FABLE_ULTRA_HOME }
      elseif (Test-Path "J:\fable 5\fable-ultra") { "J:\fable 5\fable-ultra" }
      else { "$env:USERPROFILE\.fable-ultra" }
$stamp = Get-Date -Format yyyy-MM-dd
Add-Content "$FU\memory\lessons.md" `
  "$stamp [research-council] <question> -> <verdict>; unresolved: <what stayed split>" -Encoding utf8
Add-Content "$FU\memory\knowledge-lake.md" `
  "$stamp | FINDING: <claim> | SOURCE: <url> | CONFIDENCE: <hi/med/lo> | via research-council" -Encoding utf8
```

- Keep the per-stage audit trail (each role's raw output, disagreements, verify results) so the
  decision is reproducible. Any irreversible follow-on action the decision recommends needs
  separate human approval before execution (Law 10) — the council recommends; it never acts.
