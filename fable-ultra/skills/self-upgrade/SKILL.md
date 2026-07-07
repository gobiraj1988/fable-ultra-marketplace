---
name: self-upgrade
description: Self-modification engine for the fable-ultra plugin. The plugin edits its own SKILL.md files, gated by before/after evaluation so only genuine improvements survive. Use when the user says "upgrade the plugin", "self upgrade", "improve fable-ultra", "self modify", or after a large ultra-code run reveals weaknesses worth folding back into the skills. Runs at most one upgrade cycle per user request, backs up every file it touches, and never edits safety rails.
---

# Self-Upgrade

Self-modification here means one concrete mechanism: this plugin edits its own SKILL.md files under eval gates — a real, working improvement loop and a foundation for increasingly autonomous systems, not literal AGI.
Never claim consciousness, general intelligence, or capabilities beyond editing these files.

## The Upgrade Loop (mandatory order — do not skip or reorder steps)

1. **Gather evidence.** Read `J:\fable 5\fable-ultra\memory\lessons.md`, the most recent `ultra-code-run.md` files in recent project working directories (ultra-code/model-max write them where the project runs, NOT under the plugin directory), and any user feedback in this conversation. List concrete failure observations (missed trigger, vague instruction, repeated mistake). No evidence = no upgrade; say so and stop.
2. **Pick exactly ONE weakest skill** this cycle, chosen by the evidence — the skill with the most/severest observations. Never guess, never pick two.
3. **Backup first.** Copy the target before touching it:
   ```powershell
   Copy-Item "J:\fable 5\fable-ultra\skills\<name>\SKILL.md" "J:\fable 5\fable-ultra\skills\<name>\<name>.bak.md" -Force
   ```
4. **Propose ONE focused edit** — a sharper trigger phrase, a better checklist item, a new countermeasure for an observed failure. Small diff (a few lines), never a rewrite. State the edit and the evidence line that justifies it before applying.
5. **Test.**
   - Validate the YAML frontmatter still parses (`---` fences intact, `name:` and `description:` present, no tabs).
   - Run a before/after eval: give the OLD and NEW skill text to 3 test scenarios (realistic user asks drawn from the evidence) and judge which version produces better instructions for each. Use the skill-creator plugin's eval machinery if installed; otherwise run a simple scripted 3-scenario comparison and record a winner per scenario.
6. **Keep only if the new version wins** (2 of 3 or better). Otherwise restore the backup and append the reason it lost to `lessons.md`:
   ```powershell
   Copy-Item "J:\fable 5\fable-ultra\skills\<name>\<name>.bak.md" "J:\fable 5\fable-ultra\skills\<name>\SKILL.md" -Force
   ```
7. **Version bump.** Edit `J:\fable 5\fable-ultra\.claude-plugin\plugin.json`: patch bump (x.y.Z+1) for tweaks, minor bump (x.Y+1.0) for a new capability. Append a dated entry to `J:\fable 5\fable-ultra\CHANGELOG.md` describing the edit and the eval result.
8. **Tell the user to reload:** `claude plugin update fable-ultra@fable-ultra-marketplace` (the marketplace-qualified name is required — the bare name fails with "not found").
9. **Report a short diff summary** to the user — which skill, what changed, eval score, new version. Never upgrade silently.

| Step | Gate | On failure |
|------|------|------------|
| 1-2  | Evidence exists for the chosen skill | Stop, report "no evidence" |
| 5    | Frontmatter parses AND new version wins eval | Restore backup, log reason |
| 7-9  | Version bumped, changelog written, user told | Cycle is not complete until all three done |

## Immutable Safety Rails

This skill must NEVER edit, weaken, or remove any of the following, in ANY skill file:

- Paper-mode-default for trading.
- Human confirmation for live orders, money movement, or destructive actions.
- No fabricated connector output or fake results.
- Loop termination ceilings.

If a proposed edit touches any line implementing one of these, abort that edit, restore the backup if already applied, and tell the user which rail blocked it. These rails also apply to this file itself.

## Frequency Guard

- Maximum ONE upgrade cycle per user request.
- Never chain upgrade cycles autonomously — even if step 1 surfaced multiple weak skills, list the rest as candidates for a future request and stop.

## Example Cycle

1. Evidence: `lessons.md` shows ultra-code missed "refactor this module" twice as a trigger.
2. Target: `skills/ultra-code/SKILL.md` (weakest by evidence). Backup written to `ultra-code.bak.md`.
3. Edit: add "refactor this module/file" to the description's trigger phrases — 1-line diff.
4. Eval: 3 scenarios ("refactor this module", "clean up utils.py", unrelated ask). New version wins 3/3 (triggers correctly, no false positive).
5. Keep. Bump plugin.json 1.2.3 -> 1.2.4, add CHANGELOG entry dated today.
6. Report: "ultra-code triggers sharpened (1-line diff), eval 3/3, v1.2.4 — run `claude plugin update fable-ultra@fable-ultra-marketplace`."
