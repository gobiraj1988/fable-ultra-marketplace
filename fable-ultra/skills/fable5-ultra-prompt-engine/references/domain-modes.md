# Domain lenses

Each lens is a checklist of what a strong prompt in that domain **must** cover. Load the relevant
one, then make sure the assembled prompt addresses the items that apply to the user's specific goal
(not every item every time — relevance first). If a task spans two domains, blend both.

Detection is by intent, not keywords: "an app my warehouse staff scan boxes with" is ANDROID/MOBILE
even though it never says Android.

---

## GAME
- Core gameplay loop (the 30–90s cycle the player repeats)
- Mechanics and the single "hook" that makes it compelling
- Balance and difficulty curve over time
- Economy: currencies, sinks/sources, IAP tiers
- Progression and meta systems (levels, unlocks, streaks, events)
- Multiplayer / social (if any) and its netcode implications
- Monetization justified against retention (never at its expense)
- UI/UX for the target platform and session length
- Performance targets (FPS, device tier, load times)

## SOFTWARE (backend / general)
- Architecture and module boundaries
- Data model / database schema and migrations
- APIs: endpoints, contracts, versioning, error shapes
- Security: authN/authZ, input validation, secrets, OWASP basics
- Scalability and performance (caching, N+1, hot paths)
- Testing strategy (unit / integration / e2e) and coverage of edge cases
- Observability and deployment / CI

## ANDROID / MOBILE
- Kotlin + Jetpack Compose (or stated stack)
- MVVM / unidirectional architecture and state handling
- Offline-first: local store, sync, conflict resolution
- Performance: cold start, jank, battery, memory
- Play Store / App Store compliance (permissions, privacy, billing)
- Navigation, deep links, lifecycle correctness
- Accessibility and multiple screen sizes

## WEB (frontend / full-stack)
- Framework + rendering model (SSR/SSG/CSR) and why
- Component architecture and state management
- Data fetching, caching, and loading/error states
- Accessibility (WCAG), semantic HTML, keyboard nav
- Performance: Core Web Vitals, bundle size, images
- Responsive design and cross-browser support
- SEO and metadata where relevant

## AI / AGENTS
- Agent loop / control flow and stopping conditions
- Tools: definitions, schemas, when each is called
- RAG: retrieval, chunking, grounding, citation
- Memory: short-term context vs persistent store
- Reasoning strategy and self-verification
- Evaluation: how quality is measured, test cases
- Guardrails, failure handling, and cost/latency budget

## DATA / ANALYTICS
- The exact question(s) the analysis must answer
- Data sources, schema, grain, and known quality issues
- Transformations, joins, and assumptions made explicit
- Statistical method fit for the question (and its caveats)
- Output: tables, charts, or a decision — with the format specified
- Reproducibility and validation of results

## UI / UX DESIGN
- User, job-to-be-done, and primary flow
- Information architecture and key screens/states
- Interaction and micro-copy
- Visual system: hierarchy, spacing, type, color, tokens
- Accessibility and edge states (empty, loading, error, long content)
- Platform conventions honored
- Deliverable format (wireframe, spec, tokens, component list)

## TRADING / QUANT
- Strategy hypothesis and market/instrument scope
- Signals, entry/exit rules, position sizing
- Risk management: stops, exposure limits, drawdown
- Backtesting method, data window, and overfitting guards
- Execution assumptions: slippage, fees, latency
- Metrics: Sharpe, max DD, win rate — and their limits
- Explicit note that this is not financial advice, plus paper-trade before live

## BUSINESS / OPS
- The revenue or cost outcome targeted
- Process to automate or workflow to redesign
- Analytics and the metrics that define success
- Scalability and cost structure
- Growth levers and where the leverage is
- Risks and dependencies

## MARKETING
- Audience, positioning, and the single core message
- Channel(s) and format constraints
- Funnel stage and desired action (CTA)
- Brand voice and any compliance limits
- Success metrics (CTR, CAC, conversion)
- Deliverable format and length

## CONTENT / WRITING
- Audience, purpose, and desired reader takeaway
- Voice, tone, and reading level
- Structure and length target
- Constraints: SEO keywords, banned claims, format
- Success criteria (clarity, persuasion, accuracy)

## RESEARCH
- The precise question and its scope boundaries
- Sources to prioritize and credibility bar
- Depth and required citations
- Synthesis format (report, brief, comparison table)
- Explicit handling of uncertainty and conflicting evidence

## EDUCATION
- Learner level and prior knowledge assumed
- Learning objective (what they can do afterward)
- Modality: explanation, worked examples, exercises, assessment
- Scaffolding and misconception-prevention
- Format and length, and how mastery is checked
