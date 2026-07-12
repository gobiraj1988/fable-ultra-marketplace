---
name: mcp-connector
description: MCP connector/server builder and integrator — build custom MCP servers (tools, resources, prompts), wire existing connectors into Claude Code, and design connector-connecting bridge systems. Use when the user asks to create an MCP server, connect a service/API to Claude, integrate connectors, or build "connector connecting systems".
---

# MCP Connector Build & Integration

ROLE: MCP protocol engineer building spec-compliant servers and clean connector integrations.

## Two modes — pick by request

**A. Build a new MCP server** (expose an API/service/local system to Claude):
1. SDK: TypeScript (`@modelcontextprotocol/sdk`) or Python (`mcp`) — default TypeScript.
2. Transport: stdio for local, streamable HTTP for remote.
3. Define tools with tight JSON schemas + one-line descriptions that say WHEN to use them.
4. Resources for read-only data; prompts for reusable templates.
5. Auth: env vars / OAuth — never hardcode secrets; document every required variable.
6. Error handling: structured errors, timeouts, rate-limit backoff.
7. Test with MCP Inspector before shipping; include the inspect command in the README.

**B. Integrate existing connectors** (wire services together):
1. Discover with the harness tools: `ListConnectors` (what is already wired), `SuggestConnectors`
   (recommendations for the task), `SearchMcpRegistry` (search the public MCP registry) — or
   Zapier MCP for 9000+ apps without writing a server. Zapier is **skills-first**:
   `list_zapier_skills`/`get_zapier_skill` for saved workflows, then `discover_zapier_actions`
   -> `enable_zapier_action` -> `execute_zapier_read_action`/`execute_zapier_write_action`
   (call `list_enabled_zapier_actions` before executing; `write_code_action` for custom logic).
2. Register: `claude mcp add <name> ...` or `.mcp.json` in the project; claude.ai connectors via
   connector settings. Deferred MCP tool schemas load on demand via `ToolSearch` — a tool listed
   by name only must be loaded with ToolSearch before it can be called.
3. Auth check FIRST: unauthorized connector -> STOP and give the user the exact auth steps
   (claude.ai connector settings, or `/mcp` in an interactive session). Never fake connector
   output.
4. Bridge patterns: connector A (source) -> transform -> connector B (sink); schedule with cron
   agents for recurring syncs; audit log every write.
5. Remote/web sessions run in ephemeral Linux containers with no `gh` CLI — GitHub goes through
   the GitHub MCP server tools (`mcp__github__*`).

## Checklist for any connector work

- Least privilege: request only needed scopes.
- Outward writes (posting, sending, publishing) get human confirmation unless durably authorized.
- Cross-platform: stdio server commands must work in PowerShell AND a POSIX shell (`node`,
  `npx`, `python`); no hardcoded drive letters or absolute machine paths in shipped configs.

## Output

Mode A: server source + manifest, env-var table, MCP Inspector test transcript, `.mcp.json`
snippet, README. Mode B: connector map (source->sink table), registration commands, auth
checklist, bridge code/config.
