import { contrastRatio, relativeLuminance, wcagLevel } from './color.utils';
import { describe, expect, it } from 'vitest';

/**
 * Reference values recomputed from the WCAG 2.1 definition.
 *
 * They deliberately do NOT match the contrast table published in the
 * `sfeir-brand-guidelines` skill: none of the six ratios in that table is correct and
 * the errors run in both directions. See docs/charte-2026/01-audit.md section 4.9.
 */
describe(relativeLuminance.name, () => {
    it('should return 0 for black', () => {
        expect(relativeLuminance('#000000')).toBeCloseTo(0, 5);
    });

    it('should return 1 for white', () => {
        expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 5);
    });

    it('should apply the linear segment below the 0.04045 threshold', () => {
        // 10/255 = 0.0392 -> linear branch: 0.0392 / 12.92
        expect(relativeLuminance('#0A0A0A')).toBeCloseTo(0.003035, 5);
    });

    it('should accept a hex value without its leading hash', () => {
        expect(relativeLuminance('845400')).toBeCloseTo(
            relativeLuminance('#845400'),
            10
        );
    });

    it('should be case-insensitive', () => {
        expect(relativeLuminance('#e4aa5d')).toBeCloseTo(
            relativeLuminance('#E4AA5D'),
            10
        );
    });

    it('should reject a malformed hex value', () => {
        expect(() => relativeLuminance('#12345')).toThrow();
    });
});

describe(contrastRatio.name, () => {
    it('should return 21 for black on white', () => {
        expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 4);
    });

    it('should return 1 for a colour against itself', () => {
        expect(contrastRatio('#845400', '#845400')).toBeCloseTo(1, 6);
    });

    it('should be symmetric', () => {
        expect(contrastRatio('#845400', '#F9F9F9')).toBeCloseTo(
            contrastRatio('#F9F9F9', '#845400'),
            10
        );
    });

    // Reference ratios for the official 2026 palette, recomputed from the WCAG formula.
    it.each([
        ['Carbone ink on Blanc Craie', '#181A1F', '#F9F9F9', 16.53],
        ['Blanc Craie on Carbone', '#F9F9F9', '#181A1F', 16.53],
        ['Cuivre on white', '#845400', '#FFFFFF', 6.46],
        ['Cuivre on Blanc Craie', '#845400', '#F9F9F9', 6.14],
        ['Cuivre Poli on Carbone', '#E4AA5D', '#181A1F', 8.46],
        ['Cuivre Poli on Blanc Craie', '#E4AA5D', '#F9F9F9', 1.95],
        ['Cuivre on Carbone', '#845400', '#181A1F', 2.69],
        ['on-surface-variant on Blanc Craie', '#514536', '#F9F9F9', 8.85],
        ['separator on Carbone', '#CCC4B6', '#181A1F', 10.06],
        ['Émeraude medium on Carbone', '#6BC68F', '#181A1F', 8.37],
        ['Émeraude dark on Blanc Craie', '#0D5A2E', '#F9F9F9', 7.92],
    ])('should rate %s at %s:1', (_label, fg, bg, expected) => {
        expect(contrastRatio(fg, bg)).toBeCloseTo(expected, 1);
    });
});

describe(wcagLevel.name, () => {
    it('should rate 7.0 and above as AAA for body text', () => {
        expect(wcagLevel(7)).toBe('AAA');
        expect(wcagLevel(16.53)).toBe('AAA');
    });

    it('should rate Cuivre on white as AA, not the AAA the charte claims', () => {
        expect(wcagLevel(contrastRatio('#845400', '#FFFFFF'))).toBe('AA');
    });

    it('should rate below 4.5 as a failure for body text', () => {
        expect(wcagLevel(contrastRatio('#845400', '#181A1F'))).toBe('fail');
    });

    it('should lower both thresholds for large text', () => {
        expect(wcagLevel(3.25, { large: true })).toBe('AA');
        expect(wcagLevel(4.5, { large: true })).toBe('AAA');
        expect(wcagLevel(2.9, { large: true })).toBe('fail');
    });
});
