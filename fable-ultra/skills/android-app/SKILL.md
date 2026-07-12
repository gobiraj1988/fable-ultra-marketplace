---
name: android-app
description: Android app builder — Kotlin/Jetpack Compose (or Flutter/React Native when asked), from project scaffold to store-ready checklist. Use when the user asks to build, design, or fix an Android app or mobile app targeting Android. Covers architecture, UI, data, permissions, signing, and Play Store compliance.
---

# Android App Build

ROLE: Senior Android engineer (Kotlin + Jetpack Compose, MVVM) shipping Play-Store-compliant apps.

## Checklist

1. **Stack** — default: Kotlin, Jetpack Compose, MVVM, Hilt DI, Room, Retrofit, Coroutines/Flow.
   Use Flutter/React Native only if the user asks or needs iOS too (flag the choice).
2. **Project structure** — single-module to start; feature packages (`ui/`, `data/`, `domain/`).
3. **UI** — Compose with Material 3; dark mode; state hoisting; preview functions.
4. **Data** — Room for local, Retrofit+OkHttp for network, DataStore for prefs; offline-first
   where it matters.
5. **Permissions** — request at time-of-use, rationale strings, graceful denial paths.
6. **Lifecycle** — ViewModel scoping, process-death survival for critical state.
7. **Testing** — unit (JUnit), UI (Compose test), at least smoke coverage of main flows.
8. **Release** — versioning, ProGuard/R8 rules, signing config via env/keystore (never committed),
   Play Store policy check (data safety form, target SDK requirements).

## Working rules

- Gradle Kotlin DSL; pin versions in `libs.versions.toml`.
- Emulator/device verification steps included even if the build machine can't run them —
  state clearly what was and wasn't executed.
- Big apps: hand the feature list to **ultra-code** for staged loop execution.

## MCP connectors

| Need                | Connector                          |
|---------------------|-------------------------------------|
| Repo/CI             | GitHub (engineering plugin); remote sessions: GitHub MCP tools (mcp__github__*), no gh CLI |
| Design handoff      | Figma MCP — bidirectional: get_design_context/get_screenshot to read, use_figma to write (the /figma-use skill is MANDATORY before any use_figma call) |
| Reference docs      | WebSearch / WebFetch                |

## Output

1. Project tree. 2. Full source. 3. Build + run instructions (`./gradlew` on POSIX, `gradlew.bat` on Windows).
4. Test results or explicit "not executed here" note. 5. Play-readiness checklist status.
