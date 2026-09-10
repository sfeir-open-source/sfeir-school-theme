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
                `url(./web_modules/sfeir-school-theme/dist/images/logo_empty.webp)`;

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

    /**
     * The 25% band no longer needs to know which program is active: --sfeir-accent
     * resolves through the program axis, and tokens/_context.scss declares it on
     * `.slides[data-theme] ~ .backgrounds` too, which is where reveal puts this
     * background. Phase 2 replaces the gradient itself — the charte has no gradients.
     */
    _manageExerciceSlide() {
        const exercicesSlides = [
            ...document.querySelectorAll('.reveal .slides section.exercice'),
        ];
        for (const exercicesection of exercicesSlides) {
            exercicesection.setAttribute(
                'data-background',
                'linear-gradient(90deg, var(--sfeir-accent) 25%, var(--sfeir-surface) 25%, var(--sfeir-surface) 100%)'
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
