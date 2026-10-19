# design/

Reference material that informs the theme but is **not** part of the published package
(`scripts/prepare-publish.ts` copies `docs/` into the npm tarball, so binaries cannot live
there).

- `charte-2026/` — the official 2026-2027 material: theme and master pptx, logos, background
  photos. Heavy binaries (`FONDS/`, `*.pptx`, `*.zip`, `*.psd`) are git-ignored; ask the brand
  team or the theme maintainer for a copy. Logo sources (`*.ai`, `*.png`) are tracked.

The derived web assets live in `public/images/`; `public/images/manifest.json` records each
asset's provenance in this folder. Analysis: `docs/charte-2026/05-reference-analysis.md`.

## What was not shipped, and why

From `FONDS/` (10 photos delivered, 7 shipped):

| File                           | What it is                                | Why not                                                                                  |
| ------------------------------ | ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| `AdobeStock_1843169200.jpeg`   | large soft gold bokeh, bright (36 % luma) | needs an overlay or a glass card for any text; the pptx only uses it cropped inside cards |
| `AdobeStock_1659615049.jpeg`   | brushed gold / brass metal, lit from the right | mixed polarity, text-safe on the left half only; not used by the pptx                |
| `AdobeStock_2151501174.jpeg`   | gold ribbon swoosh on dark, 40 MB         | needs an overlay in the swoosh; redundant with `bg-arc`; not used by the pptx            |

The three are heavy (11–40 MB), overlay-dependent and redundant with the shipped set.
Sources stay here for a future hero-band archetype. Conversely, two photos the pptx _does_
use (`AdobeStock_2017205393-b`, dark slate rock; `AdobeStock_2009521782`, rock with gold
flecks) are **not in `FONDS/`** and were re-encoded from the 2048 px embeds of
`Theme SFEIR 26_27.pptx` (`bg-slate-rock-dark.webp`, `bg-rock-gold-flecks-dark.webp`); the
originals are requested from the brand team.

From `LOGOS/` (15 files, 9 derived into `public/images/logos/`):

| File(s)                                                      | Why not                                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `logo-wenvision.png`, `WENvision-blanc.png`, `WEnvsion-noir.png` | WENvision is the group's consulting brand, not a training programme    |
| `LOGO_NOIR copy.png`                                         | "S.D sfeir.dev" app icon, not a slide asset                               |
| `logo-sfeir-blanc(1).png`                                    | byte-different re-export of `logo-SFEIR-blanc.png`, identical pixels      |
| `Logo-burger-gris.png`                                       | large-padding variant whose brackets did not render; `Logo-Corp_Burger-Gris-Charte.png` is the one on every pptx slide |
| `logo-SFEIR-gris.psd`                                        | layered source of the grey wordmark; the `.ai` vector is used instead     |

Also not shipped: `Tagline.png` and `Bannières linkedin.png` (cover art composed from the
wordmark and the gold-dust photo — the theme composes the same in CSS), and any SFEIR
School lockup, because none exists in the delivered material (decision D3).
