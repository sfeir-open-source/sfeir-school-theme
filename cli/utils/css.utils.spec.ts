import {
    TALK_CONTROL_ICON_PACK_KEYWORDS,
    TALK_CONTROL_IMAGE_STYLES,
    THEME_JS_CLASSES,
    extractCssClasses,
    getCssClassesUsedInSlide,
} from './css.utils';
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('css utils', () => {
    it('extracts class names from selectors only', () => {
        const css = `/* .commented */
.with-code, .reveal .bg-white:hover { background: url(./img/x.webp); margin: 0.5em; }`;

        expect(extractCssClasses(css)).toStrictEqual([
            'with-code',
            'reveal',
            'bg-white',
        ]);
    });

    it('knows every background class mapped by the theme initializer', () => {
        const initializer = fs.readFileSync(
            './src/js/sfeir-theme-initializer.ts',
            'utf-8'
        );
        const mapBackgrounds = initializer.slice(
            initializer.indexOf('mapBackgrounds('),
            initializer.indexOf('tcI18nOptions')
        );
        const mappedClasses = (
            mapBackgrounds.match(/^\s*'?([\w-]+)'?:/gm) ?? []
        ).map((key) => key.trim().replace(/'/g, '').slice(0, -1));

        expect(mappedClasses.length).toBeGreaterThan(0);
        expect(THEME_JS_CLASSES).toEqual(expect.arrayContaining(mappedClasses));
    });

    describe(getCssClassesUsedInSlide.name, () => {
        it('reads image title words as styles talk-control may convert', () => {
            expect(
                getCssClassesUsedInSlide("![](./logo.png 'company h-100')")
            ).toStrictEqual({
                classAttributes: [],
                imageStyles: ['company', 'h-100'],
            });
        });

        it('reads a tc-icons title as classes, without the icon pack keyword', () => {
            expect(
                getCssClassesUsedInSlide("![](clock 'tc-icons feather tc-big')")
            ).toStrictEqual({
                classAttributes: ['tc-icons', 'tc-big'],
                imageStyles: [],
            });
        });

        it('reads a tc-qrcode title as classes', () => {
            expect(
                getCssClassesUsedInSlide(
                    "![](https://sfeir.com 'tc-qrcode h-300')"
                )
            ).toStrictEqual({
                classAttributes: ['tc-qrcode', 'h-300'],
                imageStyles: [],
            });
        });

        it('reads an image title followed by an .element comment on the same line', () => {
            expect(
                getCssClassesUsedInSlide(
                    '![](clock \'tc-icons feather tc-big\')<!-- .element: style="--tc-icon-size: 2em" -->'
                )
            ).toStrictEqual({
                classAttributes: ['tc-icons', 'tc-big'],
                imageStyles: [],
            });
            expect(
                getCssClassesUsedInSlide(
                    '![](./logo.png \'company\') <!-- .element: class="x" -->'
                )
            ).toStrictEqual({
                classAttributes: [],
                imageStyles: ['company'],
            });
        });
    });

    describe('in sync with the installed talk-control', () => {
        const talkControl = fs.readFileSync(
            './node_modules/@talk-control/talk-control-revealjs-extensions/dist/talk-control-revealjs-extensions.js',
            'utf-8'
        );

        it('knows every built-in image style', () => {
            const baseList = talkControl.match(
                /\[\s*"company",[^\]]*"full-height"\s*\]/
            );
            expect(baseList).not.toBeNull();
            const builtIns: string[] = JSON.parse(baseList![0]);
            expect(TALK_CONTROL_IMAGE_STYLES).toEqual(
                expect.arrayContaining(builtIns)
            );
        });

        it('knows every icon pack keyword', () => {
            const keywords = [
                ...talkControl.matchAll(/keyword: "([\w-]+)",\s*copyKeyword/g),
            ].map((match) => match[1]);
            expect(keywords.length).toBeGreaterThan(0);
            expect([...TALK_CONTROL_ICON_PACK_KEYWORDS].sort()).toEqual(
                keywords.sort()
            );
        });
    });
});
