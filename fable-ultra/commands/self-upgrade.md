---
description: Run one eval-gated self-upgrade cycle on the fable-ultra plugin (evidence -> one focused edit -> before/after eval -> keep or revert -> version bump)
argument-hint: [optional: which skill to improve, or a weakness you noticed]
---

Invoke the `self-upgrade` skill from this plugin and run exactly ONE upgrade cycle.

Focus hint from the user (may be empty): $ARGUMENTS

Hard rules:
1. Evidence first: read `memory/lessons.md`, recent `ultra-code-run.md` files, and this
   conversation's feedback before choosing what to improve.
2. One skill, one focused edit per cycle. Backup before editing.
3. Keep the edit ONLY if the before/after eval shows improvement; otherwise restore the backup
   and log why in `memory/lessons.md`.
4. NEVER touch the immutable safety rails (paper-mode default, human confirmation for live or
   destructive actions, no fabricated outputs, loop termination ceilings).
5. Finish with: version bump + CHANGELOG entry + a short diff summary shown to the user +
   remind them to run `claude plugin update fable-ultra`.
