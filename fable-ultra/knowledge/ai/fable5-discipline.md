# FABLE-5 DISCIPLINE — the model-agnostic execution contract (v5.0)

Every fable-ultra skill inherits this contract. It is what makes ANY Claude model —
Haiku, Sonnet, Opus, or Fable — execute with Fable-5-grade discipline. Honest mechanism: process
rigor closes most of the gap because most agentic failures are process failures; it does not
change model weights. Skills reference this file instead of restating it.

## 0. Tier-calibrated overlay (the v5 advance — load this FIRST)

Process failures are NOT tier-agnostic: each tier has a characteristic way it fails on its own.
The contract below is universal; this overlay adds the countermeasure for THIS run's tier. Every
engine (`model-max`, `ultra-code`, `model-router`) loads it after detecting the active tier and
applies the matched row throughout the run.

| Tier | Its characteristic solo failure | Overlay countermeasure (applied every run) |
|---|---|---|
| **Sonnet 5** (default build tier) | Asserts "done" from memory of an earlier run; loses the plan on long horizons | **Fresh re-run gate** (§5) + **re-derive plan/state from the on-disk `ultra-code-run.md` at the start of each step** (§7) |
| **Opus 4.8** | Over-architects routine work; trusts confident reasoning over a re-run; agreeable when it should push back | **Smallest-sufficient-design guard** (prefer the boring fix; flag any new abstraction) + **re-run beats reasoning** (a fresh check outranks a confident argument) + **steel-man disagreement** before agreeing |
| **Fable 5** | Highest raw capability solo — but no *forced* adversarial verify, no externalized state, no cross-run memory | **Still force** independent adversarial verify + on-disk work-state + lessons memory — these are what fable-ultra adds over solo Fable |
| **Haiku 4.5** | Formatting slips; loses multi-step coherence | Keep stages mechanical and narrow; one JSON-schema output per call; escalate early on ambiguity |

The defensible, sharply-honest claim this overlay makes real: **on multi-step *verifiable* build
loops, Sonnet 5 or Opus 4.8 running fable-ultra's scaffolding can match-or-exceed a *solo* Fable 5,
because on exactly those tasks process/verification failures dominate over raw-reasoning failures.**
It does not claim parity on one-shot raw reasoning — there Fable still wins — and it does not
change any model's weights (OMEGA Law 1: never fabricate).

## 1. The contract (all skills, all models)

1. **Plan first.** Write the work-list + measurable done-condition BEFORE any build step.
2. **One item at a time.** Each item completable AND verifiable in one step; split until true.
3. **Verify by execution.** Run it. Re-reading your own output is not verification.
4. **Independent critique.** For non-trivial work, the reviewer must not be the builder's own
   context: spawn a verifier subagent (structured output, prompted to REFUTE, and given the goal +
   diff but NOT the builder's reasoning), or at minimum a fresh self-critique pass that must find
   concrete, pointable-to flaws. Independence is the point — a verifier that read the builder's
   thinking is no longer independent.
5. **Done = evidence — and the evidence must be FRESH THIS TURN.** Quote the command, exit code,
   and output snippet in the ONLY accepted format (OMEGA Law 2):
   `<command> → exit <code> → "<observed output>"`. The command must have been run in the current
   turn; a done-claim citing a result you remember from an earlier turn/iteration is a Sonnet-style
   premature-done and is rejected. No test harness available? State exactly what was and wasn't
   executed this turn — never imply a run.
6. **Honest stop.** Same defect survives 2 fix attempts → stop, name what failed and what was
   tried, and consult `model-router` for an escalation decision. Never fake success or silently
   narrow scope.

## 2. Current model reality (verify at run time — IDs go stale)

| Tier | Model ID | Workflow `model:` | Use for |
|---|---|---|---|
| Frontier | `claude-fable-5` (Mythos-class, above Opus) | `fable` | hardest reasoning, final judge |
| Premium | `claude-opus-4-8` (supports /fast mode) | `opus` | architecture, ambiguous specs, verify |
| Mid | `claude-sonnet-5` | `sonnet` | standard build work — default tier |
| Small | `claude-haiku-4-5-20251001` | `haiku` | mechanical/bulk stages |

Also route **reasoning effort** per stage where the harness supports it
(`effort: 'low'|'medium'|'high'|'xhigh'|'max'`): low for mechanical stages, high+ only for the
hardest verify/judge stages. Before hardcoding any ID in product code, consult the `claude-api`
skill — never trust remembered IDs.

## 3. Orchestration defaults (Workflow tool)

- `pipeline()` over `parallel()` barriers; `schema` on every data-returning `agent()` call.
- Adversarial verify: verifier agents are prompted to REFUTE, default to fail when uncertain.
- Budget guards: `while (budget.total && budget.remaining() > 50_000)`; hard iteration ceilings
  (default 10); loop-until-dry (2 empty rounds) — never an unguarded loop.
- Sub-workflows via `workflow()` for phases that are themselves saved pipelines (1 level max).
- Multi-agent runs require user opt-in (invoking ultra-code or saying "workflow"/"ultracode").

## 4. Portable home — no hardcoded machine paths

Run artifacts (lessons, leaderboard, metrics, governance ledger, knowledge lake) live in the
**fable-ultra home**, resolved in this order:

```powershell
$FU = if ($env:FABLE_ULTRA_HOME) { $env:FABLE_ULTRA_HOME }
      elseif (Test-Path 'J:\fable 5\fable-ultra') { 'J:\fable 5\fable-ultra' }  # legacy home
      else { Join-Path $env:USERPROFILE '.fable-ultra' }
if (-not (Test-Path $FU)) { New-Item -ItemType Directory -Force $FU | Out-Null }
```

Skills say "the fable-ultra home (`$FU`)" and use `$FU\memory\lessons.md`,
`$FU\memory\leaderboard.md`, `$FU\memory\metrics.md`, `$FU\governance\`, `$FU\knowledge\`.
Never write run artifacts into the installed plugin directory — installs can be read-only or
replaced on update.

## 5. Memory hooks (all substantive runs)

Read `$FU\memory\lessons.md` before starting (apply relevant lessons); append ONE dated line
after finishing — success or stop. If the file exceeds ~200 lines, summarize the oldest half
into `$FU\memory\lessons-archive.md` first; a bloated journal stops being read.

## 6. Governance hooks

Before any irreversible, outward-facing, or paid action (delete, send, publish, live trade,
money movement, paid API spend, large multi-agent run): consult `governance-core` →
ALLOW / BLOCK / NEEDS-APPROVAL. OMEGA Law 10: human confirmation per action, never inside an
autonomous loop. Trading is paper-mode by default everywhere, no exceptions.

## 7. Resume-safe reconstruction (after any context break)

A context compaction, a new session, or a `resumeFromRunId` that mismatches the stored goal are
all the same event: **conversational memory is no longer trustworthy.** Before continuing any
in-progress run, reconstruct state from durable artifacts, not from memory:

1. Re-read the on-disk `ultra-code-run.md` (the WORK STATE block — goal, done-condition, done/doing/next).
2. Re-check the reconstructed goal against the **original** user goal; on mismatch, start fresh
   — never splice a remembered plan onto a different goal.
3. Re-derive the live work-list from the WORK STATE block, then re-VERIFY the most recent "done"
   item with a fresh run this turn (§5) before building on it.
4. Only then continue BUILD.

Never resume by trusting a carried-forward "we already did X" — re-establish it from disk. This
is the single biggest defense against Sonnet-style context-loss and against stale-plan splicing
on `resumeFromRunId`.
