import { RootPart, html, render } from 'lit-html';
import {
    ThemeInitializer,
    featherIconPack,
    fontAwesomeIconPack,
    materialSymbolsIconPack,
} from '@talk-control/talk-control-revealjs-extensions';
import RevealSfeirThemePlugin from './sfeir-theme-plugin';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

interface SlidePath {
    path: string;
}

/**
 * Every slide class that carries a background, all of them Noir Carbone.
 *
 * The charte builds depth from a tonal ramp rather than from imagery, so the eleven
 * raster backgrounds of the v4 theme are gone. The class names stay — downstream school
 * decks use them in their Markdown — they simply all resolve to flat black now, which
 * is also what makes the accent legible: tokens/_context.scss lists the same archetypes
 * and flips them to the on-dark tier.
 *
 * The colour/blur variants are kept as deprecated aliases and are rewritten by the
 * v4-to-v5 codemod.
 */
const DARK_BACKGROUND_CLASSES = [
    'first-slide',
    'transition',
    'speaker-slide',
    'quote-slide',
    'sfeir-slide',
    'bg-blur',
    // Deprecated colour variants, kept resolving until v6.
    'bg-white',
    'bg-pink',
    'bg-blue',
    'bg-green',
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

type SfeirThemeInitializerOptions = {
    slidesFactory: (showType?: string) => SlidePath[];
    knowStyles?: string[];
    plugins?: Reveal.PluginFunction[];
    defaultLang?: string;
    extrasRenderAttr?: string;
};

export const SfeirThemeInitializer = {
    async init(
        params:
            | ((showType?: string) => SlidePath[])
            | SfeirThemeInitializerOptions
    ) {
        let slidesFactory: (showType?: string) => SlidePath[];
        let knowStyles: string[] = [];
        let plugins: Reveal.PluginFunction[] = [];
        let defaultLang = 'FR';
        let extrasRenderAttr: string | undefined;

        if (typeof params === 'function') {
            slidesFactory = params;
        } else {
            ({
                slidesFactory,
                knowStyles = [],
                plugins = [],
                defaultLang = 'FR',
                extrasRenderAttr,
            } = params);
        }

        await ThemeInitializer.init({
            slidesFactory,
            slidesRenderer: schoolSlideRenderer(extrasRenderAttr),
            tcCustomBackgroundOptions: {
                basePath: './web_modules/sfeir-school-theme/dist/images/',
                mapBackgrounds() {
                    return DARK_BACKGROUND_CLASSES.reduce<
                        Record<string, string>
                    >((backgrounds, className) => {
                        backgrounds[className] = 'var(--sfeir-noir)';
                        return backgrounds;
                    }, {});
                },
            },
            tcI18nOptions: {
                baseMarkdownPath: 'markdown/',
                defaultLang,
            },
            tcMarkedOptions: {
                fontIcons: [
                    fontAwesomeIconPack(),
                    featherIconPack(),
                    materialSymbolsIconPack(),
                ],
                knowStyles,
            },
            tcThemeOptions: {
                defaultTheme: 'school',
            },
            plugins: [...plugins, RevealSfeirThemePlugin],
        });
    },
};

/**
 * Render the html with override for custom attribute
 */
function schoolSlideRenderer(customAttribute?: string) {
    return function schoolSlideRenderer(
        element: HTMLElement,
        slides: SlidePath[]
    ): RootPart {
        return render(
            html`
                ${slides.map((slide) => {
                    const path = `./markdown/${slide.path}`;
                    const extraAttr = customAttribute
                        ? `${customAttribute}="${path}"`
                        : '';
                    return unsafeHTML(`
                        <section
                            data-markdown="${path}"
                            ${extraAttr}
                            data-separator="##==##"
                            data-separator-vertical="##--##"
                            data-separator-notes="^Notes:"></section>
                    `);
                })}
            `,
            element
        );
    };
}
