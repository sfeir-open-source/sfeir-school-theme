import fs from "node:fs";
import { docsFilePath } from "./path.utils";

const THEME_CSS_FILES = [
    "web_modules/sfeir-school-theme/sfeir-school-theme.css",
    "web_modules/sfeir-school-theme/fontello-sfeir/css/sfeir.css",
    "css/slides.css",
];

const OTHER_KNOWN_CSS_CLASSES = [
    ".list-fragment",
    ".transition-bg-sfeir-1",
    ".transition-bg-sfeir-2",
    ".transition-bg-sfeir-3",
];

export function getAllCssContent(rootDir: string, extraCssFiles: string[]) {
    return (THEME_CSS_FILES.concat(extraCssFiles)).map((cssFilePath) =>
        getCssFile(rootDir, cssFilePath)
    ).concat(OTHER_KNOWN_CSS_CLASSES).join("\n\n\n");
}

function getCssFile(rootDir: string, cssPath: string) {
    return fs.readFileSync(docsFilePath(rootDir, cssPath), "utf-8");
}

export function getCssClassUsedInSlide(fileContent: string): string[] {
    return fileContent.split("\n")
        .filter((row) => row.startsWith("<!--"))
        .map((row) => {
            const classesPart = row.split('class="')[1];
            return classesPart?.substring(0, classesPart.indexOf('"'));
        })
        .filter((classes) => classes != undefined)
        .flatMap((classes) => classes.split(" "));
}
