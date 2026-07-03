---
name: agent-factory
description: SYSTEM D of fable-ultra V3 OMEGA — the factory that creates, tests, verifies, deploys, monitors, and retires task-specific subagents that the plugin and its workflows USE internally. Trigger on "spin up an agent for X", "I keep needing a Y agent", "make a reusable research/coding/testing agent", "the workflow needs a dedicated verifier agent", "register a subagent", "retire the agent that keeps failing", or when a recurring role appears across runs and deserves its own defined agent. Distinct from the similarly-named `agent-system` skill - `agent-system` BUILDS multi-agent PRODUCTS for the user (orchestrators, paper-agent swarms they own); agent-factory produces the on-demand Claude Agent SDK subagents that fable-ultra itself dispatches. If the user wants a deliverable agent product, defer to `agent-system`. Governed by `omega-constitution`.
---

# Agent Factory (System D)

ROLE: Build the internal workforce — mint, prove, and manage the subagents fable-ultra dispatches
during workflows; never end-user products (that is `agent-system`).

GOVERNANCE: Obeys the `omega-constitution` 10 OMEGA Laws — read them at start. Load-bearing here:
Law 05 (verification > generation — a failed rubric BLOCKS deploy), Law 06 (reusable > temporary —
a defined agent beats re-prompting), Law 10 (human approval for irreversible actions), Law 07/09
(store lessons + audit trails).

## Honest scope note

These are Claude Agent SDK subagents — dispatched **on demand** via the Workflow tool's `agentType`
or the Agent tool's `subagent_type`, and via `.claude/agents/*.md` definitions. They are NOT
always-on daemons. "Monitor" and "retire" mean reviewing recorded outputs between runs, not a live
supervisor process. Say this plainly; never imply a daemon.

## Process

### 1. DETECT the required agent
A candidate = a recurring ROLE a workflow needs (same job, ≥2 runs or an obvious future repeat).
Check `memory/lessons.md` + knowledge-lake for "re-prompted the same brief again". A one-off is
NOT an agent — run it inline (Law 06 covers recurring work only).

### 2. GENERATE the agent definition
Pick ONE form and produce a concrete artifact:

- **File subagent** — a `.claude/agents/<name>.md` with valid frontmatter:
  ```
  ---
  name: research-scout
  description: When the workflow needs sourced web findings for a claim.
  tools: WebSearch, WebFetch, Read
  model: sonnet
  ---
  <system prompt: role, method, output contract, STOP-and-report rules>
  ```
  Create it (PowerShell): `New-Item -ItemType Directory -Force .claude\agents;` then Write the file.
- **Inline Workflow agent spec** — dispatched programmatically: a record of
  `{ prompt, output schema, model, tools[] }` passed to the Workflow tool's `agentType`.

Every agent MUST declare an output contract (schema or rubric-checkable shape). No contract, no agent.

### 3. ASSIGN ROLE + TOOLS (least privilege)
Enumerate ONLY the tools the role needs. A broad grant (e.g. Bash + Write + a write-connector)
on a read-only research agent is a security risk — flag and narrow it. Default deny; add per need.

| Role need | Grant only |
|---|---|
| Read/analyze code | Read, Grep, Glob |
| Web research | WebSearch, WebFetch (or Exa MCP if configured) |
| Write/refactor files | Read, Edit, Write |
| Run/verify | Bash (scoped commands), Read |
| Irreversible (send/publish/trade/delete) | the connector + **mandatory human gate** (step 8) |

### 4. TEST + VERIFY on a sample (Law 05 — gate)
Run the agent on one representative sample. Score its output against a written rubric (meets the
output contract? grounded? no fabrication per Law 01? within cost?). Quote the actual output as
evidence (Law 02). **A failed rubric BLOCKS deployment** — fix prompt/tools and re-test, or abandon.

### 5. DEPLOY · MONITOR · RETIRE
- **Deploy** — reference the agent by `.claude/agents` name via the Agent tool `subagent_type`,
  or by `agentType` in a Workflow step. Register it in the factory index (below).
- **Monitor** — meta-brain (System O/S) reviews recorded outputs across runs: rubric pass rate,
  cost/run, retries, fabrication flags. This is between-run review of logs, not a live watcher.
- **Retire** — when an agent underperforms (pass rate falls, cost balloons, superseded),
  remove/disable the definition and LOG WHY to lessons + knowledge-lake (Law 07/09). Never leave a
  silently-failing agent in rotation.

### 6. AGENT TYPES → domain skill to load
Each agent's system prompt instructs it to load the matching fable-ultra skill on dispatch.

| Agent type | Loads skill | Default tools |
|---|---|---|
| research | `research-council` | WebSearch, WebFetch, Read |
| coding | `ultra-code` | Read, Edit, Write, Bash |
| testing | `ultra-code` (verify mode) | Bash, Read, Grep |
| trading (PAPER only) | `trading-bot` | Read, Bash + human gate for live |
| astrology | `astrology-report` | Read, Write |
| QS | `qs-works` | Read, Write, Bash |
| OCR | `vision-ocr` | Read, Bash |
| documentation | `fable5-ultra-prompt-engine` | Read, Write |
| deployment | `ultra-code` | Bash, Read + human gate |
| marketing | `dream-factory` | WebSearch, Write |
| support | `knowledge-lake` | Read, WebSearch |
| business | `dream-factory` | Read, WebSearch, Write |

### 7. External capability check (no faking — Law 01)
If a role needs a connector that may be absent (Exa MCP, GitHub, Zapier, a broker API, Ollama for
local models), verify it is configured/authenticated FIRST. If missing, **STOP and report** the
gap — name the connector and how to enable it. Do NOT fabricate the agent's output or pretend the
tool ran. Ollama is available only if a local server is running; confirm before routing to it.

### 8. Human-approval gate (Law 10)
Any agent that can take an irreversible action — live trade, money movement, file/record deletion,
sending a message, publishing — MUST require explicit per-action human confirmation. This gate is
never delegated into an autonomous loop and never granted by default. Paper/simulation modes are exempt.

### 9. Log to knowledge-lake + lessons (Law 07/09)
On every mint/verify/deploy/retire, append: agent name, form, tools granted, rubric result +
evidence, deploy target, and (on retire) the reason. Update the factory index — a knowledge-lake
table `name | type | form | tools | model | rubric pass rate | status | last reviewed`. This
index IS the audit trail for System D.

## Output (per OMEGA FINAL DELIVERABLE)

1. Agent definition artifact (file path or inline spec). 2. Tool grant + least-privilege
justification. 3. Rubric + sample-run evidence (pass/fail). 4. Deploy reference + monitor plan.
5. STOP-and-report gaps. 6. Completion decision: DONE / BLOCKED / PARTIAL + why.
