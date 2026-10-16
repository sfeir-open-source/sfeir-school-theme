# theme-0004. Slides must be self-contained and viewable with a zero-install static server

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-09-23
- [amended](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-10-14 — context no longer relies on this repo's `demo/`; committing `web_modules/` stated as intended

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

`slides/` ([[theme-0002-slides-and-docs-directories]]) is what a learner or
trainer opens. A school's `slides/index.html` and `slides/scripts/slides.js`
load the theme only through relative paths into
`slides/web_modules/sfeir-school-theme/`: no bare specifier, no import map, no
bundler. So the deck already opens with any static file server.

Nothing stops a future change from introducing a bare-specifier import, a
CDN dependency or a required build step, silently breaking that property
for every school.

## Proposed Design

Make this an explicit, permanent invariant of the theme/template/instances
chain:

- `slides/` is viewable by running `npx serve` (or any equivalent static
  file server), with no install and no build step.
- Slide markup, `scripts/slides.js` and CSS/asset references use only
  relative paths and standard ES module imports a browser resolves
  natively.
- The theme package under `slides/web_modules/sfeir-school-theme/` is the
  only "external" dependency. It is served as plain files from disk, never
  fetched from a CDN at slide runtime.
- In the template and in every school, `slides/web_modules/` is
  **committed to git**. This is intended, not an oversight: it is what
  lets a fresh clone open with zero install.
- The deck's `prepare` script (in `slides/package.json`) refreshes
  `slides/web_modules/` from the installed `sfeir-school-theme` package on
  `npm install`, `dist/adr` included.

## Considerations

- **Should this constrain how `sfeir-school-theme` itself is built?** No.
  This ADR governs the consumption side (`slides/`) only. The theme may use
  any build tooling to produce `dist/`, as long as the output is plain,
  static, browser-consumable files.
- **Gitignore `web_modules/` like a usual dependency folder, restored by a
  package manager.** Rejected: a fresh clone would need an install step
  before it can be viewed, which breaks the invariant.
- **Enforcing it automatically.** Desirable (e.g. a check rejecting
  bare-specifier imports or `<script src="https://...">` in slide files),
  but left as follow-up. Until then the invariant is enforced in review.

## Decision

- The self-contained, zero-install, "`npx serve` just works" property of
  `slides/` is a permanent architectural invariant.
- No dependency on Nx, Vue, a framework CLI, or any dev-server-only feature
  is allowed inside `slides/`.
- `slides/web_modules/` is committed in the template and in every school;
  it is not gitignored.
- An automated CLI check enforcing this is follow-up work. Until it lands,
  the invariant is enforced in review.

## Other Related ADRs

- [[theme-0002-slides-and-docs-directories]] - defines the directory this invariant applies to
- [[theme-0016-minimal-tooling-footprint]] - extends the same default-no posture to the rest of the project

## References

- [`README.md`](../../README.md) - "Link" section: the relative imports a deck uses
- [sfeir-school-template](https://github.com/sfeir-open-source/sfeir-school-template) - commits `web_modules/` and refreshes it in its npm `prepare` script
