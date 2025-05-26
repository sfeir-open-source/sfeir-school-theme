import { CheckCommand } from "../../cli";
import {
    getAllLabSlideCommandRow,
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
    SlideEntry,
} from "../../utils/slide.utils";
import { check } from "../../utils/assert.utils";
import { isDefined } from "../../utils/fp.utils";
import { slidePath } from "../../utils/path.utils";
import {
    getLabCommandTarget,
    getLabsCommands,
    isLabCommandExists,
} from "../../utils/steps.utils";
import {
    getAllCssContent,
    getCssClassUsedInSlide,
} from "../../utils/css.utils";

export async function checkDocs({ rootDir }: CheckCommand) {
    const slideFilesFromSlidesJs = await getSlideFilesFromSlidesJs(
        rootDir,
    );

    checkSlideFilePathInSlideJs(rootDir, slideFilesFromSlidesJs);
    checkSlideFileInFs(rootDir, slideFilesFromSlidesJs);
    checkLabSlideFile(rootDir, slideFilesFromSlidesJs);
    checkLabCommand(rootDir, slideFilesFromSlidesJs);
    checkImagesFs(rootDir);
}

function checkSlideFilePathInSlideJs(
    rootDir: string,
    slideFilesFromSlidesJs: SlideEntry[],
) {
    for (const slideFile of slideFilesFromSlidesJs) {
        check(
            `slides.js entry "${
                JSON.stringify(slideFile)
            }" should be a valid entry`,
            () =>
                isDefined(slideFile) && isDefined(slideFile.path) &&
                slideFile.path.length > 0,
        );
        check(
            `slides.js entry "${slideFile?.path}" does not match an existing file`,
            () => isSlideFileExists(slidePath(rootDir, slideFile.path)),
        );
    }
}

function checkSlideFileInFs(
    rootDir: string,
    slideEntriesFromSlidesJs: SlideEntry[],
) {
    const slideFilesFromFs = getSlideFilesFromFs(rootDir);
    const slideFilesFromSlidesJs = slideEntriesFromSlidesJs.map((entry) =>
        entry.path
    );
    const cssContent = getAllCssContent(rootDir);

    for (const slideFile of slideFilesFromFs) {
        check(
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
                `"${cssClass}" in "${slideFile}" is not a known css class`,
                () => cssContent.includes(cssClass),
            );
        }
    }
}

function checkLabSlideFile(
    rootDir: string,
    slideFilesFromSlidesJs: SlideEntry[],
) {
    const labSlides = getLabSlides(slideFilesFromSlidesJs);
    for (const slideFile of labSlides) {
        const labSlideContent = readSlideFile(rootDir, slideFile.path);
        const commandRow = getLabSlideCommandRow(labSlideContent)!;
        check(
            `"${slideFile?.path}" should contains the command to run the exercise`,
            () => {
                return isDefined(commandRow) && commandRow.length > 0;
            },
        );
        check(
            `"${slideFile?.path}" should contains the valid command to run the exercise`,
            () => {
                const commandTarget = getLabCommandTarget(commandRow);
                return isLabCommandExists(rootDir, commandTarget);
            },
        );
        check(
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

function checkLabCommand(rootDir: string, labSlides: SlideEntry[]) {
    const allLabCommandInSlides = getAllLabSlideCommandRow(
        labSlides.map((slide) => readSlideFile(rootDir, slide.path)),
    ).map(getLabCommandTarget);
    const labsCommands = getLabsCommands(rootDir);
    for (const labCommand of labsCommands) {
        check(
            `"${labCommand}" should be used in a lab slide`,
            () => {
                return allLabCommandInSlides.includes(labCommand);
            },
        );
    }
}

function checkImagesFs(rootDir: string) {
    const imagesFromFs = getImagesPathFromFs(rootDir);
    for (const imagePath of imagesFromFs) {
        check(`"${imagePath}" should be used`, () => {
            return getAllSlidesImages(rootDir).includes(imagePath);
        });
    }
}
