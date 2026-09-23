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

/**
 * The speaker card is a light island on a Noir Carbone slide, so its ink must not be a
 * token that follows the slide polarity.
 *
 * This regressed once: the card kept the deprecated --black alias, which the polarity
 * axis repointed at the dark-surface ink, putting #F1F1F1 on a white card at 1.13:1.
 * Nothing in the token tests could see it, because every token involved was individually
 * correct — the bug was picking the wrong one.
 */
describe('speaker card — a light island on a dark slide', () => {
    it('should keep the card ink legible on the card surface', () => {
        const ratio = contrastRatio(
            resolve('sfeir-speaker-card-ink'),
            resolve('sfeir-speaker-card-surface')
        );
        expect(wcagLevel(ratio)).toBe('AAA');
    });

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

    it('should underline card links with the light-surface accent', () => {
        expect(read('speaker-slide.scss')).toContain(
            'border-bottom: 2px solid var(--sfeir-accent-on-light)'
        );
    });
});
