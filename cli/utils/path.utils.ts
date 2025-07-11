import path from "node:path";

export function docsPath(rootDir: string) {
    return path.resolve(rootDir, "docs");
}

export function docsMarkdownPath(rootDir: string) {
    return path.resolve(docsPath(rootDir), "markdown");
}

export function slidePath(rootDir: string, slideFile: string) {
    return path.resolve(docsMarkdownPath(rootDir), slideFile);
}

export function docsFilePath(rootDir: string, assetFile: string) {
    return path.resolve(docsPath(rootDir), assetFile);
}

export function docsImagesPath(rootDir: string) {
    return path.resolve(docsPath(rootDir), "assets", "images");
}

export function docsImagePath(rootDir: string, filePath: string) {
    return path.resolve(docsImagesPath(rootDir), filePath);
}

export function labsPath(rootDir: string) {
    return path.resolve(rootDir, "steps");
}

export function labsDirPackageJsonPath(rootDir: string) {
    return path.resolve(labsPath(rootDir), "package.json");
}

export function labsDirLabsJsonPath(rootDir: string) {
    return path.resolve(labsPath(rootDir), "labs.json");
}

export function projectConfigPath(rootDir: string) {
    return path.resolve(rootDir, ".sfeir-theme-config.json");
}

export function labPackageJsonPath(rootDir: string, lab: string) {
    return path.resolve(labsPath(rootDir), lab, "package.json");
}

export function labReadmePath(rootDir: string, lab: string) {
    return path.resolve(labsPath(rootDir), lab, "README.md");
}
