---
name: workflow-factory
description: X Layer 5 capstone of fable-ultra - the factory that creates, tests, versions, and registers reusable Workflow-tool pipeline templates so common multi-agent processes become build-once, reuse-many. Use when the user says 'make a workflow template', 'create/save/register a reusable pipeline', 'turn this into a Workflow script', 'build a research/development/verification/deployment/business/learning pipeline template', 'add a workflow to the factory', 'parameterize this multi-agent process', 'run/resume a saved workflow', or when ultra-code/meta-brain notice a multi-stage process worth templating. It manufactures parameterized .js Workflow scripts under workflows/; it does not build end-user products (agent-system), manage subagents (agent-factory), author SKILL.md (skill-factory), or run the ad-hoc loop (ultra-code). Governed by omega-constitution.
---

# Workflow Factory (X Layer 5)

Governed by `omega-constitution` (10 X-LAWS). Manufacture reusable Workflow scripts: build-once,
reuse-many. A template is an adaptable STARTING POINT, never a turnkey guarantee — every run
re-tailors stage prompts to the actual task. Real mechanisms only: `.js` files under `workflows/`,
the Workflow tool (`agent`/`pipeline`/`parallel`), `node --check`, MCP connectors, Ollama. Absent
capability => STOP-and-report; never fake connector output or claim a pass without evidence.

Follow the shared discipline contract `knowledge/ai/fable5-discipline.md` — plan-first, verify by
execution with evidence in the form `<command> -> exit <code> -> "<output>"`, independent critique,
and the `$FU` portable home. `$FU` resolves per its section 4 (env `FABLE_ULTRA_HOME` -> legacy
`J:\fable 5\fable-ultra` if present -> `%USERPROFILE%\.fable-ultra`). Resolve it per-platform, never
PowerShell-only — PowerShell:
`$FU = if ($env:FABLE_ULTRA_HOME) { $env:FABLE_ULTRA_HOME } elseif (Test-Path 'J:\fable 5\fable-ultra') { 'J:\fable 5\fable-ultra' } else { Join-Path $env:USERPROFILE '.fable-ultra' }`
(PS 5.1-safe: `if/else`, never the `??` operator); POSIX (Linux/macOS, incl. remote containers):
`FU="${FABLE_ULTRA_HOME:-${CLAUDE_PLUGIN_ROOT:-$HOME/.fable-ultra}}"`.

## 1. Template categories (each = one parameterized Workflow script)

| Category    | File                              | Shape (stages)                                  |
|-------------|-----------------------------------|-------------------------------------------------|
| Research    | `workflows/research-pipeline.js`  | fan-out search -> deep-read -> adversarial verify -> cited synthesis |
| Development | `workflows/dev-pipeline.js`       | plan -> build (pipeline) -> verify -> review -> loop (defers to ultra-code shape) |
| Verification| `workflows/verify-pipeline.js`    | collect artifacts -> N refuters (parallel) -> majority verdict |
| Deployment  | `workflows/deploy-pipeline.js`    | pre-flight checks -> HUMAN GATE -> release -> post-deploy verify |
| Business    | `workflows/business-pipeline.js`  | opportunity -> plan -> draft assets -> critic (no auto-send/publish) |
| Learning    | `workflows/learning-pipeline.js`  | gather evidence -> propose change -> eval before/after -> keep-if-wins |

## 2. PLAN first — before writing the .js (discipline contract, plan-first)

Draft and present for review BEFORE any code exists: (a) the stage list in order, one line of purpose
each; (b) the `args` contract — every input name, type, default; (c) the done-condition and iteration
ceiling the loop will enforce (section 8). Review = user sign-off when present, else recorded
self-critique per the discipline contract. A template whose done-condition cannot be stated in the
plan is rejected here — do not write the file.

## 3. Storage layout — a valid Workflow script

Create the dir on first write: `New-Item -ItemType Directory -Force -Path "$FU\workflows"`
(PowerShell) or `mkdir -p "$FU/workflows"` (POSIX).
Save each template as `$FU\workflows\<name>.js` (`$FU/workflows/<name>.js` on POSIX). Every template MUST:

1. Start with a `// version: vN — <date>` comment (bump on every change, section 5).
2. `export const meta = { name, description, phases }` — same shape as
   `skills/ultra-code/scripts/ultra-code-workflow.js`.
3. Read ALL inputs from the `args` global — never hardcode task text:
   `const goal = (args && args.goal) || 'No goal — report and stop.'`.
4. Build with `agent(promptString, { label, schema, phase, model, effort, agentType, isolation })` —
   route hard verify/judge stages to `model: 'fable'` (Fable 5, strongest tier) with
   `effort: 'high'|'max'`, cheap/mechanical stages to `effort: 'low'` (and a cheaper model), parallel
   file-mutating stages to `isolation: 'worktree'`, registered subagents via `agentType`;
   `pipeline(items, ...stages)` for independent items (no barrier), `parallel(thunks)` only where a
   stage needs all prior results.
5. Put a `schema` on every data-returning `agent()` call; call `phase('...')` / `log('...')`.
6. Include an iteration ceiling (section 8) and a `return` summary object.
7. DETERMINISM: never call `Date.now()`, `Math.random()`, or arg-less `new Date()` inside a workflow
   script — they THROW in a Workflow run and would break resume replay; pass timestamps and seeds in
   via `args` (e.g. `args.now`, `args.seed`).

Maintain `workflows/INDEX.md` — a table of `name | purpose | args (in) | outputs`. Update it whenever
a template is added or its interface changes (section 5).

## 4. TEST before registering (X-LAW: verification over generation)

Syntax-check EVERY template with Node before it enters INDEX.md. Because a Workflow body uses
top-level `return`/`await` and the `args`/`agent` globals, a bare `node --check <file>` fails — wrap
the body in an async function first, exactly as ultra-code's termination test did. Windows-safe:

```powershell
$src = "$FU\workflows\research-pipeline.js"
# Strip the multi-line `export const meta = { ... }` block. Must be singleline-aware
# ([\s\S] crosses newlines) — a `(?m)`-only `.*?` pattern will NOT match across the block
# and would leave the top-level `export` in the wrapper.
$body = [regex]::Replace((Get-Content $src -Raw), 'export\s+const\s+meta[\s\S]*?\n\}', '')
# Templates are ESM (they use `export`); write the wrapper as `.mjs` so Node checks it as ESM.
# A `.js` (CommonJS) temp file lets a stray top-level `export` flip Node into error-recovery
# and MASK real syntax errors — broken templates would falsely pass.
$tmp  = Join-Path $env:TEMP 'wf-check.mjs'
# `workflow` MUST be in the param list — templates that nest one level via `workflow(name, args)`
# would otherwise trip a false SYNTAX/DRY-RUN failure on an undefined global.
"async function __wf(args, agent, pipeline, parallel, workflow, phase, log, budget){`n$body`n}" |
  Out-File -Encoding utf8 $tmp
node --check $tmp; if ($?) { 'SYNTAX OK' } else { 'SYNTAX FAIL — fix and re-check' }
```

Then a stubbed-globals DRY-RUN is MANDATORY for every template — no exceptions, no "where feasible":
stub `agent`/`pipeline`/`parallel` to return canned schema-shaped objects, pass a small `args`, and
execute the wrapped body. PASS = it prints `DRY-RUN PASS` (the function returned within the 30 s
guard). FAIL = `DRY-RUN FAIL` (threw, or the hang guard fired) — fix and re-run; a template without
a recorded PASS does not enter INDEX.md. Reuses `$body` from the wrapper step above (same session):

```powershell
# The `workflow` stub is REQUIRED (equivalently `global.workflow = async () => ({})`): a template
# that nests one level via `workflow(name, args)` would otherwise DRY-RUN FAIL on an undefined
# global and be falsely rejected by the gate.
$stubs = 'const agent=async()=>({passes:true,defects:[],workItems:[],newWorkItems:[]});const pipeline=async()=>[];const parallel=async(t)=>Promise.all(t.map(f=>f()));const workflow=async()=>({});const phase=()=>{};const log=()=>{};const budget={total:0,remaining:()=>1e9};const args={goal:"dry-run",maxIterations:1};'
$guard = 'const t=setTimeout(()=>{console.log("DRY-RUN FAIL - hang");process.exit(1)},30000);__wf().then(()=>{clearTimeout(t);console.log("DRY-RUN PASS")}).catch(e=>{console.log("DRY-RUN FAIL - "+e.message);process.exit(1)});'
$run = Join-Path $env:TEMP 'wf-dryrun.mjs'
($stubs + "`nasync function __wf(){`n" + $body + "`n}`n" + $guard) | Out-File -Encoding utf8 $run
node $run
```

POSIX equivalent (Linux/macOS, incl. remote containers) — same stubs, same guard, same PASS/FAIL line:

```bash
# strip the meta block with Node (portable, same singleline-aware regex as above)
node -e 'const fs=require("fs");fs.writeFileSync("/tmp/wf-body.js",fs.readFileSync(process.argv[1],"utf8").replace(/export\s+const\s+meta[\s\S]*?\n\}/,""))' "$FU/workflows/research-pipeline.js"
{ printf '%s\n' "$STUBS"; echo 'async function __wf(){'; cat /tmp/wf-body.js; echo '}'; printf '%s\n' "$GUARD"; } > /tmp/wf-dryrun.mjs
node /tmp/wf-dryrun.mjs
```

Record both results as discipline-contract evidence, e.g. `node $run -> exit 0 -> "DRY-RUN PASS"`.

If Node is not installed, STOP-and-report ("install Node to syntax-test templates") — do not register
an unchecked script.

## 5. VERSION + REGISTER

1. Bump the `// version:` comment at the top of the `.js` (vN -> vN+1, dated).
2. Update the row in `workflows/INDEX.md` (name, purpose, args, outputs). Add the row if new.
3. Registration = the file existing under `workflows/` + its INDEX.md row. No plugin.json edit is
   needed for a template (it is data, not a skill); bump plugin.json only if you also ship a new skill.

## 6. REUSE — run or resume a template

- Run: `Workflow({ scriptPath: '<$FU>\\workflows\\research-pipeline.js' })` (expand `<$FU>` to the
  resolved home — the Workflow tool takes a literal path), passing
  inputs the script reads from `args` (e.g. `{ args: { goal, maxIterations: 8 } }`).
- Resume after an edit: `Workflow({ scriptPath, resumeFromRunId })` — identical `agent()` prefixes
  return cached results instantly; only changed/new calls re-run.
- Adapt, don't run blind: before each run, re-tailor the stage prompts to the real task (section 7).
- Background/recurring runs use the `schedule` skill plus the Task and Cron tools.
- Recovery after a crash/reset: resume-by-run-id IS the PRIMARY path —
  `Workflow({ scriptPath, resumeFromRunId })` replays cached results for the unchanged `agent()`
  prefix, read from `journal.jsonl` in that run's transcript dir (one line per agent return value).
  Only changed/new calls re-run, so a resumed recovery costs a fraction of a cold restart. Determinism
  is what makes this work: a template that calls `Date.now()`/`Math.random()` breaks the prefix
  (section 3, rule 7). A `<name>-run.md` run-state file is a SUPPLEMENT, not the recovery mechanism —
  keep it human-readable and record the run-id in it so the resume call survives a reset.

## 7. Honesty (X-LAWS 01, 03)

Templates are adaptable scaffolds, not turnkey guarantees. State this in every `meta.description`.
No literal-AGI, no guaranteed-profit, no "self-training frontier models" claims. Each run adapts the
stage prompts; a template that has never been run against real inputs is UNPROVEN — say so.

## 8. Termination — mandatory in every template (X-LAW: no unbounded loops)

Every generated template MUST carry an iteration ceiling and a done-condition — no `while (true)`.
Use the ultra-code pattern: `while (queue.length && iter < MAX_ITER && dryRounds < 2)`, with
`MAX_ITER = (args && args.maxIterations) || 10`, plus a budget guard
(`if (budget.total && budget.remaining() < 50000) break`). If a template cannot express a
done-condition, it is not ready — do not register it.

## 9. Governance + log to knowledge-lake (X-LAWS 07, 09, 10)

- Deployment/business templates keep the HUMAN GATE for irreversible actions (release, send,
  publish, money movement, delete) — the template pauses and reports; never auto-executes in a loop.
- If a stage needs an MCP connector or credential absent this session, the template's stage returns
  `status: "blocked"` with the exact setup step — never simulated output.
- After a template ships (or is blocked), append one dated line to
  `$FU\memory\lessons.md`, then register the template (name, purpose, path,
  verification result) in `knowledge-lake` (source-attributed). No log = the cycle is not complete.
