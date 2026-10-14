import fs from 'node:fs';
import { slidesFilePath } from './path.utils';

const THEME_CSS_FILES = [
    'web_modules/sfeir-school-theme/dist/sfeir-school-theme.css',
    'css/slides.css',
];

/**
 * Classes applied at runtime without a rule in the theme CSS: talk-control's
 * `list-fragment` and the keys of `mapBackgrounds` in
 * `src/js/sfeir-theme-initializer.ts` (the background image is set by JS).
 */
export const THEME_JS_CLASSES = [
    'list-fragment',
    'first-slide',
    'transition',
    'speaker-slide',
    'quote-slide',
    'sfeir-slide',
    'bg-white',
    'bg-pink',
    'bg-blue',
    'bg-green',
    'bg-blur',
    'transition-bg-sfeir-1',
    'transition-bg-sfeir-2',
    'transition-bg-sfeir-3',
    'transition-bg-blue-1',
    'transition-bg-blue-2',
    'transition-bg-blue-3',
    'transition-bg-blue-blur',
    'transition-bg-green-1',
    'transition-bg-green-2',
    'transition-bg-green-3',
    'transition-bg-green-4',
    'transition-bg-green-5',
    'transition-bg-green-6',
];

/**
 * talk-control's built-in image styles: the words of an image title it turns
 * into classes on top of the project's `knowStyles`
 * (`@talk-control/talk-control-revealjs-extensions`, `markedStyledImage`).
 * Copied from talk-control 1.0.0-rc-4; `css.utils.spec.ts` fails on drift.
 */
export const TALK_CONTROL_IMAGE_STYLES: readonly string[] = [
    'company',
    'speaker',
    'badge',
    'center',
    'full-center',
    'float-left',
    'float-right',
    'full-width',
    'full-height',
    ...range(1, 20).flatMap((i) =>
        ['h', 'w', 'hm', 'wm'].map((prefix) => `${prefix}-${i * 50}`)
    ),
    ...range(1, 100).flatMap((i) => [`mt-${i * 10}`, `mb-${i * 10}`]),
];

/**
 * Image titles holding one of these words are not handled by
 * `markedStyledImage` but by talk-control's icon and QR code extensions,
 * which apply every word as a class, whatever `knowStyles` says.
 */
const TALK_CONTROL_CLASS_TITLE_MARKERS = ['tc-icons', 'tc-qrcode'];

/**
 * Icon pack keywords (`tc-icons feather …`): they pick the icon pack and are
 * not applied as classes. Copied from talk-control 1.0.0-rc-4 (the icon packs
 * registered by `src/js/sfeir-theme-initializer.ts`).
 */
export const TALK_CONTROL_ICON_PACK_KEYWORDS: readonly string[] = [
    'fa',
    'feather',
    'material-symbols',
];

export interface SlideCssClasses {
    /** From `<!-- … class="…" -->` rows: applied to the HTML as-is. */
    classAttributes: string[];
    /** From image titles (`![](src 'a b')`): a word becomes a class only if it is a known style. */
    imageStyles: string[];
}

export function getKnownCssClasses(
    rootDir: string,
    extraCssFiles: string[]
): Set<string> {
    const cssContent = THEME_CSS_FILES.concat(extraCssFiles)
        .map((cssFilePath) => getCssFile(rootDir, cssFilePath))
        .join('\n');
    return new Set([...extractCssClasses(cssContent), ...THEME_JS_CLASSES]);
}

/** Class names used in the selectors of a stylesheet. */
export function extractCssClasses(cssContent: string): string[] {
    // url() first: the theme inlines its fonts as (large) data URLs
    const withoutNoise = cssContent
        .replace(/url\([^)]*\)/g, '')
        .replace(/\/\*[\s\S]*?\*\//g, '');
    return (withoutNoise.match(/\.-?[_a-zA-Z][\w-]*/g) ?? []).map((selector) =>
        selector.slice(1)
    );
}

function getCssFile(rootDir: string, cssPath: string) {
    const filePath = slidesFilePath(rootDir, cssPath);
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch {
        throw new Error(`Cannot find: ${filePath}`);
    }
}

export function getCssClassesUsedInSlide(fileContent: string): SlideCssClasses {
    const classAttributes: string[] = [];
    const imageStyles: string[] = [];
    for (const row of fileContent.split('\n')) {
        // for syntax like:
        // <!-- .slide: class="with-code" -->
        // <!-- .slide: class="transition-bg-blue-3 right" -->
        if (row.startsWith('<!--')) {
            const classesPart = row.split('class="')[1];
            if (classesPart !== undefined) {
                classAttributes.push(
                    ...splitWords(
                        classesPart.substring(0, classesPart.indexOf('"'))
                    )
                );
            }
            continue;
        }
        // A trailing <!-- .element … --> comment is ignored, so the image
        // title before it is still read.
        const trimmed = row.replace(/\s*<!--.*-->\s*$/, '').trimEnd();
        // for syntax like:
        // ![](./assets/images/logo-sfeir-blanc.png 'company')
        // ![](clock 'tc-icons feather')<!-- .element: style="…" -->
        if (row.startsWith('![') && trimmed.endsWith("')")) {
            const words = splitWords(
                trimmed.substring(
                    trimmed.lastIndexOf(" '") + 2,
                    trimmed.length - 2
                )
            );
            // for syntax like:
            // ![](clock 'tc-icons feather tc-big')
            // ![](https://sfeir.com 'tc-qrcode')
            if (
                words.some((w) => TALK_CONTROL_CLASS_TITLE_MARKERS.includes(w))
            ) {
                classAttributes.push(
                    ...words.filter(
                        (w) => !TALK_CONTROL_ICON_PACK_KEYWORDS.includes(w)
                    )
                );
            } else {
                imageStyles.push(...words);
            }
        }
    }
    return { classAttributes, imageStyles };
}

function splitWords(value: string): string[] {
    return value.split(' ').filter((word) => word.length > 0);
}

function range(from: number, to: number): number[] {
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}
