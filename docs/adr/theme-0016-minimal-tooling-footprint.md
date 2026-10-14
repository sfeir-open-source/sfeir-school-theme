# theme-0016. New tooling in a school's materials is opt-in, never the default

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-09-23
- [amended](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-10-14 — [[theme-0004-self-contained-slides]] is review-enforced, not CLI-enforced; scope wording aligned with the Decision

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

A SFEIR School is run by a trainer, often alone, for a room of
participants with varying setups. Every piece of tooling the generated
project depends on (a bundler, a task runner, a linter, a framework CLI) is:

- one more thing the trainer installs, keeps working across machines, and
  explains when it breaks mid-session;
- one more thing a participant installs before starting the first lab.

[[theme-0004-self-contained-slides]] already states a zero-install
invariant, but only for `slides/`. Nothing says the same about the rest of
the project: the generator CLI's own dependencies, the root
`package.json`, the scaffolding around labs.

Nothing currently stops a future PR from reaching for a new dependency
because it is convenient to build with, without weighing what it costs the
person running or taking the training.

## Proposed Design

- A new tool a trainer or a participant has to install, learn or keep
  working is a cost, not a free convenience.
- This applies to any new dependency of the template, the generator CLI or
  the scaffolding around labs.
- The default answer is no.
- A contributor proposing new tooling states, in the PR or the ADR that
  introduces it:
  - what it replaces, or what it makes possible that the current toolset
    cannot;
  - why that outweighs the added install and maintenance surface.
- This is a standing constraint future ADRs and PRs are weighed against.
  No CLI rule enforces it; review does.

## Considerations

- **A hard, enumerated allow-list of permitted tools.** Rejected:
  - too rigid for a theme that already accommodates non-JS trainings
    ([[theme-0009-labs-as-npm-workspaces]]);
  - a fixed list would need constant amendment;
  - a lab's own toolchain is the trainer's call, not the template's.
- **Leave it as an unstated cultural norm.** Rejected:
  - that is the status quo this ADR closes;
  - "stay KISS" is already a project value, cited by
    [[theme-0012-bounded-config-overrides]]'s Considerations;
  - an unstated norm does not survive a rotating contributor base, the
    motivation of [[theme-0000-adopt-adrs]].
- **Scope: does this also bind a lab's own toolchain?** Partially:
  - a lab is free to teach whatever tool is its subject (that is often
    the point);
  - the scaffolding around labs (the generator, the root project, how a
    lab is declared and run) stays bound by this ADR's default-no.

## Decision

- Adding a new tool the template, the generator CLI, or the project root
  depends on is opt-in: the change must say what it costs a trainer or a
  participant to install and maintain, and why that is worth it.
- [[theme-0004-self-contained-slides]]'s zero-install invariant for
  `slides/` remains the floor this ADR does not relax. It is enforced in
  review until its CLI check lands.
- This ADR extends the same default-no posture to the rest of the project,
  as a review-time constraint rather than an automated check.
- A lab is free to teach or depend on any tool relevant to its own
  subject; this ADR governs the scaffolding around labs, not a lab's own
  pedagogical content.

## Other Related ADRs

- [[theme-0004-self-contained-slides]] - the same principle as a hard
  invariant, scoped to `slides/`
- [[theme-0009-labs-as-npm-workspaces]] - already accommodates non-JS labs, the
  same reasoning this ADR generalizes
- [[theme-0012-bounded-config-overrides]] - cites the same KISS value this
  ADR makes explicit and standing

## References

None — this ADR formalizes a review-time norm, not a piece of existing
code.
