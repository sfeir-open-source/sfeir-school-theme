import { isDirectory, readdirSync } from './fs.utils';
import {
    slidePath,
    slidesFilePath,
    slidesImagePath,
    slidesImagesPath,
    slidesMarkdownPath,
    slidesPath,
} from './path.utils';
import { ConfigJson } from './config.utils';
import fs from 'node:fs';
import { isDefinedAndNotEmpty } from './fp.utils';
import path from 'node:path';

export interface SlideEntry {
    path: string;
}

export type FilePath = string;

export interface SlidesJs {
    slides: SlideEntry[];
    /** The `knowStyles` passed to `SfeirThemeInitializer.init()`, if any. */
    knowStyles: string[];
}

export async function loadSlidesJs(rootDir: string): Promise<SlidesJs> {
    const slideJs = await import(importSlidesJs(rootDir));
    if (typeof slideJs.formation !== 'function') {
        throw new Error(
            'scripts/slides.js should have an exported function formation'
        );
    }
    return {
        slides: slideJs.formation(),
        knowStyles: extractKnowStyles(slideJs[INIT_PARAMS_EXPORT]),
    };
}

function extractKnowStyles(initParams: unknown): string[] {
    const knowStyles =
        typeof initParams === 'object' && initParams !== null
            ? (initParams as { knowStyles?: unknown }).knowStyles
            : undefined;
    return Array.isArray(knowStyles)
        ? knowStyles.filter((style) => typeof style === 'string')
        : [];
}

export function getSlideFilesFromFs(rootDir: string): FilePath[] {
    return readdirSync(path.resolve(slidesMarkdownPath(rootDir)), {
        encoding: 'utf-8',
        recursive: true,
    }).filter((path) => path.endsWith('.md'));
}

const INIT_PARAMS_EXPORT = '__sfeirThemeInitParams__';

/**
 * Stands in for the theme's `SfeirThemeInitializer` (which needs a browser):
 * `init()` only records its parameters so the CLI can read `knowStyles`.
 */
const SFEIR_THEME_INITIALIZER_STUB = `let ${INIT_PARAMS_EXPORT};
const SfeirThemeInitializer = { init: async (params) => { ${INIT_PARAMS_EXPORT} = params; } };
export { ${INIT_PARAMS_EXPORT} };
`;

const SFEIR_THEME_INITIALIZER_IMPORT =
    /import\s*\{[^}]*\bSfeirThemeInitializer\b[^}]*\}\s*from\s*(['"])[^'"]*\1\s*;?/g;

function importSlidesJs(rootDir: string): string {
    let slidesJs: string;
    try {
        slidesJs = fs.readFileSync(
            path.resolve(slidesPath(rootDir), 'scripts/slides.js'),
            'utf-8'
        );
    } catch (err) {
        throw new Error('Failed to read scripts/slides.js', { cause: err });
    }
    return (
        'data:text/javascript;charset=utf-8,' +
        encodeURIComponent(
            SFEIR_THEME_INITIALIZER_STUB +
                slidesJs.replace(SFEIR_THEME_INITIALIZER_IMPORT, '')
        )
    );
}

export function isSlideFileExists(slideFilePath: string) {
    return fs.existsSync(slideFilePath);
}

export function getAllSlidesImages(rootDir: string): string[] {
    return getSlideFilesFromFs(rootDir)
        .map((file) => readSlideFile(rootDir, file))
        .filter(isDefinedAndNotEmpty)
        .flatMap((fileContent) =>
            getImagesPathFromSlides(rootDir, fileContent)
        );
}

export function getLabSlides(slides: SlideEntry[]): SlideEntry[] {
    return slides.filter(
        (slide) =>
            slide.path.includes('-lab-') || slide.path.includes('-lab.md')
    );
}

export function readSlideFile(rootDir: string, slideFilePath: string) {
    try {
        return fs.readFileSync(slidePath(rootDir, slideFilePath), 'utf-8');
    } catch {
        return null;
    }
}

export function getLabSlideCommandRow(
    file: string,
    config: ConfigJson
): string | undefined {
    return file
        .split('\n')
        .find((row) => row.includes(config.labCommandPrefix));
}

export function getImagesPathFromSlides(
    rootDir: string,
    fileContent: string
): string[] {
    return fileContent
        .split('\n')
        .flatMap(extractUrlPart)
        .filter(isDefinedAndNotEmpty)
        .filter((url) => !url.startsWith('http'))
        .filter(isImageInAssetsDir)
        .map((imgPath) => slidesFilePath(rootDir, imgPath));

    function extractUrlPart(row: string): string | string[] | null {
        if (row.startsWith('![')) {
            const secondPart = row.split('](')[1];
            const urlPart = secondPart?.substring(
                0,
                secondPart.lastIndexOf(')')
            );
            if (urlPart.endsWith("'")) {
                return urlPart.substring(0, urlPart.lastIndexOf(" '"));
            } else {
                return urlPart;
            }
        } else if (row.includes('<!--') && row.includes('data-background=')) {
            const dataBackgroundPart = row.split('data-background="')[1];
            return dataBackgroundPart?.substring(
                0,
                dataBackgroundPart.indexOf('"')
            );
        } else if (row.includes('<img')) {
            return row
                .split('<img')
                .map((img) => img.match(/src="(?<src>[^"]*)"/)?.groups?.src)
                .filter(isDefinedAndNotEmpty);
        } else {
            return null;
        }
    }
    function isImageInAssetsDir(imagePath: string): boolean {
        return (
            imagePath.startsWith('assets') || imagePath.startsWith('./assets')
        );
    }
}

export function getImagesPathFromFs(rootDir: string): string[] {
    return readdirSync(slidesImagesPath(rootDir), {
        encoding: 'utf-8',
        recursive: true,
    })
        .filter(
            (imagePath) => !isDirectory(slidesImagesPath(rootDir), imagePath)
        )
        .filter((imagePath) => !imagePath.includes('sfeir-school-logo.png'))
        .map((imagePath) => slidesImagePath(rootDir, imagePath));
}

export function isImageFileExists(imageFilePath: string) {
    return fs.existsSync(imageFilePath);
}

export function isOneSpeakerSlide(slide: string) {
    return (
        slide.includes('<div class="speaker-slide">') &&
        !slide.includes('##==##')
    );
}
