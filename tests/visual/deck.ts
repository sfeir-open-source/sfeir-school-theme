import { expect, type Page } from '@playwright/test';

/**
 * Shared driver for the demo deck. See README.md in this folder.
 *
 * The program (school | institute | conf) is forced through the URL: talk-control reads
 * `?data-theme=<program>` and copies it onto `.reveal .slides[data-theme]` and `body`.
 * The Reveal API is reached through `window.Reveal`, exposed by a one-line plugin in
 * demo/scripts/slides.js (the ESM build of reveal.js has no global otherwise).
 */

export const PROGRAMS = ['school', 'institute'] as const;
export type Program = (typeof PROGRAMS)[number] | 'conf';

export interface SlideRef {
    /** Flat index in `Reveal.getSlides()` order (0-based). */
    index: number;
    h: number;
    v: number;
    /** Author classes from the markdown `<!-- .slide: class="..." -->`, Reveal state classes removed. */
    classes: string[];
    /** Text of the first h1/h2, empty when the slide has none. */
    title: string;
    /** Stable screenshot name: `000-0-0-first-slide` or `012-3-1-une-nouvelle-diapo`. */
    name: string;
}

/**
 * Classes Reveal or talk-control add at runtime; never part of a slide's identity.
 * `has-dark-background` in particular depends on the current styling, so it must not
 * leak into baseline names or a restyle would rename every file.
 */
const REVEAL_STATE_CLASSES = new Set([
    'present',
    'past',
    'future',
    'stack',
    'current-fragment',
    'visible',
    'has-dark-background',
    'has-light-background',
    'tc-specific-slide',
]);

/**
 * Reveal merges the query string into its config at initialisation, so the transitions
 * are neutralised there. Not with `Reveal.configure()` after load: it re-syncs the deck
 * and rebuilds `.backgrounds` from the DOM, after talk-control has already moved the
 * per-column backgrounds of `tc-multiple-columns` slides out of it — every column
 * `data-background` then silently disappears from the screenshots.
 */
const REVEAL_QUERY =
    'transition=none&backgroundTransition=none&autoSlide=0&fragmentInURL=false&hash=false&history=false';

export function deckUrl(program: Program): string {
    return `/demo/index.html?data-theme=${program}&${REVEAL_QUERY}`;
}

declare global {
    interface Window {
        Reveal: Reveal.Api;
    }
}

/**
 * Open the demo for one program, wait for Reveal + markdown + fonts, neutralise
 * transitions and return the flat list of slides.
 */
export async function openDeck(
    page: Page,
    program: Program
): Promise<SlideRef[]> {
    await page.goto(deckUrl(program));
    await page.waitForSelector('.reveal.ready', { timeout: 30_000 });
    await page.waitForFunction(() => window.Reveal?.isReady?.() === true);
    await expect(page.locator('.reveal .slides')).toHaveAttribute(
        'data-theme',
        program
    );

    await page.evaluate(() => document.fonts.ready);
    // The query string must have reached Reveal's config (see REVEAL_QUERY).
    expect(
        await page.evaluate(() => window.Reveal.getConfig().transition)
    ).toBe('none');

    return page.evaluate(
        (stateClasses) => {
            const R = window.Reveal;
            const slugify = (text: string) =>
                text
                    .normalize('NFD')
                    .replace(/[̀-ͯ]/g, '')
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    .slice(0, 48);
            return R.getSlides().map((slide, index) => {
                const { h, v } = R.getIndices(slide);
                const classes = [...slide.classList].filter(
                    (c) => !stateClasses.includes(c)
                );
                const title =
                    slide.querySelector('h1, h2')?.textContent?.trim() ?? '';
                const slug =
                    slugify(classes.join(' ')) || slugify(title) || 'slide';
                const name = `${String(index).padStart(3, '0')}-${h}-${v ?? 0}-${slug}`;
                return { index, h, v: v ?? 0, classes, title, name };
            });
        },
        [...REVEAL_STATE_CLASSES]
    );
}

/**
 * Navigate to a slide with every fragment revealed, then wait until what is on screen is
 * final: fonts, `<img>`/`<video>` in the slide, CSS background images of the slide, its
 * `.slide-background` and the deck-level `.backgrounds` layer, then two animation frames.
 */
export async function gotoSlide(
    page: Page,
    ref: Pick<SlideRef, 'h' | 'v'>
): Promise<void> {
    await page.evaluate(
        async ({ h, v }) => {
            const R = window.Reveal;
            R.slide(h, v, Number.MAX_SAFE_INTEGER);
            await document.fonts.ready;

            const current = R.getCurrentSlide();
            const background = R.getSlideBackground(current) as
                | HTMLElement
                | undefined;
            const scope: Element[] = [
                current,
                ...current.querySelectorAll('*'),
                ...(background
                    ? [background, ...background.querySelectorAll('*')]
                    : []),
                ...document.querySelectorAll(
                    '.reveal .backgrounds, .reveal .slides'
                ),
            ];

            const waits: Promise<unknown>[] = [];
            const once = (el: Element, events: string[]) =>
                new Promise<void>((resolve) => {
                    const done = () => resolve();
                    events.forEach((e) =>
                        el.addEventListener(e, done, { once: true })
                    );
                    setTimeout(done, 5_000);
                });

            for (const el of scope) {
                if (el instanceof HTMLImageElement && !el.complete) {
                    waits.push(once(el, ['load', 'error']));
                }
                if (el instanceof HTMLVideoElement && el.readyState < 2) {
                    waits.push(once(el, ['loadeddata', 'error']));
                }
                const bg = getComputedStyle(el).backgroundImage;
                if (bg && bg !== 'none') {
                    for (const [, url] of bg.matchAll(
                        /url\(["']?([^"')]+)["']?\)/g
                    )) {
                        waits.push(
                            new Promise<void>((resolve) => {
                                const img = new Image();
                                img.onload = img.onerror = () => resolve();
                                img.src = url;
                                setTimeout(resolve, 5_000);
                            })
                        );
                    }
                }
            }
            await Promise.all(waits);
            await new Promise((r) =>
                requestAnimationFrame(() => requestAnimationFrame(r))
            );
        },
        { h: ref.h, v: ref.v }
    );
}

/**
 * Elements masked in every screenshot: nothing today. Add selectors here when a slide
 * carries genuinely non-deterministic content (clock, random, live data) and document
 * the reason in README.md.
 */
export const MASKED_SELECTORS: string[] = [];
