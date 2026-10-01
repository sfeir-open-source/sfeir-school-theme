import { contrastRatio, wcagLevel } from './tokens/color.utils';
import { describe, expect, it } from 'vitest';
import { parseCustomProperties, varRefs } from './tokens/tokens.utils';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const read = (file: string) => fs.readFileSync(path.join(DIR, file), 'utf-8');

const palette = parseCustomProperties(read('tokens/_palette.scss'));
const speaker = parseCustomProperties(read('speaker-slide.scss'));

/** Resolve a one-hop `var(--x)` reference into its palette literal. */
const resolve = (token: string) => {
    const value = speaker.get(token);
    if (!value)
        throw new Error(`--${token} is not declared in speaker-slide.scss`);
    const [ref] = varRefs(value);
    const literal = ref ? palette.get(ref) : value;
    if (!literal)
        throw new Error(`--${token} does not resolve into the palette`);
    return literal;
};

const GLASS = /^rgb\((\d+) (\d+) (\d+) \/ ([\d.]+)\)$/;

/**
 * A translucent surface has no contrast of its own: composite it over a backdrop first.
 * The backdrop is the photo under the card, so it is checked at Carbone (the flat
 * fallback) and at a mid grey, a pessimistic reading of the slate-rock photo.
 */
const composite = (glass: string, backdrop: string) => {
    const match = GLASS.exec(glass);
    if (!match) throw new Error(`Not a glass colour: "${glass}"`);
    const alpha = Number.parseFloat(match[4]);
    const under = [1, 3, 5].map((offset) =>
        Number.parseInt(backdrop.slice(offset, offset + 2), 16)
    );
    return (
        '#' +
        [1, 2, 3]
            .map((index) =>
                Math.round(
                    Number.parseInt(match[index], 10) * alpha +
                        under[index - 1] * (1 - alpha)
                )
                    .toString(16)
                    .padStart(2, '0')
            )
            .join('')
    );
};

/**
 * The speaker card is a glass island on the slate-rock photo, so its ink must not be a
 * token that follows the slide polarity.
 *
 * This regressed once: the card kept the deprecated --black alias, which the polarity
 * axis repointed at the dark-surface ink, putting #F1F1F1 on a white card at 1.13:1.
 * Nothing in the token tests could see it, because every token involved was individually
 * correct — the bug was picking the wrong one.
 */
describe('speaker card — a glass island on a dark photo', () => {
    it('should paint the card with the dark glass, the pptx card on photos', () => {
        expect(resolve('sfeir-speaker-card-surface')).toBe(
            'rgb(23 26 32 / 0.7)'
        );
    });

    it.each([
        ['Carbone, the flat fallback', '#181a1f', 'AAA'],
        ['a mid-grey photo region', '#808080', 'AAA'],
        ['a light photo region', '#a0a0a0', 'AAA'],
    ])(
        'should keep the card ink legible on the glass over %s',
        (_backdrop, hex, level) => {
            const surface = composite(
                resolve('sfeir-speaker-card-surface'),
                hex
            );
            const ratio = contrastRatio(
                resolve('sfeir-speaker-card-ink'),
                surface
            );
            expect(wcagLevel(ratio)).toBe(level);
        }
    );

    it('should paint the card from its own surface token, not a literal', () => {
        expect(read('speaker-slide.scss')).toContain(
            'background-color: var(--sfeir-speaker-card-surface)'
        );
    });

    it.each(['sfeir-speaker-card-ink', 'sfeir-speaker-card-surface'])(
        '--%s should resolve to a palette literal, not a polarity-following role',
        (token) => {
            const [ref] = varRefs(speaker.get(token) ?? '');
            expect(palette.has(ref)).toBe(true);
        }
    );

    it('should round the card with the shape token, not a literal radius', () => {
        const scss = read('speaker-slide.scss');
        expect(scss).toContain('border-radius: var(--sfeir-radius)');
        expect(scss).not.toMatch(/border-radius:\s*\d/);
    });

    it('should carry no shadow and no gradient of its own', () => {
        const scss = read('speaker-slide.scss');
        expect(scss).not.toMatch(/box-shadow:\s*(?!none\b)\S/);
        expect(scss).not.toMatch(/gradient/);
    });

    it('should underline card links with the signature colour', () => {
        expect(read('speaker-slide.scss')).toContain(
            'border-bottom: 2px solid var(--sfeir-accent)'
        );
    });
});
