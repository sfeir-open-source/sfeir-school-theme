import { SfeirThemeInitializer } from "../web_modules/sfeir-theme/sfeir-theme.mjs";

// One method per module
function schoolSlides() {
  return [
    "00_intro.md",
    "01_speaker.md",
    "10_chapter1.md",
    "11_layouts.md",
    "15_vertical.md",
    "20_specifics_slides.md",
    "30_code_slides.md",
    "40_helpers.md",
    "50_modes.md",
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

SfeirThemeInitializer.init(formation);
