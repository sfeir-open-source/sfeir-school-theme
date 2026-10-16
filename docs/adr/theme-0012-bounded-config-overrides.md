# theme-0012. A bounded override surface for the `check` contract

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-09-23
- [amended](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-10-14 — retitled as a bounded override surface; exhaustive key table (incl. `ignoreAssets`, `ignoreCommandCheck`); unknown keys reported

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

The `check` command enforces a contract every school follows. Some schools
have legitimate local needs: an extra stylesheet, a lab run with a
specific command, a technical directory in `labs/` that is not an
exercise. Without a defined way to express them, overrides would pile up
as ad hoc CLI flags, env vars or forks of the rules.

The decision is therefore not "a config file exists", but **what a project
is allowed to override, and what it is not**.

## Proposed Design

A project may override the `check` defaults only through one optional
file, `<root>/.sfeir-theme-config.json`, merged over the defaults of
`cli/config-template.json`. Its accepted keys are exhaustively:

| Key | Default | What it tunes |
|---|---|---|
| `extraCssFiles` | `[]` | Extra stylesheets (under `slides/`) accepted by the CSS allow-list ([[theme-0008-slide-css-class-allowlist]]). |
| `labCommandPrefix` | `""` | Prefix of a lab run command ([[theme-0006-lab-contract]]). While empty, `L_007`, `S_011` and the lab-name check of `S_005` are skipped, and the remaining `S_005` presence check is effectively a no-op. |
| `ignoreLabsDirectories` | `[]` | Directories in `labs/` that are not exercises, excluded from the lab rules. |
| `ignoreAssets` | `[]` | Images exempted from the "unused image" rule ([[theme-0007-slide-asset-referential-integrity]]), relative to `slides/assets/` (e.g. `images/foo.png`). |
| `ignoreCommandCheck` | `[]` | Lab slides with no command to run, exempted from `S_005`/`S_011`. |

Rules for this surface:

- A key is either a parameter or a per-item exemption. No key turns a rule
  off as a whole (e.g. the CSS allow-list `S_009`, or the lab naming rule
  `L_011`).
- The empty `labCommandPrefix` default is the one accepted exception: a
  school without a run-command convention simply has none to check.
- A key not in the table is reported by `check` as a `G_005` warning and
  ignored.
- The legacy keys `stepCommandPrefix` and `ignoreStepsDirectories` get a
  `G_005` hint naming their new key and the migrate command.
- Adding a key is a decision: it is recorded as a Change Log amendment of
  this ADR, with the table updated.

## Considerations

- **CLI flags instead of a config file.** Rejected: these settings are
  properties of the project, not of one invocation. A committed file keeps
  them versioned and shared by every contributor and CI run.
- **A mandatory config file.** Rejected: most schools need none of these
  overrides (KISS).
- **Let projects disable any rule.** Rejected: the contract would no longer
  mean the same thing from one school to the next.
- **Runtime options of `SfeirThemeInitializer.init()`** (`knowStyles`,
  `defaultLang`, …) are a separate surface, for rendering, outside this
  ADR.

## Decision

- `.sfeir-theme-config.json` is optional, at the project root, merged over
  `cli/config-template.json`, and is the only per-project override of the
  `check` contract.
- The accepted keys are exactly those in the table above; unknown keys are
  reported as a `G_005` warning and ignored.
- Overrides are parameters or per-item exemptions, never a whole rule
  turned off.
- A new key is opened only by amending this ADR's Change Log and table.

## Other Related ADRs

- [[theme-0003-labs-directory]] - names the lab keys
- [[theme-0006-lab-contract]] - consumes `labCommandPrefix`, `ignoreLabsDirectories`, `ignoreCommandCheck`
- [[theme-0007-slide-asset-referential-integrity]] - consumes `ignoreAssets`
- [[theme-0008-slide-css-class-allowlist]] - consumes `extraCssFiles`

## References

- [`cli/config-template.json`](../../cli/config-template.json)
- [`cli/utils/config.utils.ts`](../../cli/utils/config.utils.ts) - unknown and legacy keys
- [`cli/command/check/check-root-dir.ts`](../../cli/command/check/check-root-dir.ts) - `G_005`
- [`cli/README.md`](../../cli/README.md) - one section per key
