# Charte 2026 — Open decisions

Five decisions gated the migration. All are now arbitrated; the outcome of each is
frozen in the log at the bottom. Format is deliberately ADR-like.

---

## D1 — How do School and Institute differentiate without green and blue?

**Status: accepted 2026-09-10 — option E, a copper-derived green accent for School
("Bronze", hue 85).**

**Context.** The theme's core promise is that one deck serves both programs, switched by
`data-theme`. That switch is currently a hue switch: School = `#0AB580`, Institute =
`#5155F9`. The 2026 charte has a single brand accent (Cuivre) and reserves green and blue
for expertise families, which describe _topics_, not programs. The hue axis is gone and
needs a replacement.

**Options considered.**

|     | Option                                                                        | On-brand                         | Distinctive | Cost |
| --- | ----------------------------------------------------------------------------- | -------------------------------- | ----------- | ---- |
| A   | Logo only — both programs identical otherwise                                 | ✅ fully                         | ✗ weak      | S    |
| B   | Surface polarity — School light-dominant, Institute dark-dominant             | ✅ fully                         | ✅ strong   | M    |
| C   | One expertise family per program (e.g. Institute = Souverain)                 | ✗ violates "families are topics" | ✅ strong   | S    |
| D   | Polarity on chrome slides only — cover, dividers, closing — content identical | ✅ fully                         | ✅ strong   | M    |
| E   | **Institute keeps Cuivre; School gets a copper-derived green accent**         | ⚠ second accent — see below     | ✅ strong   | M    |

**Accepted: E.** The hue axis is restored rather than replaced, which keeps the mental
model trainers already have (School and Institute are two colours) and needs no new
mechanism — `data-theme` keeps doing exactly what it does today.

### Why a second accent is defensible here

The charte admits one accent and caps a slide at "Cuivre + one expertise family, never
three". A School green is a genuine deviation from the letter. It is defensible only
because the green is **derived from copper itself**, not chosen beside it:

- **Institute — Cuivre.** The polished metal. The corporate accent, unchanged.
- **School — Bronze.** Copper alloyed with tin. A warm olive green, literally a
  _vert cuivré_: green and copper coexist in the hue.

The rejected third derivation was **Patine** (verdigris, hue 168) — copper oxidised by
time. Better narrative, prettier green, and it failed on a technical point, not an
aesthetic one: see the family-collision test below.

### The ramp

Five tiers mirroring Cuivre's structure, each solved for **Cuivre's measured luminance**
at that tier rather than picked by eye:

| Tier      | Cuivre (Institute) | Bronze (School) |
| --------- | ------------------ | --------------- |
| `deep`    | `#5D3A00`          | `#35471D`       |
| `primary` | `#845400`          | `#4D662A`       |
| `fill`    | `#E5A040`          | `#9CB774`       |
| `on-dark` | `#FFB95C`          | `#B4D08D`       |
| `wash`    | `#FFDDB7`          | `#DAE8C6`       |

Contrast parity, recomputed (WCAG 2.1), worst divergence **0.07**:

| Pair                      | Cuivre | Bronze | Patine | Max Δ |
| ------------------------- | -----: | -----: | -----: | ----: |
| `primary` on Blanc Craie  |   6.14 |   6.14 |   6.10 |  0.04 |
| `primary` on pure white   |   6.46 |   6.46 |   6.42 |  0.04 |
| `fill` on Noir Carbone    |   9.43 |   9.44 |   9.45 |  0.02 |
| `on-dark` on Noir Carbone |  12.35 |  12.35 |  12.30 |  0.05 |
| `wash` on Noir Carbone    |  16.28 |  16.34 |  16.27 |  0.07 |
| `deep` on pure white      |  10.14 |  10.14 |  10.08 |  0.06 |
| `deep` on `fill`          |   4.56 |   4.56 |   4.54 |  0.02 |

This parity is the point: one contrast rule in the theme covers both programs, so every
AA guarantee is written once and no archetype needs a per-program special case.

Cuivre's trap is inherited unchanged — `primary` on Noir Carbone reaches only 3.25
(Cuivre), 3.25 (Bronze), 3.27 (Patine), **failing AA in all three**. That is exactly why
the `on-dark` tier exists and why `--sfeir-accent` must switch by itself on dark
surfaces.

### The family-collision test

The families carry a deck's _topic_, the accent carries its _program_. If the two hues
resemble each other the reader cannot separate them, and the "one family per slide" rule
loses its meaning. Hue distance to the nearest of the eight families:

| Candidate  | Hue  | Nearest family | Distance                                             |
| ---------- | ---- | -------------- | ---------------------------------------------------- |
| Cuivre     | 38°  | Ocre           | 3° — deliberate: Ocre _is_ Cuivre Poli               |
| **Bronze** | 85°  | Ocre           | **50° — the only gap in the wheel**                  |
| Patine     | 168° | Canard         | 18° — sits between Canard (186°) and Émeraude (146°) |

Bronze occupies the one empty arc of the colour wheel. Patine would put a School deck on
Software & MACH at 18° between its program accent and its family accent.

### Consequences

- `data-theme` stays a hue switch; **decision D1's earlier recommendation (option D,
  surface polarity) is superseded** — polarity remains available as an aesthetic choice
  but no longer carries the program signal.
- The token layer gains a program axis: `--sfeir-accent` and friends resolve from a
  Cuivre or Bronze ramp under `[data-theme]`, orthogonal to the `[data-family]` axis.
- `conf` keeps the neutral, logo-free treatment it has today.
- Bronze must be submitted to the brand team as a documented deviation, with the
  copper-alloy rationale and the contrast-parity table above.

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
| D1  | Program differentiation | E — Institute Cuivre, School Bronze | **accepted** | phase 3    |
| D2  | Release strategy        | A — v4 GA now, charte as v5.0.0     | **accepted** | phases 1–2 |
| D3  | Lockup source           | B — typographic composition in CSS  | **accepted** | phase 4    |
| D4  | Level / techno badge    | B — eyebrow + pill chips, API kept  | **accepted** | phase 3    |
| D5  | Legacy escape hatch     | A — clean break                     | **accepted** | phase 1    |

All five arbitrated as of 2026-09-10 (D5 accepted as proposed). Phase 0 is closed;
no decision blocks implementation.
