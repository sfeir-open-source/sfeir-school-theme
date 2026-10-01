/**
 * WCAG 2.1 contrast arithmetic.
 *
 * The `sfeir-brand-guidelines` skill publishes a contrast table whose six ratios are all
 * incorrect, in both directions. Ratios are therefore computed here and never
 * transcribed. See docs/charte-2026/01-audit.md section 4.9.
 */

export type WcagLevel = 'AAA' | 'AA' | 'fail';

const SHORT_HEX = /^#?([0-9a-f]{3})$/i;
const LONG_HEX = /^#?([0-9a-f]{6})$/i;

function channels(hex: string): number[] {
    const short = SHORT_HEX.exec(hex);
    const raw = short
        ? short[1].replace(/./g, (channel) => channel + channel)
        : LONG_HEX.exec(hex)?.[1];
    if (!raw) {
        throw new Error(`Not a hex colour: "${hex}"`);
    }
    return [0, 2, 4].map((offset) =>
        Number.parseInt(raw.slice(offset, offset + 2), 16)
    );
}

/** sRGB gamma expansion, per the WCAG definition of relative luminance. */
function toLinear(channel: number): number {
    const value = channel / 255;
    return value <= 0.04045
        ? value / 12.92
        : Math.pow((value + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
    const [red, green, blue] = channels(hex).map(toLinear);
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(foreground: string, background: string): number {
    const a = relativeLuminance(foreground);
    const b = relativeLuminance(background);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/**
 * Body-text thresholds by default. `large` switches to the relaxed thresholds WCAG
 * allows for text at or above 18pt (or 14pt bold) — which covers display titles.
 */
export function wcagLevel(
    ratio: number,
    { large = false }: { large?: boolean } = {}
): WcagLevel {
    const enhanced = large ? 4.5 : 7;
    const minimum = large ? 3 : 4.5;
    if (ratio >= enhanced) return 'AAA';
    if (ratio >= minimum) return 'AA';
    return 'fail';
}
