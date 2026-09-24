# 0011. Lab / solution pairing convention

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](TBD — PR not yet opened) 2026-09-23

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

`check-labs.ts` (`L_008`, `L_009`, `L_010`) requires that every lab `X` has
a matching `X-solution` lab, and that both share an identical `README.md`.
This guarantees learners always have a working reference solution,
discoverable by a fixed naming rule rather than an ad hoc pointer.

## Proposed Design

Keep the `-solution` suffix convention and the identical-`README.md`
requirement mandatory.

## Considerations

- **Allow a lab with no solution (e.g. an open-ended lab).** Considered,
  but rejected for now: no such case exists today, and adding an opt-out
  (e.g. a config flag) is speculative complexity for a need that hasn't
  materialized — easy to add later as an amendment to this ADR's Change
  Log if it does.

## Decision

- Every lab must have a matching `<lab>-solution` lab with an identical
  `README.md`, unchanged in substance (`L_008`–`L_010`).

## Other Related ADRs

- [[0009-labs-as-npm-workspaces]] - the lab declaration this pairs
- [[0010-lab-instructions-contract]] - the README this requires to match

## References

- [`cli/command/check/check-labs.ts`](../../cli/command/check/check-labs.ts)
