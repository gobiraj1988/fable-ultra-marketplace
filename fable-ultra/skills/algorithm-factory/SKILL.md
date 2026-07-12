---
name: algorithm-factory
description: Generate, test, benchmark, compare, and promote algorithms/strategies so only a MEASURED winner enters production. Use when the user needs the best concrete approach for a problem — sorting/matching/ranking/pricing/routing/scheduling logic, a heuristic vs exact trade-off, an ML/rule choice, or "find the fastest/most accurate way to do X". Differs from skill-factory (creates SKILLS) and trading-bot (backtests a full trading strategy) - algorithm-factory picks the winning ALGORITHM by measured benchmark. Governed by omega-constitution.
---

# Algorithm Factory — Benchmark-Gated Selection

Only a MEASURED winner enters production. Never promote on intuition (X-LAW 03/10).

## Process (in order)

1. **DEFINE** — the problem, the inputs, and the SUCCESS METRIC(s): correctness, speed, memory,
   accuracy. Pick the metric BEFORE generating candidates — this prevents post-hoc bias.
2. **GENERATE** — 2–5 candidates that are genuinely DIFFERENT approaches (not tweaks of one).
   State each one's idea and complexity (Big-O) up front.
3. **TEST** — correctness first, on a shared test set including edge cases (empty, huge, adversarial,
   ties, duplicates). A candidate that fails correctness is disqualified before benchmarking.
4. **BENCHMARK** — run all surviving candidates on the SAME inputs at representative AND worst-case
   sizes; measure the chosen metric with real numbers (language-native timers like Python
   `timeit`/`time.perf_counter`, Node `performance.now()`, or shell timers such as PowerShell
   `Measure-Command`; row counts). No fabricated numbers — measured only (X-LAW 03).
5. **COMPARE** — a results table: candidate | correctness | metric(s) | complexity | notes.
6. **PROMOTE** — the winner enters production ONLY if it beats the incumbent on the metric AND
   passes correctness. Break ties by simplicity/maintainability. Record why it won.
7. **STORE** — append the benchmark + decision to `knowledge-lake` (benchmarks/ + lessons);
   record the LOSERS too, so they are not re-tried.

## Rules

- Reproducible: fixed seeds, stated runtime/hardware, identical data for every candidate.
- Honest scope: a micro-benchmark is not production proof at scale — say so, and re-benchmark at
  real volume before shipping.
- Trading strategies route to `trading-bot` for full backtest/walk-forward/stress and are
  paper-default + human-gated — never promote a trading strategy to live from here.
- Timing: prefer a language-native timer (Python `time.perf_counter`, Node `performance.now()`)
  — portable across platforms; PowerShell example: `Measure-Command { ... }`.

## Output

The measured comparison table · the promoted choice + justification · reproducibility notes ·
the `knowledge-lake` entry path.
