# 0015. Every tier carries an explicit open-source license

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](TBD — PR not yet opened) 2026-09-23

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

`sfeir-school-theme` ships a `LICENSE` file (Apache-2.0, matching
`package.json`'s `license` field) and lives in the `sfeir-open-source`
GitHub organization. Nothing in [[0000-adopt-adrs]] or elsewhere says
whether `sfeir-school-template` and a generated `sfeir-school-xxx`
instance must carry one too, nor which one — an omission flagged during
review of this very ADR series: a chain that calls itself open/inner
source but leaves licensing unstated at two of its three tiers is an
oversight worth closing.

Code and training content are not quite the same kind of thing to license.
The theme's `dist/*` is software — Apache-2.0 (patent grant, NOTICE file)
fits it well. A generated school's `slides/` and `labs/` are primarily
*content* for learners — markdown, images, exercises — where a
Creative-Commons license (e.g. CC-BY-SA 4.0) is the more usual fit in
training/education contexts and says, explicitly, "you may reuse and adapt
this training material."

## Proposed Design

Require a `LICENSE` file at the root of every tier:

- **`sfeir-school-theme`** — keeps Apache-2.0 (status quo, unchanged).
- **`sfeir-school-template`** — Apache-2.0, for the same reason: it is
  software (the scaffold, the generator), not training content.
- **`sfeir-school-xxx`** — split: `LICENSE` (Apache-2.0) for any code
  under `labs/`, `LICENSE-CONTENT` (CC-BY-SA 4.0) for `slides/` and other
  learner-facing material. `sfeir-school-theme-migrate` seeds both into a
  project that has neither, never overwriting an existing choice.

## Considerations

- **One license for everything, to keep it simple (KISS).** Tempting, but
  a single software license applied to training content either grants
  rights content licenses are not designed to express (patent grant on a
  slide deck) or silently fails to grant the reuse/adaptation rights a
  CC license exists for — the split is the simpler choice once content and
  code are recognized as different things, not two steps where one would
  do.
- **Leaving the choice entirely to each school.** Rejected: the same
  rotating-contributor-base argument [[0000-adopt-adrs]] makes for ADRs
  applies here — an unstated default means every school re-decides (or
  never decides) this alone; a seeded default a school can still override
  in its own `LICENSE`/`LICENSE-CONTENT` keeps both consistency and
  freedom.
- **Which exact licenses.** Apache-2.0 for code is already this repo's own
  choice, so keeping it downstream is the path of least surprise. CC-BY-SA
  4.0 for content was this ADR's best-effort default and has since been
  confirmed by the author (PR #159 review).

## Decision

- `sfeir-school-theme` and `sfeir-school-template` each carry a `LICENSE`
  file (Apache-2.0).
- Every `sfeir-school-xxx` instance carries both a `LICENSE` (Apache-2.0,
  for `labs/` code) and a `LICENSE-CONTENT` (CC-BY-SA 4.0, for `slides/`
  and other learner-facing material), seeded by `sfeir-school-theme-migrate`
  when absent, never overwritten once present.
- A school is free to pick different licenses for either file; the seeded
  default exists so an undecided school isn't left with none.

## Other Related ADRs

- [[0000-adopt-adrs]] - same rotating-contributor-base rationale for not
  leaving a convention unstated

## References

- [`LICENSE`](../../LICENSE) - this repo's own Apache-2.0 file
- [`package.json`](../../package.json) - `license` field
