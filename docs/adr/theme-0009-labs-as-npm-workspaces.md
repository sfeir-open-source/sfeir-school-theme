# theme-0009. Labs as npm workspaces, with a `labs.json` fallback

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-09-23
- [amended](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-10-14 — narrowed to the declaration mechanism; naming moved to [[theme-0006-lab-contract]]; `labs/` optional; script lives in `labs/package.json`
- [amended](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-10-16 — `labs/package.json` and `slides/package.json` are two separate packages, never substituted for each other

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

`check-labs.ts` (`L_002`, `L_003`, `L_004`) requires every lab directory
under `labs/` to be declared, in one of two files at the root of `labs/`:

- `labs/package.json`, as npm `workspaces` (or a `labs` array);
- otherwise `labs/labs.json`, as a `labs` array.

When `labs/package.json` is used, each lab also needs a script of the same
name in that `labs/package.json`, and its own `package.json` whose `name`
is the lab's directory name.

Some trainings have no hands-on exercise at all.

## Proposed Design

- **Two declaration forms stay legitimate.** Not every training's labs are
  npm projects (some are Gradle, Python, …). `labs/labs.json` is the
  tool-neutral form, defined in [[theme-0006-lab-contract]].
- **npm workspaces form.** When `labs/package.json` exists, it is the
  declaration, and the stricter correspondence applies: a script per lab
  in `labs/package.json`, and a lab `package.json` named after its
  directory. That is what makes `npm run <lab>` work.
- **Two separate packages.** `labs/package.json`, when it exists, is the
  labs' package only. It never replaces, extends or absorbs
  `slides/package.json`, which belongs to the deck (its `prepare` script
  refreshes `slides/web_modules/`, see [[theme-0004-self-contained-slides]]):
  - neither declares the other as a workspace;
  - neither carries the other's scripts or dependencies;
  - installing or running one never requires the other.
- **No labs, no `labs/`.** A training with no lab needs neither a `labs/`
  directory nor a declaration file. The `check` command must not fail
  because `labs/` is missing; the lab rules simply have nothing to check.

## Considerations

- **Force every school onto npm workspaces, for consistency.** Rejected:
  SFEIR School covers non-JS trainings; forcing an npm-only mechanism would
  remove the `labs.json` escape hatch that exists precisely for that
  reason.
- **An explicit config flag to say "this training has no labs".**
  Rejected: the absence of `labs/` already says it, without a new key.

## Decision

- Labs are declared either as npm workspaces in `labs/package.json` or in
  `labs/labs.json`; the npm-only correspondence rules (`L_003`, `L_004`)
  apply to the first form only.
- `labs/package.json` and `slides/package.json` are two separate packages:
  one never substitutes for, nor includes, the other.
- `labs/` is optional: a training without labs has none, and `check` does
  not fail on its absence.
- What a lab is (naming, README, solution, slide) is defined in
  [[theme-0006-lab-contract]].

## Other Related ADRs

- [[theme-0003-labs-directory]] - `labs/` and the `lab` vocabulary
- [[theme-0006-lab-contract]] - the lab contract this declaration serves
- [[theme-0004-self-contained-slides]] - `slides/package.json` belongs to the deck
- [[theme-0016-minimal-tooling-footprint]] - same reasoning for non-JS labs

## References

- [`cli/command/check/check-labs.ts`](../../cli/command/check/check-labs.ts) - `L_002`–`L_004`
- [`cli/command/check/internal.ts`](../../cli/command/check/internal.ts) - lab rules run only when `labs/` exists
- [`cli/utils/labs.utils.ts`](../../cli/utils/labs.utils.ts) - `hasLabsDirectory`, reading `labs/package.json` and `labs/labs.json`
- [`cli/README.md`](../../cli/README.md)
