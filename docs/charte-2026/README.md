# Charte 2026 — SFEIR School & Institute theme

Study and migration plan for aligning `sfeir-school-theme` with the **SFEIR 2026-2027
identity** — the `sfeir-brand-guidelines` skill (The Sharp Artisan, v2026.1) as the
starting point, superseded where it disagrees by the official theme and MasterPrez
delivered on 2026-10-01.

| Document                                               | Purpose                                                                                      |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| [`01-audit.md`](./01-audit.md)                         | Inventory of the v4 theme and gap analysis against the skill (with a superseded-facts note) |
| [`02-token-mapping.md`](./02-token-mapping.md)         | Shipped token architecture, legacy → new mapping, type scale, class → photo mapping, backgrounds, deprecation policy |
| [`03-migration-plan.md`](./03-migration-plan.md)       | Work packages and their status, the original eight phases, testing strategy, risk register |
| [`04-open-decisions.md`](./04-open-decisions.md)       | Five gating decisions, ADR-style, with their 2026-10-01 revisions                           |
| [`05-reference-analysis.md`](./05-reference-analysis.md) | Analysis of the official material: pptx theme, layouts, logos, photos, discrepancies with the skill |
| [`06-authoring-guide.md`](./06-authoring-guide.md)     | How to write an on-brand slide with this theme, and the anti-patterns                        |

## Headline findings

1. **The green/blue program axis is gone — copper carries both programs.** The official
   identity is monochrome: copper `#E4AA5D`, warm neutrals, photos. Institute takes the
   corporate copper outright. School keeps **Émeraude as a signature only** — eyebrow,
   markers, underlines, chips — never a fill, background or numeral (D1, revised
   2026-10-01). Fills, cards and photos are identical in both programs.
2. **Six expertise families remain for the topic axis.** Ocre and Émeraude are spent on
   the programs, so the opt-in `data-family` axis of phase 5 draws from the other six.
   The official deck uses no family colour, so the axis stays optional.
3. **The neutrals barely move; the backgrounds came back as photos.** The greys were
   already within a few ΔE of the ramp. The official master puts a photo under every slide
   with no overlay; the theme ships nine WebP photos on a flat `#181A1F` / `#F9F9F9`
   fallback, with an opt-in `bg-overlay` scrim for weak projectors.
4. **Two deliberate deviations, for training rooms.** Accent _text_ on light is `#845400`
   (the official `#E4AA5D` on `#F9F9F9` is 1.95:1), and body stays at 40 px against the
   pptx's 10–14 pt. Both documented and asserted in tests.
5. **Contrast is computed, never transcribed.** None of the skill's six published ratios
   was correct; the official deck itself fails AA on its light eyebrows. Every pair the
   theme uses is asserted with `color.utils.ts`.
6. **CSS now has a test surface.** Token values, contrast guarantees and the resolution
   invariant are vitest; the reskin is covered by a Playwright visual harness
   (`tests/visual/`) whose baselines are local artefacts, not committed.
7. **The Institute lockup exists; the School one does not.** The brand team's folder
   holds an official Institute vector (2020, still used in the 2026 MasterPrez), shipped
   in `public/images/logos/`. Both covers nonetheless compose their lockup in CSS on that
   geometry so the two read as siblings; the official School sibling is requested (D3).

## Status

Study complete. **Phase 0 closed** — all five decisions arbitrated; D1, D3 and D4 revised
2026-10-01 against the official material. **Work packages 1–3 landed** on
`feat/charte-2026`: tokens and type, photo backgrounds, marks and cover, archetypes and
utilities. **WP0** delivered: Playwright harness on port 4243, baselines kept as local
artefacts. **WP4** (this documentation) done.

Next: regenerate the README screenshots, phase 5
(families) and phase 6 (codemod rules for the new names), then `5.0.0-rc-1`.
