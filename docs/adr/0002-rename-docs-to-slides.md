# 0002. Rename `docs/` to `slides/`, reclaim `docs/` for documentation

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](TBD — PR not yet opened) 2026-09-23

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

The `check` command (`cli/command/check/check-root-dir.ts`, rule `G_002`)
requires every `sfeir-school-template`/`sfeir-school-xxx` project to have a
`<root>/docs` directory holding the RevealJS slide deck: the declaration
script, the markdown, the images, the slide-specific CSS, and the compiled
theme bundle (`check-docs.ts`, rules `S_001`–`S_010`).

Since [[0000-adopt-adrs]], `docs/` is also where every tier's own ADRs and
project documentation live (`docs/adr/`). Overloading `docs/` for two
unrelated audiences — the learner-facing slide deck and the
contributor-facing project documentation — is confusing and gets in the
way of adopting the ADR convention cleanly in generated schools.

## Proposed Design

Rename the CLI-mandated slide-deck root from `docs/` to `slides/`. Every
path currently rooted at `<root>/docs/...` (`scripts/slides.js`,
`markdown/`, `assets/images/`, `css/slides.css`, `web_modules/`) moves to
the equivalent path under `<root>/slides/...`, unchanged otherwise.
`<root>/docs/` becomes free for `docs/adr/` and other project
documentation.

This affects: `G_002`, every path assumption in `S_001`–`S_010`
(`check-docs.ts`), and `cli/README.md`.

## Considerations

- **Dual-support transition (`docs/` and `slides/` both accepted) vs. hard
  cut.** Rejected dual-support: the number of existing `sfeir-school-xxx`
  repos is small, and a compatibility mode is extra CLI code that would
  need to be remembered and removed later — a hard cut is simpler (KISS).
- **Renaming this repo's own `demo/` to match the `slides/` shape.**
  Considered, for a contributor exploring the theme to see the target
  shape directly. Rejected: this repo doesn't run `check` on itself, so
  there is no functional benefit, and nesting `demo/`'s content one level
  deeper (or moving `index.html` inside it, which is what actually
  serving it with zero config would require) is extra churn — the current
  `demo/scripts`, `demo/markdown`, `demo/assets`, `demo/web_modules`
  layout already works and stays simpler.

## Decision

- The slide-deck root is renamed `docs/` → `slides/` in
  `sfeir-school-template` and every `sfeir-school-xxx` instance.
- This is a breaking change for the `check` command: `G_002` and every
  path in `check-docs.ts` must be updated to look under `slides/` —
  tracked as CLI implementation follow-up, not detailed here.
- The existing `sfeir-school-theme-migrate` binary is the designated
  vehicle to move a project's `docs/` → `slides/` (together with
  [[0003-rename-steps-to-labs]]'s `steps/` → `labs/`), rather than a
  separate one-off script.
- The CLI should fail clearly, pointing at the migrate command, when it
  finds a legacy `docs/` slide deck with no `slides/` counterpart — exact
  rule code is CLI implementation work.

## Other Related ADRs

- [[0003-rename-steps-to-labs]] - same migration wave, same rationale
- [[0004-self-contained-slides]] - governs what may live under `slides/`
- [[0005-slide-declaration-contract]] - paths move under this rename

## References

- [`cli/command/check/check-root-dir.ts`](../../cli/command/check/check-root-dir.ts)
- [`cli/command/check/check-docs.ts`](../../cli/command/check/check-docs.ts)
- [`cli/README.md`](../../cli/README.md)
