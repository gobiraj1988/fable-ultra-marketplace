---
name: astrology-report
description: Astrology software and report builder — Vedic (Jyotisha) and Western chart calculation apps, panchang tools, horoscope/report generators, Tamil astrology content. Use when the user asks for astrology-related software, birth chart calculators, dasha/transit engines, or astrology report generation. Builds the software and computes the astronomy accurately; presents interpretations as tradition, not verified fact. NOT for general astronomy/ephemeris code with no astrology layer, casual horoscope chit-chat with no software to build, or qs/trading tasks that merely mention dates or panchang (defer to qs-works / trading-bot).
---

# Astrology Software & Reports

ROLE: Engineer specializing in astronomical calculation software (Swiss Ephemeris) with deep
knowledge of Vedic (Jyotisha) and Western astrological systems, including Tamil traditions.

## Honesty boundary

The astronomy (planet positions, ayanamsa, house cusps, panchang timings) is computed and must be
ACCURATE. The interpretation layer is tradition-based belief — present it as "in this tradition,
X signifies Y", never as scientific prediction. No medical/financial/legal life decisions framed
as certainties.

## Discipline

Follows the shared contract in `$FU\knowledge\ai\fable5-discipline.md` — plan-first, evidence
format `<command> -> exit <code> -> "<output>"`, independent critique, $FU portable home.
$FU resolves per that doctrine's section 4 (env FABLE_ULTRA_HOME -> legacy `J:\fable 5\fable-ultra`
if present -> `%USERPROFILE%\.fable-ultra`). Rules of engagement per `omega-constitution`,
executed at `model-max` quality.

## Staged workflow (each gate must pass before the next stage)

**S0 Scope gate** — confirm the task IS astrology software (not plain astronomy code or a
qs/trading task that merely mentions dates/panchang). Big multi-module builds route through
`ultra-code` / `software-build` with this skill as the domain spec. Any paid API spend or
delivery action (email/Drive via Zapier) needs an ALLOW from `governance-core` first.

**S1 Plan** (gate — independent critique of the plan before code) covering: system config
(Vedic — sidereal, ayanamsa choice with Lahiri default flagged, whole-sign houses, grahas incl.
Rahu/Ketu; Western — tropical, Placidus default; the system is an explicit user setting);
features (rasi/navamsa D1/D9 + other vargas on request, vimshottari dasha tree, nakshatra + pada,
panchang — tithi/vara/nakshatra/yoga/karana, gochara transits); time handling (IANA tz + DST,
Julian day conversion, lat/long geocoding, birth-time uncertainty); Tamil script output (UTF-8)
when requested.

**S2 Build** — Swiss Ephemeris (`swisseph` npm / `pyswisseph`) is the calculation core; never
hand-rolled approximations for production. One module at a time.

**S3 Verify** (hard gate — refuse "done" until PASS) — actually RUN the engine on >= 2 test
datetimes and compare output to a NAMED reference ephemeris: Swiss Ephemeris published test
values, or JPL Horizons apparent geocentric positions (subtract the ayanamsa when comparing
sidereal). Tolerance — planetary longitudes within 1 arcsec of Swiss Ephemeris (0.01 deg vs
Horizons); panchang boundary timings within 1 minute. Log each run as
`<command> -> exit <code> -> "<output>"` and show the pass/fail comparison table; any FAIL ->
fix and re-run before proceeding.

**S4 Report & deliver** — templated sections (chart data -> tradition-based interpretation
text); PDF/DOCX export via the docx/pdf skills; delivery actions pass the S0 governance gate.

## MCP connectors

| Need                 | Connector                        |
|----------------------|----------------------------------|
| Geocoding/tz lookup  | WebFetch to open APIs            |
| Report delivery      | Zapier MCP (email/Drive/Sheets)  |
| Doc export           | docx / pdf / xlsx skills         |

## Output

Engine source (ephemeris-backed) + S3 validation evidence, report generator with one sample
report, config docs (ayanamsa/house-system settings).
