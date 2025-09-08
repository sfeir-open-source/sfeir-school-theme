import {
    docsFilePath,
    docsImagePath,
    docsImagesPath,
    docsMarkdownPath,
    docsPath,
    slidePath,
} from "./path.utils";
import { ConfigJson } from "./config.utils";
import fs from "node:fs";
import { isDirectory } from "./fs.utils";
import path from "node:path";

export interface SlideEntry {
    path: string;
}

export type FilePath = string;

export async function getSlideFilesFromSlidesJs(
    rootDir: string,
): Promise<SlideEntry[]> {
    return (await import(importSlidesJs(rootDir))).formation();
}

export function getSlideFilesFromFs(
    rootDir: string,
): FilePath[] {
    return fs
        .readdirSync(path.resolve(docsMarkdownPath(rootDir)), {
            encoding: "utf-8",
            recursive: true,
        })
        .filter((path) => path.endsWith(".md"));
}

export function importSlidesJs(rootDir: string): string {
    return (
        "data:text/javascript;charset=utf-8," +
        encodeURIComponent(
            fs
                .readFileSync(
                    path.resolve(
                        docsPath(rootDir),
                        "scripts/slides.js",
                    ),
                    "utf-8",
                )
                .split("\n")
                .filter((line) => !line.includes("SfeirThemeInitializer"))
                .join("\n"),
        )
    );
}

export function isSlideFileExists(slideFilePath: string) {
    return fs.existsSync(slideFilePath);
}

export function getAllSlidesImages(rootDir: string): string[] {
    return getSlideFilesFromFs(rootDir).map((file) =>
        readSlideFile(rootDir, file)
    ).flatMap((fileContent) => getImagesPathFromSlides(rootDir, fileContent));
}

export function getLabSlides(slides: SlideEntry[]): SlideEntry[] {
    return slides.filter((slide) =>
        slide.path.includes("-lab-") || slide.path.includes("-lab.md")
    );
}

export function readSlideFile(rootDir: string, slideFilePath: string) {
    return fs.readFileSync(slidePath(rootDir, slideFilePath), "utf-8");
}

export function getLabSlideCommandRow(
    file: string,
    config: ConfigJson,
): string | undefined {
    return file.split("\n").find((row) =>
        row.includes(config.stepCommandPrefix)
    );
}

export function getImagesPathFromSlides(
    rootDir: string,
    fileContent: string,
): string[] {
    return fileContent
        .split("\n")
        .filter((row) => row.startsWith("!["))
        .map(extractUrlPart)
        .filter((url) => !url.startsWith("http"))
        .filter(isImageInAssetsDir)
        .map((imgPath) => docsFilePath(rootDir, imgPath));

    function extractUrlPart(imageMdRow: string): string {
        const secondPart = imageMdRow.split("](")[1];
        const urlPart = secondPart?.substring(0, secondPart.lastIndexOf(")"));
        if (urlPart.endsWith("'")) {
            return urlPart.substring(0, urlPart.lastIndexOf(" '"));
        } else {
            return urlPart;
        }
    }
    function isImageInAssetsDir(imagePath: string): boolean {
        return imagePath.startsWith("assets") ||
            imagePath.startsWith("./assets");
    }
}

export function getImagesPathFromFs(
    rootDir: string,
): string[] {
    return fs.readdirSync(docsImagesPath(rootDir), {
        encoding: "utf-8",
        recursive: true,
    }).filter((imagePath) => !isDirectory(docsImagesPath(rootDir), imagePath))
        .filter((imagePath) => !imagePath.includes("sfeir-school-logo.png"))
        .map((imagePath) => docsImagePath(rootDir, imagePath));
}

export function isImageFileExists(imageFilePath: string) {
    return fs.existsSync(imageFilePath);
}
