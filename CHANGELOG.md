# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project follows Semantic Versioning, with an annotated git tag per
published version — see
[theme-0013](docs/adr/theme-0013-semver-and-git-tags.md).

## [Unreleased]

### Changed (breaking)

- **Relicensed from MIT to Apache-2.0.** `LICENSE` is now the Apache-2.0
  text, matching `package.json`. See
  [theme-0015](docs/adr/theme-0015-opensource-license.md).
- **`docs/` → `slides/`** in `sfeir-school-template` and every
  `sfeir-school-xxx` school: `slides/` holds the whole deck (`index.html`
  and the deck `package.json` included), `docs/` holds ADRs and other
  project documentation. See
  [theme-0002](docs/adr/theme-0002-slides-and-docs-directories.md).
- **`steps/` → `labs/`.** Config keys `stepCommandPrefix` and
  `ignoreStepsDirectories` in `.sfeir-theme-config.json` become
  `labCommandPrefix` and `ignoreLabsDirectories`. See
  [theme-0003](docs/adr/theme-0003-labs-directory.md).
- `check` validates `slides/` and `labs/` instead of `docs/` and `steps/`.
  When `slides/` is missing but `docs/` still holds a deck, `G_002` points to
  `npx sfeir-school-theme-migrate --from=v4 --to=v5`.
- **Lab directory naming is enforced** by the new rule `L_011`:
  `NNN-name-lab` and `NNN-name-lab-solution` (3 digits, kebab-case).
  Directories in `ignoreLabsDirectories` are exempt; a `.nosolution` file in
  the exercise directory still opts out of the solution. Single lab contract:
  [theme-0006](docs/adr/theme-0006-lab-contract.md) (theme-0010 and
  theme-0011 are deprecated in its favour).
- **`S_009` is stricter.** A word in an image title
  (`![](./assets/images/x.png 'my-style')`) must be a talk-control built-in
  style or listed in the `knowStyles` passed to `SfeirThemeInitializer.init()`
  in `slides/scripts/slides.js` (read by the CLI), and be defined in a known
  stylesheet. Classes are matched exactly, not as substrings. Exception:
  talk-control icon and QR-code titles (`tc-icons …`, `tc-qrcode`) are
  applied as classes by talk-control itself, so their words only need to be
  defined in a known stylesheet, not registered. See
  [theme-0008](docs/adr/theme-0008-slide-css-class-allowlist.md).
- **`sfeir-school-theme-migrate` no longer runs every transition by
  default.** `--from` and `--to` select one transition; a single `--from` or
  `--to` selects the transitions starting or ending there. With no flag it
  prints its usage and exits with code 1; unknown arguments are rejected.
- **ADR files carry their tier prefix**: `theme-NNNN-slug.md` here,
  `template-NNNN-…` in the template, `<xxx>-NNNN-…` in a school. Precedence
  follows the prefix: theme > template > school. See
  [theme-0000](docs/adr/theme-0000-adopt-adrs.md).

### Removed

- `G_003` ("`labs/` exists"): `labs/` is optional. A training without labs
  has no `labs/`, and the `L_0xx` rules are skipped. See
  [theme-0009](docs/adr/theme-0009-labs-as-npm-workspaces.md).

### Added

- `G_004` accepts either `CONTRIBUTION_GUIDE.md` or `CONTRIBUTING.md` at
  the project root.
- `G_005` (warning): an unknown key in `.sfeir-theme-config.json` is
  reported; a pre-v5 key names its replacement. Accepted keys:
  [theme-0012](docs/adr/theme-0012-bounded-config-overrides.md).
- `ignoreCommandCheck` config key: lab slides with no command to run skip
  `S_005`/`S_011` (#161).
- `sfeir-school-theme-migrate --help`, and named version transitions:
  `v3 -> v4` (content syntax) and `v4 -> v5` (layout).
- The `v4 -> v5` transition seeds, without overwriting an existing file:
  - `docs/adr/theme-0000-adopt-adrs.md` and
    `docs/adr/theme-0001-comply-with-theme-adrs.md`, copied as-is from the
    theme's published `dist/adr/`;
  - `LICENSE` (Apache-2.0) when no license file exists, and
    `LICENSE-CONTENT` (CC BY-ND 4.0) for slides and learner material,
    unless the school's `docs/LICENSE` already provides it.
- `sfeir-school-theme-cleanup` targets `slides/`, falling back to a legacy
  `docs/` with a warning to migrate.
- The theme's ADRs (`docs/adr/`) are published as `dist/adr/`, read
  downstream under `slides/web_modules/sfeir-school-theme/dist/adr`. ADRs
  `theme-0000` to `theme-0016` cover ADR practice, project layout, the CLI
  check contracts, config overrides, versioning, commits, licensing and
  tooling.

### Fixed (found while reviewing this release)

- The `v4 -> v5` migration moved only part of the deck (`scripts/`,
  `markdown/`, `assets/`, `css/`, `web_modules/`), leaving `index.html` and
  the deck `package.json` in `docs/` and breaking the migrated deck. It now
  moves everything in `docs/` except `docs/adr/`.
- The `v3 -> v4` content migration rewrote `docs/adr/*.md` as slides. It now
  skips `docs/adr/`.
- `S_009` skipped an image title followed by an `<!-- .element … -->`
  comment on the same line. The title is now checked.
- The reworked `S_009` rejected talk-control icon and QR-code image titles
  (`![](clock 'tc-icons feather tc-big')`, `![](url 'tc-qrcode')`). Their
  words are now checked against the known stylesheets only.

### Migrating an existing project

Run from the project root (or its `slides/` or `docs/` directory), one
transition at a time:

- **v4 project** (deck in `docs/`, labs in `steps/`):

  ```sh
  npx sfeir-school-theme-migrate --from=v4 --to=v5
  ```

- **v3 project**: first the content syntax, then the layout:

  ```sh
  npx sfeir-school-theme-migrate --from=v3 --to=v4
  npx sfeir-school-theme-migrate --from=v4 --to=v5
  ```

Never re-run `--from=v3 --to=v4` on a v4 project: it rewrites image alt text
(`![alt](src)`) into image titles (`![](src 'alt')`), which then fail `S_009`.

The `v4 -> v5` transition:

1. Moves `docs/LICENSE` (the school's content license, usually CC BY-ND
   3.0) to the root `LICENSE-CONTENT` unchanged, when `LICENSE-CONTENT` does
   not exist yet; otherwise leaves it in `docs/` and warns.
2. Moves everything else in `docs/` into `slides/`, except `docs/adr/`: the
   whole deck moves, `index.html`, `package.json` (with its `prepare`
   script), `scripts/`, `markdown/`, `assets/`, `css/`, `web_modules/` and
   any other deck file included.
3. Renames `steps/` to `labs/`.
4. Renames `stepCommandPrefix`/`ignoreStepsDirectories` to
   `labCommandPrefix`/`ignoreLabsDirectories` in `.sfeir-theme-config.json`,
   if present.
5. Seeds `docs/adr/` with `theme-0000-adopt-adrs.md` and
   `theme-0001-comply-with-theme-adrs.md`, as-is.
6. Seeds `LICENSE` and `LICENSE-CONTENT` when absent; an existing one is
   never overwritten.

Then rename lab directories to `NNN-name-lab` / `NNN-name-lab-solution`
(`L_011`; not automated), update `labs.json` or `labs/package.json` and the
lab slides accordingly, and run `sfeir-school-theme check`. Review the diff
before committing: there is no compatibility mode in `check`.

These are breaking changes to the CLI's file-structure contract: per
[theme-0013](docs/adr/theme-0013-semver-and-git-tags.md) they ship as a
major version bump, with a matching annotated git tag. Prereleases switch to
the `-rc.N` format with this version line, starting at `5.0.0-rc.0`.
