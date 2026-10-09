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
- **Is a config file really an architecture decision?** Yes — the
  decision isn't the file's existence, it's that the whole `check`
  contract exposes exactly one override surface, bounded to the keys this
  ADR's Change Log enumerates. Letting overrides accumulate as ad hoc CLI
  flags or scattered env vars, instead of one reviewed, versioned surface,
  is the alternative this ADR rules out.

## Decision

- `.sfeir-theme-config.json` remains optional, root-level, merged over
  documented defaults; it stays the single place for per-project CLI
  overrides, with new keys added there as new overridable behaviors are
  introduced.
- The surface is bounded to the keys `config-template.json` enumerates: a
  project cannot use this file to turn off a `check` rule outright (e.g.
  disabling the CSS allow-list of [[0008-slide-css-class-allowlist]], or
  opting out of [[0004-self-contained-slides]]'s zero-install invariant) —
  only to tune parameters this ADR's Change Log has explicitly opened up
  (ignored directories, prefixes, extra CSS files). Opening a new one is
  itself a decision, recorded by amending this Change Log, not by
  silently adding a key.

## Other Related ADRs

- [[0003-rename-steps-to-labs]] - renames two of its keys
- [[0006-lab-slide-format]] - consumes `labCommandPrefix`
- [[0008-slide-css-class-allowlist]] - consumes `extraCssFiles`

## References

- [`cli/utils/config.utils.ts`](../../cli/utils/config.utils.ts)
- [`cli/config-template.json`](../../cli/config-template.json)
