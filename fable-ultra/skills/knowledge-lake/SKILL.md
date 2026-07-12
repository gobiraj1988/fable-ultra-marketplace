---
name: knowledge-lake
description: The permanent, source-attributed knowledge store of fable-ultra V3 OMEGA (System E Knowledge Lake + System Q Enterprise Memory) — the curated library that makes the system smarter over time. Use whenever a task needs to STORE a durable fact, rule, claim, source, pattern, benchmark, lesson, failure, or playbook, or to RECALL one before deciding. Trigger phrases - "store this in the knowledge lake", "add a rule/claim/source", "what do we know about X", "recall the KP/Jaimini/FIDIC/QS/trading rule", "cite our source for X", "log this failure/lesson permanently", "audit the knowledge base for stale claims". Governed by omega-constitution (the 10 OMEGA Laws). NOTE — this is the CURATED durable library under `knowledge/`; it is NOT `memory/lessons.md`, which is the lightweight running journal (one dated line per run, read by model-max at start). Log fleeting notes there; promote vetted, sourced knowledge here. Defers to ai-builder for vector-search / RAG at scale.
---

# Knowledge Lake — Enterprise Memory (Systems E + Q)

Governed by `omega-constitution`. Law 01 (never fabricate) and Law 07 (store lessons) are the
spine of this skill; every entry is sourced or explicitly labeled `ASSUMPTION`.

## 1. Storage layout
Files live under `knowledge/<domain>/<object>.md` under the plugin install directory (resolve via
`${CLAUDE_PLUGIN_ROOT}` when set).
Durability: on ephemeral remote/web containers local disk does NOT survive the session — persist
the lake by committing it via the GitHub MCP tools (mcp__github__*) before the session ends
(respecting Section 7 privacy).

| Domains | Object types (one file per type) |
|---|---|
| kp-astrology, jaimini, nadi, parashara, sudarsana | rules, claims, evidence, sources |
| qs, fidic, contracts, construction | patterns, benchmarks, lessons |
| trading, programming, ai, ocr, rag, agents, business | failures, playbooks |

Create the folder on first write: `mkdir -p knowledge/qs` (POSIX) / `New-Item -ItemType Directory -Force -Path 'knowledge\qs'` (PowerShell).

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

Entry template:
```
### <short-id> — <one-line claim>
Claim: <the single fact/rule>
Source: <url | book p.NN | path | derivation>   Confidence: HIGH|MED|LOW
Added: YYYY-MM-DD   Domain: <domain>   Verify: VERIFIED|UNVERIFIED|REFUTED   Related: <domain/object.md#anchor>
```

## 4. Recall — how a task queries the lake
1. **Targeted (default):** `Grep` by domain+object, then `Read` the hit. Shell equivalents —
   `grep -E 'retention|DLP' knowledge/qs/rules.md` (POSIX) /
   `Select-String -Path 'knowledge\qs\rules.md' -Pattern 'retention|DLP'` (PowerShell); prefer
   the Grep tool in-session.
2. **At scale:** for large lakes, hand the folder to `ai-builder` to build/query a vector index
   (RAG pipeline). Embeddings can run locally via **Ollama** (pick a current local embedding model
   from `ollama.com/library` at build time — model names go stale, don't copy one from memory) so no
   external API is required; if a hosted vector API is named but its connector is absent, STOP-and-report.
3. **Apply, then cite.** Use the recalled entry in the task AND quote its `Source:` line in the
   deliverable so the chain is auditable (Law 09). Never present a recalled `ASSUMPTION` as fact.

## 5. Enterprise memory vs. the quick-log
| `memory/lessons.md` (journal) | `knowledge/**` (this lake, library) |
|---|---|
| One dated line per run, appended fast | Curated, deduped, source-attributed entries |
| Read by model-max at run start | Queried on demand by any task |
| Transient signal | Durable, vetted knowledge |

Flow: a run appends a raw line to `lessons.md`; when a lesson proves reusable, **promote** it into
`knowledge/<domain>/lessons.md` (or `failures.md` / `benchmarks.md`) with a source. These curated
entries feed future decisions. (Aspirational: a future `self-upgrade` cycle could also read
`knowledge/**/failures.md` and `benchmarks.md` as evidence — today `self-upgrade` gathers evidence
only from `memory/lessons.md` and `ultra-code-run.md`, so treat that data flow as optional, not
guaranteed.) Never fabricate a benchmark — only record numbers you actually measured (Law 01/04).

## 6. Worked example (a QS rule, sourced)
Written to `knowledge/qs/rules.md`:
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

## 8. Verification & periodic audit (Law 05)
Quarterly, or on demand, run an audit pass over `knowledge/**`. If the target file or web connector
does not exist yet (`knowledge/` is created on first write and starts empty), the audit is a no-op:
STOP-and-report "nothing to audit" rather than erroring on the missing path (same PENDING-SOURCE
discipline as Section 2). Otherwise:
1. Flag entries older than 12 months whose `Source:` is a URL — re-fetch (via web connector if
   present, else STOP-and-report) to confirm the source still resolves; downgrade to `LOW` if dead.
2. Flag any entry missing a `Source:` or `Confidence:` line as **again-unsourced** and quarantine it
   as `ASSUMPTION` until re-sourced.
3. Flag duplicates the write-time dedupe missed; merge, keeping the higher-confidence source.
4. Write the audit result (counts, flagged ids) to `knowledge/ai/lessons.md` and report it — do NOT
   silently delete entries (deletion is irreversible; needs human approval, Law 10).
