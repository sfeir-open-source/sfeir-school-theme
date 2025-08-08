import { SfeirThemeInitializer } from '../web_modules/sfeir-school-theme/dist/sfeir-school-theme.mjs';

// One method per module
function schoolSlides() {
    return [
        '00_intro.md',
        '02-speaker/01_speaker.md',
        '03-classics/10_chapter1.md',
        '03-classics/11_layouts.md',
        '03-classics/30_code_slides.md',
        '04-specifics/20_specifics_slides.md',
        '05-helpers/40_helpers.md',
        '05-helpers/50_modes.md',
    ];
}

function formation() {
    return [
        //
        ...schoolSlides(),
    ].map((slidePath) => {
        return { path: slidePath };
    });
}

await SfeirThemeInitializer.init(formation);
