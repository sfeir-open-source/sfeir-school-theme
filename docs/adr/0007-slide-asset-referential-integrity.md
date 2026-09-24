# 0007. Referential integrity of slide image assets

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](TBD — PR not yet opened) 2026-09-23

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

`check-docs.ts` (`S_007`, `S_008`) enforces that every relative image
referenced from a slide exists under the assets directory, and that every
image under the assets directory is referenced by at least one slide —
preventing both broken links and dead weight in the repository.

## Proposed Design

Keep this two-way integrity check mandatory: no slide may reference a
missing relative image; no committed image may go unused.

## Considerations

- **Check externally-hosted images (absolute URLs) too, e.g. link-rot
  detection.** Out of scope: the existing rule already limits itself to
  relative images by design (per `cli/README.md`, `S_007`: "relative one's
  only"); checking external URLs needs network calls during `check`, a
  different and heavier kind of check — a future ADR's concern if ever
  needed.

## Decision

- Two-way referential integrity (slide → image exists; image → used by a
  slide) for relative images remains mandatory, unchanged in substance by
  [[0002-rename-docs-to-slides]] beyond the path prefix.

## Other Related ADRs

- [[0002-rename-docs-to-slides]] - path prefix change only
- [[0005-slide-declaration-contract]] - the slide list this check walks

## References

- [`cli/command/check/check-docs.ts`](../../cli/command/check/check-docs.ts)
