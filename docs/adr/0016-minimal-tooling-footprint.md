# 0016. New tooling in a school's materials is opt-in, never the default

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](TBD — PR not yet opened) 2026-09-23

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

A SFEIR School is run by a trainer, often alone, for a room of
participants with varying setups. Every piece of tooling the generated
project depends on — a bundler, a task runner, a linter, a framework CLI —
is one more thing the trainer has to install, keep working across
machines, and explain when it breaks mid-session, and one more thing a
participant has to install before they can even start the first lab.
[[0004-self-contained-slides]] already enforces a zero-install invariant,
but only for `slides/`; nothing says the same thing about the project as a
whole — the generator CLI's own dependencies, `trainers/`, the root
`package.json`, a lab's own toolchain.

Nothing currently stops a future PR from reaching for a new dependency
because it is convenient to build with, without weighing what it costs the
person running or taking the training.

## Proposed Design

Treat "does this add a new tool a trainer or a participant has to install,
learn, or keep working" as a cost that must be named and justified in any
change proposing a new dependency for the template, the generator CLI, or
a lab's own toolchain — not a free convenience. The default answer is no;
a theme/template contributor proposing new tooling states, in the PR or
the ADR introducing it, what it replaces or what it makes possible that
the current toolset cannot, and why that outweighs the added install/
maintenance surface.

This is a standing constraint future ADRs and PRs are weighed against, not
a one-time change — it has no CLI rule to enforce it and relies on review.

## Considerations

- **A hard, enumerated allow-list of permitted tools.** Rejected: too
  rigid for a theme that already accommodates non-JS trainings
  ([[0009-labs-as-npm-workspaces]]) — a fixed list would need constant
  amendment and doesn't fit a lab's own, lab-specific toolchain choices,
  which are the trainer's call, not the template's.
- **Leave it as an unstated cultural norm.** Rejected: that's the status
  quo this ADR is closing — "stay KISS" is already a project value
  ([[0012-project-override-config-file]]'s Considerations cites it), but
  an unstated norm doesn't survive a rotating contributor base any better
  than an undocumented architecture decision does ([[0000-adopt-adrs]]'s
  own motivation).
- **Scope: does this also bind a lab's own toolchain, inside a single
  lab directory?** Partially — a lab is free to teach whatever tool is the
  subject of that lab (that's often the point), but the *scaffolding
  around* labs (the generator, the root project, how a lab is declared and
  run) stays bound by this ADR's default-no.

## Decision

- Adding a new tool the template, the generator CLI, or the project root
  depends on is opt-in: the change must say what it costs a trainer/
  participant to install and maintain, and why that is worth it.
- [[0004-self-contained-slides]]'s zero-install invariant for `slides/`
  remains the hard, CLI-enforced floor this ADR does not relax; this ADR
  extends the same default-no posture to the rest of the project, as a
  review-time constraint rather than an automated check.
- A lab is free to teach or depend on any tool relevant to its own
  subject; this ADR governs the scaffolding around labs, not a lab's own
  pedagogical content.

## Other Related ADRs

- [[0004-self-contained-slides]] - the hard, enforced version of this
  principle, scoped to `slides/`
- [[0009-labs-as-npm-workspaces]] - already accommodates non-JS labs, the
  same reasoning this ADR generalizes
- [[0012-project-override-config-file]] - cites the same KISS value this
  ADR makes explicit and standing

## References

None — this ADR formalizes a review-time norm, not a piece of existing
code.
