import {
    ThemeInitializer,
    featherIconPack,
    fontAwesomeIconPack,
    materialSymbolsIconPack,
} from '@talk-control/talk-control-revealjs-extensions';
import RevealSfeirThemePlugin from './sfeir-theme-plugin';

interface SlidePath {
    path: string;
}

export const SfeirThemeInitializer = {
    /**
     * @param {() => Array.<string>} slidesFactory
     */
    async init(slidesFactory: (showType?: string) => SlidePath[]) {
        await ThemeInitializer.init({
            slidesFactory,
            tcCustomBackgroundOptions: {
                basePath: '/web_modules/sfeir-school-theme/dist/images/',
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
                defaultLang: 'FR',
            },
            tcMarkedOptions: {
                fontIcons: [
                    fontAwesomeIconPack(),
                    featherIconPack(),
                    materialSymbolsIconPack(),
                ],
                knowStyles: [],
            },
            tcThemeOptions: {
                defaultTheme: 'school',
            },
            plugins: [RevealSfeirThemePlugin],
        });
    },
};
