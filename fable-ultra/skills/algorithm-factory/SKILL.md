---
name: algorithm-factory
description: Generate, test, benchmark, compare, and promote algorithms/strategies so only a MEASURED winner enters production. Use when the user needs the best concrete approach for a problem — sorting/matching/ranking/pricing/routing/scheduling logic, a heuristic vs exact trade-off, an ML/rule choice, or "find the fastest/most accurate way to do X". Differs from skill-factory (creates SKILLS) and trading-bot (backtests a full trading strategy) - algorithm-factory picks the winning ALGORITHM by measured benchmark. Governed by omega-constitution.
---

# Algorithm Factory — Benchmark-Gated Selection

Only a MEASURED winner enters production. Never promote on intuition (X-LAW 03/10).

## Process (in order)

1. **DEFINE** — the problem, the inputs, and the SUCCESS METRIC(s): correctness, speed, memory,
   accuracy — PLUS the promote threshold (minimum improvement over the incumbent that justifies a
   switch). Write the DEFINE block down and gate on it BEFORE any candidate code exists — this
   prevents post-hoc bias.
2. **GENERATE** — 2–5 candidates that are genuinely DIFFERENT approaches (not tweaks of one).
   State each one's idea and complexity (Big-O) up front, one candidate implemented and
   correctness-tested at a time.
3. **TEST** — correctness first, on a shared test set including edge cases (empty, huge, adversarial,
   ties, duplicates). A candidate that fails correctness is disqualified before benchmarking.
4. **BENCHMARK** — run all surviving candidates on the SAME inputs at representative AND worst-case
   sizes; measure the chosen metric with real numbers (`timeit`, `Measure-Command`, Stopwatch,
   row counts). Benchmark hygiene: warm up before timing (JIT/cache effects), repeat N≥5 runs and
   report median + spread — a single run is noise, not a measurement. Watch for overfitting to
   the shared test set and for benchmark data that doesn't match production distribution; say so
   when either risk applies. No fabricated numbers — measured only (X-LAW 03).
5. **COMPARE** — a results table: candidate | correctness | metric(s) median±spread | complexity | notes.
6. **PROMOTE** — the winner enters production ONLY if it clears the DEFINE-stage threshold over
   the incumbent AND passes correctness. No candidate clears it → keep the incumbent and record
   the null result (a kept incumbent is a valid, storable outcome). Break ties by
   simplicity/maintainability. Record why it won.
7. **STORE** — append the benchmark + decision to `knowledge-lake` (benchmarks/ + lessons);
   record the LOSERS too, so they are not re-tried.

## Orchestration (many candidates or slow benchmarks)

Fan candidates out via the Workflow tool: one structured-output subagent per candidate
(implement + correctness-test), `pipeline()` into benchmark runs, then ONE adversarial verifier
that checks reported numbers came from actual executions (re-runs a spot sample; refutes any
number without a command behind it). Cap tokens/time per candidate; discipline contract in
`knowledge/ai/fable5-discipline.md`.

## Rules

- Reproducible: fixed seeds, stated runtime/hardware, identical data for every candidate.
- Honest scope: a micro-benchmark is not production proof at scale — say so, and re-benchmark at
  real volume before shipping.
- Trading strategies route to `trading-bot` for full backtest/walk-forward/stress and are
  paper-default + human-gated — never promote a trading strategy to live from here.
- Windows timing: `Measure-Command { ... }`; or a language-native timer.

## Output

The measured comparison table · the promoted choice + justification · reproducibility notes ·
the `knowledge-lake` entry path.
