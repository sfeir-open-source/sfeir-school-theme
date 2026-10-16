# theme-0010. Lab instructions contract (`README.md` convention)

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-09-23
- [deprecated](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-10-14 — merged into [[theme-0006-lab-contract]]

> **Deprecated:** the lab README rules now live in [[theme-0006-lab-contract]]. This file is kept for history.

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

`check-labs.ts` (`L_005`, `L_006`, `L_007`) requires every lab directory to
have a `README.md` whose content includes a title of the exact form
`# <lab> instructions` and, when `labCommandPrefix` is set, the exact
command to run that lab, using that prefix ([[theme-0003-labs-directory]]).

At the time, [[theme-0006-lab-contract]] governed only the short
announcement on the slide deck, and this ADR governed the lab's own,
self-contained instructions. theme-0006 now owns both.

## Proposed Design

Keep this contract mandatory: every lab is self-documenting, with a
predictable, checkable title and command, so a learner (or a generator
script) never has to guess how to start a given lab.

## Considerations

- **Allow a looser title format, only requiring the command.** Rejected:
  the exact-title check costs nothing to satisfy and keeps every lab's
  README visually and structurally consistent across every school.

## Decision

- The `# <lab> instructions` title and exact run-command requirement
  remain mandatory (`L_005`–`L_007`), unchanged in substance. The
  run-command part (`L_007`) applies only when `labCommandPrefix` is set.

## Other Related ADRs

- [[theme-0003-labs-directory]] - `labCommandPrefix` naming
- [[theme-0006-lab-contract]] - the lab contract that replaces this ADR
- [[theme-0009-labs-as-npm-workspaces]] - the lab declaration this documents
- [[theme-0011-lab-solution-pairing]] - README must match between lab and solution

## References

- [`cli/command/check/check-labs.ts`](../../cli/command/check/check-labs.ts)
