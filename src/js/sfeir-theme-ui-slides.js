import { html, render } from 'lit-html';
import { _handle_parameter } from './helper';

/**
 * Basic css for the slide selector
 */
const myCss = `   
    .ui-slide-selector-container {
        position: absolute;
        width: 50%;
        height: 70%;
        top: 20%;
        left: 25%;

        border-radius: 10px;
        background-color: #fafafa;
        box-shadow: #37474F 2px 2px 4px 2px;
        
        font-family:monospace;
        
        z-index: 100;

        display:grid;
        grid-template-rows: 50px 1fr 50px 150px 100px 20px;
        gir-template-columns: 1fr;

        #ui-slide-selector-close{
            position: absolute;
            top: 15px;
            right: 15px;
            cursor: pointer;
            font-size: 1.5em;
        }

        h1 {
            text-align: center;
            justify-self: center;
        }

        .slide-selector {
            overflow-y: auto;
        }
        ul {
            list-style-type: none;
        }
        li {
            margin: 10px;
        }

        div.modes {
            align-self: center;
            text-align: center;
            padding: 50px;
        }

        button{
            width: 150px;
            justify-self: center;
            margin: 20px;
        }
        span{
            text-align: center;
        }
    }
`;

// Factory to create the UI to select the slides
export const SfeirThemeUiSelector = {
    state: {
        slides: [], // State of slides with element of type {prefix: string, path: string, index: number, check: boolean}
        show: false, // Boolean to show the UI
        theme: undefined, // Default theme applied
        type: undefined, // Default type applied
        language: undefined, // Default language applied
    },
    /**
     * Method to call to init the UI
     * @param {*} slides : array of slides that respect the format {path: string}
     * @returns the list of slides to use respecting the format {path: string}
     */
    init(slides) {
        // Rework the slides to have tree structure
        this.state.slides = slides.map((elt, index) => {
            const regex = /^(?:(.+?)\/)?(.+?)(?=\.md$)/;
            const [, prefix, path] = elt.path.match(regex);
            return { prefix, path: path + '.md', index, check: true };
        });

        // Add lisntener to open the slide selector
        document.body.addEventListener('keyup', (e) =>
            this.keyUpHandler(e, slides)
        );

        // Init the modes (theme, lang, type)
        this.initModes();

        // Define the slides to use (by default, whats come's in)
        let slidesToUse = slides;
        // We check if in session storage we have something
        let slidesInSession = sessionStorage.getItem(
            'sfeir-theme-slides-selected'
        );
        // If something is in session storage, we use it (after transformation)
        if (slidesInSession) {
            const selectionOfSlides = JSON.parse(slidesInSession);
            // We update the state with the sessions storage
            this.state.slides = selectionOfSlides;
            // We only return the slides that are checked
            slidesToUse = selectionOfSlides
                .filter((elt) => elt.check)
                .map((elt) => {
                    return {
                        path: elt.prefix
                            ? elt.prefix + '/' + elt.path
                            : elt.path,
                    };
                });
        }
        return slidesToUse;
    },
    /**
     * Handler that open the slide selector
     * @param {*} e keyup event
     */
    keyUpHandler(e) {
        if (
            (e.key === 'c' || e.key === 'C') &&
            !e.ctrlKey &&
            !e.shiftKey &&
            !e.metaKey &&
            !this.state.show
        ) {
            e.preventDefault();
            this.state.show = true;
            this.resetOrCreateUI();
        } else if (e.key === 'Escape' && this.state.show) {
            e.preventDefault();
            this.closeUI();
        }
    },
    /**
     * Init the modes (Theme, Language, Type) according to parameters available in the session storage
     */
    initModes() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const slidesElement = document.querySelector('.reveal .slides');

        // We only get informations from url or inside html

        this.state.theme = _handle_parameter(
            urlParams,
            'theme',
            slidesElement,
            'data-theme-slides',
            undefined
        );
        this.state.type = _handle_parameter(
            urlParams,
            'type',
            slidesElement,
            'data-type-show',
            undefined
        );
        this.state.language = _handle_parameter(
            urlParams,
            'data-lang',
            slidesElement,
            'data-lang',
            undefined
        );
    },
    /**
     * Method called to close the UI
     */
    closeUI() {
        this.state.show = false;
        let elementSelection = document.querySelector('#ui-slide-selector');
        if (elementSelection) {
            elementSelection.style = 'display:none';
        }
    },
    /**
     * Transform the slides array to a tree structure to render it
     * it will only allow a one level tree depth.
     *
     * All the path with no prefix will be in the first element of the array
     * @returns the tree structure of slides in an array
     */
    createTreeFromSlides() {
        const tree = {};
        const emptyArray = [];
        // We will group all files with the same prefix
        this.state.slides.forEach((slide) => {
            if (slide.prefix) {
                if (!tree[slide.prefix]) {
                    tree[slide.prefix] = [];
                }
                tree[slide.prefix].push(slide);
            } else {
                emptyArray.push([slide]);
            }
        });
        // We return the entries of the tree to manipulate it
        const treeArray = Object.entries(tree);
        treeArray.unshift(...emptyArray);
        return treeArray;
    },
    /**
     * Render the ui (creation of element if not exist, else reset the content of the element)
     */
    resetOrCreateUI() {
        let elementSelection = document.querySelector('#ui-slide-selector');
        if (!elementSelection) {
            elementSelection = document.createElement('DIV');
            elementSelection.id = 'ui-slide-selector';
            elementSelection.style =
                'position:absolute; width:100%; height: 100%; top:0; left:0; z-index:100;';
            document.body.appendChild(elementSelection);
        }
        elementSelection.style.display = this.state.show ? 'grid' : 'none';
        // We finally init the UI
        this.initUI(elementSelection);
    },
    /**
     * Main method to create the UI
     * @param {*} element : the html element where we inject the UI
     * @returns the render of the UI
     */
    initUI(element) {
        // We convert our files path to a tree structure
        const treeArray = this.createTreeFromSlides();
        return render(
            html`
                <style>
                    ${myCss}
                </style>
                <div class="ui-slide-selector-container">
                    <div
                        id="ui-slide-selector-close"
                        @click="${() => this.closeUI()}">
                        ✖️
                    </div>
                    <h1>Slide selector</h1>
                    <div class="slide-selector">
                        <ul>
                            ${treeArray.map(([key, value]) =>
                                this.renderTreeElement(key, value)
                            )}
                        </ul>
                    </div>
                    <h1>Modes (type / theme / language)</h1>
                    <div class="modes">
                        <label for="mode-theme">Theme</label>
                        <input
                            type="text"
                            id="mode-theme"
                            placeholder="(empty default 'school')"
                            value="${this.state.theme
                                ? this.state.theme
                                : undefined}" />
                        <label for="mode-language">Language</label>
                        <input
                            type="text"
                            id="mode-language"
                            placeholder="(empty default 'FR')"
                            value="${this.state.language
                                ? this.state.language
                                : undefined}" />
                        <label for="mode-slides">Type</label>
                        <input
                            type="text"
                            id="mode-type"
                            placeholder="(empty default 'prez')"
                            value="${this.state.type
                                ? this.state.type
                                : undefined}" />
                    </div>
                    <button @click="${() => this.applyConfiguration()}">
                        Validate selection
                    </button>
                    <span
                        >Close this window by pressing 'Escape', clicking on
                        cross or validating the selection</span
                    >
                </div>
            `,
            element
        );
    },
    /**
     *
     * @param {*} key the prefix of the tree. Key could be a path if no prefix
     * @param {*} value the array of path under the prefix. Value could be null if no prefix.
     * @returns the render litHTML Method
     */
    renderTreeElement(key, value) {
        if (value) {
            // We have a tree to render
            return html`<li>
                <input @click="${(e) =>
                    this.checkPrefix(e, key)}" type="checkbox" ?checked=${
                value.reduce((acc, elt) => acc + (elt.check ? 1 : 0), 0) ===
                value.length
            }></input><span>${key}</span>
                <ul>
                    ${value.map((elt) => this.renderLiElement(elt))}
                </ul>
            </li>`;
        } else {
            // Everything is in the key
            return this.renderLiElement(key);
        }
    },
    /**
     * Method that render a leaf of the tree
     * @param {*} slide : a slide element with path, index, check, prefix
     * @returns the render method
     */
    renderLiElement(slide) {
        return html`<li>
                    <input @click="${(e) =>
                        this.checkSlide(
                            e,
                            slide.index
                        )}" type="checkbox" ?checked=${slide.check}>
                        </input>${slide.path}
                </li>`;
    },
    /**
     * Handler method that deals with the checkbox of the prefix.
     * This method will update the state and the session storage and reset the UI
     * @param {*} event : click event
     * @param {*} prefix : the prefix of the slides (to update the state of children slides)
     */
    checkPrefix(event, prefix) {
        this.state.slides.forEach((elt) => {
            if (elt.prefix === prefix) {
                elt.check = event.srcElement.checked;
            }
        });
        sessionStorage.setItem(
            'sfeir-theme-slides-selected',
            JSON.stringify(this.state.slides)
        );
        this.resetOrCreateUI();
    },
    /**
     * Handler method that deals with the checkbox of a slide.
     * This method will update the state and the session storage and reset the UI
     * @param {*} event : click event
     * @param {*} index : the index of the slide in the state
     */
    checkSlide(event, index) {
        this.state.slides[index].check = event.srcElement.checked;
        sessionStorage.setItem(
            'sfeir-theme-slides-selected',
            JSON.stringify(this.state.slides)
        );
        this.resetOrCreateUI();
    },

    extractModes() {
        const theme = document.querySelector('#mode-theme').value || undefined;
        const language =
            document.querySelector('#mode-language').value || undefined;
        const type = document.querySelector('#mode-type').value || undefined;
        return { theme, language, type };
    },

    /**
     * Handler method that deals with the apply button. it will refresh the page
     */
    applyConfiguration() {
        const { theme, language, type } = this.extractModes();

        // Construct the url
        let newUrl = '';
        const addUrl = (url, key, value) =>
            value && url
                ? `${url}&${key}=${value}`
                : value
                ? `${url}?${key}=${value}`
                : url;

        newUrl = addUrl(newUrl, 'theme', theme);
        newUrl = addUrl(newUrl, 'data-lang', language);
        newUrl = addUrl(newUrl, 'type', type);

        // Apply the new url
        history.pushState({ theme, language, type }, '', newUrl);
        history.go(0);
    },
};
