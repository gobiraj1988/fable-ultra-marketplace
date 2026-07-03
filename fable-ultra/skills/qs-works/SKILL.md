---
name: qs-works
description: Advanced Quantity Surveying and document/spreadsheet production for GCC (Oman/UAE/Qatar/KSA) construction projects. Use when the user asks for QS works, a measurement sheet, takeoff, BOQ, IPC or payment application, variation quantum, cost workbook, advanced Excel measurements with live formulas, advanced Word/PDF documents or reports, or any quantity-surveying deliverable. Orchestrates specialist qs-suite and file-production skills, then applies QS quality gates before delivery.
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

## 2. QS Quality Gates (apply to EVERY deliverable, regardless of who executed)

- [ ] **Traceability** — every quantity carries a drawing number/revision or BOQ item reference. No orphan quantities.
- [ ] **Arithmetic** — re-verify dims-sheet math by recalculation (script or spreadsheet recompute), never by eyeballing.
- [ ] **Abstract vs detail** — cross-check abstract totals against detail sheets. Any mismatch is a BLOCKING defect: stop, reconcile, then deliver.
- [ ] **Units** — consistent m / m2 / m3 / nr / kg throughout; any conversion appears as an explicit line, not embedded silently in a factor.
- [ ] **Deductions** — DDT items shown as separate negative lines; never net quantities silently.
- [ ] **Assumptions** — rates, wastage %, laps, rounding rules listed in a visible Assumptions block. Nothing hidden in formulas.

## 3. Excel Standards

- Live formulas (`=SUM`, `=ROUND`, cell references) — never hardcode computed values.
- Recalculate the workbook and verify totals before delivery. PowerShell check via openpyxl:
  ```powershell
  python -c "import openpyxl; wb=openpyxl.load_workbook('out.xlsx', data_only=True); print(wb['Abstract']['F42'].value)"
  ```
  (Requires the file opened/recalculated once, or use a formula-evaluation pass per the xlsx skill.)
- Named ranges for key totals (e.g., `Total_Claimed`, `Total_DDT`, `Net_Payable`).
- Complex workbooks: separate Input, Calc, and Output sheets; Output references Calc only.
- Print-ready: A4 page setup, repeating header rows, page numbers in footer, sensible print areas.

## 4. Document Standards (Word/PDF)

- Numbered sections (1, 1.1, 1.1.1) using heading styles.
- Revision block on the cover or first page: Rev / Date / Description / Prepared / Checked.
- Table of contents for documents over ~8 pages, generated from heading styles.
- Cross-references ("see Section 4.2", "refer Annexure B") must point at sections/annexures that actually exist — verify each one before delivery.

## 5. Verification Output (ships with every deliverable)

Append a short verification table so the user sees evidence, not claims:

| Check | Method | Result |
|---|---|---|
| Abstract F42 = sum of detail sheets | Recomputed via openpyxl | 48,217.50 = 48,217.50 OK |
| All items have drawing refs | Column scan, 0 blanks | PASS |
| Units consistent | Unit column audit | PASS |

One row per quality gate exercised plus any file-level checks (formulas recalc, TOC resolves).

## 6. Language

- Default output language is English.
- Tamil-language output is supported on request for narrative sections (cover letters, claim narratives, report prose); keep dims, item descriptions in tables, and formulas in English for auditability.
