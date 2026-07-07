# fable-ultra

A Claude Code plugin — a practical AI operating system bundling the **ultra-code** autonomous
build engine, **model-max** any-model quality forcing, factories (skill/agent/algorithm/workflow),
knowledge + governance layers, and grounded domain builders — **26 verified skills** in total.

## What's inside

```
fable-ultra/
├── .claude-plugin/plugin.json      # plugin manifest
├── .mcp.json                       # sample MCP config + per-skill connector map
├── commands/
│   ├── ultra-code.md               # /ultra-code <goal> — run the autonomous build loop
│   └── self-upgrade.md             # /self-upgrade — one eval-gated plugin improvement cycle
├── memory/
│   └── lessons.md                  # cross-run lessons, read at start / appended after runs
├── CHANGELOG.md
├── skills/
│   ├── ai-os/                      # operating doctrine: token/routing/knowledge/factory rules -> skills
│   ├── algorithm-factory/          # benchmark-gated algorithm selection (only measured winners ship)
│   ├── ecosystem-orchestrator/     # X L11 — drive a mission through the full build chain
│   ├── governance-core/            # X L12 — ALLOW/BLOCK/NEEDS-APPROVAL gates + budget + audit
│   ├── workflow-factory/           # X L5 — reusable, Node-checked Workflow pipeline templates
│   ├── omega-constitution/         # governance: 10 Laws, lifecycle, final-deliverable spec
│   ├── model-router/               # System A — task-aware model selection + escalation
│   ├── research-council/           # System B — 7-role deliberation -> cited recommendation
│   ├── skill-factory/              # Systems C+P — auto-create/verify/version/publish skills
│   ├── agent-factory/              # System D — create/deploy/monitor/retire subagents
│   ├── knowledge-lake/             # Systems E+Q — source-attributed permanent memory
│   ├── dream-factory/              # Systems F+N — goal -> business plan -> built & operated
│   ├── meta-brain/                 # Systems S+O+R — health metrics, autonomy, opportunity gate
│   ├── fable5-ultra-prompt-engine/ # prompt architect (imported unchanged)
│   ├── ultra-code/                 # plan -> build -> verify -> review -> loop-until-done
│   │   └── scripts/ultra-code-workflow.js
│   ├── model-max/                  # quality-forcing discipline for ANY selected model tier
│   ├── self-upgrade/               # eval-gated self-modification of the plugin itself
│   ├── qs-works/                   # QS/BOQ/IPC/Excel/document production + quality gates
│   ├── ai-builder/                 # LLM apps, RAG, embeddings, agents — small-model-first + evals
│   ├── vision-ocr/                 # image reading / OCR to structured data, validation-gated
│   ├── software-build/             # web/API/CLI/desktop builder
│   ├── android-app/                # Kotlin + Compose Android builder
│   ├── trading-bot/                # PAPER-MODE-DEFAULT trading systems
│   ├── agent-system/               # multi-agent systems on the Claude Agent SDK
│   ├── mcp-connector/              # build MCP servers / wire connectors together
│   └── astrology-report/           # ephemeris-accurate astrology software (Tamil-friendly)
└── README.md
```

## Install

From a local marketplace or directly:

```powershell
# Option A: add this folder as a local plugin marketplace, then install
claude plugin marketplace add "J:\fable 5"
claude plugin install fable-ultra

# Option B (dev): load it for one session
claude --plugin-dir "J:\fable 5\fable-ultra"
```

Then `/ultra-code <your goal>` or just describe a task — skills trigger by description.

## How the continuous loop works

`ultra-code` runs PLAN -> BUILD -> VERIFY -> REVIEW and loops failures/misses back into BUILD.
It terminates on one of three conditions (never runs forever, never quits early):

1. The **done-condition** (written down at PLAN time) is met — verified, not assumed.
2. **Dry loop** — 2 consecutive iterations produce zero new work items.
3. **Iteration ceiling** (default 10) — stops and reports remaining gaps honestly.

For work spanning sessions, pair it with the `/loop` skill (self-paced wakeups) or `schedule`
(cron cloud agents).

## How the token savings work

Not magic — mechanics: prompt-cache-aware pacing (stay inside the ~5-min cache window or commit
to long sleeps), scoped file reads, bulk search delegated to subagents so the main context stays
lean, structured-output schemas between workflow stages, Workflow `resumeFromRunId` so re-runs
hit cache on unchanged steps, and budget-guarded loops with hard ceilings.

## Required connectors

See `.mcp.json` -> `_connector_notes.per_skill_requirements`. Rule everywhere: if a required
connector isn't connected/authorized, the skill **stops and tells you the setup steps**. It never
simulates connector output. claude.ai connectors are authorized in your claude.ai connector
settings; local servers via `claude mcp add` or `/mcp` in an interactive session.

## Safety rails

- **Trading**: paper/dry-run mode by default. Live orders or money movement require your
  explicit, per-action confirmation — never inside an autonomous loop.
- Destructive/outward-facing actions get confirmation unless you durably authorized them.
- Every ultra-code run keeps an audit trail (`ultra-code-run.md`) in the project.

## v2: any-model quality + self-improvement

- **model-max** — most of the quality gap between model tiers on agentic work is *process*
  failure (no plan, no verification, fake "done", lost context). model-max forces the same
  strict loop on every model: plan -> small verified increments -> self-critique -> evidence-based
  done -> honest escalation when a task exceeds the model. It narrows the gap substantially;
  it does not literally change model weights.
- **self-upgrade** — the plugin edits its own skill files under eval gates: one focused change
  per cycle, kept only if a before/after eval shows improvement, safety rails immutable,
  everything versioned in CHANGELOG.md. Real self-modification, honestly scoped.
- **lessons memory** — every run appends a lesson; every run starts by reading them. The plugin
  gets sharper with use.

## What this plugin is — and isn't (honest boundaries)

- **Not literal AGI, not "smarter than all humans".** It is high-quality autonomous
  orchestration: planning, tool use, adversarial verification, and measured self-improvement
  loops (changes kept only when eval scores rise).
- **Not zero-token.** Every model call costs tokens. This plugin minimizes *waste*, it cannot
  eliminate cost.
- **Not guaranteed to beat other AI models or produce trading profit.** Backtests are not future
  returns; quality claims are backed by evals and verification, not promises.
- **It will not "never stop"** — by design. It runs until a real done-condition, then stops and
  reports. Unbounded loops are a bug, not a feature.
