---
name: skill-factory
description: The Skill Factory and Plugin Factory for fable-ultra V3 OMEGA (Systems C + P). Use when a task needs a capability that no installed skill covers — the missing-capability signal — and the right fix is a reusable asset, not a one-off answer. Triggers on "make a skill for this", "create/generate a skill", "the plugin should be able to X but can't", "add a command/MCP/template to fable-ultra", "build a plugin asset", or when ultra-code/meta-brain detect a recurring task with no matching skill. It CREATES and ships assets; it does not edit existing skills to improve them — that is self-upgrade. It does not build agent products for end users — that is agent-system, and it does not manage least-privilege subagents — that is agent-factory. Prefer invoking the installed skill-creator plugin skill for best-practice structure and evals when present.
---

# Skill Factory / Plugin Factory (Systems C + P)

Governed by `omega-constitution` (the 10 OMEGA Laws). The Laws win over any rule here: never fabricate, never claim done without verification (Law 05), evidence > confidence, verification > generation, reusable > temporary (Law 06), store lessons. This factory manufactures capability; it NEVER generates away a safety rail to make a task pass.

## 1. DETECT — recognize the missing-capability signal

Create a new asset only when ALL of these hold; otherwise answer inline (Law 06 favors reuse, not premature scaffolding):

| Signal | Check |
|--------|-------|
| No matching skill | Task maps to none in `skills/` (cross-check the constitution's 19-system map) |
| Reusable | The capability will recur, not a one-time answer |
| In scope | A skill/command/template/MCP config can actually deliver it in Claude Code |
| Mechanism exists | Every planned step maps to a REAL mechanism (below); no external API is faked |

Real mechanisms only: local files, subagents (adversarial reviewers), the Workflow tool for multi-stage runs, MCP connectors that are actually connected, and Ollama for local models. If the capability needs an external API/connector that is NOT connected, STOP and report the exact setup step (per the `.mcp.json` rule) — never simulate connector output.

## 2. DESIGN then GENERATE the SKILL.md

1. **Prefer skill-creator.** If the `skill-creator` plugin skill is installed, invoke it for the
   scaffold, best-practice structure, and eval harness. If absent, follow this template directly.
2. **Choose a kebab-case `<name>`** and create `skills/<name>/SKILL.md` under the plugin root
   (resolve via `${CLAUDE_PLUGIN_ROOT}` when set).
3. **Write valid YAML frontmatter** — `---`, `name: <name>`, `description:` (one paragraph, packed
   with concrete trigger phrases, and noting if it defers to or differs from a similarly-named
   existing skill), `---`. No tabs. Then a concrete, imperative, numbered body with tables — never
   a vague essay.
4. **Inherit the rails.** Every generated skill defers to `omega-constitution`, keeps human
   approval for irreversible actions, and states its required connectors + the STOP-and-report
   behavior when they are absent.

## 3. TEST + VERIFY — mandatory (Law 05, verification > generation)

Never register an unverified skill. Run all three gates:

1. **Frontmatter parses** — run the validator snippet in section 6 (POSIX or PowerShell). Must print `OK`.
2. **Adversarial review** — spawn a subagent whose only job is to REFUTE the skill: run the draft against 2–3 realistic user scenarios and hunt for wrong triggers, impossible claims, faked connector output, missing rails, or steps that cannot run. Fix every finding.
3. **No impossible claims** — no literal-AGI/consciousness claims, no fabricated benchmarks, no "trains frontier models". Reject any such line before shipping.

| Gate | Pass condition | On failure |
|------|----------------|------------|
| Parse | Snippet prints `OK` | Fix YAML, re-run |
| Adversarial | Subagent finds nothing it can defend as a real defect | Edit skill, re-review |
| Claims | Zero impossible/fabricated claims | Delete the claim, re-verify |

If any gate cannot pass, do NOT register. Report BLOCKED with the reason.

## 4. VERSION + REGISTER + PUBLISH

Skills auto-register by living in `skills/<name>/SKILL.md` — no registry edit needed. Once loaded,
they are invoked namespaced as `fable-ultra:<name>`. Then:

1. **Version bump** `.claude-plugin/plugin.json` (plugin root): minor bump (x.Y+1.0) for a
   new skill/capability, patch (x.y.Z+1) for a small template/asset.
2. **Append a dated entry** to the plugin's `CHANGELOG.md` naming the new asset and its
   verification result.
3. **Tell the user to reload** — the marketplace-qualified name is REQUIRED (the bare name fails
   with "not found"):
   ```
   claude plugin update fable-ultra@fable-ultra-marketplace
   ```
4. **Human approval before publishing** beyond this repo (Law 10) — pushing to a shared marketplace or remote is irreversible; confirm per-action, never inside an autonomous loop.

## 5. PLUGIN FACTORY extension (System P)

The same DETECT → GENERATE → VERIFY → VERSION pipeline emits other plugin assets:

| Asset | Location | Verify |
|-------|----------|--------|
| Command | `commands/<name>.md` | Parses; dry-run the described action |
| MCP server config | `.mcp.json` (stdio, cross-platform command lines) | STOP if the server is not actually connected; never fake its output |
| Prompt pack | `skills/<name>/prompts/` or a template file | Adversarial review as in section 3 |
| Template | `skills/<name>/templates/` | Fill it once end-to-end and check the result |

Every emitted asset obeys `omega-constitution` and carries the same rails. MCP configs are patterns
until the user authorizes the server (claude.ai connector settings, or `claude mcp` / `/mcp`).

## 6. Generation checklist + frontmatter validation

Before declaring a skill DONE, confirm each: [ ] `<name>` kebab-case, folder created ·
[ ] frontmatter parses (snippet below) · [ ] description carries concrete trigger phrases and
disambiguates from similar skills · [ ] description <= 1024 chars and plugin.json description
<= 500 chars (validator limits) · [ ] body is imperative, numbered, uses tables ·
[ ] every step maps to a real mechanism · [ ] absent-connector steps STOP-and-report ·
[ ] adversarial review passed on 2–3 scenarios · [ ] no impossible/fabricated claims ·
[ ] rails intact · [ ] plugin.json bumped · [ ] CHANGELOG appended · [ ] reload command given.

Frontmatter validator — run from the plugin root (`${CLAUDE_PLUGIN_ROOT}` when set). POSIX (works
in any shell with python3):

```sh
python3 -c "import yaml,sys; d=yaml.safe_load(open('skills/<name>/SKILL.md').read().split('---',2)[1]); assert d['name'] and d['description'], 'missing name/description'; assert len(str(d['description']))<=1024, 'description over 1024 chars'; print('OK')"
```

PowerShell equivalent (Windows):

```powershell
$p = "skills\<name>\SKILL.md"
$t = Get-Content $p -Raw
if ($t -notmatch "(?s)^---\r?\n(.*?)\r?\n---") { Write-Error "No frontmatter fence"; exit 1 }
$fm = $Matches[1]
if ($fm -match "`t") { Write-Error "Tab in frontmatter"; exit 1 }
if ($fm -notmatch "(?m)^name:\s*\S")        { Write-Error "Missing name"; exit 1 }
if ($fm -notmatch "(?m)^description:\s*\S") { Write-Error "Missing description"; exit 1 }
Write-Output "OK"
```

Length gates (Cowork validator): SKILL.md `description:` <= 1024 chars; `plugin.json`
description <= 500 chars. Over-limit = fix before shipping.

## 7. Safety rails — never generate them away

A generated skill must NEVER strip or weaken: paper-mode-default for trading · human confirmation for live orders, money movement, sends, publishes, or deletions (Law 10) · no fabricated connector output · loop-termination ceilings · the STOP-and-report requirement when a connector is absent. If a request asks the factory to omit a rail so a task "passes", refuse and report why.

## 8. Log to knowledge-lake and lessons (Law 07)

After a skill ships (or is blocked), record it. Append one line to `memory/lessons.md` under the plugin root (resolve via `${CLAUDE_PLUGIN_ROOT}` when set) — what was missing, what was created, how it verified, any failure to avoid next time — and register the asset in the `knowledge-lake` (source-attributed) so future DETECT passes and `self-upgrade` see what already exists. No log = the cycle is not complete.
