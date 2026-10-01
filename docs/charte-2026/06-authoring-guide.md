# Charte 2026 — Authoring guide

How to write an on-brand slide with `sfeir-school-theme` v5: Markdown plus a slide or
element class, no CSS. Values are those shipped in `src/` (`02-token-mapping.md`); every
snippet is rendered in `demo/markdown/` (`04-specifics/25_charte_2026.md`, `04-specifics/
20_specifics_slides.md`, and `00_intro.EN.md` for the cover).

## 1. Pick the program, not the colour

The program is set once, on the deck: `<div class="slides" data-theme="school">` (the
default) or `data-theme="institute"`, or per URL — `index.html?data-theme=institute`
(`?data-theme=conf` for the unbranded mode). The URL parameter wins over the attribute.
A slide never names the program: it reads roles, resolved per program and polarity.

| What changes with the program | School                                   | Institute               |
| ----------------------------- | ---------------------------------------- | ----------------------- |
| Signature (`--sfeir-accent`)  | Émeraude `#0D5A2E` light / `#6BC68F` dark | copper `#845400` / `#E4AA5D` |
| Fills, numerals, wash         | copper, identical                        | copper, identical       |
| Photos, cards, neutrals, marks| identical                                | identical               |
| Cover lockup and eyebrow      | `[sfeir] School`, `[ SFEIR SCHOOL \| … ]` | `[sfeir] Institute`, `[ SFEIR INSTITUTE \| … ]` |

## 2. Backgrounds

Content slides are flat Blanc Craie; every photo, plaster included, is an opt-in class on the slide.
Dark photos flip the ink and the accent tier automatically.

| Slide class  | Photo                          | Polarity | Use it for                                   |
| ------------ | ------------------------------ | -------- | -------------------------------------------- |
| _(none)_                | flat Blanc Craie    | light    | content, code, exercices — the default       |
| `bg-plaster`            | off-white plaster   | light    | opt-in textured light slide                  |
| `bg-dust`    | gold particles on black        | dark     | cover, closing, hero statements              |
| `bg-arc`     | gold horizon arc               | dark     | section dividers (`transition` default)      |
| `bg-rock`    | dark slate                     | dark     | dense text on dark — the safest              |
| `bg-flecks`  | charcoal rock, gold flecks     | dark     | dark content, agenda panels                  |
| `bg-bokeh`   | warm bokeh discs               | dark     | statements; keep text off the discs          |
| `bg-brown`   | soft copper blur               | dark     | dense text on dark, no detail                |
| `bg-sand`    | gold glitter, bright centre    | **mixed** | **always with `bg-overlay`**                |
| `bg-pour`    | sand trickle, portrait         | dark     | statements; also the exercice band           |
| `bg-overlay` | _(modifier)_ 55 % Carbone scrim | —       | any photo on a weak projector                |

```markdown
<!-- .slide: class="bg-sand bg-overlay" -->
```

The archetype defaults — `first-slide` → dust, `transition` → arc, `speaker-slide` /
`quote-slide` / `bg-blur` / `sfeir-slide` / `with-code-dark` → rock, `exercice` → pour
(left 25 % band) — yield to a `bg-*` class next to them: `transition bg-arc`.

## 3. Cover

```markdown
<!-- .slide: class="first-slide" sfeir-level="1" sfeir-techno="pwa" -->

# **Welcome to SFEIR School**

## **PWA 100**
```

Renders: lockup top-left, eyebrow `[ SFEIR SCHOOL | PWA ]` with the level as three
pills (one filled for `sfeir-level="1"`), the title bottom-left in Epilogue 800 at
136 px, the wordmark and the tagline "Sharp Tech. Real Impact." bottom-right.
`sfeir-level` is clamped to 1–3; `sfeir-techno` is free text, rendered in caps; omit it for
`[ SFEIR SCHOOL ]`. `conf` hides lockup, badge and tagline.

## 4. Utilities

Element classes, applied with `<!-- .element: class="…" -->` on a paragraph or directly
on an HTML tag. All read semantic roles: correct in both programs, on both polarities.

| Class             | What it is                                                     | Rule                              |
| ----------------- | -------------------------------------------------------------- | --------------------------------- |
| `eyebrow`         | Space Grotesk caps, 32 px, signature colour                    | one per slide, above the title; type the brackets and `\|` yourself |
| `stat` + `stat-label` | 208 px Space Grotesk Medium copper numeral + caps label    | up to three per slide             |
| `chip`, `chip-filled` | pill outlined in the signature; filled = copper            | short labels: level, track, "new" |
| `glass`           | translucent card, dark glass on dark photos, white on light    | the only card on a photo          |
| `pull-quote`      | copper left rule, italic; on a `>` blockquote                  | one per slide                     |
| `separator`       | 1 px warm hairline, on `<hr>`                                  |                                   |

```markdown
[ SFEIR EN CHIFFRES ]<!-- .element: class="eyebrow" -->

## Trois chiffres clés

<div class="flex-row">
<div>
<p class="stat">850</p>
<p class="stat-label">Collaborateurs</p>
</div>
<div>
<p class="stat">8</p>
<p class="stat-label">Agences en Europe</p>
</div>
<div>
<p class="stat">+90</p>
<p class="stat-label">Clients grands comptes</p>
</div>
</div>
```

```markdown
<!-- .slide: class="bg-rock" -->

## Une carte de verre

<div class="glass">

[ RÉSULTATS ]<!-- .element: class="eyebrow" -->

**-40 %** de temps de mise en production, **zéro** régression en six mois.

Un bloc translucide, comme ceux du MasterPrez.

</div>
```

```markdown
<span class="chip">Niveau 200</span> <span class="chip">Front</span> <span class="chip chip-filled">Nouveau</span>

<hr class="separator">

> La simplicité est la sophistication suprême.

<!-- .element: class="pull-quote" -->
```

## 5. Two rules that keep a deck on-brand

- **One accent per slide.** The signature colour stays on small elements (eyebrow,
  markers, chips, a rule); large colour is the copper fill (`stat`, `chip-filled`) or a
  photo. Never a second hue.
- **No literal hex, no literal radius.** A per-school stylesheet reads roles:
  `var(--sfeir-accent)`, `var(--sfeir-accent-fill)`, `var(--sfeir-on-surface)`,
  `var(--sfeir-glass)`, `var(--sfeir-radius)`, `var(--sfeir-radius-pill)`. Palette tokens
  (`--sfeir-cuivre-poli`, `--sfeir-craie`, …) are not for slides: they cannot follow the
  program or the polarity.

## 6. Anti-patterns

| Do not                                                        | Because                                                                       | Instead                                   |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------- |
| `transition blue` / `transition green`, `bg-blue` / `bg-green`, `transition-bg-green-N` / `-blue-N` | v4 classes; they still resolve (to the accent, to a photo) but say nothing and are removed in v6 | the accent is automatic; pick a `bg-*` photo |
| `var(--sfeir-green)`, `var(--sfeir-blue)`, `var(--black)`, `var(--code-bg)` | deprecated aliases, reported by `sfeir-school-theme check`                    | `--sfeir-accent`, `--sfeir-on-surface`, `--sfeir-code-surface` |
| `style="background: linear-gradient(…)"`, `data-background-gradient` | the identity has no gradients; the v4 exercice gradient is gone                | a photo class, or `glass`                 |
| `box-shadow`, drop shadows on cards or images                 | depth is layered surfaces and glass, never a shadow                            | `glass`, `--sfeir-surface-raised`         |
| `font-family: Poppins`, Consolas, Inconsolata                 | superseded or proprietary; not shipped                                        | the stacks: Epilogue, Space Grotesk, JetBrains Mono |
| Epilogue 900, `letter-spacing: 0.16em` on labels              | the official deck uses ExtraBold 800 and no tracking                          | `--sfeir-weight-display`, `--sfeir-tracking-label` |
| `#E4AA5D` text on a light slide, `--sfeir-taupe` as text      | 1.95:1 and 2.30:1 on Craie                                                     | `--sfeir-accent` (resolves to `#845400` on light), `--sfeir-on-surface-muted` |
| `·` as eyebrow separator, generated brackets                  | the deck types ` \| ` and `[ … ]`                                             | type them in the Markdown                 |
| A green fill, numeral or background in School                 | Émeraude is a signature, never a surface (D1)                                 | copper `stat`, `chip-filled`, photos      |
| `bg-sand` without `bg-overlay`                                | mid-light photo; text fails on the bright centre                               | `bg-sand bg-overlay`, or `bg-brown`       |
| Body text under 40 px to fit more                             | the documented training-room floor                                             | split the slide                           |
