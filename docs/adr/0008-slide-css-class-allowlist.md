# 0008. CSS class allow-list for slides

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](TBD — PR not yet opened) 2026-09-23

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

`check-docs.ts` (`S_009`) enforces that every CSS class used inside a
slide file is defined somewhere known: the theme's compiled CSS, the
project's own `css/slides.css`, or a file declared in `extraCssFiles`
([[0012-project-override-config-file]]). This catches typos and stale
classes left over from a removed stylesheet.

## Proposed Design

Keep this allow-list check mandatory: a class not found in any of the
three known sources is a hard failure.

## Considerations

- **Downgrade to a warning, to tolerate experimentation.** Rejected: a
  silently-ignored typo'd class is exactly the kind of small, hard-to-spot
  bug this check exists to catch; a hard failure matches the project's
  quality-first stance.

## Decision

- The CSS class allow-list check (`S_009`) remains mandatory and
  hard-failing, sourced from the theme's compiled CSS, the project's
  `css/slides.css`, and any `extraCssFiles`.

## Other Related ADRs

- [[0005-slide-declaration-contract]] - the slide list this check walks
- [[0012-project-override-config-file]] - `extraCssFiles` source

## References

- [`cli/command/check/check-docs.ts`](../../cli/command/check/check-docs.ts)
