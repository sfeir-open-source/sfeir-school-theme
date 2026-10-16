# theme-0015. Every tier carries an explicit open-source license

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-09-23
- [amended](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-10-14 — the theme's `LICENSE` was MIT, not Apache-2.0: this ADR relicenses the theme code to Apache-2.0; content default set to CC BY-ND 4.0, keeping the no-derivatives policy of existing schools

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

- `sfeir-school-theme` lives in the `sfeir-open-source` GitHub
  organization.
- Its licensing was inconsistent: until PR #159, `LICENSE` was the MIT
  License (since the initial commit), while `package.json` declared
  `Apache-2.0`.
- Nothing in [[theme-0000-adopt-adrs]] or elsewhere says whether
  `sfeir-school-template` and a `sfeir-school-xxx` instance must carry a
  license, nor which one.
- This gap was flagged during review of this ADR series: an open-source
  chain should not leave licensing unstated at two of its three tiers.
- Code and training content are not the same kind of thing to license:
  - the theme's `dist/*` is software, which Apache-2.0 (patent grant,
    NOTICE file) fits well;
  - a school's `slides/` and `labs/` are mostly content for learners
    (markdown, images, exercises);
  - for training content, a Creative Commons license is the usual fit;
  - existing schools already use CC BY-ND 3.0 in `docs/LICENSE`: content
    may be shared with attribution, but not modified or adapted.

## Proposed Design

Require a `LICENSE` file at the root of every tier:

- **`sfeir-school-theme`** — Apache-2.0. Its `LICENSE` is replaced by the
  verbatim Apache-2.0 text, which relicenses the theme code from MIT and
  matches `package.json`.
- **`sfeir-school-template`** — Apache-2.0, for the same reason: it is
  software (the scaffold, the generator), not training content.
- **`sfeir-school-xxx`** — split: `LICENSE` (Apache-2.0) for any code
  under `labs/`, `LICENSE-CONTENT` (CC BY-ND 4.0) for `slides/` and other
  learner-facing material. `sfeir-school-theme-migrate` seeds each file when
  it is absent, never overwriting an existing one.
- **An existing content license is kept, not replaced.** A v4 school's
  `docs/LICENSE` (often CC BY-ND 3.0) moves to `LICENSE-CONTENT` unchanged;
  upgrading it to CC BY-ND 4.0 stays the school owner's call.

## Considerations

- **One license for everything, to keep it simple (KISS).** Rejected:
  - a software license on training content grants rights a content license
    is not designed to express (a patent grant on a slide deck);
  - or it fails to express the content terms a CC license exists for
    (attribution, no derivatives);
  - once content and code are seen as different things, the split is the
    simpler choice.
- **Leaving the choice entirely to each school.** Rejected:
  - the rotating-contributor-base argument of [[theme-0000-adopt-adrs]]
    applies here too;
  - with no stated default, every school re-decides this alone, or never
    decides;
  - a seeded default, which a school may replace in its own `LICENSE` /
    `LICENSE-CONTENT`, keeps both consistency and freedom.
- **Keep MIT for the theme, and fix `package.json` instead.** Rejected:
  Apache-2.0 adds an explicit patent grant, and using one code license
  across the three tiers is the path of least surprise. The relicensing is
  the author's call as the original MIT copyright holder.
- **Which content license.** Chosen by the author in the PR #159 review:
  - CC BY-ND 4.0: keeps the policy existing schools already apply (share
    with attribution, no modified versions), in the current CC version;
  - CC BY-SA 4.0 (adaptations allowed if shared alike): rejected, it would
    silently change that policy for new schools;
  - CC BY-ND 3.0: rejected, 4.0 is the current, international version.

## Decision

- `sfeir-school-theme` and `sfeir-school-template` each carry a `LICENSE`
  file (Apache-2.0). For the theme, this is a relicensing from MIT.
- Every `sfeir-school-xxx` instance carries both a `LICENSE` (Apache-2.0,
  for `labs/` code) and a `LICENSE-CONTENT` (CC BY-ND 4.0, for `slides/`
  and other learner-facing material), seeded by `sfeir-school-theme-migrate`
  when absent, never overwritten once present.
- The presence of both files is mandatory. This ADR itself leaves the
  license in each file open to the school: picking another license applies
  this ADR, it does not override it, so the precedence rule of
  [[theme-0000-adopt-adrs]] holds.
- The seeded default exists so an undecided school isn't left with none.

## Other Related ADRs

- [[theme-0000-adopt-adrs]] - same rotating-contributor-base rationale for not
  leaving a convention unstated

## References

- [`LICENSE`](../../LICENSE) - this repo's own license file, Apache-2.0 per this ADR
- [`package.json`](../../package.json) - `license` field
- [`scripts/sfeir-school-theme-migration.ts`](../../scripts/sfeir-school-theme-migration.ts) - seeds a school's `LICENSE` and `LICENSE-CONTENT`
