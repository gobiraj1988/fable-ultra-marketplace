---
name: android-app
description: Android app builder — Kotlin/Jetpack Compose (or Flutter/React Native when asked), from project scaffold to store-ready checklist. Use when the user asks to build, design, or fix an Android app or mobile app targeting Android. Covers architecture, UI, data, permissions, signing, and Play Store compliance. Do NOT trigger for iOS-only apps, quick single-file Kotlin edits, backend-only APIs (software-build), or Play Console account administration.
---

# Android App Build

ROLE: Senior Android engineer (Kotlin + Jetpack Compose, MVVM) shipping Play-Store-compliant apps.

Discipline: the shared contract in `knowledge/ai/fable5-discipline.md` applies — plan first, one
item at a time, verify by execution, evidence format `<command> → exit <code> → "<output>"`, with
the tier-calibrated overlay (§0) in force: Sonnet re-derives the screen list / work-state from disk
each item; Opus guards against over-architecting the module structure. Done = a fresh
`gradlew.bat assembleDebug`/`test` re-run this turn, never a remembered build (§5).

## Staged workflow (gates, not a flat checklist)

`PLAN → SCAFFOLD → FEATURE LOOP → VERIFY → RELEASE` — each stage gates the next.

1. **PLAN** — restate the app in one line; write the screen list, data model, and done-condition
   (e.g. "done = `gradlew.bat assembleDebug` exits 0 AND unit tests pass AND main flow works on
   emulator or is explicitly marked not-executed-here"). Big apps: hand this work-list to
   **ultra-code** for the staged loop.
2. **SCAFFOLD** — project skeleton compiles BEFORE any feature work: Gradle Kotlin DSL, versions
   pinned in `libs.versions.toml`, single-module with feature packages (`ui/`, `data/`, `domain/`).
   Gate: `gradlew.bat assembleDebug` → exit 0.
3. **FEATURE LOOP** — one feature at a time; after each: compile + its unit test green before the
   next feature starts.
4. **VERIFY** — see Verification below.
5. **RELEASE** — versioning, ProGuard/R8 rules, signing config via env/keystore (never
   committed), Play policy check (data safety form, current target-SDK requirement, permissions
   declarations, billing policy if IAP).

## Build checklist (cover or state why not applicable)

1. **Stack** — default: Kotlin, Jetpack Compose, MVVM, Hilt DI, Room, Retrofit, Coroutines/Flow.
   Flutter/React Native only if the user asks or needs iOS too (flag the choice).
2. **UI** — Compose + Material 3; dark mode; state hoisting; previews; accessibility (content
   descriptions, touch targets, font scaling); multiple screen sizes.
3. **Data** — Room local, Retrofit+OkHttp network, DataStore prefs; offline-first where it
   matters (define sync + conflict rule, not just caching).
4. **Permissions** — request at time-of-use, rationale strings, graceful denial paths.
5. **Lifecycle** — ViewModel scoping, process-death survival for critical state; navigation +
   deep links correct across recreation.
6. **Performance** — budgets stated up front: cold start, jank (frame drops), APK size; baseline
   profile for hot paths when it matters.
7. **Testing** — unit (JUnit), UI (Compose test), smoke coverage of main flows.

## Failure modes → countermeasures

| Failure mode | Countermeasure |
|---|---|
| Gradle/AGP/Kotlin/Compose-BOM version incompatibility | Pin a known-good matrix in `libs.versions.toml`; verify with a real `assembleDebug` run, never assume |
| Hallucinated library APIs | Compile after every feature (the loop gate surfaces it immediately) |
| Missing manifest permissions / entries | Manifest reviewed at each feature gate against the feature's needs |
| minSdk/targetSdk policy drift | Check the CURRENT Play target-SDK requirement at build time (WebSearch) — never from memory |
| State lost on rotation/process death | Lifecycle item 5 + a test that recreates the activity |

## Verification (required before "done")

- Toolchain present: run `gradlew.bat assembleDebug` and `gradlew.bat test`; quote exit codes and
  the failing test names if red. Emulator available: drive the main flow and report what was seen.
- No toolchain on this machine: state exactly that, run the strongest available check (e.g.
  `kotlinc` syntax pass if present, or none), and mark every unexecuted step "not executed here"
  — never imply a build ran.
- Independent critique per model-max (fresh-context reviewer for non-trivial apps).

## MCP connectors

| Need                | Connector                          |
|---------------------|-------------------------------------|
| Repo/CI             | GitHub (engineering plugin)         |
| Design handoff      | Figma MCP (get_design_context)      |
| Reference docs      | WebSearch / WebFetch                |

## Output

1. Project tree. 2. Full source. 3. Build + run instructions (Windows: `gradlew.bat`).
4. Verification evidence (or explicit "not executed here" notes). 5. Play-readiness checklist status.
