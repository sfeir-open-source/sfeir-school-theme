# theme-0011. Lab / solution pairing convention

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-09-23
- [deprecated](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-10-14 — merged into [[theme-0006-lab-contract]]

> **Deprecated:** the solution pairing and `.nosolution` rules now live in [[theme-0006-lab-contract]]. This file is kept for history.

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

`check-labs.ts` (`L_008`, `L_009`, `L_010`) requires that every lab `X` has
a matching `X-solution` lab, and that a solution `README.md`, when present,
is identical to the lab's one.
This guarantees learners always have a working reference solution,
discoverable by a fixed naming rule rather than an ad hoc pointer.

## Proposed Design

Keep the `-solution` suffix convention and the identical-`README.md`
requirement mandatory: a lab named `003-arrays-lab`
([[theme-0006-lab-contract]]'s naming convention) pairs with
`003-arrays-lab-solution`.

## Considerations

- **Allow a lab with no solution (e.g. an open-ended lab).** Considered,
  but rejected for now: no such case exists today, and adding an opt-out
  (e.g. a config flag) is speculative complexity for a need that hasn't
  materialized — easy to add later as an amendment to this ADR's Change
  Log if it does.
  Since then: the `.nosolution` opt-out exists in the CLI, and is
  described in [[theme-0006-lab-contract]].

## Decision

- Every lab must have a matching `<lab>-solution` lab with an identical
  `README.md`, unchanged in substance (`L_008`–`L_010`).

## Other Related ADRs

- [[theme-0009-labs-as-npm-workspaces]] - the lab declaration this pairs
- [[theme-0010-lab-instructions-contract]] - the README this requires to match

## References

- [`cli/command/check/check-labs.ts`](../../cli/command/check/check-labs.ts)
