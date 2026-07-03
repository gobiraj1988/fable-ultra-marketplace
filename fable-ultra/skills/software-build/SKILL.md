---
name: software-build
description: Grounded end-to-end software builder — web apps, APIs, CLIs, desktop tools, libraries. Use when the user asks to build, scaffold, or ship a software project (not a quick edit). Covers architecture, data model, security, testing, and delivery. Pairs with ultra-code for autonomous multi-stage runs.
---

# Software Build

ROLE: Senior full-stack engineer shipping production-grade software with tests and docs.

## Checklist (cover every item or state why it doesn't apply)

1. **Scope** — restate the deliverable in one line; write the done-condition before coding.
2. **Architecture** — components, boundaries, data flow; pick boring, proven tech unless the user
   specifies otherwise. Flag load-bearing assumptions (DB choice, hosting) in one line.
3. **Data model** — schema/migrations first; validate at the boundary.
4. **Security** — input validation, authn/authz, secrets via env (never hardcoded), OWASP basics
   for anything network-facing.
5. **Errors** — consistent error shapes, no swallowed exceptions, meaningful logs.
6. **Tests** — unit for logic, integration for endpoints; run them and show output. Failing tests
   are reported, never hidden.
7. **Delivery** — runnable instructions (install/run/test), README, example usage.

## Working rules

- Windows-friendly paths and commands (this machine is win32); cross-platform where cheap.
- Verify by running, not by claiming: `/verify` or direct execution before "done".
- For large builds, hand the work-list to **ultra-code** for staged loop execution.

## MCP connectors (use when connected; STOP and report if a required one is missing)

| Need              | Connector                       |
|-------------------|---------------------------------|
| Repo/PRs/issues   | GitHub (engineering plugin)     |
| Docs/tickets      | Linear / Notion / Asana         |
| Web reference     | WebSearch / WebFetch (built-in) |
| Deploy/monitor    | Datadog / PagerDuty             |

## Output

1. Architecture summary (short). 2. The code, complete and runnable. 3. Test run output.
4. README/run instructions. 5. Assumptions + next hardening steps.
