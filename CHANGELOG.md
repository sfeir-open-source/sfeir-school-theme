# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project follows Semantic Versioning — see
[ADR-0013](docs/adr/0013-semver-and-git-tags.md).

## [Unreleased]

### Changed (breaking)

- **`docs/` renamed to `slides/`** in `sfeir-school-template` and every
  `sfeir-school-xxx` instance. `docs/` is now reserved for ADRs and other
  project documentation. See
  [ADR-0002](docs/adr/0002-rename-docs-to-slides.md).
- **`steps/` renamed to `labs/`.** Config keys `stepCommandPrefix` and
  `ignoreStepsDirectories` in `.sfeir-theme-config.json` are renamed to
  `labCommandPrefix` and `ignoreLabsDirectories`. See
  [ADR-0003](docs/adr/0003-rename-steps-to-labs.md).
- The `check` command now validates `slides/` and `labs/` instead of
  `docs/` and `steps/` (`G_002`, `G_003`, and every path used by the
  `S_0xx`/`L_0xx` rules). `cli/README.md` is updated to match.

### Added

- `sfeir-school-theme-migrate` now models its work as named version
  transitions: the existing content rules are `v3 -> v4`, and a new
  `v4 -> v5` transition performs the `docs/` → `slides/`, `steps/` →
  `labs/`, and config-key structural migration. With no flags, every
  transition runs in order; `--from=vX --to=vY` targets one transition
  explicitly (e.g. `--to=v5` to run only the structural migration). See
  "Migrating an existing project" below.
- After moving `docs/`'s slide content to `slides/`, the `v4 -> v5`
  transition always ensures a `docs/adr/` exists (creating it if needed)
  and seeds it — without ever overwriting an existing file, and
  renumbering each seeded ADR's filename and title to the next available
  number in the destination project — with this theme's own
  `0000-adopt-adrs.md` and `0001-comply-with-theme-adrs.md` (the latter
  states that the project must follow every ADR published under
  `web_modules/sfeir-school-theme/dist/adr` for its pinned theme version).
  Both are sourced from this repo's own published `dist/adr/`, like every
  other ADR here.
- `sfeir-school-theme-cleanup` now targets `slides/` first, falling back to
  a legacy `docs/` (with a warning to run the migration) for projects that
  haven't migrated yet.
- The theme's own ADRs (`docs/adr/`) are now published as a top-level
  `dist/adr/` on every build, consumed by downstream tiers via
  `web_modules/sfeir-school-theme/dist/adr`. See
  [ADR-0000](docs/adr/0000-adopt-adrs.md).
- Adopted Architecture Decision Records: `docs/adr/0000-adopt-adrs.md`
  through `0014-commit-and-branch-convention.md` — `0001` is the
  "comply with the theme's ADRs" decision seeded into every migrated
  project right after `0000`; the rest cover the `slides`/`labs` rename,
  the CLI's existing (previously undocumented) check contracts,
  per-project config, and versioning/commit conventions.

### Migrating an existing project

Run `npx sfeir-school-theme-migrate` from the project root (or from inside
its `docs/` directory) to run every known transition in order, or target
one explicitly with `--from=vX --to=vY` (e.g. `--to=v5`). The `v4 -> v5`
structural transition will, in order:

1. Move the slide-deck content found in `docs/` (`scripts/`, `markdown/`,
   `assets/`, `css/`, `web_modules/`) into a new `slides/`, leaving
   anything else already in `docs/` untouched.
2. Rename `steps/` to `labs/`.
3. Rename `stepCommandPrefix`/`ignoreStepsDirectories` to
   `labCommandPrefix`/`ignoreLabsDirectories` in
   `.sfeir-theme-config.json`, if that file exists.
4. Ensure `docs/adr/` exists and seed it with `0000-adopt-adrs.md` (copied
   from the theme) and `0001-comply-with-theme-adrs.md` (new), never
   overwriting a file that's already there.

The `v3 -> v4` transition then runs its existing content-migration rules
against `slides/`, unchanged.

Review the diff before committing — this rewrites your project's layout.
No compatibility mode is kept in the `check` command (see ADR-0002/0003's
Considerations): a project must be migrated to pass `check` again.

This is a breaking change to the CLI's file-structure contract; per
[ADR-0013](docs/adr/0013-semver-and-git-tags.md) it should ship as a major
version bump, with a matching annotated git tag once released.
