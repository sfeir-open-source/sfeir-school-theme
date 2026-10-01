/** The level scale of a SFEIR School course: 100, 200, 300. */
const LEVELS = 3;

export class SfeirTheme {
    constructor() {}

    postprocess() {
        // FavIcon
        this._manageFavIcon();

        // Cover: eyebrow and level chips
        this._manageFirstSlide();

        // The exercice band is a background like any other now: the initializer maps
        // the `exercice` class onto the sand-pour photo and theme/exercice.scss sizes
        // it to the left 25 %. Nothing left to inject here.
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

    /**
     * Cover badge (decision D4).
     *
     * `div.sfeir-logo[data-sfeir-techno][data-sfeir-level]` is the public contract —
     * per-school stylesheets select it — so the element and both attributes stay. What
     * it renders changed: theme/title-slide.scss draws an eyebrow
     * `[ SFEIR SCHOOL | <techno> ]` from the attributes and the program label, and the
     * three spans below are the level chips (filled up to `data-sfeir-level`, hollow
     * above). No raster logo, no star sprites, no inline style.
     */
    _manageFirstSlide() {
        const firstSlides = [
            ...document.querySelectorAll('.reveal .slides section.first-slide'),
        ];
        for (const firstSlideSection of firstSlides) {
            const badge = document.createElement('DIV');
            badge.classList.add('sfeir-logo');

            // Clamped to the 1-3 scale: a typo or `0` still draws one chip, never none.
            const level = Math.min(
                3,
                Math.max(
                    1,
                    Number(firstSlideSection.getAttribute('sfeir-level')) || 1
                )
            );
            const techno = firstSlideSection.hasAttribute('sfeir-techno')
                ? firstSlideSection.getAttribute('sfeir-techno')
                : '';
            badge.setAttribute('data-sfeir-level', `${level}`);
            badge.setAttribute('data-sfeir-techno', `${techno}`);

            for (let i = 0; i < LEVELS; i++) {
                const chip = document.createElement('SPAN');
                chip.classList.add('sfeir-level-chip');
                chip.setAttribute('aria-hidden', 'true');
                badge.appendChild(chip);
            }

            firstSlideSection.insertAdjacentElement('afterbegin', badge);
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
