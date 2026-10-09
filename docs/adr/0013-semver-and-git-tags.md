# 0013. Semantic Versioning with mandatory git tag traceability

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](TBD — PR not yet opened) 2026-09-23

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

The theme has published dozens of versions
(`3.0.0-rc-1` … `4.0.0-rc-15`, per `package.json` history) but `git tag`
is empty: every release is only traceable through commit messages such as
`"version 4.0.0-rc-15"` or `"passage v4.0.0-rc-14"`, with no annotated tag
pinning the exact commit actually published. This makes it impossible to
reliably answer "what commit was published as v3.2.0?" without commit
archaeology, and blocks any future tooling (release notes, `git describe`,
GitHub Releases) that relies on tags.

## Proposed Design

Adopt Semantic Versioning (already the de facto scheme:
`MAJOR.MINOR.PATCH[-rc.N]`) as the explicit, documented versioning scheme,
and require that every version actually published to npm — including
release-candidate prereleases — has a matching annotated git tag
`vMAJOR.MINOR.PATCH[-rc.N]`, created on the exact commit that was
published.

## Considerations

- **Adopt an automated release tool (semantic-release, changesets).**
  Considered, but deliberately deferred: release automation is a bigger,
  separate decision (tool choice, CI changes, changelog format) than
  fixing the immediate traceability gap; tagging is valuable on its own
  and doesn't block automation later — its own future ADR if pursued.
- **Tag only "real" releases, not release candidates.** Rejected: release
  candidates are exactly the versions most likely to need bisecting when
  something goes wrong for an early adopter; the traceability gap matters
  just as much for them.

## Decision

- Every npm-published version, prerelease or not, must have a
  corresponding annotated git tag `vMAJOR.MINOR.PATCH[-rc.N]` on the
  commit that was published, created as part of the release commit/PR.
- No release automation tool is adopted by this ADR; the version bump and
  tag remain manual, PR-reviewed steps for now.
- Backfilling tags for already-published historical versions is optional
  follow-up, not required by this ADR.

## Other Related ADRs

- [[0014-commit-and-branch-convention]] - the commit convention release commits follow

## References

- [`package.json`](../../package.json)
