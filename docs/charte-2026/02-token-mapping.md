# Charte 2026 — Token mapping and type scale

Companion to `01-audit.md`. This is the mechanical translation layer: what each existing
variable, class and font size becomes. It is a proposal, not yet an implementation.

## 1. Proposed token architecture

Today `colors.scss` exposes hue names (`--sfeir-green`) that slides reference directly.
The charte requires the accent to change with surface polarity, which a hue name cannot
express. Three layers replace it:

```
Layer 1 — palette      raw charte values, never referenced by slides
                       --sfeir-cuivre, --sfeir-craie-1, --sfeir-noir, …

Layer 2 — semantic     roles, the only layer slides and downstream CSS should use
                       --sfeir-accent, --sfeir-surface, --sfeir-on-surface, …

Layer 3 — contextual   redefinitions of layer 2 under [data-theme], [data-family]
                       and on dark surfaces (this is where the AA traps are closed)
```

Layer 3 is what makes the Cuivre-on-black failure (3.4:1) unreachable: any dark context
redefines `--sfeir-accent` to Cuivre Clair, so a slide author writing
`color: var(--sfeir-accent)` is correct on both polarities without knowing the rule.

## 2. Palette layer (new)

### 2.1 Copper

| Token                    | Hex       | Charte name    | Use                                         |
| ------------------------ | --------- | -------------- | ------------------------------------------- |
| `--sfeir-cuivre`         | `#845400` | Cuivre         | accent on light surfaces                    |
| `--sfeir-cuivre-poli`    | `#E5A040` | Cuivre Poli    | fills, large numerals — never text on light |
| `--sfeir-cuivre-clair`   | `#FFB95C` | Cuivre Clair   | accent on dark surfaces (AA-safe)           |
| `--sfeir-sable`          | `#FFDDB7` | Sable          | warm callout wash                           |
| `--sfeir-cuivre-profond` | `#5D3A00` | Cuivre Profond | text on Cuivre Poli / Sable                 |

### 2.2 Bronze — the School accent (decision D1)

Institute keeps Cuivre; School gets a copper-derived green. Each tier is solved for the
**measured luminance of the matching Cuivre tier**, so the two ramps behave identically
under every contrast rule (worst divergence 0.07 — full table in
`04-open-decisions.md`, D1).

| Token                    | Hex       | Mirrors        | Use                                         |
| ------------------------ | --------- | -------------- | ------------------------------------------- |
| `--sfeir-bronze`         | `#4D662A` | Cuivre         | accent on light surfaces                    |
| `--sfeir-bronze-poli`    | `#9CB774` | Cuivre Poli    | fills, large numerals — never text on light |
| `--sfeir-bronze-clair`   | `#B4D08D` | Cuivre Clair   | accent on dark surfaces (AA-safe)           |
| `--sfeir-mousse`         | `#DAE8C6` | Sable          | warm callout wash                           |
| `--sfeir-bronze-profond` | `#35471D` | Cuivre Profond | text on Bronze Poli / Mousse                |

Hue 85°, which is the only arc of the wheel more than 50° from all eight expertise
families — the reason this green was chosen over verdigris. Bronze is a documented
deviation from the charte's single-accent rule and must be submitted to the brand team
as such.

### 2.2 Surfaces — the Craie → Carbone ramp

| Token                 | Hex       | Charte name     |
| --------------------- | --------- | --------------- |
| `--sfeir-white`       | `#FFFFFF` | Pure White      |
| `--sfeir-craie`       | `#F9F9F9` | Blanc Craie     |
| `--sfeir-craie-1`     | `#F3F3F3` | Craie-1         |
| `--sfeir-craie-2`     | `#EEEEEE` | Craie-2         |
| `--sfeir-craie-3`     | `#E8E8E8` | Craie-3         |
| `--sfeir-craie-4`     | `#E2E2E2` | Craie-4         |
| `--sfeir-brouillard`  | `#DADADA` | Brouillard      |
| `--sfeir-carbone-mid` | `#303030` | inverse-surface |
| `--sfeir-noir`        | `#000000` | Noir Carbone    |

### 2.3 Ink and outline

| Token                      | Hex       | Charte name        |
| -------------------------- | --------- | ------------------ |
| `--sfeir-charcoal`         | `#1B1B1B` | Charcoal           |
| `--sfeir-charcoal-variant` | `#514536` | on-surface-variant |
| `--sfeir-ink-on-dark`      | `#F1F1F1` | inverse on-surface |
| `--sfeir-outline`          | `#847564` | Outline            |
| `--sfeir-outline-variant`  | `#D6C3B1` | Outline-variant    |
| `--sfeir-error`            | `#BA1A1A` | Error              |

## 3. Semantic layer (new) — the public contract

| Token                      | Light default              | Dark redefinition        |
| -------------------------- | -------------------------- | ------------------------ |
| `--sfeir-accent`           | `--sfeir-cuivre`           | `--sfeir-cuivre-clair`   |
| `--sfeir-accent-fill`      | `--sfeir-cuivre-poli`      | `--sfeir-cuivre-poli`    |
| `--sfeir-on-accent-fill`   | `--sfeir-cuivre-profond`   | `--sfeir-cuivre-profond` |
| `--sfeir-surface`          | `--sfeir-craie`            | `--sfeir-noir`           |
| `--sfeir-surface-raised`   | `--sfeir-craie-1`          | `--sfeir-carbone-mid`    |
| `--sfeir-on-surface`       | `--sfeir-charcoal`         | `--sfeir-ink-on-dark`    |
| `--sfeir-on-surface-muted` | `--sfeir-charcoal-variant` | `#BFBFBF`                |
| `--sfeir-separator`        | `--sfeir-outline-variant`  | `--sfeir-outline`        |
| `--sfeir-radius`           | `0`                        | `0`                      |
| `--sfeir-radius-pill`      | `999px`                    | `999px`                  |

`--sfeir-radius` exists only so the two legitimate exceptions (pill chips, avatars) are
named rather than magic. Any component using a literal radius is a violation.

### 3.1 The program axis

`--sfeir-accent` and its siblings do not point at a palette value directly — they
resolve from whichever ramp the program selects, then again by surface polarity:

| Context                           | `--sfeir-accent` | `--sfeir-accent-fill` | `--sfeir-on-accent-fill` |
| --------------------------------- | ---------------- | --------------------- | ------------------------ |
| `[data-theme="institute"]`, light | `#845400`        | `#E5A040`             | `#5D3A00`                |
| `[data-theme="institute"]`, dark  | `#FFB95C`        | `#E5A040`             | `#5D3A00`                |
| `[data-theme="school"]`, light    | `#4D662A`        | `#9CB774`             | `#35471D`                |
| `[data-theme="school"]`, dark     | `#B4D08D`        | `#9CB774`             | `#35471D`                |
| `[data-theme="conf"]`             | inherits School  | idem                  | idem                     |

Two independent axes, resolved in this order: **program** (`data-theme`) picks the ramp,
**polarity** (dark surface or not) picks the tier within it. A slide author writing
`color: var(--sfeir-accent)` is correct in all four combinations without knowing either
rule — which is the whole reason the semantic layer exists.

## 4. Legacy → new mapping

The neutrals barely move — a useful de-risking finding: the current greys are already
within a few ΔE of the charte ramp. The breaking change is confined to the four hue
variables.

| Legacy token          | Value today | Maps to                    | New value | Δ              |
| --------------------- | ----------- | -------------------------- | --------- | -------------- |
| `--sfeir-green`       | `#0AB580`   | `--sfeir-accent`           | `#845400` | **hue change** |
| `--sfeir-blue`        | `#5155F9`   | `--sfeir-accent`           | `#845400` | **hue change** |
| `--sfeir-orange`      | `#FFAA54`   | `--sfeir-accent-fill`      | `#E5A040` | near           |
| `--sfeir-pink`        | `#DD3355`   | `--sfeir-family-rose`      | `#D66C93` | near           |
| `--black`             | `#1D1D2A`   | `--sfeir-on-surface`       | `#1B1B1B` | ~equal         |
| `--dark-grey`         | `#56566A`   | `--sfeir-on-surface-muted` | `#514536` | warmer         |
| `--medium-grey`       | `#817C7C`   | `--sfeir-outline`          | `#847564` | ~equal         |
| `--light-grey`        | `#DDDDDD`   | `--sfeir-brouillard`       | `#DADADA` | ~equal         |
| `--code-bg`           | `#3F3F3F`   | `--sfeir-carbone-mid`      | `#303030` | ~equal         |
| `--red`               | `#E74C3C`   | `--sfeir-error`            | `#BA1A1A` | darker         |
| `--sfeir-*-stop-N` ×8 | gradients   | **retired**                | —         | removed        |

All legacy names are kept as deprecated aliases pointing at their new target, so a
downstream deck writing `var(--sfeir-green)` renders in the new accent instead of
breaking. The CLI `check` command reports them; they are removed one major version later.

Decision D1 makes this mapping unusually clean: `--sfeir-green` was the _School accent_
and `--sfeir-blue` the _Institute accent_, so both collapse onto the single
`--sfeir-accent` token and each resolves to the right ramp on its own program. A deck
that hard-codes `var(--sfeir-green)` in School mode keeps working and even keeps its
intent — it just renders Bronze instead of `#0AB580`.

The 8 gradient-stop variables have no target: gradients are not part of the identity.

## 5. Expertise families — the new secondary axis

Eight families, four variants each, selected by `[data-family="…"]` on the `.slides`
container or on an individual `section`. One family per slide, never two.

| `data-family` | Pillar                    | light     | medium    | primary   | dark      |
| ------------- | ------------------------- | --------- | --------- | --------- | --------- |
| `indigo`      | Intelligence Artificielle | `#E9DDFF` | `#BA9EFE` | `#4B3088` | `#23005C` |
| `terre`       | Cloud & Platform          | `#FFDDB7` | `#C08B5C` | `#6B4226` | `#3D2100` |
| `emeraude`    | Data & Product            | `#C8F5D6` | `#6BC68F` | `#2E8B57` | `#0D5A2E` |
| `azur`        | Digital Workplace         | `#D6E8FF` | `#88B8F5` | `#4A90E2` | `#1A4E8A` |
| `canard`      | Software & MACH           | `#95F1FF` | `#5DBBC9` | `#007E8B` | `#004F57` |
| `rose`        | Sécurité                  | `#FFD9E5` | `#F2A0BD` | `#D66C93` | `#8B2E52` |
| `ocre`        | Services Managés          | `#FFF0D6` | `#F2C878` | `#E5A040` | `#845400` |
| `souverain`   | Souveraineté & Confiance  | `#D4E4F2` | `#6A9AC4` | `#2C5F8A` | `#142D45` |

Exposed as `--sfeir-family-{light,medium,primary,dark}`, defaulting to the Cuivre ramp
when no family is set — so the axis is opt-in and every existing deck stays valid.

This is the axis that gives each school its own colour again, on-brand: a GenAI school
declares `data-family="indigo"`, an Angular school `data-family="canard"`. It replaces
the _decorative_ role that green/blue used to play, without reintroducing a second brand
accent.

## 6. Type scale

### 6.1 The transposition problem

The charte is calibrated for **pptx 16:9 at 10 × 5.625 in**. RevealJS here runs at
**1920 × 1080 logical px**, i.e. 192 px per charte inch, so **1 pt = 2.667 px**.

A literal transposition is correct for every role except body text:

| Role                 | Charte | Literal px | Today | Verdict                |
| -------------------- | ------ | ---------- | ----- | ---------------------- |
| Cover display        | 52 pt  | 139 px     | 80 px | adopt (+73%)           |
| Section / transition | 48 pt  | 128 px     | 80 px | adopt (+60%)           |
| Content title        | 26 pt  | 69 px      | 60 px | adopt, nudged to 76 px |
| Subtitle / h3        | 17 pt  | 45 px      | 46 px | already correct        |
| **Body**             | 11 pt  | **29 px**  | 40 px | **reject — see below** |
| Caption              | 9.5 pt | 25 px      | —     | adopt                  |
| Eyebrow label        | 10 pt  | 27 px      | —     | adopt (new role)       |
| Key stat             | 80 pt  | 213 px     | —     | adopt (new role)       |

Body text is the one deliberate deviation. 29 px on a 1080 px canvas is 2.7 % of slide
height — fine for a pptx read at laptop distance, marginal in a training room on the
"lower-quality projectors" that `conductor/product-guidelines.md` explicitly targets.
Today's 40 px is 3.7 %. **Body stays at 40 px**, documented as an intentional deviation
with that rationale.

### 6.2 Proposed scale

Base unit = `--r-main-font-size: 40px` (unchanged).

| Token                      | px  | ×base | Family        | Weight | Tracking |
| -------------------------- | --- | ----- | ------------- | ------ | -------- |
| `--sfeir-fs-eyebrow`       | 27  | 0.68  | Space Grotesk | 400    | +0.16em  |
| `--sfeir-fs-caption`       | 26  | 0.65  | Epilogue      | 400    | normal   |
| `--sfeir-fs-body`          | 40  | 1.00  | Epilogue      | 400    | normal   |
| `--sfeir-fs-subtitle`      | 48  | 1.20  | Epilogue      | 700    | normal   |
| `--sfeir-fs-title`         | 76  | 1.90  | Epilogue      | 700    | −0.01em  |
| `--sfeir-fs-display`       | 128 | 3.20  | Epilogue      | 900    | −0.02em  |
| `--sfeir-fs-display-cover` | 136 | 3.40  | Epilogue      | 900    | −0.02em  |
| `--sfeir-fs-stat`          | 208 | 5.20  | Epilogue      | 900    | −0.02em  |

Mapping onto the existing `--tc-*` contract:

| `--tc-*` variable                       | Today    | Proposed                   |
| --------------------------------------- | -------- | -------------------------- |
| `--tc-heading-title-font-size`          | `1.5em`  | `var(--sfeir-fs-title)`    |
| `--tc-heading-sub-title-font-size`      | `1.15em` | `var(--sfeir-fs-subtitle)` |
| `--tc-heading-other-headings-font-size` | `1em`    | `var(--sfeir-fs-body)`     |
| `--tc-transition-title-font-size`       | `2em`    | `var(--sfeir-fs-display)`  |
| `--tc-transition-sub-title-font-size`   | `1.5em`  | `var(--sfeir-fs-subtitle)` |
| `--tc-transition-line-color`            | green    | `var(--sfeir-accent)`      |
| `--tc-icon-color`                       | green    | `var(--sfeir-accent)`      |
| `--tc-table-header-bg`                  | green    | `var(--sfeir-noir)`        |
| `--tc-credits-color`                    | green    | `var(--sfeir-accent)`      |

### 6.3 Font delivery

| Family         | Weights needed  | Delivery                        |
| -------------- | --------------- | ------------------------------- |
| Epilogue       | 400/500/700/900 | variable WOFF2, 1 file + italic |
| Space Grotesk  | 400/500/700     | variable WOFF2, 1 file          |
| JetBrains Mono | 400/500         | variable WOFF2, 1 file + italic |

Four to five WOFF2 files replace 25 TTF files (4.1 MB) — expect ≈ 500 KB, a ~85 %
reduction, with `font-display: swap` and the fallback stacks the charte specifies.

## 7. Class-name mapping

Downstream repositories carry these class names in Markdown, so they must keep resolving.

| Legacy class                                   | Status     | Resolves to                             |
| ---------------------------------------------- | ---------- | --------------------------------------- |
| `transition-bg-sfeir-1..3`                     | **kept**   | new Noir / Craie structural backgrounds |
| `transition-bg-green-1..6`                     | deprecated | neutral set variants 1..6               |
| `transition-bg-blue-1..3`                      | deprecated | neutral set variants 1..3               |
| `transition-bg-green-blur`                     | deprecated | `bg-blur` on Noir Carbone               |
| `transition-bg-blue-blur`                      | deprecated | idem                                    |
| `bg-white` / `bg-blue` / `bg-green` (overlays) | deprecated | `bg-overlay-light` / `bg-overlay-dark`  |
| `blue` / `green` (accent modifiers)            | deprecated | no-op; accent is now single-valued      |

New classes introduced:

| Class           | Purpose                                                  |
| --------------- | -------------------------------------------------------- |
| `bg-noir`       | flat Noir Carbone — the charte's default dark surface    |
| `bg-craie`      | flat Blanc Craie                                         |
| `bg-craie-lift` | Craie-1 on Craie — tonal layering, replaces card shadows |
| `eyebrow`       | Space Grotesk uppercase label, `--sfeir-accent`          |
| `stat`          | 208 px Epilogue Black numeral                            |
| `chip`          | pill chip (documented radius exception)                  |
| `pull-quote`    | 3 px Cuivre Poli left border, one italic per slide       |

## 8. Deprecation policy

1. **v5.0.0** — new tokens and classes ship; every legacy name resolves to its mapped
   target; `sfeir-school-theme check` warns on each legacy usage.
2. **v5.x** — the V4→V5 codemod rewrites legacy names in place; warnings stay.
3. **v6.0.0** — aliases removed.

No downstream deck breaks at v5; each one upgrades by running the codemod when it wants.
