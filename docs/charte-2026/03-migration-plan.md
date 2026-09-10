# Charte 2026 — Migration plan

Branch: `feat/charte-2026`. Target release: **v5.0.0**.

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

## Phase 1 — Foundation: tokens and typography

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

## Phase 4 — Assets

1. Redraw the background set. 15 legacy rasters collapse to a small structural set
   (flat Noir, flat Craie, Craie-1 lift, plus at most three structural variants).
   Every retired class keeps resolving per `02-token-mapping.md` §7.
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
