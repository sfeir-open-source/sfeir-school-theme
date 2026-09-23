# 0010. Lab instructions contract (`README.md` convention)

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](TBD — PR not yet opened) 2026-09-23

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

`check-labs.ts` (`L_005`, `L_006`, `L_007`) requires every lab directory to
have a `README.md` whose content includes a title of the exact form
`# <lab> instructions` and the exact command to run that lab, using the
configured `labCommandPrefix` ([[0003-rename-steps-to-labs]]).

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
  remain mandatory (`L_005`–`L_007`), unchanged in substance.

## Other Related ADRs

- [[0003-rename-steps-to-labs]] - `labCommandPrefix` naming
- [[0009-labs-as-npm-workspaces]] - the lab declaration this documents
- [[0011-lab-solution-pairing]] - README must match between lab and solution

## References

- [`cli/command/check/check-labs.ts`](../../cli/command/check/check-labs.ts)
