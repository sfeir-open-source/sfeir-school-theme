import Reveal from 'reveal.js';
import feather from 'feather-icons';

const imagesPath = 'web_modules/sfeir-school-theme/images';

export class SfeirTheme {
    constructor() {
        this.path = '';
    }

    postprocess() {
        this.path = this._extractPath();

        // FavIcon
        this._manageFavIcon();

        // ManageBackground
        this._manageBackgrounds();

        // ManageExercices
        this._manageExerciceSlide();

        // ManageShowContent
        this._manageShowTypeContent();

        // ManageSpecificsColumnsSlides
        this._manageSpecificsColumnsSlides();

        // ManageListFragements
        this._manageListFragment();

        // Manage Hack to speakers images
        this._manageSpeakersBorders();

        // Manage Hack for using feather icons easily
        this._manageFeatherIcons();
    }
    _extractPath() {
        const links = document.getElementsByTagName('link');

        for (let idx = 0; idx < links.length; idx++) {
            const link = links.item(idx);

            if (link.href && link.href.match(/sfeir-school-theme\.css$/)) {
                const path = link.href;
                return path.substring(
                    0,
                    path.indexOf('css/sfeir-school-theme.css')
                );
            }
        }
        return '';
    }

    _manageFavIcon() {
        const resolutions = ['16x16', '32x32', '96x96'];
        for (let resolution of resolutions) {
            const link = document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.sizes = resolution;
            link.href = `${this.path}${imagesPath}/favicon-${resolution}.png`;
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        const link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = `${this.path}${imagesPath}/favicon.ico`;
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    _manageBackgrounds() {
        const modeContent =
            document
                .querySelector('.reveal .slides')
                .getAttribute('data-theme-slides') ?? 'school';

        const map = {
            'first-slide': `${this.path}${imagesPath}/${
                modeContent === 'institute' ? 'bg-blue-1.png' : 'bg-green-1.png'
            }`,
            transition: `${this.path}${imagesPath}/${
                modeContent === 'institute' ? 'bg-blue-1.png' : 'bg-green-1.png'
            }`,
            'speaker-slide': `var(--black)`,
            'quote-slide': `var(--black)`,
            'sfeir-slide': `${this.path}${imagesPath}/bg-green-1.png`,
            'bg-white': `${this.path}${imagesPath}/bg-green-1.png`,
            'bg-pink': `${this.path}${imagesPath}/bg-green-1.png`,
            'bg-blue': `${this.path}${imagesPath}/bg-green-1.png`,
            'bg-green': `${this.path}${imagesPath}/bg-green-1.png`,
            'bg-blur': `${this.path}${imagesPath}/${
                modeContent === 'institute' ? 'bg-blue-blur.jpeg' : 'bg-green-blur.jpeg'
            }`,
            'transition-bg-sfeir-1': `${this.path}${imagesPath}/${
                modeContent === 'institute' ? 'bg-blue-1.png' : 'bg-green-1.png'
            }`,
            'transition-bg-sfeir-2': `${this.path}${imagesPath}/${
                modeContent === 'institute' ? 'bg-blue-1.png' : 'bg-green-1.png'
            }`,
            'transition-bg-sfeir-3': `${this.path}${imagesPath}/${
                modeContent === 'institute' ? 'bg-blue-1.png' : 'bg-green-1.png'
            }`,
            'transition-bg-blue-1': `${this.path}${imagesPath}/bg-blue-1.png`,
            'transition-bg-blue-2': `${this.path}${imagesPath}/bg-blue-2.jpeg`,
            'transition-bg-blue-3': `${this.path}${imagesPath}/bg-blue-3.png`,
            'transition-bg-blue-blur': `${this.path}${imagesPath}/bg-blue-blur.jpg`,
            'transition-bg-green-1': `${this.path}${imagesPath}/bg-green-1.png`,
            'transition-bg-green-2': `${this.path}${imagesPath}/bg-green-2.png`,
            'transition-bg-green-3': `${this.path}${imagesPath}/bg-green-3.png`,
            'transition-bg-green-4': `${this.path}${imagesPath}/bg-green-4.png`,
            'transition-bg-green-5': `${this.path}${imagesPath}/bg-green-5.png`,
            'transition-bg-green-6': `${this.path}${imagesPath}/bg-green-6.png`,
        };

        for (let key in map) {
            const queryElementList = document.querySelectorAll(
                '.reveal .slides section:not([data-background]).' + key
            );

            for (let i = 0; i < queryElementList.length; i++) {
                const element = queryElementList[i];
                element.classList.add('sfeir-specific-slide');
                element.setAttribute('data-background', map[key]);
            }
        }

        // Add default background for slides
        const genericsSlides = [
            ...document.querySelectorAll(
                '.reveal .slides section:not([data-background]):not(.sfeir-specific-slide):not(.no-background):not(.with-code-dark):not([class*=transition])'
            ),
        ];
        for (let genericSlide of genericsSlides) {
            genericSlide.classList.add('sfeir-basic-slide');
        }

        this._manageFirstSlide();
    }

    _manageFirstSlide() {
        const firstSlides = [
            ...document.querySelectorAll('.reveal .slides section.first-slide'),
        ];
        for (let firstSlideSection of firstSlides) {
            const imgLogo = document.createElement('DIV');
            imgLogo.classList.add('sfeir-logo');
            imgLogo.style[
                'background-image'
            ] = `url(${this.path}${imagesPath}/logo_empty.png)`;

            const level = firstSlideSection.hasAttribute('sfeir-level')
                ? +firstSlideSection.getAttribute('sfeir-level')
                : 1;
            const techno = firstSlideSection.hasAttribute('sfeir-techno')
                ? firstSlideSection.getAttribute('sfeir-techno')
                : '';
            imgLogo.setAttribute('data-sfeir-level', level);
            imgLogo.setAttribute('data-sfeir-techno', techno);

            firstSlideSection.insertAdjacentElement('afterbegin', imgLogo);
        }
    }

    _manageExerciceSlide() {
        const modeContent =
            document
                .querySelector('.reveal .slides')
                .getAttribute('data-theme-slides') ?? 'school';
        const exercicesSlides = [
            ...document.querySelectorAll('.reveal .slides section.exercice'),
        ];
        for (let exercicesection of exercicesSlides) {
            ``;
            const colorToUse =
                modeContent === 'institute'
                    ? 'var(--sfeir-blue)'
                    : 'var(--sfeir-green)';
            exercicesection.setAttribute(
                'data-background',
                `linear-gradient(90deg,  ${colorToUse} 25%, white 25%, white 100%)`
            );
        }
    }

    _manageShowTypeContent() {
        const showTypeContent = document
            .querySelector('.reveal .slides')
            .getAttribute('data-type-show');
        if (showTypeContent) {
            const showTypeSlides = document.querySelectorAll(
                '.reveal .slides section[data-type-show]'
            );
            for (let i = 0; i < showTypeSlides.length; i++) {
                const tmpSlide = showTypeSlides[i];
                if (
                    tmpSlide.getAttribute('data-type-show') != showTypeContent
                ) {
                    tmpSlide.parentNode.removeChild(tmpSlide);
                }
            }
        }
    }

    _manageSpecificsColumnsSlides() {
        const twoColSlides = [
            ...document.querySelectorAll(
                '.reveal .slides section.two-column-layout'
            ),
        ];
        for (let twoColSection of twoColSlides) {
            const parentSection = twoColSection.parentElement;
            parentSection.classList.add('two-column-layout');
            // Need to overrides reveal inlinestyles
            parentSection.style.display = 'grid';
            if (parentSection.nodeName === 'SECTION') {
                const subSections = [
                    ...parentSection.querySelectorAll('section'),
                ];
                for (let subSection of subSections) {
                    subSection.classList.remove('two-column-layout');
                    subSection.style.display = 'block';
                }
            }
        }
        const gridlSlides = [
            ...document.querySelectorAll('.reveal .slides section.two-column'),
        ];
        for (let twoColSection of gridlSlides) {
            const parentSection = twoColSection.parentElement;
            parentSection.classList.add('two-column');
            const divParentElt = document.createElement('DIV');
            divParentElt.style.display = 'grid';
            divParentElt.classList.add('grid-div');
            parentSection.appendChild(divParentElt);
            parentSection.classList.add('sfeir-basic-slide');
            if (parentSection.nodeName === 'SECTION') {
                const subSections = [
                    ...parentSection.querySelectorAll('section'),
                ];
                let indexSection = 0;
                for (let subSection of subSections) {
                    parentSection.classList.add(
                        ...subSection.classList.values()
                    );
                    if (subSection.hasAttribute('data-background')) {
                        parentSection.classList.add(
                            indexSection === 0
                                ? 'data-bg-left'
                                : 'data-bg-right'
                        );
                        const dataBgString =
                            subSection.getAttribute('data-background');
                        if (
                            /^(http|file|\/\/)/gi.test(dataBgString) ||
                            /\.(svg|png|jpg|jpeg|gif|bmp|webp)([?#\s]|$)/gi.test(
                                dataBgString
                            )
                        ) {
                            parentSection.setAttribute(
                                'data-background-image',
                                dataBgString
                            );
                        } else {
                            parentSection.setAttribute(
                                'data-background',
                                dataBgString
                            );
                        }
                    } else if (
                        subSection.hasAttribute('data-background-image')
                    ) {
                        parentSection.classList.add(
                            indexSection === 0
                                ? 'data-bg-left'
                                : 'data-bg-right'
                        );
                        parentSection.setAttribute(
                            'data-background-image',
                            subSection.getAttribute('data-background-image')
                        );
                    }
                    const divElt = document.createElement('DIV');
                    divElt.innerHTML = subSection.innerHTML;
                    divElt.style.display = 'block';
                    parentSection.removeChild(subSection);
                    divParentElt.appendChild(divElt);
                    indexSection++;
                }
            }
        }

        if (Reveal) {
            // Need to overrides reveal inlinestyles
            Reveal.addEventListener('slidechanged', (event) => {
                console.log(event);
                const currentSlide = event.currentSlide;
                const parentSlide = currentSlide.parentElement;
                // Have to rewrite block due to override of reveal
                if (
                    parentSlide.nodeName === 'SECTION' &&
                    parentSlide.classList.contains('two-column-layout')
                ) {
                    const state = Reveal.getState();
                    state.indexv = 2;
                    Reveal.setState(state);
                    parentSlide.style.display = 'grid';

                    // Have to rewrite block due to bug
                    const subSections = [
                        ...parentSlide.querySelectorAll('section'),
                    ];
                    subSections[0].style.display = 'block';
                }
            });
        }
    }

    _manageListFragment() {
        const listItemWithFragments = [
            ...document.querySelectorAll(
                '.reveal .slides section .list-fragment'
            ),
        ];
        for (let lisItemWithFragmentTag of listItemWithFragments) {
            let parentOfListItem = lisItemWithFragmentTag.parentElement; // Ul or OL
            if (parentOfListItem.nodeName === 'LI') {
                // Specific case when you have some markdown bold or italic
                parentOfListItem = parentOfListItem.parentElement;
            }
            if (
                parentOfListItem.nodeName === 'UL' ||
                parentOfListItem.nodeName === 'OL'
            ) {
                const listItemsOfParent = [
                    ...parentOfListItem.querySelectorAll('li'),
                ];
                for (let listItem of listItemsOfParent) {
                    listItem.classList.add('fragment');
                }
            }
        }
    }

    _manageSpeakersBorders() {
        const imgOfSpeakersToReplaces = [
            ...document.querySelectorAll(
                '.reveal .slides section img[alt*=speaker]'
            ),
        ];
        for (let imgToReplace of imgOfSpeakersToReplaces) {
            let parentOfImg = imgToReplace.parentElement;
            const divWithBgElement = document.createElement('DIV');
            divWithBgElement.classList.add('speaker');
            divWithBgElement.style[
                'background-image'
            ] = `url(${imgToReplace.src})`;
            parentOfImg.appendChild(divWithBgElement);
            parentOfImg.removeChild(imgToReplace);
        }
    }

    _manageFeatherIcons() {
        const imgOfFeatherIcons = [
            ...document.querySelectorAll(
                '.reveal .slides section img[alt*=sfeir-icons]'
            ),
        ];
        const sectionsWhereReplace = [];
        const imgListToReplace = [];
        for (let imgToTransform of imgOfFeatherIcons) {
            let sectionTemp = imgToTransform.closest('.reveal .slides section');
            if (
                sectionsWhereReplace.findIndex((elt) => elt === sectionTemp) ===
                -1
            ) {
                sectionsWhereReplace.push(sectionTemp);
            }
            imgListToReplace.push(imgToTransform.outerHTML);
        }

        let newImgList = imgListToReplace;
        for (let sectionTmp of sectionsWhereReplace) {
            let tempNewListOfImg = [];
            for (let imgToReplace of newImgList) {
                if (sectionTmp.innerHTML.indexOf(imgToReplace) !== -1) {
                    let imgTextReplace =
                        imgToReplace.replace('<img', '<i') + '</i>';
                    imgTextReplace = imgTextReplace.replace(
                        'src',
                        'data-feather'
                    );
                    sectionTmp.innerHTML = sectionTmp.innerHTML.replace(
                        imgToReplace,
                        imgTextReplace
                    );
                } else {
                    tempNewListOfImg.push(imgToReplace);
                }
            }
            newImgList = tempNewListOfImg;
        }

        feather.replace();
    }
}

const RevealSfeirThemePlugin = {
    id: 'sfeir-theme',
    init: () => {
        const sfeirTheme = new SfeirTheme();
        sfeirTheme.postprocess();
    },
};

export default RevealSfeirThemePlugin;
