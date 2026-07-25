---
name: model-max
description: Quality-forcing engine of the fable-ultra plugin. Makes the currently selected Claude model (Haiku, Sonnet 5, Opus, Fable 5 — any tier) execute at Fable-5-grade discipline by enforcing strict process — planning before work, one-item-at-a-time builds, verification by execution, and mandatory adversarial critique. Automatically loaded by the ultra-code skill at the start of every run. Also triggers when the user says "get maximum quality from this model", "work like a stronger model", "work like Fable 5", "model max", or starts any substantive build, coding, or document task under fable-ultra. Do NOT load for quick questions, single-file edits, or when ultra-code already loaded it this run (no double-loading). Complements model-router — that skill picks WHICH model, this one maximizes whichever is selected.
---

# Model Max — Process Discipline Engine

**Principle (honest):** Process discipline narrows the quality gap between smaller and larger models substantially, because most agentic failures are process failures (skipped planning, unverified claims, lost state) — it does NOT change model weights or raw capability. Never claim otherwise.

This skill is the enforcement arm of the shared contract in
`knowledge/ai/fable5-discipline.md` — read it once per session; it defines the evidence format,
current model tiers, the portable fable-ultra home (`$FU`), and orchestration defaults used below.

## THE MAX LOOP (mandatory, in order)

0. **Detect tier + load the overlay.** Before ANY work: identify the active tier for this run
   (the session model — Sonnet 5 / Opus 4.8 / Fable 5 / Haiku) and load the matched countermeasure
   row from `knowledge/ai/fable5-discipline.md` §0. Apply that row throughout this loop — it is the
   single biggest lever for closing the gap to a stronger tier. If the tier is unknown, assume
   **Sonnet 5** (the default build tier) and apply its row.
1. **Restate + done-condition.** Before ANY work: restate the goal in one line, then write a measurable done-condition (e.g., "done = `pytest` exits 0 AND the report renders with all 5 sections").
2. **Load the domain checklist.** Load the matching fable-ultra domain skill: software-build / android-app / trading-bot / agent-system / mcp-connector / astrology-report / qs-works. Its checklist becomes part of the done-condition.
3. **Plan smaller than feels necessary.** Break work into items each completable AND verifiable in one step. If an item cannot be verified in one step, split it again. **Opus overlay:** before adding any new component/abstraction, ask "is the boring, smaller fix sufficient here?" — default to yes and flag the choice if you go bigger.
4. **Build ONE item at a time.** After each item, VERIFY by actually executing — run the code, recalculate the spreadsheet, render the document. Re-reading your own output is NOT verification. **Sonnet overlay:** at the start of each item, re-derive the current plan and work-state from the on-disk `ultra-code-run.md` (discipline §7) — do not trust the conversational plan, which drifts on long runs.
   ```powershell
   # Example: verify, don't assume
   python .\script.py; if ($LASTEXITCODE -ne 0) { "ITEM FAILED - fix before next item" }
   ```
5. **Adversarial critique pass.** After all items: the reviewer must be **independent** of the builder — spawn a fresh-context verifier subagent (Agent tool or a Workflow `agent()` with a structured verdict schema), give it the goal + the diff but NOT the builder's reasoning, prompt it to REFUTE the work, and default to fail when uncertain. Independence is the point: a verifier that read the builder's own thinking is no longer independent. When a subagent is genuinely unavailable, fall back to self-critique: find at least 3 concrete flaws and fix them, repeating until a pass finds zero real flaws. Maximum 3 passes either way — do not pad passes with fake flaws to hit the count; "concrete" means reproducible or pointable-to. **Opus overlay:** "this reasoning is clearly right" is not evidence — re-run it. **Sonnet/Haiku overlay:** the verifier subagent should run at a stronger tier than the builder where affordable (verify is the high-leverage stage).
6. **Done = evidence — fresh this turn.** Declare done ONLY when the step-1 done-condition is met AND you quote the execution evidence (command output, exit code, rendered result) **from a run executed in this turn**. A result remembered from an earlier iteration is a premature-done and is rejected (discipline §5).
7. **Honest stop rule.** If the same defect survives 2 fix attempts, STOP. Tell the user plainly: "This task may need a stronger model. What failed: <specific defect and what was tried>." Hand the escalation decision to `model-router` (escalate ONE tier on a real signal only). Never fake success, never silently narrow scope to dodge the failure.

## BUDGET CAPS (keep discipline from becoming waste)

- Verification retries: max 2 per item (then the stop rule fires). Critique passes: max 3.
- If the user set a token target, respect it (`budget.remaining()` in Workflows); otherwise the
  iteration ceiling in `ultra-code` (10) is the backstop.

## MEMORY HOOKS

Resolve the fable-ultra home `$FU` per `knowledge/ai/fable5-discipline.md` §4 (env var →
legacy `J:\fable 5\fable-ultra` → `%USERPROFILE%\.fable-ultra`).

- **Before starting:** read `$FU\memory\lessons.md` if it exists; apply any lesson relevant to this task type.
  ```powershell
  if (Test-Path "$FU\memory\lessons.md") { Get-Content "$FU\memory\lessons.md" }
  ```
- **After finishing (success or stop):** append ONE dated lesson line — what worked / what failed.
  ```powershell
  Add-Content "$FU\memory\lessons.md" "$(Get-Date -Format yyyy-MM-dd) | <task type> | worked: <x> | failed: <y>" -Encoding utf8
  ```
- If `lessons.md` exceeds ~200 lines, summarize the oldest half into `lessons-archive.md` first.

## CONTEXT HYGIENE (critical for smaller models)

Maintain a running work-state block in `ultra-code-run.md` in the project working directory. Update it after EVERY item; re-read it at the start of EVERY step instead of trusting conversational memory. Format:

```markdown
## WORK STATE (updated after each item)
GOAL: <one line from step 1>
DONE-CONDITION: <from step 1>
DONE: item 1 (verified: pytest 4 passed), item 2 (verified: page renders)
DOING: item 3 - wire the export button
NEXT: item 4, item 5, self-critique pass
```

If context feels lost or the plan is fuzzy, re-read `ultra-code-run.md` FIRST — never reconstruct the plan from memory.

## FAILURE MODE → COUNTERMEASURE

| Failure mode (by tier) | Countermeasure in this skill |
|---|---|
| Sonnet: claims done from an earlier run's memory | Step 0 (Sonnet overlay) + Step 6: fresh-this-turn re-run before any done-claim |
| Sonnet: loses the plan mid-task | Step 0 (Sonnet overlay) + Step 4: re-derive plan/state from `ultra-code-run.md` each step |
| Opus: over-architects routine work | Step 0 (Opus overlay) + Step 3: smallest-sufficient-design guard |
| Opus: trusts confident reasoning over a re-run | Step 0 (Opus overlay) + Step 5: re-run beats reasoning |
| Any tier: claims done without running anything | Steps 4 + 6: verify by execution, quote fresh evidence |
| Any tier: hallucinates an API / function signature | Step 4: execution surfaces it immediately; fix before next item |
| Any tier: takes on too-big steps and produces mush | Step 3: items sized to one verifiable step |
| Any tier: one flawed pass, ships it | Step 5: independent REFUTE verifier (no builder reasoning), up to 3 passes |
| Any tier: silently degrades scope when stuck | Step 7: honest stop rule, name what failed |
| Any tier: repeats past mistakes across runs | Memory hooks: lessons.md read before, appended after |

## NON-NEGOTIABLES

- No hype, no "now performing at Opus level" claims — only mechanisms listed here.
- Every "verified" statement must name the command run and its observed result.
- The stop rule outranks the desire to finish: a truthful stop beats a fake done.
