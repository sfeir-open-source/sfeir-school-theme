# Charte 2026 — Migration plan

Branch: `feat/charte-2026`. Target release: **v5.0.0**.

## Revision 2 — 2026-10-01, after the official material landed

The official theme (`Theme SFEIR 26_27.pptx`), the MasterPrez and the asset folder were
delivered on 2026-10-01 and analysed in `05-reference-analysis.md`. Rule applied: **the
delivered files win over the skill** wherever the two disagree. This revision supersedes
phases 2 and 4 below and refines phase 3; phase 1 stands but its palette values are
re-pointed. The original text is kept underneath for the record.

### What changed in the facts

| Topic        | Plan v1 (from the skill)             | Official material                                              |
| ------------ | ------------------------------------ | -------------------------------------------------------------- |
| Dark ink     | Charcoal `#1B1B1B`                   | `#181A1F`                                                      |
| Accent       | Cuivre Poli `#E5A040`, Clair `#FFB95C`, Cuivre `#845400` as text | `#E4AA5D` on both polarities; `#FEB95C` light tier; `#845400` absent |
| Wash         | Sable `#FFDDB7`                      | `#F0C387`                                                      |
| Separator    | `#D6C3B1` / `#847564`                | `#CCC4B6`                                                      |
| Mid surface  | `#303030`                            | none; glass `rgb(23 26 32 / .70)` on photos                    |
| Shape        | radius 0, no transparency            | rounded cards (~12 px), circular badges, translucent glass     |
| Backgrounds  | flat Noir / Craie                    | **photos, no overlay**: plaster on light, gold dust / arc / rock on dark |
| Display      | Epilogue 900                         | Epilogue ExtraBold 800                                         |
| Eyebrow      | 10 pt, +0.16 em                      | 12 pt, no tracking, `|` or `[ ]` separators                    |
| Marks        | wordmark bottom-left on every slide  | compact `[≡]` bottom-left; wordmark bottom-right on cover/closing |
| Institute lockup | none exists                      | **exists as vector** (2020, still used in the 2026 MasterPrez) |
| School lockup | none exists                         | still none                                                     |

### Decisions taken in this revision

- **D1 refined.** Institute keeps the corporate copper (the "Ocre" ramp is re-pointed to
  the pptx values). School keeps Émeraude, but **demoted to signature elements only**:
  eyebrow, list markers, title underline, transition line, level chips, separators. Never a
  fill, a background or a numeral. Photos, neutrals and cards are identical in both
  programs. Rationale and contrast figures in `05-reference-analysis.md` §9. Fallback if the
  brand team refuses even that: School monochrome copper, differentiated by the lockup
  alone — a six-line change in `_semantic.scss`.
- **D3 refined.** Both lockups are composed in CSS from the corporate wordmark SVG plus
  the program word in Epilogue, on the Institute lockup's geometry, so the two read as
  siblings. The official Institute vector ships in `public/images/logos/` for decks that
  want it. The official School sibling is requested from the brand team.
- **D4 confirmed.** Eyebrow `[ SFEIR SCHOOL | ANGULAR ]`, level as 1–3 pill chips.
- **Backgrounds come back**, as photos, mapped onto the existing class contract (see WP2).
  Every photo sits on a flat `#181A1F` / `#F9F9F9` fallback; an opt-in `bg-overlay`
  modifier adds `rgb(24 26 31 / .55)` for weak projectors — the pptx does not use it.
- **Two deliberate deviations, kept:** accent *text* on light surfaces stays `#845400`
  (the pptx's `#E4AA5D` on `#F9F9F9` is 1.95:1), and body stays 40 px.
- **Housekeeping.** The 130 MB of reference binaries move out of `docs/` (which
  `prepare-publish` copies into the npm package) to `design/charte-2026/`, git-ignored
  except the logo sources. `npm start` rebuilds before serving.

### Work packages

Each package is coded by one agent on disjoint files, then checked by a verifier agent
(unit tests, built-CSS invariants, visual regression against the baselines, contrast audit).

| WP  | Scope                                                                                                                                                                                                                                                                          | Files owned                                                                                                     | Depends on |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | ---------- |
| 0   | Visual regression harness (Playwright), baselines of the current state, contrast audit, `prestart` fix                                                                                                                                                                         | `tests/visual/**`, `playwright.config.ts`, `package.json` scripts                                               | —          |
| 1   | **Tokens & type**: re-point palette; glass tokens; `--sfeir-radius: 12px`; Émeraude signature-only roles; type scale (800, eyebrow 32 px, divider 133 px, stat in Space Grotesk); `--sfeir-code-surface` → `#181A1F`; tests updated                                            | `src/scss/theme/tokens/**`, `src/scss/theme/fonts.scss`                                                         | —          |
| 2   | **Backgrounds, marks & cover**: move assets to `public/images/{backgrounds,logos}`; re-encode the heavy grain photos; class → photo mapping in the initializer; `bg-*` classes and `bg-overlay`; burger signature bottom-left; composed lockups; cover eyebrow + level chips (D4); exercice band from the sand-pour photo | `src/js/**`, `src/scss/theme/layout.scss`, `title-slide.scss`, `transition-slides.scss`, `exercice.scss`, `specifics-slides.scss`, `tokens/_selectors.scss`, `public/images/**` | —          |
| 3   | **Archetypes**: speaker card as glass, quote, code surface, new utilities `eyebrow` / `stat` / `chip` / `pull-quote` / `glass`; demo slides for each                                                                                                                           | `src/scss/theme/speaker-slide.scss`, a new `utilities.scss`, `demo/markdown/**`                                 | 1, 2       |
| 4   | **Docs**: `02-token-mapping.md` values, `04-open-decisions.md` log (D1/D3 revisions), README identity sections, `conductor/product.md`, `design/README.md`                                                                                                                      | `docs/**`, `README.md`, `conductor/product.md`                                                                  | 1, 2, 3    |

### Status — 2026-10-01, end of the coding pass

| WP  | Status      | Shipped vs planned                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | **delivered** | Playwright harness under `tests/visual/` (chromium, 1920 × 1080), served on its own port **4243** so it never collides with `npm run serve` on 4242. Scripts: `test:visual` (full deck, both programs), `test:visual:quick` (archetypes), `test:visual:update`, `test:contrast` (WCAG audit → `tests/visual/reports/`). Two consecutive full runs are pixel-identical, hence no masks. Baselines are **local artefacts, not committed**: each contributor generates them with `test:visual:update` before a change. `prestart` now runs `build` before `prepare-demo`. |
| 1   | **landed**  | As planned: palette re-pointed (`#181A1F`, `#E4AA5D`, `#FEB95C`, `#F0C387`, `#CCC4B6`), glass tokens, `--sfeir-radius: 12px`, Émeraude on the signature tiers only, display 800, eyebrow 32 px, divider 133 px, stat in Space Grotesk 500, `--sfeir-code-surface` → Carbone. Beyond plan: the code surface flips to `#000000` on dark sections; `--sfeir-fs-title-dense` (61 px) and `--sfeir-overlay` added; `--sfeir-carbone-mid` and `--dark-grey-alpha` removed (no reader left). 7 retired skill values asserted absent. |
| 2   | **landed**  | As planned: assets moved to `public/images/{backgrounds,logos}` with `manifest.json` provenance; grain photos denoised and re-encoded (9 WebP, ≈ 1.27 MB); class → photo map in the initializer; nine `bg-*` classes plus `bg-overlay`; composed program lockup bottom-left on every slide (36 px; first shipped as the burger, switched after validation); composed lockups; cover eyebrow + chips; exercice band from the sand-pour photo, the JS gradient injection removed. Beyond plan: the two rock photos re-encoded from the pptx embeds (no FONDS original); 15 v4 WebP images deleted. Not touched although owned: `specifics-slides.scss`. |
| 3   | **landed**  | As planned: speaker card as dark glass with its own ink pair, quote slide as glass, code on a dark block with a brand highlight palette (new `utils/code.scss`, every token computed against `#181A1F`), utilities `eyebrow` / `stat` / `chip` / `pull-quote` / `glass`; demo `25_charte_2026.md`. Beyond plan: `stat-label`, `chip-filled`, `separator`; a photo-background showcase in `20_specifics_slides.md`; `window.Reveal` exposed by the demo for the harness. |
| 4   | **done**    | This revision of the docs: token mapping, decision log, migration status, `06-authoring-guide.md`, root README, `conductor/`, `CHANGELOG.md`, `design/README.md`. Phase 7 item 4 is renumbered: the authoring guide is `06-authoring-guide.md`, `05` being the reference analysis. |

Open after this pass: regenerate `docs/images/*.png`
(phase 7 item 2), the official School lockup (D3), the two rock-photo originals, phase 5
(families) and phase 6 (codemod rules for the new class and token names).

Phases 5 to 8 of the original plan are unchanged.

---

## Original plan (v1, 2026-09-10)

Guiding constraint: **no downstream school repository may break on upgrade.** Every phase
below is shippable and independently verifiable, and legacy names keep resolving until
v6.

## Phase 0 — Decisions and assets (blocking)

Nothing visual can be finalised before these land. See `04-open-decisions.md`.

- [ ] **D1** — how School and Institute differentiate without green/blue.
- [ ] **D2** — v4 GA first, or fold the charte into the current RC line.
- [ ] **D3** — obtain SVG lockups (School light/dark, Institute light/dark, corporate).
- [ ] **D4** — keep or retire the level/techno badge on the cover.
- [ ] **D5** — ship a legacy-charte escape hatch, or a clean break.

Phases 1 and 2 depend only on **D2**, so they can start as soon as that one is settled.

## Phase 1 — Foundation: tokens and typography ✅ done

**Landed** in `5c67ae9` (tokens) and `ef5b3d2` (typography and the resolution fix).
Outcome notes, where reality differed from the plan below:

- The token layer needed a fifth file, `_selectors.scss`, so the program and polarity
  selector lists are shared between `_context.scss` and `_legacy.scss`.
- A CSS semantics trap cost two rounds: a referencing custom property resolves at its
  declaration site, so switching the ramp on a descendant did nothing for roles declared
  at `:root`. Documented in `02-token-mapping.md` section 3.1 and asserted against the
  compiled CSS.
- Font payload came in at 289 KB across 10 variable WOFF2 files, against the 4.1 MB of
  25 TTF — better than the ~500 KB estimated.
- The 16 `data-theme` colour branches are down to 4, all asset-related, because the
  program axis now resolves them.
- **Not done, and it should have been:** the visual regression baselines. Verification
  was manual — Chrome DevTools screenshots of the demo across both programs and both
  polarities, which is how the resolution bug surfaced. Baselines must land **before
  phase 3**, which is the phase that actually restyles.

Purely additive. At the end of this phase the demo looks the same except for the
typeface — which is the point: it isolates the font swap from the reskin.

1. Introduce the three-layer token architecture in `src/scss/theme/colors.scss`
   (split into `tokens/_palette.scss`, `tokens/_semantic.scss`, `tokens/_context.scss`).
2. Add every legacy name as a deprecated alias per `02-token-mapping.md` §4.
3. Replace the font layer: Epilogue, Space Grotesk, JetBrains Mono as variable WOFF2;
   delete the 25 TTF files (clears the Consolas licensing exposure).
4. Add the type-scale tokens and rewire the `--tc-*` bindings.
5. Add `font-display: swap` and the charte's fallback stacks.

**Verification** — demo at 1920 × 1080 across the three modes; font payload measured
before/after; every legacy `var(--sfeir-*)` still resolves.

## Phase 2 — Shape reset

The charte's structural rules, applied globally before touching any individual layout.

1. Radius reset: `--sfeir-radius: 0` everywhere; `speaker-slide.scss:46` (30 px) fixed;
   the vendored talk-control radii (15 declarations) overridden.
2. Shadow reset: replace the 14 vendored `box-shadow` declarations with tonal layering.
3. Remove the two gradients we own: `speaker-slide.scss:60` and the inline
   `linear-gradient` injected at `sfeir-theme-plugin.ts:81`.
4. Links: Charcoal text with a Cuivre bottom border, Cuivre on hover — no blue.

**Upstream question.** The base theme exposes no `--tc-radius` / `--tc-shadow` token, so
step 1–2 currently means overriding vendored selectors — brittle across
`@talk-control/talk-control-revealjs-extensions` upgrades. Same maintainer owns both
repos, so the durable fix is to land those two tokens upstream and consume them here.
Recommendation: **open the upstream issue during phase 1** and ship local overrides
meanwhile, so the phase is not blocked either way.

**Verification** — grep the built CSS for any non-zero `border-radius` outside the two
documented exceptions, and for any `box-shadow`. This is a cheap CI check worth keeping.

## Phase 3 — Slide archetypes

One commit per archetype, each with its own demo slide and screenshot baseline.

| #   | Archetype             | Charte layout        | Current file             | Effort |
| --- | --------------------- | -------------------- | ------------------------ | ------ |
| 1   | Cover / first slide   | §1 Cover             | `title-slide.scss`       | L      |
| 2   | Transition / section  | §2 Section divider   | `transition-slides.scss` | M      |
| 3   | Content slide         | §3 Content           | `layout.scss`            | M      |
| 4   | Speaker slide         | _(no charte layout)_ | `speaker-slide.scss`     | L      |
| 5   | Exercice slide        | _(no charte layout)_ | `exercice.scss` + plugin | M      |
| 6   | Blur / pause slide    | §4 Hero band         | `specifics-slides.scss`  | S      |
| 7   | Code slide            | _(no charte layout)_ | vendored + overrides     | M      |
| 8   | Quote slide           | §6 pull quotes       | vendored + `layout.scss` | S      |
| 9   | **Stats slide** (new) | §5 Data / stats      | —                        | S      |
| 10  | **Editorial** (new)   | §6 Long-form 30/70   | —                        | M      |

Notes on the three that need design work, not translation:

- **Speaker slide** has no charte equivalent. It is the theme's most distinctive
  component and currently the most off-brand one (rounded card, blue→green gradient
  banner). Proposal: Noir Carbone slide, avatar as a circle (allowed exception), name in
  Epilogue Black, role and handles in Space Grotesk uppercase, badges as a flat row with
  ghost separators. Needs a design pass, not a token swap.
- **Exercice slide** keeps its 25 % vertical band and rotated label, restyled as Noir
  Carbone + Cuivre Clair. The band should move from the JS-injected inline gradient to a
  pure-CSS `linear-gradient`-free two-column background, which also removes the last
  `data-theme` branch from `sfeir-theme-plugin.ts`.
- **Code slides** get JetBrains Mono plus a Carbone-mid surface. The highlight.js theme
  needs re-picking against the new palette; contrast of each token colour on
  `#303030` must be checked, not assumed.

**Verification** — screenshot baseline per archetype per mode; contrast assertion on
every text/background pair introduced.

**Known finding, waiting on archetype 7.** The measured audit of 2026-09-14 leaves eight
contrast failures, all of them highlight.js light-theme tokens on their own code surface
— orange `#F5871F` at 2.49:1, yellow `#EAB700` at 1.85:1, olive `#718C00` at 3.82:1.
They predate the charte work and are the concrete reason the code archetype needs a
re-picked highlight theme rather than a token swap.

## Phase 4 — Assets

1. ~~Redraw the background set.~~ **Done ahead of schedule (2026-09-14).** Rather than a
   structural raster set, every background class resolves to flat Noir Carbone. The
   eleven raster backgrounds and the colour veils are deleted — 948 KB — and every
   retired class still resolves per `02-token-mapping.md` §7. A measured audit over the
   rendered demo (188 slides, 1083 text nodes) found zero contrast failures on the 44
   newly-black slides.
2. Integrate the SVG lockups from **D3**; retire the WebP logos.
3. Favicon set regenerated from the SVG mark.
4. Icon default: evaluate Material Symbols **Sharp** as the on-brand default in place of
   Feather's rounded caps (`--tc-icon-color` handled in phase 1).

Expected payload change: 1.2 MB of raster → a handful of SVG plus flat CSS colours.

## Phase 5 — Expertise family axis

Additive, opt-in, no default change.

1. `[data-family="…"]` on `.slides` or on a single `section`, exposing
   `--sfeir-family-{light,medium,primary,dark}`, defaulting to the Cuivre ramp.
2. URL parameter support, reusing the existing `_handle_parameter` helper that already
   backs `data-theme`.
3. Guard the "one family per slide" rule: the CLI `check` command flags a `section`
   carrying two family classes.
4. Document the eight families with their pillars.

## Phase 6 — Migration tooling

The existing V3→V4 codemod (`scripts/sfeir-school-theme-migration.ts`, 362 lines) is the
harness; add a V4_TO_V5 rule set:

| Rule domain | Rewrites                                                                                                                                     |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Markdown    | `--sfeir-green` / `--sfeir-blue` → `--sfeir-accent`; retired background classes → their new names; `blue` / `green` accent modifiers dropped |
| CSS         | same variable rewrites inside each repo's `css/slides.css`                                                                                   |
| HTML        | none expected                                                                                                                                |

Extend `sfeir-school-theme check` with a **charte** rule group: report legacy tokens,
retired classes, two-family slides, and any literal hex that is not in the palette.
That last one is what actually keeps decks on-brand over time.

## Phase 7 — Documentation and demo

1. Rewrite the README identity sections (currently: "School has a main theme color which
   is green whereas SFEIR Institute has a main theme color which is blue" — obsolete).
2. Regenerate all `docs/images/*.png` screenshots.
3. Extend the demo deck with the two new archetypes and a family showcase.
4. Write `docs/charte-2026/05-authoring-guide.md`: how to write an on-brand slide, and
   the anti-patterns from the skill's "Common Mistakes" list.
5. Update `conductor/product.md` — its "School (Green) / Institute (Blue)" description
   becomes wrong the moment D1 lands.

## Phase 8 — Release

`5.0.0-rc-1` → dogfood on one real school repository → GA. Follow the repo's existing
per-version branch convention.

## Testing strategy

`conductor/workflow.md` mandates TDD with >80 % coverage but exempts CSS/SCSS — which is
precisely what this migration touches. The exemption needs a substitute, otherwise the
whole reskin ships untested.

Proposal, in order of value:

1. **Visual regression** — Playwright screenshots of the demo deck at 1920 × 1080, per
   slide × per mode, committed as baselines. This is the only test that catches a reskin
   regression. New dev dependency; ~1 session to set up.
2. **Contrast assertions** — a unit test over the token map asserting every documented
   foreground/background pair meets AA. Cheap, pure TypeScript, and it locks in the two
   traps from `01-audit.md` §4.8 permanently.
3. **Built-CSS invariants** — grep the build output for non-zero radii, `box-shadow`,
   `gradient`, and off-palette hex literals. Runs in CI, near-zero cost.
4. **CLI rules** — standard vitest, matching the existing `cli/*.spec.ts` style.

Items 2–4 are pure TypeScript and do fall under the 80 % rule.

## Risk register

| Risk                                                          | Impact | Mitigation                                                                               |
| ------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------- |
| SVG lockups unavailable (**D3**)                              | High   | phases 1–3 use the corporate PNG as a placeholder; asset integration isolated in phase 4 |
| Vendored talk-control radii/shadows drift on upgrade          | Medium | land `--tc-radius` / `--tc-shadow` upstream in phase 2                                   |
| Downstream decks with hard-coded green/blue hex               | Medium | phase 6 `check` reports off-palette hex                                                  |
| Body text at 29 px if the literal scale is applied by mistake | Medium | deviation documented in `02-token-mapping.md` §6.1 and asserted in the token test        |
| Reskin regressions invisible without baselines                | High   | visual regression in phase 1, before any restyling                                       |
| Double migration for downstream repos (v4 GA then v5)         | Medium | **D2** decides; folding into the RC line avoids it                                       |

## Rough sizing

| Phase                     | Sessions                 |
| ------------------------- | ------------------------ |
| 0 — decisions and assets  | 0.5 + external lead time |
| 1 — tokens and typography | 1–2                      |
| 2 — shape reset           | 1                        |
| 3 — archetypes (10)       | 4–6                      |
| 4 — assets                | 1–2 (after D3)           |
| 5 — family axis           | 1                        |
| 6 — migration tooling     | 1–2                      |
| 7 — docs and demo         | 1–2                      |
| 8 — release               | 0.5                      |
| **Total**                 | **11–17**                |

Phase 3 dominates and is the only phase requiring genuine design decisions rather than
translation.
