---
name: model-router
description: System A of fable-ultra V3 OMEGA — the model router. Chooses the most cost-appropriate model for a task by weighing complexity, cost, latency, accuracy need, and risk, then routes to it (Fable 5, Opus, Sonnet, Haiku via /model; local models via Ollama; other providers only through a connected API key or MCP connector). Triggers when the user says "which model should I use", "route this", "pick the cheapest model that works", "escalate to a stronger model", "run a multi-model council", "route among my models", or "model router". Governed by the omega-constitution skill (the 10 OMEGA Laws). Complements model-max — model-router picks WHICH model, model-max squeezes maximum quality out of whichever one is picked; if the user wants "best output from this model" and not a routing decision, defer to model-max.
---

# Model Router — System A (cost-first model selection)

Governed by `omega-constitution` (10 OMEGA Laws). Load it first. Law 8 (optimize cost) and
Law 1 (never fabricate) drive this skill: route to the CHEAPEST model that still passes the
task's gates, and never pretend to call a model you cannot actually reach.

## HONEST REALITY (what you can and cannot route to)

- **Directly routable now:** the Claude models the user has enabled in this session — **Fable 5**
  (`claude-fable-5`, Mythos-class, a full tier ABOVE Opus), **Opus 4.8** (`claude-opus-4-8`),
  **Sonnet 5** (`claude-sonnet-5`), **Haiku 4.5** (`claude-haiku-4-5-20251001`) — switched with
  the `/model` command. You cannot silently switch mid-turn; recommend the tier and tell the user
  the `/model` value to set, or set per-agent in a Workflow (`model: 'haiku'|'sonnet'|'opus'|'fable'`).
- **Second dial — reasoning EFFORT:** besides the model tier, each Workflow `agent()` call takes
  `effort: 'low'|'medium'|'high'|'xhigh'|'max'`. Route BOTH dials: cheap mechanical stages get a
  cheap model at `effort:'low'`; the hardest verify/judge stages get a premium model at high
  effort. Raising effort on the SAME model is often cheaper than hopping a tier — try it first.
- **Latency lever — fast mode:** `/fast` (Opus 4.8/4.7) is faster OUTPUT on Opus, NOT a downgrade
  to a smaller model. Use it for latency-sensitive work; do not classify it as a cost tier.
- **Local, if installed:** models served by **Ollama** (e.g. `llama3.1`, `qwen2.5`, `mistral`,
  `phi`). Not present on ephemeral remote containers. Confirm before claiming availability
  (same command in PowerShell or a POSIX shell):
  ```sh
  ollama list   # if this errors, Ollama is not installed — say so, do not fake a local route
  ```
- **Other providers (GPT, Gemini, Qwen-cloud, DeepSeek, Mistral-cloud, Llama-cloud, MythoMax):**
  reachable ONLY if the user has connected an **API key or MCP connector** for them. If none is
  connected, STOP and report: "No connector for <provider> — connect an API key/MCP server or pick
  a reachable model." Never emit fabricated output as if it came from an unconnected model (Law 1).

## ROUTING TABLE (task shape -> recommended tier)

| Task shape | Route to | Effort | Why |
|---|---|---|---|
| Mechanical / bulk (rename, reformat, extract, classify, boilerplate) | **Haiku** or a small **Ollama** local | low | Cheapest; quality is sufficient |
| Standard build / reasoning (feature code, refactor, normal docs, analysis) | **Sonnet** | medium | Best cost/quality balance for most work |
| Hard reasoning / architecture / deep debugging | **Opus** | high | Premium reasoning below the ceiling |
| Hardest judge / final verify / ambiguous spec / one-shot-must-be-right | **Fable 5** | high–max | The ceiling tier; spend it only where it moves the outcome |
| Privacy-sensitive / offline / no-cloud-egress | **Ollama** local only | — | Data never leaves the machine |
| High-stakes + disagreement risk | **multi-model council** (see below) | — | Reconcile independent answers |

Pick the LOWEST row that plausibly clears the done-condition. Do not default to premium.

## ESCALATION CHAIN (the cost-saver — escalate only on a real signal)

`small (Haiku/local) -> mid (Sonnet) -> premium (Opus) -> ceiling (Fable 5) -> multi-model council`

Cheapest first hop: raise **effort** one notch on the CURRENT model before hopping a tier — a
failed gate often clears at the same tier with more reasoning effort.

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

In a `Workflow`, set BOTH dials per agent via the `agent(prompt, opts)` call — the task prompt is
a STRING first, then an opts object with `label`, `model`, `effort`, and `schema` (same signature
as `scripts/ultra-code-workflow.js`; opts also take `agentType` and `isolation:'worktree'` for
parallel file-mutating agents) — so cheap stages run cheap and only hard stages run premium:

```
agent("<the extract/parse task prompt>", { label: "extract", model: "haiku",  effort: "low"  })  // bulk parse
agent("<the main build task prompt>",    { label: "build",   model: "sonnet" })                  // main work (inherit effort)
agent("<the verify/judge task prompt>",  { label: "verify",  model: "fable",  effort: "max"  })  // final judge / gate
```

This turns the routing table into an executed plan: the pipeline itself spends premium tokens only
on the verify/judge stage. Set the same tiers when spawning subagents by hand. Omit `model` when
unsure — the agent inherits the session model, which is usually correct.

## LEADERBOARDS AS REAL FILES (measured only — never fabricated)

Maintain a real leaderboard so routing improves from evidence, not vibes (Laws 4, 7).

- File: `memory/leaderboard.md` under the plugin install directory (resolve via
  `${CLAUDE_PLUGIN_ROOT}` when set; fall back to the project working directory on surfaces where
  the plugin dir is read-only). Append one row per completed task with **MEASURED** results only.
  Cost/latency are "approx" and only if actually observed; leave blank if unknown — never invent
  a benchmark number (Law 1). PowerShell shown; POSIX equivalent is a plain `[ -f ]`/`cat >>`.
  ```powershell
  $root = if ($env:CLAUDE_PLUGIN_ROOT) { $env:CLAUDE_PLUGIN_ROOT } else { "." }  # PS 5.1-safe
  $lb = Join-Path $root "memory\leaderboard.md"
  if (-not (Test-Path $lb)) {
    Set-Content $lb "| date | task type | model | outcome | approx cost | approx latency |`n|---|---|---|---|---|---|" -Encoding utf8
  }
  Add-Content $lb "| $(Get-Date -Format yyyy-MM-dd) | <task type> | <model> | <pass/fail> | <or blank> | <or blank> |" -Encoding utf8
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
- This skill picks the model; `model-max` maximizes it. Apply both together.
