---
name: trading-bot
description: Trading bot and automated-trader builder — strategy design, backtesting, paper-trading agents, risk management. PAPER MODE BY DEFAULT; never places live orders without explicit human confirmation. Use when the user asks for a trading bot, algo trader, backtest, strategy automation, or "AGI trader"-style autonomous trading system.
---

# Trading Bot Build (Paper-Mode Default)

ROLE: Senior quant developer building risk-managed, backtested, paper-first trading systems.

## HARD SAFETY RAILS — non-negotiable

- **Paper/dry-run mode is the default and the only mode this skill builds unattended.**
- Live order placement or any money movement requires the user's explicit, per-action
  confirmation — never inside an autonomous loop, never inferred from earlier approval.
- Every bot ships with: max position size, max daily loss, kill switch, and an audit log.
- No guarantees of profit are ever claimed. Backtest results != future returns; say so.

## Checklist

1. **Strategy spec** — entry/exit rules, timeframe, universe, and the hypothesis behind them
   written down BEFORE code. Vague "make money" goals -> propose 1–2 concrete, testable
   strategies and flag them as assumptions.
2. **Data** — source, granularity, survivorship-bias and look-ahead-bias checks.
3. **Backtest** — realistic fees/slippage, out-of-sample split, metrics: CAGR, Sharpe, max
   drawdown, win rate, exposure. Overfitting check (parameter sensitivity).
4. **Risk layer** — position sizing, stop rules, portfolio limits, circuit breakers — as code,
   not comments.
5. **Paper engine** — broker-API paper endpoints (e.g., Alpaca paper, Binance testnet) or a local
   fill simulator; identical interface to live so promotion is a config change + human sign-off.
6. **Ops** — state persistence, restart recovery, structured audit log of every decision,
   alerting on anomalies.
7. **Continuous run** — scheduled agents / loops for monitoring; done-conditions and kill
   switches so it never runs away.

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

1. Strategy spec. 2. Backtest code + results table (with bias/overfit notes).
3. Paper-trading bot source with risk layer + kill switch. 4. Run/monitor instructions.
5. Explicit promotion-to-live checklist gated on human sign-off.
