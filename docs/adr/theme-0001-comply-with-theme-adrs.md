# theme-0001. Comply with sfeir-school-theme's Architecture Decision Records

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-09-23
- [amended](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-10-14 — seeded as `theme-0001-comply-with-theme-adrs.md` as-is, no renumbering

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

[[theme-0000-adopt-adrs]] decided that the template, and every generated
`xxx` instance, must comply with every ADR published by the theme version
they depend on. That obligation needs to exist as real, reviewable content
in each project, rather than being re-invented by whoever scaffolds it.

## Proposed Design

- This ADR is authored in the theme, published through `dist/adr/` like
  every other theme ADR.
- `sfeir-school-theme-migrate` copies it into a project's `docs/adr/` as
  `theme-0001-comply-with-theme-adrs.md`: same file name, same content, no
  renumbering.
- Its Decision is written from the point of view of a project that depends
  on `sfeir-school-theme`, so the copied text reads correctly downstream.
- Its `theme-` prefix is consistent with the naming rule of
  [[theme-0000-adopt-adrs]]: it is a theme decision, so it keeps the theme
  prefix wherever it lives. It never takes a slot in the project's own
  `template-` or `<xxx>-` sequence.

## Considerations

- **A plain template file outside `docs/adr/` (e.g. under `scripts/`).**
  Rejected: it would not be a real, reviewed decision of this repo, and
  would not be published through `dist/adr/` like the others.
- **Renumbering the copy into the project's own sequence.** Rejected: the
  copy would no longer match its source, and two projects would give the
  same decision different numbers. The tier prefix makes renumbering
  unnecessary.

## Decision

- This project must comply with every ADR published under
  `slides/web_modules/sfeir-school-theme/dist/adr` for the
  `sfeir-school-theme` version it currently depends on, instead of
  re-documenting or duplicating them here.
- Bumping that dependency is what brings the theme's new or changed ADRs
  into this project; no extra step is needed.
- This project's own decisions get their own ADRs in this same
  `docs/adr/`, prefixed `template-` (in the template) or `<xxx>-` (in a
  school), and only on subjects the theme ADRs leave open.

## Other Related ADRs

- [[theme-0000-adopt-adrs]] - the practice and the naming and precedence
  rules this ADR commits a project to

## References

- [sfeir-school-theme ADRs](https://github.com/sfeir-open-source/sfeir-school-theme/tree/main/docs/adr)
- [`scripts/sfeir-school-theme-migration.ts`](https://github.com/sfeir-open-source/sfeir-school-theme/blob/main/scripts/sfeir-school-theme-migration.ts) - seeds this file
