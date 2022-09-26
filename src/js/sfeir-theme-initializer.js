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
    init(slidesFactory, slidesRenderer = defaultSlideRenderer) {
        const importSlideElement = document.querySelector('.slides');
        slidesRenderer(importSlideElement, slidesFactory());

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
                        32: function () {
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

/**
 * Render the html
 */
function defaultSlideRenderer(element, slides) {
    return render(
        html`
            ${slides.map(
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
