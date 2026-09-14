# Charte 2026 — Open decisions

Five decisions gated the migration. All are now arbitrated; the outcome of each is
frozen in the log at the bottom. Format is deliberately ADR-like.

---

## D1 — How do School and Institute differentiate without green and blue?

**Status: revised and accepted 2026-09-14 — option C, one expertise family per program.
Institute = Ocre, School = Émeraude.**

> Supersedes the 2026-09-10 acceptance of option E (Institute Cuivre, School Bronze).
> The Bronze ramp and its copper-alloy rationale are kept below as rejected history,
> because the contrast reasoning it produced still applies to the replacement.

**Context.** The theme's core promise is that one deck serves both programs, switched by
`data-theme`. That switch is currently a hue switch: School = `#0AB580`, Institute =
`#5155F9`. The 2026 charte has a single brand accent (Cuivre) and eight expertise
families.

**Accepted: option C.** Each program takes an expertise family:

| Program   | Family   | light     | medium    | primary   | dark      |
| --------- | -------- | --------- | --------- | --------- | --------- |
| Institute | Ocre     | `#FFF0D6` | `#F2C878` | `#E5A040` | `#845400` |
| School    | Émeraude | `#C8F5D6` | `#6BC68F` | `#2E8B57` | `#0D5A2E` |

Ocre is the charte core under another name — its `primary` is Cuivre Poli and its `dark`
is Cuivre — so Institute keeps the corporate copper. School gets a green again, which is
the continuity trainers expect.

### The cost, stated once

This is the option the 2026-09-10 analysis rejected, on the grounds that families
describe _topics_, not programs. That objection still holds and is now a deliberate
trade-off: **Ocre and Émeraude are spent, and can no longer be used as topic accents.**
A School deck on Data & Product cannot take Émeraude, and an Institute deck on Services
Managés cannot take Ocre, without colliding with their own program colour. The remaining
six families stay available for the `data-family` axis in phase 5.

### Ramp mapping

The four family variants do not map one-to-one onto the five tiers the theme needs, so
each tier is assigned by what it is _for_ and verified against WCAG:

| Tier      | Ocre                     | Émeraude          |
| --------- | ------------------------ | ----------------- |
| `wash`    | light `#FFF0D6`          | light `#C8F5D6`   |
| `on-dark` | medium `#F2C878`         | medium `#6BC68F`  |
| `fill`    | primary `#E5A040`        | primary `#2E8B57` |
| `accent`  | dark `#845400`           | dark `#0D5A2E`    |
| `on-fill` | Cuivre Profond `#5D3A00` | Noir `#000000`    |

### Contrast, recomputed

Unlike the Cuivre/Bronze pair, these are two independent charte palettes, so **they do
not share a contrast profile.** The "one contrast rule for both programs" property is
gone; each ramp is asserted against the thresholds on its own.

| Guarantee                             |      Ocre |  Émeraude |
| ------------------------------------- | --------: | --------: |
| `accent` on Blanc Craie (body text)   |   6.14 AA |  7.92 AAA |
| `on-dark` on Noir Carbone (body text) | 13.31 AAA | 10.10 AAA |
| `on-fill` on `fill`                   |   4.56 AA |   4.95 AA |
| `deep` on `wash` (selection)          |  9.02 AAA |   6.94 AA |
| `fill` on Noir Carbone (large shapes) |  9.43 AAA |  4.95 AAA |

Two traps, both preserved and both asserted as _failing_ so the on-dark tier keeps its
reason to exist:

- `accent` on Noir Carbone — Ocre 3.25, Émeraude **2.52**. Émeraude's is the worse of
  the two, which is why the polarity axis had to cover every newly-black archetype.
- `fill` as text on Blanc Craie — Ocre 2.11, Émeraude 4.03.

**Émeraude's fill is the tight one.** `#2E8B57` sits mid-dark (L=36%), so text on it has
exactly one legal colour: white reaches 4.25:1, the family's own light variant 3.54:1,
Charcoal 4.06:1 — all failing. Only `#000000` clears AA, at 4.95:1. That is encoded in
the ramp rather than left to slide authors.

### Rejected: option E — Cuivre and Bronze

The 2026-09-10 decision paired Institute Cuivre with a School "Bronze" (`#4D662A`,
hue 85°), derived by solving each tier for the measured luminance of its Cuivre
counterpart. It gave both programs an identical contrast profile — one rule instead of
two — and sat 50° from every expertise family, the only such gap on the wheel.

It was dropped in favour of using the charte's own families, which are recognisable to
anyone who already knows the brand and need no invented colour to be defended.

### Consequences

- `data-theme` stays a hue switch; the surface-polarity option (D) is not needed to
  carry the program signal and remains available as a purely aesthetic choice.
- Ocre and Émeraude are removed from the `data-family` pool in phase 5.
- `conf` keeps the neutral, logo-free treatment it has today.

---

## D2 — Does the charte ship as v5, or fold into the current v4 RC line?

**Context.** `main` is at `4.0.0-rc-16`. The v4 line already carries a large structural
change (the talk-control extraction, plus the new CLI) and downstream repositories are
already tracking RC builds. The charte is sized at 11–17 sessions.

**Options.**

- **A — Ship v4.0.0 GA now with the current identity; charte becomes v5.0.0.**
  Downstream repos migrate twice, but each migration is a codemod run and the v4→v5 rule
  set is mostly variable renames. Unblocks the CLI and talk-control work immediately.
- **B — Fold the charte into the RC line and release v4.0.0 GA with the new identity.**
  One migration for downstream, but v4 GA slips by three to four months and the RC line
  acquires a visual identity change mid-flight.

**Recommendation: A.**

Holding a finished, useful release hostage to a multi-month design project is the larger
cost. A full visual identity change also deserves its own major on semver grounds, and
the deprecation policy in `02-token-mapping.md` §8 means no deck breaks at v5 — each
school upgrades when it chooses. `feat/charte-2026` becomes a long-lived branch rebased
on `main` periodically.

This is the one decision that unblocks phases 1 and 2, so it is the first to settle.

---

## D3 — Where do the School and Institute lockups come from?

**Context.** The `sfeir-brand-guidelines` skill bundles only `logo-sfeir-white.png` and
`logo-sfeir-grey.png` (corporate, 3:1, raster). It contains no School lockup, no
Institute lockup, and no vector asset. The current theme ships 13 WebP marks that all
belong to the previous identity.

**Options.**

- **A — Request the 2026 lockups from the brand team, in SVG.** Authoritative, but
  external lead time, and it adds two more raster-or-vector assets per program per
  polarity to maintain.
- **B — Compose the lockups typographically in the theme:** the corporate SFEIR mark
  (SVG) plus a Space Grotesk uppercase, positively tracked `SCHOOL` / `INSTITUTE` label,
  laid out in CSS.

**Recommendation: B, validated by the brand team.**

The charte's own vocabulary is exactly this — Space Grotesk uppercase labels with
+0.06 to +0.18em tracking are how it names things. A typographic lockup needs no asset
beyond the corporate mark, scales perfectly at any projector resolution, adapts to both
polarities from a single source, and can carry the program name in another language for
free. It is also the better DX answer: one SVG instead of thirteen rasters.

The corporate SVG mark is still required either way, and remains a genuine external
dependency. If the brand team already holds official 2026 lockups, they win — but the
theme should not block on their existence.

---

## D4 — Keep the level and techno badge on the cover?

**Context.** `title-slide.scss` renders a `sfeir-logo` badge carrying
`data-sfeir-techno` (50 px uppercase, weight 800) and 1–3 `star.webp` sprites for
`sfeir-level`. Both attributes are public API, documented in the README and used by every
school. The charte's cover layout has no such device.

**Options.**

- **A — Retire both attributes.** Cleanest against the charte, but drops information
  attendees actually use to pick a deck, and breaks a documented API.
- **B — Reinterpret in charte vocabulary:** techno becomes part of the Space Grotesk
  eyebrow (`SFEIR SCHOOL · ANGULAR · NIVEAU 2`), level becomes 1–3 pill chips — pill
  chips being one of the two explicitly allowed radius exceptions.

**Recommendation: B.**

The attributes stay, so no downstream deck changes; only the rendering does. The level
signal is pedagogically real and the charte already provides the two components needed to
express it. The star sprites and `logo_empty.webp` are retired as assets.

---

## D5 — Ship a legacy-charte escape hatch?

**Context.** A `data-charte="legacy"` switch could keep both identities in the same
build, letting a repository upgrade the theme without re-checking its slides.

**Options.**

- **A — Clean break.** v5 ships one identity. Legacy _token names_ still resolve
  (`02-token-mapping.md` §4), so slides do not break — they render in Cuivre.
- **B — Dual charte** behind an attribute, removed in v6.

**Recommendation: A.**

Every school pins a theme version, so a repository that is not ready simply stays on v4 —
the escape hatch already exists and costs nothing. Option B would double the CSS payload
and the maintenance surface of every archetype for a need that versioning already covers.
KISS wins here.

---

## Decision log

| ID  | Decision                | Outcome                             | Status       | Blocks     |
| --- | ----------------------- | ----------------------------------- | ------------ | ---------- |
| D1  | Program differentiation | C — Institute Ocre, School Émeraude | **accepted** | phase 3    |
| D2  | Release strategy        | A — v4 GA now, charte as v5.0.0     | **accepted** | phases 1–2 |
| D3  | Lockup source           | B — typographic composition in CSS  | **accepted** | phase 4    |
| D4  | Level / techno badge    | B — eyebrow + pill chips, API kept  | **accepted** | phase 3    |
| D5  | Legacy escape hatch     | A — clean break                     | **accepted** | phase 1    |

All five arbitrated. D1 was revised on 2026-09-14, replacing the Cuivre/Bronze pair
with the Ocre and Émeraude expertise families. Phase 0 is closed.
