import { test, expect } from '@playwright/test';
import { PROGRAMS, MASKED_SELECTORS, openDeck, gotoSlide } from './deck';

/**
 * Quick loop: one representative slide per archetype, per program. Names are keyed by
 * archetype, not by slide position, so they survive slides being added to the deck.
 *
 * Baselines: tests/visual/__screenshots__/chromium/<program>/archetype-<name>.png
 */
export const ARCHETYPES = [
    'first-slide',
    'transition',
    // the first classless slide with a title: a plain content slide
    'basic',
    'speaker-slide',
    'exercice',
    'quote-slide',
    'with-code',
    'with-code-dark',
    'bg-blur',
    // every transition-bg-* used in demo/markdown
    'transition-bg-sfeir-1',
    'transition-bg-sfeir-2',
    'transition-bg-sfeir-3',
    'transition-bg-blue-1',
    'transition-bg-blue-2',
    'transition-bg-blue-3',
    'transition-bg-green-1',
    'transition-bg-green-2',
    'transition-bg-green-3',
    'transition-bg-green-4',
    'transition-bg-green-5',
    'transition-bg-green-6',
    // photo classes (v5)
    'bg-plaster',
    'bg-dust',
    'bg-arc',
    'bg-rock',
    'bg-flecks',
    'bg-bokeh',
    'bg-brown',
    'bg-sand',
    'bg-sand bg-overlay',
    'bg-pour',
    // WP3 utilities, demo/markdown/04-specifics/25_charte_2026.md, keyed by title
    'stat',
    'glass',
    'eyebrow-chips',
    'pull-quote',
] as const;

// Archetypes found by their slide title rather than a class.
const BY_TITLE: Record<string, string> = {
    stat: 'Trois chiffres clés',
    glass: 'Une carte de verre',
    'eyebrow-chips': 'Eyebrow et chips',
    'pull-quote': 'Une citation en exergue',
};

for (const program of PROGRAMS) {
    test(`archetype slides - ${program}`, async ({ page }, testInfo) => {
        const slides = await openDeck(page, program);
        const mask = MASKED_SELECTORS.map((selector) => page.locator(selector));
        const missing: string[] = [];

        for (const archetype of ARCHETYPES) {
            const slide = slides.find((s) => {
                switch (archetype) {
                    // The plain transition slide, not a transition-bg-* one.
                    case 'transition':
                        return (
                            s.classes.includes('transition') &&
                            !s.classes.some((c) =>
                                c.startsWith('transition-bg-')
                            )
                        );
                    case 'basic':
                        return s.classes.length === 0 && s.title.length > 0;
                    // The bare photo, not its `bg-overlay` variant.
                    case 'bg-sand':
                        return (
                            s.classes.includes('bg-sand') &&
                            !s.classes.includes('bg-overlay')
                        );
                    default:
                        if (archetype in BY_TITLE)
                            return s.title === BY_TITLE[archetype];
                        // Every class of a compound archetype ('bg-sand bg-overlay').
                        return archetype
                            .split(' ')
                            .every((c) => s.classes.includes(c));
                }
            });
            if (!slide) {
                missing.push(archetype);
                continue;
            }
            testInfo.annotations.push({
                type: 'archetype',
                description: `${archetype} -> ${slide.name}`,
            });
            await gotoSlide(page, slide);
            await expect
                .soft(page, `${program} archetype ${archetype} (${slide.name})`)
                .toHaveScreenshot(
                    [program, `archetype-${archetype.replace(' ', '+')}.png`],
                    { mask }
                );
        }

        expect(missing, 'archetypes with no slide in the demo deck').toEqual(
            []
        );
    });
}
