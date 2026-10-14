# theme-0013. Semantic Versioning with mandatory git tag traceability

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-09-23
- [amended](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-10-14 — current prerelease format is `-rc-N`, the switch to `-rc.N` is now explicit; version branches acknowledged

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

- The theme has published dozens of versions (`3.0.0-rc-1` …
  `4.0.0-rc-16`, per `package.json` history), but `git tag` is empty.
- A release is only traceable through commit messages such as
  `"version 4.0.0-rc-15"`, or through one-off remote branches named after
  some versions (`4.0.0-rc-15`, `3.2.0`, …).
- Neither pins the exact commit actually published: "what commit was
  published as v3.2.0?" needs commit archaeology.
- Any future tooling that relies on tags (release notes, `git describe`,
  GitHub Releases) is blocked.

## Proposed Design

- Semantic Versioning is the explicit, documented versioning scheme.
- Every version published to npm, release candidates included, has a
  matching annotated git tag.
- The tag is `v` followed by the exact npm version (e.g. `v5.0.0-rc.0`,
  `v4.0.0-rc-17`), created on the exact commit that was published.

- Prereleases so far are named `-rc-N` (e.g. `4.0.0-rc-16`). Semver
  compares `rc-16` and `rc-9` as text, so `rc-16` ranks lower than `rc-9`.
- The `-rc.N` format, which semver compares as a number, applies from
  `5.0.0` onward. The `slides/`/`labs/` layout change is breaking, so it
  ships as the `5.0.0` major; its first prerelease is `5.0.0-rc.0`.
- The two formats never mix within one version: semver ranks `rc` below
  `rc-16`, so a `4.0.0-rc.17` would rank below `4.0.0-rc-16`. `4.0.0`
  keeps `-rc-N`.
- Already-published versions keep their names.
- Existing version branches are left as they are; the tag is the reference.

## Considerations

- **Adopt an automated release tool (semantic-release, changesets).**
  Deferred:
  - release automation is a bigger, separate decision (tool choice, CI
    changes, changelog format) than the traceability gap;
  - tagging is valuable on its own and does not block automation later;
  - automation gets its own ADR if pursued.
- **Tag only "real" releases, not release candidates.** Rejected:
  - release candidates are the versions most likely to need bisecting
    when something goes wrong for an early adopter;
  - the traceability gap matters just as much for them.

## Decision

- Every npm-published version, prerelease or not, must have a
  corresponding annotated git tag `v<exact npm version>` on the commit
  that was published, created as part of the release commit/PR.
- No release automation tool is adopted by this ADR; the version bump and
  tag remain manual, PR-reviewed steps for now.
- Prereleases use `-rc.N` from `5.0.0` onward, starting with
  `5.0.0-rc.0`. A `4.0.0` prerelease keeps `-rc-N`.
- The formats never mix within one version, and published `-rc-N`
  versions are not renamed.
- Backfilling tags for already-published historical versions is optional
  follow-up, not required by this ADR.

## Other Related ADRs

- [[theme-0014-commit-and-branch-convention]] - the commit convention release commits follow

## References

- [`package.json`](../../package.json)
