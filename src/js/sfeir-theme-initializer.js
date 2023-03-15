import { html, render } from 'lit-html';

import Reveal from 'reveal.js';
import RevealHighlight from 'reveal.js/plugin/highlight/highlight.esm';
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown.esm';
import RevealNotes from 'reveal.js/plugin/notes/notes.esm';
import RevealZoom from 'reveal.js/plugin/zoom/zoom.esm';
import RevealSfeirThemePlugin from './sfeir-theme-plugin';

export const SfeirThemeInitializer = {
    /**
     * @param {() => Array.<string>} slidesFactory
     */
    async init(slidesFactory, slidesRenderer = defaultSlideRenderer) {
        const importSlideElement = document.querySelector('.slides');
        const slides = slidesFactory();
        const slidesI18n = await i18n(slides);

        await slidesRenderer(importSlideElement, slidesI18n);

        setTimeout(
            () =>
                Reveal.initialize({
                    controls: true,
                    progress: true,
                    history: true,
                    center: false,
                    width: 1920,
                    height: 1080,
                    keyboard: {
                        32: function() {
                            var video =
                                document.querySelector('.present video');
                            if (video.paused == true) {
                                video.play();
                            } else {
                                video.pause();
                            }
                        },
                    },

                    slideNumber: 'c/t',
                    showSlideNumber: 'speaker',

                    plugins: [
                        RevealMarkdown,
                        RevealSfeirThemePlugin,
                        RevealZoom,
                        RevealNotes,
                        RevealHighlight,
                    ],
                }).then(() => {
                    Reveal.configure({
                        theme: Reveal.getQueryHash().theme, // available themes are in /css/theme
                        transition: Reveal.getQueryHash().transition || 'none', // default/cube/page/concave/zoom/linear/fade/none
                    });
                }),
            1000
        );
    },
};

async function i18n(slides) {
    const language =
        new URLSearchParams(window.location.search).get('lang') ??
        document.querySelector('.reveal .slides').getAttribute('data-lang') ??
        'fr';

    console.log('Slides language : ', language);

    return slides
        .map(path => {
            const tmp = path['path'].substring(0, path['path'].length - 3);
            return firstExisting(
                { path: tmp + '-' + language + '.md' },
                { path: tmp + '.md' },
                { path: tmp + '-fr.md' },
            )
        });
}

async function firstExisting(...paths) {
    const data = paths.map(path => {
        const promise = fetch('markdown/' + path['path'], { 'method': 'HEAD' })
        return promise
    });

    for (const i in data) {
        if ((await data[i]).status === 200)
            return paths[i];
    }
}

/**
 * Render the html
 */
async function defaultSlideRenderer(element, slides) {
    const slidesI18n = await Promise.all(slides)

    return render(
        html`
            ${slidesI18n.map(
                (slide) => html`
                    <section
                        data-markdown="./markdown/${slide.path}"
                        data-separator="##==##"
                        data-separator-vertical="##--##"
                        data-separator-notes="^Notes:"></section>
                `
            )}
        `,
        element
    );
}
