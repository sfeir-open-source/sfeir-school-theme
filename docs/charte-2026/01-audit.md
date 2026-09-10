# Charte 2026 — Audit of the existing theme

> Baseline: `main` @ `05a677d`, version `4.0.0-rc-16`.
> Target identity: **SFEIR Brand Guidelines — The Sharp Artisan (v2026.1)**, distributed
> as the `sfeir-brand-guidelines` Claude Code skill.

## 1. Scope

The theme dresses RevealJS decks for two programs plus one neutral mode, selected through
the `data-theme` attribute (or URL parameter):

| Mode        | Accent today            | Logo asset                    |
| ----------- | ----------------------- | ----------------------------- |
| `school`    | `--sfeir-green` #0AB580 | `logo-school-{dark,white}-3`  |
| `institute` | `--sfeir-blue` #5155F9  | `logo-institute-{dark,white}` |
| `conf`      | green, logo suppressed  | none                          |

RevealJS runs at a **1920 × 1080 logical viewport** (set by
`@talk-control/talk-control-revealjs-extensions`), with `--r-main-font-size: 40px`.

## 2. Inventory

### 2.1 Source surface

| Area                       | Files | Lines | Notes                                        |
| -------------------------- | ----- | ----- | -------------------------------------------- |
| SCSS                       | 11    | 953   | `src/scss/`, entry `sfeir-school-theme.scss` |
| Theme TypeScript           | 3     | ~200  | initializer, reveal plugin, barrel           |
| Build / publish scripts    | 4     | 562   | includes the V3→V4 migration codemod         |
| CLI (`sfeir-school-theme`) | 29    | —     | `check`, `init-config`, `run`, `explain`     |

### 2.2 Assets

| Asset family    | Count | Weight | Format         |
| --------------- | ----- | ------ | -------------- |
| Fonts           | 25    | 4.1 MB | TTF (unhinted) |
| Images          | 34    | 1.2 MB | WebP + ICO/PNG |
| — backgrounds   | 15    |        | `bg-*.webp`    |
| — logos / marks | 13    |        | `logo-*.webp`  |

Fonts shipped: **Poppins** (15 `@font-face` declarations, weights 100–900 + italics),
**Consolas** (5 files, proprietary — see §4.5), **Inconsolata** (2 files).

### 2.3 Design tokens today

`src/scss/theme/colors.scss` — 29 lines, three groups:

- **Generic**: `--white`, `--black` (#1D1D2A), `--dark-grey` (#56566A), `--medium-grey`,
  `--light-grey`, `--dark-grey-alpha`, `--red`, `--code-bg` (#3F3F3F).
- **Brand**: `--sfeir-pink`, `--sfeir-blue`, `--sfeir-green`, `--sfeir-orange`.
- **Gradient stops**: 8 `--sfeir-*-stop-N` variables (pink, blue, green, orange, blue-green).

There is **no semantic layer**: slides and downstream repos reference hue names
(`var(--sfeir-green)`) directly, not roles. This is the single biggest obstacle to a
palette change.

### 2.4 Where mode-awareness lives

`data-theme` is branched in **16 places** across 6 files:

| File                                    | Occurrences | What it switches                          |
| --------------------------------------- | ----------- | ----------------------------------------- |
| `src/scss/theme/layout.scss`            | 6           | list markers, credits, table header, logo |
| `src/scss/theme/transition-slides.scss` | 4           | transition underline colour               |
| `src/scss/theme/title-slide.scss`       | 2           | first-slide logo, techno badge visibility |
| `src/js/sfeir-theme-plugin.ts`          | 2           | exercice background gradient (inline)     |
| `src/scss/theme/exercice.scss`          | 1           | exercice `h3` colour                      |
| `src/scss/utils/icons.scss`             | 1           | `--tc-icon-color`                         |

Plus `src/js/sfeir-theme-initializer.ts`, whose `mapBackgrounds()` hard-codes 22
class → image mappings, 8 of them conditional on `theme === 'institute'`.

## 3. Target identity — the three commitments

From the skill, condensed:

1. **Intentional asymmetry** — staggered columns, 60/40 or 70/30 splits, never 50/50;
   left-aligned display titles that escape the gutter.
2. **High-contrast interplay** — Noir Carbone `#000000` against Cuivre; copper is a
   highlighter, never wallpaper.
3. **Structural integrity** — Epilogue + Space Grotesk hierarchy; white space is content.

Three enforced rules: **radius 0** (pill chips and avatars excepted), **no box-shadow**
(tonal layering instead), **no blue links**.

## 4. Gap analysis

Severity: **S1** = breaks the brand, must change · **S2** = visibly off-brand ·
**S3** = polish.

### 4.1 S1 — The green/blue differentiation axis no longer exists

The 2026 palette has exactly **one** brand accent: Cuivre (`#845400` / `#E5A040` /
`#FFB95C`). Green and blue survive only as _expertise family_ colours — Émeraude
(Data & Product) and Azur (Digital Workplace) — which the skill reserves for **topics**,
not for programs, and forbids mixing (one family per slide).

Consequence: `school = green` / `institute = blue` cannot be carried over as-is.

**Resolved (D1, accepted 2026-09-10):** the hue axis is restored rather than replaced.
Institute keeps Cuivre; School gets **Bronze** (`#4D662A`, hue 85°) — copper alloyed
with tin, a green derived from the metal rather than chosen beside it. Each Bronze tier
is solved for the measured luminance of its Cuivre counterpart, so both programs share
one contrast rule. Hue 85° is also the only arc more than 50° from all eight families.
Full rationale, ramp and parity table in `04-open-decisions.md`, decision **D1**.

Bronze is a deliberate deviation from the charte's single-accent rule and has to be
submitted to the brand team with that rationale.

Corollary opportunity: the eight expertise families map naturally onto **the deck's
technology**, which is exactly how this theme is consumed (one repository per techno —
`sfeir-school-angular`, `sfeir-school-genai`, …). A new orthogonal axis
(`data-family`) would give every school a legitimate, brand-compliant secondary accent.

### 4.2 S1 — Typography stack is entirely superseded

| Role    | Today                  | Target         | Licence    |
| ------- | ---------------------- | -------------- | ---------- |
| Display | Poppins 600            | Epilogue 900   | OFL 1.1 ✅ |
| Body    | Poppins 400            | Epilogue 400   | OFL 1.1 ✅ |
| Labels  | _(none — Poppins 800)_ | Space Grotesk  | OFL 1.1 ✅ |
| Code    | Consolas / Inconsolata | JetBrains Mono | OFL 1.1 ✅ |

The skill names Poppins explicitly as a "common mistake" (it is the _old_ font).
Two structural additions, not just substitutions:

- **Space Grotesk has no equivalent today.** Every uppercase label, eyebrow, section
  number and nav element becomes a new typographic role with positive tracking
  (+0.06em to +0.18em). The theme currently has no eyebrow/label concept at all.
- **Tracking is part of the identity**: −0.02em on display, positive on labels. No
  `letter-spacing` is set anywhere in the current SCSS.

### 4.3 S1 — Backgrounds contradict the identity

15 raster backgrounds, all built on the 2022 gradient language (`bg-green-1..6`,
`bg-blue-1..3`, `bg-*-blur`). The Sharp Artisan replaces coloured gradients with flat
Noir Carbone and a six-step Craie tonal ramp; copper "is a highlighter, never a slide
background".

These class names are used in **every downstream school repository**, so the assets can
be redrawn but the class names must keep resolving. See `03-migration-plan.md`, phase 4.

### 4.4 S2 — Shape and depth violations

| Location                   | Violation                                         |
| -------------------------- | ------------------------------------------------- |
| `speaker-slide.scss:46`    | `border-radius: 30px` on the speaker card         |
| `speaker-slide.scss:60`    | `linear-gradient(blue → green)` on the first `h3` |
| `sfeir-theme-plugin.ts:81` | `linear-gradient(90deg, accent 25%, white 25%)`   |
| vendored talk-control CSS  | 15 `border-radius` declarations, 14 `box-shadow`  |

The theme's own surface is small and easy to fix. The **vendored base theme** is the real
constraint: `@talk-control/talk-control-revealjs-extensions` ships radii (4px, 5px, 10px,
20px, `--tc-speaker-width-img`) and shadows that no `--tc-*` variable exposes. Two ways
out — override with a reset block in this theme, or land a `--tc-radius` / `--tc-shadow`
token upstream (same maintainer). Recommendation in `03-migration-plan.md`, phase 2.

### 4.5 S2 — Licensing debt worth clearing in passing

`public/fonts/` ships **Consolas** (5 files), a Microsoft proprietary typeface, in a
repository published under Apache-2.0. Swapping the code font to JetBrains Mono (OFL)
removes that exposure. Independently, moving Poppins/Inconsolata TTF → Epilogue and
Space Grotesk **variable WOFF2** should cut the 4.1 MB font payload by roughly 85%.

### 4.6 S2 — First-slide device is legacy identity

`title-slide.scss` builds the cover from a 800×400 raster logo plus a `sfeir-logo` badge
carrying `data-sfeir-techno` (50px uppercase, weight 800) and 1–3 `star.webp` sprites for
the level. The Sharp Artisan cover is: Noir Carbone, Space Grotesk eyebrow
(`SFEIR · PROGRAM · DATE`), left-aligned Epilogue Black display title with a trailing
Cuivre Clair `.`, right-aligned metadata, logo bottom-left. The star sprites have no
counterpart; **pill chips** (an explicitly allowed radius exception) are the natural
replacement for the level indicator.

### 4.7 S3 — Icon geometry

`--tc-icon-color` is driven by the mode accent (green/blue → Cuivre, mechanical fix).
Beyond colour: Feather's rounded stroke caps sit awkwardly against a "sharp, radius 0"
identity. Material Symbols already ships in the icon packs and offers a **Sharp** variant
— worth defaulting to it for on-brand decks.

### 4.8 S3 — Contrast traps introduced by the new palette

The product guidelines demand high contrast for "lower-quality projectors". The new
palette has two documented traps that must be encoded in the token layer, not left to
slide authors:

- Cuivre `#845400` on Noir Carbone = **3.4:1, fails AA** → must auto-switch to Cuivre
  Clair `#FFB95C` (10.5:1) on dark surfaces.
- Cuivre Poli `#E5A040` on white ≈ 2.2:1 → fills and large numerals only, **never body
  or label text on a light surface**.

A single `--sfeir-accent-on-dark` / `--sfeir-accent-on-light` pair makes both traps
unreachable by construction. Both traps carry over identically to the Bronze ramp:
`#4D662A` on Noir Carbone is 3.25:1, the same failure as Cuivre.

### 4.9 S1 — The charte's own contrast table is unreliable

Reproducing the skill's asserted ratios to validate our own arithmetic showed that
**not one of the six published values is correct**, and the errors run in both
directions — so this is hand-entered data, not a formula mismatch:

| Pair                              | Charte claims | Recomputed | Charte verdict | Real verdict |
| --------------------------------- | ------------: | ---------: | -------------- | ------------ |
| Cuivre `#845400` on white         |          7.60 |   **6.46** | AAA            | **AA only**  |
| Charcoal `#1B1B1B` on Blanc Craie |         15.50 |      16.36 | AAA            | AAA          |
| Cuivre Clair `#FFB95C` on Noir    |         10.50 |      12.35 | AAA            | AAA          |
| `#514536` on Blanc Craie          |          5.20 |       8.84 | AA             | AAA          |
| `#F1F1F1` on Noir                 |         16.10 |      18.59 | AAA            | AAA          |
| Cuivre `#845400` on Noir          |          3.40 |       3.25 | fail           | fail         |

Only one error changes a decision: **Cuivre on white is AA, not AAA** as the charte
claims. The rest are cosmetic, but collectively they mean the table cannot be used as a
reference.

Two consequences: the phase-1 contrast test must _compute_ ratios rather than transcribe
them (`03-migration-plan.md`, testing strategy item 2), and the correction should be
reported back to the brand team so the skill is fixed at the source.

## 5. What already aligns (no work needed)

- **CSS-variable architecture.** The theme is already driven by custom properties, both
  its own and the `--tc-*` contract (58 variables). Retokenising is an edit to
  `colors.scss`, not a rewrite.
- **No gradients in the vendored base theme** — the two gradients are ours.
- **`data-theme` indirection already exists**, so adding a fourth axis is additive.
- **A codemod precedent exists**: `scripts/sfeir-school-theme-migration.ts` (362 lines,
  V3→V4 rules over Markdown / HTML / JS). A V4→V5 rule set slots into the same harness.
- **The CLI already validates slide classes** against the theme CSS
  (`cli/utils/css.utils.ts`), which gives us a ready-made way to _detect_ decks still
  using retired classes.
- **Editorial layouts are already in the base theme**: `tc-multiple-columns`, admonitions,
  quote slides. The 60/40 and 30/70 asymmetric splits the brand wants are configuration,
  not new components.

## 6. Blocking external dependency

The skill bundles only two assets: `logo-sfeir-white.png` and `logo-sfeir-grey.png`
(corporate SFEIR, 3:1). It ships **no SFEIR School and no SFEIR Institute lockup** in the
2026 identity, and no vector version of anything.

Nothing on the cover, the footer or the exercice slide can be finalised without those.
Required from the brand team, in SVG:

1. SFEIR School lockup — light and dark variants.
2. SFEIR Institute lockup — light and dark variants.
3. Corporate SFEIR mark in SVG (to replace the 3:1 PNG for the footer).
4. Confirmation of the level/techno badge treatment, or approval to retire it.

See `04-open-decisions.md`, decision **D3**.
