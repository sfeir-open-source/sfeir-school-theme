# Charte 2026 — SFEIR School & Institute theme

Study and migration plan for aligning `sfeir-school-theme` with the **SFEIR Brand
Guidelines — The Sharp Artisan (v2026.1)**, distributed as the `sfeir-brand-guidelines`
Claude Code skill.

| Document                                         | Purpose                                                                                      |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| [`01-audit.md`](./01-audit.md)                   | Inventory of the existing theme, gap analysis against the charte, and what already aligns    |
| [`02-token-mapping.md`](./02-token-mapping.md)   | Token architecture, legacy → new mapping, type scale, class-name mapping, deprecation policy |
| [`03-migration-plan.md`](./03-migration-plan.md) | Eight phases, testing strategy, risk register, sizing                                        |
| [`04-open-decisions.md`](./04-open-decisions.md) | Five gating decisions with recommendations                                                   |

## Headline findings

1. **The green/blue program axis is gone — and was rebuilt from the families.** The
   charte has one accent (Cuivre) plus eight expertise families. Resolved by D1:
   Institute takes **Ocre**, School takes **Émeraude**. The two programs no longer share
   a contrast profile, so each ramp is verified on its own.

2. **Six expertise families remain for the topic axis.** Ocre and Émeraude are spent on
   the programs, so the opt-in `data-family` axis of phase 5 draws from the other six.
   That is the acknowledged price of D1.
3. **The neutrals barely move.** The current greys are already within a few ΔE of the
   Craie ramp, so the reskin is hue- and shape-driven, not structural. Lower risk than it
   first appears.
4. **The type scale needs one deliberate deviation.** The charte is calibrated for pptx
   read at laptop distance; a literal transposition puts body text at 29 px on a 1080 px
   canvas. Body stays at 40 px for training-room projectors — documented, asserted in a
   test, not left to chance.
5. **The charte's contrast table is unreliable.** None of its six published ratios is
   correct and the errors run both ways. One of them matters: Cuivre on white is 6.46:1
   (AA), not the 7.6:1 (AAA) claimed. Contrast must be computed, never transcribed.
6. **CSS has no test coverage today**, and `conductor/workflow.md` exempts it. Visual
   regression baselines have to land _before_ any restyling, or the whole reskin ships
   unverified.
7. **One external dependency**: no SFEIR School or Institute lockup exists in
   the 2026 identity. Decision **D3** proposes composing them typographically instead of
   waiting on assets.

## Status

Study complete. **Phase 0 closed** — all five decisions arbitrated; D1 revised
2026-09-14 to the Ocre / Émeraude families. **Phase 1 done** — token layer and
typography landed. **Backgrounds pulled forward from phase 4** — all imagery replaced by
flat Noir Carbone. 241 tests green.

Next: phase 2 (shape reset — radius 0, no shadows, no gradients), and the visual
regression baselines that phase 1 skipped and phase 3 cannot start without.
