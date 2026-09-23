# 0014. Commit message and branch naming convention (Conventional Commits)

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](TBD — PR not yet opened) 2026-09-23

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

The organization's default is Gitmoji-prefixed commits, overridable per
team. This repo's actual history never used Gitmoji: commits already
consistently follow a Conventional-Commits-like shape (`feat(cli): …`,
`fix(cli): …`, `core: …`, `build: …`, `doc(cli): …`), and branches already
follow a `type/slug` shape (`feat/105-select-slides`, `fix/…`, `core/…`,
`chore/…`). `CONTRIBUTING.md` currently points contributors to a dead
Angular `CONTRIBUTING.md#commit` link instead of describing the convention
locally.

## Proposed Design

Ratify Conventional Commits (`type(scope): subject`, scope optional) as
this repo's commit convention, explicitly overriding the org-wide Gitmoji
default for this team/repo, and document the `type`s already in use
(`feat`, `fix`, `core`, `build`, `chore`, `doc`/`docs`) plus the parallel
`type/slug` branch naming already practiced.

## Considerations

- **Switch to Gitmoji to align with the org default.** Rejected: it would
  be purely cosmetic churn against years of existing history and a
  tooling-free convention that already works; the org rules explicitly
  allow a per-team override, which this ADR exercises.
- **Enforce the convention with a commit-lint hook.** Considered, left as
  optional follow-up: no such tooling exists today, and the convention has
  held by habit so far.

## Decision

- Conventional Commits is this repo's commit message convention,
  explicitly overriding the org-wide Gitmoji default.
- Branches follow `type/slug` (`feat/`, `fix/`, `core/`, `chore/`,
  `docs/`), matching current practice.
- `CONTRIBUTING.md` is updated to describe this locally instead of linking
  to Angular's guide — implementation follow-up, not detailed here.
- Automated enforcement (commit-lint, PR title checks) is optional future
  work, not adopted by this ADR.

## Other Related ADRs

- [[0013-semver-and-git-tags]] - the release commits this convention covers

## References

- [`CONTRIBUTING.md`](../../CONTRIBUTING.md)
