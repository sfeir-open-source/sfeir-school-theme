# theme-0005. Slide declaration contract (`formation()` / `slides.js` / 1:1 markdown mapping)

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-09-23
- [amended](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-10-14 — check file is `check-slides.ts`; the move to `slides/` is done

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

`check-slides.ts` already enforces (`S_001`, `S_002`, `S_003`, `S_010`) that
a school declares its slide deck through one script exporting a
`formation()` function, and that every entry in that function corresponds
to exactly one markdown file on disk, with no orphan on either side. This
is a real, load-bearing contract today, encoded only in CLI code and
`cli/README.md` prose — never written down as a decision with its
rationale.

## Proposed Design

- A school's slide deck is fully described by one script,
  `slides/scripts/slides.js` ([[theme-0002-slides-and-docs-directories]]).
- That script exports a `formation()` function returning an ordered, flat
  list of `{ path }` entries.
- Each `path` resolves to an existing markdown file under
  `slides/markdown/`.
- Every markdown file there appears in that list.
- `formation()` is the single source of truth for slide order and
  inclusion. No slide is picked up by directory scanning alone.

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
- The script lives at `slides/scripts/slides.js`, per
  [[theme-0002-slides-and-docs-directories]].

## Other Related ADRs

- [[theme-0002-slides-and-docs-directories]] - defines where `slides.js` lives
- [[theme-0004-self-contained-slides]] - constrains what `slides.js` may import
- [[theme-0006-lab-contract]] - lab slides are a subset of the entries this declares

## References

- [`cli/command/check/check-slides.ts`](../../cli/command/check/check-slides.ts)
- [`cli/README.md`](../../cli/README.md)
