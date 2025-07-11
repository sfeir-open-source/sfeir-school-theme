import fs from "node:fs";
import { PackageJson } from "./utils/labs.utils";
import { ConfigJson } from "./utils/config.utils";
import { DirStruct } from "./test-utils/project-builder.utils";

export function slideCssFile() {
    return `\n`;
}

export function slideJsFile(slides: string[] = []) {
    return `export function formation() { return ${
        JSON.stringify(slides)
    }.map(path => ({path})) }\n`;
}

export function packageJsonFile(content: Partial<PackageJson> = {}) {
    return JSON.stringify(content);
}

export function configFile(content: Partial<ConfigJson> = {}) {
    return { ".sfeir-theme-config.json": JSON.stringify(content) };
}

export type LabSlideOptions = {
    title?: string;
    steps?: string[];
    cmd?: string;
};

export function labSlideFile(
    { title = "", steps = [], cmd = "" }: LabSlideOptions,
) {
    return `<!-- .slide: class="exercice" -->

# ${title}

## Lab

<br>

${steps.map((step, index) => `${index + 1}. ${step}`)}

### ${cmd}
    `;
}

export function imageFile() {
    return "";
}

export function web_modules() {
    return {
        "web_modules": {
            "sfeir-school-theme": {
                "sfeir-school-theme.css": sfeirSchoolThemeCssFile(),
                "fontello-sfeir": {
                    css: {
                        "sfeir.css": sfeirCssFile(),
                    },
                },
            },
        },
    };
}

export function sfeirSchoolThemeCssFile() {
    return fs.readFileSync("./dist/sfeir-school-theme.css", "utf-8");
}

export function sfeirCssFile() {
    return fs.readFileSync("./dist/fontello-sfeir/css/sfeir.css", "utf-8");
}

export function labReadmeMdFile(name: string) {
    return `# ${name} instructions\nnpm run ${name}`;
}

export function oneLabStructure(name: string, files: DirStruct) {
    return {
        [name]: {
            ...files,
        },
    };
}

export function minimalValidLabStructure(name: string) {
    const readmeMd = `# ${name} instructions\nnpm run ${name}`;
    return {
        ...oneLabStructure(name, {
            "package.json": packageJsonFile({ name }),
            "README.md": labReadmeMdFile(name),
        }),
        ...oneLabStructure(name + "-solution", {
            "package.json": packageJsonFile({ name: name + "-solution" }),
            "README.md": labReadmeMdFile(name),
        }),
    };
}
