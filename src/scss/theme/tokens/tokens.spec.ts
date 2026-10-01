import { contrastRatio, wcagLevel } from './color.utils';
import { describe, expect, it } from 'vitest';
import { parseBlocks, parseCustomProperties, varRefs } from './tokens.utils';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import sass from 'sass';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const read = (file: string) => fs.readFileSync(path.join(DIR, file), 'utf-8');

const PALETTE_SCSS = '_palette.scss';
const SEMANTIC_SCSS = '_semantic.scss';
const CONTEXT_SCSS = '_context.scss';
const LEGACY_SCSS = '_legacy.scss';
const TYPOGRAPHY_SCSS = '_typography.scss';

const palette = parseCustomProperties(read(PALETTE_SCSS));
const semantic = parseCustomProperties(read(SEMANTIC_SCSS));
const hex = (token: string) => {
    const value = palette.get(token);
    if (!value) throw new Error(`${token} is not declared in ${PALETTE_SCSS}`);
    return value;
};

/**
 * The two program ramps, tier by tier (decision D1, revision 2).
 *
 * Institute = Ocre, re-pointed to the official copper. School = Émeraude, demoted to
 * the signature tiers (accent, on-dark accent, deep): its fill, on-fill and wash are
 * the same copper as Institute, because Émeraude is never a fill.
 */
const RAMPS = {
    'ocre (Institute)': {
        accent: 'sfeir-ocre-dark',
        onDark: 'sfeir-ocre-primary',
        fill: 'sfeir-ocre-primary',
        onFill: 'sfeir-carbone',
        wash: 'sfeir-ocre-light',
        deep: 'sfeir-cuivre-profond',
    },
    'emeraude (School)': {
        accent: 'sfeir-emeraude-dark',
        onDark: 'sfeir-emeraude-medium',
        fill: 'sfeir-cuivre-poli',
        onFill: 'sfeir-carbone',
        wash: 'sfeir-sable',
        deep: 'sfeir-emeraude-dark',
    },
} as const;

const ramps = Object.entries(RAMPS);

describe(`${PALETTE_SCSS} — official values`, () => {
    it.each([
        // Copper — the corporate accent, pptx accent1/3/4 plus the two AA text tiers
        ['sfeir-cuivre', '#845400'],
        ['sfeir-cuivre-poli', '#E4AA5D'],
        ['sfeir-cuivre-clair', '#FEB95C'],
        ['sfeir-sable', '#F0C387'],
        ['sfeir-cuivre-profond', '#5D3A00'],
        // Ocre — Institute (decision D1), re-pointed to the copper
        ['sfeir-ocre-light', '#F0C387'],
        ['sfeir-ocre-medium', '#FEB95C'],
        ['sfeir-ocre-primary', '#E4AA5D'],
        ['sfeir-ocre-dark', '#845400'],
        // Émeraude — School (decision D1), unchanged
        ['sfeir-emeraude-light', '#C8F5D6'],
        ['sfeir-emeraude-medium', '#6BC68F'],
        ['sfeir-emeraude-primary', '#2E8B57'],
        ['sfeir-emeraude-dark', '#0D5A2E'],
        // Surfaces — the Craie to Carbone ramp
        ['sfeir-white', '#FFFFFF'],
        ['sfeir-craie', '#F9F9F9'],
        ['sfeir-craie-1', '#F3F3F3'],
        ['sfeir-craie-2', '#EEEEEE'],
        ['sfeir-craie-3', '#E8E8E8'],
        ['sfeir-craie-4', '#E2E2E2'],
        ['sfeir-brouillard', '#DADADA'],
        ['sfeir-carbone', '#181A1F'],
        ['sfeir-noir', '#000000'],
        // Ink and separators
        ['sfeir-charcoal', '#181A1F'],
        ['sfeir-charcoal-variant', '#514536'],
        ['sfeir-ink-on-dark', '#F9F9F9'],
        ['sfeir-separator-warm', '#CCC4B6'],
        ['sfeir-taupe', '#B3A495'],
        ['sfeir-error', '#BA1A1A'],
    ])('should declare --%s as %s', (token, value) => {
        expect(hex(token).toUpperCase()).toBe(value);
    });

    it.each([
        ['sfeir-glass-dark', 'rgb(23 26 32 / 0.7)'],
        ['sfeir-glass-light', 'rgb(255 255 255 / 0.41)'],
        ['sfeir-overlay', 'rgb(24 26 31 / 0.55)'],
    ])('should declare the translucent --%s as %s', (token, value) => {
        expect(palette.get(token)).toBe(value);
    });

    // The skill values the official theme contradicted, and the two greys the first cut
    // invented. None may come back as a palette value.
    const RETIRED = [
        '#1B1B1B',
        '#303030',
        '#D6C3B1',
        '#847564',
        '#E5A040',
        '#FFB95C',
        '#FFDDB7',
        '#F1F1F1',
        '#BFBFBF',
    ];

    it('should carry none of the retired values', () => {
        const values = [...palette.values()].map((value) => value.toUpperCase());
        expect(values.filter((value) => RETIRED.includes(value))).toEqual([]);
    });
});

/**
 * Each ramp carries its own contrast profile, so each is asserted on its own. The
 * thresholds encode what every tier is *for*, which is what stops a future retune from
 * quietly producing an illegible slide.
 */
describe('WCAG guarantees, per program ramp', () => {
    it.each(ramps)(
        '%s should keep the accent legible as body text on Blanc Craie',
        (_name, ramp) => {
            expect(
                wcagLevel(contrastRatio(hex(ramp.accent), hex('sfeir-craie')))
            ).not.toBe('fail');
        }
    );

    it.each(ramps)(
        '%s should keep the on-dark tier at AAA on Carbone',
        (_name, ramp) => {
            expect(
                wcagLevel(contrastRatio(hex(ramp.onDark), hex('sfeir-carbone')))
            ).toBe('AAA');
        }
    );

    it.each(ramps)(
        '%s should keep text on the fill legible at body size',
        (_name, ramp) => {
            expect(
                wcagLevel(contrastRatio(hex(ramp.onFill), hex(ramp.fill)))
            ).not.toBe('fail');
        }
    );

    it.each(ramps)(
        '%s should keep the deep tier legible on its own wash',
        (_name, ramp) => {
            expect(
                wcagLevel(contrastRatio(hex(ramp.deep), hex(ramp.wash)))
            ).not.toBe('fail');
        }
    );

    it.each(ramps)(
        '%s should keep the fill readable as a large shape on Carbone',
        (_name, ramp) => {
            expect(
                wcagLevel(contrastRatio(hex(ramp.fill), hex('sfeir-carbone')), {
                    large: true,
                })
            ).not.toBe('fail');
        }
    );
});

/**
 * The official pairs, as the pptx draws them, with the threshold each has to clear.
 * Ratios are computed, never transcribed — the skill's own table got all six wrong.
 */
describe('WCAG guarantees, official pairs', () => {
    it.each([
        ['sfeir-cuivre-poli', 'sfeir-carbone', 4.5], // #E4AA5D eyebrow on dark
        ['sfeir-cuivre', 'sfeir-craie', 4.5], // #845400 accent text on light
        ['sfeir-emeraude-medium', 'sfeir-carbone', 4.5], // #6BC68F School eyebrow on dark
        ['sfeir-emeraude-dark', 'sfeir-craie', 4.5], // #0D5A2E School eyebrow on light
        ['sfeir-carbone', 'sfeir-craie', 7], // #181A1F body on light
        ['sfeir-ink-on-dark', 'sfeir-carbone', 7], // #F9F9F9 body on dark
        ['sfeir-separator-warm', 'sfeir-carbone', 4.5], // #CCC4B6 muted on dark
        ['sfeir-carbone', 'sfeir-cuivre-poli', 4.5], // #181A1F on the copper fill
        ['sfeir-charcoal-variant', 'sfeir-craie', 7], // #514536 muted on light
    ])('should keep --%s on --%s at or above %s:1', (fg, bg, minimum) => {
        expect(contrastRatio(hex(fg), hex(bg))).toBeGreaterThanOrEqual(minimum);
    });
});

/**
 * These traps are why the semantic layer exists. They must keep failing: the day one
 * of them passes, someone has retuned the palette and the on-dark tier has lost its
 * reason to exist.
 */
describe('inherited contrast traps', () => {
    it.each(ramps)(
        '%s should keep the accent failing on Carbone',
        (_name, ramp) => {
            expect(
                wcagLevel(contrastRatio(hex(ramp.accent), hex('sfeir-carbone')))
            ).toBe('fail');
        }
    );

    it.each(ramps)(
        '%s should keep the fill unusable as text on Blanc Craie',
        (_name, ramp) => {
            expect(
                wcagLevel(contrastRatio(hex(ramp.fill), hex('sfeir-craie')))
            ).toBe('fail');
        }
    );

    it('should keep the official on-light eyebrow (#E4AA5D on #F9F9F9) failing — the kept deviation', () => {
        expect(
            wcagLevel(contrastRatio(hex('sfeir-cuivre-poli'), hex('sfeir-craie')))
        ).toBe('fail');
    });

    it('should keep Taupe failing as text on Blanc Craie, even large', () => {
        expect(
            wcagLevel(contrastRatio(hex('sfeir-taupe'), hex('sfeir-craie')), {
                large: true,
            })
        ).toBe('fail');
    });
});

describe('token layering', () => {
    const HEX_LITERAL = /#[0-9a-fA-F]{3,8}\b/;

    it.each([SEMANTIC_SCSS, CONTEXT_SCSS, LEGACY_SCSS])(
        '%s should reference palette tokens instead of raw hex values',
        (file) => {
            const offenders = [...parseCustomProperties(read(file))]
                .filter(([, value]) => HEX_LITERAL.test(value))
                .map(([name, value]) => `--${name}: ${value}`);
            expect(offenders).toEqual([]);
        }
    );

    it('should declare every palette token as a literal, not a reference', () => {
        const referencing = [...palette]
            .filter(([, value]) => varRefs(value).length > 0)
            .map(([name]) => name);
        expect(referencing).toEqual([]);
    });

    it('should resolve every semantic token to a declared palette token', () => {
        expect(semantic.size).toBeGreaterThan(0);
        for (const [name, value] of semantic) {
            for (const ref of varRefs(value)) {
                expect(
                    palette.has(ref) || semantic.has(ref),
                    `--${name} references undeclared --${ref}`
                ).toBe(true);
            }
        }
    });

    it('should resolve every contextual token to a declared palette or semantic token', () => {
        const context = parseCustomProperties(read(CONTEXT_SCSS));
        expect(context.size).toBeGreaterThan(0);
        for (const [name, value] of context) {
            for (const ref of varRefs(value)) {
                expect(
                    palette.has(ref) || semantic.has(ref),
                    `context --${name} references undeclared --${ref}`
                ).toBe(true);
            }
        }
    });

    it('should resolve every legacy alias to a declared token', () => {
        const legacy = parseCustomProperties(read(LEGACY_SCSS));
        expect(legacy.size).toBeGreaterThan(0);
        for (const [name, value] of legacy) {
            for (const ref of varRefs(value)) {
                expect(
                    palette.has(ref) || semantic.has(ref),
                    `legacy --${name} references undeclared --${ref}`
                ).toBe(true);
            }
        }
    });

    it('should keep every legacy alias out of the palette and semantic layers', () => {
        const legacy = parseCustomProperties(read(LEGACY_SCSS));
        for (const name of legacy.keys()) {
            expect(palette.has(name) || semantic.has(name)).toBe(false);
        }
    });

    it.each(['code-bg', 'sfeir-green', 'sfeir-blue'])(
        'should keep the alias --%s resolving',
        (alias) => {
            const legacy = parseCustomProperties(read(LEGACY_SCSS));
            expect(legacy.has(alias)).toBe(true);
        }
    );
});

describe(`${SEMANTIC_SCSS} — shape`, () => {
    it('should round cards at 12px, as the official deck does', () => {
        expect(semantic.get('sfeir-radius')).toBe('12px');
    });

    it('should keep the pill radius for chips and avatars', () => {
        expect(semantic.get('sfeir-radius-pill')).toBe('999px');
    });
});

describe(`${TYPOGRAPHY_SCSS} — font stacks`, () => {
    const typography = parseCustomProperties(read(TYPOGRAPHY_SCSS));
    const stack = (role: string) => {
        const value = typography.get(`sfeir-font-${role}`);
        if (!value) throw new Error(`--sfeir-font-${role} is not declared`);
        return value.split(',').map((family) => family.trim());
    };

    it.each([
        ['display', "'Epilogue'"],
        ['body', "'Epilogue'"],
        ['label', "'Space Grotesk'"],
        ['stat', "'Space Grotesk'"],
        ['mono', "'JetBrains Mono'"],
    ])('should lead the %s stack with %s', (role, expected) => {
        expect(stack(role)[0]).toBe(expected);
    });

    it.each(['display', 'body', 'label', 'stat', 'mono'])(
        'should give the %s stack a real fallback chain',
        (role) => {
            expect(stack(role).length).toBeGreaterThanOrEqual(3);
        }
    );

    it('should never fall back to Poppins, the superseded family', () => {
        expect(read(TYPOGRAPHY_SCSS)).not.toMatch(/Poppins/i);
    });

    it('should set display roles at ExtraBold 800, never Black', () => {
        expect(typography.get('sfeir-weight-display')).toBe('800');
        expect(read(TYPOGRAPHY_SCSS)).not.toMatch(/\b900\b/);
    });

    it('should set stat numerals at Medium 500', () => {
        expect(typography.get('sfeir-weight-stat')).toBe('500');
    });
});

/**
 * The charte is calibrated for pptx at 10 x 5.625in; reveal runs at 1920 x 1080, so
 * 1pt = 2.667px. That transposition is adopted for every role except body text, which
 * would land at 29px — marginal on the projectors conductor/product-guidelines.md
 * targets. Body stays at 40px. See docs/charte-2026/02-token-mapping.md section 6.
 */
describe(`${TYPOGRAPHY_SCSS} — type scale`, () => {
    const typography = parseCustomProperties(read(TYPOGRAPHY_SCSS));
    const px = (role: string) => {
        const value = typography.get(`sfeir-fs-${role}`);
        if (!value) throw new Error(`--sfeir-fs-${role} is not declared`);
        expect(value).toMatch(/^\d+px$/);
        return Number.parseInt(value, 10);
    };

    // Captions sit below eyebrows: the official deck puts eyebrows at 12pt and
    // captions at 8-9pt.
    const ORDER = [
        'caption',
        'eyebrow',
        'body',
        'subtitle',
        'title-dense',
        'title',
        'display',
        'display-cover',
        'stat',
    ];

    it('should keep body text at 40px, the documented deviation', () => {
        expect(px('body')).toBe(40);
    });

    it('should rise monotonically through the hierarchy', () => {
        const sizes = ORDER.map(px);
        expect(sizes).toEqual([...sizes].sort((a, b) => a - b));
    });

    it.each([
        ['caption', 26],
        ['eyebrow', 32], // 12pt
        ['body', 40],
        ['subtitle', 48],
        ['title-dense', 61], // 23pt
        ['title', 76], // 28pt
        ['display', 133], // 50pt divider
        ['display-cover', 136], // 52pt cover
        ['stat', 208],
    ])('should size %s at %spx', (role, expected) => {
        expect(px(role)).toBe(expected);
    });

    it('should carry the negative tracking the charte puts on display type', () => {
        expect(typography.get('sfeir-tracking-display')).toBe('-0.02em');
    });

    it('should keep label tracking at or under 0.06em — the official deck uses none', () => {
        const label = typography.get('sfeir-tracking-label');
        expect(label).toBeDefined();
        const value = Number.parseFloat(label!);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(0.06);
    });
});

/**
 * A custom property that references another resolves **at its own declaration site**.
 * So redefining a token on a descendant does not retroactively change anything that
 * reads it higher up: every block that redefines a token must also redeclare each
 * token transitively derived from it.
 *
 * This is not a hypothetical. Two separate blocks got this wrong on the first cut —
 * the program axis failed to redeclare the accent roles, and the deprecated aliases
 * failed to redeclare --sfeir-blue / --sfeir-green — and every value-level test above
 * passed while `data-theme="institute"` still rendered Bronze. Value assertions cannot
 * see this class of bug; only resolution can.
 */
describe('token resolution across contexts', () => {
    const css = sass.compileString(
        [
            "@import 'selectors';",
            "@import 'semantic';",
            "@import 'context';",
            "@import 'legacy';",
        ].join('\n'),
        { loadPaths: [DIR] }
    ).css;

    // The cascade merges every rule sharing a selector, and the token layers
    // deliberately declare the same selector more than once (_context sets the ramp,
    // _legacy sets the aliases). Merge before asserting, or the invariant is checked
    // against half of each context.
    const merged = new Map<string, Map<string, string>>();
    for (const block of parseBlocks(css)) {
        const target = merged.get(block.selector) ?? new Map<string, string>();
        for (const [name, value] of block.properties) target.set(name, value);
        merged.set(block.selector, target);
    }

    const rootProperties = merged.get(':root') ?? new Map<string, string>();
    const blocks = [...merged].map(([selector, properties]) => ({
        selector,
        properties,
    }));

    /** Every root token that reads `token`, directly or through other tokens. */
    const dependentsOf = (token: string): string[] => {
        const found = new Set<string>();
        const frontier = [token];
        while (frontier.length > 0) {
            const current = frontier.pop()!;
            for (const [name, value] of rootProperties) {
                if (found.has(name) || name === token) continue;
                if (varRefs(value).includes(current)) {
                    found.add(name);
                    frontier.push(name);
                }
            }
        }
        return [...found];
    };

    const contextBlocks = blocks.filter((block) => block.selector !== ':root');

    it('should declare tokens at :root and redefine them in context blocks', () => {
        expect(rootProperties.size).toBeGreaterThan(0);
        expect(contextBlocks.length).toBeGreaterThan(0);
    });

    it.each(contextBlocks.map((block) => [block.selector, block] as const))(
        '%s should redeclare every token derived from what it redefines',
        (_selector, block) => {
            const declared = new Set(block.properties.keys());
            const missing = [...declared]
                .flatMap(dependentsOf)
                .filter((token) => !declared.has(token));
            expect([...new Set(missing)]).toEqual([]);
        }
    );

    // Compiled CSS drops the quotes from the attribute value.
    const institute = contextBlocks.find((block) =>
        /\[data-theme=['"]?institute['"]?\]/.test(block.selector)
    )?.properties;
    const dark = contextBlocks.find((block) =>
        /\.first-slide/.test(block.selector)
    )?.properties;

    /**
     * Resolve `token` on an element whose ancestors declare the given blocks, most
     * specific first. Custom properties inherit as computed values, so looking a
     * reference up from the nearest declaring block models the cascade exactly —
     * provided every block redeclares its dependents, which the test above enforces.
     */
    const resolve = (chain: Map<string, string>[], token: string): string => {
        for (const properties of chain) {
            const value = properties.get(token);
            if (value === undefined) continue;
            const [ref] = varRefs(value);
            return ref ? resolve(chain, ref) : value;
        }
        const literal = palette.get(token);
        if (literal === undefined) throw new Error(`--${token} does not resolve`);
        return literal.startsWith('#') ? literal.toUpperCase() : literal;
    };

    const CONTEXTS = {
        'School, light': [rootProperties],
        'School, dark': [dark!, rootProperties],
        'Institute, light': [institute!, rootProperties],
        'Institute, dark': [dark!, institute!, rootProperties],
    };
    const contexts = Object.entries(CONTEXTS);

    it('should find both context blocks in the compiled CSS', () => {
        expect(institute).toBeDefined();
        expect(dark).toBeDefined();
    });

    it.each([
        ['School, light', '#0D5A2E'],
        ['School, dark', '#6BC68F'],
        ['Institute, light', '#845400'],
        ['Institute, dark', '#E4AA5D'],
    ] as const)('should resolve --sfeir-accent on %s to %s', (context, expected) => {
        expect(resolve(CONTEXTS[context], 'sfeir-accent')).toBe(expected);
    });

    it.each(contexts)(
        'should resolve --sfeir-accent-fill on %s to the copper, in both programs',
        (_context, chain) => {
            expect(resolve(chain, 'sfeir-accent-fill')).toBe('#E4AA5D');
            expect(resolve(chain, 'sfeir-on-accent-fill')).toBe('#181A1F');
            expect(resolve(chain, 'sfeir-accent-wash')).toBe('#F0C387');
        }
    );

    it.each([
        ['School, light', '#F9F9F9', 'rgb(255 255 255 / 0.41)', '#181A1F'],
        ['School, dark', '#181A1F', 'rgb(23 26 32 / 0.7)', '#F9F9F9'],
        ['Institute, light', '#F9F9F9', 'rgb(255 255 255 / 0.41)', '#181A1F'],
        ['Institute, dark', '#181A1F', 'rgb(23 26 32 / 0.7)', '#F9F9F9'],
    ] as const)(
        'should flip surface and glass with polarity on %s',
        (context, surface, glass, onGlass) => {
            const chain = CONTEXTS[context];
            expect(resolve(chain, 'sfeir-surface')).toBe(surface);
            expect(resolve(chain, 'sfeir-glass')).toBe(glass);
            expect(resolve(chain, 'sfeir-on-glass')).toBe(onGlass);
            expect(resolve(chain, 'sfeir-on-surface')).toBe(
                surface === '#F9F9F9' ? '#181A1F' : '#F9F9F9'
            );
        }
    );

    it('should resolve the legacy Institute accent through the ramp', () => {
        expect(resolve(CONTEXTS['Institute, light'], 'sfeir-blue')).toBe('#845400');
        expect(resolve(CONTEXTS['Institute, dark'], 'sfeir-blue')).toBe('#E4AA5D');
    });

    it('should resolve the code surface to Carbone on light and black blocks on dark', () => {
        expect(resolve(CONTEXTS['School, light'], 'code-bg')).toBe('#181A1F');
        expect(resolve(CONTEXTS['School, dark'], 'code-bg')).toBe('#000000');
    });
});
