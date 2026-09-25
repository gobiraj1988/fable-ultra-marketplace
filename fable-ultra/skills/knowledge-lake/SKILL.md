---
name: knowledge-lake
description: The permanent, source-attributed knowledge store of fable-ultra V3 OMEGA (System E Knowledge Lake + System Q Enterprise Memory) — the curated library that makes the system smarter over time. Use whenever a task needs to STORE a durable fact, rule, claim, source, pattern, benchmark, lesson, failure, or playbook, or to RECALL one before deciding. Trigger phrases - "store this in the knowledge lake", "add a rule/claim/source", "what do we know about X", "recall the KP/Jaimini/FIDIC/QS/trading rule", "cite our source for X", "log this failure/lesson permanently", "audit the knowledge base for stale claims". Governed by omega-constitution (the 10 OMEGA Laws). NOTE — this is the CURATED durable library under `knowledge/`; it is NOT `memory/lessons.md`, which is the lightweight running journal (one dated line per run, read by model-max at start). Log fleeting notes there; promote vetted, sourced knowledge here. Defers to ai-builder for vector-search / RAG at scale.
---

# Knowledge Lake — Enterprise Memory (Systems E + Q)

Governed by `omega-constitution`. Law 01 (never fabricate) and Law 07 (store lessons) are the
spine of this skill; every entry is sourced or explicitly labeled `ASSUMPTION`.
The shared discipline contract `knowledge/ai/fable5-discipline.md` applies as written there
(plan-first, verify-by-execution evidence `<command> -> exit <code> -> "<output>"`, independent
critique, `$FU` portable home) — do not restate it, follow it.

## 1. Storage layout
Files live under `$FU\knowledge\<domain>\<object>.md`. `$FU` resolves per the discipline doctrine
section 4 — env `FABLE_ULTRA_HOME`, else the legacy home if present, else
`%USERPROFILE%\.fable-ultra` on Windows / `$HOME/.fable-ultra` on Linux/macOS (§4 carries both the
PowerShell 5.1-safe and the POSIX resolution; remote containers are Linux and have no PowerShell).

**Durability (ephemeral containers).** On remote/web sessions the container's disk does NOT survive
the session, so a lake written only to `$FU` is gone when the session ends. Anything that must
persist has to be **committed** — push it to the repo with the GitHub MCP tools (`mcp__github__*`,
e.g. `create_or_update_file` / `push_files`) before the session closes, respecting section 7
privacy (never commit `# PRIVATE — local only` files to a shared remote). If the lake cannot be
committed, say so — do not report a store as durable when it is not.

| Domains | Object types (one file per type) |
|---|---|
| kp-astrology, jaimini, nadi, parashara, sudarsana | rules, claims, evidence, sources |
| qs, fidic, contracts, construction | patterns, benchmarks, lessons |
| trading, programming, ai, ocr, rag, agents, business | failures, playbooks |

Create the folder on first write — PowerShell: `New-Item -ItemType Directory -Force -Path "$FU\knowledge\qs"` · POSIX: `mkdir -p "$FU/knowledge/qs"`.

## 2. Mandatory source attribution (Law 01)
Every entry records a **source** and a **confidence**. No exceptions.

- Source = a URL, book+page, project doc path, connector output, or a named derivation.
- Confidence = `HIGH` (primary/verified) · `MED` (secondary/single-source) · `LOW` (inferred).
- An entry with no locatable source is prefixed `ASSUMPTION:` and capped at `LOW` — **never** written as fact.
- If a claim relies on a live connector or web fetch that is **unavailable in this session**, do NOT
  invent the value: write the entry as `PENDING-SOURCE` and STOP-and-report to the caller.

## 3. Write rules
Run in order for every new entry:

1. **Dedupe first.** `Grep` the target file for the key terms; if a matching claim exists, update
   its confidence/source instead of adding a duplicate.
2. **Absolute dates.** Convert "last week", "recently", "current" to `YYYY-MM-DD` using today's date.
3. **One claim per entry.** Split compound statements; each gets its own source + confidence.
4. **Link related entries.** Add `Related:` back-references (e.g. `Related: qs/patterns.md#retention`).
5. Append; do not rewrite unrelated entries (preserve the audit trail, Law 09).
6. **Verify the write before claiming success.** Re-read the just-written entry (Read the file, or
   `Select-String` its short-id) and confirm all four template fields are present — `Source:`,
   `Confidence:`, `Added:`, `Verify:`. Report the store as done only with that evidence, in the
   discipline format; a missing field means fix the entry now, not "stored" on faith.

Entry template:
```
### <short-id> — <one-line claim>
Claim: <the single fact/rule>
Source: <url | book p.NN | path | derivation>   Confidence: HIGH|MED|LOW
Added: YYYY-MM-DD   Domain: <domain>   Verify: VERIFIED|UNVERIFIED|REFUTED   Related: <domain/object.md#anchor>
```

## 4. Recall — how a task queries the lake
1. **Targeted (default):** `Grep` by domain+object, then `Read` the hit. Shell equivalents —
   PowerShell: `Select-String -Path "$FU\knowledge\qs\rules.md" -Pattern 'retention|DLP'` ·
   POSIX: `grep -nE 'retention|DLP' "$FU/knowledge/qs/rules.md"`
   (prefer the Grep tool in-session; these are the shell fallbacks).
2. **At scale:** for large lakes, hand the folder to `ai-builder` to build/query a vector index
   (RAG pipeline). Embeddings can run locally via **Ollama** (pick a current local embedding model
   from `ollama.com/library` at build time — model names go stale, don't copy one from memory) so no
   external API is required; if a hosted vector API is named but its connector is absent, STOP-and-report.
3. **Apply, then cite.** Use the recalled entry in the task AND quote its `Source:` line in the
   deliverable so the chain is auditable (Law 09). Never present a recalled `ASSUMPTION` as fact.
4. **Zero or conflicting hits.** Zero hits — say "no lake entry", never infer one; proceed only
   with an explicit `ASSUMPTION`, or escalate (`deep-research` for a missing fact,
   `research-council` for a contested/high-stakes call) and store the answer on return.
   Conflicting hits — higher `Confidence` wins (HIGH > MED > LOW); at equal confidence the newer
   `Added:` date wins; two contradictory HIGH entries = contested — mark both `Verify: UNVERIFIED`
   and escalate to `research-council` before relying on either.

## 5. Enterprise memory vs. the quick-log
| `memory/lessons.md` (journal) | `knowledge/**` (this lake, library) |
|---|---|
| One dated line per run, appended fast | Curated, deduped, source-attributed entries |
| Read by model-max at run start | Queried on demand by any task |
| Transient signal | Durable, vetted knowledge |

Flow: a run appends a raw line to `lessons.md`; when a lesson proves reusable, **promote** it into
`knowledge/<domain>/lessons.md` (or `failures.md` / `benchmarks.md`) with a source. These curated
entries feed future decisions. (Aspirational: `self-upgrade` today reads only `memory/lessons.md`
and `ultra-code-run.md`; treat `knowledge/**` as optional evidence for it, not guaranteed.)
Never fabricate a benchmark — only record numbers you actually measured (Law 01/04).

## 6. Worked example (a QS rule, sourced)
Written to `knowledge\qs\rules.md`:
```
### qs-retention-01 — Retention is released in two moieties
Claim: Under FIDIC Red Book 1999 sub-clause 14.9, half the retention is certified at Taking-Over
       and the balance at the end of the Defects Notification Period.
Source: FIDIC Conditions of Contract for Construction, 1st ed. 1999, cl. 14.9   Confidence: HIGH
Added: <today YYYY-MM-DD>   Related: fidic/patterns.md#retention, qs/playbooks.md#final-account
```
Contrast — an unsourced inference is quarantined: `ASSUMPTION: client pays within 28 days ... Confidence: LOW`.

## 7. Privacy
Sensitive data (client names, rates, birth data, financials) **stays local** on this machine under
`knowledge/`. Do not send it to external web-search or hosted-embedding connectors; use local Grep
and Ollama embeddings. If a task would export sensitive content off-machine, treat it as irreversible
and get human approval first (Law 10). Mark such files with a top-of-file `# PRIVATE — local only`.
This outranks the section 1 durability rule: a `# PRIVATE` file is never committed to a shared
remote to survive an ephemeral container — report that it will not persist instead.

## 8. Verification & periodic audit (Law 05)
Quarterly, or on demand, run an audit pass over `knowledge/**`. If the target file or web connector
does not exist yet (`knowledge/` is created on first write and starts empty), the audit is a no-op:
STOP-and-report "nothing to audit" rather than erroring on the missing path (same PENDING-SOURCE
discipline as Section 2). Otherwise:
0. **Machine-validate first (executable audit).** Run this and record its output as the audit
   evidence — counts, not eyeballing (`$FU` = resolved home; run the form your shell supports):
   ```powershell
   $md = Get-ChildItem "$FU\knowledge" -Recurse -Filter *.md
   "entries=$(($md|Select-String '^### ').Count) source=$(($md|Select-String 'Source:').Count)" +
   " conf=$(($md|Select-String 'Confidence:').Count) assumption=$(($md|Select-String 'ASSUMPTION').Count)" +
   " pending=$(($md|Select-String 'PENDING-SOURCE').Count)"
   ```
   ```sh
   cd "$FU/knowledge" && echo "entries=$(grep -rho '^### ' --include='*.md' . | wc -l)" \
     "source=$(grep -rho 'Source:' --include='*.md' . | wc -l)" \
     "conf=$(grep -rho 'Confidence:' --include='*.md' . | wc -l)" \
     "assumption=$(grep -rho 'ASSUMPTION' --include='*.md' . | wc -l)" \
     "pending=$(grep -rho 'PENDING-SOURCE' --include='*.md' . | wc -l)"
   ```
   `entries > source` or `entries > conf` = that many malformed entries; locate and flag them
   (per-file diff of the same counts). Steps 1-4 below then work the flagged list.
1. Flag entries older than 12 months whose `Source:` is a URL — re-fetch (via web connector if
   present, else STOP-and-report) to confirm the source still resolves; downgrade to `LOW` if dead.
2. Flag any entry missing a `Source:` or `Confidence:` line as **again-unsourced** and quarantine it
   as `ASSUMPTION` until re-sourced.
3. Flag duplicates the write-time dedupe missed; merge, keeping the higher-confidence source.
4. Write the audit result (counts, flagged ids) to `knowledge\ai\lessons.md` and report it — do NOT
   silently delete entries (deletion is irreversible; needs human approval, Law 10).

**Scale rule.** If an audit or a promotion batch spans more than ~20 files or ~200 entries, do not
run it inline in the main context: dispatch it as a structured-output Workflow subagent with an
explicit token budget (~30k) that returns ONLY the validator counts, flagged ids, and proposed
merges — the main session reviews and applies, keeping Law 10 approval with the human.
