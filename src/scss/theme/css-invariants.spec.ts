import * as sass from 'sass';
import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Invariants of the compiled theme, checked on the CSS the browser actually gets.
 *
 * Scope: our own rules only. The entry imports talk-control's vendored theme with a
 * plain-CSS `@import` (a `.css` URL), which Sass leaves as-is instead of inlining, so the
 * compiled string below contains exactly what src/scss emits.
 */
const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../../..');
const PUBLIC = path.join(ROOT, 'public');
const IMAGES = path.join(PUBLIC, 'images');

const css = sass.compile(path.join(ROOT, 'src/scss/sfeir-school-theme.scss'), {
    logger: sass.Logger.silent,
}).css;

describe('compiled theme CSS — invariants', () => {
    it('should inline no vendored stylesheet', () => {
        const imports = css.match(/@import[^;]*;/g) ?? [];
        expect(imports).toEqual([
            "@import '/node_modules/@talk-control/talk-control-revealjs-extensions/dist/talk-control-revealjs-theme.css';",
        ]);
    });

    // The charte 2026 v1 values superseded by the official pptx (03-migration-plan.md,
    // revision 2), plus the v4 green and blue.
    it.each([
        '#1B1B1B',
        '#303030',
        '#E5A040',
        '#FFB95C',
        '#FFDDB7',
        '#0AB580',
        '#5155F9',
    ])('should not contain the retired colour %s', (hex) => {
        expect(css.toLowerCase()).not.toContain(hex.toLowerCase());
    });

    const urls = [
        ...new Set(
            [...css.matchAll(/url\(\s*['"]?\.\/([^'")]+)['"]?\s*\)/g)].map(
                (m) => m[1]
            )
        ),
    ];

    it('should reference both per-slide lockup wordmarks', () => {
        expect(urls).toEqual(
            expect.arrayContaining([
                'images/logos/logo-sfeir-black.svg',
                'images/logos/logo-sfeir-white.svg',
            ])
        );
    });

    it.each(urls)('should ship ./%s under public/', (url) => {
        expect(fs.existsSync(path.join(PUBLIC, url))).toBe(true);
    });
});

describe('public/images/manifest.json', () => {
    const manifest = JSON.parse(
        fs.readFileSync(path.join(IMAGES, 'manifest.json'), 'utf-8')
    ) as {
        assets: {
            file: string;
            width?: number;
            height?: number;
            bytes?: number;
        }[];
    };
    const listed = manifest.assets.map((a) => a.file).sort();
    const onDisk = ['backgrounds', 'logos']
        .flatMap((dir) =>
            fs.readdirSync(path.join(IMAGES, dir)).map((f) => `${dir}/${f}`)
        )
        .filter((f) => !path.basename(f).startsWith('.'))
        .sort();

    it('should list exactly the files under backgrounds/ and logos/', () => {
        expect(listed).toEqual(onDisk);
    });

    // layout.scss sizes one box for both marks: a different ratio renders one narrower.
    it('should give the grey and white burger marks the same aspect ratio', () => {
        const ratio = (file: string) => {
            const a = manifest.assets.find((x) => x.file === file)!;
            return a.width! / a.height!;
        };
        expect(ratio('logos/logo-sfeir-burger-white.webp')).toBeCloseTo(
            ratio('logos/logo-sfeir-burger-grey.webp'),
            2
        );
    });

    it.each(manifest.assets.filter((a) => a.bytes !== undefined))(
        'should record the current size of $file',
        (asset) => {
            expect(fs.statSync(path.join(IMAGES, asset.file)).size).toBe(
                asset.bytes
            );
        }
    );
});
