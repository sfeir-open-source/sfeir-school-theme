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
const hex = (token: string) => {
    const value = palette.get(token);
    if (!value) throw new Error(`${token} is not declared in ${PALETTE_SCSS}`);
    return value;
};

/**
 * The two program ramps, tier by tier (decision D1).
 *
 * Institute = Ocre (Services Managés), School = Émeraude (Data & Product). Unlike the
 * earlier Cuivre/Bronze pair, these are two independent charte families, so they do NOT
 * share a contrast profile — each is asserted against the WCAG thresholds on its own.
 */
const RAMPS = {
    'ocre (Institute)': {
        accent: 'sfeir-ocre-dark',
        onDark: 'sfeir-ocre-medium',
        fill: 'sfeir-ocre-primary',
        onFill: 'sfeir-cuivre-profond',
        wash: 'sfeir-ocre-light',
        deep: 'sfeir-cuivre-profond',
    },
    'emeraude (School)': {
        accent: 'sfeir-emeraude-dark',
        onDark: 'sfeir-emeraude-medium',
        fill: 'sfeir-emeraude-primary',
        onFill: 'sfeir-noir',
        wash: 'sfeir-emeraude-light',
        deep: 'sfeir-emeraude-dark',
    },
} as const;

const ramps = Object.entries(RAMPS);

describe(`${PALETTE_SCSS} — charte values`, () => {
    it.each([
        // Copper — Institute
        ['sfeir-cuivre', '#845400'],
        ['sfeir-cuivre-poli', '#E5A040'],
        ['sfeir-cuivre-clair', '#FFB95C'],
        ['sfeir-sable', '#FFDDB7'],
        ['sfeir-cuivre-profond', '#5D3A00'],
        // Ocre — Institute (decision D1)
        ['sfeir-ocre-light', '#FFF0D6'],
        ['sfeir-ocre-medium', '#F2C878'],
        ['sfeir-ocre-primary', '#E5A040'],
        ['sfeir-ocre-dark', '#845400'],
        // Émeraude — School (decision D1)
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
        ['sfeir-carbone-mid', '#303030'],
        ['sfeir-noir', '#000000'],
        // Ink and outline
        ['sfeir-charcoal', '#1B1B1B'],
        ['sfeir-charcoal-variant', '#514536'],
        ['sfeir-ink-on-dark', '#F1F1F1'],
        ['sfeir-ink-on-dark-muted', '#BFBFBF'],
        ['sfeir-outline', '#847564'],
        ['sfeir-outline-variant', '#D6C3B1'],
        ['sfeir-error', '#BA1A1A'],
    ])('should declare --%s as %s', (token, value) => {
        expect(hex(token).toUpperCase()).toBe(value);
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
        '%s should keep the on-dark tier at AAA on Noir Carbone',
        (_name, ramp) => {
            expect(
                wcagLevel(contrastRatio(hex(ramp.onDark), hex('sfeir-noir')))
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
        '%s should keep the fill readable as a large shape on Noir Carbone',
        (_name, ramp) => {
            expect(
                wcagLevel(contrastRatio(hex(ramp.fill), hex('sfeir-noir')), {
                    large: true,
                })
            ).not.toBe('fail');
        }
    );

    it.each([
        ['sfeir-charcoal', 'sfeir-craie', 'AAA'],
        ['sfeir-charcoal-variant', 'sfeir-craie', 'AAA'],
        ['sfeir-ink-on-dark', 'sfeir-noir', 'AAA'],
        ['sfeir-ink-on-dark-muted', 'sfeir-noir', 'AAA'],
    ])('should rate --%s on --%s as %s', (fg, bg, level) => {
        expect(wcagLevel(contrastRatio(hex(fg), hex(bg)))).toBe(level);
    });
});

/**
 * These two traps are why the semantic layer exists. Both must keep failing: the day one
 * of them passes, someone has retuned the palette and the on-dark tier has lost its
 * reason to exist.
 */
describe('inherited contrast traps', () => {
    it.each(ramps)(
        '%s should keep the accent failing on Noir Carbone',
        (_name, ramp) => {
            expect(
                wcagLevel(contrastRatio(hex(ramp.accent), hex('sfeir-noir')))
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
        const semantic = parseCustomProperties(read(SEMANTIC_SCSS));
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

    it('should resolve every legacy alias to a declared token', () => {
        const semantic = parseCustomProperties(read(SEMANTIC_SCSS));
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
        const semantic = parseCustomProperties(read(SEMANTIC_SCSS));
        const legacy = parseCustomProperties(read(LEGACY_SCSS));
        for (const name of legacy.keys()) {
            expect(palette.has(name) || semantic.has(name)).toBe(false);
        }
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
        ['mono', "'JetBrains Mono'"],
    ])('should lead the %s stack with %s', (role, expected) => {
        expect(stack(role)[0]).toBe(expected);
    });

    it.each(['display', 'body', 'label', 'mono'])(
        'should give the %s stack a real fallback chain',
        (role) => {
            expect(stack(role).length).toBeGreaterThanOrEqual(3);
        }
    );

    it('should never fall back to Poppins, the superseded family', () => {
        expect(read(TYPOGRAPHY_SCSS)).not.toMatch(/Poppins/i);
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

    // Captions sit below eyebrows: the charte puts eyebrow labels at 10-12pt and
    // captions at 9-10pt.
    const ORDER = [
        'caption',
        'eyebrow',
        'body',
        'subtitle',
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
        ['eyebrow', 0.675],
        ['caption', 0.65],
        ['body', 1],
        ['subtitle', 1.2],
        ['title', 1.9],
        ['display', 3.2],
        ['display-cover', 3.4],
        ['stat', 5.2],
    ])('should size %s at %s times the base', (role, expected) => {
        expect(px(role) / px('body')).toBeCloseTo(expected, 2);
    });

    it('should carry the negative tracking the charte puts on display type', () => {
        expect(typography.get('sfeir-tracking-display')).toBe('-0.02em');
    });

    it('should carry positive tracking on uppercase labels', () => {
        const label = typography.get('sfeir-tracking-label');
        expect(label).toBeDefined();
        expect(Number.parseFloat(label!)).toBeGreaterThanOrEqual(0.06);
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

    it('should resolve the Institute accent to Ocre, not the School ramp', () => {
        // Compiled CSS drops the quotes from the attribute value.
        const institute = contextBlocks.find((block) =>
            /\[data-theme=['"]?institute['"]?\]/.test(block.selector)
        );
        expect(institute).toBeDefined();
        expect(institute?.properties.get('sfeir-ramp-accent')).toBe(
            'var(--sfeir-ocre-dark)'
        );
        expect(institute?.properties.get('sfeir-accent')).toBe(
            'var(--sfeir-ramp-accent)'
        );
        expect(institute?.properties.get('sfeir-blue')).toBe(
            'var(--sfeir-accent)'
        );
    });
});
