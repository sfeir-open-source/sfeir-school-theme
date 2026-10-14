# theme-0007. Referential integrity of slide image assets

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-09-23
- [amended](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-10-14 — check file is `check-slides.ts`; scope stated (`assets/` paths, logo, `ignoreAssets`)

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

`check-slides.ts` (`S_007`, `S_008`) enforces two things:

- every relative image referenced from a slide exists on disk (no broken
  link);
- every image under `slides/assets/images/` is referenced by at least one
  slide (no dead weight in the repository).

## Proposed Design

Keep this two-way integrity check mandatory: no slide may reference a
missing relative image; no committed image may go unused.

Scope of the check:

- Only references starting with `assets/` or `./assets/` (relative to
  `slides/`) are checked.
- The "unused" walk covers `slides/assets/images/` only.
- An image named `sfeir-school-logo.png` is never reported as unused.
- A project can exempt a given image from the "unused" rule through
  `ignoreAssets` ([[theme-0012-bounded-config-overrides]]). Entries are
  relative to `slides/assets/`, e.g. `images/foo.png`.

## Considerations

- **Check externally-hosted images (absolute URLs) too, e.g. link-rot
  detection.** Out of scope:
  - `S_007` checks relative images only, by design.
  - Checking external URLs needs network calls during `check`, a heavier
    kind of check.
  - A future ADR can take it on if ever needed.

## Decision

- Two-way referential integrity (slide → image exists; image → used by a
  slide) for images under `slides/assets/images/` remains mandatory.
- Per-image exemptions go through `ignoreAssets`, never by turning the
  rule off.

## Other Related ADRs

- [[theme-0002-slides-and-docs-directories]] - the `slides/` root these paths live under
- [[theme-0005-slide-declaration-contract]] - the slide list this check walks
- [[theme-0012-bounded-config-overrides]] - `ignoreAssets`

## References

- [`cli/command/check/check-slides.ts`](../../cli/command/check/check-slides.ts)
- [`cli/utils/slide.utils.ts`](../../cli/utils/slide.utils.ts) - image extraction, `assets` scope, logo exclusion
