# Visual regression harness

Playwright screenshots of the demo deck (`demo/`), one per slide and per program, plus a
WCAG contrast audit. Run it after every restyling step; the full deck is the gate, the
archetype loop is the fast feedback.

Separate from vitest on purpose: specs end in `.pw.ts`, vitest never picks them up.

## Run

```sh
npm run test:visual          # gate: every slide, school + institute (~3 min; ~8 min to update)
npm run test:visual:quick    # 35 archetype slides per program (~1 min)
npm run test:contrast        # WCAG audit -> tests/visual/reports/contrast-<program>.json
npm run test:visual:update   # rewrite the baselines (full deck + archetypes)
```

A failing run leaves `expected`/`actual`/`diff` PNGs under `tests/visual/test-results/`
and an HTML report under `tests/visual/playwright-report/` (`npx playwright show-report
tests/visual/playwright-report`). Both folders are git-ignored, as is `reports/`.

Playwright starts its own server: `npm run prepare-demo && npm run serve:ci`, a
live-server on **port 4243** (4242 is the human `npm run serve`, which opens a browser and
live-reloads) and waits for `http://localhost:4243/demo/index.html`. It reuses a server
already listening on 4243. `dist/` is **not** rebuilt: run `npm run build` first when you
changed `src/`.

Browser: chromium only, 1920x1080, `deviceScaleFactor: 1`. `@playwright/test` is pinned
to the version whose chromium is already in `~/Library/Caches/ms-playwright`; bump it
together with `npx playwright install chromium`.

## Baselines are local artefacts

Baselines are **not** committed (`tests/visual/__screenshots__/` is git-ignored): a
1920x1080 photographic slide weighs ~1.7 MiB, ~800 MiB for the full deck in two
programs. Each restyling cycle generates its own:

1. Check out (or stash back to) the reference state, `npm run build && npm run
   prepare-demo`, then `npm run test:visual:update` — baselines of the reference.
2. Restyle, `npm run build`.
3. `npm run test:visual` and read the diffs: are they the change you meant to make?
4. Accept with `npm run test:visual:update`. Delete orphaned files by hand if slides
   were renamed or removed (Playwright never deletes them).

Baselines live in `tests/visual/__screenshots__/chromium/<program>/`:

- `NNN-h-v-<slug>.png` for the full deck, where `NNN` is the flat slide index, `h`/`v` the
  Reveal indices and `<slug>` the slide's author classes (`first-slide`,
  `transition-left-sfeir-bg-1`) or, for a classless slide, its `h1`/`h2` text. Runtime
  classes (`present`, `has-dark-background`, `tc-specific-slide`) are stripped so a
  restyle cannot rename a file. Inserting a slide shifts the indices after it; that is
  accepted, the slug keeps the file identifiable.
- `archetype-<class>.png` for the quick loop, keyed by archetype so they survive deck
  edits. The list is `ARCHETYPES` in `archetypes.pw.ts`: `basic` is the first classless
  titled slide, the WP3 utilities (`stat`, `glass`, `eyebrow-chips`, `pull-quote`) are
  found by title, a compound archetype (`bg-sand bg-overlay`) needs every class and is
  saved as `archetype-bg-sand+bg-overlay.png`.

Tolerance: `maxDiffPixelRatio: 0.002` (about 4 000 pixels of a 1920x1080 frame),
`animations: 'disabled'`, caret hidden. Do not widen it to make a flaky slide pass; add a
wait or a mask instead.

Size: Playwright only writes PNG, ~1.7 MiB per photographic slide; see above for why the
baselines stay local.

Moving target: a `npm run build` (or `prepare-demo`) from another terminal between two
runs changes what is served on 4243 and fails the next run on every affected slide. Check
`ls -l dist/sfeir-school-theme.css` before blaming flakiness.

## Forcing a program

talk-control reads the program from the query string and copies it to
`.reveal .slides[data-theme]` and `<body data-theme>`:

```
http://localhost:4243/demo/index.html?data-theme=school
http://localhost:4243/demo/index.html?data-theme=institute
http://localhost:4243/demo/index.html?data-theme=conf
```

`PROGRAMS` in `deck.ts` lists what the specs cover (`school`, `institute`); `conf` works
with the same URL but has no baselines.

## What the driver does (`deck.ts`)

- Waits for `.reveal.ready`, `Reveal.isReady()`, `document.fonts.ready`, and asserts the
  `data-theme` attribute.
- Neutralises transitions through the query string (`transition=none&backgroundTransition=none&autoSlide=0`…),
  which Reveal merges into its config at init. Never `Reveal.configure()` after load: it
  rebuilds `.backgrounds` and drops the per-column backgrounds talk-control built for
  `tc-multiple-columns` slides.
- For each slide: `Reveal.slide(h, v, MAX)` so **every fragment is revealed**, then waits
  for every `<img>`/`<video>` in the slide, every CSS `background-image` on the slide, its
  `.slide-background` and the deck `.backgrounds` layer, then two animation frames.
- The Reveal API comes from `window.Reveal`, exposed by the `expose-reveal` plugin in
  `demo/scripts/slides.js` (the ESM build keeps it module-private).

### Masks

None today: two consecutive full runs were pixel-identical for both programs. Add a
selector to `MASKED_SELECTORS` in `deck.ts` only for genuinely non-deterministic content
(clock, random, live data) and record the reason here.

## Contrast audit (`contrast-audit.pw.ts`)

For every rendered text node of every slide: effective foreground (alpha composited)
against the effective background, WCAG 2.x ratio, AA threshold 4.5, or 3.0 for large text
(>= 24px, or >= 18.66px at weight >= 700, measured after Reveal's scale).

Background resolution: ancestors up to the `<section>` (their `::before`/`::after`
surfaces included), then `.slide-background` and its content layer, then `.backgrounds`,
`.reveal`, `body`. A `background-image` on the ancestors or the slide background marks the
node `image` and skips it; the deck-level logo watermark is ignored. Icon-font ligatures
(`.tc-icons`, Material Symbols, Font Awesome, Feather) are not text and are skipped.

It writes `reports/contrast-<program>.json` and prints the failures; it does not fail the
run unless `CONTRAST_STRICT=1` is set. Known pre-existing findings: the highlight.js light
theme tokens (`.hljs-attr` orange, `.hljs-strong` yellow, `.hljs-code` olive on the code
card), `.contrast-opposite` columns on a light slide, and the table header on Emeraude.
