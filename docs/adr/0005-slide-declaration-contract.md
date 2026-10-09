# 0005. Slide declaration contract (`formation()` / `slides.js` / 1:1 markdown mapping)

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](TBD — PR not yet opened) 2026-09-23

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

`check-docs.ts` already enforces (`S_001`, `S_002`, `S_003`, `S_010`) that
a school declares its slide deck through one script exporting a
`formation()` function, and that every entry in that function corresponds
to exactly one markdown file on disk, with no orphan on either side. This
is a real, load-bearing contract today, encoded only in CLI code and
`cli/README.md` prose — never written down as a decision with its
rationale.

## Proposed Design

Formalize: a school's slide deck is fully described by one script
(`slides/scripts/slides.js` after [[0002-rename-docs-to-slides]]) exporting
a `formation()` function returning an ordered, flat list of `{ path }`
entries. Each `path` must resolve to an existing markdown file under
`slides/markdown/`; conversely, every markdown file there must appear in
that list. `formation()` is the single source of truth for slide order and
inclusion — no slide is picked up by directory scanning alone.

## Considerations

- **Infer order from file naming (numeric prefixes) instead of an explicit
  script.** Rejected: an explicit `formation()` keeps ordering, grouping
  (e.g. a `schoolSlides()` helper), and conditional composition (e.g.
  per-language variants) expressible in plain JS, instead of encoding all
  of it into filenames.

## Decision

- The `formation()`-exporting script remains the single source of truth
  for a school's slide list; the two-way (declared ⇔ on-disk) integrity
  check remains mandatory (current `S_001`–`S_003`, `S_010`).
- The path move from `docs/scripts/slides.js` to `slides/scripts/slides.js`
  per [[0002-rename-docs-to-slides]] is implementation follow-up.

## Other Related ADRs

- [[0002-rename-docs-to-slides]] - defines the new path for `slides.js`
- [[0004-self-contained-slides]] - constrains what `slides.js` may import
- [[0006-lab-slide-format]] - format contract for a subset of the entries this declares

## References

- [`cli/command/check/check-docs.ts`](../../cli/command/check/check-docs.ts)
- [`cli/README.md`](../../cli/README.md)
