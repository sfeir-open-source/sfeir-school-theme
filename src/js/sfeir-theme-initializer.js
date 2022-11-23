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

        // Notes aren't shown by default
        // eg. <div class="slides"/>
        // or  <div class="slides" data-show-notes="any other value" />
        var enableShowNotes = false
        if (importSlideElement.dataset.showNotes == 'separate-page') {
            // eg. <div class="slides" data-show-notes="separate-page"/>
            enableShowNotes = 'separate-page'
        } else if (importSlideElement.dataset.showNotes == '') {
            // eg. <div class="slides" data-show-notes/>
            enableShowNotes = true
        }

        // No max pages per slide by default
        // eg. <div class="slides"/>
        var pdfMaxPagesPerSlide = 0
        if (importSlideElement.dataset.pdfMaxPagesPerSlide != null) {
            // eg. <div class="slides" data-pdf-max-pages-per-slide="<number>"/>
            pdfMaxPagesPerSlide = importSlideElement.dataset.pdfMaxPagesPerSlide
        }

        // Fragments are separated by default
        // eg. <div class="slides"/>
        var pdfSeparateFragments = true;
        if (importSlideElement.dataset.pdfDontSeparateFragments == '') {
            // eg. <div class="slides" data-pdf-dont-separate-fragments/>
            pdfSeparateFragments = false;
        }

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
                    showNotes: enableShowNotes,
                    pdfMaxPagesPerSlide: pdfMaxPagesPerSlide,
                    pdfSeparateFragments: pdfSeparateFragments,
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
