---
name: skill-factory
description: The Skill Factory and Plugin Factory for fable-ultra V3 OMEGA (Systems C + P). Use when a task needs a capability that no installed skill covers — the missing-capability signal — and the right fix is a reusable asset, not a one-off answer. Triggers on "make a skill for this", "create/generate a skill", "the plugin should be able to X but can't", "add a command/MCP/template to fable-ultra", "build a plugin asset", or when ultra-code/meta-brain detect a recurring task with no matching skill. It CREATES and ships assets; it does not edit existing skills to improve them — that is self-upgrade. It does not build agent products for end users — that is agent-system, and it does not manage least-privilege subagents — that is agent-factory. Prefer invoking the installed skill-creator plugin skill for best-practice structure and evals when present.
---

# Skill Factory / Plugin Factory (Systems C + P)

Governed by `omega-constitution` (the 10 OMEGA Laws). The Laws win over any rule here: never fabricate, never claim done without verification (Law 05), evidence > confidence, verification > generation, reusable > temporary (Law 06), store lessons. This factory manufactures capability; it NEVER generates away a safety rail to make a task pass.

The shared discipline contract `knowledge/ai/fable5-discipline.md` (plan-first, verify-by-execution evidence in the format `<command> -> exit <code> -> "<output>"`, independent critique, `$FU` portable home) applies to every stage below and is not restated here. `$FU` is the fable-ultra home, resolved per discipline doctrine section 4 — env `FABLE_ULTRA_HOME`, else the legacy home if present, else `%USERPROFILE%\.fable-ultra` on Windows / `$HOME/.fable-ultra` on Linux/macOS. §4 gives both the PowerShell 5.1-safe and the POSIX resolution; run whichever matches this session's shell (remote containers are Linux and have no PowerShell), and prefer `CLAUDE_PLUGIN_ROOT` for reading plugin-shipped files when the harness sets it.

## 1. DETECT — recognize the missing-capability signal

Create a new asset only when ALL of these hold; otherwise answer inline (Law 06 favors reuse, not premature scaffolding):

| Signal | Check |
|--------|-------|
| No matching skill | Task maps to none in `skills/` (cross-check the constitution's 19-system map) |
| Reusable | The capability will recur, not a one-time answer |
| In scope | A skill/command/template/MCP config can actually deliver it in Claude Code |
| Mechanism exists | Every planned step maps to a REAL mechanism (below); no external API is faked |

Real mechanisms only: local files, subagents (adversarial reviewers), the Workflow tool for multi-stage runs, MCP connectors that are actually connected, and Ollama for local models. If the capability needs an external API/connector that is NOT connected, STOP and report the exact setup step (per the `.mcp.json` rule) — never simulate connector output.

## 2. PLAN — gate BEFORE any drafting (plan-first, per the discipline contract)

Between DETECT and GENERATE, produce a one-page plan and get it gated. No SKILL.md text is written until the gate passes.

1. **Trigger boundary** — the exact phrases that fire the new skill AND 2–3 near-miss phrases that must NOT fire it (name the existing skill each near-miss belongs to).
2. **Section outline** — the numbered headings the skill will carry, one line of intent each.
3. **Mechanism map** — a table mapping every planned step to a real mechanism from section 1; one unmapped step kills the plan.

Gate — interactive run: human approves the plan. Autonomous run: the structured-output reviewer of section 4 reviews the PLAN itself and must return verdict PASS.

## 3. GENERATE the SKILL.md

1. **Prefer skill-creator.** If the `skill-creator` plugin skill is installed, invoke it for the
   scaffold, best-practice structure, and eval harness. If absent, follow this template directly.
2. **Choose a kebab-case `<name>`** and create `$FU\skills\<name>\SKILL.md`.
3. **Write valid YAML frontmatter** — `---`, `name: <name>`, `description:` (one paragraph, packed
   with concrete trigger phrases, and noting if it defers to or differs from a similarly-named
   existing skill), `---`. No tabs, no `: ` inside an unquoted description, and the description
   must stay **<= 1024 characters** (see the section 7 length gates). Then a concrete, imperative,
   numbered body with tables — never a vague essay.
4. **Inherit the rails.** Every generated skill defers to `omega-constitution`, keeps human
   approval for irreversible actions, and states its required connectors + the STOP-and-report
   behavior when they are absent.

## 4. TEST + VERIFY — mandatory (Law 05, verification > generation)

Never register an unverified skill. Run all four gates; prove each pass with execution evidence in the discipline format.

1. **Frontmatter parses + fits the caps** — run the section 7 validator (POSIX or PowerShell form, whichever this session's shell supports). Must print `OK`; it also fails the over-length descriptions (1024 / 500).
2. **Adversarial review** — spawn a structured-output subagent whose ONLY job is to REFUTE the draft against 2–3 realistic user scenarios (wrong triggers, impossible claims, faked connector output, missing rails, steps that cannot run). It must return findings as `{location, severity HIGH|MED|LOW, summary, failure_scenario}` plus an overall verdict PASS|FAIL — a prose-only review is invalid, re-run it. Fix every HIGH/MED finding. Budget ceiling — max 3 review-fix iterations; if HIGH findings persist after 3, STOP and report BLOCKED rather than looping.
3. **Live smoke test** — exercise the skill on ONE real scenario, not just text review: invoke the new skill if already loadable, otherwise hand a FRESH subagent only the SKILL.md file plus the scenario and have it dry-run the steps. Pass = the subagent completes the scenario using only real mechanisms; any faked output or dead instruction fails the gate.
4. **No impossible claims** — no literal-AGI/consciousness claims, no fabricated benchmarks, no "trains frontier models". Reject any such line before shipping.

| Gate | Pass condition | On failure |
|------|----------------|------------|
| Parse | Validator prints `OK` (incl. 1024/500 length caps) | Fix YAML or trim the description, re-run |
| Adversarial | Verdict PASS, zero open HIGH/MED, within 3 iterations | Edit skill, re-review; BLOCKED after 3 |
| Smoke | Fresh subagent completes the real scenario from the file alone | Fix the dead step, re-run |
| Claims | Zero impossible/fabricated claims | Delete the claim, re-verify |

If any gate cannot pass, do NOT register. Report BLOCKED with the reason.

## 5. VERSION + REGISTER + PUBLISH

Skills auto-register by living in `skills/<name>/SKILL.md` — no registry edit needed. Then:

1. **Version bump** `$FU\.claude-plugin\plugin.json` — minor bump (x.Y+1.0) for a
   new skill/capability, patch (x.y.Z+1) for a small template/asset.
2. **Append a dated entry** to `$FU\CHANGELOG.md` naming the new asset and its
   verification result.
3. **Tell the user to reload** — the marketplace-qualified name is REQUIRED (the bare name fails
   with "not found"):
   ```
   claude plugin update fable-ultra@fable-ultra-marketplace
   ```
4. **Human approval before publishing** beyond this repo (Law 10) — pushing to a shared marketplace or remote is irreversible; confirm per-action, never inside an autonomous loop.

## 6. PLUGIN FACTORY extension (System P)

The same DETECT → PLAN → GENERATE → VERIFY → VERSION pipeline emits other plugin assets:

| Asset | Location | Verify |
|-------|----------|--------|
| Command | `commands/<name>.md` | Parses; dry-run the described action |
| MCP server config | `.mcp.json` (stdio/Windows-friendly) | STOP if the server is not actually connected; never fake its output |
| Prompt pack | `skills/<name>/prompts/` or a template file | Adversarial review as in section 4 |
| Template | `skills/<name>/templates/` | Fill it once end-to-end and check the result |

Every emitted asset obeys `omega-constitution` and carries the same rails. MCP configs are patterns
until the user authorizes the server (claude.ai connector settings, or `claude mcp` / `/mcp`).

## 7. Generation checklist + frontmatter validation

Before declaring a skill DONE, confirm each: [ ] plan gated before drafting (section 2) ·
[ ] `<name>` kebab-case, folder created · [ ] frontmatter parses (snippet below) ·
[ ] description carries concrete trigger phrases, disambiguates from similar skills, and is
<= 1024 chars (plugin.json description <= 500) ·
[ ] body is imperative, numbered, uses tables · [ ] every step maps to a real mechanism ·
[ ] absent-connector steps STOP-and-report · [ ] reviewer verdict PASS within the 3-iteration budget ·
[ ] live smoke test passed · [ ] no impossible/fabricated claims · [ ] rails intact ·
[ ] plugin.json bumped · [ ] CHANGELOG appended · [ ] reload command given.

Frontmatter validator — set `$FU` per the discipline doctrine, section 4. **Length gates it must
enforce (real caps, not style advice):** SKILL.md `description:` <= **1024** chars ·
`.claude-plugin/plugin.json` `description` <= **500** chars. Over-limit = fix before shipping.

POSIX (any shell with python3 — this is the form that runs on remote Linux containers):

```sh
python3 - "$FU/skills/<name>/SKILL.md" <<'PY'
import sys, yaml
fm = open(sys.argv[1], encoding='utf-8').read().split('---', 2)[1]
assert '\t' not in fm, 'Tab in frontmatter'
d = yaml.safe_load(fm)
assert d.get('name') and d.get('description'), 'Missing name/description'
assert len(str(d['description'])) <= 1024, 'description over 1024 chars'
print('OK')
PY
```

PowerShell equivalent (Windows; 5.1-safe — no `??`):

```powershell
$p = "$FU\skills\<name>\SKILL.md"
$t = Get-Content $p -Raw
if ($t -notmatch "(?s)^---\r?\n(.*?)\r?\n---") { Write-Error "No frontmatter fence"; exit 1 }
$fm = $Matches[1]
if ($fm -match "`t") { Write-Error "Tab in frontmatter"; exit 1 }
if ($fm -notmatch "(?m)^name:\s*\S")        { Write-Error "Missing name"; exit 1 }
if ($fm -notmatch "(?m)^description:\s*\S") { Write-Error "Missing description"; exit 1 }
$desc = ([regex]::Match($fm, "(?ms)^description:\s*(.+?)(?=^\w+:|\z)")).Groups[1].Value.Trim()
if ($desc.Length -gt 1024) { Write-Error "description over 1024 chars ($($desc.Length))"; exit 1 }
Write-Output "OK"
```

And the plugin manifest cap (either shell):

```sh
python3 -c "import json,sys; d=json.load(open('$FU/.claude-plugin/plugin.json')); n=len(d.get('description','')); sys.exit(('plugin.json description over 500 chars: %d' % n) if n>500 else 0)" && echo OK
```

## 8. Safety rails — never generate them away

A generated skill must NEVER strip or weaken: paper-mode-default for trading · human confirmation for live orders, money movement, sends, publishes, or deletions (Law 10) · no fabricated connector output · loop-termination ceilings · the STOP-and-report requirement when a connector is absent. If a request asks the factory to omit a rail so a task "passes", refuse and report why.

## 9. Log to knowledge-lake and lessons (Law 07)

After a skill ships (or is blocked), record it. Append one line to `$FU\memory\lessons.md` — what was missing, what was created, how it verified, any failure to avoid next time — and register the asset in the `knowledge-lake` (source-attributed) so future DETECT passes and `self-upgrade` see what already exists. No log = the cycle is not complete.
