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

/**
 * To Uncomment to see in actions other configuration possible offered by theme initialization
 */
/*
await SfeirThemeInitializer.init({
    slidesFactory: formation,
    plugins: [// Custom plugins additions
        () => {
            return {
                id: 'test-plugin',
                init: () => {
                    console.log('Test Plugin Activated');
                },
            };
        },
    ],
    defaultLang: 'EN', //If you want to change the default lang for the school (by default, it's FR)
    knowStyles: ['class-img1','class-img2'], // Custom css class applied on your css but available in your markdown 
    extrasRenderAttr: 'test-school', // Custom attribute integrated on each sections with the path of markdown
});
*/
