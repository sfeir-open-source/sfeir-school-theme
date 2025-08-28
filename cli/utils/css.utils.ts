import { docsFilePath } from "./path.utils";
import fs from "node:fs";

const THEME_CSS_FILES = [
    "web_modules/sfeir-school-theme/dist/sfeir-school-theme.css",
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
    const filePath = docsFilePath(rootDir, cssPath);
    try {
        return fs.readFileSync(filePath, "utf-8");
    } catch {
        throw new Error(`Cannot find: ${filePath}`);
    }
}

export function getCssClassUsedInSlide(fileContent: string): string[] {
    return fileContent.split("\n")
        .map((row) => {
            // for syntax like:
            // <!-- .slide: class="with-code" -->
            // <!-- .slide: class="transition-bg-blue-3 right" -->
            if (row.startsWith("<!--")) {
                const classesPart = row.split('class="')[1];
                return classesPart?.substring(0, classesPart.indexOf('"'));
            }
            const trimmed = row.trimEnd();
            // for syntax like:
            // ![](./assets/images/logo-sfeir-blanc.png 'company')
            if (row.startsWith("![") && trimmed.endsWith("')")) {
                return row.substring(
                    trimmed.lastIndexOf(" '") + 2,
                    trimmed.length - 2,
                );
            }

            return undefined;
        })
        .filter((classes) => classes != undefined)
        .flatMap((classes) => classes.split(" "));
}
