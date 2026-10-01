# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
project follows Semantic Versioning. Release notes for versions before this file existed
are on the [wiki](https://github.com/sfeir-open-source/sfeir-school-theme/wiki/Releases-Notes).

## [Unreleased]

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
