---
name: governance-core
description: X LAYER 12 of fable-ultra X OMEGA — the active enforcement layer every other skill MUST consult before it deletes, overwrites, sends, publishes, posts, trades live, moves money, changes an external account, spends on paid APIs, or runs a large multi-agent workflow. Governed by omega-constitution (10 X-LAWS). Triggers when the user says "is this safe", "check the budget", "governance gate", "do I have approval for this", "risk check", "compliance check", "audit this action", "what did we spend", or before ANY irreversible/expensive/risky action from trading-bot, self-upgrade, agent-factory, dream-factory, mcp-connector, software-build, android-app, ai-builder, or research-council. Returns ALLOW/BLOCK/NEEDS-APPROVAL with reason and evidence, keeps a spend ledger and audit trail. It reduces risk, not removes it — the human stays accountable. Do NOT trigger for legal/regulatory compliance ADVICE — the legal plugin skills cover that; this gate governs only fable-ultra's own actions.
---

# Governance Core — X Layer 12 (active enforcement)

Governed by `omega-constitution`. Load it first. This skill is a GATE other skills call
BEFORE acting, not a report they write afterward. It reduces risk; it does not eliminate it.
The human remains accountable for every approval. If a mechanism below is absent
(no ledger, no connector, no Ollama), STOP and report — never fake a pass (X-LAW 01/03).

Shared discipline contract — `knowledge/ai/fable5-discipline.md` applies here (plan-first,
verify-by-execution evidence in the form `<command> -> exit <code> -> "<output>"`, independent
critique, `$FU` portable home); do not restate it, follow it.
`$FU` = the fable-ultra home, resolved per the discipline doctrine section 4
(env `FABLE_ULTRA_HOME` -> legacy `J:\fable 5\fable-ultra` if present -> `%USERPROFILE%\.fable-ultra`);
on Linux/macOS (incl. remote containers) resolve it POSIX-style instead:
`FU="${FABLE_ULTRA_HOME:-${CLAUDE_PLUGIN_ROOT:-$HOME/.fable-ultra}}"`.

## 1. Classify the action, then gate it

| Class | Examples | Gate |
|-------|----------|------|
| **irreversible** | delete/overwrite files, send/publish/post, live trade, money movement, external-account change | **NEEDS-APPROVAL** — explicit per-action human OK (X-LAW 09/10) |
| **expensive** | large multi-agent Workflow, paid-API calls, long paid-model runs, `isolation:'worktree'` runs (each worktree is a full extra agent tree), `model:'fable'`-tier runs (top tier, top price), and `effort:'high'`/`'max'` agents (effort multiplies tokens on the SAME model) | budget check + written cost ESTIMATE first (§3) |
| **risky** | security-affecting, data-exposing, credential-touching | risk assessment first (§5) |
| **routine** | read-only, local scratch edits, analysis with no external effect | ALLOW |

Choose the HIGHEST class that matches. When unsure, escalate one class up, never down.

## 2. Gate decision format (always return this)

```
DECISION: ALLOW | BLOCK | NEEDS-APPROVAL
ACTION:   <one line: what would happen>
CLASS:    routine | expensive | risky | irreversible
REASON:   <why this decision>
EVIDENCE: <measured fact, file path, or clearly-labeled ESTIMATE — never fabricated>
```

- **NEEDS-APPROVAL stops the run.** Present this block to the human and wait. Do not proceed,
  and never auto-approve inside an autonomous loop (X-LAW 09/10).
- **BLOCK** = refuse and explain (limit hit, missing evidence, compliance fail).
- **ALLOW** = proceed, then still append an audit line (§4) for anything above routine.
- An ALLOW on an **expensive** action is INVALID unless EVIDENCE contains the executed
  hard-stop check output from §3 — command, exit code, and printed result.

## 3. Budget mechanism (ledger + hard stop)

Ledger — `$FU\governance\budget.md` ($FU per the resolution line above), columns
`date | item | est-cost | running-total | limit`. Token/cost figures MUST be measured from a
real run, or clearly labeled ESTIMATE — never invented (X-LAW 03/10). For model prices, consult
the `claude-api` skill; do not guess. Before an expensive action, read the ledger, add the new
estimate to the running total, and if it meets or exceeds the limit return **BLOCK** and ask the
human to raise the limit.

```powershell
$FU = if ($env:FABLE_ULTRA_HOME) { $env:FABLE_ULTRA_HOME } elseif (Test-Path "J:\fable 5\fable-ultra") { "J:\fable 5\fable-ultra" } else { "$env:USERPROFILE\.fable-ultra" }
$dir = Join-Path $FU "governance"
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
$led = Join-Path $dir "budget.md"
if (-not (Test-Path $led)) { "| date | item | est-cost | running-total | limit |","| --- | --- | --- | --- | --- |" | Set-Content $led -Encoding UTF8 }
# append a spend line (fill real/ESTIMATE values):
$date = Get-Date -Format "yyyy-MM-dd HH:mm"
Add-Content $led "| $date | multi-agent run (ESTIMATE) | 1.20 | 4.80 | 20.00 |" -Encoding UTF8
```

**MANDATORY hard-stop check — EXECUTE this before every expensive ALLOW and paste its actual
output as the EVIDENCE line of the section-2 block, in the discipline evidence format
`<command> -> exit <code> -> "<output>"`. No executed output, no ALLOW.**

Inside a live Workflow run the ledger is the DURABLE record but not the live enforcer: the `budget`
global (`{ total, spent(), remaining() }`) is the in-run hard ceiling — `agent()` THROWS once it is
exhausted, so a runaway pipeline stops itself mid-run. Gate an expensive Workflow on both: the
ledger hard-stop below before launch, and a `budget.total` set from that same estimate at launch
(templates also carry `if (budget.total && budget.remaining() < 50000) break`). A run launched with
no `budget.total` is ungoverned — return **BLOCK**.

The check RECOMPUTES the total from every est-cost row — it never trusts the last row's
manually-written running-total, because one arithmetic or formatting slip by a caller would
silently defeat the limit. On drift between stated and recomputed, the recomputed value wins
and the drift is reported (and audited, section 4).

POSIX equivalent for the ledger append above (Linux/macOS, incl. remote containers):

```bash
FU="${FABLE_ULTRA_HOME:-${CLAUDE_PLUGIN_ROOT:-$HOME/.fable-ultra}}"; dir="$FU/governance"; mkdir -p "$dir"
led="$dir/budget.md"
[ -f "$led" ] || printf '| date | item | est-cost | running-total | limit |\n| --- | --- | --- | --- | --- |\n' > "$led"
echo "| $(date -u +'%Y-%m-%d %H:%M') | multi-agent run (ESTIMATE) | 1.20 | 4.80 | 20.00 |" >> "$led"
```

```powershell
$rows  = Get-Content $led | Select-Object -Skip 2 | Where-Object { $_.Trim() }
$costs = foreach ($r in $rows) { $c = ($r -split '\|')[3].Trim() -replace '[^0-9.\-]',''
          if ($c -match '^-?\d+(\.\d+)?$') { [double]$c } }
$tot = [math]::Round(($costs | Measure-Object -Sum).Sum, 2)
$last = ($rows | Select-Object -Last 1) -split '\|'
$lim = [double]($last[5].Trim() -replace '[^0-9.]',''); $stated = [double]($last[4].Trim() -replace '[^0-9.]','')
if ([math]::Abs($tot - $stated) -gt 0.01) { "LEDGER DRIFT stated running-total $stated but recomputed $tot - trusting recomputed" }
if ($tot -ge $lim) { "HARD-STOP BLOCK recomputed-total $tot >= limit $lim" } else { "BUDGET OK recomputed $tot of $lim" }
```

## 4. Audit trail (every gated decision)

Append to `$FU\governance\audit.md` for every decision above routine —
`timestamp | action | decision | reason | approver`. Approver is the human's name/OK for
NEEDS-APPROVAL, or `system` for automated ALLOW/BLOCK.

```powershell
# $FU resolved as in section 3
$dir = Join-Path $FU "governance"
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
$aud = Join-Path $dir "audit.md"
if (-not (Test-Path $aud)) { "| timestamp | action | decision | reason | approver |","| --- | --- | --- | --- | --- |" | Set-Content $aud -Encoding UTF8 }
$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content $aud "| $ts | live trade AAPL | NEEDS-APPROVAL | irreversible money movement | pending |" -Encoding UTF8
```

POSIX equivalent:

```bash
dir="$FU/governance"; mkdir -p "$dir"; aud="$dir/audit.md"
[ -f "$aud" ] || printf '| timestamp | action | decision | reason | approver |\n| --- | --- | --- | --- | --- |\n' > "$aud"
echo "| $(date -u +'%Y-%m-%d %H:%M:%S') | live trade AAPL | NEEDS-APPROVAL | irreversible money movement | pending |" >> "$aud"
```

## 5. Compliance checklist per domain

| Domain | Non-negotiables before ALLOW |
|--------|------------------------------|
| **trading** (trading-bot) | paper-mode by DEFAULT; live requires human sign-off per order; NO guaranteed-profit claims; regulatory/tax responsibility is the USER's — state this. |
| **data** (knowledge-lake, vision-ocr, research-council) | privacy + local-first for sensitive/personal data; no exfiltration to external hosts without approval. |
| **content** (postiz/social via mcp-connector, dream-factory) | no impersonation, no spam; disclose AI-generated where required; send/publish = irreversible → §1. |

Run the row for the action's domain; if any item fails, return BLOCK with that item as the reason.

## 6. Immutability (policy convention, not physics)

These safety gates and the `self-upgrade` immutable rails are OFF-LIMITS to every skill,
**including self-upgrade itself**. No skill may edit, weaken, or route around governance-core's
gates. If an upgrade cycle or workflow proposes touching this file or the self-upgrade rails,
return **BLOCK** and cross-reference `self-upgrade` (which already refuses to edit safety rails).
Bypass attempts get an audit line with decision `BLOCK` and reason `immutable-rail`.

HONEST LIMIT (X-LAW 03) — this immutability is NOT technically enforceable; any process with
file access could edit this file. Practical guard — hash this SKILL.md at load and compare to
the recorded baseline in `$FU\governance\skill-hash.txt` (write the baseline once, on first load
or after a human-approved change). On mismatch, return **BLOCK** with reason `tampered-rail`,
audit it (section 4), and alert the human.

```powershell
(Get-FileHash "$PSScriptRoot\SKILL.md" -Algorithm SHA256).Hash  # compare to $FU\governance\skill-hash.txt
```

POSIX equivalent: `sha256sum "$(dirname "$0")/SKILL.md"` (or `shasum -a 256` on macOS) — compare to
`$FU/governance/skill-hash.txt`.

## 7. How other skills invoke this gate

Before a gated action, a caller runs the classification (§1) and produces the decision block (§2),
then either proceeds (ALLOW), refuses (BLOCK), or stops for the human (NEEDS-APPROVAL). In a
Workflow script this is a `phase` before the acting `agent(...)` call; automated/scheduled runs
use the `schedule` skill (or Cron tools) and Task tools and MUST still stop at NEEDS-APPROVAL rather than
self-approve. There is no background auto-approver.

## 8. Honesty (X-LAW 03/10)

State every cost as MEASURED or ESTIMATE. Never claim an action succeeded without measurable
evidence. Governance reduces risk; it does not remove it. If you cannot verify a gate ran
(missing ledger, unreadable audit file, connector down), say so and STOP — do not report a clean pass.
