---
name: self-upgrade
description: Self-modification engine for the fable-ultra plugin. The plugin edits its own SKILL.md files, gated by before/after evaluation so only genuine improvements survive. Use when the user says "upgrade the plugin", "self upgrade", "improve fable-ultra", "self modify", or after a large ultra-code run reveals weaknesses worth folding back into the skills. Do NOT trigger for editing user project files, creating an ordinary new skill (defer to skill-factory), or monitoring metrics/health (defer to meta-brain). Runs at most one upgrade cycle per user request, backs up every file it touches, and never edits safety rails.
---

# Self-Upgrade

Self-modification here means one concrete mechanism: this plugin edits its own SKILL.md files under eval gates — a real, working improvement loop and a foundation for increasingly autonomous systems, not literal AGI.
Never claim consciousness, general intelligence, or capabilities beyond editing these files.

Process discipline follows the shared contract in `knowledge/ai/fable5-discipline.md` (plan-first, verify-by-execution evidence format `<command> -> exit <code> -> "<output>"`, independent critique, `$FU` portable home) — apply it, don't restate it.
`$FU` below is the plugin home, resolved per the discipline doctrine section 4 (env `FABLE_ULTRA_HOME` -> legacy `J:\fable 5\fable-ultra` if present -> `%USERPROFILE%\.fable-ultra`).

## The Upgrade Loop (mandatory order — do not skip or reorder steps)

1. **Gather evidence.** Read `$FU\memory\lessons.md`, the most recent `ultra-code-run.md` files in recent project working directories (ultra-code/model-max write them where the project runs, NOT under the plugin directory), and any user feedback in this conversation. List concrete failure observations (missed trigger, vague instruction, repeated mistake). **Tag each observation by the tier it occurred on** (Sonnet/Opus/Fable/Haiku) when known — recurring same-tier failures are the signal that a tier-calibrated overlay row (discipline §0) needs sharpening, and the overlay file is now a first-class upgrade target alongside any SKILL.md. No evidence = no upgrade; say so and stop.
2. **Pick exactly ONE weakest target** this cycle, chosen by the evidence — the skill OR the discipline overlay file (`knowledge/ai/fable5-discipline.md` §0) with the most/severest observations. Never guess, never pick two.
3. **Backup first — OUTSIDE the target's own folder.** Resolve the target path `$TARGET` — for a skill it is `$FU\skills\<name>\SKILL.md`; for the discipline overlay it is `$FU\knowledge\ai\fable5-discipline.md`. Backups must never live in a skill directory (a lingering `.bak.md` there can be scanned as a skill), so the backup always goes to the upgrade-backups folder. Before copying, if a pre-existing backup exists at the destination or a stray `*.bak.md` sits inside any `skills\<name>\` folder, it is debris from an interrupted cycle: move it to `$FU\memory\upgrade-backups\archive\<name>.<yyyyMMdd-HHmmss>.bak.md`, then:
   ```powershell
   New-Item -ItemType Directory -Force "$FU\memory\upgrade-backups" | Out-Null
   # $TARGET resolved per step 3 (a SKILL.md, or the discipline overlay file)
   Copy-Item "$TARGET" "$FU\memory\upgrade-backups\<slug>.bak.md" -Force
   ```
   where `<slug>` identifies the target (e.g. `ultra-code.SKILL` or `fable5-discipline`).
4. **Propose ONE focused edit** — a sharper trigger phrase, a better checklist item, a new countermeasure for an observed failure, or a refined tier row in the overlay table. Small diff (a few lines), never a rewrite. State the edit and the evidence line that justifies it. Then **consult governance-core** (self-modification is a gated action) — apply only on ALLOW; on BLOCK or NEEDS-APPROVAL stop, restore nothing (nothing applied yet), and report the verdict.
5. **Test — adversarial, blind.**
   - Validate the YAML frontmatter still parses (`---` fences intact, `name:` and `description:` present, no tabs, no colon+space inside the description value).
   - Before/after eval on 3 realistic scenarios drawn from the evidence. For each scenario, dispatch one structured-output subagent per version (OLD and NEW skill text) to produce the instructions each version would give. Randomize labels per scenario ("Version A"/"Version B") and pass both outputs to a separate blind judge subagent that is NOT told which is old vs new; the judge returns structured `{winner, reason}`. Unblind only after all 3 verdicts are in and record them.
6. **Keep only if the new version wins** (2 of 3 or better). Otherwise restore the backup and append the reason it lost to `lessons.md`:
   ```powershell
   # $TARGET resolved in step 3; <slug>.bak.md written in step 3
   Copy-Item "$FU\memory\upgrade-backups\<slug>.bak.md" "$TARGET" -Force
   ```
7. **Version bump.** Edit `$FU\.claude-plugin\plugin.json`: patch bump (x.y.Z+1) for tweaks, minor bump (x.Y+1.0) for a new capability. Append a dated entry to `$FU\CHANGELOG.md` describing the edit and the eval result.
8. **Tell the user to reload:** `claude plugin update fable-ultra@fable-ultra-marketplace` (the marketplace-qualified name is required — the bare name fails with "not found").
9. **Close out.** Append one cycle record to `$FU\memory\upgrade-audit.md` (date, target skill, evidence lines, governance-core verdict, blinded eval verdicts, kept/reverted, version). Then delete the cycle's backup from `$FU\memory\upgrade-backups\` — the audit trail and CHANGELOG are the durable record; no `.bak.md` may outlive its cycle. Report a short diff summary to the user — which skill, what changed, eval score, new version. Never upgrade silently.

| Step | Gate | On failure |
|------|------|------------|
| 1-2  | Evidence exists for the chosen skill | Stop, report "no evidence" |
| 4    | governance-core returns ALLOW | Stop, report verdict |
| 5    | Frontmatter parses AND new version wins blind eval | Restore backup, log reason |
| 7-9  | Version bumped, changelog + audit written, backup deleted, user told | Cycle is not complete until all done |

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
2. Target: `skills/ultra-code/SKILL.md` (weakest by evidence). Backup written to `$FU\memory\upgrade-backups\ultra-code.SKILL.bak.md`.
3. Edit: add "refactor this module/file" to the description's trigger phrases — 1-line diff. governance-core consulted -> ALLOW.
4. Eval: 3 scenarios ("refactor this module", "clean up utils.py", unrelated ask), subagents per version, blind judge. New version wins 3/3 (triggers correctly, no false positive).
5. Keep. Bump plugin.json 1.2.3 -> 1.2.4, add CHANGELOG entry dated today.
6. Close out: audit record appended to `upgrade-audit.md`, backup deleted. Report: "ultra-code triggers sharpened (1-line diff), eval 3/3, v1.2.4 — run `claude plugin update fable-ultra@fable-ultra-marketplace`."
