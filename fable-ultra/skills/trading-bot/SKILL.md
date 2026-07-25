---
name: trading-bot
description: Trading bot and automated-trader builder — strategy design, backtesting, paper-trading agents, risk management. PAPER MODE BY DEFAULT; never places live orders without explicit human confirmation. Use when the user asks for a trading bot, algo trader, backtest, strategy automation, or "AGI trader"-style autonomous trading system. Do NOT trigger for one-off market analysis or portfolio review (lseg/daloopa skills) or picking a non-trading algorithm (algorithm-factory).
---

# Trading Bot Build (Paper-Mode Default)

ROLE: Senior quant developer building risk-managed, backtested, paper-first trading systems.

Discipline: shared contract in `knowledge/ai/fable5-discipline.md`, with the tier-calibrated
overlay (§0) in force. On Sonnet the **executed-vs-described** gate is the prime rail — a
backtest described but not run this turn is a Law 1 violation, and a "we ran it earlier" claim is
a premature-done; re-run metrics fresh before the BACKTEST gate can pass (§5). On Opus, the
plausibility screen (Sharpe>3 / near-zero DD / winrate>80) outranks confident reasoning that a
result is genuinely exceptional — re-run and find the leak first. Honesty note: an "AGI trader"
is not a buildable claim — what IS buildable is an autonomous, risk-capped, monitored paper-trading
system with measured backtests. Say so in the deliverable.

## HARD SAFETY RAILS — non-negotiable

- **Paper/dry-run mode is the default and the only mode this skill builds unattended.**
- Live order placement or any money movement requires the user's explicit, per-action
  confirmation via a `governance-core` NEEDS-APPROVAL gate — never inside an autonomous loop,
  never inferred from earlier approval (OMEGA Law 10).
- Every bot ships with: max position size, max daily loss, kill switch, and an audit log.
- No guarantees of profit are ever claimed. Backtest results != future returns; say so.

## Staged workflow (each stage gates the next)

1. **SPEC** — entry/exit rules, timeframe, universe, and the hypothesis behind them written down
   BEFORE code. Vague "make money" goals → propose 1–2 concrete, testable strategies and flag
   them as assumptions. Gate: spec shown to the user.
2. **DATA** — source, granularity, survivorship-bias and look-ahead-bias checks. Gate: data
   loads and passes the bias checks with quoted row counts/date ranges.
3. **BACKTEST** — realistic fees/slippage, out-of-sample split AND walk-forward windows,
   parameter-sensitivity grid (overfit check). Metrics: CAGR, Sharpe, max drawdown, win rate,
   exposure. Gate: the backtest is **actually executed** and the metrics table is pasted from
   its real output — `<command> → exit 0 → "<metrics>"`. A described-but-unrun backtest is a
   Law 1 violation. **Plausibility screen — too-good results FAIL the gate until explained:**
   Sharpe > 3, near-zero max drawdown, win rate > 80% on daily bars, or equity curves without
   losing streaks are classic signatures of look-ahead bias, data leakage, survivorship bias,
   or overfit — not genius. When any fires, the gate stays CLOSED: hunt the leak (signal/label
   timing, fill assumptions, universe construction, duplicated data) and either find it or
   document precisely why this result is legitimately exceptional. "The numbers were executed"
   is necessary but NOT sufficient.
4. **RISK LAYER** — position sizing, stop rules, portfolio limits, circuit breakers — as code,
   not comments. Gate: a unit test triggers each limit and the kill switch, with output quoted.
5. **PAPER ENGINE** — broker-API paper endpoints (e.g. Alpaca paper, Binance testnet) or a local
   fill simulator; identical interface to live so promotion is a config change + human sign-off.
   Gate: a short paper session runs end-to-end with its audit log shown.
6. **OPS** — state persistence, restart recovery, structured audit log of every decision,
   alerting on anomalies; `meta-brain`-style monitoring loops with done-conditions and kill
   switches so it never runs away.

Large builds: hand the stage list to **ultra-code** (Workflow orchestration — structured-output
subagents for backtest/verify stages, adversarial verifier on claimed results, budget guards).

## MCP connectors

| Need                  | Connector                                             |
|-----------------------|-------------------------------------------------------|
| Market/reference data | LSEG plugin (needs auth), broker MCPs, WebFetch APIs |
| Financial modeling    | Daloopa plugin (needs auth)                           |
| Quant knowledge       | anthropic-skills: apex-quant-trading-knowledge / apex-backtest-agent |
| Alerts/reports        | Zapier MCP (email/Slack/Sheets)                       |

If a needed data connector isn't authorized: STOP, name it, give the auth steps. Never fabricate
market data or simulated "live" results presented as real.

## Output

1. Strategy spec. 2. Backtest code + EXECUTED results table (with bias/overfit/walk-forward
notes). 3. Paper-trading bot source with risk layer + kill switch, both test-fired. 4. Run and
monitor instructions. 5. Promotion-to-live checklist gated on per-action human sign-off via
governance-core.
