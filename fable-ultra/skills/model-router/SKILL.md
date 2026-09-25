---
name: model-router
description: System A of fable-ultra V3 OMEGA — the model router. Chooses the most cost-appropriate model for a task by weighing complexity, cost, latency, accuracy need, and risk, then routes to it (Fable 5, Opus, Sonnet, Haiku via /model; local models via Ollama; other providers only through a connected API key or MCP connector). Triggers when the user says "which model should I use", "route this", "pick the cheapest model that works", "escalate to a stronger model", "run a multi-model council", "route among my models", or "model router". Governed by the omega-constitution skill (the 10 OMEGA Laws). Complements model-max — model-router picks WHICH model, model-max squeezes maximum quality out of whichever one is picked; if the user wants "best output from this model" and not a routing decision, defer to model-max.
---

# Model Router — System A (cost-first model selection)

Governed by `omega-constitution` (10 OMEGA Laws). Load it first. Law 8 (optimize cost) and
Law 1 (never fabricate) drive this skill: route to the CHEAPEST model that still passes the
task's gates, and never pretend to call a model you cannot actually reach.

## HONEST REALITY (what you can and cannot route to)

- **Directly routable now:** the Claude models the user has enabled in this session — **Fable 5,
  Opus, Sonnet, Haiku** — switched with the `/model` command. You cannot silently switch mid-turn;
  recommend the tier and tell the user the `/model` value to set, or set per-agent in a Workflow.
- **Current tier map — all four IDs** (per `knowledge/ai/fable5-discipline.md` §2; consult the
  `claude-api` skill before hardcoding any ID in product code — IDs go stale):

  | Tier | Model ID | Workflow `model:` | Route it for |
  |---|---|---|---|
  | Ceiling | `claude-fable-5` (Mythos-class, a full tier ABOVE Opus) | `fable` | hardest judge / final verify / one-shot-must-be-right |
  | Premium | `claude-opus-4-8` (supports `/fast`) | `opus` | architecture, ambiguous specs, deep debugging |
  | Mid | `claude-sonnet-5` | `sonnet` | standard build work — the default tier |
  | Small | `claude-haiku-4-5-20251001` | `haiku` | mechanical / bulk stages |

- **Second dial — reasoning EFFORT:** each Workflow `agent()` call also takes
  `effort: 'low'|'medium'|'high'|'xhigh'|'max'`. Route BOTH dials: mechanical stages get a cheap
  model at `effort:'low'`; verify/judge stages get a premium model at high effort. Raising effort
  on the SAME model is usually cheaper than hopping a tier — try it first (see the escalation
  chain). `agentType` and `isolation:'worktree'` are routable per agent too, but they are workload
  shape, not cost tiers.
- **Latency lever — fast mode:** `/fast` (Opus 4.8) buys faster OUTPUT on Opus. It is **not** a
  downgrade to a smaller model and not a cheaper tier — use it for latency-sensitive work and do
  not record it as a cost decision.
- **Local, if installed:** models served by **Ollama** (e.g. `llama3.1`, `qwen2.5`, `mistral`,
  `phi`). Not present on ephemeral remote/web containers. Confirm before claiming availability
  (same command in PowerShell or a POSIX shell):
  ```sh
  ollama list   # if this errors, Ollama is not installed — say so, do not fake a local route
  ```
- **Other providers (GPT, Gemini, Qwen-cloud, DeepSeek, Mistral-cloud, Llama-cloud, MythoMax):**
  reachable ONLY if the user has connected an **API key or MCP connector** for them. If none is
  connected, STOP and report: "No connector for <provider> — connect an API key/MCP server or pick
  a reachable model." Never emit fabricated output as if it came from an unconnected model (Law 1).

## RIGHT TIER, RIGHT EFFORT, RIGHT OVERHEAD (v5)

Three levers, not one — and they interact. Picking a tier alone is no longer the whole decision:

1. **Tier** — which model (above). Cheapest that clears the gate.
2. **Effort** — reasoning depth (`low`→`max`) on stages where the harness supports it. Route effort
   like you route tiers: `low` for mechanical/extract stages, `high`+ only for verify/judge.
3. **Overhead (the honest cost of scaffolding)** — `model-max` discipline has a cost: a fresh
   re-run before every done-claim, independent verifier subagents, on-disk work-state. On Opus
   that overhead is *wasted* on routine work Opus does correctly in one pass; on Sonnet/Haiku it
   is *what closes the gap* to a stronger tier. So calibrate overhead to the tier AND the stakes:

   | Tier | Routine work | Verify / judge / hard work |
   |---|---|---|
   | Opus 4.8 | Light-touch — trust the first verified pass, skip redundant verifier subagents | Full adversarial verify still mandatory (Law 5) — Opus is exactly where "confident reasoning beats a re-run" fails |
   | Sonnet 5 | **Full scaffolding** — fresh re-run gate + on-disk plan re-derivation each step (the overlay) | Full scaffolding + verify at a stronger tier where affordable |
   | Haiku 4.5 | Full scaffolding, narrow stages, escalate early | Escalate to Sonnet/Opus for verify |
   | Fable 5 | Light-touch on generation | Still force independent verify + externalized state — solo Fable lacks them |

The **tier-calibrated overlay (discipline §0) applies to whichever tier you route to** — it is not a
separate routing decision. Routing to Sonnet means committing to Sonnet's overlay countermeasures;
routing to Opus means committing to the smallest-sufficient-design guard. State the overlay row in
the ROUTE decision below when the stakes make it load-bearing. Routine escalation "to be safe"
still violates Law 8 — overhead is a real cost, spend it deliberately.

## ROUTING TABLE (task shape -> recommended tier)

| Task shape | Route to | Why |
|---|---|---|
| Mechanical / bulk (rename, reformat, extract, classify, boilerplate) | **Haiku** or a small **Ollama** local | Cheapest; quality is sufficient |
| Standard build / reasoning (feature code, refactor, normal docs, analysis) | **Sonnet** | Best cost/quality balance for most work |
| Hard reasoning / architecture / deep debugging | **Opus** (at high effort) | Premium reasoning below the ceiling |
| Hardest judge / final verify / ambiguous spec / one-shot-must-be-right | **Fable 5** (high–max effort) | The ceiling tier; spend it only where it moves the outcome |
| Privacy-sensitive / offline / no-cloud-egress | **Ollama** local only | Data never leaves the machine |
| High-stakes + disagreement risk | **multi-model council** (see below) | Reconcile independent answers |

Pick the LOWEST row that plausibly clears the done-condition. Do not default to premium.

## ROUTING DECISION (mandatory, written BEFORE the task runs)

No route without a gate. Emit this template first — it is what makes escalation signals real and
every route auditable (Law 9), and it feeds the governance-core spend ledger for paid/expensive
routes:

```
ROUTE: <task shape> -> <tier> (model id)
GATE:  <the measurable pass/fail check the output must clear>
WHY:   <one line — cheapest tier that plausibly clears the gate>
OVERLAY: <the discipline §0 row applied to this tier; "full scaffolding" for Sonnet/Haiku, "light-touch + forced verify" for Opus/Fable; omit only when routine>
FALLBACK: <next tier up, and the signal that would trigger it>
```

## ESCALATION CHAIN (the cost-saver — escalate only on a real signal)

`small (Haiku/local) -> mid (Sonnet) -> premium (Opus) -> ceiling (Fable 5) -> multi-model council`

Cheapest first hop: raise **effort** one notch on the CURRENT model before hopping a tier — a
failed gate often clears at the same tier with more reasoning effort, at a fraction of the cost.

1. Start at the routing-table tier for the task shape — NOT at premium.
2. Run the task. Then run a **model-max verifier pass** (see `model-max`, THE MAX LOOP step 4 —
   "VERIFY by actually executing") on the output.
3. Escalate ONE tier ONLY when a real signal fires:
   - the verifier pass **fails a gate** (test/exit-code/acceptance criterion), OR
   - the model **self-reports low confidence** or flags unverified assumptions (Law 3).
   Never escalate "to be safe" — routine escalation defeats the whole cost saving.
4. Repeat: re-verify at the new tier. If premium still fails its gate, convene the council.
5. Log every hop (from-tier, to-tier, trigger) to the audit trail (Law 9).

## REALIZING ROUTING INSIDE A WORKFLOW

In a `Workflow`, set BOTH dials per agent via the `agent(prompt, opts)` call — the task prompt is a
STRING first, then an opts object with `label`, `model`, `effort`, and `schema` (same signature as
`scripts/ultra-code-workflow.js`) — so cheap stages run cheap and only hard stages run premium:

```
agent("<the extract/parse task prompt>", { label: "extract", model: "haiku",  effort: "low"  })  // bulk parse
agent("<the main build task prompt>",    { label: "build",   model: "sonnet" })                  // main work (inherit effort)
agent("<the verify/judge task prompt>",  { label: "verify",  model: "fable",  effort: "max"  })  // ceiling: final judge / gate
```

The same opts object also takes `agentType` (reuse a registered subagent instead of re-describing
the role) and `isolation: 'worktree'` (parallel agents mutating the same files) — route those by
workload shape, not by cost.

This turns the routing table into an executed plan: the pipeline itself spends premium tokens only
on the verify/judge stage. Set the same tiers when spawning subagents by hand. Omit `model` when
unsure — the agent inherits the session model, which is usually correct.

## LEADERBOARDS AS REAL FILES (measured only — never fabricated)

Maintain a real leaderboard so routing improves from evidence, not vibes (Laws 4, 7).

- File: `$FU\memory\leaderboard.md`, where `$FU` is the fable-ultra home resolved per
  `knowledge/ai/fable5-discipline.md` §4. Append one row per completed task with
  **MEASURED** results only. Cost/latency are "approx" and only if actually observed; leave blank
  if unknown — never invent a benchmark number (Law 1). PowerShell first, POSIX equivalent below
  it — use whichever shell this container actually has:
  ```powershell
  $lb = "$FU\memory\leaderboard.md"
  if (-not (Test-Path $lb)) {
    Set-Content $lb "| date | task type | model | outcome | approx cost | approx latency |`n|---|---|---|---|---|---|" -Encoding utf8
  }
  Add-Content $lb "| $(Get-Date -Format yyyy-MM-dd) | <task type> | <model> | <pass/fail> | <or blank> | <or blank> |" -Encoding utf8
  ```
  ```sh
  lb="$FU/memory/leaderboard.md"; mkdir -p "$FU/memory"
  [ -f "$lb" ] || printf '| date | task type | model | outcome | approx cost | approx latency |\n|---|---|---|---|---|---|\n' > "$lb"
  printf '| %s | <task type> | <model> | <pass/fail> | <or blank> | <or blank> |\n' "$(date +%F)" >> "$lb"
  ```
- **Failure database** — keep a separate `## Failures` section (its own Markdown table) in the same
  file recording what model failed on what task type, so the router stops re-picking a model that
  provably fails a task class. Create the section header + table header once, then append valid
  table rows (leading/trailing pipes, matching column count) so they render inside that table:
  ```powershell
  if (-not (Select-String -Path $lb -Pattern '^## Failures' -Quiet)) {
    Add-Content $lb "`n## Failures`n| date | task type | model | what broke |`n|---|---|---|---|" -Encoding utf8
  }
  Add-Content $lb "| $(Get-Date -Format yyyy-MM-dd) | <task type> | <model> | <what broke> |" -Encoding utf8
  ```
  ```sh
  grep -q '^## Failures' "$lb" || printf '\n## Failures\n| date | task type | model | what broke |\n|---|---|---|---|\n' >> "$lb"
  printf '| %s | <task type> | <model> | <what broke> |\n' "$(date +%F)" >> "$lb"
  ```
- Before routing a new task, read the leaderboard and prefer models with a passing track record for
  that task type; avoid models listed under Failures for it.

## MULTI-MODEL COUNCIL (only for models actually connected)

For high-stakes or contested tasks, run N reachable models on the SAME prompt, then reconcile:

1. Confirm each council member is reachable (Claude tier via /model or Workflow agent; Ollama via
   `ollama list`; other provider via a connected key/MCP). Drop any that are not reachable — do not
   substitute a fabricated voice (Law 1).
2. Run the identical task on each member; collect answers verbatim.
3. **Reconcile:** where they agree, confidence is high. Where they disagree, do NOT average — treat
   each claim as a hypothesis and VERIFY it (run the code, check the source). Evidence decides, not
   a vote (Law 4). If it cannot be verified, present the disagreement to the user (Law 3).
4. Record each member's outcome to the leaderboard, and the reconciliation basis to the audit trail.

## NON-NEGOTIABLES

- No fabricated model output, no invented benchmarks, no fake latency/cost numbers (Laws 1, 4).
- If a chosen model is not actually reachable, STOP and report — never simulate it.
- Escalate only on a failed gate or stated low confidence — routine premium routing violates Law 8.
- Expensive routes (premium tiers at volume, paid third-party APIs, large multi-agent councils)
  check the `governance-core` budget BEFORE running and log the spend after — not just the hop.
- This skill picks the model; `model-max` maximizes it. Apply both together.
