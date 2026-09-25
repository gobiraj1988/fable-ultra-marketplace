---
name: qs-works
description: Advanced Quantity Surveying and document/spreadsheet production for GCC (Oman/UAE/Qatar/KSA) construction projects. Use when the user asks for QS works, a measurement sheet, takeoff, BOQ, IPC or payment application, variation quantum, cost workbook, advanced Excel measurements with live formulas, advanced Word/PDF documents or reports, or any quantity-surveying deliverable. Orchestrates specialist qs-suite and file-production skills, then applies QS quality gates before delivery. Do NOT trigger for pure cost-control/CVR/margin queries (use qs-suite qs-cost-control), generic Excel or spreadsheet work with no QS content (use anthropic-skills xlsx), or contract disputes and adjudication (use qs-suite qs-dispute-adjudication).
---

# QS Works — Orchestrate, Quality-Gate, Deliver

## 1. ROUTE FIRST (most important rule)

Before doing any work yourself, check installed skills and prefer invoking a specialist. This skill orchestrates and quality-gates; specialists execute.

| Task | Route to (if installed) |
|---|---|
| Civil/structural measurement, takeoff, IPC, remeasure | `qs-suite:qs-measurement-civil` |
| MEP measurement, services IPC, T&C claims | `qs-suite:qs-measurement-mep` |
| Variation identification and quantum | `qs-suite:qs-variations` |
| CVR, cost report, cashflow, cost-to-complete | `qs-suite:qs-cost-control` |
| EOT / delay claims | `qs-suite:qs-eot-claims` |
| Final account assembly | `qs-suite:qs-final-account` |
| Programme / Gantt / look-ahead | `qs-suite:qs-planning` |
| Tender BOQ / rate build-up | `qs-suite:qs-tender-boq`, `qs-suite:qs-rate-buildup` |
| Excel file production | `anthropic-skills:xlsx` |
| Word document production | `anthropic-skills:docx` |
| PDF production/extraction | `anthropic-skills:pdf` |

- If a specialist matches, invoke it via the Skill tool and pass the user's context through.
- Chain skills when needed (e.g., measurement skill for quantities, then xlsx skill for the workbook).
- Build directly ONLY when no specialist skill matches the task. Say so explicitly when you do.
- **Large jobs** (multi-trade or 3+ deliverables) — dispatch measurement and variation work as parallel subagents via the Workflow tool, each returning STRUCTURED output (JSON with item ref, qty, unit, drawing ref/rev, assumptions) so the orchestrator can merge and gate deterministically instead of parsing prose.
- **Payment applications** (IPC/PA) precede money movement — route through `fable-ultra:governance-core` before delivery.

## 2. Staged Flow (every engagement, in order)

1. **Intake** — restate scope, contract form, units, and source documents (drawings/BOQ/prior IPC). Ask only blocking unknowns.
2. **Route** — pick specialists per Section 1.
3. **Plan the deliverable list** — enumerate every file with its acceptance check BEFORE building anything.
4. **Build one deliverable at a time** — finish and self-check each before starting the next; never batch half-built files.
5. **Gate** — run the Section 3 quality gates; any failed gate blocks that deliverable.
6. **Deliver** — files plus the verification table (Section 6).

Process discipline (plan-first, verify-by-execution evidence format `<command> -> exit <code> -> "<output>"`, independent critique, $FU portable home) follows the shared contract `$FU\knowledge\ai\fable5-discipline.md` — apply it, do not restate it. `$FU` resolves per that doctrine's section 4 (env FABLE_ULTRA_HOME -> legacy J:\fable 5\fable-ultra if present -> %USERPROFILE%\.fable-ultra).

## 3. QS Quality Gates (apply to EVERY deliverable, regardless of who executed)

- [ ] **Traceability** — every quantity carries a drawing number/revision or BOQ item reference. No orphan quantities.
- [ ] **Arithmetic** — re-verify dims-sheet math by recalculation (script or spreadsheet recompute), never by eyeballing.
- [ ] **Abstract vs detail** — cross-check abstract totals against detail sheets. Any mismatch is a BLOCKING defect: stop, reconcile, then deliver.
- [ ] **Units** — consistent m / m2 / m3 / nr / kg throughout; any conversion appears as an explicit line, not embedded silently in a factor.
- [ ] **Deductions** — DDT items shown as separate negative lines; never net quantities silently.
- [ ] **Assumptions** — rates, wastage %, laps, rounding rules listed in a visible Assumptions block. Nothing hidden in formulas.

## 4. Excel Standards

- Live formulas (`=SUM`, `=ROUND`, cell references) — never hardcode computed values.
- **Mandatory recompute gate** — `openpyxl` with `data_only=True` returns stale or `None` values on a freshly written file; it is NOT verification. Evaluate the formulas independently and compare:
  ```powershell
  python -c "import formulas; sol=formulas.ExcelModel().loads('out.xlsx').finish().calculate(); print(sol[\"'[OUT.XLSX]ABSTRACT'!F42\"].value)"
  ```
  (or LibreOffice headless recalc-and-convert if `formulas` is unavailable). Recompute every key total (named ranges below) and each abstract cell, and cross-check against an independent recomputation of the source dims. **Delivery is BLOCKED until every recomputed total matches the workbook's formula result exactly.**
- Named ranges for key totals (e.g., `Total_Claimed`, `Total_DDT`, `Net_Payable`).
- Complex workbooks: separate Input, Calc, and Output sheets; Output references Calc only.
- Print-ready: A4 page setup, repeating header rows, page numbers in footer, sensible print areas.

## 5. Document Standards (Word/PDF)

- Numbered sections (1, 1.1, 1.1.1) using heading styles.
- Revision block on the cover or first page: Rev / Date / Description / Prepared / Checked.
- Table of contents for documents over ~8 pages, generated from heading styles.
- Cross-references ("see Section 4.2", "refer Annexure B") must point at sections/annexures that actually exist — verify each one before delivery.

## 6. Verification Output (ships with every deliverable)

Append a short verification table so the user sees evidence, not claims:

| Check | Method | Result |
|---|---|---|
| Abstract F42 = sum of detail sheets | Formula-evaluation recompute | 48,217.50 = 48,217.50 OK |
| All items have drawing refs | Column scan, 0 blanks | PASS |

One row per quality gate exercised plus any file-level checks (formulas recompute, TOC resolves).

## 7. Language

- Default output language is English.
- Tamil-language output is supported on request for narrative sections (cover letters, claim narratives, report prose); keep dims, item descriptions in tables, and formulas in English for auditability.
