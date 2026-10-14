# theme-0003. Hands-on exercises are labs, and live in `labs/`

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-09-23
- [amended](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-10-14 — reframed without "rename", technical change list removed, wrong `L_001` attribution removed

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

Hands-on exercises used to live in a `steps/` directory, while trainers,
generated schools and the CLI's own messages already called them "labs".
The folder name and the config keys did not match the word everyone used.

## Proposed Design

- Hands-on exercises are called **labs**, everywhere: the directory, the
  config keys, the CLI messages, the documentation.
- They live in `labs/` at the project root.
- The two lab-related config keys use the same word: `labCommandPrefix`
  and `ignoreLabsDirectories`.
- What a lab contains, and how it is declared and shown on slides, is
  defined in [[theme-0006-lab-contract]].

## Considerations

- **Keep the old `steps/` names as deprecated aliases for a release.**
  Rejected, for the same reason as [[theme-0002-slides-and-docs-directories]]:
  a compatibility shim has to be remembered and removed later. The migrate
  command converts a project once.

## Decision

- Labs live in `labs/`; the term is "lab" everywhere.
- The config keys are `labCommandPrefix` and `ignoreLabsDirectories`.
- Projects still using `steps/` and the old keys are converted by
  `sfeir-school-theme-migrate`, hard cut, no compatibility shim.
- The migrate command renames the directory and the keys only. Renaming
  each lab to the `NNN-name-lab` form of [[theme-0006-lab-contract]] is a
  manual, one-time step. `labs.json`, the lab slides' commands and any
  package script naming a lab must follow the new names.

## Other Related ADRs

- [[theme-0002-slides-and-docs-directories]] - same project layout, for slides
- [[theme-0006-lab-contract]] - what a lab is
- [[theme-0009-labs-as-npm-workspaces]] - how labs are declared
- [[theme-0012-bounded-config-overrides]] - the config keys named here

## References

- [`cli/command/check/internal.ts`](../../cli/command/check/internal.ts) - labs checked only when `labs/` exists
- [`cli/command/check/check-labs.ts`](../../cli/command/check/check-labs.ts)
- [`cli/config-template.json`](../../cli/config-template.json)
