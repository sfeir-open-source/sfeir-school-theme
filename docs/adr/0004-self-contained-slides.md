# 0004. Slides must be self-contained and viewable with a zero-install static server

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](TBD — PR not yet opened) 2026-09-23

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

`slides/` ([[0002-rename-docs-to-slides]]) is what a learner or trainer
opens. Today it already works with nothing more than a static file
server: `demo/index.html` only uses relative ES module imports
(`./scripts/slides.js`, `./web_modules/sfeir-school-theme/dist/sfeir-school-theme.css`)
— no bare specifier, no import map, no bundler. But nothing currently
stops a future change from introducing a bare-specifier import, a CDN
dependency, or a required build step, silently breaking that property for
every generated school.

## Proposed Design

Make "`slides/` is viewable by running `npx serve` (or any equivalent
static file server), with no install and no build step, and no other tool
(Nx, a framework CLI, a dev-server-only feature)" an explicit, permanent
invariant of the theme/template/instances chain, not an accident of the
current implementation.

Concretely: slide markup, its `scripts/slides.js`, and its CSS/asset
references must only use relative paths and standard ES module imports a
browser resolves natively; the theme's compiled bundle
(`web_modules/sfeir-school-theme/dist/*`) is the only "external"
dependency, and it is committed/installed as plain files, never fetched
from a CDN at slide-runtime.

## Considerations

- **Should this constrain how `sfeir-school-theme` itself is built?** No —
  this ADR governs the *consumption* side (`slides/`) only. The theme is
  free to use any build tooling to produce `dist/`, as long as that output
  is plain, static, browser-consumable files.
- **Enforcing it automatically.** Desirable (e.g. a check rejecting
  bare-specifier imports or `<script src="https://...">` in slide files),
  but the exact rule is CLI implementation work, left as follow-up.

## Decision

- The self-contained, zero-install, "`npx serve` just works" property of
  `slides/` is a permanent architectural invariant.
- No dependency on Nx, Vue, a framework CLI, or any dev-server-only
  feature is allowed inside `slides/`.
- An automated CLI check enforcing this is tracked as follow-up work, not
  specified here.

## Other Related ADRs

- [[0002-rename-docs-to-slides]] - defines the directory this invariant applies to

## References

- [`demo/index.html`](../../demo/index.html) - current, already-compliant example
