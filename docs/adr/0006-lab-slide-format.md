# 0006. Lab slide format contract

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](TBD — PR not yet opened) 2026-09-23

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

`check-docs.ts` (`S_004`, `S_005`, `S_006`) and `check-labs.ts` (`L_001`)
enforce that a slide presenting a hands-on exercise ("lab slide") carries a
specific marker and structure, so the CLI can cross-check that every lab
has a slide telling the learner how to run it, and vice versa.

## Proposed Design

Keep this as a mandatory, machine-checkable slide format whenever a slide
presents a hands-on exercise — not every slide needs one, a purely
conceptual exercise with no backing lab directory is legitimate and simply
carries no `exercice` marker:

```
<!-- .slide: class="exercice" -->
## Lab

One or two sentences telling the learner what they're about to build or
fix — the "what" and "why", not the step-by-step (that's the lab's own
`README.md`, [[0010-lab-instructions-contract]]).

<labCommandPrefix><lab-name>
```

`<lab-name>` must match an existing lab directory, named per
[[0009-labs-as-npm-workspaces]]'s convention. This governs only how a lab
is announced on the slide deck — the lab's own step-by-step instructions
and its optional solution live under its directory, governed by
[[0010-lab-instructions-contract]] and [[0011-lab-solution-pairing]]
respectively.

## Considerations

- **A lighter-weight marker (e.g. front-matter) instead of the HTML
  comment + heading convention.** Rejected here: changing the marker
  format is an unrelated concern from formalizing the existing,
  already-battle-tested convention — revisit separately if ever needed.

## Decision

- The `exercice` class, the `## Lab` heading, and the prefixed command
  line remain the mandatory lab-slide format, enforced by the CLI (current
  `S_004`/`S_005`/`S_006`/`L_001`, relocated as needed once
  [[0002-rename-docs-to-slides]] and [[0003-rename-steps-to-labs]] land).
- A slide needs this marker only when it presents a hands-on exercise; a
  lecture-only slide, or a conceptual exercise with no backing directory,
  carries no `exercice` class and is out of this ADR's scope.

## Other Related ADRs

- [[0003-rename-steps-to-labs]] - `labCommandPrefix` naming
- [[0005-slide-declaration-contract]] - lab slides are a subset of declared slides
- [[0009-labs-as-npm-workspaces]] - what a valid lab command target is
- [[0010-lab-instructions-contract]] - where the lab's own instructions live
- [[0011-lab-solution-pairing]] - the optional solution this slide points to

## References

- [`cli/command/check/check-docs.ts`](../../cli/command/check/check-docs.ts)
- [`cli/README.md`](../../cli/README.md)
