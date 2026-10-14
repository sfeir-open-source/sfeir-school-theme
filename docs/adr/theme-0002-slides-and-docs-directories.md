# theme-0002. Slides live in `slides/`, project documentation in `docs/`

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-09-23
- [amended](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-10-14 — reframed as "what goes where" instead of a rename; root files stated; legacy `docs/` deck error required

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

A training project used to keep its RevealJS slide deck in `docs/`. Since
[[theme-0000-adopt-adrs]], `docs/` is also where the project's ADRs live
(`docs/adr/`). One directory serving two unrelated audiences, the learner
watching the deck and the contributor maintaining the project, is
confusing.

## Proposed Design

Each top-level directory has one audience:

| Location | Holds | Audience |
|---|---|---|
| `slides/` | the whole slide deck: `index.html`, the deck `package.json` (its `prepare` script refreshes `web_modules/`), `scripts/slides.js`, `markdown/`, `assets/`, `css/`, `web_modules/` | learner, on screen |
| `docs/` | ADRs (`docs/adr/`), training documentation, trainer notes and delivery guides, any other project documentation | trainer, contributor |
| project root | files a forge or the CLI looks for at the root: `README.md`, `CONTRIBUTION_GUIDE.md` or `CONTRIBUTING.md`, `LICENSE` | everyone |

- Rule of thumb: what a learner sees during the training goes in
  `slides/`; what a trainer or contributor reads to deliver or maintain it
  goes in `docs/`.
- RevealJS speaker notes (`Notes:` blocks) are part of a slide: they stay
  in the slide markdown under `slides/`. Trainer notes in `docs/` are
  standalone documents.
- The `check` command looks for the deck under `slides/` only.
- `G_004` accepts either `CONTRIBUTION_GUIDE.md` or `CONTRIBUTING.md` at
  the root.
- Existing projects with a deck in `docs/` are converted by
  `sfeir-school-theme-migrate`: it moves everything in `docs/` to `slides/`
  except `docs/adr/`.

## Considerations

- **Accept both `docs/` and `slides/` for a transition period.** Rejected:
  the number of existing schools is small, and a compatibility mode is
  extra CLI code to remember and remove later. A hard cut plus the migrate
  command is simpler (KISS).
- **Move `README.md` and `CONTRIBUTING.md` into `docs/` too.** Rejected:
  forges only render them as the project landing page from the root, and
  the CLI looks for the contribution guide at the root.

## Decision

- A project's slide deck lives in `slides/`, and only there.
- `slides/` holds the whole deck, `index.html` and the deck `package.json`
  included.
- `docs/` holds the project documentation: ADRs, training documentation,
  trainer notes and other docs. It never holds the deck, nor any part of it.
- Files a forge or the CLI expects at the root stay at the root.
- `sfeir-school-theme-migrate` is the vehicle to convert a project whose
  deck is still in `docs/`: everything but `docs/adr/` moves to `slides/`.
- The `check` command fails clearly on a legacy `docs/` deck with no
  `slides/`, pointing at `sfeir-school-theme-migrate`.

## Other Related ADRs

- [[theme-0003-labs-directory]] - same project layout, for labs
- [[theme-0004-self-contained-slides]] - governs what may live under `slides/`
- [[theme-0005-slide-declaration-contract]] - the deck declared under `slides/`

## References

- [`cli/command/check/check-root-dir.ts`](../../cli/command/check/check-root-dir.ts) - `G_002`, `G_004`
- [`cli/command/check/check-slides.ts`](../../cli/command/check/check-slides.ts)
- [`cli/utils/path.utils.ts`](../../cli/utils/path.utils.ts)
- [`scripts/sfeir-school-theme-migration.ts`](../../scripts/sfeir-school-theme-migration.ts)
