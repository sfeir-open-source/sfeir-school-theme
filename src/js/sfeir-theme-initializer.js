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
        // Retrieve the slide path list
        const slides = slidesFactory();
        // Retrieve the translate version asked (if needed)
        const slidesI18n = await i18n(slides);

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

        // Generate all the DOM code corresponding to slides
        await slidesRenderer(importSlideElement, slidesI18n);

        // Init the Reveal Engine
        Reveal.initialize({
            controls: true,
            progress: true,
            history: true,
            center: false,
            width: 1920,
            height: 1080,
            keyboard: {
                32: function () {
                    var video = document.querySelector('.present video');
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
        });
    },
};

/**
 * Function that gives the path with translate extension if needed
 * @param {string[]} slides : array of paths of slides
 * @returns a Promise that returns a string[] with the correct suffix for internationalization
 */
async function i18n(slides) {
    const language =
        new URLSearchParams(window.location.search).get('data-lang') ??
        document.querySelector('.reveal .slides').getAttribute('data-lang') ??
        'FR';

    if (language === 'FR') return Promise.resolve(slides);

    return slides.map((path) => {
        const tmp = path['path'].substring(0, path['path'].length - 3);
        return firstExisting(
            { path: `${tmp}.${language.toUpperCase()}.md` },
            { path: `${tmp}.md` }
        );
    });
}

/**
 * Check if a path is available (path for markdown file)
 * @param  {...string} paths : files to check
 * @returns the path that return a 200 status
 */
async function firstExisting(...paths) {
    const data = paths.map((path) => {
        const promise = fetch('markdown/' + path['path'], { method: 'HEAD' });
        return promise;
    });

    for (const i in data) {
        if ((await data[i]).status === 200) return paths[i];
    }
}

/**
 * Render the html
 */
async function defaultSlideRenderer(element, slides) {
    const slidesI18n = await Promise.all(slides);

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
