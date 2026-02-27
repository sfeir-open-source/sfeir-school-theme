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
                mapBackgrounds(theme) {
                    return {
                        'first-slide':
                            theme === 'institute'
                                ? 'bg-blue-1.webp'
                                : 'bg-green-1.webp',
                        transition:
                            theme === 'institute'
                                ? 'bg-blue-1.webp'
                                : 'bg-green-1.webp',
                        'speaker-slide': `var(--black)`,
                        'quote-slide': `var(--black)`,
                        'sfeir-slide': `bg-green-1.webp`,
                        'bg-white': `bg-green-1.webp`,
                        'bg-pink': `bg-green-1.webp`,
                        'bg-blue': `bg-green-1.webp`,
                        'bg-green': `bg-green-1.webp`,
                        'bg-blur':
                            theme === 'institute'
                                ? 'bg-blue-blur.webp'
                                : 'bg-green-blur.webp',
                        'transition-bg-sfeir-1':
                            theme === 'institute'
                                ? 'bg-blue-1.webp'
                                : 'bg-green-1.webp',
                        'transition-bg-sfeir-2':
                            theme === 'institute'
                                ? 'bg-blue-2.webp'
                                : 'bg-green-2.webp',
                        'transition-bg-sfeir-3':
                            theme === 'institute'
                                ? 'bg-blue-3.webp'
                                : 'bg-green-3.webp',
                        'transition-bg-blue-1': `bg-blue-1.webp`,
                        'transition-bg-blue-2': `bg-blue-2.webp`,
                        'transition-bg-blue-3': `bg-blue-3.webp`,
                        'transition-bg-blue-blur': `bg-blue-blur.webp`,
                        'transition-bg-green-1': `bg-green-1.webp`,
                        'transition-bg-green-2': `bg-green-2.webp`,
                        'transition-bg-green-3': `bg-green-3.webp`,
                        'transition-bg-green-4': `bg-green-4.webp`,
                        'transition-bg-green-5': `bg-green-5.webp`,
                        'transition-bg-green-6': `bg-green-6.webp`,
                    };
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
