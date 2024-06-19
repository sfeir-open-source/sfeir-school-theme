import Reveal from 'reveal.js';
import feather from 'feather-icons';
import { _handle_parameter } from './helper';

const imagesPath = 'web_modules/sfeir-school-theme/images';

export class SfeirTheme {
    constructor() {
        this.path = '';

        const queryString = window.location.search;
        this.urlParams = new URLSearchParams(queryString);

        this.slidesElement = document.querySelector('.reveal .slides');

        this.slidesType = _handle_parameter(
            this.urlParams,
            'type',
            this.slidesElement,
            'data-type-show',
            'prez'
        );
        this.slidesTheme = _handle_parameter(
            this.urlParams,
            'theme',
            this.slidesElement,
            'data-theme-slides',
            'school'
        );

        // Could be desactivate by configuration
        this.copyCode = true;
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

        // Manage Copy to clipboard icon for code blocks
        if (this.copyCode) {
            this._manageCopyPasteClipBoard();
        }
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
        const map = {
            'first-slide': `${this.path}${imagesPath}/${
                this.slidesTheme === 'institute'
                    ? 'bg-blue-1.webp'
                    : 'bg-green-1.webp'
            }`,
            transition: `${this.path}${imagesPath}/${
                this.slidesTheme === 'institute'
                    ? 'bg-blue-1.webp'
                    : 'bg-green-1.webp'
            }`,
            'speaker-slide': `var(--black)`,
            'quote-slide': `var(--black)`,
            'sfeir-slide': `${this.path}${imagesPath}/bg-green-1.webp`,
            'bg-white': `${this.path}${imagesPath}/bg-green-1.webp`,
            'bg-pink': `${this.path}${imagesPath}/bg-green-1.webp`,
            'bg-blue': `${this.path}${imagesPath}/bg-green-1.webp`,
            'bg-green': `${this.path}${imagesPath}/bg-green-1.webp`,
            'bg-blur': `${this.path}${imagesPath}/${
                this.slidesTheme === 'institute'
                    ? 'bg-blue-blur.webp'
                    : 'bg-green-blur.webp'
            }`,
            'transition-bg-sfeir-1': `${this.path}${imagesPath}/${
                this.slidesTheme === 'institute'
                    ? 'bg-blue-1.webp'
                    : 'bg-green-1.webp'
            }`,
            'transition-bg-sfeir-2': `${this.path}${imagesPath}/${
                this.slidesTheme === 'institute'
                    ? 'bg-blue-2.webp'
                    : 'bg-green-2.webp'
            }`,
            'transition-bg-sfeir-3': `${this.path}${imagesPath}/${
                this.slidesTheme === 'institute'
                    ? 'bg-blue-3.webp'
                    : 'bg-green-3.webp'
            }`,
            'transition-bg-blue-1': `${this.path}${imagesPath}/bg-blue-1.webp`,
            'transition-bg-blue-2': `${this.path}${imagesPath}/bg-blue-2.webp`,
            'transition-bg-blue-3': `${this.path}${imagesPath}/bg-blue-3.webp`,
            'transition-bg-blue-blur': `${this.path}${imagesPath}/bg-blue-blur.webp`,
            'transition-bg-green-1': `${this.path}${imagesPath}/bg-green-1.webp`,
            'transition-bg-green-2': `${this.path}${imagesPath}/bg-green-2.webp`,
            'transition-bg-green-3': `${this.path}${imagesPath}/bg-green-3.webp`,
            'transition-bg-green-4': `${this.path}${imagesPath}/bg-green-4.webp`,
            'transition-bg-green-5': `${this.path}${imagesPath}/bg-green-5.webp`,
            'transition-bg-green-6': `${this.path}${imagesPath}/bg-green-6.webp`,
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
            ] = `url(${this.path}${imagesPath}/logo_empty.webp)`;

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
        const exercicesSlides = [
            ...document.querySelectorAll('.reveal .slides section.exercice'),
        ];
        for (let exercicesection of exercicesSlides) {
            ``;
            const colorToUse =
                this.slidesTheme === 'institute'
                    ? 'var(--sfeir-blue)'
                    : 'var(--sfeir-green)';
            exercicesection.setAttribute(
                'data-background',
                `linear-gradient(90deg,  ${colorToUse} 25%, white 25%, white 100%)`
            );
        }
    }

    _manageShowTypeContent() {
        if (this.slidesType !== 'all') {
            Array.from(
                this.slidesElement.querySelectorAll('section[data-type-show]')
            )
                .filter(
                    (el) =>
                        el
                            .getAttribute('data-type-show')
                            .indexOf(this.slidesType) === -1
                )
                .forEach((el) => el.parentNode.removeChild(el));
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
                    // We preserve specific classes
                    parentSection.classList.add(
                        ...subSection.classList.values()
                    );
                    // We preserve Backgrounds
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

                    // We preserve events
                    if (subSection.hasAttribute('data-state')) {
                        let dataStateParentString =
                            parentSection.getAttribute('data-state');
                        if (!parentSection.hasAttribute('data-state')) {
                            dataStateParentString = '';
                            parentSection.setAttribute('data-state', '');
                        }
                        const dataStateString =
                            subSection.getAttribute('data-state');
                        parentSection.setAttribute(
                            'data-state',
                            (
                                dataStateParentString +
                                ' ' +
                                dataStateString
                            ).trim()
                        );
                    }

                    // We preserve notes of right slide
                    if (indexSection !== 0) {
                        let notesSectionRight =
                            subSection.querySelector('aside.notes');
                        let noteSectionsInParent = [
                            ...parentSection.querySelectorAll(
                                'aside.notes:last-child'
                            ),
                        ];
                        let noteSection =
                            noteSectionsInParent[
                                noteSectionsInParent.length - 1
                            ];
                        if (!noteSection) {
                            noteSection = document.createElement('ASIDE');
                            noteSection.classList.add('notes');
                            parentSection.appendChild(noteSection);
                        }
                        if (notesSectionRight) {
                            noteSection.innerHTML += `
                            ----------------
                            ${notesSectionRight.innerHTML}`;
                        }
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

    _manageCopyPasteClipBoard() {
        // First we add to each codeblock the icon
        const codeBlocks = [
            ...document.querySelectorAll(
                '.reveal .slides section[class*="with-code"] pre code'
            ),
        ];

        for (let codeBlockElt of codeBlocks) {
            const copyIcon = document.createElement('i');
            copyIcon.setAttribute('data-feather', 'copy');
            copyIcon.setAttribute('alt', 'big');
            copyIcon.classList.add('sfeir-theme-copy-to-clipboard');
            codeBlockElt.parentElement.appendChild(copyIcon);
        }

        // Ask to feather library to replace the icon
        feather.replace();

        // Second we listen to click on it in order to copy the code to clipboard
        const copyToClipboardIcons = [
            ...document.querySelectorAll(
                '.reveal .slides section svg.sfeir-theme-copy-to-clipboard'
            ),
        ];
        for (let copyIcon of copyToClipboardIcons) {
            copyIcon.addEventListener('click', (event) => {
                const codeBlock =
                    event.target.parentElement.querySelector('code');
                const textToCopy = codeBlock.innerText;
                navigator.clipboard.writeText(textToCopy);

                // Notify graphicly the copy
                event.target.classList.add('copied');
                setTimeout(() => {
                    event.target.classList.remove('copied');
                }, 300);

                // add popup that disappear
                const popup = document.createElement('div');
                popup.classList.add('sfeir-theme-copy-popup');
                popup.innerText = 'Copied to clipboard';
                event.target.parentElement.appendChild(popup);
                setTimeout(() => {
                    popup.classList.add('hide');
                    setTimeout(() => {
                        event.target.parentElement.removeChild(popup);
                    }, 1000);
                }, 1000);
            });
        }
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
