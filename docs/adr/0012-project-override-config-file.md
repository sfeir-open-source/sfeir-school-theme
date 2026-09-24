# 0012. Per-project override configuration file `.sfeir-theme-config.json`

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](TBD — PR not yet opened) 2026-09-23

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

`cli/utils/config.utils.ts` reads an optional `<root>/.sfeir-theme-config.json`,
merged over `cli/config-template.json` defaults (`extraCssFiles`,
`stepCommandPrefix`/`labCommandPrefix`,
`ignoreStepsDirectories`/`ignoreLabsDirectories` — post
[[0003-rename-steps-to-labs]]). It is the only per-project escape hatch in
the whole `check` contract, and it has never been written down as a
deliberate design choice.

## Proposed Design

Keep a single, optional, JSON config file at the project root as the sole
mechanism for a school to override CLI defaults; every key has a safe
default (see `config-template.json`), so a school with no special needs
needs no config file at all.

## Considerations

- **CLI flags instead of a config file.** Rejected: these settings are
  properties of the project, not of a single invocation — a committed file
  keeps them versioned and shared by every contributor/CI run, where flags
  would have to be repeated everywhere the CLI is invoked.
- **A mandatory, always-present config file.** Rejected: most schools need
  none of these overrides; requiring a file for defaults-only projects is
  needless ceremony (KISS).

## Decision

- `.sfeir-theme-config.json` remains optional, root-level, merged over
  documented defaults; it stays the single place for per-project CLI
  overrides, with new keys added there as new overridable behaviors are
  introduced.

## Other Related ADRs

- [[0003-rename-steps-to-labs]] - renames two of its keys
- [[0006-lab-slide-format]] - consumes `labCommandPrefix`
- [[0008-slide-css-class-allowlist]] - consumes `extraCssFiles`

## References

- [`cli/utils/config.utils.ts`](../../cli/utils/config.utils.ts)
- [`cli/config-template.json`](../../cli/config-template.json)
