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
 * The charte 2026 photo set, as shipped in dist/images/backgrounds/.
 *
 * The official master puts a photo under every slide: plaster on light slides, gold
 * dust / arc / rock on dark ones, with no overlay. Each photo sits on a flat fallback
 * colour declared in theme/layout.scss (`#181A1F` under dark photos, `#F9F9F9` under
 * plaster) so a slow network never shows white under light text.
 */
const PHOTO = {
    plaster: 'backgrounds/bg-plaster-white.webp', // light — opt-in texture, content slides default to flat Craie
    dust: 'backgrounds/bg-gold-particles-dark.webp', // cover and closing (official TITLE)
    arc: 'backgrounds/bg-gold-arc-dark.webp', // section divider (official L4)
    rock: 'backgrounds/bg-slate-rock-dark.webp', // dark content, the safest behind text
    flecks: 'backgrounds/bg-rock-gold-flecks-dark.webp',
    bokeh: 'backgrounds/bg-bokeh-dark.webp',
    brown: 'backgrounds/bg-brown-blur-dark.webp',
    sand: 'backgrounds/bg-gold-glitter-sand.webp', // mixed polarity: pair with bg-overlay
    pour: 'backgrounds/bg-sand-pour-dark.webp', // portrait; also the exercice band
} as const;

/**
 * Slide class → photo.
 *
 * talk-control's custom-background extension walks this map in insertion order and
 * sets `data-background` on the first class a section carries, so the order below is
 * the precedence: an author's explicit `bg-*` beats a per-class default (`transition
 * bg-rock` gets the rock), and the numbered legacy variants beat the archetype they
 * decorate (`transition transition-bg-sfeir-1` keeps its gold dust). One exception:
 * talk-control pre-seeds `quote-slide` at index 0 of the map, so `quote-slide` wins over
 * any `bg-*` on the same section.
 *
 * Every v4 class keeps resolving — downstream decks use them in their Markdown. The
 * colour/blur variants are deprecated, reported by the CLI and rewritten by the
 * v4-to-v5 codemod; they are mapped onto the nearest photo in the meantime.
 */
const BACKGROUNDS: Record<string, string> = {
    // Public photo classes (v5)
    'bg-plaster': PHOTO.plaster,
    'bg-dust': PHOTO.dust,
    'bg-arc': PHOTO.arc,
    'bg-rock': PHOTO.rock,
    'bg-flecks': PHOTO.flecks,
    'bg-bokeh': PHOTO.bokeh,
    'bg-brown': PHOTO.brown,
    'bg-sand': PHOTO.sand,
    'bg-pour': PHOTO.pour,
    // Deprecated colour variants (modifiers of `transition`), until v6
    'bg-white': PHOTO.plaster,
    'bg-pink': PHOTO.rock,
    'bg-blue': PHOTO.rock,
    'bg-green': PHOTO.rock,
    'transition-bg-sfeir-1': PHOTO.dust,
    'transition-bg-sfeir-2': PHOTO.arc,
    'transition-bg-sfeir-3': PHOTO.rock,
    'transition-bg-green-1': PHOTO.bokeh,
    'transition-bg-green-2': PHOTO.brown,
    'transition-bg-green-3': PHOTO.flecks,
    'transition-bg-green-4': PHOTO.sand,
    'transition-bg-green-5': PHOTO.rock,
    'transition-bg-green-6': PHOTO.dust,
    'transition-bg-green-blur': PHOTO.brown,
    'transition-bg-blue-1': PHOTO.bokeh,
    'transition-bg-blue-2': PHOTO.brown,
    'transition-bg-blue-3': PHOTO.flecks,
    'transition-bg-blue-blur': PHOTO.brown,
    // Archetypes
    'first-slide': PHOTO.dust,
    transition: PHOTO.arc,
    'speaker-slide': PHOTO.rock,
    'quote-slide': PHOTO.rock,
    'bg-blur': PHOTO.rock,
    'sfeir-slide': PHOTO.rock,
    'with-code-dark': PHOTO.rock,
    // The 25 % band of the exercice slide: theme/exercice.scss sizes the photo.
    exercice: PHOTO.pour,
};

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
                // Values with a file extension are resolved under basePath by
                // talk-control; reveal then recognises the .webp and paints it as a
                // background image (`background-size: cover`, centred) on the
                // `.slide-background-content` of the slide.
                mapBackgrounds: () => ({ ...BACKGROUNDS }),
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
