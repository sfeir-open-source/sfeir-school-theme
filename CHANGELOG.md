# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
project follows Semantic Versioning, with an annotated git tag per published version —
see [theme-0013](docs/adr/theme-0013-semver-and-git-tags.md). Release notes for versions
before this file existed are on the
[wiki](https://github.com/sfeir-open-source/sfeir-school-theme/wiki/Releases-Notes).

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

### Charte 2026 — the SFEIR 2026-2027 identity (target: 5.0.0)

Study, decisions and shipped values: `docs/charte-2026/`. No downstream deck breaks:
every v4 class and token name keeps resolving until v6.

#### Added

- **Photo backgrounds.** Nine WebP photos from the official material in
  `dist/images/backgrounds/` (≈ 1.27 MB), mapped onto slide classes by the initializer:
  `bg-plaster` (light, opt-in; content slides stay on a flat Blanc Craie), `bg-dust`, `bg-arc`,
  `bg-rock`, `bg-flecks`, `bg-bokeh`, `bg-brown`, `bg-sand`, `bg-pour`, plus the opt-in
  `bg-overlay` scrim. A flat `#181A1F` / `#F9F9F9` fallback sits under every photo.
  Provenance in `dist/images/manifest.json`.
- **Three-layer design tokens** (`tokens/_palette.scss`, `_semantic.scss`,
  `_context.scss`, `_legacy.scss`, `_selectors.scss`): slides read roles
  (`--sfeir-accent`, `--sfeir-accent-fill`, `--sfeir-surface`, `--sfeir-on-surface`,
  `--sfeir-glass`, …) that resolve per program (`data-theme`) and per surface polarity.
- **Glass and shape tokens**: `--sfeir-glass-dark` `rgb(23 26 32 / 0.7)`,
  `--sfeir-glass-light` `rgb(255 255 255 / 0.41)`, `--sfeir-overlay`
  `rgb(24 26 31 / 0.55)`, `--sfeir-radius: 12px`, `--sfeir-radius-pill: 999px`.
- **Utilities** (`theme/utilities.scss`): `eyebrow`, `stat`, `stat-label`, `chip`,
  `chip-filled`, `glass`, `pull-quote`, `separator`.
- **Type tokens**: Epilogue, Space Grotesk and JetBrains Mono as variable WOFF2 (289 KB,
  SIL OFL), a type scale (`--sfeir-fs-caption` 26 px … `--sfeir-fs-stat` 208 px, with
  `--sfeir-fs-eyebrow` 32 px, `--sfeir-fs-title-dense` 61 px, `--sfeir-fs-display`
  133 px), weights (`--sfeir-weight-display: 800`, `--sfeir-weight-stat: 500`) and
  tracking tokens.
- **Brand highlight palette** for code (`utils/code.scss`): every token colour computed
  against the dark code block, replacing the vendored Tomorrow theme and its 1.9–3.8:1
  failures.
- **Official logo set** in `dist/images/logos/`: corporate wordmark and burger mark
  (SVG, PNG, WebP; grey, white, black), and the official SFEIR Institute lockup
  (`logo-institute-{grey,white}.{svg,png,webp}`).
- **Playwright visual harness** (`tests/visual/`): `npm run test:visual`,
  `test:visual:quick`, `test:contrast`, `test:visual:update`; chromium at 1920 × 1080,
  per slide and per program, plus a WCAG contrast audit. `serve:ci` serves the demo on
  port 4243, clear of `npm run serve` on 4242. Baselines are local artefacts, not
  committed.
- **Demo**: `25_charte_2026.md` (utilities) and a photo-background showcase in
  `20_specifics_slides.md`; the demo exposes `window.Reveal` for the harness.

#### Changed

- **Palette values** follow the official theme: dark ink and dark fill `#181A1F`, copper
  `#E4AA5D` (fills, numerals, accent on dark), `#FEB95C`, wash `#F0C387`, separator
  `#CCC4B6`, muted ink on light `#514536`. Accent text on light surfaces is `#845400`
  and body text stays 40 px — two deliberate, documented training-room deviations.
- **Program identity**: Institute is the corporate copper; School carries an Émeraude
  signature (`#0D5A2E` on light, `#6BC68F` on dark) on eyebrows, markers, underlines,
  transition lines and level chips only. Fills, photos, cards and table headers
  (`#000000`) are identical in both programs.
- **Cover** (`first-slide`): gold-dust photo; composed program lockup top-left; eyebrow
  `[ SFEIR SCHOOL | TECHNO ]` drawn from `sfeir-techno`; `sfeir-level` as 1–3 pill chips;
  title in Epilogue 800 at 136 px bottom-left; wordmark and tagline bottom-right.
- **Marks**: every slide carries the composed program lockup bottom-left (36 px,
  `[sfeir] School` or `[sfeir] Institute`); the cover shows the wordmark and tagline
  instead. `conf` shows neither.
- **Transition**: gold-arc photo, title bottom-left at 133 px.
- **Speaker slide**: dark glass card on the slate-rock photo with its own ink pair; name
  in Epilogue 800, role and handles in Space Grotesk caps; no banner, no shadows.
- **Quote slide**: glass blockquote, typographic opening glyph in copper; no shadow.
- **Code**: JetBrains Mono on a dark block (`#181A1F` on light slides, `#000000` on dark
  ones), rounded at `--sfeir-radius`; inline code follows. `with-code-dark` slides sit on
  the slate-rock photo and talk-control's `--tc-code-dark-background` reads the code
  surface.
- **Exercice slide**: the 25 % band is the sand-pour photo, sized by CSS.
- **Fonts**: Poppins, Consolas and Inconsolata (25 TTF, 4.1 MB) replaced by the three
  OFL families.
- `npm start` now builds before preparing the demo (`prestart`).
- **Reference material** (official theme and master pptx, logos, background photos) moved
  to `design/`, outside the published package (`docs/` ships in the npm tarball);
  `design/README.md` lists what was not shipped and why.
- `.gitignore`: Playwright output folders and the heavy brand binaries under `design/`.

#### Deprecated

Reported by `sfeir-school-theme check`, removed in 6.0.0:

- Tokens `--sfeir-green`, `--sfeir-blue` (→ `--sfeir-accent`), `--sfeir-orange`,
  `--sfeir-pink` (→ `--sfeir-accent-fill`), `--black`, `--dark-grey`, `--medium-grey`,
  `--light-grey`, `--white`, `--code-bg`, `--red`.
- Classes `blue` / `green` (no-op), `bg-white` / `bg-blue` / `bg-green` / `bg-pink`,
  `transition-bg-green-1..6`, `transition-bg-green-blur`, `transition-bg-blue-1..3`,
  `transition-bg-blue-blur` — each resolves to one of the new photos.

#### Removed

- Fifteen v4 raster images: `exercice_logo`, `logo-email`, `logo-institute-dark` /
  `-white`, `logo-school-dark-3` / `-grey` / `-white` / `-white-3`, `logo-schoolwhite-2`,
  `logo-twitter-big` / `-small`, `logo_empty`, `logo_sfeir_burger`, `quotes`, `star`
  (all `.webp`).
- The inline `linear-gradient` the plugin injected on exercice slides
  (`_manageExerciceSlide`), and with it the last `data-theme` branch in
  `sfeir-theme-plugin.ts`.
- The eight `--sfeir-*-stop-N` gradient tokens (no replacement: the identity has no
  gradients).
- Tokens `--dark-grey-alpha` and `--sfeir-carbone-mid` (no reader left; the official
  scheme has no mid-dark surface, glass plays that part), the unused
  `--sfeir-accent-on-light` role, and the dead `sfeir-basic-slide` rules.
- The commented highlight.js override example in `sfeir-school-theme.scss`; the brand
  palette in `utils/code.scss` replaces it.
