---
name: workflow-factory
description: X LAYER 5 capstone of the fable-ultra X OMEGA plugin — the factory that creates, tests, versions, and registers reusable Workflow-tool pipeline templates so common multi-agent processes become build-once, reuse-many (X-LAW 06, reusable systems over temporary outputs). Use when the user says "make a workflow template", "create/save/register a reusable pipeline", "turn this into a Workflow script", "build a research/development/verification/deployment/business/learning pipeline template", "add a workflow to the factory", "parameterize this multi-agent process", "run/resume a saved workflow", or when ultra-code/meta-brain notice a multi-stage process worth templating. It MANUFACTURES parameterized `.js` Workflow scripts under `workflows/`; it does not build end-user agent products (agent-system), manage least-privilege subagents (agent-factory), author SKILL.md assets (skill-factory), or run the ad-hoc build loop itself (ultra-code) — it packages such loops into reusable, tested templates. Governed by omega-constitution.
---

# Workflow Factory (X Layer 5)

Governed by `omega-constitution` (10 X-LAWS). Manufacture reusable Workflow scripts: build-once,
reuse-many. A template is an adaptable STARTING POINT, never a turnkey guarantee — every run
re-tailors stage prompts to the actual task. Real mechanisms only: `.js` files under `workflows/`,
the Workflow tool (`agent`/`pipeline`/`parallel`), `node --check`, MCP connectors, Ollama. Absent
capability => STOP-and-report; never fake connector output or claim a pass without evidence.

## 1. Template categories (each = one parameterized Workflow script)

| Category    | File                              | Shape (stages)                                  |
|-------------|-----------------------------------|-------------------------------------------------|
| Research    | `workflows/research-pipeline.js`  | fan-out search -> deep-read -> adversarial verify -> cited synthesis |
| Development | `workflows/dev-pipeline.js`       | plan -> build (pipeline) -> verify -> review -> loop (defers to ultra-code shape) |
| Verification| `workflows/verify-pipeline.js`    | collect artifacts -> N refuters (parallel) -> majority verdict |
| Deployment  | `workflows/deploy-pipeline.js`    | pre-flight checks -> HUMAN GATE -> release -> post-deploy verify |
| Business    | `workflows/business-pipeline.js`  | opportunity -> plan -> draft assets -> critic (no auto-send/publish) |
| Learning    | `workflows/learning-pipeline.js`  | gather evidence -> propose change -> eval before/after -> keep-if-wins |

## 2. Storage layout — a valid Workflow script

Create the dir on first write: `New-Item -ItemType Directory -Force -Path 'J:\fable 5\fable-ultra\workflows'`.
Save each template as `J:\fable 5\fable-ultra\workflows\<name>.js`. Every template MUST:

1. Start with a `// version: vN — <date>` comment (bump on every change, section 4).
2. `export const meta = { name, description, phases }` — same shape as
   `skills/ultra-code/scripts/ultra-code-workflow.js`.
3. Read ALL inputs from the `args` global — never hardcode task text:
   `const goal = (args && args.goal) || 'No goal — report and stop.'`.
4. Build with `agent(promptString, { label, schema, phase })`, `pipeline(items, ...stages)` for
   independent items (no barrier), `parallel(thunks)` only where a stage needs all prior results.
5. Put a `schema` on every data-returning `agent()` call; call `phase('...')` / `log('...')`.
6. Include an iteration ceiling (section 8) and a `return` summary object.

Maintain `workflows/INDEX.md` — a table of `name | purpose | args (in) | outputs`. Update it whenever
a template is added or its interface changes (section 4).

## 3. TEST before registering (X-LAW: verification over generation)

Syntax-check EVERY template with Node before it enters INDEX.md. Because a Workflow body uses
top-level `return`/`await` and the `args`/`agent` globals, a bare `node --check <file>` fails — wrap
the body in an async function first, exactly as ultra-code's termination test did. Windows-safe:

```powershell
$src = 'J:\fable 5\fable-ultra\workflows\research-pipeline.js'
# Strip the multi-line `export const meta = { ... }` block. Must be singleline-aware
# ([\s\S] crosses newlines) — a `(?m)`-only `.*?` pattern will NOT match across the block
# and would leave the top-level `export` in the wrapper.
$body = [regex]::Replace((Get-Content $src -Raw), 'export\s+const\s+meta[\s\S]*?\n\}', '')
# Templates are ESM (they use `export`); write the wrapper as `.mjs` so Node checks it as ESM.
# A `.js` (CommonJS) temp file lets a stray top-level `export` flip Node into error-recovery
# and MASK real syntax errors — broken templates would falsely pass.
$tmp  = Join-Path $env:TEMP 'wf-check.mjs'
"async function __wf(args, agent, pipeline, parallel, phase, log, budget){`n$body`n}" |
  Out-File -Encoding utf8 $tmp
node --check $tmp; if ($?) { 'SYNTAX OK' } else { 'SYNTAX FAIL — fix and re-check' }
```

Where feasible, DRY-RUN termination with stubbed globals (as ultra-code's termination proof did):
define `agent`/`pipeline`/`parallel` as stubs returning canned schema-shaped objects, pass a small
`args`, and confirm the wrapped function RETURNS (does not hang). Node example:

```powershell
node -e "const a=async()=>({passes:true,defects:[],workItems:[],newWorkItems:[]});global.agent=a;global.pipeline=async(i,...s)=>[];global.parallel=async(t)=>Promise.all(t.map(f=>f()));global.phase=()=>{};global.log=()=>{};global.budget={total:0,remaining:()=>1e9};require('./wrap.js')"
```

If Node is not installed, STOP-and-report ("install Node to syntax-test templates") — do not register
an unchecked script.

## 4. VERSION + REGISTER

1. Bump the `// version:` comment at the top of the `.js` (vN -> vN+1, dated).
2. Update the row in `workflows/INDEX.md` (name, purpose, args, outputs). Add the row if new.
3. Registration = the file existing under `workflows/` + its INDEX.md row. No plugin.json edit is
   needed for a template (it is data, not a skill); bump plugin.json only if you also ship a new skill.

## 5. REUSE — run or resume a template

- Run: `Workflow({ scriptPath: 'J:\\fable 5\\fable-ultra\\workflows\\research-pipeline.js' })`, passing
  inputs the script reads from `args` (e.g. `{ args: { goal, maxIterations: 8 } }`).
- Resume after an edit: `Workflow({ scriptPath, resumeFromRunId })` — identical `agent()` prefixes
  return cached results instantly; only changed/new calls re-run.
- Adapt, don't run blind: before each run, re-tailor the stage prompts to the real task (section 6).
- Background/recurring runs use the `schedule` skill plus the Task and Cron tools. There is NO standalone
  "Workflow resumeFromRunId" recovery tool — recover a crashed run by relaunching from its
  run-state file (write intermediate state to a `<name>-run.md` so progress survives a reset).

## 6. Honesty (X-LAWS 01, 03)

Templates are adaptable scaffolds, not turnkey guarantees. State this in every `meta.description`.
No literal-AGI, no guaranteed-profit, no "self-training frontier models" claims. Each run adapts the
stage prompts; a template that has never been run against real inputs is UNPROVEN — say so.

## 7. Termination — mandatory in every template (X-LAW: no unbounded loops)

Every generated template MUST carry an iteration ceiling and a done-condition — no `while (true)`.
Use the ultra-code pattern: `while (queue.length && iter < MAX_ITER && dryRounds < 2)`, with
`MAX_ITER = (args && args.maxIterations) || 10`, plus a budget guard
(`if (budget.total && budget.remaining() < 50000) break`). If a template cannot express a
done-condition, it is not ready — do not register it.

## 8. Governance + log to knowledge-lake (X-LAWS 07, 09, 10)

- Deployment/business templates keep the HUMAN GATE for irreversible actions (release, send,
  publish, money movement, delete) — the template pauses and reports; never auto-executes in a loop.
- If a stage needs an MCP connector or credential absent this session, the template's stage returns
  `status: "blocked"` with the exact setup step — never simulated output.
- After a template ships (or is blocked), append one dated line to
  `J:\fable 5\fable-ultra\memory\lessons.md`, then register the template (name, purpose, path,
  verification result) in `knowledge-lake` (source-attributed). No log = the cycle is not complete.
