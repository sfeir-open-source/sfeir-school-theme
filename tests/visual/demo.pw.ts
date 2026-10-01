import { test, expect } from '@playwright/test';
import { PROGRAMS, MASKED_SELECTORS, openDeck, gotoSlide } from './deck';

/**
 * Full-deck gate: one screenshot per slide, per program. Soft assertions so one failing
 * slide does not hide the others; the test still fails if any slide differs.
 *
 * Baselines: tests/visual/__screenshots__/chromium/<program>/<index>-<h>-<v>-<slug>.png
 */
for (const program of PROGRAMS) {
    test(`every slide of the demo deck - ${program}`, async ({ page }, testInfo) => {
        const slides = await openDeck(page, program);
        expect(slides.length, 'the deck should have slides').toBeGreaterThan(0);
        testInfo.annotations.push({
            type: 'slides',
            description: `${program}: ${slides.length} slides`,
        });

        const mask = MASKED_SELECTORS.map((selector) => page.locator(selector));
        for (const slide of slides) {
            await gotoSlide(page, slide);
            await expect
                .soft(page, `${program} slide ${slide.name}`)
                .toHaveScreenshot([program, `${slide.name}.png`], { mask });
        }
    });
}
