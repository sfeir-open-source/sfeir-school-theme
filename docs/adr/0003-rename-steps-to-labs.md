# 0003. Rename `steps/` to `labs/`, align config vocabulary

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](TBD — PR not yet opened) 2026-09-23

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

The `check` command requires every project to have a `<root>/steps`
directory holding lab exercises (`check-root-dir.ts`, rule `G_003`),
validated by `check-labs.ts` (`L_001`–`L_010`), declared via
`steps/package.json` or `steps/labs.json`, and tunable through
`.sfeir-theme-config.json`'s `ignoreStepsDirectories` and
`stepCommandPrefix` keys.

The vocabulary is already inconsistent: the directory and the config keys
say "step", while every check message already says "lab" (e.g. `L_001`:
`Lab "%s" should be declared...`). This is confusing for anyone reading the
folder name or the config file against the CLI's own output.

## Proposed Design

Rename `<root>/steps/` → `<root>/labs/`. Rename the config keys:
`ignoreStepsDirectories` → `ignoreLabsDirectories`, `stepCommandPrefix` →
`labCommandPrefix`. `labs.json`/`package.json` keep their names — they are
already correctly named. No change to lab/solution semantics
([[0011-lab-solution-pairing]] covers that).

## Considerations

- **Keep `stepCommandPrefix` as a deprecated alias for one release.**
  Rejected, for the same reason as [[0002-rename-docs-to-slides]]: a
  runtime dual-read shim needs to be remembered and removed later; the
  migrate command is the right place to handle the rename once, not a
  permanent compatibility layer.

## Decision

- `steps/` → `labs/`; `ignoreStepsDirectories` → `ignoreLabsDirectories`;
  `stepCommandPrefix` → `labCommandPrefix`.
- `check-root-dir.ts` (`G_003`), `check-labs.ts` (all `L_0xx`),
  `cli/config-template.json`, `ConfigJson` in `cli/utils/config.utils.ts`,
  and `cli/README.md` are updated accordingly — CLI implementation
  follow-up, not detailed here.
- Same migration path as [[0002-rename-docs-to-slides]]: handled by
  `sfeir-school-theme-migrate`, hard cut, no compatibility shim.

## Other Related ADRs

- [[0002-rename-docs-to-slides]] - same migration wave
- [[0009-labs-as-npm-workspaces]] - directory this ADR renames
- [[0010-lab-instructions-contract]] - uses `labCommandPrefix`
- [[0011-lab-solution-pairing]] - unaffected in substance, path only

## References

- [`cli/command/check/check-root-dir.ts`](../../cli/command/check/check-root-dir.ts)
- [`cli/command/check/check-labs.ts`](../../cli/command/check/check-labs.ts)
- [`cli/config-template.json`](../../cli/config-template.json)
- [`cli/utils/config.utils.ts`](../../cli/utils/config.utils.ts)
