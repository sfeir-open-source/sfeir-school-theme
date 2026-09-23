# Fonts

Three families, each self-hosted as a variable WOFF2 (upright and italic where the
family provides one), subset to `latin` and `latin-ext`. The `@font-face` declarations
live in `src/scss/theme/fonts.scss`; the stacks and the type scale are tokens in
`src/scss/theme/tokens/_typography.scss`.

| Family         | Role                     | Axes            | Upstream |
| -------------- | ------------------------ | --------------- | -------- |
| Epilogue       | display and body         | `wght` 100–900  | https://github.com/Etcetera-Type-Co/Epilogue |
| Space Grotesk  | labels, eyebrows         | `wght` 300–700  | https://github.com/floriankarsten/space-grotesk |
| JetBrains Mono | code and technical data  | `wght` 100–800  | https://github.com/JetBrains/JetBrainsMono |

Files were fetched from the Google Fonts CSS API v2, which serves the same binaries as
the upstream repositories.

## Licences

All three are licensed under the **SIL Open Font License, Version 1.1**. The full text
as shipped by each project is included verbatim:

- `OFL-epilogue.txt` — Copyright 2020 The Epilogue Project Authors
- `OFL-spacegrotesk.txt` — Copyright 2020 The Space Grotesk Project Authors
- `OFL-jetbrainsmono.txt` — Copyright 2020 The JetBrains Mono Project Authors

The OFL permits redistribution alongside this Apache-2.0 project provided the licence
travels with the font files, which is what these three files are for. Reserved Font
Names, where a project declares any, must not be used for a modified version — this
theme ships the fonts unmodified.

## What this replaced

The v4 theme shipped 25 static TTF files totalling 4.1 MB: Poppins (15 faces), Consolas
(5 files) and Inconsolata (2 files).

Two reasons they are gone, beyond the charte:

1. **Consolas is proprietary** — a Microsoft typeface with no redistribution licence,
   shipped from a repository published under Apache-2.0. That exposure is now cleared.
2. **Poppins is explicitly superseded.** The SFEIR brand guidelines name it as the old
   family and list its use as a mistake to avoid.

Payload: **4.1 MB → 289 KB**, a 93% reduction, and variable axes replace the static
weight grid.
