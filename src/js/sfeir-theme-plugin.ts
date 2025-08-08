import { _handle_parameter } from '@talk-control/talk-control-revealjs-extensions';

export class SfeirTheme {
    constructor() {}

    postprocess() {
        // FavIcon
        this._manageFavIcon();

        // ManageBackground
        //this._manageBackgrounds();
        this._manageFirstSlide();

        // ManageExercices
        this._manageExerciceSlide();
    }

    _manageFavIcon() {
        const resolutions = ['16x16', '32x32', '96x96'];
        for (const resolution of resolutions) {
            const link = document.createElement('link');
            link.type = 'image/png';
            link.rel = 'icon';
            link.sizes = resolution;
            link.href = `./web_modules/sfeir-school-theme/dist/images/favicon-${resolution}.png`;
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        const link = document.createElement('link');
        //link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = `./web_modules/sfeir-school-theme/dist/images/favicon.ico`;
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    _manageFirstSlide() {
        const firstSlides = [
            ...document.querySelectorAll('.reveal .slides section.first-slide'),
        ];
        for (const firstSlideSection of firstSlides) {
            const imgLogo = document.createElement('DIV');
            imgLogo.classList.add('sfeir-logo');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (imgLogo.style as any)['background-image'] =
                `url(web_modules/sfeir-school-theme/dist/images/logo_empty.webp)`;

            const level = firstSlideSection.hasAttribute('sfeir-level')
                ? +firstSlideSection.getAttribute('sfeir-level')!
                : 1;
            const techno = firstSlideSection.hasAttribute('sfeir-techno')
                ? firstSlideSection.getAttribute('sfeir-techno')
                : '';
            imgLogo.setAttribute('data-sfeir-level', `${level}`);
            imgLogo.setAttribute('data-sfeir-techno', `${techno}`);

            firstSlideSection.insertAdjacentElement('afterbegin', imgLogo);
        }
    }

    _manageExerciceSlide() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const slidesElement: HTMLElement =
            document.querySelector('.reveal .slides')!;
        const slidesTheme = _handle_parameter(
            urlParams,
            'data-theme',
            slidesElement,
            'data-theme',
            'school'
        );
        const exercicesSlides = [
            ...document.querySelectorAll('.reveal .slides section.exercice'),
        ];
        for (const exercicesection of exercicesSlides) {
            const colorToUse =
                slidesTheme === 'institute'
                    ? 'var(--sfeir-blue)'
                    : 'var(--sfeir-green)';
            exercicesection.setAttribute(
                'data-background',
                `linear-gradient(90deg,  ${colorToUse} 25%, white 25%, white 100%)`
            );
        }
    }
}

const RevealSfeirThemePlugin = () => {
    return {
        id: 'sfeir-theme',
        init: () => {
            const sfeirTheme = new SfeirTheme();
            sfeirTheme.postprocess();
        },
    };
};

export default RevealSfeirThemePlugin;
