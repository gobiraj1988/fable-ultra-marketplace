// Reference ultra-code Workflow script — PLAN -> BUILD -> VERIFY -> REVIEW -> LOOP.
// Adapt stage prompts/schemas to the actual task before running. Plain JS (no TS).
// Pass the goal via args: Workflow({script, args: {goal: "...", maxIterations: 10}}).
// Quality dials: verify/review agents run at high effort; build agents inherit the session
// model at default effort. Add isolation:'worktree' to BUILD agents ONLY when parallel items
// mutate the same files. Never call Date.now()/Math.random() in here — they throw on resume.

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
  { label: 'plan', schema: PLAN_SCHEMA, effort: 'high' }
)
log(`Plan: ${plan.workItems.length} items. Done when: ${plan.doneCondition}`)

// ---- BUILD/VERIFY pipeline + REVIEW loop-until-done ----
let queue = plan.workItems
const completed = []
const blocked = []
let dryRounds = 0
let iter = 0

while (queue.length > 0 && iter < MAX_ITER && dryRounds < 2) {
  iter++
  log(`Iteration ${iter}: ${queue.length} work items`)

  // BUILD -> VERIFY per item, no barrier: item A verifies while item B builds.
  const results = await pipeline(
    queue,
    (item) =>
      agent(
        `Execute this work item toward the goal "${goal}". Item: ${JSON.stringify(item)}. ` +
        `Make real changes with tools. If a required MCP connector or credential is missing, ` +
        `return status "blocked" with the exact setup step — never simulate its output.`,
        { label: `build:${item.id}`, phase: 'Build', schema: BUILD_SCHEMA }
      ),
    (built, item) =>
      built.status === 'blocked'
        ? { built, verdict: { passes: false, defects: ['BLOCKED: ' + (built.blockedReason || 'unknown')] }, item }
        : agent(
            `Adversarially verify work item "${item.task}" (files: ${JSON.stringify(built.filesTouched || [])}). ` +
            `Run the code/tests where possible. Try to REFUTE that it works. Default passes=false if uncertain.`,
            { label: `verify:${item.id}`, phase: 'Verify', schema: VERDICT_SCHEMA, effort: 'high' }
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
    `Completeness critic. Goal: "${goal}". Done-condition: "${plan.doneCondition}". ` +
    `Completed: ${JSON.stringify(completed.map((c) => c.item.task))}. ` +
    `Pending fixes: ${JSON.stringify(failed.map((f) => f.task))}. Blocked: ${blocked.length}. ` +
    `Return ONLY genuinely-missing work items (empty array if the done-condition is met once fixes land).`,
    { label: `review:${iter}`, phase: 'Review', schema: REVIEW_SCHEMA, effort: 'high' }
  )

  queue = [...failed, ...review.newWorkItems]
  dryRounds = queue.length === 0 ? dryRounds + 1 : 0
  log(`Iteration ${iter} done: ${completed.length} completed, ${queue.length} queued` +
    (budget.total ? `, ${Math.round(budget.spent() / 1000)}k tokens spent` : ''))

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
