import {
    SlideEntry,
    getAllSlidesImages,
    getImagesPathFromFs,
    getImagesPathFromSlides,
    getLabSlideCommandRow,
    getLabSlides,
    getSlideFilesFromFs,
    getSlideFilesFromSlidesJs,
    isImageFileExists,
    isSlideFileExists,
    readSlideFile,
} from "../../utils/slide.utils";
import {
    getAllCssContent,
    getCssClassUsedInSlide,
} from "../../utils/css.utils";
import {
    getLabCommandTarget,
    getLabsCommands,
    isLabCommandExists,
} from "../../utils/labs.utils";
import { isDefined, isDefinedAndNotEmpty } from "../../utils/fp.utils";
import { ConfigJson } from "../../utils/config.utils";
import { check } from "../../utils/assert.utils";
import { slidePath } from "../../utils/path.utils";

export async function checkDocs(rootDir: string, config: ConfigJson) {
    let slideFilesFromSlidesJs;
    try {
        slideFilesFromSlidesJs = await getSlideFilesFromSlidesJs(rootDir);
    } catch {
        check(
            "S_010",
            { msg: `slides.js should export "formation" function`, continueCheck: false },
            () => false,
        );
        return;
    }

    checkSlideFilePathInSlideJs(rootDir, slideFilesFromSlidesJs);
    checkSlideFileInFs(rootDir, slideFilesFromSlidesJs, config);
    checkLabSlideFile(rootDir, slideFilesFromSlidesJs, config);
    checkLabCommand(rootDir, slideFilesFromSlidesJs, config);
    checkImagesFs(rootDir);
}

function checkSlideFilePathInSlideJs(
    rootDir: string,
    slideFilesFromSlidesJs: SlideEntry[],
) {
    for (const slideFile of slideFilesFromSlidesJs) {
        const slide = JSON.stringify(slideFile);
        check(
            "S_001",
            `slides.js entry "${slide}" should be a valid entry`,
            () =>
                isDefined(slideFile) && isDefined(slideFile.path) &&
                slideFile.path.length > 0,
        );
        check(
            "S_002",
            `slides.js entry "${slideFile?.path}" does not match an existing file`,
            () => isSlideFileExists(slidePath(rootDir, slideFile.path)),
        );
    }
}

function checkSlideFileInFs(
    rootDir: string,
    slideEntriesFromSlidesJs: SlideEntry[],
    config: ConfigJson,
) {
    const slideFilesFromFs = getSlideFilesFromFs(rootDir);
    const slideFilesFromSlidesJs = slideEntriesFromSlidesJs.map((entry) =>
        entry.path
    );
    const cssContent = getAllCssContent(rootDir, config.extraCssFiles);

    for (const slideFile of slideFilesFromFs) {
        check(
            "S_003",
            `"${slideFile}" should be used`,
            () => slideFilesFromSlidesJs.includes(slideFile),
        );
        for (
            const imagePath of getImagesPathFromSlides(
                rootDir,
                readSlideFile(rootDir, slideFile),
            )
        ) {
            check(
                "S_007",
                `"${imagePath}" in "${slideFile}" should be an existing images`,
                () => isImageFileExists(imagePath),
            );
        }
        for (
            const cssClass of getCssClassUsedInSlide(
                readSlideFile(rootDir, slideFile),
            )
        ) {
            check(
                "S_009",
                `"${cssClass}" in "${slideFile}" is not a known css class`,
                () => cssContent.includes(cssClass),
            );
        }
    }
}

function checkLabSlideFile(
    rootDir: string,
    slideFilesFromSlidesJs: SlideEntry[],
    config: ConfigJson,
) {
    const labSlides = getLabSlides(slideFilesFromSlidesJs);
    for (const slideFile of labSlides) {
        const labSlideContent = readSlideFile(rootDir, slideFile.path);
        const commandRow = getLabSlideCommandRow(labSlideContent, config)!;
        const hasCommandRow = check(
            "S_004",
            `"${slideFile?.path}" should contains the command to run the exercise`,
            () => {
                return isDefined(commandRow) && commandRow.length > 0;
            },
        );
        if (hasCommandRow && isDefinedAndNotEmpty(config.stepCommandPrefix)) {
            check(
                "S_005",
                `"${slideFile?.path}" should contains the valid command to run the exercise`,
                () => {
                    const commandTarget = getLabCommandTarget(
                        commandRow,
                        config,
                    );
                    return isLabCommandExists(rootDir, commandTarget);
                },
            );
        }
        check(
            "S_006",
            `"${slideFile?.path}" should use lab slide format`,
            () => {
                const slideRows = labSlideContent.split("\n").map((row) =>
                    row.trim()
                );
                return slideRows.includes(
                    '<!-- .slide: class="exercice" -->',
                ) &&
                    slideRows.includes("## Lab");
            },
        );
    }
}

function checkLabCommand(
    rootDir: string,
    labSlides: SlideEntry[],
    config: ConfigJson,
) {
    const allLabSlides = labSlides.map((slide) =>
        readSlideFile(rootDir, slide.path)
    );
    const labsCommands = getLabsCommands(rootDir);
    for (const labCommand of labsCommands) {
        check("L_001", `"${labCommand}" should be used in a lab slide`, () => {
            return allLabSlides.some((slide) =>
                slide.includes(`${config.stepCommandPrefix}${labCommand}`)
            );
        });
    }
}

function checkImagesFs(rootDir: string) {
    const imagesFromFs = getImagesPathFromFs(rootDir);
    for (const imagePath of imagesFromFs) {
        check("S_008", `"${imagePath}" should be used`, () => {
            return getAllSlidesImages(rootDir).includes(imagePath);
        });
    }
}
