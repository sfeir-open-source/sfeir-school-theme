import {
    SlideEntry,
    SlidesJs,
    getAllSlidesImages,
    getImagesPathFromFs,
    getImagesPathFromSlides,
    getLabSlideCommandRow,
    getLabSlides,
    getSlideFilesFromFs,
    isImageFileExists,
    isOneSpeakerSlide,
    isSlideFileExists,
    loadSlidesJs,
    readSlideFile,
} from '../../utils/slide.utils';
import {
    TALK_CONTROL_IMAGE_STYLES,
    getCssClassesUsedInSlide,
    getKnownCssClasses,
} from '../../utils/css.utils';
import {
    getAllLabsFromFs,
    getLabCommandTarget,
    getLabsCommands,
    isLabCommandExists,
} from '../../utils/labs.utils';
import { isDefined, isDefinedAndNotEmpty } from '../../utils/fp.utils';
import { slidePath, slidesAssetPath } from '../../utils/path.utils';
import { ConfigJson } from '../../utils/config.utils';
import { check } from '../../utils/assert.utils';

export async function checkSlides(rootDir: string, config: ConfigJson) {
    let slidesJs;
    try {
        slidesJs = await loadSlidesJs(rootDir);
    } catch {
        check(
            'S_010',
            {
                msg: `slides.js should export "formation" function`,
                continueCheck: false,
            },
            () => false
        );
        return;
    }
    const slideFilesFromSlidesJs = slidesJs.slides;

    checkSlideFilePathInSlideJs(rootDir, slideFilesFromSlidesJs);
    checkSlideFileInFs(rootDir, slidesJs, config);
    checkLabSlideFile(rootDir, slideFilesFromSlidesJs, config);
    checkLabCommand(rootDir, slideFilesFromSlidesJs, config);
    checkImagesFs(rootDir, config);
}

function checkSlideFilePathInSlideJs(
    rootDir: string,
    slideFilesFromSlidesJs: SlideEntry[]
) {
    for (const slideFile of slideFilesFromSlidesJs) {
        const slide = JSON.stringify(slideFile);
        check(
            'S_001',
            `slides.js entry "${slide}" should be a valid entry`,
            () =>
                isDefined(slideFile) &&
                isDefined(slideFile.path) &&
                slideFile.path.length > 0
        );
        check(
            'S_002',
            `slides.js entry "${slideFile?.path}" does not match an existing file`,
            () => isSlideFileExists(slidePath(rootDir, slideFile.path))
        );
    }
}

function checkSlideFileInFs(
    rootDir: string,
    slidesJs: SlidesJs,
    config: ConfigJson
) {
    const slideFilesFromFs = getSlideFilesFromFs(rootDir);
    const slideFilesFromSlidesJs = slidesJs.slides.map((entry) => entry.path);
    const knownCssClasses = getKnownCssClasses(rootDir, config.extraCssFiles);
    const knownImageStyles = new Set([
        ...TALK_CONTROL_IMAGE_STYLES,
        ...slidesJs.knowStyles,
    ]);

    for (const slideFile of slideFilesFromFs) {
        const slideContent = readSlideFile(rootDir, slideFile) ?? '';
        check('S_003', `"${slideFile}" should be used`, () => {
            if (slideFilesFromSlidesJs.includes(slideFile)) {
                return true;
            }
            return {
                result: false,
                severity: isOneSpeakerSlide(slideContent) ? 'warning' : 'error',
            };
        });
        for (const imagePath of getImagesPathFromSlides(
            rootDir,
            slideContent
        )) {
            check(
                'S_007',
                `"${imagePath}" in "${slideFile}" should be an existing images`,
                () => isImageFileExists(imagePath)
            );
        }
        const { classAttributes, imageStyles } =
            getCssClassesUsedInSlide(slideContent);
        for (const cssClass of classAttributes) {
            check(
                'S_009',
                `"${cssClass}" in "${slideFile}" is not a known css class`,
                () => knownCssClasses.has(cssClass)
            );
        }
        for (const imageStyle of imageStyles) {
            const isRegistered = check(
                'S_009',
                `"${imageStyle}" in "${slideFile}" is not registered in the "knowStyles" of slides.js (talk-control renders it as a title, not a class)`,
                () => knownImageStyles.has(imageStyle)
            );
            if (isRegistered) {
                check(
                    'S_009',
                    `"${imageStyle}" in "${slideFile}" is not a known css class`,
                    () => knownCssClasses.has(imageStyle)
                );
            }
        }
    }
}

function checkLabSlideFile(
    rootDir: string,
    slideFilesFromSlidesJs: SlideEntry[],
    config: ConfigJson
) {
    const labSlides = getLabSlides(slideFilesFromSlidesJs);
    const labSlidesDirectory = getAllLabsFromFs(rootDir, config);
    for (const slideFile of labSlides) {
        const ignoreCommandCheck = config.ignoreCommandCheck.includes(
            slideFile.path
        );
        const labSlideContent = readSlideFile(rootDir, slideFile.path) ?? '';
        const commandRow = getLabSlideCommandRow(labSlideContent, config)!;
        const hasCommandRow =
            ignoreCommandCheck ||
            check(
                'S_005',
                `"${slideFile?.path}" should contains the command to run the exercise`,
                () => {
                    return isDefined(commandRow) && commandRow.length > 0;
                }
            );
        if (
            hasCommandRow &&
            !ignoreCommandCheck &&
            isDefinedAndNotEmpty(config.labCommandPrefix)
        ) {
            check(
                'S_005',
                `"${slideFile?.path}" should contains the valid command to run the exercise`,
                () => {
                    const commandTarget = getLabCommandTarget(
                        commandRow,
                        config
                    );
                    return isLabCommandExists(rootDir, commandTarget);
                }
            );
            check(
                'S_011',
                `"${slideFile?.path}" lab should have a dedicated directory in \`labs\``,
                () => {
                    const commandTarget = getLabCommandTarget(
                        commandRow,
                        config
                    );
                    return labSlidesDirectory.includes(commandTarget);
                }
            );
        }
        check(
            'S_006',
            `"${slideFile?.path}" should use lab slide format`,
            () => {
                const slideRows = labSlideContent
                    .split('\n')
                    .map((row) => row.trim());
                return (
                    slideRows.includes('<!-- .slide: class="exercice" -->') &&
                    slideRows.includes('## Lab')
                );
            }
        );
    }
}

function checkLabCommand(
    rootDir: string,
    labSlides: SlideEntry[],
    config: ConfigJson
) {
    const allLabSlides = labSlides
        .map((slide) => readSlideFile(rootDir, slide.path))
        .filter(isDefinedAndNotEmpty);
    const labsCommands = getLabsCommands(rootDir, config);
    for (const labCommand of labsCommands) {
        check('L_001', `"${labCommand}" should be used in a lab slide`, () => {
            return allLabSlides.some((slide) =>
                slide.includes(`${config.labCommandPrefix}${labCommand}`)
            );
        });
    }
}

function checkImagesFs(rootDir: string, config: ConfigJson) {
    const ignoredImages = config.ignoreAssets.map((ignored) =>
        slidesAssetPath(rootDir, ignored)
    );
    const imagesFromFs = getImagesPathFromFs(rootDir).filter(
        (imagesPath) => !ignoredImages.includes(imagesPath)
    );
    for (const imagePath of imagesFromFs) {
        check('S_008', `"${imagePath}" should be used`, () => {
            return getAllSlidesImages(rootDir).includes(imagePath);
        });
    }
}
