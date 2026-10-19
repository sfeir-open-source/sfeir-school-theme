# Charte 2026 — Reference material analysis (2026-10-01 delivery)

Analysis of the official 2026-2027 material delivered on 2026-10-01, compared with the
`sfeir-brand-guidelines` skill (v2026.1) and with our own `02-token-mapping.md` /
`04-open-decisions.md`. Rule applied throughout: **when the delivered files and the skill
disagree, the delivered files win.**

## 1. Sources

| Source                                                                                   | What it is                                                                                                                   |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `design/charte-2026/Theme SFEIR 26_27.pptx`                                                | Official theme. Google Slides export (`Google Shape;…`, `.fntdata` fonts). 1 slide, 1 master, 32 layouts, 12 media.          |
| `design/charte-2026/GROUPE SFEIR MasterPrez .pptx`                                         | Master presentation on that theme. 51 slides, 35 layouts, 158 media. Same theme XML (`Theme SFEIR 26`).                      |
| `…/Nouvelle Charte Graphique Groupe SFEIR 2026-2027/LOGOS/` (15 files)                   | Corporate wordmark, compact "burger" mark, **SFEIR Institute lockup (2020)**, WENvision (ignored), one app icon (ignored).   |
| `…/Nouvelle Charte Graphique Groupe SFEIR 2026-2027/FONDS/` (10 files)                   | Background photos, 4368–8832 px wide, 2.7–40 MB each.                                                                        |
| `…/Tagline.png`, `…/Bannières linkedin.png`                                              | Cover art: wordmark + "Sharp Tech. Real Impact." on the gold-dust photo.                                                      |
| `~/.claude/plugins/cache/sfeir-plugins/sfeir-brand-guidelines/1.0.0/skills/sfeir-brand-guidelines/SKILL.md` | The skill. Bundles only `logo-sfeir-white.png` and `logo-sfeir-grey.png`.                                    |

Slide size in both decks: 9 144 000 × 5 143 500 EMU = **10 × 5.625 in**, as assumed in
`02-token-mapping.md` §6 (1 pt = 2.667 px at 1920 × 1080).

Working files (not committed): unzipped XML under `scratchpad/pptx/{theme,master}/`,
renders under `scratchpad/thumbs/` (per-slide PNGs, contact sheets `sheet-*.png`, one
render per theme layout under `thumbs/theme-layouts/`).

## 2. PPTX theme — colours and fonts

`ppt/theme/theme1.xml` (Theme deck) and `ppt/theme/theme2.xml` (MasterPrez) are the same
scheme, named **`Theme SFEIR 26`** (clrScheme name `Simple Light`).

| Slot       | Hex       | Observed role in the decks                                                            |
| ---------- | --------- | ------------------------------------------------------------------------------------- |
| `dk1`      | `#181A1F` | **Dark ink** on light surfaces, dark fills (cards, badges). 438 hard-coded uses.      |
| `lt1`      | `#F9F9F9` | Light ink on dark surfaces; theme "light" (= Blanc Craie). 422 hard-coded uses.       |
| `dk2`      | `#000000` | Flat black, used on shapes/cards; never as a slide background.                        |
| `lt2`      | `#FFFFFF` | White cards / insets.                                                                 |
| `accent1`  | `#E4AA5D` | **The copper accent** — eyebrows, numerals, bullets, section numbers, on both polarities. |
| `accent2`  | `#181A1F` | duplicate of `dk1`.                                                                   |
| `accent3`  | `#F0C387` | Pale copper tint (3 uses).                                                            |
| `accent4`  | `#FEB95C` | Light copper (= skill's Cuivre Clair ±1).                                             |
| `accent5`  | `#B3A495` | Warm taupe — captions ("Références") on light.                                        |
| `accent6`  | `#CCC4B6` | Warm light grey — separators on dark (hard-coded as `#CCC4B5` 34×).                   |
| `hlink`    | `#3B5255` | Dark teal hyperlink (3 uses).                                                         |
| `folHlink` | `#0097A7` | unused.                                                                               |

**Not in the scheme and absent from both decks: `#845400` (Cuivre), any expertise-family
colour, `#303030`, `#514536` (1 use), `#D6C3B1`, `#847564`.**

Font scheme is the Google Slides default (`major`/`minor` = Arial) — meaningless. The real
fonts are the embedded ones (`ppt/fonts/*.fntdata`) and the run-level `typeface`s:

| Typeface (as named in XML)                                              | Runs in MasterPrez slides | Role                                                   |
| ----------------------------------------------------------------------- | ------------------------: | ------------------------------------------------------ |
| `Epilogue`                                                              | 5 260                     | body, titles (with `b="1"`)                            |
| `Epilogue SemiBold` / `ExtraBold` / `Medium` / `Light`                  | 388 / 260 / 40 / 16       | display titles are **ExtraBold (800)**, not Black 900  |
| `Space Grotesk` / `Space Grotesk Medium` / `Light`                      | 744 / 100 / 4             | eyebrows, labels, numerals, tagline                    |
| `Poppins` / `Poppins Medium` / `Poppins SemiBold`                       | 56 / 200 / 52             | **legacy residue** (partner-logo captions, a few labels) |
| `Arial`, `Calibri`                                                      | 117 / 20                  | export noise                                           |
| JetBrains Mono (or any monospace)                                       | 0                         | **absent**                                             |

## 3. Masters and layouts

Single master `slideMaster1.xml` (`simple-light-2`) in both decks:

- Background: `schemeClr lt1` **plus a full-bleed picture** `AdobeStock_1500236871.jpeg`
  (white plaster texture) at `(0, 0, 10.00 × 5.62 in)`. Every light slide is therefore
  textured, not flat.
- Compact burger mark (`[≡]`, grey, 504 × 445 px source) bottom-left at
  `(0.15, 5.30) 0.19 × 0.17 in`, cropped `t=20% b=30%`.
- Title placeholder `(0.49, 0.49) 9.02 × 0.63 in`, **Epilogue ExtraBold 28 pt, dk1**.
- Body placeholder `(0.49, 1.26) 9.02 × 3.88 in`, Epilogue 16 pt lvl1 / 10 pt deeper, dk1.
- Slide number bottom-right `(9.51, 5.14)`, Epilogue 9 pt.

Layout families (Theme deck, 32; MasterPrez adds 3 variants). Names are Google Slides
defaults, so the semantics come from the geometry:

| Layout (file)                                     | Archetype                     | Background                                               | Key placeholders / fixed shapes                                                                                |
| ------------------------------------------------- | ----------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `TITLE` (L1)                                      | Cover                         | photo `AdobeStock_1111949534` (gold dust), full bleed    | centred white wordmark 4.00 × 1.42 in, tagline "Sharp Tech. Real Impact." Space Grotesk Medium 16 pt `#F9F9F9`  |
| `TITLE_2` (L2)                                    | Cover, titled                 | same photo                                               | `ctrTitle` 52 pt lt1 left `(0.49, 0.67) 7.21 × 2.32`; wordmark bottom-right 1.58 × 0.56; tagline 12 pt          |
| `TITLE_AND_TWO_COLUMNS_2_2` (L3)                  | Agenda ("Sommaire")           | plaster left, dark rock photo right panel                | 28 `subTitle` slots as a two-column TOC; "[ ACCÈS DIRECTS ]" panel                                              |
| `TITLE_AND_TWO_COLUMNS_1_1` (L4)                  | Section divider               | photo `AdobeStock_1964989013` (gold arc) left 7.18 in    | title **50 pt lt1** bottom-left of the photo; right 2.8 in strip of plaster with 3 `subTitle` chapter lines    |
| `SECTION_HEADER` (L5), `TITLE_1` (L6)             | Statement / centred title     | plaster                                                  | title 30–36 pt, centred                                                                                          |
| `TITLE_AND_BODY`, `_TWO_COLUMNS`, `ONE_COLUMN_TEXT`, `TITLE_ONLY`, `MAIN_POINT` (L7–L12) | Content                       | plaster                                                  | eyebrow `subTitle` idx 2: **Space Grotesk 12 pt accent1**; title 30 pt; body 14 pt `●` bullets in accent1        |
| `SECTION_TITLE_AND_DESCRIPTION*` (L13–L15, L19)   | Content with cards            | plaster                                                  | white `#FFFFFF` card 4.35 × 4.17 in right; 4-column cards; L19 adds a copper gradient band                     |
| `BIG_NUMBER` (L17)                                | Stat                          | plaster                                                  | title 60–80 pt centred, subtitle                                                                                 |
| `TITLE_AND_BODY_1`, `_1_1` (L20–L21)              | Dark content                  | photos `AdobeStock_2017205393-b` / `2009521782` (dark rock) | title 30 pt lt1, body lt1 12–14 pt, eyebrow accent1, slide number lt1                                           |
| `TITLE_AND_TWO_COLUMNS_1*` (L22–L24)              | Split content                 | plaster left, photo right half (gold arc / bokeh / sand) | title + body left                                                                                                |
| `TITLE_AND_TWO_COLUMNS_2_1_1` (L25)               | Split, dark                   | photo left 3.6 in; dk1 + `#000000` blocks right          | title 30 pt lt1 on photo, two body blocks on black                                                               |
| `SECTION_TITLE_AND_DESCRIPTION_1_1_1_*` (L26–L29) | Card grids                    | plaster or dark rock                                     | 3–6 cards, each a **cropped photo** (plaster / rock / gold) carrying its own body text                           |
| `BLANK_1`, `BLANK_1_1` (L30–L31)                  | Dark blank                    | dark rock photos                                         | burger mark only                                                                                                 |
| `BLANK_1_1_1` (L32)                               | Closing                       | gold dust photo                                          | "Merci." **Epilogue bold 80 pt `#F9F9F9`** `(0.47, 1.65)`, email 18 pt, wordmark bottom-right + tagline          |

Observations that matter for CSS:

- **No gradient or colour overlay on any background photo.** Text sits directly on the
  photo in `#F9F9F9`; legibility comes from choosing dark photos and from cropping
  (`srcRect`) to the darkest region.
- **Cards on photos are translucent "glass":** `roundRect` `#171A20` at **69.6 % alpha**
  (10×), `#FFFFFF` at 41 % (8×) and 18 % (5×), `#F6F6F6` at 75 % (4×), `#000000` at 50 %
  (3×). 86 `roundRect` + 37 `ellipse` shapes across the 51 slides — **rounded corners and
  circular badges are part of the identity**, contrary to the skill's "radius = 0".
- Eyebrow: Space Grotesk 12 pt, `accent1`, typed in caps, **no `spc` tracking set**,
  separator ` | ` (`FOCUS CAS CLIENTS | NÉO-BANQUE (2026)`) or bracket labels
  (`[ UNE MISSION ]`, `[ PROCHAINE ÉTAPE ? ]`).
- Trailing accent dot is **not** copper ("Merci." is all `#F9F9F9`).
- LibreOffice rendered several titles in a serif: the named faces `Epilogue Light/SemiBold`
  are not installed locally, so the thumbnails under-represent the brand on those runs.

## 4. Archetypes seen in MasterPrez (51 slides)

| #     | Layout                                      | Content                                               | Background                                                |
| ----- | ------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| 1     | TITLE                                       | Cover: wordmark + tagline                             | photo gold dust (`image6.jpg` = `AdobeStock_1111949534`)  |
| 2     | TITLE_AND_TWO_COLUMNS_2_2                   | Agenda, 7 entries with page numbers + direct links    | plaster + dark rock panel                                 |
| 3, 7, 11, 19, 25, 41 | TITLE_AND_TWO_COLUMNS_1_1            | Section dividers ("Ce que nous défendons", "L'ADN…", "Vélocité X Qualité", "Nos métiers", …) | gold arc photo left, plaster strip right |
| 4     | TITLE_AND_TWO_COLUMNS_1                     | Mission + 3 pillars, 3 icon rows on dark              | plaster left / dark rock right                            |
| 5, 6  | SECTION_TITLE_AND_DESCRIPTION(_1)           | Conviction / Vision statements, white card            | plaster                                                   |
| 8     | ONE_COLUMN_TEXT_1                           | Group structure: WEnvision / SFEIR / Drivers / Institute (hyperlinks) | dark rock photo                              |
| 9     | BLANK                                       | Key figures (850, 8, 130M€, +6 000, +90) + Europe map | plaster left, dark photo right                            |
| 10    | BLANK                                       | Partner ecosystem logo cloud                          | plaster                                                   |
| 12–14 | BLANK_1 / TITLE_AND_TWO_COLUMNS_1           | 10x method: effort inversion bars, software factory arc, SDLC/PDLC | dark rock / split                            |
| 15    | SECTION_TITLE_AND_DESCRIPTION_1_1_1_1_1_1   | 3 new expert roles — dark cards, circle badges CTA/GSA/CSI | plaster                                              |
| 16    | TITLE_AND_TWO_COLUMNS_2_1                   | 3 Drivers (RAISE / LAZ / DAZ) with circle badges      | gold photo left, black blocks right                       |
| 17    | SECTION_TITLE_AND_DESCRIPTION_1_1           | Guarantees, 4 white cards with line icons             | plaster                                                   |
| 18    | SECTION_TITLE_AND_DESCRIPTION_1_1_1_3       | Sovereignty, 4 photo cards                            | dark rock                                                 |
| 20    | TITLE_AND_TWO_COLUMNS_1_2                   | WEnvision offer, screenshots                          | plaster / gold sand right                                 |
| 21    | CAPTION_ONLY                                | **SFEIR Institute** offer — uses `Logo_SFEIR-Institutes_Gris_2020 (3).png` 2.97 × 0.73 in; 4 photo cards | plaster              |
| 22    | TITLE_AND_BODY_1                            | SFEIR Drivers / RAISE, 5 columns                      | dark rock, gold panel                                     |
| 23    | SECTION_TITLE_AND_DESCRIPTION_1_1_1_1       | Ambition, 3 photo cards                               | dark rock                                                 |
| 24    | BLANK_1                                     | 5 expertise domains on a copper arc                   | dark rock                                                 |
| 26, 32, 34, 37, 39 | SECTION_TITLE_AND_DESCRIPTION_1_1_2 | Expertise + 4 client logo cards + copper gradient band | plaster                                                  |
| 27–31, 33, 35, 36, 38, 40 | TITLE_AND_TWO_COLUMNS_1_2_1    | **Case study**: eyebrow `FOCUS CAS CLIENTS | CLIENT (year)`, title 23 pt bold, "L'ambition ? / L'accompagnement ?", right half = gold photo with glass card "RÉSULTATS" | plaster / gold sand or bokeh |
| 42–45 | TITLE_AND_TWO_COLUMNS_1_3                   | Partnerships (Google Cloud, Anthropic, Scaleway, S3NS), timeline, stats in accent1 Space Grotesk 33 pt | plaster / gold photo panel |
| 46    | ONE_COLUMN_TEXT_1                           | "La suite ?" 60 pt                                    | dark rock                                                 |
| 47    | TITLE_AND_TWO_COLUMNS_2                     | 4-step engagement, numbered circles                   | plaster                                                   |
| 48    | TITLE_AND_TWO_COLUMNS_2                     | Today / Tomorrow, half-disc photo mask                | plaster + gold bokeh                                      |
| 49    | SECTION_TITLE_AND_DESCRIPTION_1             | Next step, white card with 3 steps                    | plaster                                                   |
| 50    | SECTION_TITLE_AND_DESCRIPTION_1_1_1_2       | 4 photo cards                                         | dark rock                                                 |
| 51    | BLANK_1_1_1                                 | Closing "Merci." + email + wordmark + tagline         | gold dust photo                                           |

Visual language, from the renders: dark photo slides carry the brand (cover, dividers,
closing, hero statements); light slides are **textured off-white**, never flat; copper is
used as a thin highlighter (eyebrows, numerals, bullets, one gradient band) and as photo
warmth, never as a flat fill; cards are rounded and translucent; the compact `[≡]` mark sits
bottom-left on every slide, the full wordmark only on cover and closing, bottom-right.

## 5. Hard-coded colours (MasterPrez slides, `srgbClr`)

| Hex       | Count | In scheme? | Meaning                                                               |
| --------- | ----: | ---------- | --------------------------------------------------------------------- |
| `#181A1F` |   438 | dk1        | dark ink / dark fills                                                 |
| `#F9F9F9` |   422 | lt1        | light ink / light fills                                               |
| `#171A20` |   164 | no         | **glass card fill** (always with alpha ≈ 70 %); ΔE ≈ 0 from dk1       |
| `#E4AA5D` |   108 | accent1    | copper accent                                                         |
| `#FFFFFF` |    66 | lt2        | white cards                                                           |
| `#000000` |    58 | dk2        | black blocks                                                          |
| `#CCC4B5` |    34 | ~accent6   | warm light-grey separators on dark                                    |
| `#ECB46A` |     6 | no         | copper gradient stop (band under logo cards), 80 % alpha              |
| `#1B1B1B` |     5 | no         | skill's Charcoal — residue                                            |
| `#FFB95C` |     4 | ~accent4   | skill's Cuivre Clair — residue                                        |
| `#212C2E` |     4 | no         | pasted content                                                        |
| `#F6F6F6` |     4 | no         | 75 % white card                                                       |
| `#F0C387` |     3 | accent3    | pale copper                                                           |
| `#514536` |     1 | no         | skill's on-surface-variant — residue                                  |
| 10 singletons (`#FF9A01`, `#1B3562`, `#00ED64`, `#EF4837`, `#FF5B3C`, `#6926AC`, `#00B6EB`, `#27B2AB`, `#635BFF`, `#D1D2F1`) | 1 each | no | partner logos — ignore |

`#E46962` (72–89× in layouts) is the Google Slides **guide** colour (`p15:guide`), not a
palette colour. Layouts otherwise reference the scheme (`lt1` 1 053×, `accent1` 396×).

**The real palette is six values:** `#181A1F`, `#F9F9F9`, `#E4AA5D`, `#FFFFFF`, `#000000`,
`#CCC4B6` — plus the photos.

## 6. Logos inventory

`…/Nouvelle Charte Graphique Groupe SFEIR 2026-2027/LOGOS/`

| File                                   | Px / pt                 | Alpha | Polarity (for…) | Represents                                                     | Vector | Notes                                                                                                   |
| -------------------------------------- | ----------------------- | ----- | --------------- | -------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------- |
| `logo-SFEIR-blanc.png`                 | 1076 × 364 (2.96:1)     | yes   | dark            | Corporate wordmark `[sfeir]`, white                            | —      | ratio matches skill's 3:1                                                                               |
| `logo-sfeir-blanc(1).png`              | 1076 × 364              | yes   | dark            | same, re-export (different hash, identical bbox/pixel count)   | —      | duplicate, ignore                                                                                       |
| `logo-SFEIR-gris.psd`                  | 1076 × 364              | yes   | light           | Corporate wordmark, grey                                       | PSD    | layered source of the grey wordmark                                                                     |
| `Sfeir-Gris-designer.ai`               | 316.5 × 106.3 pt        | —     | light           | Corporate wordmark, grey — **vector**, PDF 1.5 inside, created 2019-10-07 | **yes** | renders with `pypdfium2`; SVG conversion needs `pdftocairo`/Inkscape (neither installed) — see §10 |
| `Sfeir-Gris-designer.png`              | 1319 × 443 (2.98:1)     | yes   | light           | raster of the above, mean `#4C4B5E`                            | —      | the grey is a **cool slate** (2019 identity), not a charte neutral                                      |
| `Logo-Corp_Burger-Gris-Charte.png`     | 504 × 445               | yes   | light           | Compact mark `[≡]`, grey `#4C4B5E`                             | —      | **this is the mark on every pptx slide** (same 504 × 445 geometry as `ppt/media/image1.png`)             |
| `Logo-burger-gris.png`                 | 1645 × 1606             | yes   | light           | Compact mark, grey `#6C6C6C`, large padding                    | —      | only the three bars were visible in our render — check brackets before use                              |
| `logo-burger.png`                      | 1064 × 1044             | opaque | —              | Black rounded square with white `[≡]` — avatar / app icon      | —      | not a slide asset                                                                                       |
| `Logo_SFEIR-Institutes_2020.ai`        | 1084.5 × 267.2 pt (4.06:1) | —  | light           | **`[sfeir] Institute` lockup — vector**, PDF 1.5 inside, created 2020-03-06 | **yes** | the "Institute" word is a 2020-era geometric sans (Poppins-like), not Epilogue                   |
| `Logo_SFEIR-Institutes_Gris.png`       | 1085 × 267              | yes   | light           | Institute lockup, grey `#484A5C`                               | —      | **used in MasterPrez slide 21** as `Logo_SFEIR-Institutes_Gris_2020 (3).png` → still official in 2026    |
| `Logo_SFEIR-Institutes_Blanc_2020.png` | 1085 × 267              | yes   | dark            | Institute lockup, white                                        | —      |                                                                                                         |
| `LOGO_NOIR copy.png`                   | 2084 × 2084             | yes   | —               | "S.D sfeir.dev" app icon                                       | —      | ignore                                                                                                  |
| `logo-wenvision.png`, `WENvision-blanc.png`, `WEnvsion-noir.png` | 892 × 262, 415 × 121, 284 × 177 | mixed | — | WENvision (group consulting brand)                        | —      | ignore                                                                                                  |

Answers to the three questions:

- **Is there a SFEIR School lockup?** No. No file in `LOGOS/`, and the string "school"
  appears **zero** times in either pptx (all XML parts). School is not mentioned in the
  MasterPrez at all; Institute is (slides 8, 18, 19, 21).
- **Is there an Institute lockup?** Yes — vector `.ai` + white/grey PNG. The decision D3
  premise ("no Institute lockup exists") is false.
- **Is it the 2020 one?** Yes (file names and `.ai` creation date 2020-03-06). But the 2026
  MasterPrez still uses it, so it is the *current* official Institute lockup, old as it is.

## 7. Backgrounds inventory

`…/Nouvelle Charte Graphique Groupe SFEIR 2026-2027/FONDS/`. Stats from a 200 px
downsample; "dark %" = pixels with luma < 60/255, "light %" = luma > 190/255.

| File                                        | Px (ratio)         | Mean      | Luma | Dominant (quantised)                                 | Visual                                                     | Verdict                                                                 | In pptx?                                                      |
| ------------------------------------------- | ------------------ | --------- | ---: | ---------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------- |
| `AdobeStock_1111949534 (1).jpg`             | 8832 × 7511 (1.18) | `#110D0D` |  6 % | `#08080C` 31, `#010102` 24, `#382A22` 16             | gold dust / sparks nebula on black                         | **dark + light text, no overlay**. The cover/closing/tagline image      | yes — cover, closing (theme `image8/10`, master `image6/16`)  |
| `AdobeStock_1500236871.jpeg`                | 4368 × 2448 (1.78) | `#E7E8E6` | 91 % | `#E4E4E2` 28, `#EAEBEA` 22, `#DCDDD9` 20             | white plaster / lime-wash texture                          | **light + dark text**. The default light surface                        | yes — **master background** (theme `image14`, master `image7`) |
| `AdobeStock_1575367686.jpeg`                | 6720 × 4480 (1.50) | `#403023` | 20 % | `#1B1614` 28, `#0F0C0C` 25, `#7D532F` 13             | warm bokeh discs on black                                  | dark + light text; keep text away from the discs (luma > 190 = 4 %)     | yes — right panels, cards (theme `image13`, master `image17`) |
| `AdobeStock_1843169200.jpeg`                | 6400 × 3700 (1.73) | `#735733` | 36 % | `#A46F34` 27, `#060606` 25, `#EAC07E` 25             | large soft gold bokeh, bright                              | **needs overlay or glass card** for text (17 % light pixels)            | yes — card photo, half-disc (theme `image17`, master `image11`) |
| `AdobeStock_1964989013.jpeg`                | 6000 × 2850 (2.11) | `#422F19` | 20 % | `#482D12` 23, `#9E774A` 23, `#070503` 22             | gold-lit arc / horizon on black                            | dark + light text in the lower black zone; the **section-divider** image | yes — divider L4 (theme `image7`, master `image13`)           |
| `AdobeStock_2180014338.jpeg`                | 5504 × 3072 (1.79) | `#B0885A` | 56 % | `#A77844` 27, `#C59F6B` 24, `#71431E` 21             | gold sand / glitter, mid-light                             | **needs overlay** (used in pptx only under a 70 % `#171A20` glass card) | yes — case-study right half (theme `image11`, master `image9`) |
| `AdobeStock_1659615049.jpeg`                | 5657 × 2829 (2.00) | `#4A340E` | 21 % | `#0B0301` 30, `#1D0F04` 23, `#916B19` 18             | brushed gold/brass metal, light from the right             | dark + light text on the left half only                                 | no                                                            |
| `AdobeStock_2151501174.jpeg`                | 6700 × 3000 (2.23) | `#7E5E2E` | 39 % | `#D5AC48` 24, `#986A2F` 23, `#2D221C` 22             | gold ribbon swoosh on dark                                 | needs overlay in the swoosh; fine for a hero band                       | no                                                            |
| `AdobeStock_680975112.jpeg`                 | 6850 × 3150 (2.17) | `#37251A` | 16 % | `#2E221C` 26, `#1B1917` 26, `#291D18` 22             | very soft dark-brown / copper blur                         | **dark + light text, safest of all** for dense text                     | no                                                            |
| `front-view-brown-sand-black-surface (1).jpg` | 3737 × 5600 (0.67) | `#040302` | 1 % | `#000000` 80, `#030202` 9, `#271F14` 6               | vertical trickle of sand on black, **portrait**            | dark + light text; needs rotation/crop for 16:9                         | no                                                            |

Two photos used by the pptx are **not delivered** in `FONDS/` and must be requested:
`AdobeStock_2017205393-b.jpg` (dark slate rock — layouts L20/L26/L28/L30, the "dark content"
background) and `AdobeStock_2009521782.jpg` (dark rock with gold flecks — L21/L31, agenda
panel). The pptx embeds them at 2048 px only (`theme/ppt/media/image9.jpg`, `image6.jpg`).

Recipe to reproduce in CSS (what the pptx actually does, and what it does not):

```
dark slide   : background: #181A1F url(photo.webp) center / cover;   /* no overlay, no gradient */
               color: #F9F9F9;  eyebrow/numerals: #E4AA5D
light slide  : background: #F9F9F9 url(plaster.webp) center / cover;  /* textured, not flat */
               color: #181A1F;  eyebrow: #E4AA5D in the pptx (fails AA, see §8)
glass card   : background: rgb(23 26 32 / .70); border-radius: ~12px; (backdrop-filter optional)
light card   : background: #FFFFFF or rgb(255 255 255 / .41 | .18) on photos
separator    : 1px #CCC4B6 on dark
```

The pptx achieves legibility by **photo selection and cropping** (`srcRect` on every pic),
not by overlays. In a training room on a weak projector that is fragile, hence the overlay
option recommended in §10.

## 8. Discrepancies — skill vs pptx vs our token mapping

| Item                           | Skill v2026.1                        | PPTX (wins)                                           | Ours (`02-token-mapping.md`)              | Adopt                                                                                                 |
| ------------------------------ | ------------------------------------ | ----------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Dark ink / on-surface          | Charcoal `#1B1B1B`                   | `#181A1F` (dk1, 438×); `#1B1B1B` 5× residue           | `--sfeir-charcoal #1B1B1B`                | **`#181A1F`** (16.5:1 on `#F9F9F9`)                                                                   |
| Light surface                  | flat Blanc Craie `#F9F9F9`           | `#F9F9F9` **under a plaster photo** on every slide    | flat `--sfeir-craie`                      | keep `#F9F9F9` as colour; add the plaster texture as the default light background (§10)               |
| Dark surface                   | flat Noir `#000000`                  | photos; `#000000` only on blocks; `#181A1F` for fills | flat `--sfeir-noir`                       | `#181A1F` as the flat dark fallback and fill; `#000000` kept for black blocks                         |
| Accent fill                    | Cuivre Poli `#E5A040`                | `#E4AA5D` (accent1, 108×)                             | `--sfeir-cuivre-poli #E5A040`             | **`#E4AA5D`**                                                                                         |
| Accent on dark                 | Cuivre Clair `#FFB95C`               | **`#E4AA5D`** everywhere; `#FEB95C` accent4, 4×       | `--sfeir-cuivre-clair #FFB95C`            | on-dark accent = `#E4AA5D` (8.5:1 on `#181A1F`); `#FEB95C` kept as the lighter tier                   |
| Accent on light (text)         | Cuivre `#845400`                     | `#845400` **absent**; eyebrows on light are `#E4AA5D` (1.95:1, fails AA) | `--sfeir-cuivre #845400`  | keep `#845400` for *text* on light (6.1:1) — documented deviation for projector legibility; `#E4AA5D` for non-text accents |
| Pale copper / wash             | Sable `#FFDDB7`                      | `#F0C387` (accent3)                                   | `--sfeir-sable #FFDDB7`                   | **`#F0C387`**                                                                                         |
| Copper gradient                | none ("gradients are not identity")  | `#E4AA5D → #ECB46A` band, 80 % alpha, 1 archetype     | retired                                   | one optional `band-cuivre` utility; still no gradient backgrounds                                     |
| Warm neutrals                  | Outline `#847564`, Outline-variant `#D6C3B1`, on-surface-variant `#514536` | `#CCC4B6` (accent6/`#CCC4B5` 34×), `#B3A495` (accent5) ; `#514536` 1×, others absent | `--sfeir-outline*`, `--sfeir-charcoal-variant #514536` | separator = **`#CCC4B6`**; muted text on dark = `#CCC4B6` (10:1); `#B3A495` only ≥ 18 pt on light (2.3:1) |
| Glass card                     | tonal layering, no transparency      | `rgb(23 26 32 / .70)` on photos (10×), white 41 %/18 % | `--sfeir-carbone-mid #303030`             | **new `--sfeir-glass-dark: rgb(23 26 32 / .70)`, `--sfeir-glass-light: rgb(255 255 255 / .41)`**; drop `#303030` |
| Radius                         | 0, except pills/avatars              | 86 `roundRect` cards, 37 `ellipse` badges             | `--sfeir-radius: 0`                       | **`--sfeir-radius: 12px`** (cards), `999px` pills — the strict-zero rule is contradicted by the official deck |
| Links                          | Charcoal + Cuivre hover, "never blue" | hlink `#3B5255` dark teal                            | —                                         | `#3B5255` on light (7.9:1); not important for slides                                                  |
| Expertise families             | 8 families                           | **none used**                                         | 8 families, Ocre/Émeraude spent on programs | keep the axis, but see D1                                                                           |
| Display weight                 | Epilogue 900                         | **Epilogue ExtraBold 800**; titles otherwise Epilogue + bold | 900 for display                      | **800**                                                                                               |
| Label font                     | Space Grotesk, +0.06–0.18 em, caps   | Space Grotesk / Medium, caps typed, **no tracking**   | +0.16 em                                  | reduce to ≤ +0.06 em; `|` or `[ ]` as separators, not `·`                                            |
| Mono font                      | JetBrains Mono                       | absent                                                | JetBrains Mono                            | keep (our need, not contradicted)                                                                     |
| Poppins                        | "old font, never"                    | still present (partner captions, a few labels)        | not used                                  | do not adopt; it is residue                                                                           |
| Cover title                    | 44–60 pt, left, asymmetric           | 52 pt left on `TITLE_2`; **centred wordmark + tagline** on `TITLE` | 136 px (= 51 pt)                 | keep 52 pt; cover without title is centred wordmark + tagline, as the pptx                            |
| Section title                  | 36–48 pt                             | **50 pt** on the divider, 30–36 pt centred statement  | 128 px (= 48 pt)                          | 50 pt (≈ 133 px)                                                                                      |
| Content title                  | 24–28 pt                             | **28–30 pt** (master 28, layouts 30); 23 pt bold on dense case studies | 76 px (= 28.5 pt)                | keep 76 px; add a 23 pt (61 px) dense variant                                                         |
| Body                           | 11–12 pt                             | 14 pt lvl1 in layouts; **10 pt** dominant in practice (≈ 330 runs) | 40 px (= 15 pt) deliberate      | keep 40 px (pptx is denser than a training room can afford)                                           |
| Eyebrow                        | 10 pt                                | **12 pt**                                             | 27 px (= 10 pt)                           | 32 px (12 pt)                                                                                         |
| Key stat                       | 60–96 pt, Cuivre Poli                | 80 pt ("Merci."), 33 pt Space Grotesk Medium `#E4AA5D` for figures | 208 px                           | keep 208 px; stat numerals in Space Grotesk Medium `#E4AA5D`, not Epilogue                            |
| Caption                        | 9–10 pt                              | 8–9 pt                                                | 26 px                                     | keep                                                                                                  |
| Logo on slides                 | 3:1 wordmark bottom-left on all      | **compact `[≡]` bottom-left**, 0.19 in; wordmark only on cover/closing, **bottom-right** | 13 WebP marks     | burger mark bottom-left as the per-slide signature; wordmark on cover/closing only                    |
| Trailing accent dot            | copper `.`                           | not used ("Merci." is white)                          | —                                         | drop                                                                                                  |
| Slide number                   | Space Grotesk 8 pt                   | Epilogue 9 pt bottom-right                            | —                                         | Epilogue 9 pt                                                                                         |

Our `02-token-mapping.md` palette layer is therefore wrong on five values (`#1B1B1B`,
`#E5A040`, `#FFB95C`, `#FFDDB7`, `#303030`) and on the radius constant; the surfaces and
type scale are right in principle but the light surface is textured and the display weight
is 800.

## 9. Impact on decisions D1 / D3 / D4

### D1 — Institute = Ocre, School = Émeraude

**Refined, not invalidated.** Two facts from the new material:

1. The official deck uses **no expertise-family colour at all** — it is copper + warm
   neutrals + photos, monochrome by design. "Ocre" for Institute is therefore
   indistinguishable from the corporate accent, which is fine (Institute *is* corporate
   training) but means the Ocre ramp must be re-pointed to the pptx values:
   `primary #E4AA5D`, `medium #FEB95C`, `light #F0C387`, `dark #845400` (ours, for AA text).
2. An Émeraude green has **no support anywhere** in the delivered material. Placed next to
   the gold photography it will read as off-brand, and nothing in the pptx shows how a
   second hue should coexist with copper.

Concrete recommendation: keep the two-program mechanism, but **demote Émeraude to a
"signature" role** — eyebrow colour, `●` bullets, level chips, the 1 px separator — and
never as a fill, background or large numeral; School's dark/light surfaces, photos and
cards stay copper/neutral like Institute. If the brand team rejects even that, the fallback
is the surface-polarity option (D) already in `04-open-decisions.md`: School light-first
(plaster), Institute dark-first (rock), same accent. Either way the program signal on a
slide is carried first by the lockup (D3), then by colour.

Contrast check for the demoted Émeraude: `#6BC68F` on `#181A1F` 8.4:1 (eyebrow on dark
OK), `#0D5A2E` on `#F9F9F9` 7.9:1 (eyebrow on light OK), `#2E8B57` on `#181A1F` 4.1:1
(large text only).

### D3 — Typographic lockups because none existed

**Premise false for Institute; still true for School.**

- Institute: use the official asset. `Logo_SFEIR-Institutes_2020.ai` is a PDF-compatible
  vector; convert once to SVG (needs `pdftocairo -svg` or Inkscape — neither is installed
  here; `brew install poppler` solves it) and ship white + grey variants. It is the lockup
  the 2026 MasterPrez itself uses (slide 21), so it is authoritative despite its 2020 date.
- School: compose it, but **not freely** — mirror the Institute lockup's geometry
  (`[sfeir]` wordmark + program word at ≈ 0.55 × the bracket height, single baseline,
  4.06:1 overall ratio) so the two read as siblings. Note the Institute word is set in a
  2020 geometric sans, not Epilogue; a School word in Epilogue/Space Grotesk will look
  slightly different. The clean fix is a 10-minute job for the brand team: duplicate the
  Institute `.ai`, swap the word. Ask for it; the composed version is the interim.
- The corporate wordmark exists as vector too (`Sfeir-Gris-designer.ai`). Note its grey is
  `#4C4B5E`, a cool slate from 2019; on the warm plaster it is acceptable (the pptx does
  exactly this with the burger mark) but it is not a charte neutral — do not derive tokens
  from it.

### D4 — Level and techno badge

**Confirmed and made easier.** The pptx uses circular badges (`ellipse` `#181A1F` with
white Space Grotesk text — CTA / GSA / CSI) and rounded cards, so pill chips for the level
are squarely in-brand and the radius exception is no longer an exception. Two refinements:
the eyebrow separator should be ` | ` or the bracket form `[ SFEIR SCHOOL | ANGULAR ]`,
not `·`; and the eyebrow sits at 12 pt (32 px), in `#E4AA5D` on dark, `#845400` on light.

## 10. Recommendations

1. **Re-point the palette layer** (`_palette.scss`): `#181A1F` ink, `#E4AA5D` accent,
   `#FEB95C` light accent, `#F0C387` wash, `#CCC4B6` separator, `#B3A495` muted (large
   only); drop `#303030`, `#1B1B1B`, `#E5A040`, `#FFB95C`, `#FFDDB7`, `#D6C3B1`, `#847564`
   as palette values (keep as deprecated aliases if already published).
2. **Add glass tokens** `--sfeir-glass-dark: rgb(23 26 32 / .70)` and
   `--sfeir-glass-light: rgb(255 255 255 / .41)`, and set `--sfeir-radius: 12px`
   (cards), `--sfeir-radius-pill: 999px`. Update the "no radius" tests.
3. **Backgrounds:** ship the six photos the pptx uses as 1920-wide WebP (≈ 150–250 KB
   each): gold dust (cover/closing), plaster (default light), gold arc (divider), bokeh,
   bright bokeh, gold sand (card photos) — and request the two missing rock photos
   (`AdobeStock_2017205393-b`, `AdobeStock_2009521782`) for the dark content archetype.
   Classes: `bg-plaster` (default light), `bg-dust`, `bg-arc`, `bg-rock`, `bg-bokeh`,
   `bg-sand`; each with an optional `bg-overlay` modifier (`rgb(24 26 31 / .55)`) that the
   pptx does not use but a projector needs. Flat `#F9F9F9` / `#181A1F` remain the fallback
   under every photo.
4. **Type:** display weight 800; eyebrow 32 px Space Grotesk, tracking ≤ +0.06 em, caps;
   stat numerals Space Grotesk Medium `#E4AA5D`; divider title 133 px; keep body 40 px.
   Do not add Poppins or JetBrains-Mono-as-label; keep JetBrains Mono for code only.
5. **Marks:** per-slide signature = compact `[≡]` bottom-left (grey on light, white on
   dark); wordmark bottom-right on cover/closing with the tagline "Sharp Tech. Real
   Impact." in Space Grotesk Medium. Convert both `.ai` files to SVG (`brew install
   poppler && pdftocairo -svg`), ship Institute lockup from the official vector, compose
   School on the same geometry and request the official sibling.
6. **D1 follow-up:** re-point Ocre to the pptx values and demote Émeraude to signature
   elements; record the decision revision in `04-open-decisions.md` with the §9 argument.
7. **Legibility deviation, stated once:** the official deck puts `#E4AA5D` text on
   `#F9F9F9` (1.95:1) and 10 pt body everywhere. We keep `#845400` for accent *text* on
   light and 40 px body, and document both as training-room deviations — not as brand
   corrections.

Things not done here: no SVG was produced from the `.ai` files (no `pdftocairo`/Inkscape
on this machine; rasterisation via `pypdfium2` confirmed they are valid single-page vector
PDFs); font rendering in the thumbnails falls back to a serif for the named Epilogue
faces, so weights were read from the XML, not from the renders.
