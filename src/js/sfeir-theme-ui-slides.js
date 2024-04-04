import { html, render, css } from 'lit-html';

export const SfeirThemeUiSelector = {
    state: {
        slides: [],
    },
    init(slides) {
        this.state.slides = slides.map((elt) => {
            return { path: elt.path, check: true };
        });
        document.body.addEventListener('keyup', (e) =>
            this.keyUpHandler(e, slides)
        );

        let slidesToUse = slides;
        let slidesInSession = sessionStorage.getItem(
            'sfeir-theme-slides-selected'
        );
        if (slidesInSession) {
            const selectionOfSlides = JSON.parse(slidesInSession);
            this.state.slides = selectionOfSlides;
            slidesToUse = selectionOfSlides
                .filter((elt) => elt.check)
                .map((elt) => {
                    return { path: elt.path };
                });
        }
        return slidesToUse;
    },

    keyUpHandler(e) {
        if (e.key === 'c') {
            let elementSelection = document.querySelector('ui-slide-selector');
            if (!elementSelection) {
                elementSelection = document.createElement('DIV');
                elementSelection.id = 'ui-slide-selector';
                elementSelection.style =
                    'position:absolute; width:100%; height: 100%; top:0; left:0; z-index:100;';
                document.body.appendChild(elementSelection);
            }
            this.initUI(elementSelection);
        }
    },

    initUI(element) {
        return render(
            html`
                <div
                    style="position:absolute; width:50%; height:60%; top:20%; left:25%; background-color:grey;">
                    <ul>
                        ${this.state.slides.map(
                            (slide, index) =>
                                console.log(slide) ||
                                html`
                        <li>
                            <input @click="${(e) =>
                                this.checkSlide(
                                    e,
                                    index,
                                    slide.path
                                )}" type="checkbox" ?checked=${
                                    slide.check
                                }></input>${slide.path}
                        </li>
                        `
                        )}
                    </ul>
                    <button @click="${() => this.applySlides()}">
                        Validate selection
                    </button>
                </div>
            `,
            element
        );
    },

    checkSlide(event, index, slidePath) {
        this.state.slides[index].check = event.srcElement.checked;
        //let finalSlides = [...this.state.slides];
        //if (event.srcElement.checked) {
        //    finalSlide; //s.push
        //}
        sessionStorage.setItem(
            'sfeir-theme-slides-selected',
            JSON.stringify(this.state.slides)
        );
        //console.log(event.srcElement.checked, index, slidePath);
    },

    applySlides() {
        // Refresh the page
        location.reload();
    },
};
