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

1. **The green/blue program axis is gone.** The charte has one accent (Cuivre) and
   reserves green and blue for expertise families, which describe topics, not programs.
   School and Institute have to differentiate on another axis — see decision **D1**.
2. **The expertise families are the opportunity.** Eight families × four variants map
   naturally onto a deck's technology, which is exactly how this theme is consumed. A new
   opt-in `data-family` axis gives every school its own on-brand accent.
3. **The neutrals barely move.** The current greys are already within a few ΔE of the
   Craie ramp, so the reskin is hue- and shape-driven, not structural. Lower risk than it
   first appears.
4. **The type scale needs one deliberate deviation.** The charte is calibrated for pptx
   read at laptop distance; a literal transposition puts body text at 29 px on a 1080 px
   canvas. Body stays at 40 px for training-room projectors — documented, asserted in a
   test, not left to chance.
5. **CSS has no test coverage today**, and `conductor/workflow.md` exempts it. Visual
   regression baselines have to land _before_ any restyling, or the whole reskin ships
   unverified.
6. **One blocking external dependency**: no SFEIR School or Institute lockup exists in
   the 2026 identity. Decision **D3** proposes composing them typographically instead of
   waiting on assets.

## Status

Study complete. Phase 0 (decisions) open — nothing implemented yet.
