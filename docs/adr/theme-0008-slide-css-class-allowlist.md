# theme-0008. CSS class allow-list for slides

### Submitters

- Jean-François Garreau (SFEIR)

## Change Log

- [pending](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-09-23
- [amended](https://github.com/sfeir-open-source/sfeir-school-theme/pull/159) 2026-10-14 — classes on converted tags (image titles) must also be registered as known styles; wrong `{.class}` example removed

## Referenced Use Case(s)

No formal use-case document exists. This ADR is self-motivating — see
Context below.

## Context

`check-slides.ts` (`S_009`) checks that every CSS class used in a slide is
defined somewhere known. This catches typos and classes left over from a
removed stylesheet.

A class reaches the rendered slide through two different channels:

- **A direct class attribute**, e.g. `<!-- .slide: class="…" -->` or
  `<!-- .element: class="…" -->`. The class is applied as written.
- **A converted tag**, e.g. the words of an image title
  `![](./assets/images/logo.png 'company')`. At render time, talk-control
  turns a title word into a class **only if it is a known style**: either
  one of talk-control's built-in styles (`company`, `speaker`, `center`,
  `w-…`, `h-…`, …) or one the project registers in the `knowStyles` option
  of `SfeirThemeInitializer.init()` in `slides/scripts/slides.js`. Any
  other word silently stays in the `title` attribute (a tooltip), even if
  a stylesheet defines it.

So a class defined in CSS but not registered in `knowStyles` never applies
to an image, with no error: the exact silent failure this check exists to
prevent.

One exception: talk-control extensions handle an image title holding
`tc-icons` (icons) or `tc-qrcode` (QR codes) themselves, and apply every
word of that title as a class, except the icon-pack keyword (`fa`,
`feather`, `material-symbols`), which only selects the pack. Those titles are a direct class channel,
not a converted one.

## Proposed Design

- **Every class reaching a slide must be defined** in a known stylesheet:
  the theme's compiled CSS, the project's `slides/css/slides.css`, a file
  listed in `extraCssFiles` ([[theme-0012-bounded-config-overrides]]), or
  one of the few classes the theme applies itself at runtime.
- **Every class used in a converted tag must also be registered** as a
  known style: a talk-control built-in, or an entry of the project's
  `knowStyles`.
- Image titles holding `tc-icons` or `tc-qrcode` are checked like a direct
  class attribute: defined in a known stylesheet, no registration needed.
  The icon-pack keyword is not a class and is not checked.
- A class that fails either rule is a hard failure.

## Considerations

- **Downgrade to a warning, to tolerate experimentation.** Rejected: a
  silently ignored class is exactly the small, hard-to-spot bug this check
  exists to catch.
- **Declare known styles in `.sfeir-theme-config.json` instead of
  `slides.js`.** Rejected: `knowStyles` already has to be passed to
  `init()` for the rendering to work. A second list would drift from it.
- **Known gaps.** The check reads classes from lines starting with
  `<!--` and from single-quoted image titles on lines starting with `![`.
  Not checked today:
  - classes in raw HTML tags (`<div class="…">`);
  - an inline `<!-- .element: class="…" -->` placed after content on the
    same line;
  - double-quoted image titles.

## Decision

- A class used in a slide must be defined in a known stylesheet (`S_009`).
- A class introduced through a converted tag, such as an image title word,
  must additionally be registered: a talk-control built-in style or the
  project's `knowStyles` in `slides/scripts/slides.js`.
- Talk-control icon and QR-code titles (`tc-icons …`, `tc-qrcode`) are
  exempt from registration, not from the stylesheet rule.
- Both rules are hard failures of the `check` command.

## Other Related ADRs

- [[theme-0005-slide-declaration-contract]] - the slide list this check walks, and `slides.js`
- [[theme-0012-bounded-config-overrides]] - `extraCssFiles` source

## References

- [`cli/command/check/check-slides.ts`](../../cli/command/check/check-slides.ts) - `S_009`
- [`cli/utils/css.utils.ts`](../../cli/utils/css.utils.ts) - class extraction and known stylesheets
- [`src/js/sfeir-theme-initializer.ts`](../../src/js/sfeir-theme-initializer.ts) - `knowStyles` option
- [talk-control-revealjs-extensions](https://github.com/TalkControl/talk-control-revealjs-extensions) - styled-image rendering and built-in known styles
