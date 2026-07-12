---
name: model-max
description: Quality-forcing engine of the fable-ultra plugin. Makes the currently selected Claude model (Haiku, Sonnet, Opus, Fable 5, any tier) execute at its maximum achievable quality by enforcing strict process discipline — planning before work, one-item-at-a-time builds, verification by execution, and mandatory self-critique. Automatically loaded by the ultra-code skill at the start of every run. Also triggers when the user says "get maximum quality from this model", "work like a stronger model", "model max", or starts any substantive build, coding, or document task under fable-ultra.
---

# Model Max — Process Discipline Engine

**Principle (honest):** Process discipline narrows the quality gap between smaller and larger models substantially, because most agentic failures are process failures (skipped planning, unverified claims, lost state) — it does NOT change model weights or raw capability. Never claim otherwise.

## THE MAX LOOP (mandatory, in order)

1. **Restate + done-condition.** Before ANY work: restate the goal in one line, then write a measurable done-condition (e.g., "done = `pytest` exits 0 AND the report renders with all 5 sections").
2. **Load the domain checklist.** Load the matching fable-ultra domain skill: software-build / android-app / trading-bot / agent-system / mcp-connector / astrology-report / qs-works. Its checklist becomes part of the done-condition.
3. **Plan smaller than feels necessary.** Break work into items each completable AND verifiable in one step. If an item cannot be verified in one step, split it again.
4. **Build ONE item at a time.** After each item, VERIFY by actually executing — run the code, recalculate the spreadsheet, render the document. Re-reading your own output is NOT verification.
   ```powershell
   # Example: verify, don't assume (PowerShell)
   python .\script.py; if ($LASTEXITCODE -ne 0) { "ITEM FAILED - fix before next item" }
   ```
   ```sh
   # POSIX equivalent
   python script.py || echo "ITEM FAILED - fix before next item"
   ```
   In a Workflow, give verify/judge agents a higher reasoning **effort** than build agents
   (`effort: 'high'`/`'max'` on verify, `'low'` on mechanical items) — effort is a quality dial
   on the SAME model, applied before reaching for a bigger one.
5. **Self-critique pass.** After all items: find at least 3 concrete flaws in your own output and fix them. Repeat the critique until a pass finds zero real flaws. Maximum 3 passes — do not pad passes with fake flaws to hit the count; "concrete" means reproducible or pointable-to.
6. **Done = evidence.** Declare done ONLY when the step-1 done-condition is met AND you quote the execution evidence (command output, exit code, rendered result).
7. **Honest stop rule.** If the same defect survives 2 fix attempts, STOP. First retry once at higher reasoning effort on the same model; if it still fails, tell the user plainly: "This task may need a stronger model — escalate one tier (ceiling: Fable 5 at effort max). What failed: <specific defect and what was tried>." Never fake success, never silently narrow scope to dodge the failure.

## MEMORY HOOKS

- **Before starting:** read `memory/lessons.md` under the plugin install directory (resolve via `${CLAUDE_PLUGIN_ROOT}` when set) if it exists; apply any lesson relevant to this task type. Read it with the Read tool — no shell needed on any platform.
- **After finishing (success or stop):** append ONE dated lesson line — what worked / what failed.
  ```powershell
  $root = if ($env:CLAUDE_PLUGIN_ROOT) { $env:CLAUDE_PLUGIN_ROOT } else { "." }  # PS 5.1-safe
  Add-Content (Join-Path $root "memory\lessons.md") "$(Get-Date -Format yyyy-MM-dd) | <task type> | worked: <x> | failed: <y>" -Encoding utf8
  ```
  ```sh
  echo "$(date +%F) | <task type> | worked: <x> | failed: <y>" >> "${CLAUDE_PLUGIN_ROOT:-.}/memory/lessons.md"
  ```
  If the plugin directory is read-only on the current surface, append to `memory/lessons.md` in the project working directory instead and say so.

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

| Small-model failure mode | Countermeasure in this skill |
|---|---|
| Claims done without running anything | Steps 4 + 6: verify by execution, quote evidence |
| Loses the plan mid-task | Work-state block in `ultra-code-run.md`, re-read each step |
| Hallucinates an API / function signature | Step 4: execution surfaces it immediately; fix before next item |
| Takes on too-big steps and produces mush | Step 3: items sized to one verifiable step |
| One flawed pass, ships it | Step 5: minimum-3-flaw self-critique, up to 3 passes |
| Silently degrades scope when stuck | Step 7: honest stop rule, name what failed |
| Repeats past mistakes across runs | Memory hooks: lessons.md read before, appended after |

## NON-NEGOTIABLES

- No hype, no "now performing at Opus level" claims — only mechanisms listed here.
- Every "verified" statement must name the command run and its observed result.
- The stop rule outranks the desire to finish: a truthful stop beats a fake done.
