# Charte 2026 — Token mapping and type scale

Companion to `01-audit.md`. This is the mechanical translation layer: what each existing
variable, class and font size becomes. Since revision 2 (2026-10-01) it describes what
**ships** on `feat/charte-2026`; every value below is read from
`src/scss/theme/tokens/*.scss` and asserted by `tokens.spec.ts`. Where the official
material (`05-reference-analysis.md`) and the `sfeir-brand-guidelines` skill disagree,
the official material wins.

## 1. Token architecture

Today `colors.scss` exposes hue names (`--sfeir-green`) that slides reference directly.
The charte requires the accent to change with surface polarity, which a hue name cannot
express. Three layers replace it:

```
Layer 1 — palette      raw charte values, never referenced by slides
                       --sfeir-cuivre-poli, --sfeir-craie, --sfeir-carbone, …   (_palette.scss)

Layer 2 — semantic     roles, the only layer slides and downstream CSS should use
                       --sfeir-accent, --sfeir-surface, --sfeir-on-surface, …   (_semantic.scss)

Layer 3 — contextual   redefinitions of layer 2 under [data-theme] and on dark
                       surfaces (this is where the AA traps are closed)          (_context.scss)
```

Two more files complete the layer: `_legacy.scss` (deprecated aliases, §4) and
`_selectors.scss` (the shared program and polarity selector lists). Layer 3 is what makes
the copper-on-black failure unreachable: any dark context redefines `--sfeir-accent` to
the on-dark tier, so a slide author writing `color: var(--sfeir-accent)` is correct on
both polarities without knowing the rule.

## 2. Palette layer

### 2.1 Copper — the corporate accent

Both programs carry it as fill, wash and numeral colour.

| Token                    | Hex       | Official slot | Use                                                        |
| ------------------------ | --------- | ------------- | ---------------------------------------------------------- |
| `--sfeir-cuivre`         | `#845400` | _(absent)_    | accent **text** on light surfaces — deviation, see §2.5    |
| `--sfeir-cuivre-poli`    | `#E4AA5D` | `accent1`     | fills, numerals, accent on dark (8.46:1 on Carbone)        |
| `--sfeir-cuivre-clair`   | `#FEB95C` | `accent4`     | the lighter tier (code numbers)                            |
| `--sfeir-sable`          | `#F0C387` | `accent3`     | warm callout wash, selection background                    |
| `--sfeir-cuivre-profond` | `#5D3A00` | _(skill)_     | Institute's deep tier: selection ink on Sable (6.21:1)     |

### 2.2 The two program families (decision D1, revision 2)

Institute takes **Ocre**, re-pointed to the official copper so that Institute is
indistinguishable from the corporate accent. School takes **Émeraude**, demoted to
signature elements only (eyebrow, list markers, title underline, transition line, level
chips, link underlines). Émeraude is never a fill, a background or a numeral; the semantic
layer encodes that by pointing School's fill and wash at copper (§3).

| Token                  | Hex       | Token                      | Hex       |
| ---------------------- | --------- | -------------------------- | --------- |
| `--sfeir-ocre-light`   | `#F0C387` | `--sfeir-emeraude-light`   | `#C8F5D6` |
| `--sfeir-ocre-medium`  | `#FEB95C` | `--sfeir-emeraude-medium`  | `#6BC68F` |
| `--sfeir-ocre-primary` | `#E4AA5D` | `--sfeir-emeraude-primary` | `#2E8B57` |
| `--sfeir-ocre-dark`    | `#845400` | `--sfeir-emeraude-dark`    | `#0D5A2E` |

Ocre is the copper table renamed, declared as literals so the family reads on its own.
`--sfeir-emeraude-light` and `--sfeir-emeraude-primary` are declared but no semantic role
reads them: with Émeraude confined to signature tiers, only `medium` (on dark) and `dark`
(on light) are in use.

### 2.3 Surfaces — the Craie → Carbone ramp

| Token                 | Hex       | Official slot | Use                                                   |
| --------------------- | --------- | ------------- | ----------------------------------------------------- |
| `--sfeir-white`       | `#FFFFFF` | `lt2`         | white cards and insets                                |
| `--sfeir-craie`       | `#F9F9F9` | `lt1`         | default light surface; light ink on dark              |
| `--sfeir-craie-1`     | `#F3F3F3` |               | default card surface                                  |
| `--sfeir-craie-2`     | `#EEEEEE` |               | table body                                            |
| `--sfeir-craie-3`     | `#E8E8E8` |               | elevated / featured cards                             |
| `--sfeir-craie-4`     | `#E2E2E2` |               | rare, hover states                                    |
| `--sfeir-brouillard`  | `#DADADA` |               | dimmed sections                                       |
| `--sfeir-carbone`     | `#181A1F` | `dk1`         | dark surface fill, **flat fallback under every photo** |
| `--sfeir-noir`        | `#000000` | `dk2`         | black blocks (code on dark slides), table headers     |

Glass and scrim, translucent by design — the only non-opaque palette values:

| Token                 | Value                    | Use                                           |
| --------------------- | ------------------------ | --------------------------------------------- |
| `--sfeir-glass-dark`  | `rgb(23 26 32 / 0.7)`    | cards on dark photos (`#171A20` at 70 %)      |
| `--sfeir-glass-light` | `rgb(255 255 255 / 0.41)` | cards on light photos                         |
| `--sfeir-overlay`     | `rgb(24 26 31 / 0.55)`   | the opt-in `bg-overlay` scrim (§9)            |

### 2.4 Ink and separators

| Token                      | Hex       | Official slot | Use                                                      |
| -------------------------- | --------- | ------------- | -------------------------------------------------------- |
| `--sfeir-charcoal`         | `#181A1F` | `dk1`         | body text on light (16.53:1 on Craie) — Carbone as ink   |
| `--sfeir-ink-on-dark`      | `#F9F9F9` | `lt1`         | body text on dark — Craie as ink                         |
| `--sfeir-separator-warm`   | `#CCC4B6` | `accent6`     | separators, muted ink on dark (10.06:1), code comments   |
| `--sfeir-taupe`            | `#B3A495` | `accent5`     | decoration only — 2.30:1 on Craie, fails even large      |
| `--sfeir-charcoal-variant` | `#514536` | _(skill)_     | muted ink and captions on light (8.85:1)                 |
| `--sfeir-error`            | `#BA1A1A` | _(skill)_     | danger                                                   |

### 2.5 Retired values and the two deliberate deviations

Retired from the palette, asserted absent by `tokens.spec.ts`: `#1B1B1B` (Charcoal),
`#303030` (mid surface), `#D6C3B1` / `#847564` (outline pair), `#E5A040` / `#FFB95C` /
`#FFDDB7` (the skill's copper), `#F1F1F1` / `#BFBFBF` (the first cut's greys).

Two deviations from the official deck are kept on purpose, both for training rooms:

1. **Accent text on light is `#845400`**, a value the official scheme does not carry.
   The pptx sets its light-surface eyebrows in `#E4AA5D` on `#F9F9F9` — **1.95:1**.
   `#845400` reaches 6.14:1. Non-text accents (fills, numerals, rules) keep `#E4AA5D`.
2. **Body text stays at 40 px** (§6.1).

## 3. Semantic layer — the public contract

Defaults are School (the theme's default `data-theme`). Program-independent roles first:

| Token                      | Light                      | Dark redefinition         | Notes                                   |
| -------------------------- | -------------------------- | ------------------------- | --------------------------------------- |
| `--sfeir-surface`          | `--sfeir-craie`            | `--sfeir-carbone`         |                                         |
| `--sfeir-surface-raised`   | `--sfeir-craie-1`          | `--sfeir-glass-dark`      |                                         |
| `--sfeir-surface-high`     | `--sfeir-craie-3`          | `--sfeir-noir`            | black blocks on a Carbone slide         |
| `--sfeir-surface-dim`      | `--sfeir-brouillard`       | _(unchanged)_             |                                         |
| `--sfeir-code-surface`     | `--sfeir-carbone`          | `--sfeir-noir`            | code is always on a dark block          |
| `--sfeir-glass`            | `--sfeir-glass-light`      | `--sfeir-glass-dark`      | the card; pairs with `--sfeir-on-glass` |
| `--sfeir-on-glass`         | `--sfeir-carbone`          | `--sfeir-ink-on-dark`     |                                         |
| `--sfeir-on-surface`       | `--sfeir-charcoal`         | `--sfeir-ink-on-dark`     |                                         |
| `--sfeir-on-surface-muted` | `--sfeir-charcoal-variant` | `--sfeir-separator-warm`  |                                         |
| `--sfeir-separator`        | `--sfeir-separator-warm`   | _(unchanged)_             | decoration, one value on both polarities |
| `--sfeir-danger`           | `--sfeir-error`            | _(unchanged)_             |                                         |
| `--sfeir-radius`           | `12px`                     | `12px`                    | cards, code blocks, glass               |
| `--sfeir-radius-pill`      | `999px`                    | `999px`                   | chips, avatars                          |

Rounded cards and circular badges are part of the official identity (86 `roundRect`,
37 `ellipse` in the MasterPrez), so the skill's radius 0 is gone. A literal radius
anywhere is still a violation: components read the two tokens.

The accent roles resolve through a **program ramp** (`--sfeir-ramp-*`, redefined under
`[data-theme]`) and then by **polarity**:

| Role                     | Reads                           | School                     | Institute                 |
| ------------------------ | ------------------------------- | -------------------------- | ------------------------- |
| `--sfeir-accent`         | `--sfeir-ramp-accent`, flipped to `--sfeir-ramp-accent-on-dark` on dark | Émeraude dark / medium | Ocre dark / primary |
| `--sfeir-accent-fill`    | `--sfeir-ramp-fill`             | Cuivre Poli                | Ocre primary (= Cuivre Poli) |
| `--sfeir-on-accent-fill` | `--sfeir-ramp-on-fill`          | Carbone                    | Carbone                   |
| `--sfeir-accent-wash`    | `--sfeir-ramp-wash`             | Sable                      | Ocre light (= Sable)      |
| `--sfeir-accent-deep`    | `--sfeir-ramp-deep`             | Émeraude dark              | Cuivre Profond            |

Resolved values in the four contexts, as `tokens.spec.ts` asserts them against the
compiled CSS:

| Context                           | `--sfeir-accent` | `--sfeir-accent-fill` | `--sfeir-on-accent-fill` | `--sfeir-accent-wash` | `--sfeir-accent-deep` |
| --------------------------------- | ---------------- | --------------------- | ------------------------ | --------------------- | --------------------- |
| `[data-theme="school"]`, light    | `#0D5A2E`        | `#E4AA5D`             | `#181A1F`                | `#F0C387`             | `#0D5A2E`             |
| `[data-theme="school"]`, dark     | `#6BC68F`        | `#E4AA5D`             | `#181A1F`                | `#F0C387`             | `#0D5A2E`             |
| `[data-theme="institute"]`, light | `#845400`        | `#E4AA5D`             | `#181A1F`                | `#F0C387`             | `#5D3A00`             |
| `[data-theme="institute"]`, dark  | `#E4AA5D`        | `#E4AA5D`             | `#181A1F`                | `#F0C387`             | `#5D3A00`             |
| `[data-theme="conf"]`             | inherits School  | idem                  | idem                     | idem                  | idem                  |

Fill, on-fill and wash are **identical in both programs** — that is D1 revision 2 made
mechanical. Only the signature tiers and the deep tier differ. There is no separate
on-light role: a component whose surface ignores the slide polarity names its own pair
instead (the speaker card's `--sfeir-speaker-card-surface` / `--sfeir-speaker-card-ink`).

Framework bindings read these roles and are redeclared alongside them
(`sfeir-framework-bindings` mixin): `--tc-heading-color`, `--tc-credits-color`,
`--tc-transition-line-color`, `--tc-icon-color`, `--r-heading-color`, `--r-link-color`,
`--r-link-color-hover`, `--r-selection-background-color` (wash), `--r-selection-color`
(deep), `--tc-code-dark-background` (code surface).

### 3.1 Resolution rule — the constraint that shapes this layer

A custom property that references another **resolves at its own declaration site**.
Redefining a token on a descendant therefore does _not_ retroactively change anything
declared higher up that reads it:

```scss
:root {
    --sfeir-ramp-accent: var(--sfeir-emeraude-dark);
    --sfeir-accent: var(--sfeir-ramp-accent); // resolves HERE, to Émeraude
}
.slides[data-theme='institute'] {
    --sfeir-ramp-accent: var(--sfeir-ocre-dark); // too late for --sfeir-accent
}
```

So every block that redefines a token must also redeclare each token transitively
derived from it. The layers do this with mixins — `sfeir-accent-roles` and
`sfeir-framework-bindings` in `_semantic.scss`, `sfeir-legacy-derived` in `_legacy.scss`
— included at `:root` and again on each axis, with the selector lists shared through
`_selectors.scss` (`$sfeir-institute`, `$sfeir-dark-sections`).

This is worth stating explicitly because it bit the implementation twice: first the
program axis switched the ramp without redeclaring the roles, then the deprecated
aliases failed to redeclare `--sfeir-blue` / `--sfeir-green`. Both times every
value-level test passed while `data-theme="institute"` still rendered the School accent.
The invariant is asserted against the _compiled_ CSS (`tokens.spec.ts`, "token
resolution across contexts"), which is the only surface where it is visible.

### 3.2 The polarity axis

"Dark" is a class list, not a colour probe: `$sfeir-dark-classes` in `_selectors.scss`
names the archetypes (`first-slide`, `speaker-slide`, `quote-slide`, `bg-blur`,
`sfeir-slide`, `with-code-dark`, `[class*='transition']`), the public photo classes
(`bg-dust`, `bg-arc`, `bg-rock`, `bg-flecks`, `bg-bokeh`, `bg-brown`, `bg-sand`,
`bg-pour`) and the deprecated colour variants (`bg-pink`, `bg-blue`, `bg-green`), minus
the light list (`bg-plaster`, `bg-white`), which wins when combined. The same qualifier
is applied to reveal's `.slide-background` so the flat fallback and the white signature
mark follow. The class → photo mapping lives in the initializer (§7); the two lists must
stay in step.

## 4. Legacy → new mapping

The neutrals barely move; the breaking change is confined to the four hue variables.

| Legacy token          | Value today | Maps to                    | Resolves to (School, light) | Δ              |
| --------------------- | ----------- | -------------------------- | --------------------------- | -------------- |
| `--sfeir-green`       | `#0AB580`   | `--sfeir-accent`           | `#0D5A2E`                   | **hue change** |
| `--sfeir-blue`        | `#5155F9`   | `--sfeir-accent`           | `#0D5A2E` (`#845400` on Institute) | **hue change** |
| `--sfeir-orange`      | `#FFAA54`   | `--sfeir-accent-fill`      | `#E4AA5D`                   | near           |
| `--sfeir-pink`        | `#DD3355`   | `--sfeir-accent-fill`      | `#E4AA5D`                   | **hue change** — re-pointed to Rose when phase 5 lands |
| `--black`             | `#1D1D2A`   | `--sfeir-on-surface`       | `#181A1F`                   | ~equal         |
| `--dark-grey`         | `#56566A`   | `--sfeir-on-surface-muted` | `#514536`                   | warmer         |
| `--medium-grey`       | `#817C7C`   | `--sfeir-taupe`            | `#B3A495`                   | **lighter; fails as text** |
| `--light-grey`        | `#DDDDDD`   | `--sfeir-brouillard`       | `#DADADA`                   | ~equal         |
| `--white`             | `#FFFFFF`   | `--sfeir-white`            | `#FFFFFF`                   | equal          |
| `--code-bg`           | `#3F3F3F`   | `--sfeir-code-surface`     | `#181A1F` (`#000000` on dark) | darker       |
| `--red`               | `#E74C3C`   | `--sfeir-danger`           | `#BA1A1A`                   | darker         |
| `--dark-grey-alpha`   | `rgba(61,67,73,.7)` | **retired**         | —                           | removed, no reader left |
| `--sfeir-*-stop-N` ×8 | gradients   | **retired**                | —                           | removed        |

All legacy names are kept as deprecated aliases pointing at their new target, so a
downstream deck writing `var(--sfeir-green)` renders in the new accent instead of
breaking. The role-reading aliases are redeclared on the program and polarity axes
(§3.1). The CLI `check` command reports them; they are removed in v6.

D1 makes this mapping clean: `--sfeir-green` was the _School accent_ and `--sfeir-blue`
the _Institute accent_, so both collapse onto `--sfeir-accent` and each resolves to the
right ramp on its own program. A deck that hard-codes `var(--sfeir-green)` in School mode
keeps its intent — it renders the Émeraude signature instead of `#0AB580`.

One alias changed meaning: `--medium-grey` now resolves to Taupe, which the official deck
uses for captions but which fails AA even as large text. A downstream deck using it for
body copy should move to `--sfeir-on-surface-muted`.

## 5. Expertise families — the secondary axis (phase 5, **not shipped**)

Eight families, four variants each, to be selected by `[data-family="…"]` on the
`.slides` container or on an individual `section`. One family per slide, never two.

| `data-family` | Pillar                    | light     | medium    | primary   | dark      |
| ------------- | ------------------------- | --------- | --------- | --------- | --------- |
| `indigo`      | Intelligence Artificielle | `#E9DDFF` | `#BA9EFE` | `#4B3088` | `#23005C` |
| `terre`       | Cloud & Platform          | `#FFDDB7` | `#C08B5C` | `#6B4226` | `#3D2100` |
| `emeraude`    | Data & Product            | `#C8F5D6` | `#6BC68F` | `#2E8B57` | `#0D5A2E` |
| `azur`        | Digital Workplace         | `#D6E8FF` | `#88B8F5` | `#4A90E2` | `#1A4E8A` |
| `canard`      | Software & MACH           | `#95F1FF` | `#5DBBC9` | `#007E8B` | `#004F57` |
| `rose`        | Sécurité                  | `#FFD9E5` | `#F2A0BD` | `#D66C93` | `#8B2E52` |
| `ocre`        | Services Managés          | `#F0C387` | `#FEB95C` | `#E4AA5D` | `#845400` |
| `souverain`   | Souveraineté & Confiance  | `#D4E4F2` | `#6A9AC4` | `#2C5F8A` | `#142D45` |

Only Ocre and Émeraude exist as tokens today (§2.2), because D1 spends them on the
programs; they are therefore **out of the `data-family` pool**. The other six, and the
`--sfeir-family-{light,medium,primary,dark}` roles, land with phase 5. Note that the
official deck uses no family colour at all (`05-reference-analysis.md` §8), so the axis
stays opt-in and should be used sparingly.

## 6. Type scale

### 6.1 The transposition problem

The charte is calibrated for **pptx 16:9 at 10 × 5.625 in**. RevealJS here runs at
**1920 × 1080 logical px**, i.e. 192 px per charte inch, so **1 pt = 2.667 px**.

| Role                 | Official pptx         | Literal px | Shipped | Verdict                              |
| -------------------- | --------------------- | ---------- | ------- | ------------------------------------ |
| Cover display        | 52 pt                 | 139 px     | 136 px  | adopt                                |
| Section divider      | 50 pt                 | 133 px     | 133 px  | adopt                                |
| Content title        | 28–30 pt              | 75–80 px   | 76 px   | adopt                                |
| Dense title          | 23 pt (case studies)  | 61 px      | 61 px   | adopt (new role)                     |
| Subtitle / h3        | 17–18 pt              | 45–48 px   | 48 px   | adopt                                |
| **Body**             | 14 pt lvl1, 10 pt dominant | 37 / 27 px | **40 px** | **reject — see below**           |
| Caption              | 8–9 pt                | 21–24 px   | 26 px   | keep                                 |
| Eyebrow label        | 12 pt                 | 32 px      | 32 px   | adopt                                |
| Key stat             | 33 pt Space Grotesk / 80 pt "Merci." | 88 / 213 px | 208 px | adopt, Space Grotesk Medium |

Body text is the one deliberate deviation. 27–37 px on a 1080 px canvas is marginal in a
training room on the "lower-quality projectors" that `conductor/product-guidelines.md`
explicitly targets. **Body stays at 40 px**, documented as an intentional deviation with
that rationale and asserted in `tokens.spec.ts`.

### 6.2 Shipped scale

Base unit = `--r-main-font-size: 40px` (unchanged). From `_typography.scss`:

| Token                      | px  | ×base | Family        | Weight            | Tracking                        |
| -------------------------- | --- | ----- | ------------- | ----------------- | ------------------------------- |
| `--sfeir-fs-caption`       | 26  | 0.65  | Epilogue      | 400               | normal                          |
| `--sfeir-fs-eyebrow`       | 32  | 0.80  | Space Grotesk | 500               | `--sfeir-tracking-label` +0.04em |
| `--sfeir-fs-body`          | 40  | 1.00  | Epilogue      | 400               | normal                          |
| `--sfeir-fs-subtitle`      | 48  | 1.20  | Epilogue      | 500 / 700         | normal                          |
| `--sfeir-fs-title-dense`   | 61  | 1.525 | Epilogue      | 700               | `--sfeir-tracking-title` −0.01em |
| `--sfeir-fs-title`         | 76  | 1.90  | Epilogue      | 700               | −0.01em                         |
| `--sfeir-fs-display`       | 133 | 3.325 | Epilogue      | **800**           | `--sfeir-tracking-display` −0.02em |
| `--sfeir-fs-display-cover` | 136 | 3.40  | Epilogue      | **800**           | −0.02em                         |
| `--sfeir-fs-stat`          | 208 | 5.20  | **Space Grotesk** | **500** (`--sfeir-weight-stat`) | −0.02em             |

Weights: `--sfeir-weight-regular` 400, `-medium` 500, `-stat` 500, `-bold` 700,
`-display` **800**. The pptx never uses Black 900; the skill's 900 is gone. Label
tracking is capped at +0.06em (`--sfeir-tracking-nav`) because the official deck types
its caps with no tracking at all; the skill's +0.16em is gone. Eyebrow separators are
typed by the author: ` | ` or `[ … ]`, never `·`.

Font stacks: `--sfeir-font-display` / `-body` (Epilogue), `-label` / `-stat` (Space
Grotesk), `-mono` (JetBrains Mono), each with a Helvetica/Arial or `ui-monospace`
fallback. Poppins appears in no stack (asserted).

Mapping onto the `--tc-*` / `--r-*` contract (`layout.scss`, `transition-slides.scss`,
`sfeir-overrides.scss`, `_semantic.scss`):

| Framework variable                      | Shipped                                       |
| --------------------------------------- | --------------------------------------------- |
| `--tc-heading-title-font-size`          | `var(--sfeir-fs-title)`                       |
| `--tc-heading-sub-title-font-size`      | `var(--sfeir-fs-subtitle)`                    |
| `--tc-heading-other-headings-font-size` | `var(--sfeir-fs-body)`                        |
| `--tc-transition-title-font-size`       | `var(--sfeir-fs-display)`                     |
| `--tc-transition-sub-title-font-size`   | `var(--sfeir-fs-subtitle)`                    |
| `--tc-transition-color`                 | `var(--sfeir-ink-on-dark)`, flipped to `--sfeir-on-surface` on light photos |
| `--tc-transition-line-color`            | `var(--sfeir-accent)`                         |
| `--tc-icon-color`                       | `var(--sfeir-accent)`                         |
| `--tc-credits-color`                    | `var(--sfeir-accent)`                         |
| `--tc-table-header-bg`                  | `var(--sfeir-noir)` — never the program colour |
| `--tc-table-header-color`               | `var(--sfeir-ink-on-dark)`                    |
| `--tc-table-bg`                         | `var(--sfeir-craie-2)`                        |
| `--tc-code-dark-background`             | `var(--sfeir-code-surface)`                   |
| `--r-code-font`                         | `var(--sfeir-font-mono)`                      |

### 6.3 Font delivery

| Family         | Axis        | Delivery                                              |
| -------------- | ----------- | ----------------------------------------------------- |
| Epilogue       | `wght` 100–900 | variable WOFF2, upright + italic, latin + latin-ext |
| Space Grotesk  | `wght` 300–700 | variable WOFF2, upright, latin + latin-ext          |
| JetBrains Mono | `wght` 100–800 | variable WOFF2, upright + italic, latin + latin-ext |

Ten WOFF2 files, **289 KB**, replace 25 TTF files (4.1 MB) — see `public/fonts/README.md`
for licences and what was retired (Poppins, Consolas, Inconsolata).

## 7. Class-name mapping

Downstream repositories carry these class names in Markdown, so they must keep resolving.
Since revision 2 every background class resolves to a **photo**, through the
`BACKGROUNDS` map in `src/js/sfeir-theme-initializer.ts` (talk-control sets
`data-background`; reveal paints it `cover`, centred). The map is walked in insertion
order, so an explicit `bg-*` beats an archetype default and a numbered legacy variant
beats the archetype it decorates.

### 7.1 Public photo classes (new, v5)

| Class        | Photo file (`images/backgrounds/`) | Polarity | Official role                       |
| ------------ | ---------------------------------- | -------- | ----------------------------------- |
| `bg-plaster` | `bg-plaster-white.webp`            | light    | opt-in; the official master's texture, not our default |
| `bg-dust`    | `bg-gold-particles-dark.webp`      | dark     | cover and closing (`TITLE`)         |
| `bg-arc`     | `bg-gold-arc-dark.webp`            | dark     | section divider (`L4`); cropped `auto 140%`, anchored bottom-right |
| `bg-rock`    | `bg-slate-rock-dark.webp`          | dark     | dark content — the safest behind dense text |
| `bg-flecks`  | `bg-rock-gold-flecks-dark.webp`    | dark     | agenda panel, dark content          |
| `bg-bokeh`   | `bg-bokeh-dark.webp`               | dark     | right panels, cards                 |
| `bg-brown`   | `bg-brown-blur-dark.webp`          | dark     | FONDS only; soft blur, safe behind text |
| `bg-sand`    | `bg-gold-glitter-sand.webp`        | **mixed** | case-study right half — **pair with `bg-overlay`** |
| `bg-pour`    | `bg-sand-pour-dark.webp`           | dark     | FONDS only; portrait, anchored left; also the exercice band |
| `bg-overlay` | _(modifier)_                       | —        | adds `--sfeir-overlay` over the photo; the pptx never does |

### 7.2 Archetype defaults

| Archetype class | Photo    | Notes                                                              |
| --------------- | -------- | ------------------------------------------------------------------ |
| `first-slide`   | dust     | cover: lockup top-left, eyebrow + chips, wordmark + tagline bottom-right |
| `transition`    | arc      | title bottom-left, 133 px                                          |
| `speaker-slide` | rock     | glass card                                                         |
| `quote-slide`   | rock     | glass blockquote                                                   |
| `bg-blur`       | rock     |                                                                    |
| `sfeir-slide`   | rock     |                                                                    |
| `with-code-dark` | rock   | code block on a dark slide; `--tc-code-dark-background` reads the code surface |
| `exercice`      | pour     | confined to the left 25 % band by `exercice.scss`                  |
| _(none)_        | flat Craie | `--sfeir-surface` painted on `.reveal-viewport`                  |

### 7.3 Legacy classes → photo

| Legacy class                  | Status     | Resolves to                        |
| ----------------------------- | ---------- | ---------------------------------- |
| `transition-bg-sfeir-1/2/3`   | **kept**   | dust / arc / rock                  |
| `transition-bg-green-1..6`    | deprecated | bokeh / brown / flecks / sand / rock / dust |
| `transition-bg-blue-1..3`     | deprecated | bokeh / brown / flecks             |
| `transition-bg-green-blur`, `transition-bg-blue-blur` | deprecated | brown                |
| `bg-white`                    | deprecated | plaster (light)                    |
| `bg-pink` / `bg-blue` / `bg-green` | deprecated | rock                          |
| `blue` / `green` (accent modifiers) | deprecated | no-op; the accent is single-valued per program |

Deprecated names are reported by `sfeir-school-theme check` and rewritten by the v4→v5
codemod. `transition-bg-green-4` lands on `bg-sand` without the overlay — the one legacy
mapping worth checking in a dark room.

### 7.4 Utilities (new, `utilities.scss`)

Applied from Markdown with `<!-- .element: class="…" -->` or on raw HTML. Each reads
semantic roles only, so it is correct in both programs and on both polarities.

| Class         | Renders                                                                                  |
| ------------- | ---------------------------------------------------------------------------------------- |
| `eyebrow`     | Space Grotesk 500 caps, 32 px, `--sfeir-accent` (the program signature)                  |
| `stat`        | Space Grotesk 500, 208 px, `--sfeir-accent-fill` (copper in both programs)               |
| `stat-label`  | Space Grotesk caps, 26 px, `--sfeir-on-surface-muted`                                    |
| `chip`        | pill outlined in `--sfeir-accent`; `chip-filled` = copper fill, Carbone ink              |
| `glass`       | `--sfeir-glass` card, `--sfeir-on-glass` ink, `--sfeir-radius`                           |
| `pull-quote`  | 3 px `--sfeir-accent-fill` left rule, italic Epilogue 500, no quote glyphs; one per slide |
| `separator`   | 1 px `--sfeir-separator` hairline                                                        |

Proposed in the first cut and **not shipped**: `bg-noir`, `bg-craie`, `bg-craie-lift`,
`bg-overlay-light` / `bg-overlay-dark`, `band-cuivre`. Flat surfaces are the fallback
under photos, not a class.

## 8. Deprecation policy

1. **v5.0.0** — new tokens and classes ship; every legacy name resolves to its mapped
   target; `sfeir-school-theme check` warns on each legacy usage.
2. **v5.x** — the V4→V5 codemod rewrites legacy names in place; warnings stay.
3. **v6.0.0** — aliases removed.

No downstream deck breaks at v5; each one upgrades by running the codemod when it wants.

## 9. Backgrounds

The official master puts a photo under every slide and uses **no overlay or gradient**:
legibility comes from photo selection and cropping. The theme ships nine photos as
1920-wide WebP (`public/images/backgrounds/`, provenance in `public/images/manifest.json`):

| File                            | Size        | KB  | Polarity | Source                                   |
| ------------------------------- | ----------- | --- | -------- | ---------------------------------------- |
| `bg-plaster-white.webp`         | 1920 × 1076 | 226 | light    | FONDS `AdobeStock_1500236871`            |
| `bg-gold-particles-dark.webp`   | 1920 × 1633 | 141 | dark     | FONDS `AdobeStock_1111949534`            |
| `bg-gold-arc-dark.webp`         | 1920 × 912  | 239 | dark     | FONDS `AdobeStock_1964989013`, denoised  |
| `bg-slate-rock-dark.webp`       | 1920 × 1047 | 73  | dark     | pptx embed only (2048 px), no FONDS original |
| `bg-rock-gold-flecks-dark.webp` | 1920 × 1280 | 104 | dark     | pptx embed only (2048 px), no FONDS original |
| `bg-bokeh-dark.webp`            | 1920 × 1280 | 132 | dark     | FONDS `AdobeStock_1575367686`            |
| `bg-brown-blur-dark.webp`       | 1920 × 883  | 37  | dark     | FONDS `AdobeStock_680975112`, denoised   |
| `bg-gold-glitter-sand.webp`     | 1920 × 1072 | 220 | mixed    | FONDS `AdobeStock_2180014338`            |
| `bg-sand-pour-dark.webp`        | 1281 × 1920 | 94  | dark     | FONDS `front-view-brown-sand-black-surface` |

≈ 1.27 MB in total, against the 948 KB of raster the v4 theme shipped.

Three rules, all in `layout.scss`:

1. **A flat colour sits under every photo.** `.slide-background` carrying a dark class
   gets `background-color: var(--sfeir-carbone)`, a light class gets `--sfeir-craie`, and
   `--sfeir-surface` is painted flat on `.reveal-viewport`. A slow network
   shows Carbone under light text, never white.
2. **Polarity is declared, not measured.** The class lists in `_selectors.scss` decide
   which ink, accent tier and signature mark a slide gets (§3.2).
3. **`bg-overlay` is opt-in.** It paints `--sfeir-overlay` (`rgb(24 26 31 / 0.55)`) over
   the photo for weak projectors. The pptx does not use it; `bg-sand` should always
   carry it.

The two rock photos the pptx uses are not in the delivered `FONDS/` folder and were
re-encoded from the 2048 px embeds; the originals are requested from the brand team.
What was deliberately not shipped from `FONDS/` is listed in `design/README.md`.
