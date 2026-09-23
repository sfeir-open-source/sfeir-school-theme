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

Keep this as a mandatory, machine-checkable slide format:

```
<!-- .slide: class="exercice" -->
## Lab
...
<labCommandPrefix><lab-name>
```

with the command target required to match an existing lab
([[0009-labs-as-npm-workspaces]]).

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

## Other Related ADRs

- [[0003-rename-steps-to-labs]] - `labCommandPrefix` naming
- [[0005-slide-declaration-contract]] - lab slides are a subset of declared slides
- [[0009-labs-as-npm-workspaces]] - what a valid lab command target is

## References

- [`cli/command/check/check-docs.ts`](../../cli/command/check/check-docs.ts)
- [`cli/README.md`](../../cli/README.md)
