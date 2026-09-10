# Charte 2026 — Open decisions

Five decisions gate the migration. Each carries a recommendation; none is final until
arbitrated. Format is deliberately ADR-like so the accepted option can be frozen in
place.

---

## D1 — How do School and Institute differentiate without green and blue?

**Context.** The theme's core promise is that one deck serves both programs, switched by
`data-theme`. That switch is currently a hue switch: School = `#0AB580`, Institute =
`#5155F9`. The 2026 charte has a single brand accent (Cuivre) and reserves green and blue
for expertise families, which describe _topics_, not programs. The hue axis is gone and
needs a replacement.

**Options.**

|     | Option                                                                        | On-brand                         | Distinctive | Cost |
| --- | ----------------------------------------------------------------------------- | -------------------------------- | ----------- | ---- |
| A   | Logo only — both programs identical otherwise                                 | ✅ fully                         | ✗ weak      | S    |
| B   | Surface polarity — School light-dominant, Institute dark-dominant             | ✅ fully                         | ✅ strong   | M    |
| C   | One expertise family per program (e.g. Institute = Souverain)                 | ✗ violates "families are topics" | ✅ strong   | S    |
| D   | Polarity on chrome slides only — cover, dividers, closing — content identical | ✅ fully                         | ✅ strong   | M    |

**Recommendation: D.**

Both polarities are first-class in the charte, so nothing has to be invented and no
second accent appears. Program identity is read on the slides where it is actually
looked for — the cover and the dividers — while content slides stay identical across
programs, which is where legibility matters and where both programs must look equally
professional. It also keeps the diff small: only three archetypes become polarity-aware.

Option C should be rejected explicitly: it looks attractive (Institute = Souverain reads
well) but it burns a topic signal on a program distinction, and then an Institute deck
about AI can no longer use Indigo without breaking the one-family rule.

Concretely under D: `data-theme="institute"` flips cover / divider / closing to Noir
Carbone with Cuivre Clair; `school` uses Blanc Craie with Cuivre; `conf` keeps the
neutral, logo-free treatment it has today.

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

| ID  | Decision                | Outcome                            | Status       | Blocks     |
| --- | ----------------------- | ---------------------------------- | ------------ | ---------- |
| D1  | Program differentiation | —                                  | **open**     | phase 3    |
| D2  | Release strategy        | A — v4 GA now, charte as v5.0.0    | **accepted** | phases 1–2 |
| D3  | Lockup source           | B — typographic composition in CSS | **accepted** | phase 4    |
| D4  | Level / techno badge    | B — eyebrow + pill chips, API kept | **accepted** | phase 3    |
| D5  | Legacy escape hatch     | A — clean break                    | proposed     | phase 1    |

Accepted 2026-09-10. D1 is now the only blocker for phase 3; phases 1 and 2 are
unblocked by D2.
