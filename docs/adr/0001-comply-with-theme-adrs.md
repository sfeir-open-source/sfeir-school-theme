# 0001. Comply with sfeir-school-theme's Architecture Decision Records

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](TBD — PR not yet opened) 2026-09-23

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

[[0000-adopt-adrs]] already decided that the template, and every generated
`xxx` instance, must comply with every ADR published by the theme version
they depend on, and that each keeps one ADR of its own stating that
obligation explicitly. That statement needs to exist as real, reviewable
content rather than being re-invented ad hoc by whoever scaffolds a
project. It is authored here, right after [[0000-adopt-adrs]] in this
repo's own sequence, so `sfeir-school-theme-migrate` can seed it —
renumbered to fit — into any project it migrates.

## Proposed Design

This ADR's own Decision section is written from the perspective of a
project that depends on `sfeir-school-theme` — it is the exact text a
migrated project receives as its own `docs/adr/0001-comply-with-theme-adrs.md`
(or whatever number is next available there), published from this repo's
`docs/adr/` (hence `dist/adr/`) like every other ADR here, and copied down
by the migration tool rather than duplicated by hand in every downstream
repo.

## Considerations

- Keeping this content as a plain, unnumbered template file outside
  `docs/adr/` (e.g. under `scripts/`). Rejected: it would not be a real,
  numbered, reviewed decision of this repo — every other decision here
  lives in `docs/adr/` and is published through `dist/adr/`; this one is
  no different just because its primary audience is downstream projects.
- Numbering it after the rest of the theme's own decisions (e.g. as the
  next available number instead of `0001`). Rejected: this ADR and
  [[0000-adopt-adrs]] are the two decisions every tier of the chain
  adopts as its own — they belong together at the start of the sequence,
  not mixed in with the theme's own, unrelated architecture decisions.

## Decision

- This project must comply with every ADR published under
  `web_modules/sfeir-school-theme/dist/adr` for the `sfeir-school-theme`
  version it currently depends on, instead of re-documenting or
  duplicating them here.
- Bumping that dependency is what brings the theme's new or changed ADRs
  down into this project — no extra step needed here.
- This project's own decisions (local to this school or this template)
  get their own ADRs in this same `docs/adr/`.

## Other Related ADRs

- [[0000-adopt-adrs]] - the practice this ADR's content commits a project to
- [[0002-rename-docs-to-slides]] - defined this ADR's role and obligation
- [[0003-rename-steps-to-labs]] - same migration wave

## References

- [sfeir-school-theme ADRs](https://github.com/sfeir-open-source/sfeir-school-theme/tree/main/docs/adr)
