---
name: vision-ocr
description: Image-reading and OCR builder for the fable-ultra plugin. Use when the user wants to OCR anything, read an image, extract text from an image/PDF/scan, convert an image to text/Excel/JSON, read invoices/receipts/forms/handwriting/construction drawings, do document extraction, recognize handwriting, or asks for an "image reading OCR creator". Builds pipelines that turn photos, scanned PDFs, and drawing sheets into clean text or validated structured data.
---

# Vision OCR — Image Reading & Extraction Builder

Build OCR/vision extraction tools. Every claim below maps to a real mechanism — no magic accuracy, no silent guessing.

## 1. Engine picker (decide this FIRST)

| Input | Engine | Why |
|---|---|---|
| Born-digital PDF (has a text layer) | pdfplumber / pdf.js — extract text directly. NEVER OCR it | OCR degrades perfect text. Check for a text layer FIRST — across pages, None-safe: `python -c "import pdfplumber; d=pdfplumber.open('doc.pdf'); print([bool(p.extract_text()) for p in d.pages])"` (mixed True/False = hybrid PDF: extract text pages directly, OCR only the False pages) |
| Clean printed scans, high volume, zero budget | Tesseract locally (`choco install tesseract` / `winget install UB-Mannheim.TesseractOCR`) | Free, fast, good on clean print |
| Complex layouts, tables, handwriting, drawings, mixed content | Claude vision API — send the image, ask for structured output | Layout understanding beats character-level OCR |
| Production systems | Hybrid: cheap engine first, escalate hard pages to the vision model | Cost control without accuracy loss |

## 2. Pipeline (build in this order)

1. **Preprocess** — render/scan at 300+ DPI, deskew, boost contrast. Bad input caps accuracy before any engine runs.
2. **Classify** the document type (invoice / receipt / form / drawing / letter) — routing and schema depend on it.
3. **Extract** with the engine chosen in the table above.
4. **Structure** the output against a JSON schema with typed fields: dates as ISO dates, amounts as decimals, quantities as numbers with units. Never ship free-text where a typed field exists.
5. **Validate** — recompute totals from line items, regex-check dates/numbers/IDs, cross-field consistency (subtotal + tax == total; qty × rate == amount). A failed validation is a BLOCKING defect, not a warning. The record does not pass.
6. **Route low-confidence items to a human-review list** — flag them with page, field, raw crop reference, and reason. Never silently guess.

## 3. Claude vision rules

- Consult the **claude-api** skill for current model ids, pricing, and image size/count limits BEFORE writing any code. Do not hardcode model ids from memory.
- Batch multi-page documents page-by-page (one image per request, or per API batch item) — keeps confidence per page and lets you retry single pages.
- Use structured output schemas (tool/JSON schema) so the model returns typed fields, not prose.
- For regions the model cannot read, instruct it to output the literal marker `[UNREADABLE]` — never a plausible-looking guess.

## 4. Accuracy honesty (non-negotiable)

- Before trusting any pipeline, run it on a **labeled sample of >= 20 documents** with known ground truth.
- Report **field-level accuracy as measured** (e.g., "invoice_total: 19/20 correct on the sample"), not a global vibe.
- Never claim "99% accurate" — or any number — without that measurement backing it.
- Surface per-field confidence whenever the engine provides it (Tesseract word confidences, model self-reported confidence fields in the schema).

## 5. QS tie-in (construction drawings / BOQ pages)

Drawing and BOQ page reading feeds the **qs-works** skill. Extracted dimensions and quantities must pass qs-works quality gates:

- [ ] Traceability — every quantity carries its drawing/sheet reference and grid location
- [ ] Unit consistency — mm vs m vs m² declared and checked, no silent conversions
- [ ] Cross-checked totals — abstract totals recomputed from line measurements

Hand off structured JSON, not prose, so qs-works can run its own checks.

## 6. Small-model note

Tight-schema extraction works well on small/cheap vision tiers. Pattern:

1. Run the cheap tier with a strict JSON schema.
2. Add a **text-side verifier pass** — pure rules + recomputation (step 5 above), no model — to catch errors.
3. Escalate ONLY the pages that fail verification to a stronger model. Most pages never need it.

## 7. Deliverables — every OCR tool ships with

- [ ] The pipeline code (preprocess → classify → extract → structure → validate → route)
- [ ] A labeled-sample accuracy report (>= 20 docs, field-level numbers)
- [ ] A human-review queue file (CSV/JSON) for low-confidence and `[UNREADABLE]` items

Windows quick checks:

```powershell
tesseract --version                              # engine present?
python -m pip install pdfplumber pytesseract pillow anthropic
python -c "import pdfplumber; p=pdfplumber.open('doc.pdf'); print(bool(p.pages[0].extract_text()))"  # text layer?
```

If the text-layer check prints `True`, extract directly — do not OCR.
