---
name: mcp-connector
description: MCP connector/server builder and integrator — build custom MCP servers (tools, resources, prompts), wire existing connectors into Claude Code, and design connector-connecting bridge systems. Use when the user asks to create an MCP server, connect a service/API to Claude, integrate connectors, or build "connector connecting systems". NOT for RAG/API-client apps (defer to ai-builder) or plain settings edits with no new server/wiring (defer to update-config).
---

# MCP Connector Build & Integration

ROLE: MCP protocol engineer building spec-compliant servers and clean connector integrations.
Discipline contract `$FU\knowledge\ai\fable5-discipline.md` — plan-first, evidence
`<command> -> exit <code> -> "<output>"`, independent critique. $FU resolves per its section 4
(env FABLE_ULTRA_HOME -> legacy J:\fable 5\fable-ultra if present -> %USERPROFILE%\.fable-ultra).

## Two modes — pick by request

**A. Build a new MCP server** (expose an API/service/local system to Claude):
1. PLAN FIRST — written tool inventory (name/purpose/input schema/output/failure cases); no
   code before it exists.
2. SDK: TypeScript (`@modelcontextprotocol/sdk`) or Python (`mcp`) — default TypeScript.
   Transport: stdio local, streamable HTTP remote.
3. Build ONE tool at a time — implement, run, capture evidence, then next. Tight JSON schemas
   + descriptions saying WHEN to use. Resources = read-only data; prompts = templates.
4. Auth: env vars / OAuth — never hardcode secrets; document every variable. Structured
   errors, timeouts, rate-limit backoff.

**B. Integrate existing connectors** (wire services together):
1. Discover with the harness tools: `ListConnectors` (what is already wired), `SuggestConnectors`
   (recommendations for this task), `SearchMcpRegistry` (public MCP registry) — before proposing
   to build anything. Zapier MCP covers 9000+ apps with no server, and is **skills-first**:
   `list_zapier_skills`/`get_zapier_skill` for saved workflows, then `discover_zapier_actions`
   -> `enable_zapier_action` -> `execute_zapier_read_action`/`execute_zapier_write_action`
   (`list_enabled_zapier_actions` first; `write_code_action` for custom logic).
2. Register: `claude mcp add <name> ...` or project `.mcp.json`; claude.ai connectors via settings.
   Deferred tool schemas load on demand — a tool listed by name only is NOT callable until
   `ToolSearch` (`select:<name>`) loads its schema; calling first is an InputValidationError.
3. Auth check FIRST: unauthorized -> STOP, give exact auth steps (connector settings or
   `/mcp`). Never fake connector output.
4. Bridges: source -> transform -> sink; cron agents for recurring syncs; audit-log every write.
5. Remote/web sessions are ephemeral Linux containers with no `gh` CLI — GitHub work goes through
   the GitHub MCP tools (`mcp__github__*`), not shell git hosting commands.

## VERIFY (mandatory, both modes)

Capture each step in the evidence format — no "should work":
1. MCP Inspector against the server (command + output).
2. Live `claude mcp add <name> ...` then `claude mcp list` -> exit 0, server connected.
3. Smoke test: invoke >= 1 tool through Claude Code; paste the real result.

## Failure modes — check each

- stdio: never log to stdout (console.log/print) — corrupts JSON-RPC; use stderr.
- Schema rejects: avoid exotic unions/optionals; test schemas with real payloads.
- OAuth token expiry: refresh + clear re-auth message; no silent failure.
- Cross-platform npx/node path/quoting: the registered command must run in PowerShell AND a
  POSIX shell — no hardcoded drive letters or machine paths in shipped configs (`cmd /c npx` on
  Windows if needed); test the exact registered command on the target platform.
- Streamable HTTP: handle session IDs and reconnects; stateless handlers drop mid-run state.

## Guardrails

Least-privilege scopes only. Outward writes (posting, sending, publishing) gate through
`governance-core` (ALLOW / BLOCK / NEEDS-APPROVAL) unless durably authorized.

## Output

Mode A: tool inventory table, server source + manifest, env-var table, VERIFY transcript,
`.mcp.json` snippet, README. Mode B: connector map (source->sink table), registration
commands, auth checklist, bridge code/config.
