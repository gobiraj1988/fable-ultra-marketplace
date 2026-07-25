// Reference ultra-code Workflow script — PLAN -> BUILD -> VERIFY -> REVIEW -> LOOP.
// Adapt stage prompts/schemas to the actual task before running. Plain JS (no TS).
// Pass the goal via args: Workflow({script, args: {goal: "...", maxIterations: 10}}).

export const meta = {
  name: 'ultra-code',
  description: 'Plan -> build -> verify -> review -> loop-until-done autonomous build',
  phases: [
    { title: 'Plan', detail: 'decompose goal into work-list + done-condition' },
    { title: 'Build', detail: 'one agent per work item' },
    { title: 'Verify', detail: 'adversarial verify each artifact' },
    { title: 'Review', detail: 'cross-item completeness critic' },
  ],
}

const PLAN_SCHEMA = {
  type: 'object',
  required: ['workItems', 'doneCondition'],
  properties: {
    doneCondition: { type: 'string' },
    workItems: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'task'],
        properties: {
          id: { type: 'string' },
          task: { type: 'string' },
          files: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
}

const BUILD_SCHEMA = {
  type: 'object',
  required: ['id', 'status', 'summary'],
  properties: {
    id: { type: 'string' },
    status: { enum: ['done', 'blocked'] },
    summary: { type: 'string' },
    blockedReason: { type: 'string' },
    filesTouched: { type: 'array', items: { type: 'string' } },
  },
}

const VERDICT_SCHEMA = {
  type: 'object',
  required: ['passes', 'defects'],
  properties: {
    passes: { type: 'boolean' },
    defects: { type: 'array', items: { type: 'string' } },
  },
}

const REVIEW_SCHEMA = {
  type: 'object',
  required: ['newWorkItems'],
  properties: {
    newWorkItems: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'task'],
        properties: { id: { type: 'string' }, task: { type: 'string' } },
      },
    },
  },
}

const goal = (args && args.goal) || 'No goal provided — report this and stop.'
const MAX_ITER = (args && args.maxIterations) || 10

// ---- PLAN ----
phase('Plan')
const plan = await agent(
  `Decompose this goal into independent, concretely-scoped work items with a measurable ` +
  `done-condition. Goal: ${goal}. Safety: if the goal involves trading or money movement, every ` +
  `work item must specify paper/dry-run mode; live trading is out of scope.`,
  { label: 'plan', schema: PLAN_SCHEMA }
)
log(`Plan: ${plan.workItems.length} items. Done when: ${plan.doneCondition}`)

// ---- BUILD/VERIFY pipeline + REVIEW loop-until-done ----
let queue = plan.workItems
const completed = []
const blocked = []
let dryRounds = 0
let iter = 0

// v5 tier-overlay preamble — every build/verify agent gets it. Omit model: to inherit the
// session tier; the preamble calibrates that tier's characteristic failure mode (discipline §0).
const TIER_PREAMBLE =
  `Discipline (fable5-discipline.md §0/§5): verify by execution THIS turn — never claim done ` +
  `from a remembered earlier run. If this is Sonnet, re-derive plan/state from the on-disk ` +
  `ultra-code-run.md before acting; if Opus, prefer the smallest sufficient fix and treat a ` +
  `fresh re-run as outranking a confident argument. Independent verifiers REFUTE and must not ` +
  `be shown the builder's reasoning.`

while (queue.length > 0 && iter < MAX_ITER && dryRounds < 2) {
  iter++
  log(`Iteration ${iter}: ${queue.length} work items`)

  // BUILD -> VERIFY per item, no barrier: item A verifies while item B builds.
  const results = await pipeline(
    queue,
    (item) =>
      agent(
        `${TIER_PREAMBLE}\n\n` +
        `Execute this work item toward the goal "${goal}". Item: ${JSON.stringify(item)}. ` +
        `Make real changes with tools. If a required MCP connector or credential is missing, ` +
        `return status "blocked" with the exact setup step — never simulate its output.`,
        { label: `build:${item.id}`, phase: 'Build', schema: BUILD_SCHEMA }
      ),
    (built, item) =>
      built.status === 'blocked'
        ? { built, verdict: { passes: false, defects: ['BLOCKED: ' + (built.blockedReason || 'unknown')] }, item }
        : agent(
            `${TIER_PREAMBLE}\n\n` +
            `Adversarially verify work item "${item.task}" (files: ${JSON.stringify(built.filesTouched || [])}). ` +
            `You are an INDEPENDENT verifier — you are given the goal and the files but NOT the builder's ` +
            `reasoning. Run the code/tests where possible THIS turn. Try to REFUTE that it works. ` +
            `Default passes=false if uncertain.`,
            { label: `verify:${item.id}`, phase: 'Verify', schema: VERDICT_SCHEMA }
          ).then((verdict) => ({ built, verdict, item }))
  )

  // Sort results; failures become next iteration's queue.
  const failed = []
  for (const r of results.filter(Boolean)) {
    if (r.built.status === 'blocked') blocked.push(r)
    else if (r.verdict.passes) completed.push(r)
    else failed.push({ id: r.item.id + '-fix' + iter, task: `Fix defects in "${r.item.task}": ${r.verdict.defects.join('; ')}` })
  }

  // REVIEW: completeness critic — barrier justified (needs full state to judge done-condition).
  phase('Review')
  const review = await agent(
    `${TIER_PREAMBLE}\n\n` +
    `Completeness critic. Goal: "${goal}". Done-condition: "${plan.doneCondition}". ` +
    `Completed: ${JSON.stringify(completed.map((c) => c.item.task))}. ` +
    `Pending fixes: ${JSON.stringify(failed.map((f) => f.task))}. Blocked: ${blocked.length}. ` +
    `Return ONLY genuinely-missing work items (empty array if the done-condition is met once fixes land). ` +
    `Do NOT accept a completed item as closing the done-condition unless it was verified fresh this ` +
    `iteration — carried-evidence is a premature-done and must be returned as a missing work item ` +
    `(re-verify: <item id>) instead.`,
    { label: `review:${iter}`, phase: 'Review', schema: REVIEW_SCHEMA }
  )

  queue = [...failed, ...review.newWorkItems]
  dryRounds = queue.length === 0 ? dryRounds + 1 : 0

  // Budget guard: hard-stop before overrunning a user token target.
  if (budget.total && budget.remaining() < 50000) {
    log(`Token budget nearly exhausted (${Math.round(budget.remaining() / 1000)}k left) — stopping.`)
    break
  }
}

return {
  doneCondition: plan.doneCondition,
  done: queue.length === 0 && blocked.length === 0,
  iterations: iter,
  completed: completed.map((c) => ({ id: c.item.id, task: c.item.task })),
  blocked: blocked.map((b) => ({ id: b.item.id, reason: b.built.blockedReason })),
  remaining: queue,
}
