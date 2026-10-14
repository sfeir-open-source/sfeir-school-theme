# theme-0014. Commit message and branch naming convention (Conventional Commits)

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-09-23
- [amended](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-10-14 — file renamed with the `theme-` tier prefix ([[theme-0000-adopt-adrs]])

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

- The organization's default is Gitmoji-prefixed commits, overridable per
  team.
- This repo's history never used Gitmoji. Commits already follow a
  Conventional-Commits-like shape (`feat(cli): …`, `fix(cli): …`,
  `core: …`, `build: …`, `doc(cli): …`).
- Branches already follow a `type/slug` shape (`feat/105-select-slides`,
  `fix/…`, `core/…`, `chore/…`).
- Until PR #159, `CONTRIBUTING.md` pointed to a dead Angular
  `CONTRIBUTING.md#commit` link instead of describing the convention.

## Proposed Design

- Ratify Conventional Commits (`type(scope): subject`, scope optional) as
  this repo's commit convention.
- This explicitly overrides the org-wide Gitmoji default for this repo.
- Document the `type`s already in use: `feat`, `fix`, `core`, `build`,
  `chore`, `doc`/`docs`.
- Document the `type/slug` branch naming already practiced.

## Considerations

- **Switch to Gitmoji to align with the org default.** Rejected:
  - it would be cosmetic churn against years of existing history;
  - the current convention needs no tooling and already works;
  - the org rules explicitly allow a per-team override, which this ADR
    exercises.
- **Enforce the convention with a commit-lint hook.** Considered, left as
  optional follow-up: no such tooling exists today, and the convention has
  held by habit so far.

## Decision

- Conventional Commits is this repo's commit message convention,
  explicitly overriding the org-wide Gitmoji default.
- Branches follow `type/slug` (`feat/`, `fix/`, `core/`, `chore/`,
  `docs/`), matching current practice.
- `CONTRIBUTING.md` describes this locally instead of linking to Angular's
  guide (done in PR #159).
- Automated enforcement (commit-lint, PR title checks) is optional future
  work, not adopted by this ADR.

## Other Related ADRs

- [[theme-0013-semver-and-git-tags]] - the release commits this convention covers

## References

- [`CONTRIBUTING.md`](../../CONTRIBUTING.md)
