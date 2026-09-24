# 0009. Labs as npm workspaces, with a `labs.json` fallback

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](TBD — PR not yet opened) 2026-09-23

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

`check-labs.ts` (`L_002`, `L_003`, `L_004`) requires every lab directory
under `steps/` (`labs/` after [[0003-rename-steps-to-labs]]) to be declared
either as an npm `workspaces` entry (if `labs/package.json` exists) or in a
`labs/labs.json` `labs` array. When the npm-workspace form is used, each
lab additionally needs a matching root `package.json` script and a
`package.json` inside the lab directory whose `name` matches the lab's
directory name.

## Proposed Design

Keep both declaration forms as legitimate: not every training's labs are
npm projects (some may be Gradle, Python, etc. — the same reasoning
[[0000-adopt-adrs]] already applied to the template accommodating non-JS
toolchains). When the npm-workspace form is used, keep the stricter
name/script correspondence checks, since that's what makes `npm run <lab>`
actually work.

## Considerations

- **Force every school onto npm workspaces, for consistency.** Rejected:
  SFEIR School covers non-JS trainings; forcing an npm-only mechanism
  would remove the `labs.json` escape hatch that exists precisely for that
  reason.

## Decision

- Keep the dual declaration mechanism (npm workspaces, or `labs.json`) and
  the stricter npm-only correspondence rules, unchanged in substance —
  path prefix updates only (`steps/` → `labs/`, per
  [[0003-rename-steps-to-labs]]).

## Other Related ADRs

- [[0003-rename-steps-to-labs]] - directory this ADR's rules live under
- [[0006-lab-slide-format]] - lab command targets this declares
- [[0010-lab-instructions-contract]] - README convention per declared lab
- [[0011-lab-solution-pairing]] - pairing rule on top of this declaration

## References

- [`cli/command/check/check-labs.ts`](../../cli/command/check/check-labs.ts)
- [`cli/README.md`](../../cli/README.md)
